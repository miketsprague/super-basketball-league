import type { Match, MatchDetails, StandingsEntry, League } from '../types';
import { LEAGUE_IDS, predefinedLeagues } from './leagues';

// TheSportsDB API configuration
const API_BASE_URL = 'https://www.thesportsdb.com/api/v1/json';
// Use TheSportsDB's free public test API key as fallback
const API_KEY = import.meta.env.VITE_SPORTSDB_API_KEY || '3';
const CURRENT_SEASON = '2025-2026';

// Custom error class for API failures
export class APIError extends Error {
  statusCode?: number;
  
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
  }
}

interface SportsDBEvent {
  idEvent: string;
  idHomeTeam: string;
  idAwayTeam: string;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  dateEvent: string;
  strTime: string;
  strVenue: string;
}

interface SportsDBTableEntry {
  teamid?: string;
  idTeam?: string;
  name?: string;
  strTeam?: string;
  played?: string;
  intPlayed?: string;
  win?: string;
  intWin?: string;
  loss?: string;
  intLoss?: string;
  goalsfor?: string;
  intGoalsFor?: string;
  goalsagainst?: string;
  intGoalsAgainst?: string;
  total?: string;
  intPoints?: string;
}

interface SportsDBLeague {
  idLeague: string;
  strLeague: string;
  strSport: string;
  strLeagueAlternate?: string;
  strCountry?: string;
}

interface LeaguesResponse {
  leagues?: SportsDBLeague[];
}

interface APIResponse {
  events?: SportsDBEvent[];
  table?: SportsDBTableEntry[];
}

/**
 * Fetch data from TheSportsDB API
 * Throws APIError on failure instead of returning null
 */
