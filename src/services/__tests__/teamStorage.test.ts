import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getFollowedTeam,
  setFollowedTeam,
  clearFollowedTeam,
  normaliseTeamName,
  matchInvolvesTeam,
  computeHomeAwayRecord,
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

  describe('computeHomeAwayRecord', () => {
    const makeMatch = (
      homeTeamName: string,
      awayTeamName: string,
      homeScore: number,
      awayScore: number,
      status: Match['status'] = 'completed',
    ): Match => ({
      id: `${homeTeamName}-${awayTeamName}-${homeScore}-${awayScore}`,
      homeTeam: { id: homeTeamName, name: homeTeamName, shortName: homeTeamName.split(' ')[0] },
      awayTeam: { id: awayTeamName, name: awayTeamName, shortName: awayTeamName.split(' ')[0] },
      homeScore,
      awayScore,
      date: '2025-01-01',
      time: '19:00',
      venue: 'Arena',
      status,
    });

    it('returns zero record when there are no matches', () => {
      const record = computeHomeAwayRecord([], 'London Lions');
      expect(record).toEqual({
        home: { played: 0, won: 0, lost: 0 },
        away: { played: 0, won: 0, lost: 0 },
      });
    });

    it('ignores non-completed matches', () => {
      const matches = [
        makeMatch('London Lions', 'Bristol Flyers', 90, 80, 'scheduled'),
        makeMatch('London Lions', 'Bristol Flyers', 90, 80, 'live'),
      ];
      const record = computeHomeAwayRecord(matches, 'London Lions');
      expect(record.home.played).toBe(0);
      expect(record.away.played).toBe(0);
    });

    it('counts a home win correctly', () => {
      const matches = [makeMatch('London Lions', 'Bristol Flyers', 90, 80)];
      const record = computeHomeAwayRecord(matches, 'London Lions');
      expect(record.home).toEqual({ played: 1, won: 1, lost: 0 });
      expect(record.away).toEqual({ played: 0, won: 0, lost: 0 });
    });

    it('counts a home loss correctly', () => {
      const matches = [makeMatch('London Lions', 'Bristol Flyers', 70, 85)];
      const record = computeHomeAwayRecord(matches, 'London Lions');
      expect(record.home).toEqual({ played: 1, won: 0, lost: 1 });
    });

    it('counts an away win correctly', () => {
      const matches = [makeMatch('Bristol Flyers', 'London Lions', 80, 95)];
      const record = computeHomeAwayRecord(matches, 'London Lions');
      expect(record.away).toEqual({ played: 1, won: 1, lost: 0 });
      expect(record.home).toEqual({ played: 0, won: 0, lost: 0 });
    });

    it('counts an away loss correctly', () => {
      const matches = [makeMatch('Bristol Flyers', 'London Lions', 90, 80)];
      const record = computeHomeAwayRecord(matches, 'London Lions');
      expect(record.away).toEqual({ played: 1, won: 0, lost: 1 });
    });

    it('accumulates multiple home and away matches', () => {
      const matches = [
        makeMatch('London Lions', 'Bristol Flyers', 90, 80),   // home W
        makeMatch('London Lions', 'Manchester Giants', 75, 85), // home L
        makeMatch('Bristol Flyers', 'London Lions', 80, 95),   // away W
        makeMatch('Manchester Giants', 'London Lions', 90, 85), // away L
        makeMatch('London Lions', 'Plymouth Raiders', 100, 90), // home W
      ];
      const record = computeHomeAwayRecord(matches, 'London Lions');
      expect(record.home).toEqual({ played: 3, won: 2, lost: 1 });
      expect(record.away).toEqual({ played: 2, won: 1, lost: 1 });
    });

    it('matches by short name', () => {
      const match = makeMatch('London Lions', 'Bristol Flyers', 90, 80);
      match.awayTeam.shortName = 'Flyers';
      const record = computeHomeAwayRecord([match], 'Flyers');
      expect(record.away).toEqual({ played: 1, won: 0, lost: 1 });
    });

    it('is case-insensitive', () => {
      const matches = [makeMatch('London Lions', 'Bristol Flyers', 90, 80)];
      const record = computeHomeAwayRecord(matches, 'LONDON LIONS');
      expect(record.home.played).toBe(1);
    });

    it('ignores matches with missing scores', () => {
      const match = makeMatch('London Lions', 'Bristol Flyers', 0, 0);
      (match as Partial<Match>).homeScore = undefined;
      (match as Partial<Match>).awayScore = undefined;
      const record = computeHomeAwayRecord([match as Match], 'London Lions');
      expect(record.home.played).toBe(0);
    });
  });
});
