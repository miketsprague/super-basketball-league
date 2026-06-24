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

export interface RecentRecord {
  /** Number of recent games included */
  played: number;
  wins: number;
  losses: number;
  /** Average points scored per game (1 decimal place) */
  ppg: number;
  /** Average points conceded per game (1 decimal place) */
  opp: number;
  /** Average point differential per game (1 decimal place; positive = winning margin) */
  diff: number;
  /** Win/loss result for each game, most recent first */
  form: ('W' | 'L')[];
  /** The lastN value that was requested */
  lastN: number;
}

/**
 * Compute a team's recent form record for their last N completed matches.
 * Returns null if the team has no completed matches.
 */
export function computeRecentRecord(
  matches: Match[],
  teamName: string,
  lastN = 5,
): RecentRecord | null {
  const completed = matches
    .filter(
      m =>
        m.status === 'completed' &&
        m.homeScore !== undefined &&
        m.awayScore !== undefined &&
        matchInvolvesTeam(m, teamName),
    )
    .sort((a, b) => {
      const dateCmp = b.date.localeCompare(a.date);
      return dateCmp !== 0 ? dateCmp : b.time.localeCompare(a.time);
    });

  const recent = completed.slice(0, lastN);
  if (recent.length === 0) return null;

  let wins = 0;
  let totalPF = 0;
  let totalPA = 0;
  const form: ('W' | 'L')[] = [];

  for (const m of recent) {
    const isHome =
      normaliseTeamName(m.homeTeam.name) === normaliseTeamName(teamName) ||
      normaliseTeamName(m.homeTeam.shortName ?? m.homeTeam.name) === normaliseTeamName(teamName);
    const teamScore = isHome ? m.homeScore! : m.awayScore!;
    const oppScore = isHome ? m.awayScore! : m.homeScore!;
    const won = teamScore > oppScore;
    if (won) wins++;
    totalPF += teamScore;
    totalPA += oppScore;
    form.push(won ? 'W' : 'L');
  }

  const played = recent.length;
  return {
    played,
    wins,
    losses: played - wins,
    ppg: Math.round((totalPF / played) * 10) / 10,
    opp: Math.round((totalPA / played) * 10) / 10,
    diff: Math.round(((totalPF - totalPA) / played) * 10) / 10,
    form,
    lastN,
  };
}
