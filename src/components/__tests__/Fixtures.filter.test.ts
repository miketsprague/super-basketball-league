import { describe, it, expect } from 'vitest';
import { filterMatchesByTab } from '../../utils/fixtureUtils';
import type { Match } from '../../types';

const TODAY = '2026-06-25';

function makeMatch(overrides: Partial<Match>): Match {
  return {
    id: 'm1',
    homeTeam: { id: 'h1', name: 'Home', shortName: 'HOM' },
    awayTeam: { id: 'a1', name: 'Away', shortName: 'AWY' },
    date: TODAY,
    time: '19:00',
    venue: 'Arena',
    status: 'scheduled',
    ...overrides,
  };
}

describe('filterMatchesByTab', () => {
  describe('results tab', () => {
    it('includes yesterday\'s completed matches', () => {
      const match = makeMatch({ date: '2026-06-24', status: 'completed' });
      const result = filterMatchesByTab([match], 'results', TODAY);
      expect(result).toHaveLength(1);
    });

    it('includes today\'s completed matches', () => {
      const match = makeMatch({ date: TODAY, status: 'completed' });
      const result = filterMatchesByTab([match], 'results', TODAY);
      expect(result).toHaveLength(1);
    });

    it('excludes today\'s scheduled matches', () => {
      const match = makeMatch({ date: TODAY, status: 'scheduled' });
      const result = filterMatchesByTab([match], 'results', TODAY);
      expect(result).toHaveLength(0);
    });

    it('excludes tomorrow\'s completed matches', () => {
      const match = makeMatch({ date: '2026-06-26', status: 'completed' });
      const result = filterMatchesByTab([match], 'results', TODAY);
      expect(result).toHaveLength(0);
    });

    it('returns results in reverse chronological order (most recent first)', () => {
      const older = makeMatch({ id: 'old', date: '2026-06-20', status: 'completed' });
      const newer = makeMatch({ id: 'new', date: '2026-06-24', status: 'completed' });
      const result = filterMatchesByTab([older, newer], 'results', TODAY);
      expect(result[0].id).toBe('new');
      expect(result[1].id).toBe('old');
    });
  });

  describe('fixtures tab', () => {
    it('includes today\'s scheduled matches', () => {
      const match = makeMatch({ date: TODAY, status: 'scheduled' });
      const result = filterMatchesByTab([match], 'fixtures', TODAY);
      expect(result).toHaveLength(1);
    });

    it('includes today\'s completed matches (still visible on fixtures tab)', () => {
      const match = makeMatch({ date: TODAY, status: 'completed' });
      const result = filterMatchesByTab([match], 'fixtures', TODAY);
      expect(result).toHaveLength(1);
    });

    it('includes live matches regardless of date', () => {
      const match = makeMatch({ date: '2026-06-24', status: 'live' });
      const result = filterMatchesByTab([match], 'fixtures', TODAY);
      expect(result).toHaveLength(1);
    });

    it('excludes past completed matches', () => {
      const match = makeMatch({ date: '2026-06-24', status: 'completed' });
      const result = filterMatchesByTab([match], 'fixtures', TODAY);
      expect(result).toHaveLength(0);
    });

    it('includes future scheduled matches', () => {
      const match = makeMatch({ date: '2026-06-26', status: 'scheduled' });
      const result = filterMatchesByTab([match], 'fixtures', TODAY);
      expect(result).toHaveLength(1);
    });
  });

  describe('all tab', () => {
    it('returns all matches regardless of status or date', () => {
      const matches = [
        makeMatch({ id: 'm1', date: '2026-06-20', status: 'completed' }),
        makeMatch({ id: 'm2', date: TODAY, status: 'live' }),
        makeMatch({ id: 'm3', date: '2026-07-01', status: 'scheduled' }),
      ];
      const result = filterMatchesByTab(matches, 'all', TODAY);
      expect(result).toHaveLength(3);
    });
  });

  describe('cross-tab consistency (today\'s completed matches)', () => {
    it('today\'s completed match appears in both fixtures and results tabs', () => {
      const match = makeMatch({ date: TODAY, status: 'completed' });
      const fixtures = filterMatchesByTab([match], 'fixtures', TODAY);
      const results = filterMatchesByTab([match], 'results', TODAY);
      expect(fixtures).toHaveLength(1);
      expect(results).toHaveLength(1);
    });
  });
});
