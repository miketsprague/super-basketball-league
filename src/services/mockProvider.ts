import type { Match, MatchDetails, StandingsEntry, League } from '../types';
import { mockMatches, mockStandings, getMockMatchDetails, euroleagueMockMatches, euroleagueMockStandings } from './mockData';
import { LEAGUE_IDS, predefinedLeagues } from './leagues';

/**
 * Mock data provider for development and testing.
 * Returns mock data for all data requests.
 */

function getMockMatchesForLeague(leagueId: string): Match[] {
  return leagueId === LEAGUE_IDS.EUROLEAGUE ? euroleagueMockMatches : mockMatches;
}

function getMockStandingsForLeague(leagueId: string): StandingsEntry[] {
  return leagueId === LEAGUE_IDS.EUROLEAGUE ? euroleagueMockStandings : mockStandings;
}

export function fetchMockMatches(leagueId: string): Promise<Match[]> {
  return Promise.resolve(getMockMatchesForLeague(leagueId));
}

export function fetchMockStandings(leagueId: string): Promise<StandingsEntry[]> {
  return Promise.resolve(getMockStandingsForLeague(leagueId));
}

export function fetchMockAllData(leagueId: string): Promise<{
  matches: Match[];
  standings: StandingsEntry[];
}> {
  return Promise.resolve({
    matches: getMockMatchesForLeague(leagueId),
    standings: getMockStandingsForLeague(leagueId),
  });
}

export function fetchMockMatchDetails(matchId: string): Promise<MatchDetails | null> {
  return Promise.resolve(getMockMatchDetails(matchId));
}

export function fetchMockLeagues(): Promise<League[]> {
  return Promise.resolve(predefinedLeagues);
}
