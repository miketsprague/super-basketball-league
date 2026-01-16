import type { Match, MatchDetails, StandingsEntry, League } from '../types';
import * as api from './api';
import * as mockProvider from './mockProvider';

/**
 * Environment variable to enable mock data fallback.
 * When enabled, the app will use mock data if the API fails.
 * When disabled (production default), API errors will be shown to the user.
 */
const USE_MOCK_FALLBACK = import.meta.env.VITE_USE_MOCK_FALLBACK === 'true';

/**
 * Data provider that wraps the API with optional mock fallback.
 * In production, API errors are thrown for proper error handling in the UI.
 * In development (with VITE_USE_MOCK_FALLBACK=true), mock data is used as fallback.
 */

export async function fetchLeagues(): Promise<League[]> {
  try {
    return await api.fetchLeagues();
  } catch (error) {
    if (USE_MOCK_FALLBACK) {
      console.info('API failed, using mock data for leagues');
      return mockProvider.fetchMockLeagues();
    }
    throw error;
  }
}

export async function fetchMatches(leagueId: string): Promise<Match[]> {
  try {
    return await api.fetchMatches(leagueId);
  } catch (error) {
    if (USE_MOCK_FALLBACK) {
      console.info('API failed, using mock data for matches');
      return mockProvider.fetchMockMatches(leagueId);
    }
    throw error;
  }
}

export async function fetchStandings(leagueId: string): Promise<StandingsEntry[]> {
  try {
    return await api.fetchStandings(leagueId);
  } catch (error) {
    if (USE_MOCK_FALLBACK) {
      console.info('API failed, using mock data for standings');
      return mockProvider.fetchMockStandings(leagueId);
    }
    throw error;
  }
}

export async function fetchAllData(leagueId: string): Promise<{
  matches: Match[];
  standings: StandingsEntry[];
}> {
  try {
    return await api.fetchAllData(leagueId);
  } catch (error) {
    if (USE_MOCK_FALLBACK) {
      console.info('API failed, using mock data');
      return mockProvider.fetchMockAllData(leagueId);
    }
    throw error;
  }
}

export async function fetchMatchDetails(matchId: string): Promise<MatchDetails | null> {
  try {
    return await api.fetchMatchDetails(matchId);
  } catch (error) {
    if (USE_MOCK_FALLBACK) {
      console.info('API failed, using mock data for match details');
      return mockProvider.fetchMockMatchDetails(matchId);
    }
    throw error;
  }
}

// Re-export the APIError for consumers that need to handle it
export { APIError } from './api';
