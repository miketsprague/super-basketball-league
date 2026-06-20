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

export type WinStreakType = 'W' | 'L';

export interface WinStreak {
  type: WinStreakType;
  count: number;
}

/**
 * Compute the current win/loss streak for a team from a list of matches.
 * Considers only completed matches with scores, sorted by date descending.
 * Returns null if no completed matches are found.
 */
export function computeWinStreak(matches: Match[], teamName: string): WinStreak | null {
  const normalised = normaliseTeamName(teamName);

  const isTeamHome = (match: Match): boolean =>
    normaliseTeamName(match.homeTeam.name) === normalised ||
    normaliseTeamName(match.homeTeam.shortName ?? match.homeTeam.name) === normalised;

  const completed = matches
    .filter(
      (m) =>
        m.status === 'completed' &&
        matchInvolvesTeam(m, teamName) &&
        m.homeScore !== undefined &&
        m.awayScore !== undefined,
    )
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time || '00:00'}`).getTime();
      const dateB = new Date(`${b.date}T${b.time || '00:00'}`).getTime();
      return dateB - dateA;
    });

  if (completed.length === 0) return null;

  const getResult = (match: Match): WinStreakType => {
    const home = isTeamHome(match);
    const teamScore = home ? match.homeScore! : match.awayScore!;
    const opponentScore = home ? match.awayScore! : match.homeScore!;
    return teamScore > opponentScore ? 'W' : 'L';
  };

  const streakType = getResult(completed[0]);
  let count = 0;
  for (const match of completed) {
    if (getResult(match) === streakType) {
      count++;
    } else {
      break;
    }
  }

  return { type: streakType, count };
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
