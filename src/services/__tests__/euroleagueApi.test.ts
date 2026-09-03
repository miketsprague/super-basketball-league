import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  fetchEuroLeagueStandings,
  fetchEuroLeagueMatches,
  fetchEuroLeagueAllData,
  fetchEuroLeagueMatchDetails,
  getCurrentSeasonYear,
} from '../euroleagueApi';

// Fix "now" to a date within the 2025-26 season (Jan 2026) so that all the
// season-code assertions below (E2025/U2025) remain stable regardless of
// when these tests actually run in CI.
const FIXED_NOW = new Date('2026-01-15T12:00:00Z');

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
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
    vi.stubGlobal('fetch', mockFetch);
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
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
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
    vi.stubGlobal('fetch', mockFetch);
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
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

describe('getCurrentSeasonYear', () => {
  it('should return the previous calendar year in January (mid-season)', () => {
    expect(getCurrentSeasonYear(new Date('2026-01-15T12:00:00Z'))).toBe('2025');
  });

  it('should return the previous calendar year in July (end of season)', () => {
    expect(getCurrentSeasonYear(new Date('2026-07-31T23:59:59Z'))).toBe('2025');
  });

  it('should roll over to the current calendar year on 1 August (new season)', () => {
    expect(getCurrentSeasonYear(new Date('2026-08-01T00:00:00Z'))).toBe('2026');
  });

  it('should return the current calendar year in December (season underway)', () => {
    expect(getCurrentSeasonYear(new Date('2026-12-25T00:00:00Z'))).toBe('2026');
  });

  it('should default to the current date when no reference date is provided', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-03T00:00:00Z'));
    try {
      expect(getCurrentSeasonYear()).toBe('2026');
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('EuroLeague V2 pagination (offset/limit)', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-15T12:00:00Z'));
    vi.stubGlobal('fetch', mockFetch);
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  function makeV2Game(code: number, dateIso: string) {
    return {
      id: `id-${code}`,
      identifier: `E2025_${code}`,
      code,
      date: dateIso,
      status: 'confirmed',
      home: { code: 'AAA', name: 'Team A', abbreviatedName: 'A', score: 0 },
      away: { code: 'BBB', name: 'Team B', abbreviatedName: 'B', score: 0 },
      venue: { name: 'Arena' },
    };
  }

  it('should page through the complete fixture collection using offset/limit, not a single pageSize/pageNumber request', async () => {
    // V1: no completed games
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: async () => '<?xml version="1.0"?><results></results>',
    });

    // V2 page 1: 100 games, totalItems indicates more pages remain
    const page1Games = Array.from({ length: 100 }, (_, i) => makeV2Game(i + 1, '2026-02-01T19:00:00.000Z'));
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: 'success',
        data: page1Games,
        metadata: { totalItems: 120, pageNumber: 0, pageSize: 100, totalPages: 2 },
      }),
    });

    // V2 page 2: remaining 20 games
    const page2Games = Array.from({ length: 20 }, (_, i) => makeV2Game(101 + i, '2026-02-05T19:00:00.000Z'));
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: 'success',
        data: page2Games,
        metadata: { totalItems: 120, pageNumber: 1, pageSize: 100, totalPages: 2 },
      }),
    });

    const matches = await fetchEuroLeagueMatches('euroleague');

    // All 120 games across both pages should be present
    expect(matches).toHaveLength(120);

    // Should have made 2 V2 requests (offset=0, offset=100) plus 1 V1 request
    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(mockFetch).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('offset=0'),
      expect.any(Object)
    );
    expect(mockFetch).toHaveBeenNthCalledWith(
      2,
      expect.stringMatching(/limit=\d+/),
      expect.any(Object)
    );
    expect(mockFetch).toHaveBeenNthCalledWith(
      2,
      expect.not.stringContaining('pageSize'),
      expect.any(Object)
    );
    expect(mockFetch).toHaveBeenNthCalledWith(
      3,
      expect.stringContaining('offset=100'),
      expect.any(Object)
    );
  });

  it('should stop paging once fewer items than the page limit are returned', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: async () => '<?xml version="1.0"?><results></results>',
    });

    const games = [makeV2Game(1, '2026-02-01T19:00:00.000Z'), makeV2Game(2, '2026-02-02T19:00:00.000Z')];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: 'success',
        data: games,
        metadata: { totalItems: 2, pageNumber: 0, pageSize: 100, totalPages: 1 },
      }),
    });

    const matches = await fetchEuroLeagueMatches('euroleague');

    expect(matches).toHaveLength(2);
    // Only 1 V1 + 1 V2 request needed since totalItems fit on the first page
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});

describe('fetchEuroLeagueAllData resilience', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-15T12:00:00Z'));
    vi.stubGlobal('fetch', mockFetch);
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('should preserve fixtures when standings fail', async () => {
    // V1 results: succeeds
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: async () => mockV1ResultsXML,
    });
    // V2 games: succeeds
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 'success', data: [], metadata: { totalItems: 0 } }),
    });
    // V1 standings: fails
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    const data = await fetchEuroLeagueAllData('euroleague');

    expect(data.matches.length).toBeGreaterThan(0);
    expect(data.standings).toEqual([]);
  });

  it('should reject when both fixture APIs fail', async () => {
    // V1 results fails
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });
    // V2 games fails too
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
      statusText: 'Service Unavailable',
    });
    // Standings request still succeeds, but fixtures are the primary data.
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: async () => mockV1StandingsXML,
    });

    await expect(fetchEuroLeagueAllData('euroleague')).rejects.toThrow(
      'Both EuroLeague fixture APIs failed',
    );
  });
});
