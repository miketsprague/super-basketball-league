import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { TeamView } from '../TeamView';
import type { Match } from '../../types';

// Mock the data provider
vi.mock('../../services/dataProvider', () => ({
  fetchMatchesForTeam: vi.fn(),
}));

// Mock the team storage service
vi.mock('../../services/teamStorage', () => ({
  getFollowedTeam: vi.fn(),
  setFollowedTeam: vi.fn(),
  clearFollowedTeam: vi.fn(),
}));

import { fetchMatchesForTeam } from '../../services/dataProvider';
import { getFollowedTeam, setFollowedTeam, clearFollowedTeam } from '../../services/teamStorage';

const mockFetchMatchesForTeam = vi.mocked(fetchMatchesForTeam);
const mockGetFollowedTeam = vi.mocked(getFollowedTeam);
const mockSetFollowedTeam = vi.mocked(setFollowedTeam);
const mockClearFollowedTeam = vi.mocked(clearFollowedTeam);

const FUTURE_DATE = '2099-01-01';
const PAST_DATE = '2020-01-01';

const mockMatch: Match = {
  id: 'match-1',
  homeTeam: { id: 'team-1', name: 'Home Team', shortName: 'HOM' },
  awayTeam: { id: 'team-2', name: 'Away Team', shortName: 'AWY' },
  date: FUTURE_DATE,
  time: '19:00',
  venue: 'Test Arena',
  status: 'scheduled',
  leagueName: 'Test League',
};

const mockCompletedMatch: Match = {
  id: 'match-2',
  homeTeam: { id: 'team-1', name: 'Home Team', shortName: 'HOM' },
  awayTeam: { id: 'team-2', name: 'Away Team', shortName: 'AWY' },
  homeScore: 85,
  awayScore: 72,
  date: PAST_DATE,
  time: '19:00',
  venue: 'Test Arena',
  status: 'completed',
  leagueName: 'Test League',
};

