import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getFollowedTeam,
  setFollowedTeam,
  clearFollowedTeam,
  normaliseTeamName,
  matchInvolvesTeam,
  computeCloseGameRecord,
} from '../teamStorage';

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

  describe('computeCloseGameRecord', () => {
    const makeMatch = (
      homeTeam: string,
      awayTeam: string,
      homeScore: number,
      awayScore: number,
      status = 'completed',
    ) => ({
      homeTeam: { name: homeTeam, shortName: homeTeam },
      awayTeam: { name: awayTeam, shortName: awayTeam },
      homeScore,
      awayScore,
      status,
    });

    const team = 'London Lions';

    it('should return null if fewer than 2 close games', () => {
      const matches = [
        makeMatch(team, 'Bristol Flyers', 90, 86),       // close (4-pt win)
        makeMatch(team, 'Sheffield Sharks', 100, 80),     // not close
      ];
      expect(computeCloseGameRecord(matches, team)).toBeNull();
    });

    it('should count wins and losses in close games', () => {
      const matches = [
        makeMatch(team, 'Bristol Flyers', 90, 86),        // close win (+4)
        makeMatch(team, 'Sheffield Sharks', 80, 85),      // close loss (-5)
        makeMatch(team, 'Manchester Giants', 95, 70),     // not close (+25)
        makeMatch('Bristol Flyers', team, 82, 80),        // close loss (away, -2)
        makeMatch('Sheffield Sharks', team, 75, 80),      // close win (away, +5)
      ];
      const result = computeCloseGameRecord(matches, team);
      expect(result).not.toBeNull();
      expect(result!.won).toBe(2);
      expect(result!.lost).toBe(2);
      expect(result!.total).toBe(4);
      expect(result!.margin).toBe(5);
    });

    it('should use a custom margin threshold', () => {
      const matches = [
        makeMatch(team, 'Bristol Flyers', 90, 83),   // 7-point win — close at margin=10, not at 5
        makeMatch(team, 'Sheffield Sharks', 80, 73),  // 7-point win — close at margin=10, not at 5
        makeMatch(team, 'Manchester Giants', 100, 90), // 10-point win — close at margin=10
      ];
      const result5 = computeCloseGameRecord(matches, team, 5);
      expect(result5).toBeNull(); // no games within 5 pts
      const result10 = computeCloseGameRecord(matches, team, 10);
      expect(result10).not.toBeNull();
      expect(result10!.total).toBe(3);
      expect(result10!.margin).toBe(10);
    });

    it('should ignore scheduled and live matches', () => {
      const matches = [
        makeMatch(team, 'Bristol Flyers', 90, 86, 'completed'),  // close win
        makeMatch(team, 'Sheffield Sharks', 80, 85, 'scheduled'), // ignored
        makeMatch(team, 'Manchester Giants', 88, 84, 'live'),     // ignored
        makeMatch('Bristol Flyers', team, 75, 72, 'completed'),   // close loss
      ];
      const result = computeCloseGameRecord(matches, team);
      expect(result).not.toBeNull();
      expect(result!.total).toBe(2);
      expect(result!.won).toBe(1);
      expect(result!.lost).toBe(1);
    });

    it('should be case-insensitive for team name', () => {
      const matches = [
        makeMatch('LONDON LIONS', 'Bristol Flyers', 90, 86),
        makeMatch('Sheffield Sharks', 'LONDON LIONS', 82, 80),
        makeMatch('london lions', 'Manchester Giants', 88, 84),
      ];
      const result = computeCloseGameRecord(matches, 'London Lions');
      expect(result).not.toBeNull();
      expect(result!.total).toBe(3);
    });

    it('should ignore matches with undefined scores', () => {
      const matches = [
        { homeTeam: { name: team, shortName: team }, awayTeam: { name: 'Bristol Flyers', shortName: 'Bristol Flyers' }, homeScore: undefined, awayScore: undefined, status: 'completed' },
        makeMatch(team, 'Sheffield Sharks', 90, 86),    // close win
        makeMatch(team, 'Manchester Giants', 80, 76),   // close win
      ];
      const result = computeCloseGameRecord(matches, team);
      expect(result).not.toBeNull();
      expect(result!.total).toBe(2);
    });
  });
});
