import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { Match } from '../../types';

// Mock navigation
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => vi.fn() };
});

// Mock dataProvider
vi.mock('../../services/dataProvider');
vi.mock('../../services/leagues', async () => {
  const actual = await vi.importActual('../../services/leagues');
  return actual;
});
vi.mock('../../services/teamStorage', () => ({
  getFollowedTeam: () => null,
}));

import * as dataProvider from '../../services/dataProvider';
import App from '../../App';

function makeMatch(overrides: Partial<Match> = {}): Match {
  return {
    id: '1',
    homeTeam: { id: 'h1', name: 'Home Team', shortName: 'HOM' },
    awayTeam: { id: 'a1', name: 'Away Team', shortName: 'AWY' },
    date: '2026-06-01',
    time: '19:00',
    venue: 'Test Arena',
    status: 'scheduled',
    ...overrides,
  };
}

const NORMAL_INTERVAL = 5 * 60 * 1000; // 5 minutes
const LIVE_INTERVAL   = 30 * 1000;     // 30 seconds

describe('App adaptive polling', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(dataProvider.fetchLeagues).mockResolvedValue([]);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('polls on the normal 5-minute interval when no live matches', async () => {
    vi.mocked(dataProvider.fetchAllData).mockResolvedValue({
      matches: [makeMatch({ status: 'scheduled' })],
      standings: [],
    });

    render(<MemoryRouter><App /></MemoryRouter>);

    // Wait for initial fetch
    await act(async () => { await Promise.resolve(); });
    expect(dataProvider.fetchAllData).toHaveBeenCalledTimes(1);

    // Advance less than 5 minutes — no extra fetch
    await act(async () => { vi.advanceTimersByTime(NORMAL_INTERVAL - 1000); });
    expect(dataProvider.fetchAllData).toHaveBeenCalledTimes(1);

    // Advance past the 5-minute mark — one more fetch
    await act(async () => { vi.advanceTimersByTime(2000); });
    expect(dataProvider.fetchAllData).toHaveBeenCalledTimes(2);
  });

  it('polls on the fast 30-second interval when live matches are present', async () => {
    vi.mocked(dataProvider.fetchAllData).mockResolvedValue({
      matches: [makeMatch({ status: 'live' })],
      standings: [],
    });

    render(<MemoryRouter><App /></MemoryRouter>);

    await act(async () => { await Promise.resolve(); });
    expect(dataProvider.fetchAllData).toHaveBeenCalledTimes(1);

    // Advance past 30 seconds — should trigger a re-fetch
    await act(async () => { vi.advanceTimersByTime(LIVE_INTERVAL + 1000); });
    expect(dataProvider.fetchAllData).toHaveBeenCalledTimes(2);
  });

  it('does not re-fetch after 30 s when no live matches', async () => {
    vi.mocked(dataProvider.fetchAllData).mockResolvedValue({
      matches: [makeMatch({ status: 'completed' })],
      standings: [],
    });

    render(<MemoryRouter><App /></MemoryRouter>);
    await act(async () => { await Promise.resolve(); });

    // 30 s passes — still only one fetch (normal interval is 5 min)
    await act(async () => { vi.advanceTimersByTime(LIVE_INTERVAL + 1000); });
    expect(dataProvider.fetchAllData).toHaveBeenCalledTimes(1);
  });

  it('shows the live-refresh banner when live matches exist', async () => {
    vi.mocked(dataProvider.fetchAllData).mockResolvedValue({
      matches: [makeMatch({ status: 'live' })],
      standings: [],
    });

    render(<MemoryRouter><App /></MemoryRouter>);
    await act(async () => { await Promise.resolve(); });

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(/refreshing every 30/i);
  });

  it('does not show the live-refresh banner when no live matches', async () => {
    vi.mocked(dataProvider.fetchAllData).mockResolvedValue({
      matches: [makeMatch({ status: 'scheduled' })],
      standings: [],
    });

    render(<MemoryRouter><App /></MemoryRouter>);
    await act(async () => { await Promise.resolve(); });

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
