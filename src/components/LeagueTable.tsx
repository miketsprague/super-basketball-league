import type { StandingsEntry } from '../types';

interface LeagueTableProps {
  standings: StandingsEntry[];
  loading: boolean;
}

export function LeagueTable({ standings, loading }: LeagueTableProps) {
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
        No standings available
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
                idx < 4 ? 'bg-green-50' : idx >= standings.length - 2 ? 'bg-red-50' : 'bg-white'
              }`}
            >
              <td className="py-3 px-2 font-medium text-gray-600">{entry.position}</td>
              <td className="py-3 px-2">
                <span className="font-medium text-gray-900">{entry.team.shortName}</span>
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
      <div className="mt-4 text-xs text-gray-500 px-2">
        <span className="inline-block w-3 h-3 bg-green-50 border mr-1"></span> Playoff positions
        <span className="inline-block w-3 h-3 bg-red-50 border ml-4 mr-1"></span> Relegation zone
      </div>
    </div>
  );
}
