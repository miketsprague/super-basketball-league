import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { MatchDetail } from '../MatchDetail';
import type { MatchDetails } from '../../types';

// Mock dataProvider at module level
vi.mock('../../services/dataProvider', () => ({
  fetchMatchDetails: vi.fn(),
}));

// Mock useNavigate at module level
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import { fetchMatchDetails } from '../../services/dataProvider';
const mockFetchMatchDetails = vi.mocked(fetchMatchDetails);

// --- Test fixtures ---

const baseTeamHome = { id: 'h1', name: 'Home Team FC', shortName: 'HTF' };
const baseTeamAway = { id: 'a1', name: 'Away Team BC', shortName: 'ATB' };

function makeMatch(overrides: Partial<MatchDetails> = {}): MatchDetails {
  return {
    id: 'match-001',
    homeTeam: baseTeamHome,
    awayTeam: baseTeamAway,
    date: '2026-05-10',
    time: '19:00',
    venue: 'Test Arena',
    status: 'scheduled',
    ...overrides,
  };
}

const completedMatch: MatchDetails = makeMatch({
  status: 'completed',
  homeScore: 85,
  awayScore: 79,
  quarterScores: {
    q1: { home: 22, away: 18 },
    q2: { home: 21, away: 20 },
    q3: { home: 20, away: 21 },
    q4: { home: 22, away: 20 },
  },
  homeStats: {
    fieldGoalPct: 48,
    threePointPct: 36,
    freeThrowPct: 75,
    rebounds: 40,
    offensiveRebounds: 10,
    defensiveRebounds: 30,
    assists: 20,
    turnovers: 12,
    steals: 8,
    blocks: 4,
  },
  awayStats: {
    fieldGoalPct: 44,
    threePointPct: 32,
    freeThrowPct: 70,
    rebounds: 35,
    offensiveRebounds: 8,
    defensiveRebounds: 27,
    assists: 18,
    turnovers: 14,
    steals: 6,
    blocks: 3,
  },
  homePlayers: [
    { id: 'p1', name: 'Alice Smith', points: 24, rebounds: 8, assists: 5, minutes: 32 },
    { id: 'p2', name: 'Bob Jones', points: 18, rebounds: 6, assists: 3, minutes: 28 },
    { id: 'p3', name: 'Carol Brown', points: 12, rebounds: 4, assists: 7, minutes: 25 },
  ],
  awayPlayers: [
    { id: 'p4', name: 'Dan Wilson', points: 22, rebounds: 7, assists: 4, minutes: 33 },
    { id: 'p5', name: 'Eve Davis', points: 17, rebounds: 5, assists: 2, minutes: 26 },
    { id: 'p6', name: 'Frank Lee', points: 13, rebounds: 9, assists: 6, minutes: 30 },
  ],
});

const liveMatch: MatchDetails = makeMatch({
  status: 'live',
  homeScore: 42,
  awayScore: 38,
  currentPeriod: 'Q3',
});

// Helper: render MatchDetail with a given matchId (and optional ?league= param)
function renderMatchDetail(matchId = 'match-001', leagueParam = '') {
  const search = leagueParam ? `?league=${leagueParam}` : '';
  return render(
    <MemoryRouter initialEntries={[`/match/${matchId}${search}`]}>
      <Routes>
        <Route path="/match/:matchId" element={<MatchDetail />} />
      </Routes>
    </MemoryRouter>
  );
}

// --- Tests ---

