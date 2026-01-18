import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  fetchEuroLeagueStandings,
  fetchEuroLeagueMatches,
  fetchEuroLeagueAllData,
  fetchEuroLeagueMatchDetails,
} from '../euroleagueApi';

// Mock V1 XML response (completed games)
const mockV1ResultsXML = `<?xml version="1.0" encoding="utf-8"?>
<results>
  <game>
    <round>RS</round>
    <gameday>18</gameday>
    <date>Jan 14, 2026</date>
    <time>20:00</time>
    <gamenumber>170</gamenumber>
    <gamecode>E2025_170</gamecode>
    <group>Regular Season</group>
    <hometeam>REAL MADRID</hometeam>
    <homecode>MAD</homecode>
    <homescore>95</homescore>
    <awayteam>FC BARCELONA</awayteam>
    <awaycode>BAR</awaycode>
    <awayscore>88</awayscore>
    <played>true</played>
  </game>
  <game>
    <round>RS</round>
    <gameday>18</gameday>
    <date>Jan 15, 2026</date>
    <time>19:30</time>
    <gamenumber>171</gamenumber>
    <gamecode>E2025_171</gamecode>
    <group>Regular Season</group>
    <hometeam>PANATHINAIKOS AKTOR ATHENS</hometeam>
    <homecode>PAN</homecode>
    <homescore>78</homescore>
    <awayteam>OLYMPIACOS PIRAEUS</awayteam>
    <awaycode>OLY</awaycode>
    <awayscore>82</awayscore>
    <played>true</played>
  </game>
  <game>
    <round>RS</round>
    <gameday>17</gameday>
    <date>Jan 10, 2026</date>
    <time>21:00</time>
    <gamenumber>165</gamenumber>
    <gamecode>E2025_165</gamecode>
    <group>Regular Season</group>
    <hometeam>AS MONACO</hometeam>
    <homecode>MCO</homecode>
    <homescore>91</homescore>
    <awayteam>FC BAYERN MUNICH</awayteam>
    <awaycode>MUN</awaycode>
    <awayscore>85</awayscore>
    <played>true</played>
  </game>
</results>`;

// Mock V1 XML response (standings)
const mockV1StandingsXML = `<?xml version="1.0" encoding="utf-8"?>
<standings>
  <team>
    <name>Real Madrid</name>
    <code>MAD</code>
    <ranking>1</ranking>
    <totalgames>18</totalgames>
    <wins>15</wins>
    <losses>3</losses>
    <ptsfavour>1620</ptsfavour>
    <ptsagainst>1450</ptsagainst>
    <difference>170</difference>
  </team>
  <team>
    <name>AS Monaco</name>
    <code>MCO</code>
    <ranking>2</ranking>
    <totalgames>18</totalgames>
    <wins>14</wins>
    <losses>4</losses>
    <ptsfavour>1580</ptsfavour>
    <ptsagainst>1490</ptsagainst>
    <difference>90</difference>
  </team>
  <team>
    <name>Panathinaikos AKTOR Athens</name>
    <code>PAN</code>
    <ranking>3</ranking>
    <totalgames>18</totalgames>
    <wins>13</wins>
    <losses>5</losses>
    <ptsfavour>1550</ptsfavour>
    <ptsagainst>1480</ptsagainst>
    <difference>70</difference>
  </team>
</standings>`;

