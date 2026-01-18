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
 *   - /schedule - Fixtures and results
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
    // Extract match ID from class or data attribute
    const matchClass = matchEl.className;
    const matchIdMatch = matchClass.match(/match_(\d+)/);
    const matchId = matchIdMatch ? matchIdMatch[1] : `match-${matches.length}`;
    
    // Extract teams
    const homeTeamEl = matchEl.querySelector('.home-team');
    const awayTeamEl = matchEl.querySelector('.away-team');
    
    const homeTeamName = homeTeamEl?.querySelector('.team-name span')?.textContent?.trim() || 
                         homeTeamEl?.querySelector('.team-name')?.textContent?.trim() || 'Home';
    const awayTeamName = awayTeamEl?.querySelector('.team-name span')?.textContent?.trim() ||
                         awayTeamEl?.querySelector('.team-name')?.textContent?.trim() || 'Away';
    
    // Extract scores
    const homeScoreEl = homeTeamEl?.querySelector('.team-score');
    const awayScoreEl = awayTeamEl?.querySelector('.team-score');
    const homeScoreText = homeScoreEl?.textContent?.trim();
    const awayScoreText = awayScoreEl?.textContent?.trim();
    const homeScore = homeScoreText && homeScoreText !== '-' ? parseInt(homeScoreText, 10) : undefined;
    const awayScore = awayScoreText && awayScoreText !== '-' ? parseInt(awayScoreText, 10) : undefined;
    
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
    
    // Extract date and time
    const dateEl = matchEl.querySelector('.match-date');
    const timeEl = matchEl.querySelector('.match-time');
    const dateText = dateEl?.textContent?.trim() || '';
    const timeText = timeEl?.textContent?.trim() || 'TBC';
    
    // Parse date - format varies, try to normalize
    const date = parseDateString(dateText);
    
    // Extract venue
    const venueEl = matchEl.querySelector('.match-venue');
    const venue = venueEl?.textContent?.trim() || 'TBC';
    
    // Determine status
    const statusEl = matchEl.querySelector('.match-status');
    const statusText = statusEl?.textContent?.trim().toLowerCase() || '';
    let status: 'scheduled' | 'live' | 'completed' = 'scheduled';
    
    if (statusText.includes('final') || statusText.includes('ft') || (homeScore !== undefined && awayScore !== undefined)) {
      status = 'completed';
    } else if (statusText.includes('live') || statusText.includes('q1') || statusText.includes('q2') || 
               statusText.includes('q3') || statusText.includes('q4') || statusText.includes('half')) {
      status = 'live';
    }
    
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
      time: timeText,
      venue,
      status,
    });
  });
  
  return matches;
}

/**
 * Parse date string from various formats
 */
function parseDateString(dateStr: string): string {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  
  // Try parsing common formats
  try {
    // Format: "Sat 18 Jan" or "Saturday 18 January"
    const dateWithYear = `${dateStr} 2026`; // Add current year
    const parsed = new Date(dateWithYear);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().split('T')[0];
    }
    
    // Format: "18/01/2026" (British format)
    const britishMatch = dateStr.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (britishMatch) {
      const [, day, month, year] = britishMatch;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    // Format: "2026-01-18"
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateStr;
    }
  } catch {
    // Fall through to default
  }
  
  return new Date().toISOString().split('T')[0];
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
  const html = await fetchFromGeniusSports('/schedule');
  const matches = parseScheduleHTML(html);
  
  // Sort: upcoming first, then recent results
  const now = new Date();
  return matches.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    
    const aIsUpcoming = dateA >= now || a.status === 'scheduled' || a.status === 'live';
    const bIsUpcoming = dateB >= now || b.status === 'scheduled' || b.status === 'live';
    
    if (aIsUpcoming && !bIsUpcoming) return -1;
    if (!aIsUpcoming && bIsUpcoming) return 1;
    
    if (aIsUpcoming) {
      return dateA.getTime() - dateB.getTime();
    }
    return dateB.getTime() - dateA.getTime();
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
