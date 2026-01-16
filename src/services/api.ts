import type { Match, MatchDetails, StandingsEntry } from '../types';
import { mockMatches, mockStandings, getMockMatchDetails } from './mockData';

// TheSportsDB API configuration
const API_BASE_URL = 'https://www.thesportsdb.com/api/v1/json';
const API_KEY = import.meta.env.VITE_SPORTSDB_API_KEY || '38dde0dae877d7b97cccc6ac32faacef';
const LEAGUE_ID = '4431'; // Super League Basketball
const CURRENT_SEASON = '2025-2026';

// Flag to track if API is working (can be disabled for debugging)
const useAPI = true;

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

interface APIResponse {
  events?: SportsDBEvent[];
  table?: SportsDBTableEntry[];
}

/**
 * Fetch data from TheSportsDB API
 */
async function fetchFromAPI<T extends APIResponse>(endpoint: string): Promise<T | null> {
  if (!useAPI) {
    return null;
  }

  try {
    const url = `${API_BASE_URL}/${API_KEY}/${endpoint}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn(`API request failed: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API fetch error:', error);
    return null;
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
 * Fetch upcoming and recent fixtures
 */
export async function fetchMatches(): Promise<Match[]> {
  try {
    // Try to fetch next fixtures
    const nextData = await fetchFromAPI<APIResponse>(`eventsnextleague.php?id=${LEAGUE_ID}`);
    
    // Try to fetch past fixtures
    const pastData = await fetchFromAPI<APIResponse>(`eventspastleague.php?id=${LEAGUE_ID}`);
    
    const matches: Match[] = [];
    
    // Transform next fixtures
    if (nextData?.events) {
      matches.push(...nextData.events.slice(0, 10).map(transformEvent));
    }
    
    // Transform past fixtures (limit to recent 10)
    if (pastData?.events) {
      matches.push(...pastData.events.slice(0, 10).map(transformEvent));
    }
    
    // If we got data from API, return it
    if (matches.length > 0) {
      // Sort by date (most recent first, then upcoming)
      return matches.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });
    }
    
    // Fall back to mock data
    console.info('Using mock data for fixtures');
    return mockMatches;
  } catch (error) {
    console.error('Error fetching matches:', error);
    return mockMatches;
  }
}

/**
 * Fetch league standings
 */
export async function fetchStandings(): Promise<StandingsEntry[]> {
  try {
    const data = await fetchFromAPI<APIResponse>(`lookuptable.php?l=${LEAGUE_ID}&s=${CURRENT_SEASON}`);
    
    if (data?.table && Array.isArray(data.table)) {
      // Transform and sort by position/points
      const standings = data.table.map((entry, index) => transformTableEntry(entry, index));
      return standings.sort((a: StandingsEntry, b: StandingsEntry) => b.points - a.points);
    }
    
    // Fall back to mock data
    console.info('Using mock data for standings');
    return mockStandings;
  } catch (error) {
    console.error('Error fetching standings:', error);
    return mockStandings;
  }
}

/**
 * Fetch both fixtures and standings
 */
export async function fetchAllData(): Promise<{
  matches: Match[];
  standings: StandingsEntry[];
}> {
  const [matches, standings] = await Promise.all([
    fetchMatches(),
    fetchStandings(),
  ]);
  
  return { matches, standings };
}

/**
 * Fetch details for a specific match
 */
export async function fetchMatchDetails(matchId: string): Promise<MatchDetails | null> {
  try {
    // Try to fetch event details from API
    const data = await fetchFromAPI<{ events?: SportsDBEvent[] }>(`lookupevent.php?id=${matchId}`);
    
    if (data?.events && data.events.length > 0) {
      const event = data.events[0];
      const baseMatch = transformEvent(event);
      
      // TheSportsDB free tier doesn't have detailed stats, so we use mock data for details
      const mockDetails = getMockMatchDetails(matchId);
      
      return {
        ...baseMatch,
        quarterScores: mockDetails?.quarterScores,
        homeStats: mockDetails?.homeStats,
        awayStats: mockDetails?.awayStats,
        homePlayers: mockDetails?.homePlayers,
        awayPlayers: mockDetails?.awayPlayers,
        currentPeriod: mockDetails?.currentPeriod,
        lastUpdated: new Date().toISOString(),
      };
    }
    
    // Fall back to mock data
    return getMockMatchDetails(matchId);
  } catch (error) {
    console.error('Error fetching match details:', error);
    return getMockMatchDetails(matchId);
  }
}
