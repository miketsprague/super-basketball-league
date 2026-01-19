import type { Match, MatchDetails, StandingsEntry, QuarterScores, TeamStatistics, PlayerStatistics } from '../types';

/**
 * Genius Sports Data Provider for Super League Basketball
 * 
 * This provider fetches data from the official SLB website's data source (Genius Sports).
 * The API returns JSON with HTML content that we parse to extract standings and fixtures.
 * 
 * Base URL: https://hosted.dcd.shared.geniussports.com/embednf/SLB/en/
 * Endpoints:
 *   - /standings - League standings
 *   - /schedule?roundNumber=-1 - All fixtures and results (past and upcoming)
 *   - /competition/41897/match/{matchId}/boxscore - Full box score with player stats
 *   - /competition/41897/match/{matchId}/playbyplay - Play-by-play with running scores
 */

const GENIUS_SPORTS_BASE = 'https://hosted.dcd.shared.geniussports.com/embednf/SLB/en';
const SLB_COMPETITION_ID = '41897';

interface GeniusSportsResponse {
  css: string[];
  js: string[];
  html: string;
}

/**
 * Fetch data from Genius Sports API
 */
async function fetchFromGeniusSports(endpoint: string): Promise<string> {
  const url = `${GENIUS_SPORTS_BASE}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Genius Sports API error: ${response.status} ${response.statusText}`);
  }

  const data: GeniusSportsResponse = await response.json();
  return data.html;
}

/**
 * Parse standings HTML from Genius Sports
 */
function parseStandingsHTML(html: string): StandingsEntry[] {
  const standings: StandingsEntry[] = [];
  
  // Create a DOM parser
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Find all team rows in the standings table
  const rows = doc.querySelectorAll('table.standings tbody tr');
  
  rows.forEach((row) => {
    const cells = row.querySelectorAll('td');
    if (cells.length < 5) return;
    
    // Extract position
    const position = parseInt(cells[0]?.textContent?.trim() || '0', 10);
    
    // Extract team info
    const teamCell = row.querySelector('td.team-name');
    const teamLink = teamCell?.querySelector('a');
    const teamNameFull = teamCell?.querySelector('.team-name-full')?.textContent?.trim() || '';
    const teamCode = teamCell?.querySelector('.team-name-code')?.textContent?.trim() || '';
    
    // Extract team ID from link href
    const teamHref = teamLink?.getAttribute('href') || '';
    const teamIdMatch = teamHref.match(/\/team\/(\d+)/);
    const teamId = teamIdMatch ? teamIdMatch[1] : teamCode;
    
    // Extract logo URL
    const logoImg = row.querySelector('td.team-logo img');
    const logo = logoImg?.getAttribute('src') || undefined;
    
    // Extract stats - find by class names
    const played = parseInt(row.querySelector('.STANDINGS_played')?.textContent?.trim() || '0', 10);
    const won = parseInt(row.querySelector('.STANDINGS_won')?.textContent?.trim() || '0', 10);
    const lost = parseInt(row.querySelector('.STANDINGS_lost')?.textContent?.trim() || '0', 10);
    const points = parseInt(row.querySelector('.STANDINGS_standingPoints')?.textContent?.trim() || '0', 10);
    
    // Points for/against not available in basic standings, estimate from other data
    // In basketball, standings points are typically 2*wins, so we can't derive PF/PA
    const pointsFor = 0;
    const pointsAgainst = 0;
    const pointsDifference = 0;
    
    standings.push({
      position,
      team: {
        id: teamId,
        name: teamNameFull,
        shortName: teamCode || getShortName(teamNameFull),
        logo,
      },
      played,
      won,
      lost,
      pointsFor,
      pointsAgainst,
      pointsDifference,
      points,
    });
  });
  
  return standings.sort((a, b) => a.position - b.position);
}

/**
 * Parse schedule/fixtures HTML from Genius Sports
 */
