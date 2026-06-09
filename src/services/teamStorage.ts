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

export type FormResult = 'W' | 'L';

/**
 * Compute a team's recent form from a list of matches.
 * Returns results ordered most-recent first (up to maxResults completed matches).
 * Basketball has no draws, so results are always 'W' or 'L'.
 */
export function computeTeamForm(
  matches: Match[],
  teamId: string,
  maxResults = 5,
): FormResult[] {
  const completed = matches
    .filter(
      m =>
        m.status === 'completed' &&
        (m.homeTeam.id === teamId || m.awayTeam.id === teamId) &&
        m.homeScore !== undefined &&
        m.awayScore !== undefined,
    )
    .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));

  return completed.slice(0, maxResults).map(m => {
    const isHome = m.homeTeam.id === teamId;
    const teamScore = isHome ? m.homeScore! : m.awayScore!;
    const oppScore = isHome ? m.awayScore! : m.homeScore!;
    return teamScore > oppScore ? 'W' : 'L';
  });
}
