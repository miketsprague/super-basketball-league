export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo?: string;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore?: number;
  awayScore?: number;
  date: string;
  time: string;
  venue: string;
  status: 'scheduled' | 'live' | 'completed';
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
