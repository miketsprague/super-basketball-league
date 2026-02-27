import { useNavigate } from 'react-router-dom';
import type { League } from '../types';

interface LeagueSelectorProps {
  leagues: League[];
  selectedLeague: League;
  onLeagueChange: (league: League) => void;
  loading?: boolean;
  followedTeamName?: string | null;
}

export function LeagueSelector({ leagues, selectedLeague, onLeagueChange, loading, followedTeamName }: LeagueSelectorProps) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex gap-2 overflow-x-auto px-4 py-3 bg-gray-800">
        {[1, 2].map((i) => (
          <div 
            key={i}
            className="h-8 w-24 bg-gray-700 rounded-full animate-pulse flex-shrink-0"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border-t border-gray-700">
      <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
        {followedTeamName && (
          <button
            onClick={() => navigate(`/team/${encodeURIComponent(followedTeamName)}`)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 bg-gray-700 text-orange-400 hover:bg-gray-600 hover:text-orange-300 border border-orange-500/30"
          >
            <span className="text-base">★</span>
            <span>My Team</span>
          </button>
        )}
        {leagues.map((league) => {
          const isSelected = league.id === selectedLeague.id;
          return (
            <button
              key={league.id}
              onClick={() => onLeagueChange(league)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                isSelected
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
              }`}
            >
              <span className="text-base">🏀</span>
              <span>{league.shortName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
