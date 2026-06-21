import type { Match } from '../types';

const FOLLOWED_TEAM_KEY = 'basketball-followed-team';

export interface FollowedTeam {
  name: string;
}

/**
 * Get the currently followed team from localStorage
 */
export function getFollowedTeam(): FollowedTeam | null {
  try {
    const stored = localStorage.getItem(FOLLOWED_TEAM_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (parsed && typeof parsed.name === 'string' && parsed.name.trim()) {
      return parsed as FollowedTeam;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Set the followed team in localStorage
 */
export function setFollowedTeam(team: FollowedTeam): void {
  try {
    localStorage.setItem(FOLLOWED_TEAM_KEY, JSON.stringify(team));
  } catch {
    // localStorage may be unavailable
  }
}

/**
 * Clear the followed team from localStorage
 */
export function clearFollowedTeam(): void {
  try {
    localStorage.removeItem(FOLLOWED_TEAM_KEY);
  } catch {
    // localStorage may be unavailable
  }
}

/**
 * Normalise a team name for comparison purposes.
 * Lowercases and trims whitespace.
 */
export function normaliseTeamName(name: string): string {
  return name.trim().toLowerCase();
}

/**
 * Check if a match involves a given team (case-insensitive comparison on name and shortName)
 */
export function matchInvolvesTeam(
  match: { homeTeam: { name: string; shortName?: string }; awayTeam: { name: string; shortName?: string } },
  teamName: string,
): boolean {
  const normalised = normaliseTeamName(teamName);
  return (
    normaliseTeamName(match.homeTeam.name) === normalised ||
    normaliseTeamName(match.awayTeam.name) === normalised ||
    normaliseTeamName(match.homeTeam.shortName ?? match.homeTeam.name) === normalised ||
    normaliseTeamName(match.awayTeam.shortName ?? match.awayTeam.name) === normalised
  );
}

export interface ScoringAverage {
  /** Average points scored per game (rounded to 1 decimal place) */
  avgPointsFor: number;
  /** Average points conceded per game (rounded to 1 decimal place) */
  avgPointsAgainst: number;
  /** Number of completed games used in the calculation */
  gamesPlayed: number;
}

/**
 * Return true if the given team name matches the home team of a match.
 */
function isHomeTeam(
  match: { homeTeam: { name: string; shortName?: string } },
  teamName: string,
): boolean {
  const normalised = normaliseTeamName(teamName);
  return (
    normaliseTeamName(match.homeTeam.name) === normalised ||
    normaliseTeamName(match.homeTeam.shortName ?? match.homeTeam.name) === normalised
  );
}

/**
 * Compute scoring averages for a team from their completed matches.
 * Returns null if there are no completed matches with scores available.
 */
export function computeScoringAverage(matches: Match[], teamName: string): ScoringAverage | null {
  const completed = matches.filter(
    m =>
      m.status === 'completed' &&
      matchInvolvesTeam(m, teamName) &&
      m.homeScore !== undefined &&
      m.awayScore !== undefined,
  );

  if (completed.length === 0) return null;

  let totalFor = 0;
  let totalAgainst = 0;

  for (const m of completed) {
    const home = isHomeTeam(m, teamName);
    totalFor += home ? m.homeScore! : m.awayScore!;
    totalAgainst += home ? m.awayScore! : m.homeScore!;
  }

  return {
    avgPointsFor: Math.round((totalFor / completed.length) * 10) / 10,
    avgPointsAgainst: Math.round((totalAgainst / completed.length) * 10) / 10,
    gamesPlayed: completed.length,
  };
}
