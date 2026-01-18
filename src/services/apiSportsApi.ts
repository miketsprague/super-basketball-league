import type { Match, MatchDetails, StandingsEntry } from '../types';

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
 * API-Sports Basketball API
 * Documentation: https://api-sports.io/documentation/basketball/v1
 * 
 * This API provides basketball data including fixtures, standings, and statistics.
 * Requires an API key (free tier: 100 requests/day).
 */

const API_BASE_URL = 'https://v1.basketball.api-sports.io';

// API key from environment variable
const API_KEY = import.meta.env.VITE_API_SPORTS_KEY || '';

// British Basketball League ID (Super League Basketball)
// This is the BBL league ID in api-sports.io
const BBL_LEAGUE_ID = 79;

// Current season
const CURRENT_SEASON = '2024-2025';

interface ApiSportsGame {
  id: number;
  date: string;
  time: string;
  timestamp: number;
  timezone: string;
  stage: string | null;
  week: string | null;
  status: {
    long: string;
    short: string;
    timer: number | null;
  };
  league: {
    id: number;
    name: string;
    type: string;
    season: string;
    logo: string;
  };
  country: {
    id: number;
    name: string;
    code: string;
    flag: string;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
    };
    away: {
      id: number;
      name: string;
      logo: string;
    };
  };
  scores: {
    home: {
      quarter_1: number | null;
      quarter_2: number | null;
      quarter_3: number | null;
      quarter_4: number | null;
      over_time: number | null;
      total: number | null;
    };
    away: {
      quarter_1: number | null;
      quarter_2: number | null;
      quarter_3: number | null;
      quarter_4: number | null;
      over_time: number | null;
      total: number | null;
    };
  };
}

interface ApiSportsStanding {
  position: number;
  stage: string;
  group: {
    name: string;
    points: number | null;
  };
  team: {
    id: number;
    name: string;
    logo: string;
  };
  league: {
    id: number;
    name: string;
    type: string;
    season: string;
    logo: string;
  };
  country: {
    id: number;
    name: string;
    code: string;
    flag: string;
  };
  games: {
    played: number;
    win: {
      total: number;
      percentage: string;
    };
    lose: {
      total: number;
      percentage: string;
    };
  };
  points: {
    for: number;
    against: number;
  };
  form: string | null;
  description: string | null;
}

interface ApiSportsResponse<T> {
  get: string;
  parameters: Record<string, string>;
  errors: string[] | Record<string, string>;
  results: number;
  response: T[];
}

/**
 * Fetch data from API-Sports Basketball API
 */
async function fetchFromApiSports<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T[]> {
  if (!API_KEY) {
    throw new APIError('API-Sports API key not configured. Set VITE_API_SPORTS_KEY environment variable.');
  }

  const queryString = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)])
  ).toString();
  
  const url = `${API_BASE_URL}/${endpoint}${queryString ? `?${queryString}` : ''}`;

  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        'x-apisports-key': API_KEY,
      },
    });
  } catch (fetchError) {
    const message = fetchError instanceof Error ? fetchError.message : 'Network request failed';
    throw new APIError(`API-Sports network error: ${message}`);
  }

  if (!response.ok) {
    throw new APIError(
      `API-Sports request failed: ${response.status} ${response.statusText}`,
      response.status
    );
  }

  const responseText = await response.text();
  if (!responseText || responseText.trim() === '') {
    return [];
  }

  try {
    const data: ApiSportsResponse<T> = JSON.parse(responseText);
    
    // Check for API errors
    if (data.errors && (Array.isArray(data.errors) ? data.errors.length > 0 : Object.keys(data.errors).length > 0)) {
      const errorMsg = Array.isArray(data.errors) ? data.errors.join(', ') : Object.values(data.errors).join(', ');
      throw new APIError(`API-Sports error: ${errorMsg}`);
    }
    
    return data.response || [];
  } catch (parseError) {
    if (parseError instanceof APIError) {
      throw parseError;
    }
    const message = parseError instanceof Error ? parseError.message : 'Unknown parse error';
    throw new APIError(`Invalid JSON from API-Sports: ${message}`);
  }
}

/**
 * Transform API-Sports game to our Match type
 */
function transformGame(game: ApiSportsGame): Match {
  const statusLong = game.status.long.toLowerCase();
  const isCompleted = statusLong === 'finished' || statusLong === 'after over time';
  const isLive = statusLong.includes('quarter') || statusLong === 'halftime' || statusLong === 'break';
  
  // Extract date from the ISO string
  const dateObj = new Date(game.date);
  const dateStr = dateObj.toISOString().split('T')[0];
  
  // Extract time (HH:MM format)
  const timeStr = game.time || dateObj.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return {
    id: String(game.id),
    homeTeam: {
      id: String(game.teams.home.id),
      name: game.teams.home.name,
      shortName: getShortName(game.teams.home.name),
      logo: game.teams.home.logo,
    },
    awayTeam: {
      id: String(game.teams.away.id),
      name: game.teams.away.name,
      shortName: getShortName(game.teams.away.name),
      logo: game.teams.away.logo,
    },
    homeScore: game.scores.home.total ?? undefined,
    awayScore: game.scores.away.total ?? undefined,
    date: dateStr,
    time: timeStr,
    venue: 'TBC', // API doesn't provide venue in games endpoint
    status: isLive ? 'live' : isCompleted ? 'completed' : 'scheduled',
  };
}

