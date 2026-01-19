import type { Match, MatchDetails, StandingsEntry, QuarterScores, TeamStatistics, PlayerStatistics } from '../types';
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
 * EuroLeague/EuroCup Official APIs
 * 
 * We use TWO APIs to get complete data:
 * - V1 API (api-live.euroleague.net/v1): Returns COMPLETED games only (XML format)
 * - V2 API (feeds.incrowdsports.com): Returns UPCOMING/SCHEDULED games only (JSON format)
 * 
 * Competition codes: "E" for EuroLeague, "U" for EuroCup
 */

// V1 API for completed games (XML)
const EUROLEAGUE_V1_API_BASE = 'https://api-live.euroleague.net/v1';

// V2 API for upcoming/scheduled games (JSON)
const EUROLEAGUE_V2_API_BASE = 'https://feeds.incrowdsports.com/provider/euroleague-feeds/v2';

// Current season code format: E2025 for EuroLeague 2025-26, U2025 for EuroCup 2025-26
const CURRENT_SEASON_YEAR = '2025';

// Parsed game from XML (V1 API - completed games)
interface ParsedGame {
  gameCode: string;
  round: string;
  gameDay: number;
  date: string;
  time: string;
  homeTeam: string;
  homeCode: string;
  homeScore: number | null;
  awayTeam: string;
  awayCode: string;
  awayScore: number | null;
  played: boolean;
}

// V2 API game structure (upcoming games)
interface V2Game {
  id: string;
  identifier: string;
  code: number;
  date: string;
  status: string;
  home: {
    code: string;
    name: string;
    abbreviatedName: string;
    score: number;
    imageUrls?: { crest?: string };
  };
  away: {
    code: string;
    name: string;
    abbreviatedName: string;
    score: number;
    imageUrls?: { crest?: string };
  };
  venue?: {
    name: string;
  };
}

interface V2GamesResponse {
  status: string;
  data: V2Game[];
  metadata: {
    totalItems: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  };
}

// Parsed standing from XML
interface ParsedStanding {
  name: string;
  code: string;
  ranking: number;
  totalGames: number;
  wins: number;
  losses: number;
  ptsFor: number;
  ptsAgainst: number;
  difference: number;
}

/**
 * Fetch XML data from the EuroLeague v1 API (completed games)
 */
async function fetchXMLFromEuroLeague(endpoint: string): Promise<Document> {
  const url = `${EUROLEAGUE_V1_API_BASE}${endpoint}`;

  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        'Accept': 'application/xml',
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
    throw new APIError('Empty response from EuroLeague API');
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(responseText, 'application/xml');
  
  // Check for parse errors
  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    throw new APIError('Failed to parse XML from EuroLeague API');
  }

  return doc;
}

/**
 * Fetch JSON data from the EuroLeague v2 API (upcoming games)
 */
async function fetchJSONFromEuroLeagueV2(endpoint: string): Promise<V2GamesResponse> {
  const url = `${EUROLEAGUE_V2_API_BASE}${endpoint}`;

  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });
  } catch (fetchError) {
    const message = fetchError instanceof Error ? fetchError.message : 'Network request failed';
    throw new APIError(`EuroLeague V2 API network error: ${message}`);
  }

  if (!response.ok) {
    throw new APIError(
      `EuroLeague V2 API request failed: ${response.status} ${response.statusText}`,
      response.status
    );
  }

  const data = await response.json();
  if (!data || data.status !== 'success') {
    throw new APIError('Invalid response from EuroLeague V2 API');
  }

  return data as V2GamesResponse;
}

/**
 * Helper to get text content from an XML element
 */
function getElementText(parent: Element, tagName: string): string {
  return parent.querySelector(tagName)?.textContent?.trim() || '';
}

/**
 * Helper to get number from an XML element
 */
function getElementNumber(parent: Element, tagName: string): number {
  const text = getElementText(parent, tagName);
  const num = parseInt(text, 10);
  return isNaN(num) ? 0 : num;
}

/**
 * Parse games from XML response
 */
