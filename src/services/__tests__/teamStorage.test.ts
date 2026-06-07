import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getFollowedTeam,
  setFollowedTeam,
  clearFollowedTeam,
  normaliseTeamName,
  matchInvolvesTeam,
  computeTeamForm,
} from '../teamStorage';
import type { Match } from '../../types';

// Node.js 25+ exposes a native localStorage stub that shadows jsdom's implementation.
// We need to provide a proper mock to ensure tests work across all environments.
const storageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

describe('Team Storage', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', storageMock);
    localStorage.clear();
  });

  describe('getFollowedTeam', () => {
    it('should return null when no team is followed', () => {
      expect(getFollowedTeam()).toBeNull();
    });

    it('should return the followed team', () => {
      setFollowedTeam({ name: 'London Lions' });
      const result = getFollowedTeam();
      expect(result).toEqual({ name: 'London Lions' });
    });

    it('should return null for invalid stored data', () => {
      localStorage.setItem('basketball-followed-team', 'not-json');
      expect(getFollowedTeam()).toBeNull();
    });

    it('should return null for empty name', () => {
      localStorage.setItem('basketball-followed-team', JSON.stringify({ name: '  ' }));
      expect(getFollowedTeam()).toBeNull();
    });
  });

  describe('setFollowedTeam', () => {
    it('should persist team to localStorage', () => {
      setFollowedTeam({ name: 'Bristol Flyers' });
      const stored = localStorage.getItem('basketball-followed-team');
      expect(stored).toBe(JSON.stringify({ name: 'Bristol Flyers' }));
    });
  });

  describe('clearFollowedTeam', () => {
    it('should remove followed team from localStorage', () => {
      setFollowedTeam({ name: 'London Lions' });
      expect(getFollowedTeam()).not.toBeNull();
      clearFollowedTeam();
      expect(getFollowedTeam()).toBeNull();
    });
  });

  describe('normaliseTeamName', () => {
    it('should lowercase and trim', () => {
      expect(normaliseTeamName('  London Lions  ')).toBe('london lions');
    });

    it('should handle already normalised names', () => {
      expect(normaliseTeamName('london lions')).toBe('london lions');
    });
  });

  describe('matchInvolvesTeam', () => {
    const match = {
      homeTeam: { name: 'London Lions', shortName: 'Lions' },
      awayTeam: { name: 'Bristol Flyers', shortName: 'Flyers' },
    };

    it('should match home team by full name', () => {
      expect(matchInvolvesTeam(match, 'London Lions')).toBe(true);
    });

    it('should match away team by full name', () => {
      expect(matchInvolvesTeam(match, 'Bristol Flyers')).toBe(true);
    });

    it('should match by short name', () => {
      expect(matchInvolvesTeam(match, 'Lions')).toBe(true);
      expect(matchInvolvesTeam(match, 'Flyers')).toBe(true);
    });

    it('should be case-insensitive', () => {
      expect(matchInvolvesTeam(match, 'london lions')).toBe(true);
      expect(matchInvolvesTeam(match, 'BRISTOL FLYERS')).toBe(true);
    });

    it('should not match unrelated teams', () => {
      expect(matchInvolvesTeam(match, 'Manchester Giants')).toBe(false);
    });
  });

  describe('computeTeamForm', () => {
    const teamA: Match['homeTeam'] = { id: 'team-a', name: 'Lions', shortName: 'Lions' };
    const teamB: Match['homeTeam'] = { id: 'team-b', name: 'Bears', shortName: 'Bears' };
    const teamC: Match['homeTeam'] = { id: 'team-c', name: 'Hawks', shortName: 'Hawks' };

    const makeMatch = (
      id: string,
      home: typeof teamA,
      away: typeof teamA,
      homeScore: number,
      awayScore: number,
      date: string,
    ): Match => ({
      id,
      homeTeam: home,
      awayTeam: away,
      homeScore,
      awayScore,
      date,
      time: '19:00',
      venue: 'Arena',
      status: 'completed',
    });

    it('should return empty array when no matches', () => {
      expect(computeTeamForm([], 'team-a')).toEqual([]);
    });

    it('should return W for a home win', () => {
      const matches = [makeMatch('1', teamA, teamB, 90, 80, '2026-01-01')];
      expect(computeTeamForm(matches, 'team-a')).toEqual(['W']);
    });

    it('should return L for a home loss', () => {
      const matches = [makeMatch('1', teamA, teamB, 70, 85, '2026-01-01')];
      expect(computeTeamForm(matches, 'team-a')).toEqual(['L']);
    });

    it('should return W for an away win', () => {
      const matches = [makeMatch('1', teamB, teamA, 75, 95, '2026-01-01')];
      expect(computeTeamForm(matches, 'team-a')).toEqual(['W']);
    });

    it('should return L for an away loss', () => {
      const matches = [makeMatch('1', teamB, teamA, 100, 82, '2026-01-01')];
      expect(computeTeamForm(matches, 'team-a')).toEqual(['L']);
    });

    it('should return most-recent-first, up to 5 results', () => {
      const matches = [
        makeMatch('1', teamA, teamB, 90, 80, '2026-01-01'),
        makeMatch('2', teamA, teamB, 70, 85, '2026-01-02'),
        makeMatch('3', teamA, teamB, 95, 88, '2026-01-03'),
        makeMatch('4', teamA, teamB, 60, 72, '2026-01-04'),
        makeMatch('5', teamA, teamB, 88, 77, '2026-01-05'),
        makeMatch('6', teamA, teamB, 65, 90, '2026-01-06'),
      ];
      // Most recent first: date 6 (L), 5 (W), 4 (L), 3 (W), 2 (L) — oldest (1) dropped
      const form = computeTeamForm(matches, 'team-a');
      expect(form).toHaveLength(5);
      expect(form).toEqual(['L', 'W', 'L', 'W', 'L']);
    });

    it('should ignore scheduled matches', () => {
      const scheduled: Match = {
        ...makeMatch('1', teamA, teamB, 0, 0, '2026-02-01'),
        status: 'scheduled',
        homeScore: undefined,
        awayScore: undefined,
      };
      expect(computeTeamForm([scheduled], 'team-a')).toEqual([]);
    });

    it('should ignore matches not involving the team', () => {
      const matches = [makeMatch('1', teamB, teamC, 90, 80, '2026-01-01')];
      expect(computeTeamForm(matches, 'team-a')).toEqual([]);
    });

    it('should respect maxResults parameter', () => {
      const matches = [
        makeMatch('1', teamA, teamB, 90, 80, '2026-01-01'),
        makeMatch('2', teamA, teamB, 90, 80, '2026-01-02'),
        makeMatch('3', teamA, teamB, 90, 80, '2026-01-03'),
      ];
      expect(computeTeamForm(matches, 'team-a', 2)).toHaveLength(2);
    });
  });
});
