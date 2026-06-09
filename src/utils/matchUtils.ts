import type { Match } from '../types';

export type MatchWinner = 'home' | 'away' | 'draw';

export function getMatchWinner(match: Pick<Match, 'homeScore' | 'awayScore' | 'status'>): MatchWinner | null {
  if (match.status !== 'completed') return null;
  if (match.homeScore == null || match.awayScore == null) return null;
  if (match.homeScore > match.awayScore) return 'home';
  if (match.awayScore > match.homeScore) return 'away';
  return 'draw';
}

export function getMatchMargin(match: Pick<Match, 'homeScore' | 'awayScore' | 'status'>): number | null {
  if (match.status !== 'completed') return null;
  if (match.homeScore == null || match.awayScore == null) return null;
  return Math.abs(match.homeScore - match.awayScore);
}
