import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';
import * as dataProvider from '../../services/dataProvider';
import type { Match, League } from '../../types';

vi.mock('../../services/dataProvider');
vi.mock('../../services/teamStorage', () => ({
  getFollowedTeam: () => null,
  matchInvolvesTeam: () => false,
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => vi.fn() };
});

const makeTeam = (id: string) => ({ id, name: `Team ${id}`, shortName: `T${id}` });

const makeMatch = (id: string, status: Match['status']): Match => ({
  id,
  homeTeam: makeTeam('1'),
  awayTeam: makeTeam('2'),
  homeScore: status === 'live' ? 55 : undefined,
  awayScore: status === 'live' ? 48 : undefined,
  date: '2026-05-17',
  time: '19:30',
  venue: 'Arena',
  status,
});

const mockLeague: League = {
  id: 'slb',
  name: 'Super League Basketball',
  shortName: 'SLB',
  country: 'GB',
};

beforeEach(() => {
  vi.mocked(dataProvider.fetchLeagues).mockResolvedValue([mockLeague]);
  vi.mocked(dataProvider.fetchAllData).mockResolvedValue({ matches: [], standings: [] });
});

describe('live match indicator in Fixtures & Results tab', () => {
  it('does not show LIVE badge when there are no live matches', async () => {
    vi.mocked(dataProvider.fetchAllData).mockResolvedValue({
      matches: [makeMatch('m1', 'scheduled'), makeMatch('m2', 'completed')],
      standings: [],
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await screen.findByText('Fixtures & Results');
    expect(screen.queryByText('LIVE')).not.toBeInTheDocument();
  });

  it('shows LIVE badge when there is one live match', async () => {
    vi.mocked(dataProvider.fetchAllData).mockResolvedValue({
      matches: [makeMatch('m1', 'live')],
      standings: [],
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // The tab badge is identified by aria-label; wait for it to appear
    await screen.findByLabelText('1 live match');
    expect(screen.getByLabelText('1 live match')).toBeInTheDocument();
  });

  it('shows LIVE badge with correct aria-label for a single live match', async () => {
    vi.mocked(dataProvider.fetchAllData).mockResolvedValue({
      matches: [makeMatch('m1', 'live')],
      standings: [],
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await screen.findByLabelText('1 live match');
    expect(screen.getByLabelText('1 live match')).toBeInTheDocument();
  });

  it('shows LIVE badge with plural aria-label for multiple live matches', async () => {
    vi.mocked(dataProvider.fetchAllData).mockResolvedValue({
      matches: [makeMatch('m1', 'live'), makeMatch('m2', 'live')],
      standings: [],
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await screen.findByLabelText('2 live matches');
    expect(screen.getByLabelText('2 live matches')).toBeInTheDocument();
  });

  it('does not show LIVE badge when only completed and scheduled matches exist', async () => {
    vi.mocked(dataProvider.fetchAllData).mockResolvedValue({
      matches: [makeMatch('m1', 'completed'), makeMatch('m2', 'scheduled'), makeMatch('m3', 'completed')],
      standings: [],
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await screen.findByText('Fixtures & Results');
    expect(screen.queryByText('LIVE')).not.toBeInTheDocument();
  });
});
