import type { Match } from '../types';

interface FixturesProps {
  matches: Match[];
  loading: boolean;
}

export function Fixtures({ matches, loading }: FixturesProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No fixtures available
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <div
          key={match.id}
          className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500"
        >
          <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
            <span>{formatDate(match.date)} • {match.time}</span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
              match.status === 'live' 
                ? 'bg-red-100 text-red-700' 
                : match.status === 'completed'
                ? 'bg-gray-100 text-gray-600'
                : 'bg-green-100 text-green-700'
            }`}>
              {match.status === 'live' ? 'LIVE' : match.status === 'completed' ? 'FT' : 'Upcoming'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{match.homeTeam.shortName}</span>
                <span className="text-xl font-bold text-gray-900">
                  {match.homeScore ?? '-'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{match.awayTeam.shortName}</span>
                <span className="text-xl font-bold text-gray-900">
                  {match.awayScore ?? '-'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-xs text-gray-400 mt-2">{match.venue}</div>
        </div>
      ))}
    </div>
  );
}
