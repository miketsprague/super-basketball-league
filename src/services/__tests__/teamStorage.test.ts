import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getFollowedTeam,
  setFollowedTeam,
  clearFollowedTeam,
  normaliseTeamName,
  matchInvolvesTeam,
  computeScoringAverage,
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

  describe('computeScoringAverage', () => {
    const makeMatch = (
      homeTeamName: string,
      awayTeamName: string,
      homeScore: number | undefined,
      awayScore: number | undefined,
      status: Match['status'] = 'completed',
    ): Match => ({
      id: `${homeTeamName}-${awayTeamName}`,
      homeTeam: { id: homeTeamName, name: homeTeamName, shortName: homeTeamName },
      awayTeam: { id: awayTeamName, name: awayTeamName, shortName: awayTeamName },
      homeScore,
      awayScore,
      date: '2025-03-01',
      time: '19:00',
      venue: 'Arena',
      status,
    });

    it('should return null when there are no matches', () => {
      expect(computeScoringAverage([], 'London Lions')).toBeNull();
    });

    it('should return null when there are no completed matches', () => {
      const matches = [makeMatch('London Lions', 'Bristol Flyers', undefined, undefined, 'scheduled')];
      expect(computeScoringAverage(matches, 'London Lions')).toBeNull();
    });

    it('should return null when completed matches have no scores', () => {
      const matches = [makeMatch('London Lions', 'Bristol Flyers', undefined, undefined, 'completed')];
      expect(computeScoringAverage(matches, 'London Lions')).toBeNull();
    });

    it('should return null when team is not involved in any match', () => {
      const matches = [makeMatch('Bristol Flyers', 'Manchester Giants', 80, 75)];
      expect(computeScoringAverage(matches, 'London Lions')).toBeNull();
    });

    it('should compute correct averages for a single home match', () => {
      const matches = [makeMatch('London Lions', 'Bristol Flyers', 90, 80)];
      const result = computeScoringAverage(matches, 'London Lions');
      expect(result).toEqual({ avgPointsFor: 90, avgPointsAgainst: 80, gamesPlayed: 1 });
    });

    it('should compute correct averages for a single away match', () => {
      const matches = [makeMatch('Bristol Flyers', 'London Lions', 80, 90)];
      const result = computeScoringAverage(matches, 'London Lions');
      expect(result).toEqual({ avgPointsFor: 90, avgPointsAgainst: 80, gamesPlayed: 1 });
    });

    it('should average across multiple matches', () => {
      const matches = [
        makeMatch('London Lions', 'Bristol Flyers', 100, 80),  // scored 100, conceded 80
        makeMatch('Manchester Giants', 'London Lions', 70, 90), // scored 90, conceded 70
      ];
      const result = computeScoringAverage(matches, 'London Lions');
      // avg for: (100 + 90) / 2 = 95; avg against: (80 + 70) / 2 = 75
      expect(result).toEqual({ avgPointsFor: 95, avgPointsAgainst: 75, gamesPlayed: 2 });
    });

    it('should round averages to 1 decimal place', () => {
      const matches = [
        makeMatch('London Lions', 'Bristol Flyers', 100, 80),
        makeMatch('Manchester Giants', 'London Lions', 70, 91),
        makeMatch('London Lions', 'Sheffield Sharks', 85, 79),
      ];
      const result = computeScoringAverage(matches, 'London Lions');
      // for: (100 + 91 + 85) / 3 = 276 / 3 = 92.0; against: (80 + 70 + 79) / 3 = 229/3 ≈ 76.3
      expect(result?.avgPointsFor).toBe(92);
      expect(result?.avgPointsAgainst).toBe(76.3);
      expect(result?.gamesPlayed).toBe(3);
    });

    it('should ignore non-completed matches', () => {
      const matches = [
        makeMatch('London Lions', 'Bristol Flyers', 90, 80),
        makeMatch('London Lions', 'Manchester Giants', undefined, undefined, 'scheduled'),
        makeMatch('London Lions', 'Sheffield Sharks', undefined, undefined, 'live'),
      ];
      const result = computeScoringAverage(matches, 'London Lions');
      expect(result).toEqual({ avgPointsFor: 90, avgPointsAgainst: 80, gamesPlayed: 1 });
    });

    it('should be case-insensitive for team name matching', () => {
      const matches = [makeMatch('London Lions', 'Bristol Flyers', 90, 80)];
      const result = computeScoringAverage(matches, 'london lions');
      expect(result).toEqual({ avgPointsFor: 90, avgPointsAgainst: 80, gamesPlayed: 1 });
    });

    it('should match by short name', () => {
      const matches: Match[] = [{
        id: 'test-1',
        homeTeam: { id: 'lions', name: 'London Lions', shortName: 'Lions' },
        awayTeam: { id: 'flyers', name: 'Bristol Flyers', shortName: 'Flyers' },
        homeScore: 90,
        awayScore: 80,
        date: '2025-03-01',
        time: '19:00',
        venue: 'Arena',
        status: 'completed',
      }];
      const result = computeScoringAverage(matches, 'Lions');
      expect(result).toEqual({ avgPointsFor: 90, avgPointsAgainst: 80, gamesPlayed: 1 });
    });
  });
});
