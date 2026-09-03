import { describe, it, expect } from 'vitest';
import {
  predefinedLeagues,
  visibleLeagues,
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

    it('should use the published 2026-27 competition IDs', () => {
      // Genius Sports mints a new competition ID per season. These are read
      // from the competition chooser at
      // https://hosted.dcd.shared.geniussports.com/SLB/en/
      expect(SLB_COMPETITION_IDS.CHAMPIONSHIP).toBe('49597');
      expect(SLB_COMPETITION_IDS.CUP).toBe('49599');
    });

    it('should not reuse the superseded 2025-26 competition IDs for current competitions', () => {
      // Guards against the schedule silently reverting to a previous season.
      const supersededIds = ['41897', '47714'];
      expect(supersededIds).not.toContain(SLB_COMPETITION_IDS.CHAMPIONSHIP);
      expect(supersededIds).not.toContain(SLB_COMPETITION_IDS.CUP);
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

  describe('hidden (discontinued) competitions', () => {
    it('should mark the Trophy as hidden now it is discontinued for 2026-27', () => {
      const config = getLeagueConfig(LEAGUE_IDS.SLB_TROPHY);
      expect(config?.hidden).toBe(true);
    });

    it('should still resolve a hidden league by ID so historic match links work', () => {
      const config = getLeagueConfig(LEAGUE_IDS.SLB_TROPHY);
      expect(config).toBeDefined();
      expect(config?.geniusSportsCompetitionId).toBe(SLB_COMPETITION_IDS.TROPHY);
    });

    it('should exclude hidden leagues from visibleLeagues', () => {
      expect(visibleLeagues.find((l) => l.id === LEAGUE_IDS.SLB_TROPHY)).toBeUndefined();
      expect(visibleLeagues).toHaveLength(predefinedLeagues.length - 1);
    });

    it('should keep the current competitions visible', () => {
      const visibleIds = visibleLeagues.map((l) => l.id);
      expect(visibleIds).toContain(LEAGUE_IDS.SUPER_LEAGUE);
      expect(visibleIds).toContain(LEAGUE_IDS.SLB_CUP);
      expect(visibleIds).toContain(LEAGUE_IDS.EUROLEAGUE);
      expect(visibleIds).toContain(LEAGUE_IDS.EUROCUP);
    });

    it('should not use a hidden league as the default league', () => {
      expect(predefinedLeagues[0].hidden).toBeFalsy();
    });
  });
});
