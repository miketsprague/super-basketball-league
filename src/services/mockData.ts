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

// EuroLeague teams for 2025-26 season
const euroleagueTeams: { [key: string]: Team } = {
  realMadrid: {
    id: 'e1',
    name: 'Real Madrid',
    shortName: 'Real Madrid',
  },
  barcelona: {
    id: 'e2',
    name: 'FC Barcelona',
    shortName: 'Barcelona',
  },
  olympiacos: {
    id: 'e3',
    name: 'Olympiacos Piraeus',
    shortName: 'Olympiacos',
  },
  panathinaikos: {
    id: 'e4',
    name: 'Panathinaikos Athens',
    shortName: 'Panathinaikos',
  },
  fenerbahce: {
    id: 'e5',
    name: 'Fenerbahce Istanbul',
    shortName: 'Fenerbahce',
  },
  efes: {
    id: 'e6',
    name: 'Anadolu Efes',
    shortName: 'Efes',
  },
  maccabi: {
    id: 'e7',
    name: 'Maccabi Tel Aviv',
    shortName: 'Maccabi',
  },
  cska: {
    id: 'e8',
    name: 'CSKA Moscow',
    shortName: 'CSKA',
  },
  milano: {
    id: 'e9',
    name: 'EA7 Emporio Armani Milano',
    shortName: 'Milano',
  },
  bayern: {
    id: 'e10',
    name: 'FC Bayern Munich',
    shortName: 'Bayern',
  },
  partizan: {
    id: 'e11',
    name: 'Partizan Belgrade',
    shortName: 'Partizan',
  },
  monaco: {
    id: 'e12',
    name: 'AS Monaco',
    shortName: 'Monaco',
  },
};

// EuroLeague mock fixtures and results
export const euroleagueMockMatches: Match[] = [
  // Recent results
  {
    id: 'e1',
    homeTeam: euroleagueTeams.realMadrid,
    awayTeam: euroleagueTeams.barcelona,
    homeScore: 82,
    awayScore: 79,
    date: '2026-01-12',
    time: '21:00',
    venue: 'WiZink Center, Madrid',
    status: 'completed',
  },
  {
    id: 'e2',
    homeTeam: euroleagueTeams.olympiacos,
    awayTeam: euroleagueTeams.fenerbahce,
    homeScore: 88,
    awayScore: 84,
    date: '2026-01-13',
    time: '20:30',
    venue: 'Peace and Friendship Stadium, Piraeus',
    status: 'completed',
  },
  {
    id: 'e3',
    homeTeam: euroleagueTeams.panathinaikos,
    awayTeam: euroleagueTeams.milano,
    homeScore: 91,
    awayScore: 77,
    date: '2026-01-14',
    time: '20:30',
    venue: 'OAKA Arena, Athens',
    status: 'completed',
  },
  {
    id: 'e4',
    homeTeam: euroleagueTeams.maccabi,
    awayTeam: euroleagueTeams.bayern,
    homeScore: 73,
    awayScore: 81,
    date: '2026-01-15',
    time: '19:00',
    venue: 'Menora Mivtachim Arena, Tel Aviv',
    status: 'completed',
  },
  // Upcoming fixtures
  {
    id: 'e5',
    homeTeam: euroleagueTeams.barcelona,
    awayTeam: euroleagueTeams.olympiacos,
    date: '2026-01-18',
    time: '21:00',
    venue: 'Palau Blaugrana, Barcelona',
    status: 'scheduled',
  },
  {
    id: 'e6',
    homeTeam: euroleagueTeams.fenerbahce,
    awayTeam: euroleagueTeams.realMadrid,
    date: '2026-01-19',
    time: '20:00',
    venue: 'Ulker Sports Arena, Istanbul',
    status: 'scheduled',
  },
  {
    id: 'e7',
    homeTeam: euroleagueTeams.monaco,
    awayTeam: euroleagueTeams.panathinaikos,
    date: '2026-01-19',
    time: '19:00',
    venue: 'Salle Gaston Médecin, Monaco',
    status: 'scheduled',
  },
  {
    id: 'e8',
    homeTeam: euroleagueTeams.bayern,
    awayTeam: euroleagueTeams.efes,
    date: '2026-01-20',
    time: '20:30',
    venue: 'SAP Garden, Munich',
    status: 'scheduled',
  },
  {
    id: 'e9',
    homeTeam: euroleagueTeams.partizan,
    awayTeam: euroleagueTeams.maccabi,
    date: '2026-01-21',
    time: '19:00',
    venue: 'Stark Arena, Belgrade',
    status: 'scheduled',
  },
  {
    id: 'e10',
    homeTeam: euroleagueTeams.realMadrid,
    awayTeam: euroleagueTeams.monaco,
    date: '2026-01-25',
    time: '21:00',
    venue: 'WiZink Center, Madrid',
    status: 'scheduled',
  },
];