function parseGamesXML(doc: Document): ParsedGame[] {
  const games: ParsedGame[] = [];
  const gameElements = doc.querySelectorAll('game');

  gameElements.forEach((gameEl) => {
    const played = getElementText(gameEl, 'played') === 'true';
    const homeScoreText = getElementText(gameEl, 'homescore');
    const awayScoreText = getElementText(gameEl, 'awayscore');

    games.push({
      gameCode: getElementText(gameEl, 'gamecode'),
      round: getElementText(gameEl, 'round'),
      gameDay: getElementNumber(gameEl, 'gameday'),
      date: getElementText(gameEl, 'date'),
      time: getElementText(gameEl, 'time'),
      homeTeam: getElementText(gameEl, 'hometeam'),
      homeCode: getElementText(gameEl, 'homecode'),
      homeScore: homeScoreText ? parseInt(homeScoreText, 10) : null,
      awayTeam: getElementText(gameEl, 'awayteam'),
      awayCode: getElementText(gameEl, 'awaycode'),
      awayScore: awayScoreText ? parseInt(awayScoreText, 10) : null,
      played,
    });
  });

  return games;
}

/**
 * Parse standings from XML response
 */
function parseStandingsXML(doc: Document): ParsedStanding[] {
  const standings: ParsedStanding[] = [];
  const teamElements = doc.querySelectorAll('team');

  teamElements.forEach((teamEl) => {
    standings.push({
      name: getElementText(teamEl, 'name'),
      code: getElementText(teamEl, 'code'),
      ranking: getElementNumber(teamEl, 'ranking'),
      totalGames: getElementNumber(teamEl, 'totalgames'),
      wins: getElementNumber(teamEl, 'wins'),
      losses: getElementNumber(teamEl, 'losses'),
      ptsFor: getElementNumber(teamEl, 'ptsfavour'),
      ptsAgainst: getElementNumber(teamEl, 'ptsagainst'),
      difference: getElementNumber(teamEl, 'difference'),
    });
  });

  return standings;
}

/**
 * Get short name from team name
 */
function getShortName(name: string): string {
  // Common team name mappings for better short names
  const shortNames: Record<string, string> = {
    'Hapoel IBI Tel Aviv': 'Hapoel TA',
    'AS Monaco': 'Monaco',
    'Fenerbahce Beko Istanbul': 'Fenerbahce',
    'Real Madrid': 'Real Madrid',
    'FC Barcelona': 'Barcelona',
    'Olympiacos Piraeus': 'Olympiacos',
    'Panathinaikos AKTOR Athens': 'Panathinaikos',
    'Anadolu Efes Istanbul': 'Efes',
    'Maccabi Rapyd Tel Aviv': 'Maccabi TA',
    'FC Bayern Munich': 'Bayern',
    'Paris Basketball': 'Paris',
    'LDLC ASVEL Villeurbanne': 'ASVEL',
    'EA7 Emporio Armani Milan': 'Milan',
    'Crvena Zvezda Meridianbet Belgrade': 'Crvena Zvezda',
    'Partizan Mozzart Bet Belgrade': 'Partizan',
    'Zalgiris Kaunas': 'Zalgiris',
    'Virtus Bologna': 'Virtus',
    'Valencia Basket': 'Valencia',
    'Dubai Basketball': 'Dubai',
    'Kosner Baskonia Vitoria-Gasteiz': 'Baskonia',
  };

  if (shortNames[name]) {
    return shortNames[name];
  }

  // Fallback: use first word or first two words if short
  const words = name.split(' ');
  if (words.length === 1) return name;
  if (words[0].length <= 3) return `${words[0]} ${words[1]}`;
  return words[0];
}

/**
 * Transform parsed game to Match type
 */
function transformParsedGame(game: ParsedGame): Match {
  // Parse date from format like "Jan 16, 2026"
  const parseDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        // Use local date to avoid timezone issues
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    } catch {
      // Fall through to return original
    }
    return dateStr;
  };

  const dateStr = parseDate(game.date);
  const gameDate = new Date(dateStr + 'T12:00:00'); // Parse as noon to avoid timezone edge cases
  const now = new Date();
  const isPast = gameDate < now;

  return {
    id: game.gameCode,
    homeTeam: {
      id: game.homeCode,
      name: game.homeTeam,
      shortName: getShortName(game.homeTeam),
    },
    awayTeam: {
      id: game.awayCode,
      name: game.awayTeam,
      shortName: getShortName(game.awayTeam),
    },
    homeScore: game.homeScore ?? undefined,
    awayScore: game.awayScore ?? undefined,
    date: dateStr,
    time: game.time || 'TBC',
    venue: 'TBC',
    status: game.played ? 'completed' : isPast ? 'completed' : 'scheduled',
  };
}

