import type { Match, MatchDetails, StandingsEntry, League } from '../types';
import { mockMatches, mockStandings, getMockMatchDetails, euroleagueMockMatches, euroleagueMockStandings, eurocupMockMatches, eurocupMockStandings } from './mockData';
import { LEAGUE_IDS, LEGACY_LEAGUE_IDS, predefinedLeagues } from './leagues';

/**
 * Mock data provider for development and testing.
 * Returns mock data for all data requests.
 */

function getMockMatchesForLeague(leagueId: string): Match[] {
  switch (leagueId) {
    case LEAGUE_IDS.EUROLEAGUE:
    case LEGACY_LEAGUE_IDS.EUROLEAGUE:
      return euroleagueMockMatches;
    case LEAGUE_IDS.EUROCUP:
      return eurocupMockMatches;
    case LEAGUE_IDS.SUPER_LEAGUE:
    case LEGACY_LEAGUE_IDS.SUPER_LEAGUE:
    default:
      return mockMatches;
  }
}

function getMockStandingsForLeague(leagueId: string): StandingsEntry[] {
  switch (leagueId) {
    case LEAGUE_IDS.EUROLEAGUE:
    case LEGACY_LEAGUE_IDS.EUROLEAGUE:
      return euroleagueMockStandings;
    case LEAGUE_IDS.EUROCUP:
      return eurocupMockStandings;
    case LEAGUE_IDS.SUPER_LEAGUE:
    case LEGACY_LEAGUE_IDS.SUPER_LEAGUE:
    default:
      return mockStandings;
  }
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
