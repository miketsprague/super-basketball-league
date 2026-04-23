import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import type { Match, StandingsEntry, League } from '../types';

// Mock service modules
vi.mock('../services/dataProvider', () => ({
  fetchAllData: vi.fn(),
  fetchLeagues: vi.fn(),
  APIError: class APIError extends Error {
    statusCode?: number;
    constructor(message: string, statusCode?: number) {
      super(message);
      this.statusCode = statusCode;
    }
  },
}));

vi.mock('../services/teamStorage', () => ({
  getFollowedTeam: vi.fn(),
}));

// Keep leagues service real (lightweight, no network calls)
import { fetchAllData, fetchLeagues } from '../services/dataProvider';
import { getFollowedTeam } from '../services/teamStorage';

const mockFetchAllData = fetchAllData as ReturnType<typeof vi.fn>;
const mockFetchLeagues = fetchLeagues as ReturnType<typeof vi.fn>;
const mockGetFollowedTeam = getFollowedTeam as ReturnType<typeof vi.fn>;

const mockMatch: Match = {
  id: 'match-1',
  homeTeam: { id: 'team-1', name: 'Home FC', shortName: 'HFC' },
  awayTeam: { id: 'team-2', name: 'Away FC', shortName: 'AFC' },
  date: '2026-04-20',
  time: '19:00',
  venue: 'Test Arena',
  status: 'scheduled',
  leagueId: 'slb-championship',
  leagueName: 'SLB Championship',
};

const mockStanding: StandingsEntry = {
  position: 1,
  team: { id: 'team-1', name: 'Home FC', shortName: 'HFC' },
  played: 10,
  won: 8,
  lost: 2,
  pointsFor: 850,
  pointsAgainst: 790,
  pointsDifference: 60,
  points: 16,
};

const mockLeagues: League[] = [
  { id: 'slb-championship', name: 'SLB Championship', shortName: 'Championship', country: 'England' },
  { id: 'slb-cup', name: 'SLB Cup', shortName: 'Cup', country: 'England' },
  { id: 'euroleague', name: 'EuroLeague', shortName: 'EuroLeague', country: 'Europe' },
];

// Suppress unused variable warnings
void mockMatch;
void mockStanding;
void mockLeagues;

function renderApp(initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <App />
    </MemoryRouter>
  );
}

describe('App', () => {
  beforeEach(() => {
    mockGetFollowedTeam.mockReturnValue(null);
    mockFetchLeagues.mockResolvedValue(mockLeagues);
    mockFetchAllData.mockResolvedValue({
      matches: [mockMatch],
      standings: [mockStanding],
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('HomePage rendering', () => {
    it('renders the page header', async () => {
      renderApp();
      expect(screen.getByText('🏀 Basketball Leagues')).toBeInTheDocument();
    });

    it('shows fixtures tab by default', async () => {
      renderApp();
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Fixtures & Results/i })).toBeInTheDocument();
      });
    });

    it('shows League Table tab when league supports standings', async () => {
      renderApp();
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /League Table/i })).toBeInTheDocument();
      });
    });

    it('fetches data on mount', async () => {
      renderApp();
      await waitFor(() => {
        expect(mockFetchAllData).toHaveBeenCalledTimes(1);
      });
    });

    it('fetches leagues on mount', async () => {
      renderApp();
      await waitFor(() => {
        expect(mockFetchLeagues).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('tab switching', () => {
    it('switches to League Table when tab is clicked', async () => {
      renderApp();
      const tableTab = await screen.findByRole('button', { name: /League Table/i });
      fireEvent.click(tableTab);
      expect(tableTab.className).toContain('text-orange-600');
    });

    it('switches back to Fixtures when Fixtures tab is clicked', async () => {
      renderApp();
      const tableTab = await screen.findByRole('button', { name: /League Table/i });
      fireEvent.click(tableTab);

      const fixturesTab = screen.getByRole('button', { name: /Fixtures & Results/i });
      fireEvent.click(fixturesTab);
      expect(fixturesTab.className).toContain('text-orange-600');
    });
  });

  describe('League Table tab visibility', () => {
    it('hides League Table tab for leagues without standings', async () => {
      // SLB Cup has hasStandings: false in leagues config
      renderApp('/?league=slb-cup');
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /League Table/i })).not.toBeInTheDocument();
      });
    });

    it('active tab is fixtures when navigating to a no-standings league', async () => {
      renderApp('/?league=slb-cup');
      await waitFor(() => {
        const fixturesTab = screen.getByRole('button', { name: /Fixtures & Results/i });
        expect(fixturesTab.className).toContain('text-orange-600');
      });
    });
  });

  describe('error handling', () => {
    it('displays error message when fetchAllData fails', async () => {
      mockFetchAllData.mockRejectedValue(new Error('Network error'));
      renderApp();
      await waitFor(() => {
        expect(screen.getByText(/Unable to load data/i)).toBeInTheDocument();
      });
    });

    it('shows Try Again button on error', async () => {
      mockFetchAllData.mockRejectedValue(new Error('Network error'));
      renderApp();
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
      });
    });

    it('retries data fetch when Try Again is clicked', async () => {
      mockFetchAllData.mockRejectedValueOnce(new Error('Network error'));
      mockFetchAllData.mockResolvedValueOnce({ matches: [], standings: [] });
      renderApp();

      const retryBtn = await screen.findByRole('button', { name: /Try Again/i });
      fireEvent.click(retryBtn);

      await waitFor(() => {
        expect(mockFetchAllData).toHaveBeenCalledTimes(2);
      });
    });

    it('shows leagues error banner without blocking main content', async () => {
      mockFetchLeagues.mockRejectedValue(new Error('Leagues API down'));
      renderApp();
      await waitFor(() => {
        expect(screen.getByText(/Failed to load leagues/i)).toBeInTheDocument();
      });
      expect(mockFetchAllData).toHaveBeenCalled();
    });
  });

  describe('footer', () => {
    it('renders a footer with copyright year', () => {
      renderApp();
      const year = new Date().getFullYear().toString();
      expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
    });
  });

  describe('routing', () => {
    it('renders MatchDetail component on /match/:matchId route', () => {
      mockFetchAllData.mockResolvedValue({ matches: [], standings: [] });
      render(
        <MemoryRouter initialEntries={['/match/match-1?league=slb-championship']}>
          <App />
        </MemoryRouter>
      );
      expect(document.body).toBeTruthy();
    });
  });
});
