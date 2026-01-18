import type { Match, MatchDetails, StandingsEntry, League } from '../types';
import * as mockProvider from './mockProvider';
import * as euroleagueApi from './euroleagueApi';
import { predefinedLeagues, getApiProvider, type LeagueConfig } from './leagues';

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
 * - EuroLeague/EuroCup: Official EuroLeague API (api-live.euroleague.net) - free, no API key needed
 * - Super League Basketball: Mock data (no public API available)
 * 
 * Note: TheSportsDB was previously used but does not properly support these leagues.
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

  try {
    switch (apiProvider) {
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

  try {
    switch (apiProvider) {
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

  try {
    switch (apiProvider) {
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

    try {
      switch (apiProvider) {
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
  // This maintains backward compatibility with the current routing
  const mockResult = await mockProvider.fetchMockMatchDetails(matchId);
  if (mockResult) {
    return mockResult;
  }

  // If not found in mock data and in production, try EuroLeague APIs
  // Try EuroLeague first, then EuroCup
  for (const league of ['euroleague', 'eurocup']) {
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

// Re-export the APIError for consumers that need to handle it
export { APIError } from './api';
