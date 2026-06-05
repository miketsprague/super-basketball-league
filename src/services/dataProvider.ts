import type { Match, MatchDetails, StandingsEntry, League } from '../types';
import * as mockProvider from './mockProvider';
import * as euroleagueApi from './euroleagueApi';
import * as geniusSportsApi from './geniusSportsApi';
import { predefinedLeagues, getApiProvider, getLeagueConfig, LEAGUE_IDS, type LeagueConfig } from './leagues';
import { matchInvolvesTeam } from './teamStorage';

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

export interface H2HRecord {
  /** Wins for the team named `team1Name` (the "home" team of the current match). */
  team1Wins: number;
  /** Wins for the team named `team2Name` (the "away" team of the current match). */
  team2Wins: number;
  draws: number;
  total: number;
  /** Previous meetings, most recent first (up to 5). */
  recentMatches: Match[];
}

/**
 * Compute head-to-head record between two teams from a list of matches.
 * Uses case-insensitive name matching (both full name and short name).
 */
export function computeH2HRecord(
  matches: Match[],
  team1Name: string,
  team2Name: string,
  excludeMatchId?: string,
): H2HRecord {
  const norm = (s: string) => s.trim().toLowerCase();
  const t1 = norm(team1Name);
  const t2 = norm(team2Name);

  const involvesT1 = (m: Match) =>
    norm(m.homeTeam.name) === t1 ||
    norm(m.homeTeam.shortName ?? m.homeTeam.name) === t1 ||
    norm(m.awayTeam.name) === t1 ||
    norm(m.awayTeam.shortName ?? m.awayTeam.name) === t1;

  const involvesT2 = (m: Match) =>
    norm(m.homeTeam.name) === t2 ||
    norm(m.homeTeam.shortName ?? m.homeTeam.name) === t2 ||
    norm(m.awayTeam.name) === t2 ||
    norm(m.awayTeam.shortName ?? m.awayTeam.name) === t2;

  const h2hMatches = matches.filter(
    (m) =>
      m.status === 'completed' &&
      m.id !== excludeMatchId &&
      involvesT1(m) &&
      involvesT2(m),
  );

  const sorted = [...h2hMatches].sort((a, b) => {
    const aMs = new Date(`${a.date}T12:00:00`).getTime();
    const bMs = new Date(`${b.date}T12:00:00`).getTime();
    return bMs - aMs;
  });

  let team1Wins = 0;
  let team2Wins = 0;
  let draws = 0;

  for (const m of sorted) {
    if (m.homeScore == null || m.awayScore == null) continue;

    const homeIsT1 =
      norm(m.homeTeam.name) === t1 ||
      norm(m.homeTeam.shortName ?? m.homeTeam.name) === t1;

    const t1Score = homeIsT1 ? m.homeScore : m.awayScore;
    const t2Score = homeIsT1 ? m.awayScore : m.homeScore;

    if (t1Score > t2Score) team1Wins++;
    else if (t2Score > t1Score) team2Wins++;
    else draws++;
  }

  return {
    team1Wins,
    team2Wins,
    draws,
    total: sorted.length,
    recentMatches: sorted.slice(0, 5),
  };
}

/**
 * Fetch matches from all leagues and filter by team name.
 * Each match is annotated with leagueId and leagueName.
 */
export async function fetchMatchesForTeam(teamName: string): Promise<Match[]> {
  const results = await Promise.allSettled(
    predefinedLeagues.map(async (league) => {
      const matches = await fetchMatches(league.id);
      return matches.map((m) => ({
        ...m,
        leagueId: league.id,
        leagueName: league.name,
      }));
    }),
  );

  const allMatches: Match[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled') {
      allMatches.push(...result.value);
    }
  }

  return allMatches.filter((m) => matchInvolvesTeam(m, teamName));
}