// EuroLeague mock standings
export const euroleagueMockStandings: StandingsEntry[] = [
  {
    position: 1,
    team: euroleagueTeams.realMadrid,
    played: 20,
    won: 17,
    lost: 3,
    pointsFor: 1720,
    pointsAgainst: 1540,
    pointsDifference: 180,
    points: 34,
  },
  {
    position: 2,
    team: euroleagueTeams.panathinaikos,
    played: 20,
    won: 16,
    lost: 4,
    pointsFor: 1690,
    pointsAgainst: 1520,
    pointsDifference: 170,
    points: 32,
  },
  {
    position: 3,
    team: euroleagueTeams.olympiacos,
    played: 20,
    won: 15,
    lost: 5,
    pointsFor: 1660,
    pointsAgainst: 1550,
    pointsDifference: 110,
    points: 30,
  },
  {
    position: 4,
    team: euroleagueTeams.monaco,
    played: 20,
    won: 14,
    lost: 6,
    pointsFor: 1640,
    pointsAgainst: 1560,
    pointsDifference: 80,
    points: 28,
  },
  {
    position: 5,
    team: euroleagueTeams.barcelona,
    played: 20,
    won: 13,
    lost: 7,
    pointsFor: 1620,
    pointsAgainst: 1580,
    pointsDifference: 40,
    points: 26,
  },
  {
    position: 6,
    team: euroleagueTeams.fenerbahce,
    played: 20,
    won: 12,
    lost: 8,
    pointsFor: 1600,
    pointsAgainst: 1590,
    pointsDifference: 10,
    points: 24,
  },
  {
    position: 7,
    team: euroleagueTeams.bayern,
    played: 20,
    won: 11,
    lost: 9,
    pointsFor: 1580,
    pointsAgainst: 1600,
    pointsDifference: -20,
    points: 22,
  },
  {
    position: 8,
    team: euroleagueTeams.efes,
    played: 20,
    won: 10,
    lost: 10,
    pointsFor: 1560,
    pointsAgainst: 1580,
    pointsDifference: -20,
    points: 20,
  },
  {
    position: 9,
    team: euroleagueTeams.maccabi,
    played: 20,
    won: 8,
    lost: 12,
    pointsFor: 1520,
    pointsAgainst: 1600,
    pointsDifference: -80,
    points: 16,
  },
  {
    position: 10,
    team: euroleagueTeams.milano,
    played: 20,
    won: 6,
    lost: 14,
    pointsFor: 1480,
    pointsAgainst: 1620,
    pointsDifference: -140,
    points: 12,
  },
  {
    position: 11,
    team: euroleagueTeams.partizan,
    played: 20,
    won: 4,
    lost: 16,
    pointsFor: 1440,
    pointsAgainst: 1680,
    pointsDifference: -240,
    points: 8,
  },
  {
    position: 12,
    team: euroleagueTeams.cska,
    played: 20,
    won: 2,
    lost: 18,
    pointsFor: 1400,
    pointsAgainst: 1740,
    pointsDifference: -340,
    points: 4,
  },
];

// EuroCup teams for 2025-26 season
const eurocupTeams: { [key: string]: Team } = {
  valencia: {
    id: 'ec1',
    name: 'Valencia Basket',
    shortName: 'Valencia',
  },
  bursaspor: {
    id: 'ec2',
    name: 'Bursaspor',
    shortName: 'Bursaspor',
  },
  paris: {
    id: 'ec3',
    name: 'Paris Basketball',
    shortName: 'Paris',
  },
  virtus: {
    id: 'ec4',
    name: 'Virtus Bologna',
    shortName: 'Virtus',
  },
  joventut: {
    id: 'ec5',
    name: 'Joventut Badalona',
    shortName: 'Joventut',
  },
  gran_canaria: {
    id: 'ec6',
    name: 'Gran Canaria',
    shortName: 'Gran Canaria',
  },
  unicaja: {
    id: 'ec7',
    name: 'Unicaja Malaga',
    shortName: 'Unicaja',
  },
  london_lions: {
    id: 'ec8',
    name: 'London Lions',
    shortName: 'Lions',
  },
};

