import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  getFollowedTeam,
  setFollowedTeam,
  clearFollowedTeam,
  normaliseTeamName,
  matchInvolvesTeam,
  computeNextFixture,
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

// ─── computeNextFixture ──────────────────────────────────────────────────────

function makeMatch(overrides: Partial<Match> = {}): Match {
  return {
    id: '1',
    homeTeam: { id: 'h1', name: 'London Lions', shortName: 'Lions' },
    awayTeam: { id: 'a1', name: 'Bristol Flyers', shortName: 'Flyers' },
    date: '2026-09-01',
    time: '19:00',
    venue: 'Copper Box Arena',
    status: 'scheduled',
    ...overrides,
  };
}

describe('computeNextFixture', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-17T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return the earliest upcoming scheduled fixture for a team', () => {
    const matches: Match[] = [
      makeMatch({ id: '1', date: '2026-09-10', time: '20:00' }),
      makeMatch({ id: '2', date: '2026-09-01', time: '19:00' }),
      makeMatch({ id: '3', date: '2026-09-20', time: '18:00' }),
    ];
    const result = computeNextFixture(matches, 'London Lions');
    expect(result?.id).toBe('2');
  });

  it('should return null when no upcoming fixtures exist', () => {
    const matches: Match[] = [
      makeMatch({ id: '1', date: '2026-05-01', time: '19:00', status: 'completed' }),
    ];
    expect(computeNextFixture(matches, 'London Lions')).toBeNull();
  });

  it('should skip completed matches even if in the future', () => {
    const matches: Match[] = [
      makeMatch({ id: '1', date: '2026-09-01', status: 'completed', homeScore: 80, awayScore: 75 }),
    ];
    expect(computeNextFixture(matches, 'London Lions')).toBeNull();
  });

  it('should include live matches', () => {
    const liveMatch = makeMatch({ id: 'live1', date: '2026-06-17', status: 'live' });
    const result = computeNextFixture([liveMatch], 'London Lions');
    expect(result?.id).toBe('live1');
  });

  it('should skip past scheduled matches', () => {
    const past = makeMatch({ id: 'past1', date: '2026-06-01', status: 'scheduled' });
    expect(computeNextFixture([past], 'London Lions')).toBeNull();
  });

  it('should match by team short name', () => {
    const match = makeMatch({ id: 'short1', date: '2026-09-01' });
    const result = computeNextFixture([match], 'Lions');
    expect(result?.id).toBe('short1');
  });

  it('should return null when team has no matches at all', () => {
    const match = makeMatch({ id: '1', date: '2026-09-01' });
    expect(computeNextFixture([match], 'Manchester Giants')).toBeNull();
  });

  it('should break ties by time when dates are equal', () => {
    const matches: Match[] = [
      makeMatch({ id: 'late', date: '2026-09-01', time: '20:00' }),
      makeMatch({ id: 'early', date: '2026-09-01', time: '18:00' }),
    ];
    expect(computeNextFixture(matches, 'London Lions')?.id).toBe('early');
  });
});
