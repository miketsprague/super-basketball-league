import { useNavigate } from 'react-router-dom';
import type { StandingsEntry } from '../types';

interface LeagueTableProps {
  standings: StandingsEntry[];
  loading: boolean;
  /** Number of top positions highlighted as playoff/promotion zone (default: 4). Set to 0 to disable. */
  playoffPositions?: number;
  /** Number of bottom positions highlighted as relegation zone (default: 2). Set to 0 to disable. */
  relegationPositions?: number;
}

export function LeagueTable({ standings, loading, playoffPositions = 4, relegationPositions = 2 }: LeagueTableProps) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (standings.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg mb-2">No standings available</p>
        <p className="text-sm">This competition may have progressed beyond the group stage.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-800 text-white text-xs">
            <th className="py-3 px-2 text-left w-8">#</th>
            <th className="py-3 px-2 text-left">Team</th>
            <th className="py-3 px-2 text-center w-8">P</th>
            <th className="py-3 px-2 text-center w-8">W</th>
            <th className="py-3 px-2 text-center w-8">L</th>
            <th className="py-3 px-2 text-center w-12 hidden sm:table-cell">+/-</th>
            <th className="py-3 px-2 text-center w-10 font-bold">Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((entry, idx) => (
            <tr
              key={entry.team.id}
              className={`border-b border-gray-100 ${
                playoffPositions > 0 && idx < playoffPositions
                  ? 'bg-green-50'
                  : relegationPositions > 0 && idx >= standings.length - relegationPositions
                  ? 'bg-red-50'
                  : 'bg-white'
              }`}
            >
              <td className="py-3 px-2 font-medium text-gray-600">{entry.position}</td>
              <td className="py-3 px-2">
                <button
                  onClick={() => navigate(`/team/${encodeURIComponent(entry.team.name)}`)}
                  className="font-medium text-gray-900 hover:text-orange-600 transition-colors text-left"
                >
                  {entry.team.shortName}
                </button>
              </td>
              <td className="py-3 px-2 text-center text-gray-600">{entry.played}</td>
              <td className="py-3 px-2 text-center text-gray-600">{entry.won}</td>
              <td className="py-3 px-2 text-center text-gray-600">{entry.lost}</td>
              <td className="py-3 px-2 text-center text-gray-600 hidden sm:table-cell">
                {entry.pointsDifference > 0 ? '+' : ''}{entry.pointsDifference}
              </td>
              <td className="py-3 px-2 text-center font-bold text-orange-600">{entry.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 text-xs text-gray-500 px-2 flex flex-wrap gap-x-4 gap-y-1">
        {playoffPositions > 0 && (
          <span>
            <span className="inline-block w-3 h-3 bg-green-50 border mr-1"></span>
            Playoff positions (top {playoffPositions})
          </span>
        )}
        {relegationPositions > 0 && (
          <span>
            <span className="inline-block w-3 h-3 bg-red-50 border mr-1"></span>
            Relegation zone (bottom {relegationPositions})
          </span>
        )}
      </div>
    </div>
  );
}
