import type { Match, MatchDetails, StandingsEntry } from '../types';

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
 */

const GENIUS_SPORTS_BASE = 'https://hosted.dcd.shared.geniussports.com/embednf/SLB/en';

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
 * Parse combined date/time string from Genius Sports
 * Format: "Jan 30, 2026, 7:30 PM"
 * Returns: { date: "2026-01-30", time: "19:30" }
 */
function parseDateTimeString(dateTimeStr: string): { date: string; time: string } {
  if (!dateTimeStr) {
    return { date: new Date().toISOString().split('T')[0], time: 'TBC' };
  }
  
  try {
    // Parse "Jan 30, 2026, 7:30 PM" format
    const parsed = new Date(dateTimeStr);
    if (!isNaN(parsed.getTime())) {
      const date = parsed.toISOString().split('T')[0];
      const hours = parsed.getHours();
      const minutes = parsed.getMinutes();
      const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      return { date, time };
    }
  } catch {
    // Fall through to defaults
  }
  
  return { date: new Date().toISOString().split('T')[0], time: 'TBC' };
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
 * Fetch match details from Genius Sports
 */
export async function fetchGeniusSportsMatchDetails(matchId: string): Promise<MatchDetails | null> {
  // For now, get from the schedule list - individual match endpoints may exist
  const matches = await fetchGeniusSportsMatches();
  const match = matches.find(m => m.id === matchId);
  
  if (match) {
    return {
      ...match,
      lastUpdated: new Date().toISOString(),
    };
  }
  
  return null;
}
