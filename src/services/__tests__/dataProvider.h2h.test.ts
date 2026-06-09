import { describe, it, expect } from 'vitest';
import { computeH2HRecord } from '../dataProvider';
import type { Match } from '../../types';

const team1: Match['homeTeam'] = { id: '1', name: 'London Lions', shortName: 'Lions' };
const team2: Match['homeTeam'] = { id: '2', name: 'Leicester Riders', shortName: 'Riders' };
const team3: Match['homeTeam'] = { id: '3', name: 'Cheshire Phoenix', shortName: 'Phoenix' };

const baseMatch: Omit<Match, 'id' | 'homeTeam' | 'awayTeam' | 'homeScore' | 'awayScore' | 'status'> = {
  date: '2026-01-10',
  time: '19:30',
  venue: 'Arena',
};

const completedMatch = (
  id: string,
  home: Match['homeTeam'],
  homeScore: number,
  awayScore: number,
  away: Match['homeTeam'],
  date = '2026-01-10',
): Match => ({
  ...baseMatch,
  id,
  homeTeam: home,
  awayTeam: away,
  homeScore,
  awayScore,
  status: 'completed',
  date,
});

const scheduledMatch = (
  id: string,
  home: Match['homeTeam'],
  away: Match['homeTeam'],
): Match => ({
  ...baseMatch,
  id,
  homeTeam: home,
  awayTeam: away,
  status: 'scheduled',
});

describe('computeH2HRecord', () => {
  it('returns zero totals when there are no matches', () => {
    const result = computeH2HRecord([], 'London Lions', 'Leicester Riders');
    expect(result).toEqual({ team1Wins: 0, team2Wins: 0, draws: 0, total: 0, recentMatches: [] });
  });

  it('counts team1 win when team1 is the home side', () => {
    const matches: Match[] = [completedMatch('m1', team1, 90, 80, team2)];
    const result = computeH2HRecord(matches, 'London Lions', 'Leicester Riders');
    expect(result.team1Wins).toBe(1);
    expect(result.team2Wins).toBe(0);
    expect(result.total).toBe(1);
  });

  it('counts team2 win when team2 is the home side', () => {
    const matches: Match[] = [completedMatch('m1', team2, 95, 80, team1)];
    const result = computeH2HRecord(matches, 'London Lions', 'Leicester Riders');
    expect(result.team1Wins).toBe(0);
    expect(result.team2Wins).toBe(1);
    expect(result.total).toBe(1);
  });

  it('counts draws correctly', () => {
    const matches: Match[] = [completedMatch('m1', team1, 85, 85, team2)];
    const result = computeH2HRecord(matches, 'London Lions', 'Leicester Riders');
    expect(result.draws).toBe(1);
    expect(result.team1Wins).toBe(0);
    expect(result.team2Wins).toBe(0);
  });

  it('handles multiple H2H matches across home/away', () => {
    const matches: Match[] = [
      completedMatch('m1', team1, 90, 80, team2, '2026-01-10'), // Lions win
      completedMatch('m2', team2, 95, 80, team1, '2026-02-10'), // Riders win
      completedMatch('m3', team1, 88, 88, team2, '2026-03-10'), // draw
    ];
    const result = computeH2HRecord(matches, 'London Lions', 'Leicester Riders');
    expect(result.team1Wins).toBe(1);
    expect(result.team2Wins).toBe(1);
    expect(result.draws).toBe(1);
    expect(result.total).toBe(3);
  });

  it('ignores scheduled matches', () => {
    const matches: Match[] = [scheduledMatch('m1', team1, team2)];
    const result = computeH2HRecord(matches, 'London Lions', 'Leicester Riders');
    expect(result.total).toBe(0);
  });

  it('ignores matches not involving both teams', () => {
    const matches: Match[] = [
      completedMatch('m1', team1, 90, 80, team3), // Lions vs Phoenix — not H2H
      completedMatch('m2', team2, 85, 75, team3), // Riders vs Phoenix — not H2H
    ];
    const result = computeH2HRecord(matches, 'London Lions', 'Leicester Riders');
    expect(result.total).toBe(0);
  });

  it('excludes a specific match by id', () => {
    const matches: Match[] = [
      completedMatch('m1', team1, 90, 80, team2),
      completedMatch('m2', team2, 88, 85, team1),
    ];
    const result = computeH2HRecord(matches, 'London Lions', 'Leicester Riders', 'm1');
    expect(result.total).toBe(1);
    expect(result.team2Wins).toBe(1);
  });

  it('matches by short name as well as full name', () => {
    const matches: Match[] = [completedMatch('m1', team1, 90, 80, team2)];
    const result = computeH2HRecord(matches, 'Lions', 'Riders');
    expect(result.team1Wins).toBe(1);
    expect(result.total).toBe(1);
  });

  it('returns recent matches sorted by date descending, max 5', () => {
    const matches: Match[] = [
      completedMatch('m1', team1, 90, 80, team2, '2026-01-10'),
      completedMatch('m2', team1, 92, 85, team2, '2026-02-10'),
      completedMatch('m3', team2, 88, 82, team1, '2026-03-10'),
      completedMatch('m4', team1, 95, 88, team2, '2026-04-10'),
      completedMatch('m5', team2, 91, 89, team1, '2026-05-10'),
      completedMatch('m6', team1, 87, 84, team2, '2026-06-01'),
    ];
    const result = computeH2HRecord(matches, 'London Lions', 'Leicester Riders');
    expect(result.total).toBe(6);
    expect(result.recentMatches).toHaveLength(5);
    // Most recent first
    expect(result.recentMatches[0].id).toBe('m6');
    expect(result.recentMatches[1].id).toBe('m5');
  });

  it('is case-insensitive when matching team names', () => {
    const matches: Match[] = [completedMatch('m1', team1, 90, 80, team2)];
    const result = computeH2HRecord(matches, 'london lions', 'LEICESTER RIDERS');
    expect(result.team1Wins).toBe(1);
  });
});
