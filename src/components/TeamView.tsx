import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { Match } from '../types';
import { fetchMatchesForTeam } from '../services/dataProvider';
import { getFollowedTeam, setFollowedTeam, clearFollowedTeam } from '../services/teamStorage';
import { generateICalContent, downloadCalendar } from '../utils/calendarExport';
import { Fixtures } from './Fixtures';

export function TeamView() {
  const { teamName } = useParams<{ teamName: string }>();
  const navigate = useNavigate();
  const decodedTeamName = teamName ? decodeURIComponent(teamName) : '';

  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

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

  const handleExportCalendar = () => {
    const icsContent = generateICalContent(matches, decodedTeamName);
    const safeName = decodedTeamName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    downloadCalendar(icsContent, `${safeName}-fixtures.ics`);
  };

  const upcomingCount = matches.filter((m) => m.status === 'scheduled').length;

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
        {!loading && upcomingCount > 0 && (
          <button
            onClick={handleExportCalendar}
            className="mt-3 inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
            aria-label={`Export ${upcomingCount} upcoming fixture${upcomingCount === 1 ? '' : 's'} to calendar`}
          >
            <span aria-hidden="true">📅</span>
            <span>
              Export {upcomingCount} fixture{upcomingCount === 1 ? '' : 's'} to calendar
            </span>
          </button>
        )}
      </div>

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
