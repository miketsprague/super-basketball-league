import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useMemo } from 'react';
import type { Match } from '../types';

interface FixturesProps {
  matches: Match[];
  loading: boolean;
}

export function Fixtures({ matches, loading }: FixturesProps) {
  const navigate = useNavigate();
  const todayRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Group matches by date
  const groupedMatches = useMemo(() => {
    const groups: { date: string; matches: Match[] }[] = [];
    let currentDate = '';
    
    for (const match of matches) {
      if (match.date !== currentDate) {
        currentDate = match.date;
        groups.push({ date: currentDate, matches: [match] });
      } else {
        groups[groups.length - 1].matches.push(match);
      }
    }
    
    return groups;
  }, [matches]);

  // Find the index of today's group (or the nearest upcoming date)
  const todayIndex = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    
    // First try to find exact today
    let index = groupedMatches.findIndex(g => g.date === today);
    if (index !== -1) return index;
    
    // Otherwise find the first upcoming date
    index = groupedMatches.findIndex(g => g.date >= today);
    if (index !== -1) return index;
    
    // If all dates are in the past, return the last one
    return groupedMatches.length - 1;
  }, [groupedMatches]);

  // Auto-scroll to today/nearest date after loading
  useEffect(() => {
    if (!loading && todayRef.current) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        todayRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [loading, todayIndex]);

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

  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const dateOnly = dateStr;
    const todayStr = today.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (dateOnly === todayStr) return 'Today';
    if (dateOnly === tomorrowStr) return 'Tomorrow';
    if (dateOnly === yesterdayStr) return 'Yesterday';
    
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    });
  };

  const formatTime = (time: string) => {
    return time || 'TBC';
  };

  const handleMatchClick = (matchId: string) => {
    navigate(`/match/${matchId}`);
  };

  const isToday = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateStr === today;
  };

  const isPast = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateStr < today;
  };

  return (
    <div ref={scrollContainerRef} className="space-y-6">
      {groupedMatches.map((group, groupIndex) => (
        <div 
          key={group.date} 
          ref={groupIndex === todayIndex ? todayRef : undefined}
        >
          {/* Date Header */}
          <div className={`sticky top-0 z-10 py-2 px-1 -mx-1 ${
            isToday(group.date) 
              ? 'bg-orange-50' 
              : isPast(group.date)
              ? 'bg-gray-50'
              : 'bg-green-50'
          }`}>
            <h3 className={`text-sm font-semibold ${
              isToday(group.date)
                ? 'text-orange-700'
                : isPast(group.date)
                ? 'text-gray-600'
                : 'text-green-700'
            }`}>
              {formatDateHeader(group.date)}
              <span className="ml-2 text-xs font-normal opacity-75">
                ({group.matches.length} {group.matches.length === 1 ? 'match' : 'matches'})
              </span>
            </h3>
          </div>

          {/* Matches for this date */}
          <div className="space-y-3 mt-2">
            {group.matches.map((match) => (
              <button
                key={match.id}
                onClick={() => handleMatchClick(match.id)}
                className={`w-full text-left bg-white rounded-lg shadow p-4 border-l-4 hover:shadow-md transition-all cursor-pointer ${
                  match.status === 'live'
                    ? 'border-red-500 hover:border-red-600'
                    : match.status === 'completed'
                    ? 'border-gray-400 hover:border-gray-500'
                    : 'border-orange-500 hover:border-orange-600'
                }`}
              >
                <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                  <span>{formatTime(match.time)}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    match.status === 'live' 
                      ? 'bg-red-100 text-red-700 animate-pulse' 
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
                      <div className="flex items-center gap-2">
                        {match.homeTeam.logo && (
                          <img 
                            src={match.homeTeam.logo} 
                            alt="" 
                            className="w-6 h-6 object-contain"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        )}
                        <span className="font-medium text-gray-900">{match.homeTeam.shortName}</span>
                      </div>
                      <span className={`text-xl font-bold ${
                        match.status === 'completed' ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {match.homeScore ?? '-'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {match.awayTeam.logo && (
                          <img 
                            src={match.awayTeam.logo} 
                            alt="" 
                            className="w-6 h-6 object-contain"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        )}
                        <span className="font-medium text-gray-900">{match.awayTeam.shortName}</span>
                      </div>
                      <span className={`text-xl font-bold ${
                        match.status === 'completed' ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {match.awayScore ?? '-'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {match.venue && match.venue !== 'TBC' && (
                  <div className="text-xs text-gray-400 mt-2 flex justify-between items-center">
                    <span className="truncate max-w-[70%]">{match.venue}</span>
                    <span className="text-orange-500 flex-shrink-0">View details →</span>
                  </div>
                )}
                {(!match.venue || match.venue === 'TBC') && (
                  <div className="text-xs text-gray-400 mt-2 text-right">
                    <span className="text-orange-500">View details →</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
