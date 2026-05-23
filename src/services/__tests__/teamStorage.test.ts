import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getFollowedTeam,
  setFollowedTeam,
  clearFollowedTeam,
  normaliseTeamName,
  matchInvolvesTeam,
  computeTeamRecord,
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

  describe('computeTeamRecord', () => {
    const makeMatch = (
      home: string,
      away: string,
      homeScore?: number,
      awayScore?: number,
      status: Match['status'] = 'completed',
    ): Match => ({
      id: `${home}-vs-${away}`,
      homeTeam: { id: 'h', name: home, shortName: home.split(' ').pop() ?? home },
      awayTeam: { id: 'a', name: away, shortName: away.split(' ').pop() ?? away },
      homeScore,
      awayScore,
      date: '2026-01-01',
      time: '19:00',
      venue: 'Arena',
      status,
    });

    it('returns zeros when there are no completed matches', () => {
      const matches = [makeMatch('London Lions', 'Bristol Flyers', undefined, undefined, 'scheduled')];
      const record = computeTeamRecord(matches, 'London Lions');
      expect(record).toEqual({ played: 0, won: 0, lost: 0, winPct: 0, avgPointsFor: 0, avgPointsAgainst: 0 });
    });

    it('counts a home win correctly', () => {
      const matches = [makeMatch('London Lions', 'Bristol Flyers', 90, 80)];
      const record = computeTeamRecord(matches, 'London Lions');
      expect(record.played).toBe(1);
      expect(record.won).toBe(1);
      expect(record.lost).toBe(0);
      expect(record.winPct).toBe(100);
    });

    it('counts a home loss correctly', () => {
      const matches = [makeMatch('London Lions', 'Bristol Flyers', 75, 88)];
      const record = computeTeamRecord(matches, 'London Lions');
      expect(record.played).toBe(1);
      expect(record.won).toBe(0);
      expect(record.lost).toBe(1);
      expect(record.winPct).toBe(0);
    });

    it('counts an away win correctly', () => {
      const matches = [makeMatch('Bristol Flyers', 'London Lions', 80, 95)];
      const record = computeTeamRecord(matches, 'London Lions');
      expect(record.won).toBe(1);
      expect(record.lost).toBe(0);
    });

    it('counts an away loss correctly', () => {
      const matches = [makeMatch('Bristol Flyers', 'London Lions', 95, 80)];
      const record = computeTeamRecord(matches, 'London Lions');
      expect(record.won).toBe(0);
      expect(record.lost).toBe(1);
    });

    it('calculates win percentage rounded to nearest integer', () => {
      const matches = [
        makeMatch('London Lions', 'Bristol Flyers', 90, 80),
        makeMatch('London Lions', 'Manchester Giants', 70, 85),
        makeMatch('London Lions', 'Sheffield Sharks', 88, 75),
      ];
      const record = computeTeamRecord(matches, 'London Lions');
      expect(record.played).toBe(3);
      expect(record.won).toBe(2);
      expect(record.lost).toBe(1);
      expect(record.winPct).toBe(67);
    });

    it('calculates average points for and against', () => {
      const matches = [
        makeMatch('London Lions', 'Bristol Flyers', 90, 80),
        makeMatch('London Lions', 'Manchester Giants', 80, 85),
      ];
      const record = computeTeamRecord(matches, 'London Lions');
      expect(record.avgPointsFor).toBe(85);
      expect(record.avgPointsAgainst).toBe(82.5);
    });

    it('excludes scheduled and live matches from the count', () => {
      const matches = [
        makeMatch('London Lions', 'Bristol Flyers', 90, 80),
        makeMatch('London Lions', 'Sheffield Sharks', undefined, undefined, 'scheduled'),
        makeMatch('London Lions', 'Newcastle Eagles', 88, 82, 'live'),
      ];
      const record = computeTeamRecord(matches, 'London Lions');
      expect(record.played).toBe(1);
    });

    it('is case-insensitive for team names', () => {
      const matches = [makeMatch('London Lions', 'Bristol Flyers', 90, 80)];
      const record = computeTeamRecord(matches, 'london lions');
      expect(record.played).toBe(1);
    });

    it('returns zeros for an empty match list', () => {
      const record = computeTeamRecord([], 'London Lions');
      expect(record).toEqual({ played: 0, won: 0, lost: 0, winPct: 0, avgPointsFor: 0, avgPointsAgainst: 0 });
    });
  });
});
