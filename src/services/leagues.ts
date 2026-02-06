import type { League } from '../types';

/**
 * API Provider types for different basketball leagues
 * - 'geniussports': Genius Sports API (official SLB data provider, no API key needed)
 * - 'euroleague': Official EuroLeague/EuroCup API (api-live.euroleague.net)
 * - 'mock': Mock data (fallback when no API is available)
 */
export type ApiProvider = 'geniussports' | 'euroleague' | 'mock';

export interface LeagueConfig extends League {
  /** The API provider to use for this league */
  apiProvider: ApiProvider;
  /** Competition code for EuroLeague API (E = EuroLeague, U = EuroCup) */
  competitionCode?: string;
  /** Competition ID for Genius Sports API (SLB competitions) */
  geniusSportsCompetitionId?: string;
}

// League IDs for internal use
export const LEAGUE_IDS = {
  SUPER_LEAGUE: 'super-league',
  SLB_TROPHY: 'slb-trophy',
  SLB_CUP: 'slb-cup',
  EUROLEAGUE: 'euroleague',
  EUROCUP: 'eurocup',
} as const;

// Genius Sports competition IDs for SLB
export const SLB_COMPETITION_IDS = {
  CHAMPIONSHIP: '41897',
  TROPHY: '42212',
  CUP: '47714',
} as const;

// Predefined leagues with their API configurations
export const predefinedLeagues: LeagueConfig[] = [
  {
    id: LEAGUE_IDS.SUPER_LEAGUE,
    name: 'SLB Championship',
    shortName: 'Championship',
    country: 'England',
    apiProvider: 'geniussports',
    geniusSportsCompetitionId: SLB_COMPETITION_IDS.CHAMPIONSHIP,
  },
  {
    id: LEAGUE_IDS.SLB_TROPHY,
    name: 'SLB Trophy',
    shortName: 'Trophy',
    country: 'England',
    apiProvider: 'geniussports',
    geniusSportsCompetitionId: SLB_COMPETITION_IDS.TROPHY,
  },
  {
    id: LEAGUE_IDS.SLB_CUP,
    name: 'SLB Cup',
    shortName: 'Cup',
    country: 'England',
    apiProvider: 'geniussports',
    geniusSportsCompetitionId: SLB_COMPETITION_IDS.CUP,
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