// Mock V2 JSON response (upcoming games)
const mockV2GamesResponse = {
  status: 'success',
  data: [
    {
      id: 'abc-123',
      identifier: 'E2025_180',
      code: 180,
      date: '2026-01-21T19:00:00.000Z',
      status: 'confirmed',
      home: {
        code: 'BAR',
        name: 'FC Barcelona',
        abbreviatedName: 'Barcelona',
        score: 0,
        imageUrls: { crest: 'https://example.com/bar.png' },
      },
      away: {
        code: 'MAD',
        name: 'Real Madrid',
        abbreviatedName: 'Real Madrid',
        score: 0,
        imageUrls: { crest: 'https://example.com/mad.png' },
      },
      venue: { name: 'Palau Blaugrana' },
    },
    {
      id: 'def-456',
      identifier: 'E2025_181',
      code: 181,
      date: '2026-01-22T20:30:00.000Z',
      status: 'confirmed',
      home: {
        code: 'MCO',
        name: 'AS Monaco',
        abbreviatedName: 'Monaco',
        score: 0,
        imageUrls: { crest: 'https://example.com/mco.png' },
      },
      away: {
        code: 'PAN',
        name: 'Panathinaikos AKTOR Athens',
        abbreviatedName: 'Panathinaikos',
        score: 0,
        imageUrls: { crest: 'https://example.com/pan.png' },
      },
      venue: { name: 'Salle Gaston Medecin' },
    },
    {
      id: 'ghi-789',
      identifier: 'E2025_182',
      code: 182,
      date: '2026-01-25T18:00:00.000Z',
      status: 'confirmed',
      home: {
        code: 'OLY',
        name: 'Olympiacos Piraeus',
        abbreviatedName: 'Olympiacos',
        score: 0,
        imageUrls: { crest: 'https://example.com/oly.png' },
      },
      away: {
        code: 'MUN',
        name: 'FC Bayern Munich',
        abbreviatedName: 'Bayern',
        score: 0,
        imageUrls: { crest: 'https://example.com/mun.png' },
      },
      venue: { name: 'Peace and Friendship Stadium' },
    },
  ],
  metadata: {
    totalItems: 3,
    pageNumber: 0,
    pageSize: 100,
    totalPages: 1,
  },
};

// Mock fetch globally
const mockFetch = vi.fn();

