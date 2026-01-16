export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo?: string;
}

export type MatchStatus = 'scheduled' | 'live' | 'completed';
export type LivePeriod = 'Q1' | 'Q2' | 'Half-time' | 'Q3' | 'Q4' | 'OT' | 'Full Time';

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore?: number;
  awayScore?: number;
  date: string;
  time: string;
  venue: string;
  status: MatchStatus;
}

export interface QuarterScores {
  q1?: { home: number; away: number };
  q2?: { home: number; away: number };
  q3?: { home: number; away: number };
  q4?: { home: number; away: number };
  ot?: { home: number; away: number };
}

export interface TeamStatistics {
  fieldGoalPct: number;
  threePointPct: number;
  freeThrowPct: number;
  rebounds: number;
  offensiveRebounds: number;
  defensiveRebounds: number;
  assists: number;
  turnovers: number;
  steals: number;
  blocks: number;
}

export interface PlayerStatistics {
  id: string;
  name: string;
  points: number;
  rebounds: number;
  assists: number;
  minutes: number;
}

export interface MatchDetails extends Match {
  currentPeriod?: LivePeriod;
  quarterScores?: QuarterScores;
  homeStats?: TeamStatistics;
  awayStats?: TeamStatistics;
  homePlayers?: PlayerStatistics[];
  awayPlayers?: PlayerStatistics[];
  lastUpdated?: string;
}

export interface StandingsEntry {
  position: number;
  team: Team;
  played: number;
  won: number;
  lost: number;
  pointsFor: number;
  pointsAgainst: number;
  pointsDifference: number;
  points: number;
}
