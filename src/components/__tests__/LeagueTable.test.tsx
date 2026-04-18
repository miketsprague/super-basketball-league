import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LeagueTable } from '../LeagueTable';
import type { StandingsEntry } from '../../types';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function makeEntry(overrides: Partial<StandingsEntry> & { id: string; name: string; shortName: string }): StandingsEntry {
  return {
    position: 1,
    team: { id: overrides.id, name: overrides.name, shortName: overrides.shortName },
    played: 10,
    won: 7,
    lost: 3,
    pointsFor: 800,
    pointsAgainst: 750,
    pointsDifference: 50,
    points: 14,
    ...overrides,
  };
}

const standings: StandingsEntry[] = [
  makeEntry({ id: 't1', name: 'Team Alpha', shortName: 'TAlpha', position: 1, won: 9, lost: 1, points: 18, pointsDifference: 100 }),
  makeEntry({ id: 't2', name: 'Team Beta', shortName: 'TBeta', position: 2, won: 8, lost: 2, points: 16, pointsDifference: 80 }),
  makeEntry({ id: 't3', name: 'Team Gamma', shortName: 'TGamma', position: 3, won: 7, lost: 3, points: 14, pointsDifference: 60 }),
  makeEntry({ id: 't4', name: 'Team Delta', shortName: 'TDelta', position: 4, won: 6, lost: 4, points: 12, pointsDifference: 20 }),
  makeEntry({ id: 't5', name: 'Team Epsilon', shortName: 'TEps', position: 5, won: 5, lost: 5, points: 10, pointsDifference: 0 }),
  makeEntry({ id: 't6', name: 'Team Zeta', shortName: 'TZeta', position: 6, won: 4, lost: 6, points: 8, pointsDifference: -20 }),
  makeEntry({ id: 't7', name: 'Team Eta', shortName: 'TEta', position: 7, won: 3, lost: 7, points: 6, pointsDifference: -50 }),
  makeEntry({ id: 't8', name: 'Team Theta', shortName: 'TTheta', position: 8, won: 2, lost: 8, points: 4, pointsDifference: -80 }),
];

function renderTable(props: Partial<Parameters<typeof LeagueTable>[0]> = {}) {
  const defaults = { standings, loading: false };
  return render(
    <MemoryRouter>
      <LeagueTable {...defaults} {...props} />
    </MemoryRouter>
  );
}

describe('LeagueTable', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders all team short names', () => {
    renderTable();
    standings.forEach((entry) => {
      expect(screen.getByText(entry.team.shortName)).toBeInTheDocument();
    });
  });

  it('renders column headers', () => {
    renderTable();
    expect(screen.getByText('Team')).toBeInTheDocument();
    expect(screen.getByText('P')).toBeInTheDocument();
    expect(screen.getByText('W')).toBeInTheDocument();
    expect(screen.getByText('L')).toBeInTheDocument();
    expect(screen.getByText('Pts')).toBeInTheDocument();
  });

  it('renders position numbers', () => {
    renderTable();
    // Position numbers appear in the table — use getAllByText since numbers may appear in multiple cells
    expect(screen.getAllByText('1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('8').length).toBeGreaterThan(0);
  });

  it('renders positive point difference with + sign', () => {
    renderTable();
    expect(screen.getByText('+100')).toBeInTheDocument();
  });

  it('renders negative point difference without + sign', () => {
    renderTable();
    expect(screen.getByText('-80')).toBeInTheDocument();
  });

  it('renders zero point difference without + sign', () => {
    renderTable();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('shows loading spinner when loading=true', () => {
    const { container } = renderTable({ loading: true });
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('does not render table while loading', () => {
    renderTable({ loading: true });
    expect(screen.queryByText('Team')).not.toBeInTheDocument();
    expect(screen.queryByText('TAlpha')).not.toBeInTheDocument();
  });

  it('shows empty state when standings is empty', () => {
    renderTable({ standings: [] });
    expect(screen.getByText('No standings available')).toBeInTheDocument();
  });

  it('shows explanatory text in empty state', () => {
    renderTable({ standings: [] });
    expect(screen.getByText(/progressed beyond the group stage/i)).toBeInTheDocument();
  });

  it('does not render table in empty state', () => {
    renderTable({ standings: [] });
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('navigates to team page when team name is clicked', () => {
    renderTable();
    // The button shows shortName; clicking it navigates using the full team name
    fireEvent.click(screen.getByText('TAlpha'));
    expect(mockNavigate).toHaveBeenCalledWith('/team/Team%20Alpha');
  });

  it('URL-encodes team names on navigation', () => {
    const entry = makeEntry({ id: 'tx', name: 'Anadolu Efes S.K.', shortName: 'AEfes', position: 1 });
    renderTable({ standings: [entry] });
    fireEvent.click(screen.getByText('AEfes'));
    expect(mockNavigate).toHaveBeenCalledWith('/team/Anadolu%20Efes%20S.K.');
  });

  it('applies green background to top 4 teams', () => {
    renderTable();
    const rows = screen.getAllByRole('row').slice(1); // skip header
    expect(rows[0]).toHaveClass('bg-green-50');
    expect(rows[3]).toHaveClass('bg-green-50');
    expect(rows[4]).not.toHaveClass('bg-green-50');
  });

  it('applies red background to bottom 2 teams', () => {
    renderTable();
    const rows = screen.getAllByRole('row').slice(1);
    expect(rows[6]).toHaveClass('bg-red-50');
    expect(rows[7]).toHaveClass('bg-red-50');
    expect(rows[5]).not.toHaveClass('bg-red-50');
  });

  it('shows playoff legend text', () => {
    renderTable();
    expect(screen.getByText(/Playoff positions/i)).toBeInTheDocument();
  });

  it('shows relegation zone legend text', () => {
    renderTable();
    expect(screen.getByText(/Relegation zone/i)).toBeInTheDocument();
  });
});
