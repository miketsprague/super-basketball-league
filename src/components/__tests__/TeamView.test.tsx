import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { TeamView } from '../TeamView';

// Mock Fixtures to avoid rendering its internals
vi.mock('../Fixtures', () => ({
  Fixtures: ({ loading, matches }: { loading: boolean; matches: unknown[] }) => (
    <div data-testid="fixtures-stub">
      {loading ? 'Loading...' : `${matches.length} matches`}
    </div>
  ),
}));

vi.mock('../../services/dataProvider', () => ({
  fetchMatchesForTeam: vi.fn(),
}));

vi.mock('../../services/teamStorage', () => ({
  getFollowedTeam: vi.fn(),
  setFollowedTeam: vi.fn(),
  clearFollowedTeam: vi.fn(),
}));

import { fetchMatchesForTeam } from '../../services/dataProvider';
import { getFollowedTeam, setFollowedTeam, clearFollowedTeam } from '../../services/teamStorage';

const mockFetch = fetchMatchesForTeam as ReturnType<typeof vi.fn>;
const mockGetFollowed = getFollowedTeam as ReturnType<typeof vi.fn>;
const mockSetFollowed = setFollowedTeam as ReturnType<typeof vi.fn>;
const mockClearFollowed = clearFollowedTeam as ReturnType<typeof vi.fn>;

function makeMatch(id: string) {
  return {
    id,
    homeTeam: { id: 'h1', name: 'Home', shortName: 'HOM' },
    awayTeam: { id: 'a1', name: 'Away', shortName: 'AWY' },
    date: '2026-05-10',
    time: '19:00',
    venue: 'Test Arena',
    status: 'completed' as const,
    homeScore: 80,
    awayScore: 75,
  };
}

function renderTeamView(teamName: string) {
  return render(
    <MemoryRouter initialEntries={[`/team/${encodeURIComponent(teamName)}`]}>
      <Routes>
        <Route path="/team/:teamName" element={<TeamView />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('TeamView', () => {
  beforeEach(() => {
    mockFetch.mockResolvedValue([]);
    mockGetFollowed.mockReturnValue(undefined);
    mockSetFollowed.mockReturnValue(undefined);
    mockClearFollowed.mockReturnValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('shows team name in banner', async () => {
    mockFetch.mockResolvedValue([]);
    renderTeamView('Barcelona');

    await waitFor(() => {
      expect(screen.getByText('Barcelona')).toBeInTheDocument();
    });
    expect(screen.getByText('All fixtures across all leagues')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    mockFetch.mockImplementation(() => new Promise(() => {}));
    renderTeamView('Barcelona');

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows matches after successful fetch', async () => {
    mockFetch.mockResolvedValue([makeMatch('m1'), makeMatch('m2')]);
    renderTeamView('Barcelona');

    await waitFor(() => {
      expect(screen.getByText('2 matches')).toBeInTheDocument();
    });
  });

  it('shows error message when fetch fails', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));
    renderTeamView('Barcelona');

    await waitFor(() => {
      expect(screen.getByText('Unable to load fixtures for this team')).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('retries fetch when Try Again is clicked', async () => {
    mockFetch.mockRejectedValueOnce(new Error('fail'));
    mockFetch.mockResolvedValue([makeMatch('m1')]);
    renderTeamView('Barcelona');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /try again/i }));
    });

    await waitFor(() => {
      expect(screen.getByText('1 matches')).toBeInTheDocument();
    });
  });

  it('shows Follow button when team is not followed', async () => {
    mockGetFollowed.mockReturnValue(undefined);
    mockFetch.mockResolvedValue([]);
    renderTeamView('Barcelona');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /follow/i })).toBeInTheDocument();
    });
    expect(screen.queryByRole('button', { name: /following/i })).toBeNull();
  });

  it('shows Following button when team is already followed', async () => {
    mockGetFollowed.mockReturnValue({ name: 'Barcelona' });
    mockFetch.mockResolvedValue([]);
    renderTeamView('Barcelona');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /following/i })).toBeInTheDocument();
    });
  });

  it('follows team when Follow button is clicked', async () => {
    mockGetFollowed.mockReturnValue(undefined);
    mockFetch.mockResolvedValue([]);
    renderTeamView('Barcelona');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /follow/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /follow/i }));

    expect(mockSetFollowed).toHaveBeenCalledWith({ name: 'Barcelona' });
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /following/i })).toBeInTheDocument();
    });
  });

  it('unfollows team when Following button is clicked', async () => {
    mockGetFollowed.mockReturnValue({ name: 'Barcelona' });
    mockFetch.mockResolvedValue([]);
    renderTeamView('Barcelona');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /following/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /following/i }));

    expect(mockClearFollowed).toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /follow/i })).toBeInTheDocument();
    });
  });

  it('decodes URL-encoded team names correctly', async () => {
    mockFetch.mockResolvedValue([]);
    renderTeamView('Real Madrid');

    await waitFor(() => {
      expect(screen.getByText('Real Madrid')).toBeInTheDocument();
    });
    expect(mockFetch).toHaveBeenCalledWith('Real Madrid');
  });

  it('shows copyright footer with current year', async () => {
    mockFetch.mockResolvedValue([]);
    renderTeamView('Barcelona');

    await waitFor(() => {
      expect(screen.getByText(new RegExp(`Basketball Leagues © ${new Date().getFullYear()}`))).toBeInTheDocument();
    });
  });

  it('auto-refreshes every 5 minutes', async () => {
    vi.useFakeTimers();
    mockFetch.mockResolvedValue([]);
    renderTeamView('Barcelona');

    await act(async () => {
      await Promise.resolve();
    });
    expect(mockFetch).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(5 * 60 * 1000 + 1);
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
