import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { MatchDetail } from '../MatchDetail';
import type { MatchDetails, TeamStatistics, PlayerStatistics } from '../../types';

vi.mock('../../services/dataProvider');
import * as dataProvider from '../../services/dataProvider';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function makeStats(overrides: Partial<TeamStatistics> = {}): TeamStatistics {
  return {
    fieldGoalPct: 45,
    threePointPct: 35,
    freeThrowPct: 78,
    rebounds: 35,
    offensiveRebounds: 10,
    defensiveRebounds: 25,
    assists: 20,
    turnovers: 12,
    steals: 7,
    blocks: 3,
    ...overrides,
  };
}

function makePlayer(overrides: Partial<PlayerStatistics> = {}): PlayerStatistics {
  return {
    id: 'p1',
    name: 'John Smith',
    points: 22,
    rebounds: 8,
    assists: 5,
    minutes: 32,
    ...overrides,
  };
}

function makeMatchDetails(overrides: Partial<MatchDetails> = {}): MatchDetails {
  return {
    id: 'match-001',
    homeTeam: { id: 'h1', name: 'Home United', shortName: 'HMU' },
    awayTeam: { id: 'a1', name: 'Away City', shortName: 'AWC' },
    homeScore: 98,
    awayScore: 85,
    date: '2026-04-10',
    time: '19:00',
    venue: 'Home Arena',
    status: 'completed',
    ...overrides,
  };
}

