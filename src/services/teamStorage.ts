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
 * Season record for a team, computed from match results.
 */
export interface TeamRecord {
  played: number;
  won: number;
  lost: number;
  pointsFor: number;
  pointsAgainst: number;
  pointsDifference: number;
  winPercentage: number;
}

/**
 * Compute a team's season record from a list of completed matches.
 *
 * Only completed matches where the team appears (home or away) are counted.
 * `teamId` is matched against `homeTeam.id` and `awayTeam.id`.
 */
export function computeTeamRecord(matches: Match[], teamId: string): TeamRecord {
  const completed = matches.filter(
    (m) =>
      m.status === 'completed' &&
      m.homeScore !== undefined &&
      m.awayScore !== undefined &&
      (m.homeTeam.id === teamId || m.awayTeam.id === teamId),
  );

  let won = 0;
  let lost = 0;
  let pointsFor = 0;
  let pointsAgainst = 0;

  for (const m of completed) {
    const isHome = m.homeTeam.id === teamId;
    const teamScore = isHome ? m.homeScore! : m.awayScore!;
    const oppScore = isHome ? m.awayScore! : m.homeScore!;

    pointsFor += teamScore;
    pointsAgainst += oppScore;

    if (teamScore > oppScore) {
      won++;
    } else {
      lost++;
    }
  }

  const played = completed.length;
  return {
    played,
    won,
    lost,
    pointsFor,
    pointsAgainst,
    pointsDifference: pointsFor - pointsAgainst,
    winPercentage: played === 0 ? 0 : Math.round((won / played) * 1000) / 10,
  };
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
