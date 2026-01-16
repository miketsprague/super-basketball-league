import type { Match, MatchDetails, StandingsEntry, Team, TeamStatistics, PlayerStatistics } from '../types';

// Mock teams based on the 2025-26 season
const teams: { [key: string]: Team } = {
  londonLions: {
    id: '1',
    name: 'London Lions',
    shortName: 'Lions',
  },
  cheshirePhoenix: {
    id: '2',
    name: 'Cheshire Phoenix',
    shortName: 'Phoenix',
  },
  sheffieldSharks: {
    id: '3',
    name: 'B. Braun Sheffield Sharks',
    shortName: 'Sharks',
  },
  manchesterBasketball: {
    id: '4',
    name: 'Manchester Basketball',
    shortName: 'Manchester',
  },
  bristolFlyers: {
    id: '5',
    name: 'Bristol Flyers',
    shortName: 'Flyers',
  },
  leicesterRiders: {
    id: '6',
    name: 'Leicester Riders',
    shortName: 'Riders',
  },
  surrey89ers: {
    id: '7',
    name: 'Surrey 89ers',
    shortName: 'Surrey',
  },
  newcastleEagles: {
    id: '8',
    name: 'Newcastle Eagles',
    shortName: 'Eagles',
  },
  caledoniaGladiators: {
    id: '9',
    name: 'Caledonia Gladiators',
    shortName: 'Gladiators',
  },
};

// Mock fixtures and results
export const mockMatches: Match[] = [
  // Recent results
  {
    id: '1',
    homeTeam: teams.londonLions,
    awayTeam: teams.leicesterRiders,
    homeScore: 87,
    awayScore: 92,
    date: '2026-01-12',
    time: '19:30',
    venue: 'Copper Box Arena',
    status: 'completed',
  },
  {
    id: '2',
    homeTeam: teams.cheshirePhoenix,
    awayTeam: teams.manchesterBasketball,
    homeScore: 78,
    awayScore: 85,
    date: '2026-01-13',
    time: '19:00',
    venue: 'Cheshire Oaks Arena',
    status: 'completed',
  },
  {
    id: '3',
    homeTeam: teams.sheffieldSharks,
    awayTeam: teams.bristolFlyers,
    homeScore: 91,
    awayScore: 88,
    date: '2026-01-14',
    time: '18:00',
    venue: 'Ponds Forge',
    status: 'completed',
  },
  {
    id: '4',
    homeTeam: teams.newcastleEagles,
    awayTeam: teams.caledoniaGladiators,
    homeScore: 95,
    awayScore: 89,
    date: '2026-01-15',
    time: '19:30',
    venue: 'Eagles Community Arena',
    status: 'completed',
  },
  // Upcoming fixtures
  {
    id: '5',
    homeTeam: teams.leicesterRiders,
    awayTeam: teams.cheshirePhoenix,
    date: '2026-01-18',
    time: '19:30',
    venue: 'Mattioli Arena',
    status: 'scheduled',
  },
  {
    id: '6',
    homeTeam: teams.manchesterBasketball,
    awayTeam: teams.londonLions,
    date: '2026-01-19',
    time: '18:00',
    venue: 'National Basketball Performance Centre',
    status: 'scheduled',
  },
  {
    id: '7',
    homeTeam: teams.bristolFlyers,
    awayTeam: teams.surrey89ers,
    date: '2026-01-19',
    time: '19:00',
    venue: 'SGS WISE Arena',
    status: 'scheduled',
  },
  {
    id: '8',
    homeTeam: teams.caledoniaGladiators,
    awayTeam: teams.sheffieldSharks,
    date: '2026-01-20',
    time: '17:30',
    venue: 'Emirates Arena',
    status: 'scheduled',
  },
  {
    id: '9',
    homeTeam: teams.surrey89ers,
    awayTeam: teams.newcastleEagles,
    date: '2026-01-21',
    time: '19:30',
    venue: 'Surrey Sports Park',
    status: 'scheduled',
  },
  {
    id: '10',
    homeTeam: teams.londonLions,
    awayTeam: teams.bristolFlyers,
    date: '2026-01-25',
    time: '19:30',
    venue: 'Copper Box Arena',
    status: 'scheduled',
  },
];

