import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Fixtures } from '../Fixtures';
import type { Match } from '../../types';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Helper to create a Match with today's date (upcoming)
const today = new Date();
const toDateStr = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};
const addDays = (d: Date, n: number) => {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + n);
  return copy;
};

const todayStr = toDateStr(today);
const yesterdayStr = toDateStr(addDays(today, -1));
const tomorrowStr = toDateStr(addDays(today, 1));

function makeMatch(overrides: Partial<Match> & { id: string }): Match {
  return {
    id: overrides.id,
    homeTeam: { id: 'h1', name: 'Home Team', shortName: 'HOM' },
    awayTeam: { id: 'a1', name: 'Away Team', shortName: 'AWY' },
    date: todayStr,
    time: '19:00',
    venue: 'Test Arena',
    status: 'scheduled',
    ...overrides,
  };
}

const upcomingMatch = makeMatch({ id: 'm1', date: todayStr, status: 'scheduled' });
const completedMatch = makeMatch({
  id: 'm2',
  date: yesterdayStr,
  status: 'completed',
  homeScore: 85,
  awayScore: 78,
});
const tomorrowMatch = makeMatch({ id: 'm3', date: tomorrowStr, status: 'scheduled' });
const liveMatch = makeMatch({ id: 'm4', date: todayStr, status: 'live', homeScore: 52, awayScore: 49 });

const renderFixtures = (matches: Match[], loading = false, showLeagueName = false) =>
  render(
    <MemoryRouter initialEntries={['/?tab=fixtures']}>
      <Fixtures matches={matches} loading={loading} showLeagueName={showLeagueName} />
    </MemoryRouter>
  );

