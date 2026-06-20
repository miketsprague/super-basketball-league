import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getFollowedTeam,
  setFollowedTeam,
  clearFollowedTeam,
  normaliseTeamName,
  matchInvolvesTeam,
  computeWinStreak,
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
});

// Helper to build a minimal Match fixture for computeWinStreak tests
function makeMatch(
  id: string,
  homeTeam: string,
  awayTeam: string,
  homeScore: number,
  awayScore: number,
  date: string,
): Match {
  return {
    id,
    homeTeam: { id: homeTeam, name: homeTeam, shortName: homeTeam },
    awayTeam: { id: awayTeam, name: awayTeam, shortName: awayTeam },
    homeScore,
    awayScore,
    date,
    time: '19:00',
    venue: 'TBC',
    status: 'completed',
  };
}

describe('computeWinStreak', () => {
  it('returns null when no matches', () => {
    expect(computeWinStreak([], 'London Lions')).toBeNull();
  });

  it('returns null when no completed matches', () => {
    const scheduled: Match = {
      id: 'm1',
      homeTeam: { id: 'LL', name: 'London Lions', shortName: 'Lions' },
      awayTeam: { id: 'BF', name: 'Bristol Flyers', shortName: 'Flyers' },
      date: '2025-03-01',
      time: '19:00',
      venue: 'TBC',
      status: 'scheduled',
    };
    expect(computeWinStreak([scheduled], 'London Lions')).toBeNull();
  });

  it('returns null when team has no matches in list', () => {
    const match = makeMatch('m1', 'Bristol Flyers', 'Sheffield Sharks', 90, 80, '2025-03-01');
    expect(computeWinStreak([match], 'London Lions')).toBeNull();
  });

  it('returns W1 for a single home win', () => {
    const match = makeMatch('m1', 'London Lions', 'Bristol Flyers', 90, 80, '2025-03-01');
    expect(computeWinStreak([match], 'London Lions')).toEqual({ type: 'W', count: 1 });
  });

  it('returns W1 for a single away win', () => {
    const match = makeMatch('m1', 'Bristol Flyers', 'London Lions', 70, 85, '2025-03-01');
    expect(computeWinStreak([match], 'London Lions')).toEqual({ type: 'W', count: 1 });
  });

  it('returns L1 for a single home loss', () => {
    const match = makeMatch('m1', 'London Lions', 'Bristol Flyers', 70, 80, '2025-03-01');
    expect(computeWinStreak([match], 'London Lions')).toEqual({ type: 'L', count: 1 });
  });

  it('returns W3 for three consecutive wins', () => {
    const matches = [
      makeMatch('m1', 'London Lions', 'Team A', 90, 80, '2025-03-01'),
      makeMatch('m2', 'Team B', 'London Lions', 70, 85, '2025-03-08'),
      makeMatch('m3', 'London Lions', 'Team C', 95, 88, '2025-03-15'),
    ];
    expect(computeWinStreak(matches, 'London Lions')).toEqual({ type: 'W', count: 3 });
  });

  it('resets streak when a loss interrupts wins', () => {
    const matches = [
      makeMatch('m1', 'London Lions', 'Team A', 90, 80, '2025-03-01'), // W
      makeMatch('m2', 'London Lions', 'Team B', 60, 80, '2025-03-08'), // L
      makeMatch('m3', 'London Lions', 'Team C', 95, 88, '2025-03-15'), // W (most recent)
    ];
    // Most recent match is a win, so streak = W1
    expect(computeWinStreak(matches, 'London Lions')).toEqual({ type: 'W', count: 1 });
  });

  it('returns L2 for two consecutive losses (most recent first)', () => {
    const matches = [
      makeMatch('m1', 'London Lions', 'Team A', 90, 80, '2025-03-01'), // W (oldest)
      makeMatch('m2', 'London Lions', 'Team B', 60, 80, '2025-03-08'), // L
      makeMatch('m3', 'London Lions', 'Team C', 70, 88, '2025-03-15'), // L (most recent)
    ];
    expect(computeWinStreak(matches, 'London Lions')).toEqual({ type: 'L', count: 2 });
  });

  it('uses shortName for team matching', () => {
    const match: Match = {
      id: 'm1',
      homeTeam: { id: 'LL', name: 'London Lions Basketball', shortName: 'Lions' },
      awayTeam: { id: 'BF', name: 'Bristol Flyers', shortName: 'Flyers' },
      homeScore: 90,
      awayScore: 80,
      date: '2025-03-01',
      time: '19:00',
      venue: 'TBC',
      status: 'completed',
    };
    expect(computeWinStreak([match], 'Lions')).toEqual({ type: 'W', count: 1 });
  });

  it('ignores scheduled matches when counting streak', () => {
    const matches: Match[] = [
      makeMatch('m1', 'London Lions', 'Team A', 90, 80, '2025-03-01'), // W
      makeMatch('m2', 'London Lions', 'Team B', 88, 70, '2025-03-08'), // W
      {
        id: 'm3',
        homeTeam: { id: 'LL', name: 'London Lions', shortName: 'Lions' },
        awayTeam: { id: 'TC', name: 'Team C', shortName: 'Team C' },
        date: '2025-03-20',
        time: '19:00',
        venue: 'TBC',
        status: 'scheduled',
      },
    ];
    expect(computeWinStreak(matches, 'London Lions')).toEqual({ type: 'W', count: 2 });
  });
});