function parseScheduleHTML(html: string): Match[] {
  const matches: Match[] = [];
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Find all match elements
  const matchElements = doc.querySelectorAll('.match-wrap');
  
  matchElements.forEach((matchEl) => {
    // Extract match ID from id attribute (e.g., "extfix_2702593")
    const matchIdAttr = matchEl.getAttribute('id') || '';
    const matchIdMatch = matchIdAttr.match(/extfix_(\d+)/);
    const matchId = matchIdMatch ? matchIdMatch[1] : `match-${matches.length}`;
    
    // Extract status from class (STATUS_COMPLETE or STATUS_SCHEDULED)
    const matchClass = matchEl.className || '';
    let status: 'scheduled' | 'live' | 'completed' = 'scheduled';
    if (matchClass.includes('STATUS_COMPLETE')) {
      status = 'completed';
    } else if (matchClass.includes('STATUS_LIVE')) {
      status = 'live';
    }
    
    // Extract teams
    const homeTeamEl = matchEl.querySelector('.home-team');
    const awayTeamEl = matchEl.querySelector('.away-team');
    
    const homeTeamName = homeTeamEl?.querySelector('.team-name-full')?.textContent?.trim() || 
                         homeTeamEl?.querySelector('.team-name span')?.textContent?.trim() || 
                         homeTeamEl?.querySelector('.team-name')?.textContent?.trim() || 'Home';
    const awayTeamName = awayTeamEl?.querySelector('.team-name-full')?.textContent?.trim() ||
                         awayTeamEl?.querySelector('.team-name span')?.textContent?.trim() ||
                         awayTeamEl?.querySelector('.team-name')?.textContent?.trim() || 'Away';
    
    // Extract scores - look for .team-score or .homescore/.awayscore
    const homeScoreEl = homeTeamEl?.querySelector('.team-score .fake-cell, .team-score');
    const awayScoreEl = awayTeamEl?.querySelector('.team-score .fake-cell, .team-score');
    const homeScoreText = homeScoreEl?.textContent?.trim();
    const awayScoreText = awayScoreEl?.textContent?.trim();
    // Score is valid if it's a number (not empty, not &nbsp;)
    const homeScore = homeScoreText && /^\d+$/.test(homeScoreText) ? parseInt(homeScoreText, 10) : undefined;
    const awayScore = awayScoreText && /^\d+$/.test(awayScoreText) ? parseInt(awayScoreText, 10) : undefined;
    
    // Extract logos
    const homeLogo = homeTeamEl?.querySelector('img')?.getAttribute('src') || undefined;
    const awayLogo = awayTeamEl?.querySelector('img')?.getAttribute('src') || undefined;
    
    // Extract team IDs from links
    const homeLink = homeTeamEl?.querySelector('a')?.getAttribute('href') || '';
    const awayLink = awayTeamEl?.querySelector('a')?.getAttribute('href') || '';
    const homeIdMatch = homeLink.match(/\/team\/(\d+)/);
    const awayIdMatch = awayLink.match(/\/team\/(\d+)/);
    const homeId = homeIdMatch ? homeIdMatch[1] : getShortName(homeTeamName);
    const awayId = awayIdMatch ? awayIdMatch[1] : getShortName(awayTeamName);
    
    // Extract date and time from .match-time span (format: "Jan 30, 2026, 7:30 PM")
    const dateTimeEl = matchEl.querySelector('.match-time span');
    const dateTimeText = dateTimeEl?.textContent?.trim() || '';
    const { date, time } = parseDateTimeString(dateTimeText);
    
    // Extract venue - prefer the venue link text, fall back to venue div
    const venueLinkEl = matchEl.querySelector('.match-venue a.venuename');
    const venueContainerEl = matchEl.querySelector('.match-venue');
    const venue = venueLinkEl?.textContent?.trim() || 
                  venueContainerEl?.querySelector('a')?.textContent?.trim() ||
                  'TBC';
    
    matches.push({
      id: matchId,
      homeTeam: {
        id: homeId,
        name: homeTeamName,
        shortName: getShortName(homeTeamName),
        logo: homeLogo,
      },
      awayTeam: {
        id: awayId,
        name: awayTeamName,
        shortName: getShortName(awayTeamName),
        logo: awayLogo,
      },
      homeScore,
      awayScore,
      date,
      time,
      venue,
      status,
    });
  });
  
  return matches;
}

