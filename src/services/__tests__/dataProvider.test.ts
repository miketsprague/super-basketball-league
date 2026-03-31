import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LEAGUE_IDS, predefinedLeagues, SLB_COMPETITION_IDS } from '../leagues';
import type { Match, MatchDetails, StandingsEntry } from '../../types';

// Mock the API modules
vi.mock('../geniusSportsApi');
vi.mock('../euroleagueApi');
vi.mock('../mockProvider');

// Import after mocking
import * as geniusSportsApi from '../geniusSportsApi';
import * as euroleagueApi from '../euroleagueApi';
import * as mockProvider from '../mockProvider';
import {
  APIError,
  fetchLeagues,
  fetchMatches,
  fetchStandings,
  fetchAllData,
  fetchMatchDetails,
  fetchMatchesForTeam,
} from '../dataProvider';

// Helper: minimal Match fixture
function makeMatch(overrides: Partial<Match> = {}): Match {
  return {
    id: '1',
    homeTeam: { id: 'h1', name: 'Home Team', shortName: 'HOM' },
    awayTeam: { id: 'a1', name: 'Away Team', shortName: 'AWY' },
    date: '2026-03-01',
    time: '19:00',
    venue: 'Test Arena',
    status: 'completed',
    homeScore: 80,
    awayScore: 75,
    ...overrides,
  };
}

// Helper: minimal StandingsEntry fixture
function makeStanding(overrides: Partial<StandingsEntry> = {}): StandingsEntry {
  return {
    position: 1,
    team: { id: 't1', name: 'Team A', shortName: 'TMA' },
    played: 10,
    won: 8,
    lost: 2,
    pointsFor: 800,
    pointsAgainst: 700,
    pointsDifference: 100,
    points: 16,
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});

// ─── APIError ────────────────────────────────────────────────────────────────

describe('APIError', () => {
  it('should have name "APIError"', () => {
    const err = new APIError('something failed');
    expect(err.name).toBe('APIError');
  });

  it('should store the message', () => {
    const err = new APIError('bad request');
    expect(err.message).toBe('bad request');
  });

  it('should store statusCode when provided', () => {
    const err = new APIError('not found', 404);
    expect(err.statusCode).toBe(404);
  });

  it('should leave statusCode undefined when not provided', () => {
    const err = new APIError('generic error');
    expect(err.statusCode).toBeUndefined();
  });

  it('should be an instance of Error', () => {
    const err = new APIError('test');
    expect(err).toBeInstanceOf(Error);
  });
});

// ─── fetchLeagues ────────────────────────────────────────────────────────────

describe('fetchLeagues', () => {
  it('should return predefined leagues with expected shape', async () => {
    const leagues = await fetchLeagues();
    expect(leagues).toHaveLength(predefinedLeagues.length);
    for (const league of leagues) {
      expect(league).toHaveProperty('id');
      expect(league).toHaveProperty('name');
      expect(league).toHaveProperty('shortName');
      expect(league).toHaveProperty('country');
    }
  });

  it('should not include apiProvider or internal config fields', async () => {
    const leagues = await fetchLeagues();
    for (const league of leagues) {
      expect(league).not.toHaveProperty('apiProvider');
      expect(league).not.toHaveProperty('geniusSportsCompetitionId');
      expect(league).not.toHaveProperty('competitionCode');
    }
  });
});

// ─── fetchMatches ────────────────────────────────────────────────────────────

