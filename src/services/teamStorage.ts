import type { Match } from '../types';

const FOLLOWED_TEAM_KEY = 'basketball-followed-team';

export interface FollowedTeam {
  name: string;
}

export interface TeamRecord {
  played: number;
  won: number;
  lost: number;
  winPct: number;
  avgPointsFor: number;
  avgPointsAgainst: number;
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

/**
 * Compute a team's season record from a list of matches.
 * Only completed matches are counted.
 */
export function computeTeamRecord(matches: Match[], teamName: string): TeamRecord {
  const completed = matches.filter(
    (m) => m.status === 'completed' && matchInvolvesTeam(m, teamName),
  );

  const normalised = normaliseTeamName(teamName);
  let won = 0;
  let totalFor = 0;
  let totalAgainst = 0;

  for (const m of completed) {
    const isHome =
      normaliseTeamName(m.homeTeam.name) === normalised ||
      normaliseTeamName(m.homeTeam.shortName ?? m.homeTeam.name) === normalised;
    const teamScore = isHome ? (m.homeScore ?? 0) : (m.awayScore ?? 0);
    const oppScore = isHome ? (m.awayScore ?? 0) : (m.homeScore ?? 0);
    if (teamScore > oppScore) won++;
    totalFor += teamScore;
    totalAgainst += oppScore;
  }

  const played = completed.length;
  const lost = played - won;
  const winPct = played > 0 ? Math.round((won / played) * 100) : 0;
  const avgPointsFor = played > 0 ? Math.round((totalFor / played) * 10) / 10 : 0;
  const avgPointsAgainst = played > 0 ? Math.round((totalAgainst / played) * 10) / 10 : 0;

  return { played, won, lost, winPct, avgPointsFor, avgPointsAgainst };
}
