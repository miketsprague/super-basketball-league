import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Match, MatchDetails, StandingsEntry } from '../../types';
import { LEAGUE_IDS, predefinedLeagues, SLB_COMPETITION_IDS } from '../leagues';

const mockFetchMockMatches = vi.fn();
const mockFetchMockStandings = vi.fn();
const mockFetchMockAllData = vi.fn();
const mockFetchMockMatchDetails = vi.fn();

const mockFetchEuroLeagueMatches = vi.fn();
const mockFetchEuroLeagueStandings = vi.fn();
const mockFetchEuroLeagueAllData = vi.fn();
const mockFetchEuroLeagueMatchDetails = vi.fn();

const mockFetchGeniusSportsMatches = vi.fn();
const mockFetchGeniusSportsStandings = vi.fn();
const mockFetchGeniusSportsAllData = vi.fn();
const mockFetchGeniusSportsMatchDetails = vi.fn();

const mockMatchInvolvesTeam = vi.fn();

vi.mock('../mockProvider', () => ({
  fetchMockMatches: mockFetchMockMatches,
  fetchMockStandings: mockFetchMockStandings,
  fetchMockAllData: mockFetchMockAllData,
  fetchMockMatchDetails: mockFetchMockMatchDetails,
}));

vi.mock('../euroleagueApi', () => ({
  fetchEuroLeagueMatches: mockFetchEuroLeagueMatches,
  fetchEuroLeagueStandings: mockFetchEuroLeagueStandings,
  fetchEuroLeagueAllData: mockFetchEuroLeagueAllData,
  fetchEuroLeagueMatchDetails: mockFetchEuroLeagueMatchDetails,
}));

vi.mock('../geniusSportsApi', () => ({
  fetchGeniusSportsMatches: mockFetchGeniusSportsMatches,
  fetchGeniusSportsStandings: mockFetchGeniusSportsStandings,
  fetchGeniusSportsAllData: mockFetchGeniusSportsAllData,
  fetchGeniusSportsMatchDetails: mockFetchGeniusSportsMatchDetails,
}));

vi.mock('../teamStorage', () => ({
  matchInvolvesTeam: mockMatchInvolvesTeam,
}));

const loadDataProvider = async (useMockFallback: boolean) => {
  vi.resetModules();
  vi.stubEnv('VITE_USE_MOCK_FALLBACK', useMockFallback ? 'true' : 'false');
  return import('../dataProvider');
};

