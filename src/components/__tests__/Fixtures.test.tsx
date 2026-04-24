import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import type { Match } from '../../types';
import { Fixtures } from '../Fixtures';

// ── Helpers ──────────────────────────────────────────────────────────────────

const TODAY = '2026-04-20';
const YESTERDAY = '2026-04-19';
const TOMORROW = '2026-04-21';
const FUTURE = '2026-05-01';

function makeMatch(overrides: Partial<Match> = {}): Match {
  return {
    id: 'm1',
    homeTeam: { id: 'h1', name: 'Home Team', shortName: 'HOM' },
    awayTeam: { id: 'a1', name: 'Away Team', shortName: 'AWY' },
    date: TOMORROW,
    time: '19:00',
    venue: 'Test Arena',
    status: 'scheduled',
    ...overrides,
  };
}

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

function renderFixtures(
  matches: Match[],
  loading = false,
  showLeagueName = false,
  initialPath = '/?tab=fixtures',
) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route
          path="*"
          element={<Fixtures matches={matches} loading={loading} showLeagueName={showLeagueName} />}
        />
      </Routes>
    </MemoryRouter>,
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('Fixtures', () => {
  beforeEach(() => {
    // Pin today's date so filtering logic is deterministic
    vi.useFakeTimers();
    vi.setSystemTime(new Date(`${TODAY}T12:00:00`));
    mockNavigate.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ── Loading state ────────────────────────────────────────────────────────

  describe('loading state', () => {
    it('renders a loading spinner', () => {
      renderFixtures([], true);
      // Spinner is present; no tabs or matches
      expect(document.querySelector('.animate-spin')).toBeTruthy();
      expect(screen.queryByText('Fixtures')).toBeNull();
    });

    it('does not render match content while loading', () => {
      renderFixtures([makeMatch()], true);
      expect(screen.queryByText('HOM')).toBeNull();
    });
  });

  // ── Empty state ──────────────────────────────────────────────────────────

  describe('empty state', () => {
    it('shows "No fixtures available" when matches array is empty', () => {
      renderFixtures([]);
      expect(screen.getByText('No fixtures available')).toBeTruthy();
    });

    it('does not render tabs when matches is empty', () => {
      renderFixtures([]);
      expect(screen.queryByText('Fixtures')).toBeNull();
    });
  });

  // ── Tab rendering ────────────────────────────────────────────────────────

  describe('tabs', () => {
    const upcomingMatch = makeMatch({ id: 'm-upcoming', date: TOMORROW, status: 'scheduled' });
    const pastMatch = makeMatch({
      id: 'm-past',
      date: YESTERDAY,
      status: 'completed',
      homeScore: 80,
      awayScore: 75,
    });
    const matches = [upcomingMatch, pastMatch];

    it('renders three filter tabs', () => {
      renderFixtures(matches);
      expect(screen.getByText('Fixtures')).toBeTruthy();
      expect(screen.getByText('Results')).toBeTruthy();
      expect(screen.getByText('All')).toBeTruthy();
    });

    it('defaults to fixtures tab', () => {
      renderFixtures(matches, false, false, '/');
      // Upcoming match should be visible; past match should not
      expect(screen.getByText('HOM')).toBeTruthy();
      expect(screen.queryByText('80')).toBeNull();
    });

    it('shows counts in each tab', () => {
      renderFixtures(matches);
      // Each tab label is followed by a count span; the total count should include both matches
      expect(screen.getByText('2')).toBeTruthy(); // All tab count
    });

    it('clicking Results tab shows completed past matches', () => {
      renderFixtures(matches);
      fireEvent.click(screen.getByText('Results'));
      expect(screen.getByText('FT')).toBeTruthy();
      expect(screen.getByText('80')).toBeTruthy();
    });

    it('clicking All tab shows all matches', () => {
      renderFixtures(matches);
      fireEvent.click(screen.getByText('All'));
      expect(screen.getByText('Upcoming')).toBeTruthy();
      expect(screen.getByText('FT')).toBeTruthy();
    });

    it('shows "No upcoming fixtures" message when fixtures tab has no matches', () => {
      // All matches are past
      renderFixtures([pastMatch], false, false, '/');
      expect(screen.getByText('No upcoming fixtures')).toBeTruthy();
    });

    it('shows "No results yet" when results tab has no completed matches', () => {
      renderFixtures([upcomingMatch]);
      fireEvent.click(screen.getByText('Results'));
      expect(screen.getByText('No results yet')).toBeTruthy();
    });
  });

  // ── Match card rendering ─────────────────────────────────────────────────

  describe('match card', () => {
    it('renders team short names', () => {
      renderFixtures([makeMatch()]);
      // Navigate to All so both scheduled matches are visible
      fireEvent.click(screen.getByText('All'));
      expect(screen.getAllByText('HOM').length).toBeGreaterThan(0);
      expect(screen.getAllByText('AWY').length).toBeGreaterThan(0);
    });

    it('shows "Upcoming" badge for scheduled matches', () => {
      renderFixtures([makeMatch({ date: TOMORROW, status: 'scheduled' })]);
      fireEvent.click(screen.getByText('All'));
      expect(screen.getByText('Upcoming')).toBeTruthy();
    });

    it('shows "FT" badge for completed matches', () => {
      const match = makeMatch({ date: YESTERDAY, status: 'completed', homeScore: 90, awayScore: 80 });
      renderFixtures([match]);
      fireEvent.click(screen.getByText('Results'));
      expect(screen.getByText('FT')).toBeTruthy();
    });

    it('shows "LIVE" badge for live matches', () => {
      const liveMatch = makeMatch({ date: TODAY, status: 'live', homeScore: 55, awayScore: 50 });
      renderFixtures([liveMatch]);
      fireEvent.click(screen.getByText('All'));
      expect(screen.getByText('LIVE')).toBeTruthy();
    });

    it('shows scores for completed matches', () => {
      const match = makeMatch({ date: YESTERDAY, status: 'completed', homeScore: 88, awayScore: 76 });
      renderFixtures([match]);
      fireEvent.click(screen.getByText('Results'));
      expect(screen.getByText('88')).toBeTruthy();
      expect(screen.getByText('76')).toBeTruthy();
    });

    it('shows "-" placeholder when scores are undefined', () => {
      renderFixtures([makeMatch({ date: TOMORROW, status: 'scheduled' })]);
      fireEvent.click(screen.getByText('All'));
      const dashes = screen.getAllByText('-');
      expect(dashes.length).toBe(2);
    });

    it('shows match time', () => {
      renderFixtures([makeMatch({ time: '20:30' })]);
      fireEvent.click(screen.getByText('All'));
      expect(screen.getByText('20:30')).toBeTruthy();
    });

    it('shows "TBC" when time is empty', () => {
      renderFixtures([makeMatch({ time: '' })]);
      fireEvent.click(screen.getByText('All'));
      expect(screen.getByText('TBC')).toBeTruthy();
    });

    it('shows venue when provided', () => {
      renderFixtures([makeMatch({ venue: 'Olympic Arena' })]);
      fireEvent.click(screen.getByText('All'));
      expect(screen.getByText('Olympic Arena')).toBeTruthy();
    });

    it('does not render venue span when venue is "TBC"', () => {
      renderFixtures([makeMatch({ venue: 'TBC' })]);
      fireEvent.click(screen.getByText('All'));
      expect(screen.queryByText('TBC')).toBeNull();
    });

    it('shows league name badge when showLeagueName=true', () => {
      const match = makeMatch({ leagueName: 'Super League' });
      renderFixtures([match], false, true);
      fireEvent.click(screen.getByText('All'));
      expect(screen.getByText('Super League')).toBeTruthy();
    });

    it('does not show league name badge when showLeagueName=false', () => {
      const match = makeMatch({ leagueName: 'Super League' });
      renderFixtures([match], false, false);
      fireEvent.click(screen.getByText('All'));
      expect(screen.queryByText('Super League')).toBeNull();
    });
  });

  // ── Date grouping and headers ────────────────────────────────────────────

  describe('date headers', () => {
    it('shows "Today" for matches on today\'s date', () => {
      const liveToday = makeMatch({ date: TODAY, status: 'live' });
      renderFixtures([liveToday]);
      fireEvent.click(screen.getByText('All'));
      expect(screen.getByText(/Today/)).toBeTruthy();
    });

    it('shows "Tomorrow" for matches on tomorrow\'s date', () => {
      renderFixtures([makeMatch({ date: TOMORROW })]);
      fireEvent.click(screen.getByText('All'));
      expect(screen.getByText(/Tomorrow/)).toBeTruthy();
    });

    it('shows "Yesterday" for matches on yesterday\'s date in All tab', () => {
      const pastMatch = makeMatch({ date: YESTERDAY, status: 'completed' });
      renderFixtures([pastMatch]);
      fireEvent.click(screen.getByText('All'));
      expect(screen.getByText(/Yesterday/)).toBeTruthy();
    });

    it('groups multiple matches on the same date under one header', () => {
      const m1 = makeMatch({ id: 'm1', date: TOMORROW });
      const m2 = makeMatch({ id: 'm2', date: TOMORROW, homeTeam: { id: 'h2', name: 'Team B', shortName: 'TMB' }, awayTeam: { id: 'a2', name: 'Team C', shortName: 'TMC' } });
      renderFixtures([m1, m2]);
      fireEvent.click(screen.getByText('All'));
      // Should show "(2 matches)" in the header
      expect(screen.getByText(/2 matches/)).toBeTruthy();
    });

    it('shows "(1 match)" for a single match on a date', () => {
      renderFixtures([makeMatch()]);
      fireEvent.click(screen.getByText('All'));
      expect(screen.getByText(/1 match/)).toBeTruthy();
    });
  });

  // ── Navigation ───────────────────────────────────────────────────────────

  describe('navigation', () => {
    it('navigates to /match/:id on match card click', () => {
      renderFixtures([makeMatch({ id: 'abc123' })]);
      fireEvent.click(screen.getByText('All'));
      const matchCard = screen.getByText('HOM').closest('button')!;
      fireEvent.click(matchCard);
      expect(mockNavigate).toHaveBeenCalledWith('/match/abc123');
    });

    it('includes league query param in navigation when set', () => {
      renderFixtures([makeMatch({ id: 'xyz' })], false, false, '/?league=SLBC&tab=fixtures');
      fireEvent.click(screen.getByText('All'));
      const matchCard = screen.getByText('HOM').closest('button')!;
      fireEvent.click(matchCard);
      expect(mockNavigate).toHaveBeenCalledWith('/match/xyz?league=SLBC');
    });
  });

  // ── Fixtures tab filtering ───────────────────────────────────────────────

  describe('fixtures tab filtering', () => {
    it('includes live matches in fixtures tab even if date is in the past', () => {
      const liveYesterday = makeMatch({ id: 'live1', date: YESTERDAY, status: 'live' });
      renderFixtures([liveYesterday]);
      // Default tab is fixtures — live match should appear
      expect(screen.getByText('LIVE')).toBeTruthy();
    });

    it('excludes past completed matches from fixtures tab', () => {
      const past = makeMatch({ date: YESTERDAY, status: 'completed', homeScore: 80, awayScore: 70 });
      renderFixtures([past]);
      // Fixtures tab (default): no completed past match should appear
      expect(screen.getByText('No upcoming fixtures')).toBeTruthy();
    });

    it('results tab shows only past completed matches, not scheduled ones', () => {
      const scheduled = makeMatch({ date: FUTURE, status: 'scheduled' });
      const completed = makeMatch({ id: 'c1', date: YESTERDAY, status: 'completed', homeScore: 90, awayScore: 85 });
      renderFixtures([scheduled, completed]);
      fireEvent.click(screen.getByText('Results'));
      expect(screen.getByText('FT')).toBeTruthy();
      expect(screen.queryByText('Upcoming')).toBeNull();
    });
  });
});
