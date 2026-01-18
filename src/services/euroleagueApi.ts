import type { Match, MatchDetails, StandingsEntry } from '../types';
import { LEAGUE_IDS } from './leagues';

/**
 * Custom error class for API failures
 */
class APIError extends Error {
  statusCode?: number;
  
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
  }
}

/**
 * EuroLeague/EuroCup Official API
 * Documentation: https://api-live.euroleague.net/swagger/index.html
 * 
 * This API provides free access to EuroLeague and EuroCup basketball data.
 * Competition codes: "E" for EuroLeague, "U" for EuroCup
 */

const EUROLEAGUE_API_BASE = 'https://api-live.euroleague.net/v3';

// Current season code format: E2025 for EuroLeague 2025, U2025 for EuroCup 2025
const CURRENT_SEASON_YEAR = '2025';

interface EuroLeagueGame {
  code: string;
  seasonCode: string;
  phaseType: string;
  round: number;
  gameDay: number;
  date: string;
  arenaName: string;
  arenaCity: string;
  home: {
    code: string;
    name: string;
    imageUrl?: string;
    score?: number;
  };
  away: {
    code: string;
    name: string;
    imageUrl?: string;
    score?: number;
  };
  played: boolean;
  gameStatus?: string;
  localDate?: string;
  localTime?: string;
}

interface EuroLeagueStanding {
  position: number;
  club: {
    code: string;
    name: string;
    imageUrl?: string;
  };
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  pointsFor: number;
  pointsAgainst: number;
  pointsDifference: number;
  points?: number;
}

interface EuroLeagueGamesResponse {
  data?: EuroLeagueGame[];
  games?: EuroLeagueGame[];
}

interface EuroLeagueStandingsResponse {
  data?: EuroLeagueStanding[];
  standings?: EuroLeagueStanding[];
}

/**
 * Fetch data from the EuroLeague API
 */
async function fetchFromEuroLeagueAPI<T>(endpoint: string): Promise<T> {
  const url = `${EUROLEAGUE_API_BASE}${endpoint}`;

  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });
  } catch (fetchError) {
    const message = fetchError instanceof Error ? fetchError.message : 'Network request failed';
    throw new APIError(`EuroLeague API network error: ${message}`);
  }

  if (!response.ok) {
    throw new APIError(
      `EuroLeague API request failed: ${response.status} ${response.statusText}`,
      response.status
    );
  }

  const responseText = await response.text();
  if (!responseText || responseText.trim() === '') {
    return {} as T;
  }

  try {
    return JSON.parse(responseText);
  } catch (parseError) {
    const message = parseError instanceof Error ? parseError.message : 'Unknown parse error';
    throw new APIError(`Invalid JSON from EuroLeague API: ${message}`);
  }
}

/**
 * Transform EuroLeague game to our Match type
 */
function transformEuroLeagueGame(game: EuroLeagueGame): Match {
  const isCompleted = game.played;
  const gameDate = new Date(game.date);
  const isPast = gameDate < new Date();

  // Extract time from date or use localTime
  const time = game.localTime || gameDate.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return {
    id: game.code,
    homeTeam: {
      id: game.home.code,
      name: game.home.name,
      shortName: game.home.name.split(' ').slice(-1)[0], // Last word as short name
      logo: game.home.imageUrl,
    },
    awayTeam: {
      id: game.away.code,
      name: game.away.name,
      shortName: game.away.name.split(' ').slice(-1)[0],
      logo: game.away.imageUrl,
    },
    homeScore: game.home.score ?? undefined,
    awayScore: game.away.score ?? undefined,
    date: game.localDate || game.date.split('T')[0],
    time,
    venue: game.arenaName ? `${game.arenaName}, ${game.arenaCity}` : 'TBC',
    status: isCompleted ? 'completed' : isPast ? 'completed' : 'scheduled',
  };
}

/**
 * Transform EuroLeague standing to our StandingsEntry type
 */
function transformEuroLeagueStanding(standing: EuroLeagueStanding): StandingsEntry {
  return {
    position: standing.position,
    team: {
      id: standing.club.code,
      name: standing.club.name,
      shortName: standing.club.name.split(' ').slice(-1)[0],
      logo: standing.club.imageUrl,
    },
    played: standing.gamesPlayed,
    won: standing.gamesWon,
    lost: standing.gamesLost,
    pointsFor: standing.pointsFor,
    pointsAgainst: standing.pointsAgainst,
    pointsDifference: standing.pointsDifference,
    // EuroLeague uses wins as points (2 for win, 1 for loss typically)
    points: standing.points ?? standing.gamesWon * 2 + standing.gamesLost,
  };
}

