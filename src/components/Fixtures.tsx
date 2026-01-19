import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMemo, useEffect, useCallback } from 'react';
import type { Match } from '../types';

type FilterTab = 'fixtures' | 'results' | 'all';

interface FixturesProps {
  matches: Match[];
  loading: boolean;
}

const SCROLL_KEY = 'fixtures-scroll-position';

export function Fixtures({ matches, loading }: FixturesProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get active tab from URL or default to 'fixtures'
  const activeTab = (searchParams.get('tab') as FilterTab) || 'fixtures';
  
  const setActiveTab = useCallback((tab: FilterTab) => {
    setSearchParams({ tab }, { replace: true });
    // Reset scroll position when changing tabs
    sessionStorage.removeItem(SCROLL_KEY);
  }, [setSearchParams]);

  // Get today's date in local timezone (YYYY-MM-DD format)
  const today = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  // Filter matches based on active tab
  const filteredMatches = useMemo(() => {
    switch (activeTab) {
      case 'fixtures':
        // Show matches from today onwards, limit to reasonable amount
        return matches
          .filter(m => m.date >= today || m.status === 'live')
          .slice(0, 30);
      case 'results':
        // Show past completed matches, most recent first
        return matches
          .filter(m => m.date < today && m.status === 'completed')
          .reverse()
          .slice(0, 30);
      case 'all':
        return matches;
      default:
        return matches;
    }
  }, [matches, activeTab, today]);

  // Group matches by date
  const groupedMatches = useMemo(() => {
    const groups: { date: string; matches: Match[] }[] = [];
    let currentDate = '';
    
    // For results tab, matches are reversed so we need to handle grouping properly
    const matchesToGroup = activeTab === 'results' 
      ? [...filteredMatches] // Already reversed in filteredMatches
      : filteredMatches;
    
    for (const match of matchesToGroup) {
      if (match.date !== currentDate) {
        currentDate = match.date;
        groups.push({ date: currentDate, matches: [match] });
      } else {
        groups[groups.length - 1].matches.push(match);
      }
    }
    
    return groups;
  }, [filteredMatches, activeTab]);

  // Count for tab badges
  const counts = useMemo(() => {
    const fixturesCount = matches.filter(m => m.date >= today || m.status === 'live').length;
    const resultsCount = matches.filter(m => m.date < today && m.status === 'completed').length;
    return { fixtures: fixturesCount, results: resultsCount, all: matches.length };
  }, [matches, today]);

  // Restore scroll position when returning to page
  useEffect(() => {
    if (!loading && matches.length > 0) {
      const savedPosition = sessionStorage.getItem(SCROLL_KEY);
      if (savedPosition) {
        // Small delay to ensure content is rendered
        setTimeout(() => {
          window.scrollTo(0, parseInt(savedPosition, 10));
        }, 50);
      }
    }
  }, [loading, matches.length]);

  // Save scroll position before navigating away
  const handleMatchClick = (matchId: string) => {
    sessionStorage.setItem(SCROLL_KEY, window.scrollY.toString());
    navigate(`/match/${matchId}`);
  };

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

  // Helper to format date as YYYY-MM-DD in local timezone
  const toLocalDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00'); // Parse as noon to avoid timezone edge cases
    const todayDate = new Date();
    const tomorrow = new Date(todayDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(todayDate);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const dateOnly = dateStr;
    const todayStr = toLocalDateString(todayDate);
    const tomorrowStr = toLocalDateString(tomorrow);
    const yesterdayStr = toLocalDateString(yesterday);
    
    if (dateOnly === todayStr) return 'Today';
    if (dateOnly === tomorrowStr) return 'Tomorrow';
    if (dateOnly === yesterdayStr) return 'Yesterday';
    
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: date.getFullYear() !== todayDate.getFullYear() ? 'numeric' : undefined,
    });
  };

  const formatTime = (time: string) => {
    return time || 'TBC';
  };

  const isToday = (dateStr: string) => {
    return dateStr === today;
  };

  const isPast = (dateStr: string) => {
    return dateStr < today;
  };

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'fixtures', label: 'Fixtures', count: counts.fixtures },
    { key: 'results', label: 'Results', count: counts.results },
    { key: 'all', label: 'All', count: counts.all },
  ];

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
            <span className={`ml-1.5 text-xs ${
              activeTab === tab.key ? 'text-orange-400' : 'text-gray-400'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Empty state for filtered view */}
      {filteredMatches.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {activeTab === 'fixtures' && 'No upcoming fixtures'}
          {activeTab === 'results' && 'No results yet'}
          {activeTab === 'all' && 'No fixtures available'}
        </div>
      )}

      {/* Matches grouped by date */}
      <div className="space-y-6">
        {groupedMatches.map((group) => (
          <div key={group.date}>
            {/* Date Header */}
            <div className={`py-2 px-1 -mx-1 rounded ${
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

      {/* Load more hint for 'all' tab */}
      {activeTab === 'all' && matches.length > 50 && (
        <div className="text-center py-4 text-xs text-gray-400">
          Showing all {matches.length} fixtures
        </div>
      )}
    </div>
  );
}