async function fetchFromAPI<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE_URL}/${API_KEY}/${endpoint}`;
  
  let response: Response;
  try {
    response = await fetch(url);
  } catch (fetchError) {
    // Network error (connection refused, DNS failure, CORS, etc.)
    const message = fetchError instanceof Error ? fetchError.message : 'Network request failed';
    throw new APIError(`Network error for ${endpoint}: ${message}`);
  }
  
  if (!response.ok) {
    throw new APIError(
      `API request failed for ${endpoint}: ${response.status} ${response.statusText}`,
      response.status
    );
  }

  // Check for empty response body before parsing JSON
  const responseText = await response.text();
  if (!responseText || responseText.trim() === '') {
    // Return empty object for empty responses - the caller will handle missing data
    return {} as T;
  }

  try {
    const data = JSON.parse(responseText);
    return data;
  } catch (parseError) {
    const message = parseError instanceof Error ? parseError.message : 'Unknown parse error';
    throw new APIError(`Invalid JSON response from ${endpoint}: ${message}`);
  }
}

/**
 * Transform TheSportsDB event to our Match type
 */
function transformEvent(event: SportsDBEvent): Match {
  const isCompleted = event.intHomeScore !== null && event.intAwayScore !== null;
  const date = new Date(event.dateEvent);
  const isPast = date < new Date();
  
  return {
    id: event.idEvent,
    homeTeam: {
      id: event.idHomeTeam,
      name: event.strHomeTeam,
      shortName: event.strHomeTeam.replace(/\b(Basketball|FC|AFC|United)\b/gi, '').trim(),
    },
    awayTeam: {
      id: event.idAwayTeam,
      name: event.strAwayTeam,
      shortName: event.strAwayTeam.replace(/\b(Basketball|FC|AFC|United)\b/gi, '').trim(),
    },
    homeScore: event.intHomeScore ? parseInt(event.intHomeScore) : undefined,
    awayScore: event.intAwayScore ? parseInt(event.intAwayScore) : undefined,
    date: event.dateEvent,
    time: event.strTime || '19:00',
    venue: event.strVenue || 'TBC',
    status: isCompleted ? 'completed' : isPast ? 'completed' : 'scheduled',
  };
}

/**
 * Transform TheSportsDB table entry to our StandingsEntry type
 */
function transformTableEntry(entry: SportsDBTableEntry, index: number): StandingsEntry {
  const played = parseInt(entry.played || entry.intPlayed || '0');
  const won = parseInt(entry.win || entry.intWin || '0');
  const lost = parseInt(entry.loss || entry.intLoss || '0');
  const pointsFor = parseInt(entry.goalsfor || entry.intGoalsFor || '0');
  const pointsAgainst = parseInt(entry.goalsagainst || entry.intGoalsAgainst || '0');
  
  return {
    position: index + 1,
    team: {
      id: entry.teamid || entry.idTeam || '',
      name: entry.name || entry.strTeam || '',
      shortName: (entry.name || entry.strTeam || '').replace(/\b(Basketball|FC|AFC|United)\b/gi, '').trim(),
    },
    played,
    won,
    lost,
    pointsFor,
    pointsAgainst,
    pointsDifference: pointsFor - pointsAgainst,
    points: parseInt(entry.total || entry.intPoints || '0'),
  };
}

/**
 * Fetch upcoming and recent fixtures for a specific league
 * Throws APIError on failure - caller should handle errors appropriately
 */
export async function fetchMatches(leagueId: string): Promise<Match[]> {
  // Fetch next and past fixtures in parallel
  const [nextData, pastData] = await Promise.all([
    fetchFromAPI<APIResponse>(`eventsnextleague.php?id=${leagueId}`),
    fetchFromAPI<APIResponse>(`eventspastleague.php?id=${leagueId}`),
  ]);
  
  const matches: Match[] = [];
  
  // Transform next fixtures
  if (nextData?.events) {
    matches.push(...nextData.events.slice(0, 10).map(transformEvent));
  }
  
  // Transform past fixtures (limit to recent 10)
  if (pastData?.events) {
    matches.push(...pastData.events.slice(0, 10).map(transformEvent));
  }
  
  // Sort by date (most recent first, then upcoming)
  return matches.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
}

/**
 * Fetch league standings for a specific league
 * Throws APIError on failure - caller should handle errors appropriately
 */
export async function fetchStandings(leagueId: string): Promise<StandingsEntry[]> {
  const data = await fetchFromAPI<APIResponse>(`lookuptable.php?l=${leagueId}&s=${CURRENT_SEASON}`);
  
  if (data?.table && Array.isArray(data.table)) {
    // Transform and sort by position/points
    const standings = data.table.map((entry, index) => transformTableEntry(entry, index));
    return standings.sort((a: StandingsEntry, b: StandingsEntry) => b.points - a.points);
  }
  
  return [];
}

/**
 * Fetch both fixtures and standings for a specific league
 * Throws APIError on failure - caller should handle errors appropriately
 */
export async function fetchAllData(leagueId: string): Promise<{
  matches: Match[];
  standings: StandingsEntry[];
}> {
  const [matches, standings] = await Promise.all([
    fetchMatches(leagueId),
    fetchStandings(leagueId),
  ]);
  
  return { matches, standings };
}

/**
 * Fetch details for a specific match
 * Throws APIError on failure - caller should handle errors appropriately
 */
export async function fetchMatchDetails(matchId: string): Promise<MatchDetails | null> {
  const data = await fetchFromAPI<{ events?: SportsDBEvent[] }>(`lookupevent.php?id=${matchId}`);
  
  if (data?.events && data.events.length > 0) {
    const event = data.events[0];
    const baseMatch = transformEvent(event);
    
    return {
      ...baseMatch,
      lastUpdated: new Date().toISOString(),
    };
  }
  
  return null;
}

/**
 * Fetch available basketball leagues from API
 * Throws APIError on failure - caller should handle errors appropriately
 */
export async function fetchLeagues(): Promise<League[]> {
  const data = await fetchFromAPI<LeaguesResponse>('all_leagues.php');
  
  if (data?.leagues && Array.isArray(data.leagues)) {
    // Filter for basketball leagues that match our predefined leagues
    const basketballLeagues = data.leagues
      .filter((league) => 
        league.strSport === 'Basketball' &&
        (league.idLeague === LEAGUE_IDS.SUPER_LEAGUE || league.idLeague === LEAGUE_IDS.EUROLEAGUE)
      )
      .map((league): League => ({
        id: league.idLeague,
        name: league.strLeague,
        shortName: league.strLeagueAlternate || league.strLeague.split(' ')[0],
        country: league.strCountry || 'International',
      }));
    
    if (basketballLeagues.length > 0) {
      return basketballLeagues;
    }
  }
  
  // Return predefined leagues if API returns empty result (but no error)
  return predefinedLeagues;
}