/**
 * Helper to format date as YYYY-MM-DD in local timezone
 */
function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse combined date/time string from Genius Sports
 * Format: "Jan 30, 2026, 7:30 PM"
 * Returns: { date: "2026-01-30", time: "19:30" }
 */
function parseDateTimeString(dateTimeStr: string): { date: string; time: string } {
  if (!dateTimeStr) {
    return { date: toLocalDateString(new Date()), time: 'TBC' };
  }
  
  try {
    // Parse "Jan 30, 2026, 7:30 PM" format
    const parsed = new Date(dateTimeStr);
    if (!isNaN(parsed.getTime())) {
      const date = toLocalDateString(parsed);
      const hours = parsed.getHours();
      const minutes = parsed.getMinutes();
      const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      return { date, time };
    }
  } catch {
    // Fall through to defaults
  }
  
  return { date: toLocalDateString(new Date()), time: 'TBC' };
}

/**
 * Get short name from team name
 */
function getShortName(name: string): string {
  const shortNames: Record<string, string> = {
    'London Lions': 'Lions',
    'Cheshire Phoenix': 'Phoenix',
    'B. Braun Sheffield Sharks': 'Sharks',
    'B.Braun Sheffield Sharks': 'Sharks',
    'Sheffield Sharks': 'Sharks',
    'Bristol Flyers': 'Flyers',
    'Manchester Basketball': 'Manchester',
    'Leicester Riders': 'Riders',
    'Newcastle Eagles': 'Eagles',
    'Surrey 89ers': '89ers',
    'Caledonia Gladiators': 'Gladiators',
  };
  
  return shortNames[name] || name.split(' ').pop() || name;
}

/**
 * Fetch standings from Genius Sports
 */
export async function fetchGeniusSportsStandings(): Promise<StandingsEntry[]> {
  const html = await fetchFromGeniusSports('/standings');
  return parseStandingsHTML(html);
}

/**
 * Fetch matches/fixtures from Genius Sports
 */
export async function fetchGeniusSportsMatches(): Promise<Match[]> {
  // Use roundNumber=-1 to get ALL matches (past and upcoming), not just recent
  const html = await fetchFromGeniusSports('/schedule?roundNumber=-1');
  const matches = parseScheduleHTML(html);
  
  // Sort by date ascending (earliest first) - UI will auto-scroll to today
  return matches.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });
}

/**
 * Fetch all data from Genius Sports
 */
export async function fetchGeniusSportsAllData(): Promise<{
  matches: Match[];
  standings: StandingsEntry[];
}> {
  const [matches, standings] = await Promise.all([
    fetchGeniusSportsMatches(),
    fetchGeniusSportsStandings(),
  ]);
  
  return { matches, standings };
}

/**
 * Parse box score HTML to extract player stats and team totals
 */
