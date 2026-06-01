import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LeagueTable } from '../LeagueTable';
import type { StandingsEntry, Match } from '../../types';

function makeEntry(overrides: Partial<StandingsEntry> & { teamId?: string; shortName?: string } = {}): StandingsEntry {
  const { teamId = 't1', shortName = 'TST', ...rest } = overrides;
  return {
    position: 1,
    team: { id: teamId, name: 'Test Team', shortName },
    played: 10,
    won: 7,
    lost: 3,
    pointsFor: 800,
    pointsAgainst: 750,
    pointsDifference: 50,
    points: 14,
    ...rest,
  };
}

function makeMatch(overrides: Partial<Match> = {}): Match {
  return {
    id: 'm1',
    homeTeam: { id: 'h1', name: 'Home', shortName: 'HOM' },
    awayTeam: { id: 'a1', name: 'Away', shortName: 'AWY' },
    date: '2026-03-01',
    time: '19:00',
    venue: 'Arena',
    status: 'completed',
    homeScore: 90,
    awayScore: 80,
    ...overrides,
  };
}

function renderTable(standings: StandingsEntry[], matches: Match[] = []) {
  return render(
    <MemoryRouter>
      <LeagueTable standings={standings} loading={false} matches={matches} />
    </MemoryRouter>
  );
}

describe('LeagueTable', () => {
  it('renders loading spinner when loading', () => {
    render(
      <MemoryRouter>
        <LeagueTable standings={[]} loading={true} />
      </MemoryRouter>
    );
    expect(document.querySelector('.animate-spin')).toBeTruthy();
  });

  it('renders empty state message', () => {
    renderTable([]);
    expect(screen.getByText(/No standings available/i)).toBeInTheDocument();
  });

  it('renders standings with Form column header', () => {
    renderTable([makeEntry()]);
    expect(screen.getByText('Form')).toBeInTheDocument();
  });

  it('shows team short name', () => {
    renderTable([makeEntry({ shortName: 'LAK' })]);
    expect(screen.getByText('LAK')).toBeInTheDocument();
  });

  it('shows — when no matches available for team', () => {
    renderTable([makeEntry({ teamId: 'team1' })], []);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('shows form dots for completed matches', () => {
    const entry = makeEntry({ teamId: 'team1' });
    const win = makeMatch({ homeTeam: { id: 'team1', name: 'T1', shortName: 'T1' }, homeScore: 90, awayScore: 80, status: 'completed', date: '2026-03-05' });
    const loss = makeMatch({ homeTeam: { id: 'team1', name: 'T1', shortName: 'T1' }, homeScore: 70, awayScore: 85, status: 'completed', date: '2026-03-04' });
    renderTable([entry], [win, loss]);

    const winDots = document.querySelectorAll('.bg-green-500');
    const lossDots = document.querySelectorAll('.bg-red-400');
    expect(winDots.length).toBe(1);
    expect(lossDots.length).toBe(1);
  });

  it('shows at most 5 form dots', () => {
    const entry = makeEntry({ teamId: 'team1' });
    const matches = Array.from({ length: 8 }, (_, i) =>
      makeMatch({
        id: `m${i}`,
        homeTeam: { id: 'team1', name: 'T1', shortName: 'T1' },
        homeScore: 90,
        awayScore: 80,
        status: 'completed',
        date: `2026-03-${String(i + 1).padStart(2, '0')}`,
      })
    );
    renderTable([entry], matches);

    const allDots = document.querySelectorAll('.bg-green-500, .bg-red-400');
    expect(allDots.length).toBe(5);
  });

  it('counts away wins correctly', () => {
    const entry = makeEntry({ teamId: 'team1' });
    const awayWin = makeMatch({
      awayTeam: { id: 'team1', name: 'T1', shortName: 'T1' },
      homeScore: 70,
      awayScore: 85,
      status: 'completed',
      date: '2026-03-05',
    });
    renderTable([entry], [awayWin]);

    const winDots = document.querySelectorAll('.bg-green-500');
    expect(winDots.length).toBe(1);
  });

  it('shows form in most-recent-first order', () => {
    const entry = makeEntry({ teamId: 'team1' });
    const older = makeMatch({
      id: 'm1',
      homeTeam: { id: 'team1', name: 'T1', shortName: 'T1' },
      homeScore: 70,
      awayScore: 90,
      status: 'completed',
      date: '2026-03-01',
    });
    const newer = makeMatch({
      id: 'm2',
      homeTeam: { id: 'team1', name: 'T1', shortName: 'T1' },
      homeScore: 90,
      awayScore: 70,
      status: 'completed',
      date: '2026-03-10',
    });
    renderTable([entry], [older, newer]);

    const dots = document.querySelectorAll('.bg-green-500, .bg-red-400');
    expect(dots.length).toBe(2);
    // Most recent (win) should come first
    expect(dots[0].classList.contains('bg-green-500')).toBe(true);
    expect(dots[1].classList.contains('bg-red-400')).toBe(true);
  });

  it('does not include non-completed matches in form', () => {
    const entry = makeEntry({ teamId: 'team1' });
    const scheduled = makeMatch({
      homeTeam: { id: 'team1', name: 'T1', shortName: 'T1' },
      status: 'scheduled',
      homeScore: undefined,
      awayScore: undefined,
    });
    renderTable([entry], [scheduled]);

    expect(screen.getByText('—')).toBeInTheDocument();
  });
});
