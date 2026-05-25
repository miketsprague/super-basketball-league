import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import type { StandingsEntry } from '../types';

type SortColumn = 'position' | 'won' | 'lost' | 'pointsDifference' | 'points';
type SortDirection = 'asc' | 'desc';

interface LeagueTableProps {
  standings: StandingsEntry[];
  loading: boolean;
}

function SortIndicator({ column, sortColumn, sortDirection }: {
  column: SortColumn;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}) {
  if (column !== sortColumn) {
    return <span className="ml-1 opacity-30 text-[10px]">⇅</span>;
  }
  return (
    <span className="ml-1 text-orange-300 text-[10px]">
      {sortDirection === 'desc' ? '▼' : '▲'}
    </span>
  );
}

export function LeagueTable({ standings, loading }: LeagueTableProps) {
  const navigate = useNavigate();
  const [sortColumn, setSortColumn] = useState<SortColumn>('position');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  function handleSort(column: SortColumn) {
    if (column === sortColumn) {
      setSortDirection(d => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortColumn(column);
      // For position/lost: lower is better → default asc; for won/pd/pts: higher is better → default desc
      setSortDirection(column === 'position' || column === 'lost' ? 'asc' : 'desc');
    }
  }

  const sortedStandings = useMemo(() => {
    if (sortColumn === 'position' && sortDirection === 'asc') return standings;
    return [...standings].sort((a, b) => {
      let aVal: number;
      let bVal: number;
      switch (sortColumn) {
        case 'won':           aVal = a.won;              bVal = b.won;              break;
        case 'lost':          aVal = a.lost;             bVal = b.lost;             break;
        case 'pointsDifference': aVal = a.pointsDifference; bVal = b.pointsDifference; break;
        case 'points':        aVal = a.points;           bVal = b.points;           break;
        default:              aVal = a.position;         bVal = b.position;         break;
      }
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [standings, sortColumn, sortDirection]);

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

  function thButton(column: SortColumn, label: string) {
    const isActive = sortColumn === column;
    return (
      <button
        onClick={() => handleSort(column)}
        className={`w-full flex items-center justify-center hover:text-orange-300 transition-colors ${isActive ? 'text-orange-300' : ''}`}
        aria-label={`Sort by ${label}`}
        aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
      >
        {label}
        <SortIndicator column={column} sortColumn={sortColumn} sortDirection={sortDirection} />
      </button>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-800 text-white text-xs select-none">
            <th className="py-3 px-2 text-left w-8">
              <button
                onClick={() => handleSort('position')}
                className={`hover:text-orange-300 transition-colors ${sortColumn === 'position' ? 'text-orange-300' : ''}`}
                aria-label="Sort by position"
                aria-sort={sortColumn === 'position' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                #
                <SortIndicator column="position" sortColumn={sortColumn} sortDirection={sortDirection} />
              </button>
            </th>
            <th className="py-3 px-2 text-left">Team</th>
            <th className="py-3 px-2 text-center w-8">P</th>
            <th className="py-3 px-2 text-center w-8">{thButton('won', 'W')}</th>
            <th className="py-3 px-2 text-center w-8">{thButton('lost', 'L')}</th>
            <th className="py-3 px-2 text-center w-12 hidden sm:table-cell">{thButton('pointsDifference', '+/-')}</th>
            <th className="py-3 px-2 text-center w-10 font-bold">{thButton('points', 'Pts')}</th>
          </tr>
        </thead>
        <tbody>
          {sortedStandings.map((entry, idx) => (
            <tr
              key={entry.team.id}
              className={`border-b border-gray-100 ${
                idx < 4 ? 'bg-green-50' : idx >= standings.length - 2 ? 'bg-red-50' : 'bg-white'
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
      <div className="mt-4 text-xs text-gray-500 px-2">
        <span className="inline-block w-3 h-3 bg-green-50 border mr-1"></span> Playoff positions
        <span className="inline-block w-3 h-3 bg-red-50 border ml-4 mr-1"></span> Relegation zone
      </div>
    </div>
  );
}