function parseBoxScoreHTML(html: string): {
  homeStats: TeamStatistics | null;
  awayStats: TeamStatistics | null;
  homePlayers: PlayerStatistics[];
  awayPlayers: PlayerStatistics[];
} {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  const tables = doc.querySelectorAll('table.tableClass');
  const homePlayers: PlayerStatistics[] = [];
  const awayPlayers: PlayerStatistics[] = [];
  let homeStats: TeamStatistics | null = null;
  let awayStats: TeamStatistics | null = null;
  
  tables.forEach((table, tableIndex) => {
    const isHomeTeam = tableIndex === 0;
    const players = isHomeTeam ? homePlayers : awayPlayers;
    
    // Parse player rows from tbody
    const playerRows = table.querySelectorAll('tbody tr');
    playerRows.forEach((row) => {
      const cells = row.querySelectorAll('td');
      if (cells.length < 10) return;
      
      const playerNameEl = row.querySelector('.playerName a');
      const playerName = playerNameEl?.textContent?.trim() || '';
      if (!playerName) return;
      
      // Extract player ID from link
      const playerHref = playerNameEl?.getAttribute('href') || '';
      const playerIdMatch = playerHref.match(/\/person\/(\d+)/);
      const playerId = playerIdMatch ? playerIdMatch[1] : `player-${players.length}`;
      
      // Parse minutes (format: "34:01" -> 34)
      const minsCell = cells[2];
      const minsText = minsCell?.textContent?.trim() || '0';
      const minutes = parseInt(minsText.split(':')[0], 10) || 0;
      
      // Points is typically the 21st column (index 20)
      // Column order: No, Player, Mins, FGM, FGA, FG%, 3PM, 3PA, 3P%, FTM, FTA, FT%, OFF, DEF, REB, AST, STL, BLK, PF, TO, Pts, +/-
      const ptsIndex = 20;
      const rebIndex = 14;
      const astIndex = 15;
      
      const points = parseInt(cells[ptsIndex]?.textContent?.trim() || '0', 10) || 0;
      const rebounds = parseInt(cells[rebIndex]?.textContent?.trim() || '0', 10) || 0;
      const assists = parseInt(cells[astIndex]?.textContent?.trim() || '0', 10) || 0;
      
      players.push({
        id: playerId,
        name: playerName,
        points,
        rebounds,
        assists,
        minutes,
      });
    });
    
    // Parse team totals from tfoot
    const totalsRow = table.querySelector('tfoot tr');
    if (totalsRow) {
      const cells = totalsRow.querySelectorAll('td');
      // Column indices (0-indexed, skipping No and Player columns):
      // 2=Mins, 3=FGM, 4=FGA, 5=FG%, 6=3PM, 7=3PA, 8=3P%, 9=FTM, 10=FTA, 11=FT%
      // 12=OFF, 13=DEF, 14=REB, 15=AST, 16=STL, 17=BLK, 18=PF, 19=TO, 20=Pts
      const fgPct = parseFloat(cells[5]?.textContent?.trim() || '0') || 0;
      const threePct = parseFloat(cells[8]?.textContent?.trim() || '0') || 0;
      const ftPct = parseFloat(cells[11]?.textContent?.trim() || '0') || 0;
      const offReb = parseInt(cells[12]?.textContent?.trim() || '0', 10) || 0;
      const defReb = parseInt(cells[13]?.textContent?.trim() || '0', 10) || 0;
      const totalReb = parseInt(cells[14]?.textContent?.trim() || '0', 10) || 0;
      const assists = parseInt(cells[15]?.textContent?.trim() || '0', 10) || 0;
      const steals = parseInt(cells[16]?.textContent?.trim() || '0', 10) || 0;
      const blocks = parseInt(cells[17]?.textContent?.trim() || '0', 10) || 0;
      const turnovers = parseInt(cells[19]?.textContent?.trim() || '0', 10) || 0;
      
      const teamStats: TeamStatistics = {
        fieldGoalPct: fgPct,
        threePointPct: threePct,
        freeThrowPct: ftPct,
        rebounds: totalReb,
        offensiveRebounds: offReb,
        defensiveRebounds: defReb,
        assists,
        turnovers,
        steals,
        blocks,
      };
      
      if (isHomeTeam) {
        homeStats = teamStats;
      } else {
        awayStats = teamStats;
      }
    }
  });
  
  // Sort players by points (top scorers first)
  homePlayers.sort((a, b) => b.points - a.points);
  awayPlayers.sort((a, b) => b.points - a.points);
  
  return { homeStats, awayStats, homePlayers, awayPlayers };
}

/**
 * Parse play-by-play HTML to extract quarter scores
 * Looks for scores at "Period end" events
 */
