import { describe, it, expect } from 'vitest';
import {
  predefinedLeagues,
  getLeagueConfig,
  LEAGUE_IDS,
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

  describe('playoff and relegation zone configuration', () => {
    it('should have 4 playoff positions for Championship', () => {
      const config = getLeagueConfig(LEAGUE_IDS.SUPER_LEAGUE);
      expect(config?.playoffPositions).toBe(4);
    });

    it('should have 2 relegation positions for Championship', () => {
      const config = getLeagueConfig(LEAGUE_IDS.SUPER_LEAGUE);
      expect(config?.relegationPositions).toBe(2);
    });

    it('should have 4 playoff positions for Trophy', () => {
      const config = getLeagueConfig(LEAGUE_IDS.SLB_TROPHY);
      expect(config?.playoffPositions).toBe(4);
    });

    it('should have 0 relegation positions for Trophy', () => {
      const config = getLeagueConfig(LEAGUE_IDS.SLB_TROPHY);
      expect(config?.relegationPositions).toBe(0);
    });

    it('should have 8 playoff positions for EuroLeague', () => {
      const config = getLeagueConfig(LEAGUE_IDS.EUROLEAGUE);
      expect(config?.playoffPositions).toBe(8);
    });

    it('should have 0 relegation positions for EuroLeague', () => {
      const config = getLeagueConfig(LEAGUE_IDS.EUROLEAGUE);
      expect(config?.relegationPositions).toBe(0);
    });

    it('should have 8 playoff positions for EuroCup', () => {
      const config = getLeagueConfig(LEAGUE_IDS.EUROCUP);
      expect(config?.playoffPositions).toBe(8);
    });

    it('should have 0 relegation positions for EuroCup', () => {
      const config = getLeagueConfig(LEAGUE_IDS.EUROCUP);
      expect(config?.relegationPositions).toBe(0);
    });
  });
});
