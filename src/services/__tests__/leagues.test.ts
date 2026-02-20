import { describe, it, expect } from 'vitest';
import {
  predefinedLeagues,
  getLeagueConfig,
  LEAGUE_IDS,
} from '../leagues';

describe('League Configuration', () => {
  describe('hasStandings', () => {
    it('should default to true (undefined) for Championship', () => {
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
});