function renderMatchDetail(matchId = 'match-001', league?: string) {
  const path = league ? `/match/${matchId}?league=${league}` : `/match/${matchId}`;
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/match/:matchId" element={<MatchDetail />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('MatchDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // Loading state
  describe('loading skeleton', () => {
    it('shows skeleton while loading', () => {
      vi.mocked(dataProvider.fetchMatchDetails).mockReturnValue(new Promise(() => {}));
      renderMatchDetail();
      // Skeleton is a pulsing div - check for animate-pulse class element exists
      const skeleton = document.querySelector('.animate-pulse');
      expect(skeleton).not.toBeNull();
    });
  });

  // Error states
  describe('error states', () => {
    it('shows error when fetchMatchDetails throws', async () => {
      vi.mocked(dataProvider.fetchMatchDetails).mockRejectedValue(new Error('Network error'));
      renderMatchDetail();
      await waitFor(() => expect(screen.getByText('Failed to load match details')).toBeInTheDocument());
    });

    it('shows error when match is not found (returns null)', async () => {
      vi.mocked(dataProvider.fetchMatchDetails).mockResolvedValue(null);
      renderMatchDetail();
      await waitFor(() => expect(screen.getByText('Match not found')).toBeInTheDocument());
    });

    it('shows back button on error screen', async () => {
      vi.mocked(dataProvider.fetchMatchDetails).mockRejectedValue(new Error('fail'));
      renderMatchDetail();
      await waitFor(() => expect(screen.getByText(/Back to Fixtures/)).toBeInTheDocument());
    });

    it('shows try again button on error screen', async () => {
      vi.mocked(dataProvider.fetchMatchDetails).mockRejectedValue(new Error('fail'));
      renderMatchDetail();
      await waitFor(() => expect(screen.getByText('Try again')).toBeInTheDocument());
    });

    it('try again button retries loading', async () => {
      vi.mocked(dataProvider.fetchMatchDetails)
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValueOnce(makeMatchDetails());
      renderMatchDetail();
      await waitFor(() => expect(screen.getByText('Try again')).toBeInTheDocument());
      fireEvent.click(screen.getByText('Try again'));
      await waitFor(() => expect(screen.getByText('Full Time')).toBeInTheDocument());
    });
  });

  // Completed match rendering
  describe('completed match', () => {
    it('renders team short names', async () => {
      vi.mocked(dataProvider.fetchMatchDetails).mockResolvedValue(makeMatchDetails());
      renderMatchDetail();
      await waitFor(() => expect(screen.getByText('HMU')).toBeInTheDocument());
      expect(screen.getByText('AWC')).toBeInTheDocument();
    });

    it('renders full team names', async () => {
      vi.mocked(dataProvider.fetchMatchDetails).mockResolvedValue(makeMatchDetails());
      renderMatchDetail();
      await waitFor(() => expect(screen.getByText('Home United')).toBeInTheDocument());
      expect(screen.getByText('Away City')).toBeInTheDocument();
    });

    it('renders the score', async () => {
      vi.mocked(dataProvider.fetchMatchDetails).mockResolvedValue(makeMatchDetails());
      renderMatchDetail();
      await waitFor(() => expect(screen.getByText('98 - 85')).toBeInTheDocument());
    });

    it('shows Full Time status badge for completed match without currentPeriod', async () => {
      vi.mocked(dataProvider.fetchMatchDetails).mockResolvedValue(makeMatchDetails({ status: 'completed' }));
      renderMatchDetail();
      await waitFor(() => expect(screen.getByText('Full Time')).toBeInTheDocument());
    });

    it('shows currentPeriod as status when provided on completed match', async () => {
      vi.mocked(dataProvider.fetchMatchDetails).mockResolvedValue(
        makeMatchDetails({ status: 'completed', currentPeriod: 'Full Time' })
      );
      renderMatchDetail();
      await waitFor(() => expect(screen.getByText('Full Time')).toBeInTheDocument());
    });

    it('renders venue', async () => {
      vi.mocked(dataProvider.fetchMatchDetails).mockResolvedValue(makeMatchDetails());
      renderMatchDetail();
      await waitFor(() => expect(screen.getByText('Home Arena')).toBeInTheDocument());
    });

    it('renders match time', async () => {
      vi.mocked(dataProvider.fetchMatchDetails).mockResolvedValue(makeMatchDetails());
      renderMatchDetail();
      await waitFor(() => expect(screen.getByText(/19:00/)).toBeInTheDocument());
    });

    it('shows loading statistics message when stats are absent for completed match', async () => {
      vi.mocked(dataProvider.fetchMatchDetails).mockResolvedValue(
        makeMatchDetails({ status: 'completed', homeStats: undefined, awayStats: undefined })
      );
      renderMatchDetail();
      await waitFor(() =>
        expect(screen.getByText('Loading statistics...')).toBeInTheDocument()
      );
    });
  });

  // Scheduled match
  describe('scheduled match', () => {
    it('shows Upcoming status badge', async () => {
      vi.mocked(dataProvider.fetchMatchDetails).mockResolvedValue(
        makeMatchDetails({ status: 'scheduled', homeScore: undefined, awayScore: undefined })
      );
      renderMatchDetail();
      await waitFor(() => expect(screen.getByText('Upcoming')).toBeInTheDocument());
    });

    it('shows dash for score when no scores available', async () => {
      vi.mocked(dataProvider.fetchMatchDetails).mockResolvedValue(
        makeMatchDetails({ status: 'scheduled', homeScore: undefined, awayScore: undefined })
      );
      renderMatchDetail();
      await waitFor(() => expect(screen.getByText('- - -')).toBeInTheDocument());
    });

    it('shows stats unavailable message for scheduled match', async () => {
      vi.mocked(dataProvider.fetchMatchDetails).mockResolvedValue(
        makeMatchDetails({ status: 'scheduled', homeScore: undefined, awayScore: undefined })
      );
      renderMatchDetail();
      await waitFor(() =>
        expect(screen.getByText('Statistics will be available once the match begins')).toBeInTheDocument()
      );
    });
  });

  // Live match
  describe('live match', () => {
    it('shows current period as status badge for live match', async () => {
      vi.mocked(dataProvider.fetchMatchDetails).mockResolvedValue(
        makeMatchDetails({ status: 'live', currentPeriod: 'Q3' })
      );
      renderMatchDetail();
      await waitFor(() => expect(screen.getByText('Q3')).toBeInTheDocument());
    });
  });

  // Quarter scores
  describe('quarter scores', () => {
    it('renders quarter score table for completed match', async () => {
      vi.mocked(dataProvider.fetchMatchDetails).mockResolvedValue(
        makeMatchDetails({
          status: 'completed',
          quarterScores: {
            q1: { home: 25, away: 22 },
            q2: { home: 24, away: 20 },
            q3: { home: 26, away: 21 },
            q4: { home: 23, away: 22 },
          },
        })
      );
      renderMatchDetail();
      await waitFor(() => expect(screen.getByText('Score by Quarter')).toBeInTheDocument());
      expect(screen.getByText('Q1')).toBeInTheDocument();
      expect(screen.getByText('Q2')).toBeInTheDocument();
      expect(screen.getByText('Q3')).toBeInTheDocument();
      expect(screen.getByText('Q4')).toBeInTheDocument();
    });

    it('renders OT column when overtime data present', async () => {
      vi.mocked(dataProvider.fetchMatchDetails).mockResolvedValue(
        makeMatchDetails({
          status: 'completed',
          quarterScores: {
            q1: { home: 25, away: 25 },
            q2: { home: 22, away: 22 },
            q3: { home: 23, away: 23 },
            q4: { home: 20, away: 20 },
            ot: { home: 8, away: 5 },
          },
        })
      );
      renderMatchDetail();
      await waitFor(() => expect(screen.getByText('OT')).toBeInTheDocument());
    });

    it('does not show quarter scores for scheduled match', async () => {
      vi.mocked(dataProvider.fetchMatchDetails).mockResolvedValue(
        makeMatchDetails({
          status: 'scheduled',
          quarterScores: { q1: { home: 0, away: 0 } },
        })
      );
      renderMatchDetail();
      await waitFor(() => expect(screen.queryByText('Score by Quarter')).not.toBeInTheDocument());
    });

    it('does not show quarter scores when no quarterScores data', async () => {
      vi.mocked(dataProvider.fetchMatchDetails).mockResolvedValue(
        makeMatchDetails({ status: 'completed', quarterScores: undefined })
      );
      renderMatchDetail();
      await waitFor(() => expect(screen.queryByText('Score by Quarter')).not.toBeInTheDocument());
    });
  });

  // Team statistics
  describe('team statistics', () => {
    it('renders Team Statistics section when both homeStats and awayStats present', async () => {
      vi.mocked(dataProvider.fetchMatchDetails).mockResolvedValue(
        makeMatchDetails({
          homeStats: makeStats({ fieldGoalPct: 50, threePointPct: 40 }),
          awayStats: makeStats({ fieldGoalPct: 45, threePointPct: 33 }),
        })
      );
      renderMatchDetail();
      await waitFor(() => expect(screen.getByText('Team Statistics')).toBeInTheDocument());
    });

    it('renders stat bar labels', async () => {
      vi.mocked(dataProvider.fetchMatchDetails).mockResolvedValue(
        makeMatchDetails({
          homeStats: makeStats(),
          awayStats: makeStats(),
        })
      );
      renderMatchDetail();
      await waitFor(() => {
        expect(screen.getByText('Field Goal %')).toBeInTheDocument();
        expect(screen.getByText('3-Point %')).toBeInTheDocument();
        expect(screen.getByText('Free Throw %')).toBeInTheDocument();
        expect(screen.getByText('Rebounds')).toBeInTheDocument();
        expect(screen.getByText('Assists')).toBeInTheDocument();
        expect(screen.getByText('Turnovers')).toBeInTheDocument();
        expect(screen.getByText('Steals')).toBeInTheDocument();
        expect(screen.getByText('Blocks')).toBeInTheDocument();
      });
    });

    it('renders stat values with % suffix for percentage stats', async () => {
      vi.mocked(dataProvider.fetchMatchDetails).mockResolvedValue(
        makeMatchDetails({
          homeStats: makeStats({ fieldGoalPct: 55 }),
          awayStats: makeStats({ fieldGoalPct: 42 }),
        })
      );
      renderMatchDetail();
      await waitFor(() => {
        expect(screen.getByText('55%')).toBeInTheDocument();
        expect(screen.getByText('42%')).toBeInTheDocument();
      });
    });
  });

  // Player statistics
  describe('top performers', () => {
    it('renders Top Performers section when players available', async () => {
      vi.mocked(dataProvider.fetchMatchDetails).mockResolvedValue(
        makeMatchDetails({
          homePlayers: [makePlayer({ id: 'p1', name: 'Home Star', points: 30 })],
          awayPlayers: [makePlayer({ id: 'p2', name: 'Away Star', points: 25 })],
        })
      );
      renderMatchDetail();
      await waitFor(() => expect(screen.getByText('Top Performers')).toBeInTheDocument());
      expect(screen.getByText('Home Star')).toBeInTheDocument();
      expect(screen.getByText('Away Star')).toBeInTheDocument();
    });

    it('does not render Top Performers when homePlayers is empty', async () => {
      vi.mocked(dataProvider.fetchMatchDetails).mockResolvedValue(
        makeMatchDetails({ homePlayers: [], awayPlayers: [makePlayer()] })
      );
      renderMatchDetail();
      await waitFor(() => expect(screen.queryByText('Top Performers')).not.toBeInTheDocument());
    });

    it('shows points, rebounds, assists for top performers', async () => {
      vi.mocked(dataProvider.fetchMatchDetails).mockResolvedValue(
        makeMatchDetails({
          homePlayers: [makePlayer({ id: 'p1', name: 'Star Player', points: 28, rebounds: 10, assists: 6 })],
          awayPlayers: [makePlayer({ id: 'p2', name: 'Other Player' })],
        })
      );
      renderMatchDetail();
      await waitFor(() => {
        expect(screen.getByText('28 pts')).toBeInTheDocument();
        expect(screen.getByText('10 reb')).toBeInTheDocument();
        expect(screen.getByText('6 ast')).toBeInTheDocument();
      });
    });

    it('shows at most 3 home and 3 away players', async () => {
      const makePlayers = (n: number) =>
        Array.from({ length: n }, (_, i) =>
          makePlayer({ id: `p${i}`, name: `Player ${i}`, points: 20 - i })
        );
      vi.mocked(dataProvider.fetchMatchDetails).mockResolvedValue(
        makeMatchDetails({
          homePlayers: makePlayers(5),
          awayPlayers: makePlayers(5),
        })
      );
      renderMatchDetail();
      await waitFor(() => expect(screen.getByText('Top Performers')).toBeInTheDocument());
      // Only first 3 from each side should appear — Player 0, 1, 2 for each side
      expect(screen.getAllByText('Player 0').length).toBe(2); // one home, one away
      expect(screen.getAllByText('Player 2').length).toBe(2);
      expect(screen.queryByText('Player 3')).not.toBeInTheDocument();
    });
  });

  // Navigation
  describe('navigation', () => {
    it('back button calls navigate(-1)', async () => {
      vi.mocked(dataProvider.fetchMatchDetails).mockResolvedValue(makeMatchDetails());
      renderMatchDetail();
      await waitFor(() => expect(screen.getByText('Back')).toBeInTheDocument());
      fireEvent.click(screen.getByText('Back'));
      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });

    it('home team button navigates to team page', async () => {
      vi.mocked(dataProvider.fetchMatchDetails).mockResolvedValue(makeMatchDetails());
      renderMatchDetail();
      await waitFor(() => expect(screen.getByText('HMU')).toBeInTheDocument());
      fireEvent.click(screen.getByText('HMU'));
      expect(mockNavigate).toHaveBeenCalledWith('/team/Home%20United');
    });

    it('away team button navigates to team page', async () => {
      vi.mocked(dataProvider.fetchMatchDetails).mockResolvedValue(makeMatchDetails());
      renderMatchDetail();
      await waitFor(() => expect(screen.getByText('AWC')).toBeInTheDocument());
      fireEvent.click(screen.getByText('AWC'));
      expect(mockNavigate).toHaveBeenCalledWith('/team/Away%20City');
    });
  });

  // Refresh button
  describe('refresh', () => {
    it('refresh button triggers reload', async () => {
      vi.mocked(dataProvider.fetchMatchDetails).mockResolvedValue(makeMatchDetails());
      renderMatchDetail();
      await waitFor(() => expect(screen.getByTitle('Refresh')).toBeInTheDocument());
      fireEvent.click(screen.getByTitle('Refresh'));
      await waitFor(() =>
        expect(vi.mocked(dataProvider.fetchMatchDetails)).toHaveBeenCalledTimes(2)
      );
    });
  });

  // fetchMatchDetails called with correct args
  describe('data fetching', () => {
    it('calls fetchMatchDetails with matchId from URL', async () => {
      vi.mocked(dataProvider.fetchMatchDetails).mockResolvedValue(makeMatchDetails());
      renderMatchDetail('match-abc');
      await waitFor(() =>
        expect(vi.mocked(dataProvider.fetchMatchDetails)).toHaveBeenCalledWith('match-abc', undefined)
      );
    });

    it('passes leagueId query param to fetchMatchDetails', async () => {
      vi.mocked(dataProvider.fetchMatchDetails).mockResolvedValue(makeMatchDetails());
      renderMatchDetail('match-abc', 'euroleague');
      await waitFor(() =>
        expect(vi.mocked(dataProvider.fetchMatchDetails)).toHaveBeenCalledWith('match-abc', 'euroleague')
      );
    });
  });

  // Live polling
  describe('live polling', () => {
    it('polls at 15s interval for live matches', async () => {
      vi.mocked(dataProvider.fetchMatchDetails).mockResolvedValue(
        makeMatchDetails({ status: 'live', currentPeriod: 'Q2' })
      );
      vi.useFakeTimers();
      renderMatchDetail();
      // Flush initial load microtasks
      await act(() => vi.runAllTimersAsync());
      expect(screen.getByText('Q2')).toBeInTheDocument();

      const callCount = vi.mocked(dataProvider.fetchMatchDetails).mock.calls.length;
      // Advance past the 15s poll interval
      await act(() => vi.advanceTimersByTimeAsync(15001));
      expect(vi.mocked(dataProvider.fetchMatchDetails).mock.calls.length).toBeGreaterThan(callCount);
    });

    it('does not poll for completed matches', async () => {
      vi.mocked(dataProvider.fetchMatchDetails).mockResolvedValue(makeMatchDetails({ status: 'completed' }));
      vi.useFakeTimers();
      renderMatchDetail();
      await act(() => vi.runAllTimersAsync());
      expect(screen.getByText('Full Time')).toBeInTheDocument();

      const callCount = vi.mocked(dataProvider.fetchMatchDetails).mock.calls.length;
      await act(() => vi.advanceTimersByTimeAsync(15001));
      expect(vi.mocked(dataProvider.fetchMatchDetails).mock.calls.length).toBe(callCount);
    });
  });

  // StatBar edge case: zero values
  describe('StatBar zero division', () => {
    it('handles zero/zero split gracefully (shows 50/50 bar)', async () => {
      vi.mocked(dataProvider.fetchMatchDetails).mockResolvedValue(
        makeMatchDetails({
          homeStats: makeStats({ rebounds: 0 }),
          awayStats: makeStats({ rebounds: 0 }),
        })
      );
      renderMatchDetail();
      await waitFor(() => expect(screen.getByText('Team Statistics')).toBeInTheDocument());
      // Just ensure no crash and stat label is visible
      expect(screen.getByText('Rebounds')).toBeInTheDocument();
    });
  });
});