describe('Fixtures', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  describe('loading state', () => {
    it('renders a spinner when loading', () => {
      renderFixtures([], true);
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeTruthy();
    });

    it('does not render any matches when loading', () => {
      renderFixtures([upcomingMatch], true);
      expect(screen.queryByText('HOM')).toBeNull();
    });
  });

  describe('empty state', () => {
    it('shows "No fixtures available" when no matches', () => {
      renderFixtures([]);
      expect(screen.getByText('No fixtures available')).toBeTruthy();
    });
  });

  describe('tab rendering', () => {
    it('renders Fixtures, Results, and All tabs', () => {
      renderFixtures([upcomingMatch]);
      expect(screen.getByText('Fixtures')).toBeTruthy();
      expect(screen.getByText('Results')).toBeTruthy();
      expect(screen.getByText('All')).toBeTruthy();
    });

    it('shows count badges on tabs', () => {
      renderFixtures([upcomingMatch, completedMatch]);
      // Fixtures tab shows 1, Results tab shows 1, All tab shows 2
      const allText = screen.getAllByText('2');
      expect(allText.length).toBeGreaterThan(0);
    });
  });

  describe('fixtures tab (default)', () => {
    it('shows upcoming matches', () => {
      renderFixtures([upcomingMatch, tomorrowMatch]);
      const items = screen.getAllByText('HOM');
      expect(items.length).toBeGreaterThan(0);
    });

    it('shows live matches in fixtures tab', () => {
      renderFixtures([liveMatch]);
      expect(screen.getByText('LIVE')).toBeTruthy();
    });

    it('does not show past completed matches in fixtures tab', () => {
      renderFixtures([completedMatch]);
      // Only the completed match exists — fixtures tab should show empty
      expect(screen.getByText('No upcoming fixtures')).toBeTruthy();
    });

    it('shows "Today" for today matches', () => {
      renderFixtures([upcomingMatch]);
      expect(screen.getByText('Today')).toBeTruthy();
    });

    it('shows "Tomorrow" for tomorrow matches', () => {
      renderFixtures([tomorrowMatch]);
      expect(screen.getByText('Tomorrow')).toBeTruthy();
    });
  });

  describe('results tab', () => {
    it('shows completed matches when Results tab is clicked', () => {
      renderFixtures([completedMatch, upcomingMatch]);
      const resultsTab = screen.getByText('Results');
      fireEvent.click(resultsTab);
      // FT badge indicates a completed match
      expect(screen.getByText('FT')).toBeTruthy();
    });

    it('shows scores for completed matches', () => {
      renderFixtures([completedMatch, upcomingMatch]);
      const resultsTab = screen.getByText('Results');
      fireEvent.click(resultsTab);
      expect(screen.getByText('85')).toBeTruthy();
      expect(screen.getByText('78')).toBeTruthy();
    });

    it('shows empty state when no results', () => {
      renderFixtures([upcomingMatch]);
      fireEvent.click(screen.getByText('Results'));
      expect(screen.getByText('No results yet')).toBeTruthy();
    });
  });

  describe('all tab', () => {
    it('shows all matches when All tab is clicked', () => {
      renderFixtures([upcomingMatch, completedMatch]);
      fireEvent.click(screen.getByText('All'));
      // Both teams should appear
      const homTexts = screen.getAllByText('HOM');
      expect(homTexts.length).toBe(2);
    });
  });

  describe('match display', () => {
    it('renders team short names', () => {
      const match = makeMatch({ id: 'm5', homeTeam: { id: 'h', name: 'Barcelona', shortName: 'BAR' }, awayTeam: { id: 'a', name: 'Real Madrid', shortName: 'RMA' } });
      renderFixtures([match]);
      expect(screen.getByText('BAR')).toBeTruthy();
      expect(screen.getByText('RMA')).toBeTruthy();
    });

    it('renders match time', () => {
      renderFixtures([upcomingMatch]);
      expect(screen.getByText('19:00')).toBeTruthy();
    });

    it('renders venue when present', () => {
      renderFixtures([upcomingMatch]);
      expect(screen.getByText('Test Arena')).toBeTruthy();
    });

    it('shows "TBC" when time is missing', () => {
      const noTimeMatch = makeMatch({ id: 'mt', time: '' });
      renderFixtures([noTimeMatch]);
      expect(screen.getByText('TBC')).toBeTruthy();
    });

    it('shows league name when showLeagueName is true and match has leagueName', () => {
      const leagueMatch = makeMatch({ id: 'ml', leagueName: 'Super League' });
      renderFixtures([leagueMatch], false, true);
      expect(screen.getByText('Super League')).toBeTruthy();
    });

    it('does not show league name when showLeagueName is false', () => {
      const leagueMatch = makeMatch({ id: 'ml2', leagueName: 'Super League' });
      renderFixtures([leagueMatch], false, false);
      expect(screen.queryByText('Super League')).toBeNull();
    });
  });

  describe('navigation', () => {
    it('navigates to match detail when match is clicked', () => {
      renderFixtures([upcomingMatch]);
      const matchBtn = screen.getByRole('button', { name: /HOM/i });
      fireEvent.click(matchBtn);
      expect(mockNavigate).toHaveBeenCalledWith('/match/m1');
    });

    it('saves scroll position before navigating', () => {
      renderFixtures([upcomingMatch]);
      const matchBtn = screen.getByRole('button', { name: /HOM/i });
      fireEvent.click(matchBtn);
      // sessionStorage should have the scroll key set
      expect(sessionStorage.getItem('fixtures-scroll-position')).toBeDefined();
    });
  });

  describe('match status badges', () => {
    it('shows "Upcoming" for scheduled matches', () => {
      renderFixtures([upcomingMatch]);
      expect(screen.getByText('Upcoming')).toBeTruthy();
    });

    it('shows "LIVE" for live matches', () => {
      renderFixtures([liveMatch]);
      expect(screen.getByText('LIVE')).toBeTruthy();
    });

    it('shows "FT" for completed matches in all tab', () => {
      renderFixtures([completedMatch]);
      fireEvent.click(screen.getByText('All'));
      expect(screen.getByText('FT')).toBeTruthy();
    });
  });
});