describe('dataProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  describe('fetchLeagues', () => {
    it('returns predefined leagues mapped to the public League shape', async () => {
      const { fetchLeagues } = await loadDataProvider(false);

      const leagues = await fetchLeagues();

      expect(leagues).toEqual(
        predefinedLeagues.map(({ id, name, shortName, country, logo }) => ({
          id,
          name,
          shortName,
          country,
          logo,
        })),
      );
    });
  });

  describe('fetchMatches', () => {
    it('routes Genius Sports leagues to the Genius Sports provider', async () => {
      const matches: Match[] = [{ id: 'm1' } as Match];
      mockFetchGeniusSportsMatches.mockResolvedValue(matches);
      const { fetchMatches } = await loadDataProvider(false);

      const result = await fetchMatches(LEAGUE_IDS.SUPER_LEAGUE);

      expect(result).toBe(matches);
      expect(mockFetchGeniusSportsMatches).toHaveBeenCalledWith(SLB_COMPETITION_IDS.CHAMPIONSHIP);
    });

    it('routes EuroLeague leagues to the EuroLeague provider', async () => {
      const matches: Match[] = [{ id: 'm2' } as Match];
      mockFetchEuroLeagueMatches.mockResolvedValue(matches);
      const { fetchMatches } = await loadDataProvider(false);

      const result = await fetchMatches(LEAGUE_IDS.EUROLEAGUE);

      expect(result).toBe(matches);
      expect(mockFetchEuroLeagueMatches).toHaveBeenCalledWith(LEAGUE_IDS.EUROLEAGUE);
    });

    it('uses mock provider for unknown leagues', async () => {
      const matches: Match[] = [{ id: 'm3' } as Match];
      mockFetchMockMatches.mockReturnValue(matches);
      const { fetchMatches } = await loadDataProvider(false);

      const result = await fetchMatches('unknown-league');

      expect(result).toBe(matches);
      expect(mockFetchMockMatches).toHaveBeenCalledWith('unknown-league');
    });

    it('falls back to mock matches when enabled and API call fails', async () => {
      const error = new Error('API unavailable');
      const fallbackMatches: Match[] = [{ id: 'fallback' } as Match];
      mockFetchEuroLeagueMatches.mockRejectedValue(error);
      mockFetchMockMatches.mockReturnValue(fallbackMatches);
      const { fetchMatches } = await loadDataProvider(true);

      const result = await fetchMatches(LEAGUE_IDS.EUROLEAGUE);

      expect(result).toBe(fallbackMatches);
      expect(mockFetchMockMatches).toHaveBeenCalledWith(LEAGUE_IDS.EUROLEAGUE);
    });

    it('rethrows API errors when mock fallback is disabled', async () => {
      const error = new Error('API unavailable');
      mockFetchEuroLeagueMatches.mockRejectedValue(error);
      const { fetchMatches } = await loadDataProvider(false);

      await expect(fetchMatches(LEAGUE_IDS.EUROLEAGUE)).rejects.toThrow(error);
      expect(mockFetchMockMatches).not.toHaveBeenCalled();
    });
  });

  describe('fetchStandings', () => {
    it('routes requests to the correct provider and supports fallback', async () => {
      const fallbackStandings: StandingsEntry[] = [{ team: 'A' } as StandingsEntry];
      mockFetchGeniusSportsStandings.mockRejectedValue(new Error('boom'));
      mockFetchMockStandings.mockReturnValue(fallbackStandings);
      const { fetchStandings } = await loadDataProvider(true);

      const result = await fetchStandings(LEAGUE_IDS.SLB_TROPHY);

      expect(mockFetchGeniusSportsStandings).toHaveBeenCalledWith(SLB_COMPETITION_IDS.TROPHY);
      expect(result).toBe(fallbackStandings);
    });
  });

  describe('fetchAllData', () => {
    it('routes requests to the correct provider and supports fallback', async () => {
      const fallbackData = {
        matches: [{ id: 'm1' } as Match],
        standings: [{ team: 'A' } as StandingsEntry],
      };
      mockFetchEuroLeagueAllData.mockRejectedValue(new Error('boom'));
      mockFetchMockAllData.mockReturnValue(fallbackData);
      const { fetchAllData } = await loadDataProvider(true);

      const result = await fetchAllData(LEAGUE_IDS.EUROCUP);

      expect(mockFetchEuroLeagueAllData).toHaveBeenCalledWith(LEAGUE_IDS.EUROCUP);
      expect(result).toBe(fallbackData);
    });
  });

  describe('fetchMatchDetails', () => {
    it('uses the provider for the supplied leagueId', async () => {
      const details: MatchDetails = { id: 'md1' } as MatchDetails;
      mockFetchGeniusSportsMatchDetails.mockResolvedValue(details);
      const { fetchMatchDetails } = await loadDataProvider(false);

      const result = await fetchMatchDetails('md1', LEAGUE_IDS.SLB_CUP);

      expect(result).toBe(details);
      expect(mockFetchGeniusSportsMatchDetails).toHaveBeenCalledWith('md1', SLB_COMPETITION_IDS.CUP);
    });

    it('falls back to mock match details when enabled and league-specific lookup fails', async () => {
      const details: MatchDetails = { id: 'md2' } as MatchDetails;
      mockFetchEuroLeagueMatchDetails.mockRejectedValue(new Error('boom'));
      mockFetchMockMatchDetails.mockResolvedValue(details);
      const { fetchMatchDetails } = await loadDataProvider(true);

      const result = await fetchMatchDetails('md2', LEAGUE_IDS.EUROLEAGUE);

      expect(result).toBe(details);
      expect(mockFetchMockMatchDetails).toHaveBeenCalledWith('md2');
    });

    it('returns mock data first when no leagueId is provided', async () => {
      const details: MatchDetails = { id: 'md3' } as MatchDetails;
      mockFetchMockMatchDetails.mockResolvedValue(details);
      const { fetchMatchDetails } = await loadDataProvider(false);

      const result = await fetchMatchDetails('md3');

      expect(result).toBe(details);
      expect(mockFetchGeniusSportsMatchDetails).not.toHaveBeenCalled();
      expect(mockFetchEuroLeagueMatchDetails).not.toHaveBeenCalled();
    });

    it('searches providers in order when no leagueId is provided and mock misses', async () => {
      mockFetchMockMatchDetails.mockResolvedValue(null);
      mockFetchGeniusSportsMatchDetails
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: 'genius-hit' } as MatchDetails);
      const { fetchMatchDetails } = await loadDataProvider(false);

      const result = await fetchMatchDetails('search-me');

      expect(result).toEqual({ id: 'genius-hit' });
      expect(mockFetchGeniusSportsMatchDetails).toHaveBeenNthCalledWith(1, 'search-me', SLB_COMPETITION_IDS.CHAMPIONSHIP);
      expect(mockFetchGeniusSportsMatchDetails).toHaveBeenNthCalledWith(2, 'search-me', SLB_COMPETITION_IDS.TROPHY);
      expect(mockFetchEuroLeagueMatchDetails).not.toHaveBeenCalled();
    });

    it('returns null when no provider finds the match', async () => {
      mockFetchMockMatchDetails.mockResolvedValue(null);
      mockFetchGeniusSportsMatchDetails.mockResolvedValue(null);
      mockFetchEuroLeagueMatchDetails.mockResolvedValue(null);
      const { fetchMatchDetails } = await loadDataProvider(false);

      const result = await fetchMatchDetails('missing');

      expect(result).toBeNull();
      expect(mockFetchEuroLeagueMatchDetails).toHaveBeenNthCalledWith(1, 'missing', LEAGUE_IDS.EUROLEAGUE);
      expect(mockFetchEuroLeagueMatchDetails).toHaveBeenNthCalledWith(2, 'missing', LEAGUE_IDS.EUROCUP);
    });
  });

  describe('fetchMatchesForTeam', () => {
    it('collects fulfilled league results, annotates league metadata, and filters by team', async () => {
      const { fetchMatchesForTeam } = await loadDataProvider(false);

      mockFetchGeniusSportsMatches.mockImplementation(async (competitionId?: string) => {
        if (competitionId === SLB_COMPETITION_IDS.CHAMPIONSHIP) {
          return [{ id: 'slb-match' } as Match];
        }
        if (competitionId === SLB_COMPETITION_IDS.TROPHY) {
          throw new Error('league failed');
        }
        if (competitionId === SLB_COMPETITION_IDS.CUP) {
          return [{ id: 'cup-match' } as Match];
        }
        return [];
      });

      mockFetchEuroLeagueMatches.mockImplementation(async (leagueId: string) => {
        if (leagueId === LEAGUE_IDS.EUROLEAGUE) {
          return [{ id: 'euroleague-match' } as Match];
        }
        return [{ id: 'eurocup-match' } as Match];
      });

      mockMatchInvolvesTeam.mockImplementation((match: Match) => match.id !== 'cup-match');

      const result = await fetchMatchesForTeam('Lions');

      expect(result).toEqual([
        expect.objectContaining({
          id: 'slb-match',
          leagueId: LEAGUE_IDS.SUPER_LEAGUE,
          leagueName: 'Championship',
        }),
        expect.objectContaining({
          id: 'euroleague-match',
          leagueId: LEAGUE_IDS.EUROLEAGUE,
          leagueName: 'EuroLeague',
        }),
        expect.objectContaining({
          id: 'eurocup-match',
          leagueId: LEAGUE_IDS.EUROCUP,
          leagueName: 'EuroCup',
        }),
      ]);
      expect(result).toHaveLength(3);
      expect(mockMatchInvolvesTeam).toHaveBeenCalledTimes(4);
    });
  });
});