// EuroCup mock fixtures and results
export const eurocupMockMatches: Match[] = [
  // Recent results
  {
    id: 'ec1',
    homeTeam: eurocupTeams.valencia,
    awayTeam: eurocupTeams.paris,
    homeScore: 85,
    awayScore: 78,
    date: '2026-01-12',
    time: '20:30',
    venue: 'La Fonteta, Valencia',
    status: 'completed',
  },
  {
    id: 'ec2',
    homeTeam: eurocupTeams.virtus,
    awayTeam: eurocupTeams.bursaspor,
    homeScore: 91,
    awayScore: 82,
    date: '2026-01-13',
    time: '20:45',
    venue: 'Virtus Segafredo Arena, Bologna',
    status: 'completed',
  },
  {
    id: 'ec3',
    homeTeam: eurocupTeams.joventut,
    awayTeam: eurocupTeams.gran_canaria,
    homeScore: 76,
    awayScore: 84,
    date: '2026-01-14',
    time: '19:00',
    venue: 'Palau Olimpic, Badalona',
    status: 'completed',
  },
  {
    id: 'ec4',
    homeTeam: eurocupTeams.london_lions,
    awayTeam: eurocupTeams.unicaja,
    homeScore: 72,
    awayScore: 89,
    date: '2026-01-15',
    time: '19:30',
    venue: 'Copper Box Arena, London',
    status: 'completed',
  },
  // Upcoming fixtures
  {
    id: 'ec5',
    homeTeam: eurocupTeams.paris,
    awayTeam: eurocupTeams.virtus,
    date: '2026-01-18',
    time: '20:00',
    venue: 'Accor Arena, Paris',
    status: 'scheduled',
  },
  {
    id: 'ec6',
    homeTeam: eurocupTeams.bursaspor,
    awayTeam: eurocupTeams.valencia,
    date: '2026-01-19',
    time: '18:00',
    venue: 'Tofas Sports Hall, Bursa',
    status: 'scheduled',
  },
  {
    id: 'ec7',
    homeTeam: eurocupTeams.gran_canaria,
    awayTeam: eurocupTeams.london_lions,
    date: '2026-01-19',
    time: '19:00',
    venue: 'Gran Canaria Arena, Las Palmas',
    status: 'scheduled',
  },
  {
    id: 'ec8',
    homeTeam: eurocupTeams.unicaja,
    awayTeam: eurocupTeams.joventut,
    date: '2026-01-20',
    time: '20:30',
    venue: 'Palacio de los Deportes, Malaga',
    status: 'scheduled',
  },
];

// EuroCup mock standings
export const eurocupMockStandings: StandingsEntry[] = [
  {
    position: 1,
    team: eurocupTeams.virtus,
    played: 14,
    won: 12,
    lost: 2,
    pointsFor: 1190,
    pointsAgainst: 1050,
    pointsDifference: 140,
    points: 24,
  },
  {
    position: 2,
    team: eurocupTeams.valencia,
    played: 14,
    won: 11,
    lost: 3,
    pointsFor: 1180,
    pointsAgainst: 1080,
    pointsDifference: 100,
    points: 22,
  },
  {
    position: 3,
    team: eurocupTeams.unicaja,
    played: 14,
    won: 10,
    lost: 4,
    pointsFor: 1150,
    pointsAgainst: 1090,
    pointsDifference: 60,
    points: 20,
  },
  {
    position: 4,
    team: eurocupTeams.paris,
    played: 14,
    won: 9,
    lost: 5,
    pointsFor: 1120,
    pointsAgainst: 1100,
    pointsDifference: 20,
    points: 18,
  },
  {
    position: 5,
    team: eurocupTeams.gran_canaria,
    played: 14,
    won: 7,
    lost: 7,
    pointsFor: 1100,
    pointsAgainst: 1110,
    pointsDifference: -10,
    points: 14,
  },
  {
    position: 6,
    team: eurocupTeams.joventut,
    played: 14,
    won: 5,
    lost: 9,
    pointsFor: 1070,
    pointsAgainst: 1140,
    pointsDifference: -70,
    points: 10,
  },
  {
    position: 7,
    team: eurocupTeams.bursaspor,
    played: 14,
    won: 3,
    lost: 11,
    pointsFor: 1030,
    pointsAgainst: 1180,
    pointsDifference: -150,
    points: 6,
  },
  {
    position: 8,
    team: eurocupTeams.london_lions,
    played: 14,
    won: 1,
    lost: 13,
    pointsFor: 990,
    pointsAgainst: 1230,
    pointsDifference: -240,
    points: 2,
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

// Combined array for searching across all leagues
const allMockMatches = [...mockMatches, ...euroleagueMockMatches, ...eurocupMockMatches];

/**
 * Get mock match details for a given match ID
 */
export function getMockMatchDetails(matchId: string): MatchDetails | null {
  const match = allMockMatches.find((m) => m.id === matchId);
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