/**
 * Get the competition code from league ID
 * EuroLeague: "E", EuroCup: "U"
 */
function getCompetitionCode(leagueId: string): string {
  // Map our league IDs to EuroLeague competition codes
  if (leagueId === LEAGUE_IDS.EUROLEAGUE) {
    return 'E';
  }
  if (leagueId === LEAGUE_IDS.EUROCUP) {
    return 'U';
  }
  // Default to EuroLeague
  return 'E';
}

/**
 * Fetch matches from EuroLeague API
 */
export async function fetchEuroLeagueMatches(leagueId: string): Promise<Match[]> {
  const competitionCode = getCompetitionCode(leagueId);
  const seasonCode = `${competitionCode}${CURRENT_SEASON_YEAR}`;

  // Try multiple endpoint patterns as the API structure may vary
  const endpoints = [
    `/competitions/${competitionCode}/seasons/${seasonCode}/games`,
    `/games?seasonCode=${seasonCode}`,
  ];

  let data: EuroLeagueGamesResponse | null = null;
  let lastError: Error | null = null;

  for (const endpoint of endpoints) {
    try {
      data = await fetchFromEuroLeagueAPI<EuroLeagueGamesResponse>(endpoint);
      if (data?.data || data?.games) {
        break;
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      continue;
    }
  }

  if (!data && lastError) {
    throw lastError;
  }

  const games = data?.data || data?.games || [];
  
  if (!Array.isArray(games) || games.length === 0) {
    return [];
  }

  const matches = games.map(transformEuroLeagueGame);

  // Sort by date (most recent/upcoming first)
  return matches.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    const now = new Date();

    // Separate upcoming and past
    const aIsUpcoming = dateA >= now;
    const bIsUpcoming = dateB >= now;

    if (aIsUpcoming && !bIsUpcoming) return -1;
    if (!aIsUpcoming && bIsUpcoming) return 1;

    // For upcoming: ascending (soonest first)
    // For past: descending (most recent first)
    if (aIsUpcoming) {
      return dateA.getTime() - dateB.getTime();
    }
    return dateB.getTime() - dateA.getTime();
  }).slice(0, 20); // Limit to 20 matches
}

/**
 * Fetch standings from EuroLeague API
 */
export async function fetchEuroLeagueStandings(leagueId: string): Promise<StandingsEntry[]> {
  const competitionCode = getCompetitionCode(leagueId);
  const seasonCode = `${competitionCode}${CURRENT_SEASON_YEAR}`;

  const endpoints = [
    `/competitions/${competitionCode}/seasons/${seasonCode}/standings`,
    `/standings?seasonCode=${seasonCode}`,
  ];

  let data: EuroLeagueStandingsResponse | null = null;
  let lastError: Error | null = null;

  for (const endpoint of endpoints) {
    try {
      data = await fetchFromEuroLeagueAPI<EuroLeagueStandingsResponse>(endpoint);
      if (data?.data || data?.standings) {
        break;
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      continue;
    }
  }

  if (!data && lastError) {
    throw lastError;
  }

  const standings = data?.data || data?.standings || [];

  if (!Array.isArray(standings) || standings.length === 0) {
    return [];
  }

  return standings.map(transformEuroLeagueStanding)
    .sort((a, b) => a.position - b.position);
}

/**
 * Fetch all data from EuroLeague API
 */
export async function fetchEuroLeagueAllData(leagueId: string): Promise<{
  matches: Match[];
  standings: StandingsEntry[];
}> {
  const [matches, standings] = await Promise.all([
    fetchEuroLeagueMatches(leagueId),
    fetchEuroLeagueStandings(leagueId),
  ]);

  return { matches, standings };
}

/**
 * Fetch match details from EuroLeague API
 */
export async function fetchEuroLeagueMatchDetails(
  matchId: string,
  leagueId: string
): Promise<MatchDetails | null> {
  const competitionCode = getCompetitionCode(leagueId);
  const seasonCode = `${competitionCode}${CURRENT_SEASON_YEAR}`;

  try {
    const endpoint = `/competitions/${competitionCode}/seasons/${seasonCode}/games/${matchId}`;
    const data = await fetchFromEuroLeagueAPI<{ data?: EuroLeagueGame }>(endpoint);

    if (data?.data) {
      const match = transformEuroLeagueGame(data.data);
      return {
        ...match,
        lastUpdated: new Date().toISOString(),
      };
    }
  } catch {
    // If specific endpoint fails, try to find in games list
    const matches = await fetchEuroLeagueMatches(leagueId);
    const match = matches.find(m => m.id === matchId);
    if (match) {
      return {
        ...match,
        lastUpdated: new Date().toISOString(),
      };
    }
  }

  return null;
}
