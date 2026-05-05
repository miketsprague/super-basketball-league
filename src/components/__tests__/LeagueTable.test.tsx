import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LeagueTable } from '../LeagueTable';
import type { StandingsEntry } from '../../types';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function makeEntry(overrides: Partial<StandingsEntry> = {}): StandingsEntry {
  return {
    position: 1,
    team: { id: 't1', name: 'Team Alpha', shortName: 'ALP' },
    played: 10,
    won: 8,
    lost: 2,
    pointsFor: 800,
    pointsAgainst: 750,
    pointsDifference: 50,
    points: 16,
    ...overrides,
  };
}

const standings: StandingsEntry[] = [
  makeEntry({ position: 1, team: { id: 't1', name: 'Team Alpha', shortName: 'ALP' }, won: 8, lost: 2, points: 16, pointsDifference: 100 }),
  makeEntry({ position: 2, team: { id: 't2', name: 'Team Beta', shortName: 'BET' }, won: 7, lost: 3, points: 14, pointsDifference: 60 }),
  makeEntry({ position: 3, team: { id: 't3', name: 'Team Gamma', shortName: 'GAM' }, won: 6, lost: 4, points: 12, pointsDifference: 20 }),
  makeEntry({ position: 4, team: { id: 't4', name: 'Team Delta', shortName: 'DEL' }, won: 5, lost: 5, points: 10, pointsDifference: 0 }),
  makeEntry({ position: 5, team: { id: 't5', name: 'Team Epsilon', shortName: 'EPS' }, won: 2, lost: 8, points: 4, pointsDifference: -80 }),
  makeEntry({ position: 6, team: { id: 't6', name: 'Team Zeta', shortName: 'ZET' }, won: 1, lost: 9, points: 2, pointsDifference: -100 }),
];

function renderLeagueTable(overrides: Partial<{ standings: StandingsEntry[]; loading: boolean }> = {}) {
  return render(
    <MemoryRouter>
      <LeagueTable standings={standings} loading={false} {...overrides} />
    </MemoryRouter>
  );
}

describe('LeagueTable', () => {
  it('shows loading spinner when loading is true', () => {
    renderLeagueTable({ loading: true, standings: [] });

    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('shows empty-state message when standings are empty', () => {
    renderLeagueTable({ standings: [] });

    expect(screen.getByText('No standings available')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('renders a table with all standings entries', () => {
    renderLeagueTable();

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('ALP')).toBeInTheDocument();
    expect(screen.getByText('BET')).toBeInTheDocument();
    expect(screen.getByText('ZET')).toBeInTheDocument();
  });

  it('renders column headers', () => {
    renderLeagueTable();

    expect(screen.getByText('#')).toBeInTheDocument();
    expect(screen.getByText('Team')).toBeInTheDocument();
    expect(screen.getByText('P')).toBeInTheDocument();
    expect(screen.getByText('W')).toBeInTheDocument();
    expect(screen.getByText('L')).toBeInTheDocument();
  });

  it('navigates to team page when team name is clicked', () => {
    renderLeagueTable();

    fireEvent.click(screen.getByText('ALP'));

    expect(mockNavigate).toHaveBeenCalledWith('/team/Team%20Alpha');
  });

  it('shows positive points difference with a + prefix', () => {
    renderLeagueTable();

    // Team Alpha has pointsDifference: 100
    expect(screen.getByText('+100')).toBeInTheDocument();
  });

  it('shows negative points difference without + prefix', () => {
    renderLeagueTable();

    // Team Zeta has pointsDifference: -100
    expect(screen.getByText('-100')).toBeInTheDocument();
  });

  it('applies green background to top 4 (playoff) positions', () => {
    renderLeagueTable();

    const rows = screen.getAllByRole('row').slice(1); // skip header
    expect(rows[0].className).toContain('bg-green-50'); // position 1
    expect(rows[3].className).toContain('bg-green-50'); // position 4
    expect(rows[4].className).not.toContain('bg-green-50'); // position 5
  });

  it('applies red background to bottom 2 (relegation) positions', () => {
    renderLeagueTable();

    const rows = screen.getAllByRole('row').slice(1); // skip header
    expect(rows[4].className).toContain('bg-red-50'); // second-to-last
    expect(rows[5].className).toContain('bg-red-50'); // last
    expect(rows[3].className).not.toContain('bg-red-50'); // 4th
  });
});
