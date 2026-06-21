import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { Match } from '../types';
import { fetchMatchesForTeam } from '../services/dataProvider';
import { getFollowedTeam, setFollowedTeam, clearFollowedTeam, computeScoringAverage } from '../services/teamStorage';
import { Fixtures } from './Fixtures';

export function TeamView() {
  const { teamName } = useParams<{ teamName: string }>();
  const navigate = useNavigate();
  const decodedTeamName = teamName ? decodeURIComponent(teamName) : '';

  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const scoringAvg = useMemo(
    () => (matches.length > 0 ? computeScoringAverage(matches, decodedTeamName) : null),
    [matches, decodedTeamName],
  );

  // Check if this team is the followed team
  useEffect(() => {
    const followed = getFollowedTeam();
    setIsFollowing(followed?.name === decodedTeamName);
  }, [decodedTeamName]);

  const loadTeamMatches = useCallback(async () => {
    if (!decodedTeamName) return;

    setLoading(true);
    setError(null);
    try {
      const teamMatches = await fetchMatchesForTeam(decodedTeamName);
      setMatches(teamMatches);
    } catch {
      setError('Unable to load fixtures for this team');
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }, [decodedTeamName]);

  useEffect(() => {
    loadTeamMatches();

    // Auto-refresh every 5 minutes
    const interval = setInterval(loadTeamMatches, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadTeamMatches]);

  const handleFollow = () => {
    if (isFollowing) {
      clearFollowedTeam();
      setIsFollowing(false);
    } else {
      setFollowedTeam({ name: decodedTeamName });
      setIsFollowing(true);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!decodedTeamName) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-gray-900 text-white py-4 px-4">
          <Link to="/" className="flex items-center text-sm hover:text-orange-400">
            <span className="mr-2">←</span> Back to Fixtures
          </Link>
        </header>
        <div className="max-w-lg mx-auto p-4">
          <p className="text-gray-500 text-center py-12">No team selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-900 text-white py-3 px-4 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <button onClick={handleBack} className="flex items-center text-sm hover:text-orange-400 transition-colors">
            <span className="mr-2">←</span> Back
          </button>
          <button
            onClick={handleFollow}
            className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full transition-colors ${
              isFollowing
                ? 'bg-orange-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <span>{isFollowing ? '★' : '☆'}</span>
            <span>{isFollowing ? 'Following' : 'Follow'}</span>
          </button>
        </div>
      </header>

      {/* Team Name Banner */}
      <div className="bg-gray-800 text-white py-4 px-4 text-center border-t border-gray-700">
        <h1 className="text-lg font-bold">{decodedTeamName}</h1>
        <p className="text-xs text-gray-400 mt-1">All fixtures across all leagues</p>
      </div>

      {/* Scoring Averages */}
      {scoringAvg && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-lg mx-auto px-4 py-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide text-center mb-2">
              Season Scoring Average ({scoringAvg.gamesPlayed} games)
            </p>
            <div className="flex justify-around text-center">
              <div>
                <div className="text-2xl font-bold text-orange-600">{scoringAvg.avgPointsFor}</div>
                <div className="text-xs text-gray-500 mt-0.5">Pts For</div>
              </div>
              <div className="w-px bg-gray-200 self-stretch my-1"></div>
              <div>
                <div className="text-2xl font-bold text-gray-600">{scoringAvg.avgPointsAgainst}</div>
                <div className="text-xs text-gray-500 mt-0.5">Pts Against</div>
              </div>
              <div className="w-px bg-gray-200 self-stretch my-1"></div>
              <div>
                <div className={`text-2xl font-bold ${
                  scoringAvg.avgPointsFor > scoringAvg.avgPointsAgainst
                    ? 'text-green-600'
                    : scoringAvg.avgPointsFor < scoringAvg.avgPointsAgainst
                    ? 'text-red-500'
                    : 'text-gray-600'
                }`}>
                  {scoringAvg.avgPointsFor > scoringAvg.avgPointsAgainst ? '+' : ''}
                  {Math.round((scoringAvg.avgPointsFor - scoringAvg.avgPointsAgainst) * 10) / 10}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">Avg Diff</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-lg mx-auto p-4">
        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
            <button
              onClick={loadTeamMatches}
              className="mt-3 w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        ) : (
          <Fixtures matches={matches} loading={loading} showLeagueName />
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 py-4">
        Basketball Leagues © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