describe('fetchMatches', () => {
  it('should route to Genius Sports for Super League', async () => {
    const expected = [makeMatch()];
    vi.mocked(geniusSportsApi.fetchGeniusSportsMatches).mockResolvedValue(expected);

    const result = await fetchMatches(LEAGUE_IDS.SUPER_LEAGUE);

    expect(geniusSportsApi.fetchGeniusSportsMatches).toHaveBeenCalledWith(
      SLB_COMPETITION_IDS.CHAMPIONSHIP,
    );
    expect(result).toEqual(expected);
  });

  it('should route to Genius Sports for SLB Trophy', async () => {
    const expected = [makeMatch({ id: 'trophy1' })];
    vi.mocked(geniusSportsApi.fetchGeniusSportsMatches).mockResolvedValue(expected);

    const result = await fetchMatches(LEAGUE_IDS.SLB_TROPHY);

    expect(geniusSportsApi.fetchGeniusSportsMatches).toHaveBeenCalledWith(
      SLB_COMPETITION_IDS.TROPHY,
    );
    expect(result).toEqual(expected);
  });

  it('should route to EuroLeague provider for EuroLeague', async () => {
    const expected = [makeMatch({ id: 'el1' })];
    vi.mocked(euroleagueApi.fetchEuroLeagueMatches).mockResolvedValue(expected);

    const result = await fetchMatches(LEAGUE_IDS.EUROLEAGUE);

    expect(euroleagueApi.fetchEuroLeagueMatches).toHaveBeenCalledWith(LEAGUE_IDS.EUROLEAGUE);
    expect(result).toEqual(expected);
  });

  it('should route to EuroLeague provider for EuroCup', async () => {
    const expected = [makeMatch({ id: 'ec1' })];
    vi.mocked(euroleagueApi.fetchEuroLeagueMatches).mockResolvedValue(expected);

    const result = await fetchMatches(LEAGUE_IDS.EUROCUP);

    expect(euroleagueApi.fetchEuroLeagueMatches).toHaveBeenCalledWith(LEAGUE_IDS.EUROCUP);
    expect(result).toEqual(expected);
  });

  it('should fall back to mock data when VITE_USE_MOCK_FALLBACK=true and API fails', async () => {
    vi.stubEnv('VITE_USE_MOCK_FALLBACK', 'true');
    // Re-import to pick up the stubbed env
    vi.resetModules();
    const dp = await import('../dataProvider');
    const mp = await import('../mockProvider');
    const gs = await import('../geniusSportsApi');

    const mockMatches = [makeMatch({ id: 'mock1' })];
    vi.mocked(gs.fetchGeniusSportsMatches).mockRejectedValue(new Error('API down'));
    vi.mocked(mp.fetchMockMatches).mockResolvedValue(mockMatches);

    const result = await dp.fetchMatches(LEAGUE_IDS.SUPER_LEAGUE);

    expect(mp.fetchMockMatches).toHaveBeenCalledWith(LEAGUE_IDS.SUPER_LEAGUE);
    expect(result).toEqual(mockMatches);
  });

  it('should propagate error when fallback is disabled', async () => {
    vi.stubEnv('VITE_USE_MOCK_FALLBACK', 'false');
    vi.resetModules();
    const dp = await import('../dataProvider');
    const gs = await import('../geniusSportsApi');

    vi.mocked(gs.fetchGeniusSportsMatches).mockRejectedValue(new APIError('API down', 500));

    await expect(dp.fetchMatches(LEAGUE_IDS.SUPER_LEAGUE)).rejects.toThrow('API down');
  });

  it('should fall back to mock for unknown league ID', async () => {
    const mockMatches = [makeMatch({ id: 'unknown-mock' })];
    vi.mocked(mockProvider.fetchMockMatches).mockResolvedValue(mockMatches);

    const result = await fetchMatches('unknown-league');

    expect(mockProvider.fetchMockMatches).toHaveBeenCalledWith('unknown-league');
    expect(result).toEqual(mockMatches);
  });
});

// ─── fetchStandings ──────────────────────────────────────────────────────────

describe('fetchStandings', () => {
  it('should route to Genius Sports for Super League', async () => {
    const expected = [makeStanding()];
    vi.mocked(geniusSportsApi.fetchGeniusSportsStandings).mockResolvedValue(expected);

    const result = await fetchStandings(LEAGUE_IDS.SUPER_LEAGUE);

    expect(geniusSportsApi.fetchGeniusSportsStandings).toHaveBeenCalledWith(
      SLB_COMPETITION_IDS.CHAMPIONSHIP,
    );
    expect(result).toEqual(expected);
  });

  it('should route to EuroLeague provider for EuroLeague', async () => {
    const expected = [makeStanding()];
    vi.mocked(euroleagueApi.fetchEuroLeagueStandings).mockResolvedValue(expected);

    const result = await fetchStandings(LEAGUE_IDS.EUROLEAGUE);

    expect(euroleagueApi.fetchEuroLeagueStandings).toHaveBeenCalledWith(LEAGUE_IDS.EUROLEAGUE);
    expect(result).toEqual(expected);
  });

  it('should fall back to mock data when VITE_USE_MOCK_FALLBACK=true and API fails', async () => {
    vi.stubEnv('VITE_USE_MOCK_FALLBACK', 'true');
    vi.resetModules();
    const dp = await import('../dataProvider');
    const mp = await import('../mockProvider');
    const gs = await import('../geniusSportsApi');

    const mockStandings = [makeStanding()];
    vi.mocked(gs.fetchGeniusSportsStandings).mockRejectedValue(new Error('API down'));
    vi.mocked(mp.fetchMockStandings).mockResolvedValue(mockStandings);

    const result = await dp.fetchStandings(LEAGUE_IDS.SUPER_LEAGUE);

    expect(mp.fetchMockStandings).toHaveBeenCalledWith(LEAGUE_IDS.SUPER_LEAGUE);
    expect(result).toEqual(mockStandings);
  });

  it('should propagate error when fallback is disabled', async () => {
    vi.stubEnv('VITE_USE_MOCK_FALLBACK', 'false');
    vi.resetModules();
    const dp = await import('../dataProvider');
    const gs = await import('../geniusSportsApi');

    vi.mocked(gs.fetchGeniusSportsStandings).mockRejectedValue(new APIError('Standings fail', 503));

    await expect(dp.fetchStandings(LEAGUE_IDS.SUPER_LEAGUE)).rejects.toThrow('Standings fail');
  });
});

