import { describe, it, expect } from 'vitest';
import { getMatchWinner, getMatchMargin } from '../Fixtures';
import type { Match } from '../../types';

const baseMatch: Pick<Match, 'homeScore' | 'awayScore' | 'status'> = {
  homeScore: undefined,
  awayScore: undefined,
  status: 'scheduled',
};

describe('getMatchWinner', () => {
  it('returns null for non-completed matches', () => {
    expect(getMatchWinner({ ...baseMatch, status: 'scheduled' })).toBeNull();
    expect(getMatchWinner({ ...baseMatch, status: 'live' })).toBeNull();
  });

  it('returns null when scores are missing', () => {
    expect(getMatchWinner({ status: 'completed', homeScore: undefined, awayScore: undefined })).toBeNull();
    expect(getMatchWinner({ status: 'completed', homeScore: 80, awayScore: undefined })).toBeNull();
    expect(getMatchWinner({ status: 'completed', homeScore: undefined, awayScore: 80 })).toBeNull();
  });

  it('returns "home" when home team wins', () => {
    expect(getMatchWinner({ status: 'completed', homeScore: 95, awayScore: 82 })).toBe('home');
  });

  it('returns "away" when away team wins', () => {
    expect(getMatchWinner({ status: 'completed', homeScore: 70, awayScore: 88 })).toBe('away');
  });

  it('returns "draw" when scores are equal', () => {
    expect(getMatchWinner({ status: 'completed', homeScore: 85, awayScore: 85 })).toBe('draw');
  });

  it('handles zero scores', () => {
    expect(getMatchWinner({ status: 'completed', homeScore: 0, awayScore: 0 })).toBe('draw');
    expect(getMatchWinner({ status: 'completed', homeScore: 1, awayScore: 0 })).toBe('home');
  });
});

describe('getMatchMargin', () => {
  it('returns null for non-completed matches', () => {
    expect(getMatchMargin({ ...baseMatch, status: 'scheduled' })).toBeNull();
    expect(getMatchMargin({ ...baseMatch, status: 'live' })).toBeNull();
  });

  it('returns null when scores are missing', () => {
    expect(getMatchMargin({ status: 'completed', homeScore: undefined, awayScore: undefined })).toBeNull();
    expect(getMatchMargin({ status: 'completed', homeScore: 80, awayScore: undefined })).toBeNull();
  });

  it('returns the positive margin for a home win', () => {
    expect(getMatchMargin({ status: 'completed', homeScore: 95, awayScore: 82 })).toBe(13);
  });

  it('returns the positive margin for an away win', () => {
    expect(getMatchMargin({ status: 'completed', homeScore: 70, awayScore: 88 })).toBe(18);
  });

  it('returns 0 for equal scores', () => {
    expect(getMatchMargin({ status: 'completed', homeScore: 85, awayScore: 85 })).toBe(0);
  });

  it('handles large score margins', () => {
    expect(getMatchMargin({ status: 'completed', homeScore: 120, awayScore: 80 })).toBe(40);
  });
});
