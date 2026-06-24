import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getFollowedTeam,
  setFollowedTeam,
  clearFollowedTeam,
  normaliseTeamName,
  matchInvolvesTeam,
  computeRecentRecord,
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

// ─── computeRecentRecord ──────────────────────────────────────────────────────

const makeMatch = (
  id: string,
  homeTeam: string,
  awayTeam: string,
  homeScore: number,
  awayScore: number,
  date: string,
): Match => ({
  id,
  homeTeam: { id: `ht-${id}`, name: homeTeam, shortName: homeTeam.split(' ').pop() ?? homeTeam },
  awayTeam: { id: `at-${id}`, name: awayTeam, shortName: awayTeam.split(' ').pop() ?? awayTeam },
  homeScore,
  awayScore,
  date,
  time: '19:00',
  venue: 'TBC',
  status: 'completed',
});

describe('computeRecentRecord', () => {
  it('returns null when team has no matches', () => {
    expect(computeRecentRecord([], 'London Lions')).toBeNull();
  });

  it('returns null when team has no completed matches', () => {
    const m: Match = {
      id: 'x1',
      homeTeam: { id: 'h1', name: 'London Lions', shortName: 'Lions' },
      awayTeam: { id: 'a1', name: 'Bristol Flyers', shortName: 'Flyers' },
      date: '2025-01-01',
      time: '19:00',
      venue: 'TBC',
      status: 'scheduled',
    };
    expect(computeRecentRecord([m], 'London Lions')).toBeNull();
  });

  it('correctly counts wins and losses', () => {
    const matches = [
      makeMatch('1', 'London Lions', 'Bristol Flyers', 90, 80, '2025-01-05'), // W
      makeMatch('2', 'Manchester Giants', 'London Lions', 75, 85, '2025-01-04'), // W (away)
      makeMatch('3', 'London Lions', 'Leeds Force', 70, 80, '2025-01-03'), // L
    ];
    const result = computeRecentRecord(matches, 'London Lions', 5)!;
    expect(result).not.toBeNull();
    expect(result.wins).toBe(2);
    expect(result.losses).toBe(1);
    expect(result.played).toBe(3);
    expect(result.form).toEqual(['W', 'W', 'L']);
  });

  it('only returns the last N matches', () => {
    const matches = [
      makeMatch('1', 'London Lions', 'Bristol Flyers', 90, 80, '2025-01-10'), // W
      makeMatch('2', 'London Lions', 'Leeds Force', 70, 80, '2025-01-09'), // L
      makeMatch('3', 'London Lions', 'Sheffield Sharks', 85, 75, '2025-01-08'), // W
      makeMatch('4', 'London Lions', 'Plymouth Raiders', 60, 90, '2025-01-07'), // L
      makeMatch('5', 'London Lions', 'Surrey Scorchers', 95, 80, '2025-01-06'), // W
      makeMatch('6', 'London Lions', 'Cheshire Phoenix', 88, 70, '2025-01-05'), // W (outside lastN=5)
    ];
    const result = computeRecentRecord(matches, 'London Lions', 5)!;
    expect(result.played).toBe(5);
    expect(result.wins).toBe(3);
    expect(result.losses).toBe(2);
    expect(result.form).toEqual(['W', 'L', 'W', 'L', 'W']);
  });

  it('computes correct PPG and OPP averages', () => {
    const matches = [
      makeMatch('1', 'London Lions', 'Bristol Flyers', 80, 70, '2025-01-03'),
      makeMatch('2', 'London Lions', 'Leeds Force', 90, 60, '2025-01-02'),
      makeMatch('3', 'London Lions', 'Sheffield Sharks', 100, 80, '2025-01-01'),
    ];
    const result = computeRecentRecord(matches, 'London Lions', 5)!;
    // PPG = (80+90+100)/3 = 90
    expect(result.ppg).toBe(90);
    // OPP = (70+60+80)/3 = 70
    expect(result.opp).toBe(70);
    // diff = 90-70 = 20
    expect(result.diff).toBe(20);
  });

  it('computes correct averages when playing away', () => {
    const matches = [
      makeMatch('1', 'Bristol Flyers', 'London Lions', 70, 80, '2025-01-02'), // away win
      makeMatch('2', 'Leeds Force', 'London Lions', 90, 60, '2025-01-01'), // away loss
    ];
    const result = computeRecentRecord(matches, 'London Lions', 5)!;
    // team scores: 80, 60 → PPG = 70
    expect(result.ppg).toBe(70);
    // opp scores: 70, 90 → OPP = 80
    expect(result.opp).toBe(80);
    expect(result.diff).toBe(-10);
    expect(result.wins).toBe(1);
    expect(result.losses).toBe(1);
  });

  it('is case-insensitive for team name matching', () => {
    const matches = [makeMatch('1', 'LONDON LIONS', 'Bristol Flyers', 90, 80, '2025-01-01')];
    const result = computeRecentRecord(matches, 'london lions', 5);
    expect(result).not.toBeNull();
    expect(result!.wins).toBe(1);
  });

  it('matches by short name', () => {
    const m: Match = {
      id: 'x1',
      homeTeam: { id: 'h1', name: 'London Lions', shortName: 'Lions' },
      awayTeam: { id: 'a1', name: 'Bristol Flyers', shortName: 'Flyers' },
      homeScore: 90,
      awayScore: 80,
      date: '2025-01-01',
      time: '19:00',
      venue: 'TBC',
      status: 'completed',
    };
    expect(computeRecentRecord([m], 'Lions')).not.toBeNull();
  });

  it('returns correct lastN in the result', () => {
    const matches = [makeMatch('1', 'London Lions', 'Bristol Flyers', 90, 80, '2025-01-01')];
    const result = computeRecentRecord(matches, 'London Lions', 10)!;
    expect(result.lastN).toBe(10);
  });
});