// ─── fetchAllData ────────────────────────────────────────────────────────────

describe('fetchAllData', () => {
  it('should route to Genius Sports for SLB league', async () => {
    const expected = { matches: [makeMatch()], standings: [makeStanding()] };
    vi.mocked(geniusSportsApi.fetchGeniusSportsAllData).mockResolvedValue(expected);

    const result = await fetchAllData(LEAGUE_IDS.SUPER_LEAGUE);

    expect(geniusSportsApi.fetchGeniusSportsAllData).toHaveBeenCalledWith(
      SLB_COMPETITION_IDS.CHAMPIONSHIP,
    );
    expect(result).toEqual(expected);
  });

  it('should route to EuroLeague provider for EuroCup', async () => {
    const expected = { matches: [makeMatch()], standings: [makeStanding()] };
    vi.mocked(euroleagueApi.fetchEuroLeagueAllData).mockResolvedValue(expected);

    const result = await fetchAllData(LEAGUE_IDS.EUROCUP);

    expect(euroleagueApi.fetchEuroLeagueAllData).toHaveBeenCalledWith(LEAGUE_IDS.EUROCUP);
    expect(result).toEqual(expected);
  });

  it('should fall back to mock data when VITE_USE_MOCK_FALLBACK=true and API fails', async () => {
    vi.stubEnv('VITE_USE_MOCK_FALLBACK', 'true');
    vi.resetModules();
    const dp = await import('../dataProvider');
    const mp = await import('../mockProvider');
    const el = await import('../euroleagueApi');

    const mockData = { matches: [makeMatch()], standings: [makeStanding()] };
    vi.mocked(el.fetchEuroLeagueAllData).mockRejectedValue(new Error('API down'));
    vi.mocked(mp.fetchMockAllData).mockResolvedValue(mockData);

    const result = await dp.fetchAllData(LEAGUE_IDS.EUROLEAGUE);

    expect(mp.fetchMockAllData).toHaveBeenCalledWith(LEAGUE_IDS.EUROLEAGUE);
    expect(result).toEqual(mockData);
  });

  it('should propagate error when fallback is disabled', async () => {
    vi.stubEnv('VITE_USE_MOCK_FALLBACK', 'false');
    vi.resetModules();
    const dp = await import('../dataProvider');
    const el = await import('../euroleagueApi');

    vi.mocked(el.fetchEuroLeagueAllData).mockRejectedValue(new Error('All data fail'));

    await expect(dp.fetchAllData(LEAGUE_IDS.EUROLEAGUE)).rejects.toThrow('All data fail');
  });
});

// ─── fetchMatchDetails ───────────────────────────────────────────────────────

