import { describe, it, expect } from 'vitest';
import {
  predefinedLeagues,
  getLeagueConfig,
  LEAGUE_IDS,
  SLB_COMPETITION_IDS,
} from '../leagues';

describe('League Configuration', () => {
  describe('hasStandings', () => {
    it('should default to true (undefined) for Super League (Championship)', () => {
      const config = getLeagueConfig(LEAGUE_IDS.SUPER_LEAGUE);
      expect(config).toBeDefined();
      expect(config?.hasStandings).toBeUndefined();
    });

    it('should default to true (undefined) for Trophy', () => {
      const config = getLeagueConfig(LEAGUE_IDS.SLB_TROPHY);
      expect(config).toBeDefined();
      expect(config?.hasStandings).toBeUndefined();
    });

    it('should be false for Cup (knockout-only format)', () => {
      const config = getLeagueConfig(LEAGUE_IDS.SLB_CUP);
      expect(config).toBeDefined();
      expect(config?.hasStandings).toBe(false);
    });

    it('should default to true (undefined) for EuroLeague', () => {
      const config = getLeagueConfig(LEAGUE_IDS.EUROLEAGUE);
      expect(config).toBeDefined();
      expect(config?.hasStandings).toBeUndefined();
    });

    it('should default to true (undefined) for EuroCup', () => {
      const config = getLeagueConfig(LEAGUE_IDS.EUROCUP);
      expect(config).toBeDefined();
      expect(config?.hasStandings).toBeUndefined();
    });

    it('should treat undefined hasStandings as true (has standings)', () => {
      const leaguesWithStandings = predefinedLeagues.filter(
        (l) => l.hasStandings !== false
      );
      // All leagues except Cup should have standings
      expect(leaguesWithStandings).toHaveLength(predefinedLeagues.length - 1);
      expect(leaguesWithStandings.find((l) => l.id === LEAGUE_IDS.SLB_CUP)).toBeUndefined();
    });
  });

  describe('Genius Sports competition IDs', () => {
    it('should only define competition IDs that have actually been published', () => {
      // Only Championship, Trophy and Cup IDs are published today. A future
      // Playoffs competition ID must not be guessed/duplicated from an
      // existing competition (e.g. reusing Championship's ID) - it should
      // only be added here once Genius Sports has published the real ID.
      expect(Object.keys(SLB_COMPETITION_IDS).sort()).toEqual(['CHAMPIONSHIP', 'CUP', 'TROPHY']);
    });

    it('should not assign the same Genius Sports competition ID to more than one competition', () => {
      const ids = Object.values(SLB_COMPETITION_IDS);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('should not assign the same Genius Sports competition ID to more than one predefined league', () => {
      const competitionIds = predefinedLeagues
        .map((l) => l.geniusSportsCompetitionId)
        .filter((id): id is string => Boolean(id));
      expect(new Set(competitionIds).size).toBe(competitionIds.length);
    });
  });
});