// Mock league standings
export const mockStandings: StandingsEntry[] = [
  {
    position: 1,
    team: teams.leicesterRiders,
    played: 18,
    won: 15,
    lost: 3,
    pointsFor: 1580,
    pointsAgainst: 1445,
    pointsDifference: 135,
    points: 30,
  },
  {
    position: 2,
    team: teams.londonLions,
    played: 18,
    won: 14,
    lost: 4,
    pointsFor: 1625,
    pointsAgainst: 1510,
    pointsDifference: 115,
    points: 28,
  },
  {
    position: 3,
    team: teams.manchesterBasketball,
    played: 18,
    won: 12,
    lost: 6,
    pointsFor: 1545,
    pointsAgainst: 1480,
    pointsDifference: 65,
    points: 24,
  },
  {
    position: 4,
    team: teams.sheffieldSharks,
    played: 18,
    won: 11,
    lost: 7,
    pointsFor: 1520,
    pointsAgainst: 1495,
    pointsDifference: 25,
    points: 22,
  },
  {
    position: 5,
    team: teams.cheshirePhoenix,
    played: 18,
    won: 10,
    lost: 8,
    pointsFor: 1490,
    pointsAgainst: 1480,
    pointsDifference: 10,
    points: 20,
  },
  {
    position: 6,
    team: teams.newcastleEagles,
    played: 18,
    won: 9,
    lost: 9,
    pointsFor: 1465,
    pointsAgainst: 1470,
    pointsDifference: -5,
    points: 18,
  },
  {
    position: 7,
    team: teams.bristolFlyers,
    played: 18,
    won: 6,
    lost: 12,
    pointsFor: 1410,
    pointsAgainst: 1520,
    pointsDifference: -110,
    points: 12,
  },
  {
    position: 8,
    team: teams.surrey89ers,
    played: 18,
    won: 4,
    lost: 14,
    pointsFor: 1380,
    pointsAgainst: 1545,
    pointsDifference: -165,
    points: 8,
  },
  {
    position: 9,
    team: teams.caledoniaGladiators,
    played: 18,
    won: 3,
    lost: 15,
    pointsFor: 1355,
    pointsAgainst: 1605,
    pointsDifference: -250,
    points: 6,
  },
];

// Mock statistics data generator
function generateMockStats(): TeamStatistics {
  return {
    fieldGoalPct: Math.round(35 + Math.random() * 20),
    threePointPct: Math.round(25 + Math.random() * 20),
    freeThrowPct: Math.round(65 + Math.random() * 25),
    rebounds: Math.round(30 + Math.random() * 20),
    offensiveRebounds: Math.round(5 + Math.random() * 10),
    defensiveRebounds: Math.round(20 + Math.random() * 15),
    assists: Math.round(15 + Math.random() * 15),
    turnovers: Math.round(8 + Math.random() * 10),
    steals: Math.round(4 + Math.random() * 8),
    blocks: Math.round(2 + Math.random() * 6),
  };
}

function generateMockPlayers(teamName: string, totalScore: number): PlayerStatistics[] {
  const playerNames = [
    `${teamName.charAt(0)}. Johnson`,
    `${teamName.charAt(0)}. Williams`,
    `${teamName.charAt(0)}. Davis`,
    `${teamName.charAt(0)}. Miller`,
    `${teamName.charAt(0)}. Anderson`,
  ];
  
  let remainingPoints = totalScore;
  return playerNames.map((name, i) => {
    const points = i === playerNames.length - 1 
      ? remainingPoints 
      : Math.round(remainingPoints * (0.2 + Math.random() * 0.15));
    remainingPoints -= points;
    
    return {
      id: `player-${i + 1}`,
      name,
      points: Math.max(0, points),
      rebounds: Math.round(2 + Math.random() * 10),
      assists: Math.round(1 + Math.random() * 8),
      minutes: Math.round(15 + Math.random() * 25),
    };
  }).sort((a, b) => b.points - a.points);
}

/**
 * Get mock match details for a given match ID
 */
export function getMockMatchDetails(matchId: string): MatchDetails | null {
  const match = mockMatches.find((m) => m.id === matchId);
  if (!match) return null;
  
  const isCompleted = match.status === 'completed';
  const isLive = match.status === 'live';
  
  if (!isCompleted && !isLive) {
    // Scheduled match - no stats available
    return {
      ...match,
      lastUpdated: new Date().toISOString(),
    };
  }
  
  const homeTotal = match.homeScore ?? 0;
  const awayTotal = match.awayScore ?? 0;
  
  // Generate quarter-by-quarter scores that sum to total
  const generateQuarterScores = (total: number) => {
    if (total === 0) {
      return { q1: 0, q2: 0, q3: 0, q4: 0 };
    }
    // Use smaller multipliers to ensure q4 is never negative
    const q1 = Math.round(total * (0.20 + Math.random() * 0.05));
    const q2 = Math.round(total * (0.20 + Math.random() * 0.05));
    const q3 = Math.round(total * (0.20 + Math.random() * 0.05));
    const q4 = Math.max(0, total - q1 - q2 - q3);
    return { q1, q2, q3, q4 };
  };
  
  const homeQuarters = generateQuarterScores(homeTotal);
  const awayQuarters = generateQuarterScores(awayTotal);
  
  return {
    ...match,
    currentPeriod: isCompleted ? 'Full Time' : 'Q3',
    quarterScores: {
      q1: { home: homeQuarters.q1, away: awayQuarters.q1 },
      q2: { home: homeQuarters.q2, away: awayQuarters.q2 },
      q3: { home: homeQuarters.q3, away: awayQuarters.q3 },
      q4: { home: homeQuarters.q4, away: awayQuarters.q4 },
    },
    homeStats: generateMockStats(),
    awayStats: generateMockStats(),
    homePlayers: generateMockPlayers(match.homeTeam.shortName, homeTotal),
    awayPlayers: generateMockPlayers(match.awayTeam.shortName, awayTotal),
    lastUpdated: new Date().toISOString(),
  };
}
