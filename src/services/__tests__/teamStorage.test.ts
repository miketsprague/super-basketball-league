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
});

// ─── computeTeamRecord ────────────────────────────────────────────────────────

function makeMatch(overrides: Partial<Match> = {}): Match {
  return {
    id: 'm1',
    homeTeam: { id: 'team-a', name: 'Team A', shortName: 'TMA' },
    awayTeam: { id: 'team-b', name: 'Team B', shortName: 'TMB' },
    date: '2026-03-01',
    time: '19:00',
    venue: 'Test Arena',
    status: 'completed',
    homeScore: 80,
    awayScore: 75,
    ...overrides,
  };
}

describe('computeTeamRecord', () => {
  it('should return zeroed record for empty matches array', () => {
    const record = computeTeamRecord([], 'team-a');
    expect(record).toEqual({
      played: 0,
      won: 0,
      lost: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      pointsDifference: 0,
      winPercentage: 0,
    });
  });

  it('should count home win correctly', () => {
    const match = makeMatch({ homeScore: 90, awayScore: 70 });
    const record = computeTeamRecord([match], 'team-a');
    expect(record.played).toBe(1);
    expect(record.won).toBe(1);
    expect(record.lost).toBe(0);
    expect(record.pointsFor).toBe(90);
    expect(record.pointsAgainst).toBe(70);
    expect(record.pointsDifference).toBe(20);
    expect(record.winPercentage).toBe(100);
  });

  it('should count away win correctly', () => {
    const match = makeMatch({ homeScore: 60, awayScore: 85 });
    const record = computeTeamRecord([match], 'team-b');
    expect(record.played).toBe(1);
    expect(record.won).toBe(1);
    expect(record.lost).toBe(0);
    expect(record.pointsFor).toBe(85);
    expect(record.pointsAgainst).toBe(60);
    expect(record.pointsDifference).toBe(25);
  });

  it('should count home loss correctly', () => {
    const match = makeMatch({ homeScore: 70, awayScore: 90 });
    const record = computeTeamRecord([match], 'team-a');
    expect(record.won).toBe(0);
    expect(record.lost).toBe(1);
    expect(record.pointsFor).toBe(70);
    expect(record.pointsAgainst).toBe(90);
    expect(record.pointsDifference).toBe(-20);
  });

  it('should accumulate across multiple matches', () => {
    const matches: Match[] = [
      makeMatch({ id: 'm1', homeScore: 80, awayScore: 70 }),   // team-a wins as home
      makeMatch({ id: 'm2', homeScore: 60, awayScore: 90 }),   // team-a loses as home
      makeMatch({ id: 'm3', awayTeam: { id: 'team-a', name: 'Team A', shortName: 'TMA' }, homeTeam: { id: 'team-c', name: 'Team C', shortName: 'TMC' }, homeScore: 65, awayScore: 88 }), // team-a wins as away
    ];
    const record = computeTeamRecord(matches, 'team-a');
    expect(record.played).toBe(3);
    expect(record.won).toBe(2);
    expect(record.lost).toBe(1);
    expect(record.pointsFor).toBe(80 + 60 + 88);
    expect(record.pointsAgainst).toBe(70 + 90 + 65);
    expect(record.pointsDifference).toBe((80 + 60 + 88) - (70 + 90 + 65));
    expect(record.winPercentage).toBeCloseTo(66.7, 0);
  });

  it('should ignore scheduled and live matches', () => {
    const matches: Match[] = [
      makeMatch({ id: 'm1', status: 'scheduled', homeScore: undefined, awayScore: undefined }),
      makeMatch({ id: 'm2', status: 'live', homeScore: 45, awayScore: 40 }),
      makeMatch({ id: 'm3', status: 'completed', homeScore: 90, awayScore: 75 }),
    ];
    const record = computeTeamRecord(matches, 'team-a');
    expect(record.played).toBe(1);
    expect(record.won).toBe(1);
  });

  it('should ignore matches not involving the team', () => {
    const match = makeMatch({
      homeTeam: { id: 'team-x', name: 'Team X', shortName: 'TMX' },
      awayTeam: { id: 'team-y', name: 'Team Y', shortName: 'TMY' },
    });
    const record = computeTeamRecord([match], 'team-a');
    expect(record.played).toBe(0);
  });

  it('should ignore completed matches with missing scores', () => {
    const match = makeMatch({ status: 'completed', homeScore: undefined, awayScore: undefined });
    const record = computeTeamRecord([match], 'team-a');
    expect(record.played).toBe(0);
  });

  it('should compute winPercentage correctly for multiple results', () => {
    const matches: Match[] = [
      makeMatch({ id: 'm1', homeScore: 80, awayScore: 70 }), // win
      makeMatch({ id: 'm2', homeScore: 80, awayScore: 70 }), // win
      makeMatch({ id: 'm3', homeScore: 60, awayScore: 80 }), // loss
      makeMatch({ id: 'm4', homeScore: 60, awayScore: 80 }), // loss
    ];
    const record = computeTeamRecord(matches, 'team-a');
    expect(record.winPercentage).toBe(50);
  });
});
