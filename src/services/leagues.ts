import type { League } from '../types';

// TheSportsDB League IDs
export const LEAGUE_IDS = {
  SUPER_LEAGUE: '4431',
  EUROLEAGUE: '4438',
} as const;

// Predefined leagues as fallback
export const predefinedLeagues: League[] = [
  {
    id: LEAGUE_IDS.SUPER_LEAGUE,
    name: 'Super League Basketball',
    shortName: 'Super League',
    country: 'England',
  },
  {
    id: LEAGUE_IDS.EUROLEAGUE,
    name: 'EuroLeague',
    shortName: 'EuroLeague',
    country: 'Europe',
  },
];

// Default league
export const DEFAULT_LEAGUE = predefinedLeagues[0];