/**
 * Transform V2 API game to Match type (upcoming games)
 */
function transformV2Game(game: V2Game): Match {
  // V2 date is ISO format like "2026-01-21T19:00:00.000Z"
  const gameDate = new Date(game.date);
  // Use local date to avoid timezone issues
  const year = gameDate.getFullYear();
  const month = String(gameDate.getMonth() + 1).padStart(2, '0');
  const day = String(gameDate.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;
  const timeStr = gameDate.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });

  // V2 status: 'confirmed' = scheduled, 'result' = completed
  const status = game.status === 'result' ? 'completed' : 'scheduled';

  return {
    id: game.identifier,
    homeTeam: {
      id: game.home.code,
      name: game.home.name,
      shortName: game.home.abbreviatedName || getShortName(game.home.name),
      logo: game.home.imageUrls?.crest,
    },
    awayTeam: {
      id: game.away.code,
      name: game.away.name,
      shortName: game.away.abbreviatedName || getShortName(game.away.name),
      logo: game.away.imageUrls?.crest,
    },
    homeScore: status === 'completed' ? game.home.score : undefined,
    awayScore: status === 'completed' ? game.away.score : undefined,
    date: dateStr,
    time: timeStr,
    venue: game.venue?.name || 'TBC',
    status,
  };
}

/**
 * Transform parsed standing to StandingsEntry type
 */
function transformParsedStanding(standing: ParsedStanding): StandingsEntry {
  return {
    position: standing.ranking,
    team: {
      id: standing.code,
      name: standing.name,
      shortName: getShortName(standing.name),
    },
    played: standing.totalGames,
    won: standing.wins,
    lost: standing.losses,
    pointsFor: standing.ptsFor,
    pointsAgainst: standing.ptsAgainst,
    pointsDifference: standing.difference,
    // EuroLeague uses wins as points (2 for win, 1 for loss)
    points: standing.wins * 2 + standing.losses,
  };
}

/**
 * Get the competition code from league ID
 * EuroLeague: "E", EuroCup: "U"
 */
function getCompetitionCode(leagueId: string): string {
  if (leagueId === LEAGUE_IDS.EUROLEAGUE) {
    return 'E';
  }
  if (leagueId === LEAGUE_IDS.EUROCUP) {
    return 'U';
  }
  return 'E';
}

/**
 * Fetch completed matches from EuroLeague V1 API (XML)
 */
async function fetchCompletedMatches(leagueId: string): Promise<Match[]> {
  const competitionCode = getCompetitionCode(leagueId);
  const seasonCode = `${competitionCode}${CURRENT_SEASON_YEAR}`;

  try {
    const doc = await fetchXMLFromEuroLeague(`/results?seasoncode=${seasonCode}`);
    const games = parseGamesXML(doc);
    return games.map(transformParsedGame);
  } catch (error) {
    console.warn('Failed to fetch completed matches from V1 API:', error);
    return [];
  }
}

/**
 * Fetch upcoming matches from EuroLeague V2 API (JSON)
 * This API only returns scheduled/upcoming games
 */
async function fetchUpcomingMatches(leagueId: string): Promise<Match[]> {
  const competitionCode = getCompetitionCode(leagueId);
  const seasonCode = `${competitionCode}${CURRENT_SEASON_YEAR}`;

  try {
    // V2 API returns games in pages, get first 100 (usually covers several rounds)
    const response = await fetchJSONFromEuroLeagueV2(
      `/competitions/${competitionCode}/seasons/${seasonCode}/games?pageSize=100`
    );
    return response.data.map(transformV2Game);
  } catch (error) {
    console.warn('Failed to fetch upcoming matches from V2 API:', error);
    return [];
  }
}

/**
 * Fetch matches from EuroLeague APIs (combines V1 completed + V2 upcoming)
 */
