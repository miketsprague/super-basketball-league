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
 * EuroLeague/EuroCup Official API (v1)
 * 
 * This API provides free access to EuroLeague and EuroCup basketball data.
 * Returns XML format which we parse using DOMParser.
 * Competition codes: "E" for EuroLeague, "U" for EuroCup
 */

const EUROLEAGUE_API_BASE = 'https://api-live.euroleague.net/v1';

// Current season code format: E2025 for EuroLeague 2025-26, U2025 for EuroCup 2025-26
const CURRENT_SEASON_YEAR = '2025';

// Parsed game from XML
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
 * Fetch XML data from the EuroLeague v1 API
 */
async function fetchXMLFromEuroLeague(endpoint: string): Promise<Document> {
  const url = `${EUROLEAGUE_API_BASE}${endpoint}`;

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
        return date.toISOString().split('T')[0];
      }
    } catch {
      // Fall through to return original
    }
    return dateStr;
  };

  const dateStr = parseDate(game.date);
  const gameDate = new Date(dateStr);
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
 * Fetch matches from EuroLeague API (v1 XML)
 */
export async function fetchEuroLeagueMatches(leagueId: string): Promise<Match[]> {
  const competitionCode = getCompetitionCode(leagueId);
  const seasonCode = `${competitionCode}${CURRENT_SEASON_YEAR}`;

  const doc = await fetchXMLFromEuroLeague(`/results?seasoncode=${seasonCode}`);
  const games = parseGamesXML(doc);

  if (games.length === 0) {
    return [];
  }

  const matches = games.map(transformParsedGame);

  // Sort by date (upcoming first, then recent results)
  const now = new Date();
  return matches.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    const aIsUpcoming = dateA >= now;
    const bIsUpcoming = dateB >= now;

    if (aIsUpcoming && !bIsUpcoming) return -1;
    if (!aIsUpcoming && bIsUpcoming) return 1;

    // For upcoming: soonest first; for past: most recent first
    if (aIsUpcoming) {
      return dateA.getTime() - dateB.getTime();
    }
    return dateB.getTime() - dateA.getTime();
  }).slice(0, 20);
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
 * Fetch match details from EuroLeague API
 */
export async function fetchEuroLeagueMatchDetails(
  matchId: string,
  leagueId: string
): Promise<MatchDetails | null> {
  // The v1 API doesn't have a single-game endpoint, so we fetch all and find
  const matches = await fetchEuroLeagueMatches(leagueId);
  const match = matches.find(m => m.id === matchId);
  
  if (match) {
    return {
      ...match,
      lastUpdated: new Date().toISOString(),
    };
  }

  return null;
}
