import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Fixtures } from '../Fixtures';
import type { Match } from '../../types';

// Capture navigate calls
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

// Use a fixed "today" by making dates far in the future (upcoming) or past (completed)
// so tests are not date-sensitive
const FUTURE = '2099-12-31';
const PAST = '2000-01-01';

function makeMatch(overrides: Partial<Match> = {}): Match {
  return {
    id: 'm1',
    homeTeam: { id: 'h1', name: 'Home Team', shortName: 'HOM' },
    awayTeam: { id: 'a1', name: 'Away Team', shortName: 'AWY' },
    date: FUTURE,
    time: '19:00',
    venue: 'Test Arena',
    status: 'scheduled',
    ...overrides,
  };
}

function renderFixtures(
  matches: Match[],
  opts: { loading?: boolean; showLeagueName?: boolean; initialEntries?: string[] } = {},
) {
  const { loading = false, showLeagueName, initialEntries = ['/'] } = opts;
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Fixtures matches={matches} loading={loading} showLeagueName={showLeagueName} />
    </MemoryRouter>,
  );
}

// ─── Loading state ────────────────────────────────────────────────────────────

describe('Fixtures — loading state', () => {
  it('shows spinner when loading', () => {
    renderFixtures([], { loading: true });
    expect(document.querySelector('.animate-spin')).toBeTruthy();
  });

  it('does not show tabs when loading', () => {
    renderFixtures([], { loading: true });
    expect(screen.queryByText('Fixtures')).toBeNull();
  });
});

// ─── Empty state ─────────────────────────────────────────────────────────────

describe('Fixtures — empty state', () => {
  it('shows "No fixtures available" when there are no matches at all', () => {
    renderFixtures([]);
    expect(screen.getByText(/No fixtures available/i)).toBeInTheDocument();
  });

  it('shows "No upcoming fixtures" on fixtures tab when no future matches', () => {
    // Past completed match — will not show in 'fixtures' tab
    const pastMatch = makeMatch({ date: PAST, status: 'completed', homeScore: 80, awayScore: 70 });
    renderFixtures([pastMatch]);
    expect(screen.getByText(/No upcoming fixtures/i)).toBeInTheDocument();
  });

  it('shows "No results yet" on results tab when no past matches', () => {
    const futureMatch = makeMatch({ date: FUTURE, status: 'scheduled' });
    renderFixtures([futureMatch], { initialEntries: ['/?tab=results'] });
    expect(screen.getByText(/No results yet/i)).toBeInTheDocument();
  });
});

// ─── Tab rendering ────────────────────────────────────────────────────────────

