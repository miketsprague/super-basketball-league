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
  /** Whether this competition has league table standings (default: true). False for knockout-only formats. */
  hasStandings?: boolean;
  /**
   * Whether to hide this league from the league selector (default: false).
   *
   * Used for competitions that no longer run in the current season. The
   * config is retained so historic match deep links still resolve, but the
   * league is not browsable and is excluded from current-season team records.
   */
  hidden?: boolean;
}

// League IDs for internal use
export const LEAGUE_IDS = {
  SUPER_LEAGUE: 'super-league',
  SLB_TROPHY: 'slb-trophy',
  SLB_CUP: 'slb-cup',
  EUROLEAGUE: 'euroleague',
  EUROCUP: 'eurocup',
} as const;

/**
 * Genius Sports competition IDs for SLB.
 *
 * These are per-season: Genius Sports mints a brand new competition ID for
 * every edition of every competition, so they must be refreshed each season.
 * The published list lives in the competition chooser on
 * https://hosted.dcd.shared.geniussports.com/SLB/en/ (a `<select
 * id="competitionChooser">` of `competition/{id}` URLs labelled by season).
 * Never guess or derive an ID - read it from that list.
 *
 * Current: 2026-27 season.
 *   - CHAMPIONSHIP `49597` - Championship 26-27
 *   - CUP          `49599` - Cup 26-27 (now the only knockout competition)
 *   - TROPHY       `42212` - Trophy 2025-26 (see TROPHY note below)
 *
 * The Trophy was discontinued for 2026-27 and absorbed into the restructured
 * Cup (Play-In -> Quarter-Finals -> two-legged Semi-Finals -> Final), so no
 * `Trophy 26-27` competition exists. Its final 2025-26 edition is kept here
 * (and marked `hidden`) purely so existing Trophy match links still resolve.
 *
 * Previous seasons, for reference:
 *   2025-26: Championship 41897, Trophy 42212, Cup 47714, Play-offs 48758
 *   2024-25: Championship 39625, Trophy 39626, Cup 39732, Play-offs 39733
 */
export const SLB_COMPETITION_IDS = {
  CHAMPIONSHIP: '49597',
  TROPHY: '42212',
  CUP: '49599',
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
    // Discontinued for 2026-27 - retained only so historic match links resolve.
    hidden: true,
  },
  {
    id: LEAGUE_IDS.SLB_CUP,
    name: 'SLB Cup',
    shortName: 'Cup',
    country: 'England',
    apiProvider: 'geniussports',
    geniusSportsCompetitionId: SLB_COMPETITION_IDS.CUP,
    hasStandings: false,
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
 * Leagues that are browsable in the current season.
 *
 * Excludes competitions marked `hidden` (i.e. no longer running). Use this
 * for anything user-facing or current-season scoped; use `predefinedLeagues`
 * when you need every known competition, such as resolving a historic match
 * by ID.
 */
export const visibleLeagues: LeagueConfig[] = predefinedLeagues.filter(l => !l.hidden);

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
