import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Fixtures } from './components/Fixtures';
import { LeagueTable } from './components/LeagueTable';
import { MatchDetail } from './components/MatchDetail';
import { LeagueSelector } from './components/LeagueSelector';
import type { Match, StandingsEntry, League } from './types';
import { fetchAllData, fetchLeagues } from './services/dataProvider';
import { DEFAULT_LEAGUE, predefinedLeagues } from './services/leagues';

type Tab = 'fixtures' | 'table';

function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>('fixtures');
  const [matches, setMatches] = useState<Match[]>([]);
  const [standings, setStandings] = useState<StandingsEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // League state
  const [leagues, setLeagues] = useState<League[]>(predefinedLeagues);
  const [selectedLeague, setSelectedLeague] = useState<League>(DEFAULT_LEAGUE);
  const [leaguesLoading, setLeaguesLoading] = useState(true);
  const [leaguesError, setLeaguesError] = useState<string | null>(null);

  // Fetch available leagues on mount
  useEffect(() => {
    const loadLeagues = async () => {
      setLeaguesLoading(true);
      setLeaguesError(null);
      try {
        const availableLeagues = await fetchLeagues();
        setLeagues(availableLeagues);
        // Set the first league as selected if default league is not in the list
        const hasDefaultLeague = availableLeagues.some(l => l.id === DEFAULT_LEAGUE.id);
        if (availableLeagues.length > 0 && !hasDefaultLeague) {
          setSelectedLeague(availableLeagues[0]);
        }
      } catch (error) {
        console.error('Failed to fetch leagues:', error);
        setLeaguesError('Failed to load leagues. Using default options.');
        // Keep using predefinedLeagues as fallback
      } finally {
        setLeaguesLoading(false);
      }
    };

    loadLeagues();
  }, []);

  // Fetch data when selected league changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAllData(selectedLeague.id);
        setMatches(data.matches);
        setStandings(data.standings);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Unable to load data. Please check your connection and try again.');
        setMatches([]);
        setStandings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Optional: Auto-refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedLeague]);

  const handleLeagueChange = (league: League) => {
    setSelectedLeague(league);
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    fetchAllData(selectedLeague.id)
      .then(data => {
        setMatches(data.matches);
        setStandings(data.standings);
      })
      .catch(err => {
        console.error('Retry failed:', err);
        setError('Unable to load data. Please check your connection and try again.');
      })
      .finally(() => setLoading(false));
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
        </div>
      </nav>

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
    </Routes>
  );
}

export default App;
