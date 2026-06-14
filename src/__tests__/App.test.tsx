import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import type { Match, League } from '../types';

// Mock API modules
vi.mock('../services/dataProvider', () => ({
  fetchAllData: vi.fn(),
  fetchLeagues: vi.fn(),
  fetchMatchDetails: vi.fn(),
  fetchMatchesForTeam: vi.fn(),
  APIError: class APIError extends Error {
    constructor(message: string, public statusCode?: number) {
      super(message);
    }
  },
}));

vi.mock('../services/teamStorage', () => ({
  getFollowedTeam: vi.fn(() => null),
  setFollowedTeam: vi.fn(),
  clearFollowedTeam: vi.fn(),
  normaliseTeamName: vi.fn((n: string) => n.toLowerCase()),
  matchInvolvesTeam: vi.fn(() => false),
}));

import * as dataProvider from '../services/dataProvider';

const mockFetchAllData = vi.mocked(dataProvider.fetchAllData);
const mockFetchLeagues = vi.mocked(dataProvider.fetchLeagues);

function makeMatch(overrides: Partial<Match> = {}): Match {
  return {
    id: 'match-1',
    homeTeam: { id: 'h1', name: 'Home FC', shortName: 'HOM' },
    awayTeam: { id: 'a1', name: 'Away FC', shortName: 'AWY' },
    date: new Date().toISOString().split('T')[0], // today
    time: '19:00',
    venue: 'Test Arena',
    status: 'scheduled',
    ...overrides,
  };
}

function renderApp() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );
}

// Tests that do not need timer control use real timers + waitFor.
describe('App — initial load behaviour', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchLeagues.mockResolvedValue([] as League[]);
  });

  it('shows an error message when the initial load fails', async () => {
    mockFetchAllData.mockRejectedValue(new Error('Network error'));

    renderApp();

    await waitFor(() => {
      expect(screen.getByText(/Unable to load data/i)).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
  });

  it('clears stale data and shows error when initial load fails', async () => {
    mockFetchAllData.mockRejectedValue(new Error('Connection refused'));

    renderApp();

    await waitFor(() => {
      expect(screen.getByText(/Unable to load data/i)).toBeInTheDocument();
    });

    // No stale match data should leak through
    expect(screen.queryByText('HOM')).not.toBeInTheDocument();
  });

  it('shows data after a successful retry following initial load failure', async () => {
    // Initial load fails
    mockFetchAllData.mockRejectedValueOnce(new Error('Server error'));
    renderApp();

    await waitFor(() => {
      expect(screen.getByText(/Unable to load data/i)).toBeInTheDocument();
    });

    // Retry succeeds
    const match = makeMatch();
    mockFetchAllData.mockResolvedValueOnce({ matches: [match], standings: [] });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Try Again/i }));
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(screen.queryByText(/Unable to load data/i)).not.toBeInTheDocument();
    });
  });
});

// Tests that control the auto-refresh timer use fake timers.
// NOTE: vi.useFakeTimers() freezes waitFor's internal polling, so we use
// act + Promise.resolve() to flush promises instead.
describe('App — auto-refresh data loss fix', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchLeagues.mockResolvedValue([] as League[]);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('preserves displayed data when an auto-refresh fails', async () => {
    const match = makeMatch();
    // Initial load succeeds
    mockFetchAllData.mockResolvedValueOnce({ matches: [match], standings: [] });

    renderApp();

    // Flush the initial fetch (useEffect + fetchAllData + fetchLeagues)
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });

    // Data must be visible after initial load
    expect(screen.getByText('HOM')).toBeInTheDocument();
    expect(screen.getByText('AWY')).toBeInTheDocument();

    // Next auto-refresh fails
    mockFetchAllData.mockRejectedValueOnce(new Error('Temporary network error'));

    await act(async () => {
      vi.advanceTimersByTime(5 * 60 * 1000 + 100);
      await Promise.resolve();
      await Promise.resolve();
    });

    // Data must still be visible — the fix ensures it is not cleared
    expect(screen.getByText('HOM')).toBeInTheDocument();
    expect(screen.getByText('AWY')).toBeInTheDocument();

    // No blocking error message shown for a background refresh failure
    expect(screen.queryByText(/Unable to load data/i)).not.toBeInTheDocument();
  });

  it('does not show a retry button after an auto-refresh failure', async () => {
    const match = makeMatch();
    mockFetchAllData.mockResolvedValueOnce({ matches: [match], standings: [] });

    renderApp();

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(screen.getByText('HOM')).toBeInTheDocument();

    mockFetchAllData.mockRejectedValueOnce(new Error('Timeout'));

    await act(async () => {
      vi.advanceTimersByTime(5 * 60 * 1000 + 100);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(screen.queryByRole('button', { name: /Try Again/i })).not.toBeInTheDocument();
  });
});
