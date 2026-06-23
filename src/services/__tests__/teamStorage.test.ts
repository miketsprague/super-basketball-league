import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getFollowedTeam,
  setFollowedTeam,
  clearFollowedTeam,
  normaliseTeamName,
  matchInvolvesTeam,
  computeAverageMargin,
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

describe('computeAverageMargin', () => {
  const home: Match['homeTeam'] = { id: 'h1', name: 'London Lions', shortName: 'Lions' };
  const away: Match['awayTeam'] = { id: 'a1', name: 'Bristol Flyers', shortName: 'Flyers' };

  function makeMatch(overrides: Partial<Match>): Match {
    return {
      id: 'm1',
      homeTeam: home,
      awayTeam: away,
      date: '2025-01-10',
      time: '19:00',
      venue: 'Arena',
      status: 'completed',
      homeScore: 90,
      awayScore: 80,
      ...overrides,
    };
  }

  it('returns null when there are no matches', () => {
    expect(computeAverageMargin([], 'London Lions')).toBeNull();
  });

  it('returns null when no completed matches exist', () => {
    const m = makeMatch({ status: 'scheduled', homeScore: undefined, awayScore: undefined });
    expect(computeAverageMargin([m], 'London Lions')).toBeNull();
  });

  it('returns null when scores are missing on completed matches', () => {
    const m = makeMatch({ homeScore: undefined, awayScore: undefined });
    expect(computeAverageMargin([m], 'London Lions')).toBeNull();
  });

  it('returns null when the team is not in any match', () => {
    const m = makeMatch({});
    expect(computeAverageMargin([m], 'Manchester Giants')).toBeNull();
  });

  it('computes correct stats for a home win', () => {
    // Lions 90 – Flyers 80
    const m = makeMatch({ homeScore: 90, awayScore: 80 });
    const result = computeAverageMargin([m], 'London Lions');
    expect(result).not.toBeNull();
    expect(result!.gamesPlayed).toBe(1);
    expect(result!.avgMargin).toBe(10);
    expect(result!.avgPointsFor).toBe(90);
    expect(result!.avgPointsAgainst).toBe(80);
  });

  it('computes correct stats for an away loss', () => {
    // Lions away: 80 – Flyers 90 → Lions: for=80, against=90, margin=-10
    const m = makeMatch({ homeScore: 90, awayScore: 80 });
    const result = computeAverageMargin([m], 'Bristol Flyers');
    expect(result).not.toBeNull();
    expect(result!.avgMargin).toBe(-10);
    expect(result!.avgPointsFor).toBe(80);
    expect(result!.avgPointsAgainst).toBe(90);
  });

  it('averages correctly across multiple games', () => {
    // Game 1: Lions home 90–80 (+10)
    // Game 2: Lions home 100–110 (-10)
    // avg: 0 margin, 95 PPG, 95 OPP
    const m1 = makeMatch({ id: 'm1', homeScore: 90, awayScore: 80 });
    const m2 = makeMatch({ id: 'm2', homeScore: 100, awayScore: 110 });
    const result = computeAverageMargin([m1, m2], 'London Lions');
    expect(result!.gamesPlayed).toBe(2);
    expect(result!.avgMargin).toBe(0);
    expect(result!.avgPointsFor).toBe(95);
    expect(result!.avgPointsAgainst).toBe(95);
  });

  it('matches team by short name', () => {
    const m = makeMatch({ homeScore: 90, awayScore: 80 });
    const result = computeAverageMargin([m], 'Lions');
    expect(result).not.toBeNull();
    expect(result!.avgPointsFor).toBe(90);
  });

  it('is case-insensitive', () => {
    const m = makeMatch({ homeScore: 90, awayScore: 80 });
    const result = computeAverageMargin([m], 'LONDON LIONS');
    expect(result).not.toBeNull();
    expect(result!.avgMargin).toBe(10);
  });

  it('rounds to one decimal place', () => {
    // Game 1: +8, Game 2: +7, Game 3: +6 → avg = 7.0
    const m1 = makeMatch({ id: 'm1', homeScore: 88, awayScore: 80 });
    const m2 = makeMatch({ id: 'm2', homeScore: 87, awayScore: 80 });
    const m3 = makeMatch({ id: 'm3', homeScore: 86, awayScore: 80 });
    const result = computeAverageMargin([m1, m2, m3], 'London Lions');
    expect(result!.avgMargin).toBe(7.0);
    // (88+87+86)/3 = 87.0
    expect(result!.avgPointsFor).toBe(87.0);
  });
});
