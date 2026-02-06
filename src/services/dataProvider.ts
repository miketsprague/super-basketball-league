import type { Match, MatchDetails, StandingsEntry, League } from '../types';
import * as mockProvider from './mockProvider';
import * as euroleagueApi from './euroleagueApi';
import * as geniusSportsApi from './geniusSportsApi';
import { predefinedLeagues, getApiProvider, getLeagueConfig, LEAGUE_IDS, type LeagueConfig } from './leagues';

/**
 * Custom error class for API failures
 */
export class APIError extends Error {
  statusCode?: number;
  
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
  }
}

/**
 * Environment variable to enable mock data fallback.
 * When enabled, the app will use mock data if the API fails.
 * When disabled (production default), API errors will be shown to the user.
 */
const USE_MOCK_FALLBACK = import.meta.env.VITE_USE_MOCK_FALLBACK === 'true';

/**
 * Data provider that routes requests to the appropriate API based on league configuration.
 * 
 * API Providers:
 * - Super League Basketball: Genius Sports (official SLB data, no API key needed)
 * - EuroLeague/EuroCup: Official EuroLeague API (api-live.euroleague.net) - free, no API key needed
 * - Mock: Fallback mock data for development/testing
 */

export async function fetchLeagues(): Promise<League[]> {
  // Return predefined leagues (convert LeagueConfig to League type)
  return predefinedLeagues.map((league: LeagueConfig): League => ({
    id: league.id,
    name: league.name,
    shortName: league.shortName,
    country: league.country,
    logo: league.logo,
  }));
}

export async function fetchMatches(leagueId: string): Promise<Match[]> {
  const apiProvider = getApiProvider(leagueId);
  const leagueConfig = getLeagueConfig(leagueId);

  try {
    switch (apiProvider) {
      case 'geniussports':
        return await geniusSportsApi.fetchGeniusSportsMatches(leagueConfig?.geniusSportsCompetitionId);
      case 'euroleague':
        return await euroleagueApi.fetchEuroLeagueMatches(leagueId);
      case 'mock':
      default:
        // For leagues without an API, use mock data
        return mockProvider.fetchMockMatches(leagueId);
    }
  } catch (error) {
    if (USE_MOCK_FALLBACK) {
      console.info(`API failed for ${leagueId}, using mock data for matches`);
      return mockProvider.fetchMockMatches(leagueId);
    }
    throw error;
  }
}

export async function fetchStandings(leagueId: string): Promise<StandingsEntry[]> {
  const apiProvider = getApiProvider(leagueId);
  const leagueConfig = getLeagueConfig(leagueId);

  try {
    switch (apiProvider) {
      case 'geniussports':
        return await geniusSportsApi.fetchGeniusSportsStandings(leagueConfig?.geniusSportsCompetitionId);
      case 'euroleague':
        return await euroleagueApi.fetchEuroLeagueStandings(leagueId);
      case 'mock':
      default:
        return mockProvider.fetchMockStandings(leagueId);
    }
  } catch (error) {
    if (USE_MOCK_FALLBACK) {
      console.info(`API failed for ${leagueId}, using mock data for standings`);
      return mockProvider.fetchMockStandings(leagueId);
    }
    throw error;
  }
}

export async function fetchAllData(leagueId: string): Promise<{
  matches: Match[];
  standings: StandingsEntry[];
}> {
  const apiProvider = getApiProvider(leagueId);
  const leagueConfig = getLeagueConfig(leagueId);

  try {
    switch (apiProvider) {
      case 'geniussports':
        return await geniusSportsApi.fetchGeniusSportsAllData(leagueConfig?.geniusSportsCompetitionId);
      case 'euroleague':
        return await euroleagueApi.fetchEuroLeagueAllData(leagueId);
      case 'mock':
      default:
        return mockProvider.fetchMockAllData(leagueId);
    }
  } catch (error) {
    if (USE_MOCK_FALLBACK) {
      console.info(`API failed for ${leagueId}, using mock data`);
      return mockProvider.fetchMockAllData(leagueId);
    }
    throw error;
  }
}

export async function fetchMatchDetails(matchId: string, leagueId?: string): Promise<MatchDetails | null> {
  // If leagueId is provided, use the appropriate provider
  if (leagueId) {
    const apiProvider = getApiProvider(leagueId);
    const leagueConfig = getLeagueConfig(leagueId);

    try {
      switch (apiProvider) {
        case 'geniussports':
          return await geniusSportsApi.fetchGeniusSportsMatchDetails(matchId, leagueConfig?.geniusSportsCompetitionId);
        case 'euroleague':
          return await euroleagueApi.fetchEuroLeagueMatchDetails(matchId, leagueId);
        case 'mock':
        default:
          return mockProvider.fetchMockMatchDetails(matchId);
      }
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        console.info(`API failed for match ${matchId}, using mock data`);
        return mockProvider.fetchMockMatchDetails(matchId);
      }
      throw error;
    }
  }

  // If no leagueId, try mock data first (which has all leagues)
  const mockResult = await mockProvider.fetchMockMatchDetails(matchId);
  if (mockResult) {
    return mockResult;
  }

  // Try Genius Sports competitions (Championship, Trophy, Cup)
  const geniusSportsLeagues = predefinedLeagues.filter(l => l.apiProvider === 'geniussports');
  for (const league of geniusSportsLeagues) {
    try {
      const result = await geniusSportsApi.fetchGeniusSportsMatchDetails(matchId, league.geniusSportsCompetitionId);
      if (result) {
        return result;
      }
    } catch {
      // Continue to next competition
    }
  }

  // Try EuroLeague, then EuroCup
  for (const league of [LEAGUE_IDS.EUROLEAGUE, LEAGUE_IDS.EUROCUP]) {
    try {
      const result = await euroleagueApi.fetchEuroLeagueMatchDetails(matchId, league);
      if (result) {
        return result;
      }
    } catch {
      // Continue to next provider
    }
  }

  return null;
}