function parsePlayByPlayHTML(html: string): QuarterScores {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  const quarterScores: QuarterScores = {};
  
  // Find all period end actions and get the score just before them
  const allActions = doc.querySelectorAll('.pbpa');
  const periodEndScores: { home: number; away: number }[] = [];
  
  let lastScore = { home: 0, away: 0 };
  
  allActions.forEach((action) => {
    // Check for score in this action
    const scoreEl = action.querySelector('.pbpsc');
    if (scoreEl) {
      const scoreText = scoreEl.textContent?.trim() || '';
      const scoreMatch = scoreText.match(/(\d+)-(\d+)/);
      if (scoreMatch) {
        lastScore = {
          home: parseInt(scoreMatch[1], 10),
          away: parseInt(scoreMatch[2], 10),
        };
      }
    }
    
    // Check if this is a period end
    const actionText = action.querySelector('.pbp-action')?.textContent?.trim() || '';
    if (actionText.toLowerCase().includes('period end')) {
      periodEndScores.push({ ...lastScore });
    }
  });
  
  // Calculate individual quarter scores from cumulative scores
  if (periodEndScores.length >= 1) {
    quarterScores.q1 = periodEndScores[0];
  }
  if (periodEndScores.length >= 2) {
    quarterScores.q2 = {
      home: periodEndScores[1].home - periodEndScores[0].home,
      away: periodEndScores[1].away - periodEndScores[0].away,
    };
  }
  if (periodEndScores.length >= 3) {
    quarterScores.q3 = {
      home: periodEndScores[2].home - periodEndScores[1].home,
      away: periodEndScores[2].away - periodEndScores[1].away,
    };
  }
  if (periodEndScores.length >= 4) {
    quarterScores.q4 = {
      home: periodEndScores[3].home - periodEndScores[2].home,
      away: periodEndScores[3].away - periodEndScores[2].away,
    };
  }
  // Handle overtime if there are more than 4 periods
  if (periodEndScores.length >= 5) {
    quarterScores.ot = {
      home: periodEndScores[4].home - periodEndScores[3].home,
      away: periodEndScores[4].away - periodEndScores[3].away,
    };
  }
  
  return quarterScores;
}

/**
 * Fetch box score data for a specific match
 */
async function fetchBoxScore(matchId: string): Promise<{
  homeStats: TeamStatistics | null;
  awayStats: TeamStatistics | null;
  homePlayers: PlayerStatistics[];
  awayPlayers: PlayerStatistics[];
}> {
  try {
    const html = await fetchFromGeniusSports(`/competition/${SLB_COMPETITION_ID}/match/${matchId}/boxscore`);
    return parseBoxScoreHTML(html);
  } catch (error) {
    console.error('Failed to fetch box score:', error);
    return { homeStats: null, awayStats: null, homePlayers: [], awayPlayers: [] };
  }
}

/**
 * Fetch play-by-play data to extract quarter scores
 */
async function fetchQuarterScores(matchId: string): Promise<QuarterScores> {
  try {
    const html = await fetchFromGeniusSports(`/competition/${SLB_COMPETITION_ID}/match/${matchId}/playbyplay`);
    return parsePlayByPlayHTML(html);
  } catch (error) {
    console.error('Failed to fetch play-by-play:', error);
    return {};
  }
}

/**
 * Fetch match details from Genius Sports
 * Combines basic match info with box score and quarter scores
 */
export async function fetchGeniusSportsMatchDetails(matchId: string): Promise<MatchDetails | null> {
  // Get basic match info from schedule
  const matches = await fetchGeniusSportsMatches();
  const match = matches.find(m => m.id === matchId);
  
  if (!match) {
    return null;
  }
  
  // For completed or live matches, fetch detailed stats
  if (match.status === 'completed' || match.status === 'live') {
    const [boxScoreData, quarterScores] = await Promise.all([
      fetchBoxScore(matchId),
      fetchQuarterScores(matchId),
    ]);
    
    return {
      ...match,
      quarterScores,
      homeStats: boxScoreData.homeStats || undefined,
      awayStats: boxScoreData.awayStats || undefined,
      homePlayers: boxScoreData.homePlayers.length > 0 ? boxScoreData.homePlayers : undefined,
      awayPlayers: boxScoreData.awayPlayers.length > 0 ? boxScoreData.awayPlayers : undefined,
      lastUpdated: new Date().toISOString(),
    };
  }
  
  // For scheduled matches, just return basic info
  return {
    ...match,
    lastUpdated: new Date().toISOString(),
  };
}