describe('fetchMatchDetails', () => {
  it('should route to Genius Sports when leagueId is SLB', async () => {
    const expected: MatchDetails = { ...makeMatch(), currentPeriod: 'Full Time' };
    vi.mocked(geniusSportsApi.fetchGeniusSportsMatchDetails).mockResolvedValue(expected);

    const result = await fetchMatchDetails('match123', LEAGUE_IDS.SUPER_LEAGUE);

    expect(geniusSportsApi.fetchGeniusSportsMatchDetails).toHaveBeenCalledWith(
      'match123',
      SLB_COMPETITION_IDS.CHAMPIONSHIP,
    );
    expect(result).toEqual(expected);
  });

  it('should route to EuroLeague when leagueId is EuroLeague', async () => {
    const expected: MatchDetails = { ...makeMatch(), currentPeriod: 'Q3' };
    vi.mocked(euroleagueApi.fetchEuroLeagueMatchDetails).mockResolvedValue(expected);

    const result = await fetchMatchDetails('match456', LEAGUE_IDS.EUROLEAGUE);

    expect(euroleagueApi.fetchEuroLeagueMatchDetails).toHaveBeenCalledWith(
      'match456',
      LEAGUE_IDS.EUROLEAGUE,
    );
    expect(result).toEqual(expected);
  });

  it('should fall back to mock when VITE_USE_MOCK_FALLBACK=true and API fails', async () => {
    vi.stubEnv('VITE_USE_MOCK_FALLBACK', 'true');
    vi.resetModules();
    const dp = await import('../dataProvider');
    const mp = await import('../mockProvider');
    const gs = await import('../geniusSportsApi');

    const mockDetails: MatchDetails = { ...makeMatch(), currentPeriod: 'Full Time' };
    vi.mocked(gs.fetchGeniusSportsMatchDetails).mockRejectedValue(new Error('API down'));
    vi.mocked(mp.fetchMockMatchDetails).mockResolvedValue(mockDetails);

    const result = await dp.fetchMatchDetails('match789', LEAGUE_IDS.SUPER_LEAGUE);

    expect(mp.fetchMockMatchDetails).toHaveBeenCalledWith('match789');
    expect(result).toEqual(mockDetails);
  });

  it('should search mock then all providers when no leagueId is given', async () => {
    vi.mocked(mockProvider.fetchMockMatchDetails).mockResolvedValue(null);
    vi.mocked(geniusSportsApi.fetchGeniusSportsMatchDetails).mockResolvedValue(null);
    vi.mocked(euroleagueApi.fetchEuroLeagueMatchDetails).mockResolvedValue(null);

    const result = await fetchMatchDetails('unknown-match');

    expect(mockProvider.fetchMockMatchDetails).toHaveBeenCalledWith('unknown-match');
    expect(result).toBeNull();
  });

  it('should return result from mock when no leagueId and mock has data', async () => {
    const mockDetails: MatchDetails = { ...makeMatch({ id: 'found' }), currentPeriod: 'Full Time' };
    vi.mocked(mockProvider.fetchMockMatchDetails).mockResolvedValue(mockDetails);

    const result = await fetchMatchDetails('found');

    expect(result).toEqual(mockDetails);
    // Should not try other providers
    expect(geniusSportsApi.fetchGeniusSportsMatchDetails).not.toHaveBeenCalled();
  });
});

// ─── fetchMatchesForTeam ─────────────────────────────────────────────────────

describe('fetchMatchesForTeam', () => {
  it('should aggregate matches from all leagues and filter by team name', async () => {
    const teamName = 'Home Team';
    const matchWithTeam = makeMatch({ id: 'has-team' });
    const matchWithout = makeMatch({
      id: 'no-team',
      homeTeam: { id: 'x', name: 'Other', shortName: 'OTH' },
      awayTeam: { id: 'y', name: 'Another', shortName: 'ANO' },
    });

    // SLB leagues → Genius Sports
    vi.mocked(geniusSportsApi.fetchGeniusSportsMatches).mockResolvedValue([matchWithTeam]);
    // EuroLeague leagues → EuroLeague API
    vi.mocked(euroleagueApi.fetchEuroLeagueMatches).mockResolvedValue([matchWithout]);

    const result = await fetchMatchesForTeam(teamName);

    // Only the match with 'Home Team' should remain
    expect(result.every((m) => m.homeTeam.name === teamName || m.awayTeam.name === teamName)).toBe(
      true,
    );
  });

  it('should annotate matches with leagueId and leagueName', async () => {
    const match = makeMatch();
    vi.mocked(geniusSportsApi.fetchGeniusSportsMatches).mockResolvedValue([match]);
    vi.mocked(euroleagueApi.fetchEuroLeagueMatches).mockResolvedValue([]);

    const result = await fetchMatchesForTeam('Home Team');

    const annotated = result.find((m) => m.id === match.id);
    expect(annotated).toBeDefined();

    const league = predefinedLeagues.find((l) => l.id === annotated!.leagueId);
    expect(league).toBeDefined();
    expect(annotated!.leagueName).toBe(league!.name);
  });

  it('should handle individual league failures gracefully via allSettled', async () => {
    vi.mocked(geniusSportsApi.fetchGeniusSportsMatches).mockRejectedValue(new Error('API down'));
    vi.mocked(euroleagueApi.fetchEuroLeagueMatches).mockResolvedValue([
      makeMatch({ id: 'el-match' }),
    ]);

    // Should not throw even though some providers failed
    const result = await fetchMatchesForTeam('Home Team');
    expect(Array.isArray(result)).toBe(true);
  });
});