describe('EuroLeague API', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('fetchEuroLeagueStandings', () => {
    it('should fetch and parse standings correctly from V1 API', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => mockV1StandingsXML,
      });

      const standings = await fetchEuroLeagueStandings('euroleague');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api-live.euroleague.net/v1/standings?seasoncode=E2025',
        expect.objectContaining({ headers: { Accept: 'application/xml' } })
      );

      expect(standings).toHaveLength(3);

      // Check first place team
      expect(standings[0]).toMatchObject({
        position: 1,
        team: {
          id: 'MAD',
          name: 'Real Madrid',
        },
        played: 18,
        won: 15,
        lost: 3,
        pointsFor: 1620,
        pointsAgainst: 1450,
        pointsDifference: 170,
      });

      // Check second place team
      expect(standings[1]).toMatchObject({
        position: 2,
        team: {
          id: 'MCO',
          name: 'AS Monaco',
        },
      });
    });

    it('should throw error on API failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(fetchEuroLeagueStandings('euroleague')).rejects.toThrow(
        'EuroLeague API request failed: 500 Internal Server Error'
      );
    });

    it('should return empty array for empty XML', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => '<?xml version="1.0"?><standings></standings>',
      });

      const standings = await fetchEuroLeagueStandings('euroleague');
      expect(standings).toHaveLength(0);
    });
  });

  describe('fetchEuroLeagueMatches', () => {
    it('should fetch from both V1 and V2 APIs and combine results', async () => {
      // V1 API (completed games)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => mockV1ResultsXML,
      });
      // V2 API (upcoming games)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockV2GamesResponse,
      });

      const matches = await fetchEuroLeagueMatches('euroleague');

      // Should have called both APIs
      expect(mockFetch).toHaveBeenCalledTimes(2);
      
      // First call should be V1
      expect(mockFetch).toHaveBeenNthCalledWith(
        1,
        'https://api-live.euroleague.net/v1/results?seasoncode=E2025',
        expect.objectContaining({ headers: { Accept: 'application/xml' } })
      );
      
      // Second call should be V2
      expect(mockFetch).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('feeds.incrowdsports.com'),
        expect.objectContaining({ headers: { Accept: 'application/json' } })
      );

      // Should have both completed and upcoming matches
      expect(matches.length).toBeGreaterThanOrEqual(3);
    });

    it('should parse completed matches from V1 API', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          text: async () => mockV1ResultsXML,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ status: 'success', data: [], metadata: {} }),
        });

      const matches = await fetchEuroLeagueMatches('euroleague');
      const completedMatch = matches.find(m => m.id === 'E2025_170');

      expect(completedMatch).toBeDefined();
      expect(completedMatch?.homeTeam.name).toBe('REAL MADRID');
      expect(completedMatch?.awayTeam.name).toBe('FC BARCELONA');
      expect(completedMatch?.homeScore).toBe(95);
      expect(completedMatch?.awayScore).toBe(88);
      expect(completedMatch?.status).toBe('completed');
    });

    it('should parse upcoming matches from V2 API', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          text: async () => '<?xml version="1.0"?><results></results>',
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockV2GamesResponse,
        });

      const matches = await fetchEuroLeagueMatches('euroleague');
      const upcomingMatch = matches.find(m => m.id === 'E2025_180');

      expect(upcomingMatch).toBeDefined();
      expect(upcomingMatch?.homeTeam.name).toBe('FC Barcelona');
      expect(upcomingMatch?.awayTeam.name).toBe('Real Madrid');
      expect(upcomingMatch?.homeScore).toBeUndefined();
      expect(upcomingMatch?.awayScore).toBeUndefined();
      expect(upcomingMatch?.status).toBe('scheduled');
      expect(upcomingMatch?.venue).toBe('Palau Blaugrana');
    });

    it('should include team logos from V2 API', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          text: async () => '<?xml version="1.0"?><results></results>',
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockV2GamesResponse,
        });

      const matches = await fetchEuroLeagueMatches('euroleague');
      const match = matches.find(m => m.id === 'E2025_180');

      expect(match?.homeTeam.logo).toBe('https://example.com/bar.png');
      expect(match?.awayTeam.logo).toBe('https://example.com/mad.png');
    });

    it('should handle V1 API failure gracefully', async () => {
      // V1 fails
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });
      // V2 succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockV2GamesResponse,
      });

      const matches = await fetchEuroLeagueMatches('euroleague');

      // Should still return V2 matches
      expect(matches.length).toBeGreaterThanOrEqual(3);
      expect(matches.some(m => m.id === 'E2025_180')).toBe(true);
    });

    it('should handle V2 API failure gracefully', async () => {
      // V1 succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => mockV1ResultsXML,
      });
      // V2 fails
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      const matches = await fetchEuroLeagueMatches('euroleague');

      // Should still return V1 matches
      expect(matches.length).toBeGreaterThanOrEqual(3);
      expect(matches.some(m => m.id === 'E2025_170')).toBe(true);
    });

    it('should deduplicate matches by ID', async () => {
      // Create a V2 response with a duplicate match ID
      const v2WithDuplicate = {
        ...mockV2GamesResponse,
        data: [
          ...mockV2GamesResponse.data,
          {
            id: 'dup-id',
            identifier: 'E2025_170', // Same as V1 completed match
            code: 170,
            date: '2026-01-14T20:00:00.000Z',
            status: 'confirmed',
            home: {
              code: 'MAD',
              name: 'Real Madrid',
              abbreviatedName: 'Real Madrid',
              score: 0,
            },
            away: {
              code: 'BAR',
              name: 'FC Barcelona',
              abbreviatedName: 'Barcelona',
              score: 0,
            },
          },
        ],
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          text: async () => mockV1ResultsXML,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => v2WithDuplicate,
        });

      const matches = await fetchEuroLeagueMatches('euroleague');

      // Should have the completed version with scores (from V1)
      const duplicateMatch = matches.filter(m => m.id === 'E2025_170');
      expect(duplicateMatch).toHaveLength(1);
      expect(duplicateMatch[0].homeScore).toBe(95); // Has the actual score from V1
    });

    it('should sort matches by date ascending', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          text: async () => mockV1ResultsXML,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockV2GamesResponse,
        });

      const matches = await fetchEuroLeagueMatches('euroleague');

      // Matches should be sorted by date ascending (earliest first)
      for (let i = 1; i < matches.length; i++) {
        const prevDate = new Date(matches[i - 1].date);
        const currDate = new Date(matches[i].date);
        expect(prevDate.getTime()).toBeLessThanOrEqual(currDate.getTime());
      }
    });
  });

  describe('fetchEuroLeagueAllData', () => {
    it('should fetch both matches and standings', async () => {
      // Matches: V1 + V2
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          text: async () => mockV1ResultsXML,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockV2GamesResponse,
        })
        // Standings: V1
        .mockResolvedValueOnce({
          ok: true,
          text: async () => mockV1StandingsXML,
        });

      const data = await fetchEuroLeagueAllData('euroleague');

      expect(data.matches.length).toBeGreaterThanOrEqual(3);
      expect(data.standings).toHaveLength(3);
    });
  });

  describe('fetchEuroLeagueMatchDetails', () => {
    it('should return match details by ID', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          text: async () => mockV1ResultsXML,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockV2GamesResponse,
        });

      const details = await fetchEuroLeagueMatchDetails('E2025_170', 'euroleague');

      expect(details).not.toBeNull();
      expect(details?.id).toBe('E2025_170');
      expect(details?.homeTeam.name).toBe('REAL MADRID');
      expect(details?.lastUpdated).toBeDefined();
    });

    it('should return null for non-existent match', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          text: async () => mockV1ResultsXML,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockV2GamesResponse,
        });

      const details = await fetchEuroLeagueMatchDetails('INVALID_ID', 'euroleague');
      expect(details).toBeNull();
    });
  });

  describe('EuroCup integration', () => {
    it('should use correct season code for EuroCup', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          text: async () => '<?xml version="1.0"?><results></results>',
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ status: 'success', data: [], metadata: {} }),
        });

      await fetchEuroLeagueMatches('eurocup');

      // Should use U2025 for EuroCup
      expect(mockFetch).toHaveBeenNthCalledWith(
        1,
        'https://api-live.euroleague.net/v1/results?seasoncode=U2025',
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('/competitions/U/seasons/U2025/'),
        expect.any(Object)
      );
    });
  });
});

