import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { Match, StandingsEntry } from '../../types';

// Mock service modules
vi.mock('../../services/dataProvider');
vi.mock('../../services/teamStorage');

// Import after mocking
import * as dataProvider from '../../services/dataProvider';
import * as teamStorage from '../../services/teamStorage';
import App from '../../App';

// Helpers

/** Future-dated scheduled match — visible in the default Fixtures tab */
function makeMatch(overrides: Partial<Match> = {}): Match {
  return {
    id: '1',
    homeTeam: { id: 'h1', name: 'London Lions', shortName: 'Lions' },
    awayTeam: { id: 'a1', name: 'Leicester Riders', shortName: 'Riders' },
    date: '2030-06-01',
    time: '19:30',
    venue: 'Copper Box Arena',
    status: 'scheduled',
    ...overrides,
  };
}

function makeStanding(overrides: Partial<StandingsEntry> = {}): StandingsEntry {
  return {
    position: 1,
    team: { id: 't1', name: 'London Lions', shortName: 'Lions' },
    played: 10,
    won: 8,
    lost: 2,
    pointsFor: 800,
    pointsAgainst: 700,
    pointsDifference: 100,
    ...overrides,
  };
}

function renderApp(route = '/') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );
}

describe('App', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(teamStorage.getFollowedTeam).mockReturnValue(null);
    vi.mocked(dataProvider.fetchLeagues).mockResolvedValue([
      { id: 'super-league', name: 'SLB Championship', shortName: 'Championship', country: 'England' },
      { id: 'euroleague', name: 'EuroLeague', shortName: 'EuroLeague', country: 'Europe' },
    ]);
    vi.mocked(dataProvider.fetchAllData).mockResolvedValue({
      matches: [makeMatch()],
      standings: [makeStanding()],
    });
  });

  describe('HomePage rendering', () => {
    it('renders the header', async () => {
      renderApp();
      expect(screen.getByText('🏀 Basketball Leagues')).toBeInTheDocument();
    });

    it('renders the footer with current year', async () => {
      renderApp();
      const year = new Date().getFullYear();
      expect(screen.getByText(`Basketball Leagues © ${year}`)).toBeInTheDocument();
    });

    it('renders league selector tabs', async () => {
      renderApp();
      await waitFor(() => {
        expect(screen.getByText('Championship')).toBeInTheDocument();
      });
    });

    it('renders Fixtures & Results tab button', () => {
      renderApp();
      expect(screen.getByText('Fixtures & Results')).toBeInTheDocument();
    });

    it('renders League Table tab button for leagues with standings', async () => {
      renderApp();
      await waitFor(() => {
        expect(screen.getByText('League Table')).toBeInTheDocument();
      });
    });
  });

  describe('Loading state', () => {
    it('shows loading state while fetching data', async () => {
      // fetchAllData never resolves during this test — loading skeleton visible
      let resolveData: (value: { matches: Match[]; standings: StandingsEntry[] }) => void;
      vi.mocked(dataProvider.fetchAllData).mockReturnValue(
        new Promise(resolve => { resolveData = resolve; })
      );

      renderApp();

      // Loading spinner/skeleton from Fixtures component is visible
      const spinners = document.querySelectorAll('.animate-spin, .animate-pulse');
      expect(spinners.length).toBeGreaterThan(0);

      // Resolve to prevent warnings
      resolveData!({ matches: [], standings: [] });
    });
  });

  describe('Data loaded state', () => {
    it('shows fixtures after data loads', async () => {
      renderApp();

      await waitFor(() => {
        // Fixtures renders shortName — 'Lions' for the home team
        expect(screen.getByText('Lions')).toBeInTheDocument();
      });
    });
  });

  describe('Error state', () => {
    it('shows error message when fetchAllData fails', async () => {
      vi.mocked(dataProvider.fetchAllData).mockRejectedValue(
        new Error('Network error')
      );

      renderApp();

      await waitFor(() => {
        expect(screen.getByText(/Unable to load data/i)).toBeInTheDocument();
      });
    });

    it('shows Try Again button on error', async () => {
      vi.mocked(dataProvider.fetchAllData).mockRejectedValue(
        new Error('Network error')
      );

      renderApp();

      await waitFor(() => {
        expect(screen.getByText('Try Again')).toBeInTheDocument();
      });
    });

    it('retries when Try Again button is clicked', async () => {
      vi.mocked(dataProvider.fetchAllData)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({ matches: [makeMatch()], standings: [] });

      renderApp();

      await waitFor(() => {
        expect(screen.getByText('Try Again')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Try Again'));

      // Error clears and fixtures load
      await waitFor(() => {
        expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
      });

      // fetchAllData called twice — initial + retry
      expect(vi.mocked(dataProvider.fetchAllData)).toHaveBeenCalledTimes(2);
    });

    it('shows leagues error banner but keeps page functional', async () => {
      vi.mocked(dataProvider.fetchLeagues).mockRejectedValue(
        new Error('Leagues unavailable')
      );

      renderApp();

      await waitFor(() => {
        expect(screen.getByText(/Failed to load leagues/i)).toBeInTheDocument();
      });

      // Main content still renders (fixtures tab loads)
      await waitFor(() => {
        expect(screen.getByText('Fixtures & Results')).toBeInTheDocument();
      });
    });
  });

  describe('Tab navigation', () => {
    it('switches to League Table tab when clicked', async () => {
      renderApp();

      await waitFor(() => {
        expect(screen.getByText('League Table')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('League Table'));

      // LeagueTable renders team shortName from standings
      await waitFor(() => {
        // 'Lions' is the shortName from makeStanding
        expect(screen.getByText('Lions')).toBeInTheDocument();
      });
    });

    it('switches back to Fixtures tab after visiting League Table', async () => {
      renderApp();

      await waitFor(() => {
        expect(screen.getByText('League Table')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('League Table'));
      fireEvent.click(screen.getByText('Fixtures & Results'));

      await waitFor(() => {
        // Back on fixtures tab — the Fixtures component is rendered
        expect(screen.getByText('Fixtures & Results')).toBeInTheDocument();
      });
    });
  });

  describe('League selection', () => {
    it('fetches data again when a different league is selected', async () => {
      renderApp();

      await waitFor(() => {
        expect(screen.getByText('EuroLeague')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('EuroLeague'));

      await waitFor(() => {
        expect(vi.mocked(dataProvider.fetchAllData)).toHaveBeenCalledWith('euroleague');
      });
    });
  });

  describe('Followed team', () => {
    it('shows My Team button when a team is followed', async () => {
      vi.mocked(teamStorage.getFollowedTeam).mockReturnValue({
        id: 't1',
        name: 'London Lions',
        shortName: 'Lions',
      });

      renderApp();

      // My Team button appears once leagues load
      await waitFor(() => {
        expect(screen.getByText('My Team')).toBeInTheDocument();
      });
    });

    it('does not show My Team button when no team is followed', async () => {
      vi.mocked(teamStorage.getFollowedTeam).mockReturnValue(null);

      renderApp();

      await waitFor(() => {
        // Wait for leagues to load
        expect(screen.getByText('Championship')).toBeInTheDocument();
      });

      expect(screen.queryByText('My Team')).not.toBeInTheDocument();
    });
  });

  describe('Routing', () => {
    it('renders MatchDetail for /match/:matchId route', () => {
      // MatchDetail fetches its own data; just confirm routing works
      vi.mocked(dataProvider.fetchAllData).mockResolvedValue({ matches: [], standings: [] });

      render(
        <MemoryRouter initialEntries={['/match/test-match-id?league=super-league']}>
          <App />
        </MemoryRouter>
      );

      // MatchDetail renders a loading state or back button — check it's not the homepage header
      // The match detail page shows a back-navigation or loading indicator
      // The homepage "🏀 Basketball Leagues" header should NOT be visible
      expect(screen.queryByText('Fixtures & Results')).not.toBeInTheDocument();
    });
  });
});
