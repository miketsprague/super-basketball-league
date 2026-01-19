import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { MatchDetails, TeamStatistics } from '../types';
import { fetchMatchDetails } from '../services/dataProvider';

const LIVE_POLL_INTERVAL = 30000; // 30 seconds

function MatchDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-gray-900 text-white py-4 px-4">
        <div className="h-6 bg-gray-700 rounded w-32 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-48"></div>
      </div>
      
      {/* Score Skeleton */}
      <div className="bg-white p-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-24"></div>
          <div className="h-12 bg-gray-200 rounded w-32"></div>
          <div className="h-8 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
      
      {/* Quarter Scores Skeleton */}
      <div className="bg-white mt-2 p-4">
        <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
      
      {/* Stats Skeleton */}
      <div className="bg-white mt-2 p-4">
        <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface StatBarProps {
  label: string;
  homeValue: number;
  awayValue: number;
  isPercentage?: boolean;
}

function StatBar({ label, homeValue, awayValue, isPercentage = false }: StatBarProps) {
  const total = homeValue + awayValue;
  // Handle zero division - show 50/50 split when both values are 0
  const homePercent = total === 0 ? 50 : (homeValue / total) * 100;
  const displayHome = isPercentage ? `${homeValue}%` : homeValue;
  const displayAway = isPercentage ? `${awayValue}%` : awayValue;
  
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium">{displayHome}</span>
        <span className="text-gray-500 text-xs">{label}</span>
        <span className="font-medium">{displayAway}</span>
      </div>
      <div className="flex h-2 bg-gray-200 rounded overflow-hidden">
        <div 
          className="bg-orange-500 transition-all duration-300" 
          style={{ width: `${homePercent}%` }}
        ></div>
        <div 
          className="bg-gray-400 transition-all duration-300" 
          style={{ width: `${100 - homePercent}%` }}
        ></div>
      </div>
    </div>
  );
}

interface TeamStatsComparisonProps {
  homeStats: TeamStatistics;
  awayStats: TeamStatistics;
}

function TeamStatsComparison({ homeStats, awayStats }: TeamStatsComparisonProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mt-4">
      <h3 className="font-semibold text-gray-900 mb-4">Team Statistics</h3>
      <StatBar label="Field Goal %" homeValue={homeStats.fieldGoalPct} awayValue={awayStats.fieldGoalPct} isPercentage />
      <StatBar label="3-Point %" homeValue={homeStats.threePointPct} awayValue={awayStats.threePointPct} isPercentage />
      <StatBar label="Free Throw %" homeValue={homeStats.freeThrowPct} awayValue={awayStats.freeThrowPct} isPercentage />
      <StatBar label="Rebounds" homeValue={homeStats.rebounds} awayValue={awayStats.rebounds} />
      <StatBar label="Assists" homeValue={homeStats.assists} awayValue={awayStats.assists} />
      <StatBar label="Turnovers" homeValue={homeStats.turnovers} awayValue={awayStats.turnovers} />
      <StatBar label="Steals" homeValue={homeStats.steals} awayValue={awayStats.steals} />
      <StatBar label="Blocks" homeValue={homeStats.blocks} awayValue={awayStats.blocks} />
    </div>
  );
}