export async function fetchEuroLeagueMatches(leagueId: string): Promise<Match[]> {
  // Fetch from both APIs in parallel
  const [completedMatches, upcomingMatches] = await Promise.all([
    fetchCompletedMatches(leagueId),
    fetchUpcomingMatches(leagueId),
  ]);

  // Deduplicate by match ID (in case there's overlap)
  const matchMap = new Map<string, Match>();
  
  // Add completed matches first (they have final scores)
  for (const match of completedMatches) {
    matchMap.set(match.id, match);
  }
  
  // Add upcoming matches (won't overwrite completed ones)
  for (const match of upcomingMatches) {
    if (!matchMap.has(match.id)) {
      matchMap.set(match.id, match);
    }
  }

  const allMatches = Array.from(matchMap.values());

  // Sort by date ascending (earliest first) - UI will auto-scroll to today
  return allMatches.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });
}

/**
 * Fetch standings from EuroLeague API (v1 XML)
 */
export async function fetchEuroLeagueStandings(leagueId: string): Promise<StandingsEntry[]> {
  const competitionCode = getCompetitionCode(leagueId);
  const seasonCode = `${competitionCode}${CURRENT_SEASON_YEAR}`;

  const doc = await fetchXMLFromEuroLeague(`/standings?seasoncode=${seasonCode}`);
  const standings = parseStandingsXML(doc);

  if (standings.length === 0) {
    return [];
  }

  return standings
    .map(transformParsedStanding)
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
 * Parse detailed game XML from EuroLeague V1 API
 * Returns quarter scores, team stats, and player stats
 */
function parseGameDetailsXML(xml: string): {
  quarterScores: QuarterScores;
  homeStats: TeamStatistics | null;
  awayStats: TeamStatistics | null;
  homePlayers: PlayerStatistics[];
  awayPlayers: PlayerStatistics[];
} {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');
  
  const quarterScores: QuarterScores = {};
  const homePlayers: PlayerStatistics[] = [];
  const awayPlayers: PlayerStatistics[] = [];
  
  // Parse quarter scores from partials
  const localClub = doc.querySelector('localclub');
  const roadClub = doc.querySelector('roadclub');
  
  const homePartials = localClub?.querySelector('partials');
  const awayPartials = roadClub?.querySelector('partials');
  
  if (homePartials && awayPartials) {
    const getPartial = (el: Element, attr: string) => parseInt(el.getAttribute(attr) || '0', 10);
    
    quarterScores.q1 = {
      home: getPartial(homePartials, 'Partial1'),
      away: getPartial(awayPartials, 'Partial1'),
    };
    quarterScores.q2 = {
      home: getPartial(homePartials, 'Partial2'),
      away: getPartial(awayPartials, 'Partial2'),
    };
    quarterScores.q3 = {
      home: getPartial(homePartials, 'Partial3'),
      away: getPartial(awayPartials, 'Partial3'),
    };
    quarterScores.q4 = {
      home: getPartial(homePartials, 'Partial4'),
      away: getPartial(awayPartials, 'Partial4'),
    };
    
    // Check for overtime
    const homeOT = getPartial(homePartials, 'ExtraPeriod1');
    const awayOT = getPartial(awayPartials, 'ExtraPeriod1');
    if (homeOT > 0 || awayOT > 0) {
      quarterScores.ot = { home: homeOT, away: awayOT };
    }
  }
  
  // Parse player stats and calculate team totals
  const parseTeamStats = (clubEl: Element | null, playersArray: PlayerStatistics[]): TeamStatistics | null => {
    if (!clubEl) return null;
    
    const playerStats = clubEl.querySelectorAll('playerstats stat');
    let totalFGM = 0, totalFGA = 0;
    let total3PM = 0, total3PA = 0;
    let totalFTM = 0, totalFTA = 0;
    let totalRebounds = 0, totalOffReb = 0, totalDefReb = 0;
    let totalAssists = 0, totalTurnovers = 0, totalSteals = 0, totalBlocks = 0;
    
    playerStats.forEach((stat) => {
      const getText = (tag: string) => stat.querySelector(tag)?.textContent || '0';
      const getNum = (tag: string) => parseInt(getText(tag), 10) || 0;
      
      const playerName = getText('PlayerName');
      const playerId = getText('PlayerCode');
      const points = getNum('Score');
      const rebounds = getNum('TotalRebounds');
      const assists = getNum('Assistances');
      const minutesStr = getText('TimePlayed'); // format: "20:22"
      const minutes = parseInt(minutesStr.split(':')[0], 10) || 0;
      
      playersArray.push({
        id: playerId,
        name: playerName,
        points,
        rebounds,
        assists,
        minutes,
      });
      
      // Accumulate team totals
      totalFGM += getNum('FieldGoalsMadeTotal');
      totalFGA += getNum('FieldGoalsAttemptedTotal');
      total3PM += getNum('FieldGoalsMade3');
      total3PA += getNum('FieldGoalsAttempted3');
      totalFTM += getNum('FreeThrowsMade');
      totalFTA += getNum('FreeThrowsAttempted');
      totalRebounds += rebounds;
      totalOffReb += getNum('OffensiveRebounds');
      totalDefReb += getNum('DefensiveRebounds');
      totalAssists += assists;
      totalTurnovers += getNum('Turnovers');
      totalSteals += getNum('Steals');
      totalBlocks += getNum('BlocksFavour');
    });
    
    // Sort players by points
    playersArray.sort((a, b) => b.points - a.points);
    
    // Calculate percentages
    const fieldGoalPct = totalFGA > 0 ? Math.round((totalFGM / totalFGA) * 100 * 10) / 10 : 0;
    const threePointPct = total3PA > 0 ? Math.round((total3PM / total3PA) * 100 * 10) / 10 : 0;
    const freeThrowPct = totalFTA > 0 ? Math.round((totalFTM / totalFTA) * 100 * 10) / 10 : 0;
    
    return {
      fieldGoalPct,
      threePointPct,
      freeThrowPct,
      rebounds: totalRebounds,
      offensiveRebounds: totalOffReb,
      defensiveRebounds: totalDefReb,
      assists: totalAssists,
      turnovers: totalTurnovers,
      steals: totalSteals,
      blocks: totalBlocks,
    };
  };
  
  const homeStats = parseTeamStats(localClub, homePlayers);
  const awayStats = parseTeamStats(roadClub, awayPlayers);
  
  return { quarterScores, homeStats, awayStats, homePlayers, awayPlayers };
}

/**
 * Fetch detailed game data from EuroLeague V1 API
 */
async function fetchGameDetails(gameCode: string, competitionCode: string): Promise<{
  quarterScores: QuarterScores;
  homeStats: TeamStatistics | null;
  awayStats: TeamStatistics | null;
  homePlayers: PlayerStatistics[];
  awayPlayers: PlayerStatistics[];
} | null> {
  const seasonCode = `${competitionCode}${CURRENT_SEASON_YEAR}`;
  const url = `${EUROLEAGUE_V1_API_BASE}/games?gameCode=${gameCode}&seasonCode=${seasonCode}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch game details: ${response.status}`);
      return null;
    }
    
    const xml = await response.text();
    return parseGameDetailsXML(xml);
  } catch (error) {
    console.error('Error fetching game details:', error);
    return null;
  }
}