function renderTeamView(teamName: string = 'Home Team') {
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
    vi.clearAllMocks();
    mockGetFollowedTeam.mockReturnValue(null);
    mockFetchMatchesForTeam.mockResolvedValue([]);
  });

  describe('rendering', () => {
    it('shows the team name in the banner', async () => {
      mockFetchMatchesForTeam.mockResolvedValue([mockMatch]);
      renderTeamView('Home Team');
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Home Team' })).toBeInTheDocument();
      });
    });

    it('shows "All fixtures across all leagues" subtitle', async () => {
      renderTeamView('Home Team');
      await waitFor(() => {
        expect(screen.getByText('All fixtures across all leagues')).toBeInTheDocument();
      });
    });

    it('shows a Back button in the header', async () => {
      renderTeamView('Home Team');
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
      });
    });

    it('renders a loading spinner initially', () => {
      // Keep the promise pending so loading state is visible
      mockFetchMatchesForTeam.mockReturnValue(new Promise(() => {}));
      renderTeamView('Home Team');
      // The spinner is rendered by the Fixtures component during loading
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('no team selected', () => {
    it('shows "No team selected" when teamName param is empty', () => {
      render(
        <MemoryRouter initialEntries={['/team/']}>
          <Routes>
            <Route path="/team/" element={<TeamView />} />
          </Routes>
        </MemoryRouter>
      );
      expect(screen.getByText('No team selected')).toBeInTheDocument();
    });
  });

  describe('data loading', () => {
    it('calls fetchMatchesForTeam with the decoded team name', async () => {
      mockFetchMatchesForTeam.mockResolvedValue([]);
      renderTeamView('Home Team');
      await waitFor(() => {
        expect(mockFetchMatchesForTeam).toHaveBeenCalledWith('Home Team');
      });
    });

    it('URL-decodes the team name before fetching', async () => {
      mockFetchMatchesForTeam.mockResolvedValue([]);
      renderTeamView('Fenerbahçe Basketball');
      await waitFor(() => {
        expect(mockFetchMatchesForTeam).toHaveBeenCalledWith('Fenerbahçe Basketball');
      });
    });

    it('shows error message when fetch fails', async () => {
      mockFetchMatchesForTeam.mockRejectedValue(new Error('Network error'));
      renderTeamView('Home Team');
      await waitFor(() => {
        expect(screen.getByText('Unable to load fixtures for this team')).toBeInTheDocument();
      });
    });

    it('shows a Try Again button on error', async () => {
      mockFetchMatchesForTeam.mockRejectedValue(new Error('Network error'));
      renderTeamView('Home Team');
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
      });
    });

    it('retries fetch when Try Again is clicked', async () => {
      mockFetchMatchesForTeam.mockRejectedValueOnce(new Error('Network error'));
      mockFetchMatchesForTeam.mockResolvedValueOnce([]);
      renderTeamView('Home Team');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /try again/i }));
      await waitFor(() => {
        expect(mockFetchMatchesForTeam).toHaveBeenCalledTimes(2);
      });
    });

    it('shows "No fixtures available" when there are no matches', async () => {
      mockFetchMatchesForTeam.mockResolvedValue([]);
      renderTeamView('Home Team');
      await waitFor(() => {
        expect(screen.getByText('No fixtures available')).toBeInTheDocument();
      });
    });
  });

  describe('follow/unfollow', () => {
    it('shows a Follow button when team is not followed', async () => {
      mockGetFollowedTeam.mockReturnValue(null);
      renderTeamView('Home Team');
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /follow/i })).toBeInTheDocument();
      });
    });

    it('shows a Following button when team is already followed', async () => {
      mockGetFollowedTeam.mockReturnValue({ name: 'Home Team' });
      renderTeamView('Home Team');
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /following/i })).toBeInTheDocument();
      });
    });

    it('calls setFollowedTeam when Follow is clicked', async () => {
      mockGetFollowedTeam.mockReturnValue(null);
      renderTeamView('Home Team');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /follow/i })).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /follow/i }));
      expect(mockSetFollowedTeam).toHaveBeenCalledWith({ name: 'Home Team' });
    });

    it('calls clearFollowedTeam when Following is clicked', async () => {
      mockGetFollowedTeam.mockReturnValue({ name: 'Home Team' });
      renderTeamView('Home Team');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /following/i })).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /following/i }));
      expect(mockClearFollowedTeam).toHaveBeenCalled();
    });

    it('toggles from following to not following on click', async () => {
      mockGetFollowedTeam.mockReturnValue({ name: 'Home Team' });
      renderTeamView('Home Team');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /following/i })).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /following/i }));

      await waitFor(() => {
        // Button text reverts to "Follow" (not "Following") after unfollow
        expect(screen.getByText('Follow')).toBeInTheDocument();
        expect(screen.queryByText('Following')).not.toBeInTheDocument();
      });
    });

    it('does not show Following for a different team', async () => {
      mockGetFollowedTeam.mockReturnValue({ name: 'Other Team' });
      renderTeamView('Home Team');

      await waitFor(() => {
        expect(screen.getByText('Follow')).toBeInTheDocument();
        expect(screen.queryByText('Following')).not.toBeInTheDocument();
      });
    });
  });

  describe('fixtures rendering', () => {
    it('renders matches via the Fixtures component', async () => {
      mockFetchMatchesForTeam.mockResolvedValue([mockMatch, mockCompletedMatch]);
      renderTeamView('Home Team');
      await waitFor(() => {
        // Fixtures tab buttons should be visible
        expect(screen.getByRole('button', { name: /fixtures/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /results/i })).toBeInTheDocument();
      });
    });

    it('passes showLeagueName to Fixtures so league badges are visible', async () => {
      mockFetchMatchesForTeam.mockResolvedValue([mockMatch]);
      renderTeamView('Home Team');
      await waitFor(() => {
        expect(screen.getByText('Test League')).toBeInTheDocument();
      });
    });
  });

  describe('footer', () => {
    it('renders a footer with the current year', async () => {
      renderTeamView('Home Team');
      const year = new Date().getFullYear().toString();
      await waitFor(() => {
        expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
      });
    });
  });
});
