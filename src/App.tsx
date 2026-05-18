import { useState, useEffect, useCallback, useMemo } from 'react';
import { Routes, Route, useSearchParams } from 'react-router-dom';
import { Fixtures } from './components/Fixtures';
import { LeagueTable } from './components/LeagueTable';
import { MatchDetail } from './components/MatchDetail';
import { LeagueSelector } from './components/LeagueSelector';
import { TeamView } from './components/TeamView';
import type { Match, StandingsEntry, League } from './types';
import { fetchAllData, fetchLeagues, APIError } from './services/dataProvider';
import { DEFAULT_LEAGUE, predefinedLeagues, getLeagueConfig } from './services/leagues';
import { getFollowedTeam } from './services/teamStorage';

// Helper function to extract detailed error message
function getErrorMessage(error: unknown): string {
  if (error instanceof APIError) {
    const statusInfo = error.statusCode ? ` (Status: ${error.statusCode})` : '';
    return `${error.message}${statusInfo}`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

type Tab = 'fixtures' | 'table';

const LEAGUE_PARAM = 'league';
const POLL_INTERVAL_NORMAL = 5 * 60 * 1000; // 5 minutes
const POLL_INTERVAL_LIVE   = 30 * 1000;      // 30 seconds when live matches are on

function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>('fixtures');
  const [matches, setMatches] = useState<Match[]>([]);
  const [standings, setStandings] = useState<StandingsEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // League state
  const [leagues, setLeagues] = useState<League[]>(predefinedLeagues);
  const [leaguesLoading, setLeaguesLoading] = useState(true);
  const [leaguesError, setLeaguesError] = useState<string | null>(null);

  // Followed team
  const followedTeam = getFollowedTeam();

  // Get selected league from URL params, falling back to default
  const getSelectedLeague = useCallback((): League => {
    const leagueId = searchParams.get(LEAGUE_PARAM);
    if (leagueId) {
      const found = leagues.find(l => l.id === leagueId);
      if (found) return found;
    }
    return DEFAULT_LEAGUE;
  }, [searchParams, leagues]);

  const selectedLeague = getSelectedLeague();

  // Check if selected league supports standings
  const leagueHasStandings = getLeagueConfig(selectedLeague.id)?.hasStandings !== false;

  // Auto-switch to fixtures tab when league doesn't support standings
  useEffect(() => {
    if (!leagueHasStandings && activeTab === 'table') {
      setActiveTab('fixtures');
    }
  }, [leagueHasStandings, activeTab]);

  // Fetch available leagues on mount
  useEffect(() => {
    const loadLeagues = async () => {
      setLeaguesLoading(true);
      setLeaguesError(null);
      try {
        const availableLeagues = await fetchLeagues();
        setLeagues(availableLeagues);
      } catch (error) {
        console.error('Failed to fetch leagues:', error);
        const errorDetail = getErrorMessage(error);
        setLeaguesError(`Failed to load leagues: ${errorDetail}. Using default options.`);
        // Keep using predefinedLeagues as fallback
      } finally {
        setLeaguesLoading(false);
      }
    };

    loadLeagues();
  }, []);

  // Fetch data for the selected league
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllData(selectedLeague.id);
      setMatches(data.matches);
      setStandings(data.standings);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      const errorDetail = getErrorMessage(error);
      setError(`Unable to load data: ${errorDetail}`);
      setMatches([]);
      setStandings([]);
    } finally {
      setLoading(false);
    }
  }, [selectedLeague]);

  // Initial fetch when league changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Adaptive polling: refresh every 30 s when live matches are on, otherwise every 5 min
  const hasLiveMatches = useMemo(() => matches.some(m => m.status === 'live'), [matches]);

  useEffect(() => {
    const pollInterval = hasLiveMatches ? POLL_INTERVAL_LIVE : POLL_INTERVAL_NORMAL;
    const interval = setInterval(fetchData, pollInterval);
    return () => clearInterval(interval);
  }, [hasLiveMatches, fetchData]);

  const handleLeagueChange = (league: League) => {
    // Update URL params to persist league selection
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set(LEAGUE_PARAM, league.id);
      return newParams;
    }, { replace: true });
  };

  const handleRetry = () => {
    fetchData();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-900 text-white py-4 px-4 shadow-lg">
        <h1 className="text-xl font-bold text-center">
          🏀 Basketball Leagues
        </h1>
      </header>

      {/* League Selector */}
      <LeagueSelector
        leagues={leagues}
        selectedLeague={selectedLeague}
        onLeagueChange={handleLeagueChange}
        loading={leaguesLoading}
        followedTeamName={followedTeam?.name}
      />

      {/* Tab Navigation */}
      <nav className="bg-white shadow sticky top-0 z-10">
        <div className="flex">
          <button
            onClick={() => setActiveTab('fixtures')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'fixtures'
                ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Fixtures & Results
          </button>
          {leagueHasStandings && (
            <button
              onClick={() => setActiveTab('table')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'table'
                  ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              League Table
            </button>
          )}
        </div>
      </nav>

      {/* Live-refresh notice */}
      {hasLiveMatches && (
        <div
          role="status"
          aria-live="polite"
          className="bg-red-50 border-b border-red-100 text-red-700 text-xs text-center py-1 px-4"
        >
          🔴 Live matches in progress — refreshing every 30 s
        </div>
      )}

      {/* Leagues error banner (non-blocking) */}
      {leaguesError && (
        <div className="bg-yellow-50 border-b border-yellow-200 text-yellow-800 px-4 py-2 text-sm text-center">
          {leaguesError}
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-lg mx-auto p-4">
        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <div className="flex items-center justify-between">
              <p>{error}</p>
            </div>
            <button
              onClick={handleRetry}
              className="mt-3 w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        ) : activeTab === 'fixtures' ? (
          <Fixtures matches={matches} loading={loading} />
        ) : (
          <LeagueTable standings={standings} loading={loading} />
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 py-4">
        Basketball Leagues © {new Date().getFullYear()}
      </footer>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/match/:matchId" element={<MatchDetail />} />
      <Route path="/team/:teamName" element={<TeamView />} />
    </Routes>
  );
}

export default App;