/**
 * Fetch match details from EuroLeague API
 */
export async function fetchEuroLeagueMatchDetails(
  matchId: string,
  leagueId: string
): Promise<MatchDetails | null> {
  // Get basic match info
  const matches = await fetchEuroLeagueMatches(leagueId);
  const match = matches.find(m => m.id === matchId);
  
  if (!match) {
    return null;
  }
  
  // For completed matches, try to fetch detailed stats
  if (match.status === 'completed') {
    // Determine competition code from league ID
    const competitionCode = leagueId === LEAGUE_IDS.EUROLEAGUE ? 'E' : 'U';
    
    // The match ID might be in format "E2025_170" or just "170" or an identifier
    // Extract the game code (numeric part)
    const gameCodeMatch = matchId.match(/(\d+)$/);
    const gameCode = gameCodeMatch ? gameCodeMatch[1] : matchId;
    
    const details = await fetchGameDetails(gameCode, competitionCode);
    
    if (details) {
      return {
        ...match,
        quarterScores: details.quarterScores,
        homeStats: details.homeStats || undefined,
        awayStats: details.awayStats || undefined,
        homePlayers: details.homePlayers.length > 0 ? details.homePlayers : undefined,
        awayPlayers: details.awayPlayers.length > 0 ? details.awayPlayers : undefined,
        lastUpdated: new Date().toISOString(),
      };
    }
  }
  
  // Return basic match info if detailed stats not available
  return {
    ...match,
    lastUpdated: new Date().toISOString(),
  };
}