describe('MatchDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // -----------------------------------------------------------------------
  // Loading state
  // -----------------------------------------------------------------------

  it('renders skeleton while loading', () => {
    // Never resolves so we stay in loading state
    mockFetchMatchDetails.mockReturnValue(new Promise(() => {}));
    renderMatchDetail();
    // Skeleton uses animate-pulse
    const skeleton = document.querySelector('.animate-pulse');
    expect(skeleton).not.toBeNull();
  });

  // -----------------------------------------------------------------------
  // Error / not-found states
  // -----------------------------------------------------------------------

  it('shows "Match not found" when API returns null', async () => {
    mockFetchMatchDetails.mockResolvedValue(null);
    await act(async () => { renderMatchDetail(); });
    expect(screen.getByText('Match not found')).toBeInTheDocument();
  });

  it('shows "Failed to load match details" when API throws', async () => {
    mockFetchMatchDetails.mockRejectedValue(new Error('Network error'));
    await act(async () => { renderMatchDetail(); });
    expect(screen.getByText('Failed to load match details')).toBeInTheDocument();
  });

  it('shows Back button in error state', async () => {
    mockFetchMatchDetails.mockResolvedValue(null);
    await act(async () => { renderMatchDetail(); });
    expect(screen.getByText(/Back to Fixtures/i)).toBeInTheDocument();
  });

  it('"Try again" button in error state triggers reload', async () => {
    mockFetchMatchDetails.mockResolvedValue(null);
    await act(async () => { renderMatchDetail(); });
    const tryAgain = screen.getByText('Try again');
    expect(tryAgain).toBeInTheDocument();
    mockFetchMatchDetails.mockResolvedValueOnce(makeMatch());
    await act(async () => { fireEvent.click(tryAgain); });
    // After reload, error should be gone
    expect(screen.queryByText('Try again')).not.toBeInTheDocument();
  });

  // -----------------------------------------------------------------------
  // Scheduled match
  // -----------------------------------------------------------------------

  it('renders scheduled match with team names and venue', async () => {
    mockFetchMatchDetails.mockResolvedValue(makeMatch());
    await act(async () => { renderMatchDetail(); });
    expect(screen.getByText('HTF')).toBeInTheDocument();
    expect(screen.getByText('ATB')).toBeInTheDocument();
    expect(screen.getByText('Test Arena')).toBeInTheDocument();
  });

  it('renders "Upcoming" status badge for scheduled match', async () => {
    mockFetchMatchDetails.mockResolvedValue(makeMatch());
    await act(async () => { renderMatchDetail(); });
    expect(screen.getByText('Upcoming')).toBeInTheDocument();
  });

  it('shows "Statistics will be available once the match begins" for scheduled match', async () => {
    mockFetchMatchDetails.mockResolvedValue(makeMatch());
    await act(async () => { renderMatchDetail(); });
    expect(screen.getByText(/Statistics will be available/i)).toBeInTheDocument();
  });

  it('does not render quarter scores table for scheduled match', async () => {
    mockFetchMatchDetails.mockResolvedValue(makeMatch());
    await act(async () => { renderMatchDetail(); });
    expect(screen.queryByText('Score by Quarter')).not.toBeInTheDocument();
  });

  it('renders score as dashes when scores are undefined', async () => {
    mockFetchMatchDetails.mockResolvedValue(makeMatch({ status: 'scheduled' }));
    await act(async () => { renderMatchDetail(); });
    expect(screen.getByText(/- - -/)).toBeInTheDocument();
  });

  // -----------------------------------------------------------------------
  // Completed match
  // -----------------------------------------------------------------------

  it('renders completed match score', async () => {
    mockFetchMatchDetails.mockResolvedValue(completedMatch);
    await act(async () => { renderMatchDetail(); });
    expect(screen.getByText('85 - 79')).toBeInTheDocument();
  });

  it('renders "Full Time" status for completed match without currentPeriod', async () => {
    mockFetchMatchDetails.mockResolvedValue(completedMatch);
    await act(async () => { renderMatchDetail(); });
    expect(screen.getByText('Full Time')).toBeInTheDocument();
  });

  it('renders "Final" when currentPeriod is set on completed match', async () => {
    const match = makeMatch({ status: 'completed', homeScore: 80, awayScore: 75, currentPeriod: 'Full Time' });
    mockFetchMatchDetails.mockResolvedValue(match);
    await act(async () => { renderMatchDetail(); });
    expect(screen.getByText('Full Time')).toBeInTheDocument();
  });

  it('renders quarter scores table for completed match', async () => {
    mockFetchMatchDetails.mockResolvedValue(completedMatch);
    await act(async () => { renderMatchDetail(); });
    expect(screen.getByText('Score by Quarter')).toBeInTheDocument();
    expect(screen.getByText('Q1')).toBeInTheDocument();
    expect(screen.getByText('Q4')).toBeInTheDocument();
  });

  it('renders team statistics section for completed match', async () => {
    mockFetchMatchDetails.mockResolvedValue(completedMatch);
    await act(async () => { renderMatchDetail(); });
    expect(screen.getByText('Team Statistics')).toBeInTheDocument();
    expect(screen.getByText('Field Goal %')).toBeInTheDocument();
    expect(screen.getByText('Rebounds')).toBeInTheDocument();
  });

  it('renders top performers for completed match', async () => {
    mockFetchMatchDetails.mockResolvedValue(completedMatch);
    await act(async () => { renderMatchDetail(); });
    expect(screen.getByText('Top Performers')).toBeInTheDocument();
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('Dan Wilson')).toBeInTheDocument();
  });

  it('limits top performers to 3 per team', async () => {
    mockFetchMatchDetails.mockResolvedValue(completedMatch);
    await act(async () => { renderMatchDetail(); });
    // completedMatch has exactly 3 players per team — all should appear
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Jones')).toBeInTheDocument();
    expect(screen.getByText('Carol Brown')).toBeInTheDocument();
  });

  // -----------------------------------------------------------------------
  // Live match
  // -----------------------------------------------------------------------

  it('renders live match status badge', async () => {
    mockFetchMatchDetails.mockResolvedValue(liveMatch);
    await act(async () => { renderMatchDetail(); });
    expect(screen.getByText('Q3')).toBeInTheDocument();
  });

  it('renders live match score', async () => {
    mockFetchMatchDetails.mockResolvedValue(liveMatch);
    await act(async () => { renderMatchDetail(); });
    expect(screen.getByText('42 - 38')).toBeInTheDocument();
  });

  it('polls for updates on live match', async () => {
    vi.useFakeTimers();
    mockFetchMatchDetails.mockResolvedValue(liveMatch);

    await act(async () => { renderMatchDetail(); });

    // Should have been called once on initial load
    expect(mockFetchMatchDetails).toHaveBeenCalledTimes(1);

    // Advance past LIVE_POLL_INTERVAL (15 seconds)
    await act(async () => { vi.advanceTimersByTime(15001); });
    await act(async () => { await Promise.resolve(); });

    expect(mockFetchMatchDetails).toHaveBeenCalledTimes(2);
  });

  it('does not poll for scheduled matches', async () => {
    vi.useFakeTimers();
    mockFetchMatchDetails.mockResolvedValue(makeMatch());

    await act(async () => { renderMatchDetail(); });
    expect(mockFetchMatchDetails).toHaveBeenCalledTimes(1);

    await act(async () => { vi.advanceTimersByTime(30000); });
    expect(mockFetchMatchDetails).toHaveBeenCalledTimes(1);
  });

  // -----------------------------------------------------------------------
  // Navigation
  // -----------------------------------------------------------------------

  it('Back button calls navigate(-1)', async () => {
    mockFetchMatchDetails.mockResolvedValue(makeMatch());
    await act(async () => { renderMatchDetail(); });
    const backButton = screen.getByText(/Back/);
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('clicking home team name navigates to team page', async () => {
    mockFetchMatchDetails.mockResolvedValue(makeMatch());
    await act(async () => { renderMatchDetail(); });
    const homeBtn = screen.getByText('HTF');
    fireEvent.click(homeBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/team/Home%20Team%20FC');
  });

  it('clicking away team name navigates to team page', async () => {
    mockFetchMatchDetails.mockResolvedValue(makeMatch());
    await act(async () => { renderMatchDetail(); });
    const awayBtn = screen.getByText('ATB');
    fireEvent.click(awayBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/team/Away%20Team%20BC');
  });

  // -----------------------------------------------------------------------
  // Refresh
  // -----------------------------------------------------------------------

  it('Refresh button triggers another fetch', async () => {
    mockFetchMatchDetails.mockResolvedValue(makeMatch());
    await act(async () => { renderMatchDetail(); });
    expect(mockFetchMatchDetails).toHaveBeenCalledTimes(1);

    const refreshBtn = screen.getByTitle('Refresh');
    await act(async () => { fireEvent.click(refreshBtn); });
    expect(mockFetchMatchDetails).toHaveBeenCalledTimes(2);
  });

  // -----------------------------------------------------------------------
  // League param forwarding
  // -----------------------------------------------------------------------

  it('passes leagueId to fetchMatchDetails when ?league= param is present', async () => {
    mockFetchMatchDetails.mockResolvedValue(makeMatch());
    await act(async () => { renderMatchDetail('match-001', 'slb'); });
    expect(mockFetchMatchDetails).toHaveBeenCalledWith('match-001', 'slb');
  });

  it('passes undefined leagueId when no ?league= param', async () => {
    mockFetchMatchDetails.mockResolvedValue(makeMatch());
    await act(async () => { renderMatchDetail('match-001'); });
    expect(mockFetchMatchDetails).toHaveBeenCalledWith('match-001', undefined);
  });

  // -----------------------------------------------------------------------
  // OT quarter scores
  // -----------------------------------------------------------------------

  it('renders OT column when overtime scores are present', async () => {
    const matchWithOT: MatchDetails = {
      ...completedMatch,
      homeScore: 95,
      awayScore: 92,
      quarterScores: {
        q1: { home: 22, away: 22 },
        q2: { home: 20, away: 20 },
        q3: { home: 21, away: 21 },
        q4: { home: 22, away: 22 },
        ot: { home: 10, away: 7 },
      },
    };
    mockFetchMatchDetails.mockResolvedValue(matchWithOT);
    await act(async () => { renderMatchDetail(); });
    expect(screen.getByText('OT')).toBeInTheDocument();
  });

  // -----------------------------------------------------------------------
  // StatBar zero division
  // -----------------------------------------------------------------------

  it('renders stats without crashing when both values are 0', async () => {
    const matchWithZeroStats: MatchDetails = {
      ...completedMatch,
      homeStats: {
        fieldGoalPct: 0,
        threePointPct: 0,
        freeThrowPct: 0,
        rebounds: 0,
        offensiveRebounds: 0,
        defensiveRebounds: 0,
        assists: 0,
        turnovers: 0,
        steals: 0,
        blocks: 0,
      },
      awayStats: {
        fieldGoalPct: 0,
        threePointPct: 0,
        freeThrowPct: 0,
        rebounds: 0,
        offensiveRebounds: 0,
        defensiveRebounds: 0,
        assists: 0,
        turnovers: 0,
        steals: 0,
        blocks: 0,
      },
    };
    mockFetchMatchDetails.mockResolvedValue(matchWithZeroStats);
    await act(async () => { renderMatchDetail(); });
    expect(screen.getByText('Team Statistics')).toBeInTheDocument();
  });
});