export function MatchDetail() {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const [match, setMatch] = useState<MatchDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadMatchDetails = useCallback(async (showLoading = true) => {
    if (!matchId) return;
    
    if (showLoading) setLoading(true);
    setError(null);
    
    try {
      const details = await fetchMatchDetails(matchId);
      if (details) {
        setMatch(details);
        setLastUpdated(new Date());
      } else {
        setError('Match not found');
      }
    } catch {
      setError('Failed to load match details');
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  // Initial load
  useEffect(() => {
    loadMatchDetails();
  }, [loadMatchDetails]);

  // Live polling for in-progress matches
  useEffect(() => {
    if (!match || match.status !== 'live') return;
    
    const interval = setInterval(() => {
      loadMatchDetails(false);
    }, LIVE_POLL_INTERVAL);
    
    return () => clearInterval(interval);
  }, [match, loadMatchDetails]);

  const handleRefresh = () => {
    loadMatchDetails();
  };

  const handleBack = () => {
    navigate('/');
  };

  if (loading) {
    return <MatchDetailSkeleton />;
  }

  if (error || !match) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-gray-900 text-white py-4 px-4">
          <button onClick={handleBack} className="flex items-center text-sm hover:text-orange-400">
            <span className="mr-2">←</span> Back to Fixtures
          </button>
        </header>
        <div className="max-w-lg mx-auto p-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p>{error || 'Match not found'}</p>
            <button 
              onClick={handleRefresh}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    // Parse as noon local time to avoid timezone edge cases
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatLastUpdated = () => {
    if (!lastUpdated) return '';
    return lastUpdated.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusDisplay = () => {
    if (match.status === 'live' && match.currentPeriod) {
      return match.currentPeriod;
    }
    if (match.status === 'completed') {
      return match.currentPeriod || 'Full Time';
    }
    return 'Upcoming';
  };

  const statusStyles = {
    live: 'bg-red-500 text-white animate-pulse',
    completed: 'bg-gray-500 text-white',
    scheduled: 'bg-green-500 text-white',
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sticky Header */}
      <header className="bg-gray-900 text-white py-3 px-4 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <button onClick={handleBack} className="flex items-center text-sm hover:text-orange-400 transition-colors">
            <span className="mr-2">←</span> Back
          </button>
          <div className="flex items-center gap-2">
            {match.status === 'live' && (
              <span className="text-xs text-gray-400">
                Updated: {formatLastUpdated()}
              </span>
            )}
            <button
              onClick={handleRefresh}
              className="text-sm px-2 py-1 rounded hover:bg-gray-800 transition-colors"
              title="Refresh"
            >
              ↻
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto pb-8">
        {/* Match Info & Score */}
        <div className="bg-white shadow">
          <div className="p-4 text-center">
            {/* Status Badge */}
            <div className="mb-3">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusStyles[match.status]}`}>
                {getStatusDisplay()}
              </span>
            </div>
            
            {/* Teams and Score */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 text-center">
                <p className="font-bold text-lg text-gray-900">{match.homeTeam.shortName}</p>
                <p className="text-xs text-gray-500">{match.homeTeam.name}</p>
              </div>
              
              <div className="px-4">
                <div className="text-3xl font-bold text-gray-900">
                  {match.homeScore ?? '-'} - {match.awayScore ?? '-'}
                </div>
              </div>
              
              <div className="flex-1 text-center">
                <p className="font-bold text-lg text-gray-900">{match.awayTeam.shortName}</p>
                <p className="text-xs text-gray-500">{match.awayTeam.name}</p>
              </div>
            </div>
            
            {/* Date, Time, Venue */}
            <div className="mt-4 text-sm text-gray-500 border-t pt-3">
              <p>{formatDate(match.date)} • {match.time}</p>
              <p className="text-xs mt-1">{match.venue}</p>
            </div>
          </div>
        </div>

        {/* Quarter Scores */}
        {match.quarterScores && (match.status === 'completed' || match.status === 'live') && (
          <div className="bg-white rounded-lg shadow p-4 mt-4">
            <h3 className="font-semibold text-gray-900 mb-3">Score by Quarter</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-xs border-b">
                    <th className="py-2 text-left">Team</th>
                    <th className="py-2 text-center w-10">Q1</th>
                    <th className="py-2 text-center w-10">Q2</th>
                    <th className="py-2 text-center w-10">Q3</th>
                    <th className="py-2 text-center w-10">Q4</th>
                    {match.quarterScores.ot && <th className="py-2 text-center w-10">OT</th>}
                    <th className="py-2 text-center w-12 font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 font-medium">{match.homeTeam.shortName}</td>
                    <td className="py-2 text-center">{match.quarterScores.q1?.home ?? '-'}</td>
                    <td className="py-2 text-center">{match.quarterScores.q2?.home ?? '-'}</td>
                    <td className="py-2 text-center">{match.quarterScores.q3?.home ?? '-'}</td>
                    <td className="py-2 text-center">{match.quarterScores.q4?.home ?? '-'}</td>
                    {match.quarterScores.ot && <td className="py-2 text-center">{match.quarterScores.ot.home}</td>}
                    <td className="py-2 text-center font-bold text-orange-600">{match.homeScore ?? '-'}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">{match.awayTeam.shortName}</td>
                    <td className="py-2 text-center">{match.quarterScores.q1?.away ?? '-'}</td>
                    <td className="py-2 text-center">{match.quarterScores.q2?.away ?? '-'}</td>
                    <td className="py-2 text-center">{match.quarterScores.q3?.away ?? '-'}</td>
                    <td className="py-2 text-center">{match.quarterScores.q4?.away ?? '-'}</td>
                    {match.quarterScores.ot && <td className="py-2 text-center">{match.quarterScores.ot.away}</td>}
                    <td className="py-2 text-center font-bold text-orange-600">{match.awayScore ?? '-'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Team Statistics */}
        {match.homeStats && match.awayStats ? (
          <TeamStatsComparison homeStats={match.homeStats} awayStats={match.awayStats} />
        ) : (match.status === 'scheduled') && (
          <div className="bg-white rounded-lg shadow p-4 mt-4">
            <p className="text-gray-500 text-sm text-center">
              Statistics will be available once the match begins
            </p>
          </div>
        )}

        {/* Player Statistics (Top Performers) */}
        {match.homePlayers && match.awayPlayers && (
          <div className="bg-white rounded-lg shadow p-4 mt-4">
            <h3 className="font-semibold text-gray-900 mb-3">Top Performers</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-2 font-medium">{match.homeTeam.shortName}</p>
                {match.homePlayers.slice(0, 3).map((player) => (
                  <div key={player.id} className="mb-2 text-sm">
                    <p className="font-medium">{player.name}</p>
                    <p className="text-xs text-gray-500">
                      {player.points} pts • {player.rebounds} reb • {player.assists} ast
                    </p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2 font-medium">{match.awayTeam.shortName}</p>
                {match.awayPlayers.slice(0, 3).map((player) => (
                  <div key={player.id} className="mb-2 text-sm">
                    <p className="font-medium">{player.name}</p>
                    <p className="text-xs text-gray-500">
                      {player.points} pts • {player.rebounds} reb • {player.assists} ast
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