describe('Helper Functions', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('getShortName', () => {
    it('should return short names for common EuroLeague teams', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => mockV1StandingsXML,
      });

      const standings = await fetchEuroLeagueStandings('euroleague');

      const monaco = standings.find(s => s.team.name === 'AS Monaco');
      expect(monaco?.team.shortName).toBe('Monaco');

      const panathinaikos = standings.find(s => s.team.name === 'Panathinaikos AKTOR Athens');
      expect(panathinaikos?.team.shortName).toBe('Panathinaikos');
    });
  });

  describe('Date parsing', () => {
    it('should parse V1 date format correctly', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          text: async () => mockV1ResultsXML,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ status: 'success', data: [], metadata: {} }),
        });

      const matches = await fetchEuroLeagueMatches('euroleague');
      const match = matches.find(m => m.id === 'E2025_170');

      // Should be in YYYY-MM-DD format
      expect(match?.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(match?.date).toBe('2026-01-14');
    });

    it('should parse V2 ISO date format correctly', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          text: async () => '<?xml version="1.0"?><results></results>',
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockV2GamesResponse,
        });

      const matches = await fetchEuroLeagueMatches('euroleague');
      const match = matches.find(m => m.id === 'E2025_180');

      expect(match?.date).toBe('2026-01-21');
      // Time should be in HH:MM format
      expect(match?.time).toMatch(/^\d{2}:\d{2}$/);
    });
  });
});