describe('Fixtures — tabs', () => {
  it('renders all three tab buttons', () => {
    renderFixtures([makeMatch()]);
    expect(screen.getByText('Fixtures')).toBeInTheDocument();
    expect(screen.getByText('Results')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
  });

  it('fixtures tab shows upcoming matches', () => {
    const upcoming = makeMatch({ id: 'up1', date: FUTURE, status: 'scheduled' });
    const past = makeMatch({ id: 'past1', date: PAST, homeTeam: { id: 'h2', name: 'Past Home', shortName: 'PH2' }, awayTeam: { id: 'a2', name: 'Past Away', shortName: 'PA2' }, status: 'completed', homeScore: 90, awayScore: 80 });
    renderFixtures([upcoming, past]);
    expect(screen.getByText('HOM')).toBeInTheDocument();
    expect(screen.queryByText('PH2')).toBeNull();
  });

  it('results tab shows past completed matches', () => {
    const upcoming = makeMatch({ id: 'up1', date: FUTURE, status: 'scheduled' });
    const past = makeMatch({ id: 'past1', date: PAST, homeTeam: { id: 'h2', name: 'Past Home', shortName: 'PH2' }, awayTeam: { id: 'a2', name: 'Past Away', shortName: 'PA2' }, status: 'completed', homeScore: 90, awayScore: 80 });
    renderFixtures([upcoming, past], { initialEntries: ['/?tab=results'] });
    expect(screen.getByText('PH2')).toBeInTheDocument();
    expect(screen.queryByText('HOM')).toBeNull();
  });

  it('all tab shows both upcoming and past matches', () => {
    const upcoming = makeMatch({ id: 'up1', date: FUTURE, status: 'scheduled' });
    const past = makeMatch({ id: 'past1', date: PAST, homeTeam: { id: 'h2', name: 'Past Home', shortName: 'PH2' }, awayTeam: { id: 'a2', name: 'Past Away', shortName: 'PA2' }, status: 'completed', homeScore: 90, awayScore: 80 });
    renderFixtures([upcoming, past], { initialEntries: ['/?tab=all'] });
    expect(screen.getByText('HOM')).toBeInTheDocument();
    expect(screen.getByText('PH2')).toBeInTheDocument();
  });
});

// ─── Match card content ───────────────────────────────────────────────────────

describe('Fixtures — match card content', () => {
  it('shows team short names', () => {
    renderFixtures([makeMatch()]);
    expect(screen.getByText('HOM')).toBeInTheDocument();
    expect(screen.getByText('AWY')).toBeInTheDocument();
  });

  it('shows dash for score when match is scheduled', () => {
    renderFixtures([makeMatch({ status: 'scheduled' })]);
    const dashes = screen.getAllByText('-');
    expect(dashes.length).toBeGreaterThanOrEqual(2);
  });

  it('shows score when match is completed', () => {
    renderFixtures([makeMatch({ date: PAST, status: 'completed', homeScore: 95, awayScore: 82 })], {
      initialEntries: ['/?tab=results'],
    });
    expect(screen.getByText('95')).toBeInTheDocument();
    expect(screen.getByText('82')).toBeInTheDocument();
  });

  it('shows venue when not TBC', () => {
    renderFixtures([makeMatch({ venue: 'Manchester Arena' })]);
    expect(screen.getByText('Manchester Arena')).toBeInTheDocument();
  });

  it('does not show venue when it is TBC', () => {
    renderFixtures([makeMatch({ venue: 'TBC' })]);
    expect(screen.queryByText('TBC')).toBeNull();
  });

  it('shows "View details →" text on each card', () => {
    renderFixtures([makeMatch()]);
    expect(screen.getByText(/View details/)).toBeInTheDocument();
  });

  it('shows the match time', () => {
    renderFixtures([makeMatch({ time: '20:30' })]);
    expect(screen.getByText('20:30')).toBeInTheDocument();
  });
});

// ─── Status badges ────────────────────────────────────────────────────────────

describe('Fixtures — status badges', () => {
  it('shows "Upcoming" badge for scheduled matches', () => {
    renderFixtures([makeMatch({ status: 'scheduled' })]);
    expect(screen.getByText('Upcoming')).toBeInTheDocument();
  });

  it('shows "FT" badge for completed matches', () => {
    renderFixtures([makeMatch({ date: PAST, status: 'completed', homeScore: 80, awayScore: 70 })], {
      initialEntries: ['/?tab=results'],
    });
    expect(screen.getByText('FT')).toBeInTheDocument();
  });

  it('shows "LIVE" badge for live matches', () => {
    renderFixtures([makeMatch({ date: FUTURE, status: 'live', homeScore: 45, awayScore: 40 })]);
    expect(screen.getByText('LIVE')).toBeInTheDocument();
  });
});

// ─── Winner highlighting and score margin ─────────────────────────────────────

describe('Fixtures — winner and margin', () => {
  it('shows "W" indicator next to home team when home wins', () => {
    const homeWin = makeMatch({
      date: PAST,
      status: 'completed',
      homeScore: 100,
      awayScore: 80,
    });
    renderFixtures([homeWin], { initialEntries: ['/?tab=results'] });
    // Home team should have W next to it
    const wMarkers = screen.getAllByText('W');
    expect(wMarkers.length).toBeGreaterThanOrEqual(1);
  });

  it('shows score margin when there is a winner', () => {
    const homeWin = makeMatch({
      date: PAST,
      status: 'completed',
      homeScore: 100,
      awayScore: 80,
    });
    renderFixtures([homeWin], { initialEntries: ['/?tab=results'] });
    expect(screen.getByText('+20')).toBeInTheDocument();
  });

  it('does not show score margin when match is not completed', () => {
    renderFixtures([makeMatch({ status: 'scheduled' })]);
    expect(screen.queryByText(/^\+\d+$/)).toBeNull();
  });
});

// ─── showLeagueName prop ──────────────────────────────────────────────────────

describe('Fixtures — showLeagueName', () => {
  it('shows league name badge when showLeagueName is true and leagueName is present', () => {
    const match = makeMatch({ leagueName: 'SLB Championship' });
    renderFixtures([match], { showLeagueName: true });
    expect(screen.getByText('SLB Championship')).toBeInTheDocument();
  });

  it('does not show league name badge when showLeagueName is false', () => {
    const match = makeMatch({ leagueName: 'SLB Championship' });
    renderFixtures([match], { showLeagueName: false });
    expect(screen.queryByText('SLB Championship')).toBeNull();
  });
});

// ─── Navigation ──────────────────────────────────────────────────────────────

describe('Fixtures — navigation', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  it('navigates to match detail when card is clicked', () => {
    const match = makeMatch({ id: 'match-99' });
    renderFixtures([match]);
    const card = screen.getByText('HOM').closest('button');
    expect(card).toBeTruthy();
    fireEvent.click(card!);
    expect(mockNavigate).toHaveBeenCalledOnce();
    const [path] = mockNavigate.mock.calls[0];
    expect(path).toContain('match-99');
  });

  it('includes league param in navigation URL when present', () => {
    const match = makeMatch({ id: 'match-100' });
    renderFixtures([match], { initialEntries: ['/?league=super-league'] });
    const card = screen.getByText('HOM').closest('button');
    fireEvent.click(card!);
    const [path] = mockNavigate.mock.calls[0];
    expect(path).toContain('league=super-league');
  });
});
