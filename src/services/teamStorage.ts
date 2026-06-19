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

export interface HomeAwayRecord {
  home: { played: number; won: number; lost: number };
  away: { played: number; won: number; lost: number };
}

/**
 * Compute a team's separate home and away win/loss records from a list of completed matches.
 * Uses case-insensitive name matching (same logic as matchInvolvesTeam).
 */
export function computeHomeAwayRecord(matches: Match[], teamName: string): HomeAwayRecord {
  const normalised = normaliseTeamName(teamName);
  const record: HomeAwayRecord = {
    home: { played: 0, won: 0, lost: 0 },
    away: { played: 0, won: 0, lost: 0 },
  };

  for (const match of matches) {
    if (match.status !== 'completed') continue;
    if (match.homeScore == null || match.awayScore == null) continue;

    const homeNorm =
      normaliseTeamName(match.homeTeam.name) === normalised ||
      normaliseTeamName(match.homeTeam.shortName ?? match.homeTeam.name) === normalised;
    const awayNorm =
      normaliseTeamName(match.awayTeam.name) === normalised ||
      normaliseTeamName(match.awayTeam.shortName ?? match.awayTeam.name) === normalised;

    if (homeNorm) {
      record.home.played++;
      if (match.homeScore > match.awayScore) record.home.won++;
      else record.home.lost++;
    } else if (awayNorm) {
      record.away.played++;
      if (match.awayScore > match.homeScore) record.away.won++;
      else record.away.lost++;
    }
  }

  return record;
}
