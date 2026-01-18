import type { League } from '../types';

/**
 * API Provider types for different basketball leagues
 * - 'euroleague': Official EuroLeague/EuroCup API (api-live.euroleague.net)
 * - 'mock': Mock data (fallback when no API is available)
 * 
 * Note: TheSportsDB does not properly support Super League Basketball or EuroCup.
 * The Super League Basketball official site (superleaguebasketballm.co.uk) does not
 * have a public API, so we use mock data as a fallback.
 */
export type ApiProvider = 'euroleague' | 'mock';

export interface LeagueConfig extends League {
  /** The API provider to use for this league */
  apiProvider: ApiProvider;
  /** Competition code for EuroLeague API (E = EuroLeague, U = EuroCup) */
  competitionCode?: string;
}

// League IDs for internal use
export const LEAGUE_IDS = {
  SUPER_LEAGUE: 'super-league',
  EUROLEAGUE: 'euroleague',
  EUROCUP: 'eurocup',
} as const;

// Predefined leagues with their API configurations
export const predefinedLeagues: LeagueConfig[] = [
  {
    id: LEAGUE_IDS.SUPER_LEAGUE,
    name: 'Super League Basketball',
    shortName: 'Super League',
    country: 'England',
    apiProvider: 'mock', // No public API available, using mock data
  },
  {
    id: LEAGUE_IDS.EUROLEAGUE,
    name: 'EuroLeague',
    shortName: 'EuroLeague',
    country: 'Europe',
    apiProvider: 'euroleague',
    competitionCode: 'E',
  },
  {
    id: LEAGUE_IDS.EUROCUP,
    name: 'EuroCup',
    shortName: 'EuroCup',
    country: 'Europe',
    apiProvider: 'euroleague',
    competitionCode: 'U',
  },
];

// Default league
export const DEFAULT_LEAGUE = predefinedLeagues[0];

/**
 * Get league configuration by ID
 */
export function getLeagueConfig(leagueId: string): LeagueConfig | undefined {
  return predefinedLeagues.find(l => l.id === leagueId);
}

/**
 * Get API provider for a league
 */
export function getApiProvider(leagueId: string): ApiProvider {
  const config = getLeagueConfig(leagueId);
  return config?.apiProvider ?? 'mock';
}
