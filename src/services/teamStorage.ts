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

export interface CloseGameRecord {
  won: number;
  lost: number;
  total: number;
  margin: number;
}

/**
 * Compute a team's record in close games — matches decided by `closeMargin` points or fewer.
 * Returns null if there are fewer than 2 close games (not statistically meaningful).
 */
export function computeCloseGameRecord(
  matches: {
    homeTeam: { name: string; shortName?: string };
    awayTeam: { name: string; shortName?: string };
    homeScore?: number;
    awayScore?: number;
    status: string;
  }[],
  teamName: string,
  closeMargin = 5,
): CloseGameRecord | null {
  const teamMatches = matches.filter(
    m =>
      m.status === 'completed' &&
      m.homeScore !== undefined &&
      m.awayScore !== undefined &&
      matchInvolvesTeam(m, teamName),
  );

  const closeGames = teamMatches.filter(
    m => Math.abs(m.homeScore! - m.awayScore!) <= closeMargin,
  );

  if (closeGames.length < 2) return null;

  const normalised = normaliseTeamName(teamName);
  let won = 0;
  let lost = 0;

  for (const m of closeGames) {
    const isHome =
      normaliseTeamName(m.homeTeam.name) === normalised ||
      normaliseTeamName(m.homeTeam.shortName ?? m.homeTeam.name) === normalised;
    const teamScore = isHome ? m.homeScore! : m.awayScore!;
    const oppScore = isHome ? m.awayScore! : m.homeScore!;
    if (teamScore > oppScore) {
      won++;
    } else {
      lost++;
    }
  }

  return { won, lost, total: closeGames.length, margin: closeMargin };
}