/**
 * Get short name from team name
 */
function getShortName(name: string): string {
  // Remove common suffixes
  const cleaned = name
    .replace(/\b(Basketball|BC|Club)\b/gi, '')
    .trim();
  
  // If it's a multi-word name, use the most distinctive part
  const words = cleaned.split(' ').filter(w => w.length > 0);
  if (words.length > 1) {
    // Try to find a city/location name (usually last word)
    return words[words.length - 1];
  }
  return cleaned;
}

/**
 * Transform API-Sports standing to our StandingsEntry type
 */
function transformStanding(standing: ApiSportsStanding): StandingsEntry {
  const pointsDiff = standing.points.for - standing.points.against;
  
  // Calculate points (wins count as 2 points in basketball)
  const points = standing.group.points ?? (standing.games.win.total * 2);
  
  return {
    position: standing.position,
    team: {
      id: String(standing.team.id),
      name: standing.team.name,
      shortName: getShortName(standing.team.name),
      logo: standing.team.logo,
    },
    played: standing.games.played,
    won: standing.games.win.total,
    lost: standing.games.lose.total,
    pointsFor: standing.points.for,
    pointsAgainst: standing.points.against,
    pointsDifference: pointsDiff,
    points,
  };
}

/**
 * Fetch matches from API-Sports for Super League Basketball
 */
export async function fetchApiSportsMatches(): Promise<Match[]> {
  // Fetch current season games
  const games = await fetchFromApiSports<ApiSportsGame>('games', {
    league: BBL_LEAGUE_ID,
    season: CURRENT_SEASON,
  });

  if (!games || games.length === 0) {
    return [];
  }

  const matches = games.map(transformGame);

  // Sort by date (upcoming first, then recent results)
  const now = new Date();
  return matches.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    
    const aIsUpcoming = dateA >= now;
    const bIsUpcoming = dateB >= now;
    
    // Upcoming games first
    if (aIsUpcoming && !bIsUpcoming) return -1;
    if (!aIsUpcoming && bIsUpcoming) return 1;
    
    // For upcoming: soonest first
    // For past: most recent first
    if (aIsUpcoming) {
      return dateA.getTime() - dateB.getTime();
    }
    return dateB.getTime() - dateA.getTime();
  }).slice(0, 20); // Limit to 20 matches
}

/**
 * Fetch standings from API-Sports for Super League Basketball
 */
export async function fetchApiSportsStandings(): Promise<StandingsEntry[]> {
  const standings = await fetchFromApiSports<ApiSportsStanding>('standings', {
    league: BBL_LEAGUE_ID,
    season: CURRENT_SEASON,
  });

  if (!standings || standings.length === 0) {
    return [];
  }

  return standings
    .map(transformStanding)
    .sort((a, b) => a.position - b.position);
}

/**
 * Fetch all data from API-Sports for Super League Basketball
 */
export async function fetchApiSportsAllData(): Promise<{
  matches: Match[];
  standings: StandingsEntry[];
}> {
  const [matches, standings] = await Promise.all([
    fetchApiSportsMatches(),
    fetchApiSportsStandings(),
  ]);

  return { matches, standings };
}

/**
 * Fetch match details from API-Sports
 */
export async function fetchApiSportsMatchDetails(matchId: string): Promise<MatchDetails | null> {
  const games = await fetchFromApiSports<ApiSportsGame>('games', {
    id: matchId,
  });

  if (!games || games.length === 0) {
    return null;
  }

  const game = games[0];
  const match = transformGame(game);

  // Build quarter scores if available
  const quarterScores = game.scores.home.quarter_1 !== null ? {
    q1: {
      home: game.scores.home.quarter_1 ?? 0,
      away: game.scores.away.quarter_1 ?? 0,
    },
    q2: {
      home: game.scores.home.quarter_2 ?? 0,
      away: game.scores.away.quarter_2 ?? 0,
    },
    q3: {
      home: game.scores.home.quarter_3 ?? 0,
      away: game.scores.away.quarter_3 ?? 0,
    },
    q4: {
      home: game.scores.home.quarter_4 ?? 0,
      away: game.scores.away.quarter_4 ?? 0,
    },
    ...(game.scores.home.over_time !== null ? {
      ot: {
        home: game.scores.home.over_time ?? 0,
        away: game.scores.away.over_time ?? 0,
      },
    } : {}),
  } : undefined;

  return {
    ...match,
    quarterScores,
    currentPeriod: match.status === 'completed' ? 'Full Time' : undefined,
    lastUpdated: new Date().toISOString(),
  };
}
