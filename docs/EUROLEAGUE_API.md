# EuroLeague API Documentation

This document describes the APIs used to fetch EuroLeague and EuroCup data.

## Overview

EuroLeague data is split across **two separate APIs**:

| API | Base URL | Purpose | Format |
|-----|----------|---------|--------|
| V1 | `api-live.euroleague.net/v1` | Completed games + standings | XML |
| V2 | `feeds.incrowdsports.com/provider/euroleague-feeds/v2` | Upcoming/scheduled games | JSON |

**Important:** Both APIs must be combined to get a complete fixture list.

## Season Codes

| Competition | Season Code | Example |
|-------------|-------------|---------|
| EuroLeague | E{year} | E2025 (2025-26 season) |
| EuroCup | U{year} | U2025 (2025-26 season) |

**The season year is computed dynamically, never hardcoded.**
`getCurrentSeasonYear()` in `src/services/euroleagueApi.ts` derives the
season year from the current date, since EuroLeague/EuroCup seasons run
roughly October-June but the provider starts publishing next season's
fixtures/rosters around August:

- **January - July:** still the season that started the *previous* calendar
  year (e.g. March 2026 => season `2025`, part of the 2025-26 season).
- **August - December:** the season that started *this* calendar year (e.g.
  September 2026 => season `2026`, part of the 2026-27 season).

`getCurrentSeasonYear()` accepts an optional reference `Date` (used by
tests to check the rollover boundary) and defaults to `new Date()`. The
`.github/workflows/api-health-check.yml` workflow mirrors this same
August-rollover logic in bash so it always checks the current season
rather than a stale hardcoded one.

## V1 API (Completed Games + Standings + Match Details)

### Base URL
```
https://api-live.euroleague.net/v1
```

### Results Endpoint
```
GET /results?seasoncode={seasonCode}
```

Returns all completed games for the season.

**Example Request:**
```bash
curl -H "Accept: application/xml" \
  "https://api-live.euroleague.net/v1/results?seasoncode=E2025"
```

**Response Format (XML):**
```xml
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
</results>
```

### Game Details Endpoint
```
GET /games?gameCode={gameCode}&seasonCode={seasonCode}
```

Returns detailed statistics for a single game including quarter scores and player stats.

**Example Request:**
```bash
curl "https://api-live.euroleague.net/v1/games?gameCode=170&seasonCode=E2025"
```

**Response Format (XML):**
```xml
<game seasoncode="E2025" code="170" played="true">
  <audience>14627</audience>
  <referees>
    <referee name="DIFALLAH, MEHDI" code="OJLL" countrycode="FRA" />
  </referees>
  <localclub code="ZAL" name="Zalgiris Kaunas" score="109" coachname="MASIULIS, TOMAS">
    <partials Partial1="28" Partial2="25" Partial3="29" Partial4="27" 
              ExtraPeriod1="0" ExtraPeriod2="0" />
    <playerstats>
      <stat>
        <TimePlayed>20:22</TimePlayed>
        <PlayerCode>007982</PlayerCode>
        <PlayerName>WILLIAMS-GOSS, NIGEL</PlayerName>
        <Score>12</Score>
        <FieldGoalsMade2>4</FieldGoalsMade2>
        <FieldGoalsAttempted2>7</FieldGoalsAttempted2>
        <FieldGoalsMade3>1</FieldGoalsMade3>
        <FieldGoalsAttempted3>2</FieldGoalsAttempted3>
        <FreeThrowsMade>1</FreeThrowsMade>
        <FreeThrowsAttempted>1</FreeThrowsAttempted>
        <TotalRebounds>3</TotalRebounds>
        <DefensiveRebounds>3</DefensiveRebounds>
        <OffensiveRebounds>0</OffensiveRebounds>
        <Assistances>3</Assistances>
        <Steals>1</Steals>
        <Turnovers>2</Turnovers>
        <BlocksFavour>0</BlocksFavour>
        <PlusMinus>19</PlusMinus>
      </stat>
    </playerstats>
  </localclub>
  <roadclub code="PAR" name="Partizan Mozzart Bet Belgrade" score="68">
    <!-- Same structure as localclub -->
  </roadclub>
</game>
```

**Available Player Stats:**
- TimePlayed (format: "MM:SS")
- Score (points)
- FieldGoalsMade2/Attempted2 (2-point shots)
- FieldGoalsMade3/Attempted3 (3-point shots)
- FreeThrowsMade/Attempted
- TotalRebounds, DefensiveRebounds, OffensiveRebounds
- Assistances (assists)
- Steals
- Turnovers
- BlocksFavour (blocks)
- PlusMinus (+/-)

**Quarter Scores (Partials):**
- Partial1 through Partial4 for regular quarters
- ExtraPeriod1-5 for overtime periods

### Standings Endpoint
```
GET /standings?seasoncode={seasonCode}
```

Returns current league standings.

**Response Format (XML):**
```xml
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
</standings>
```

## V2 API (Upcoming/Scheduled Games)

### Base URL
```
https://feeds.incrowdsports.com/provider/euroleague-feeds/v2
```

### Games Endpoint
```
GET /competitions/{comp}/seasons/{seasonCode}/games
```

Returns scheduled/upcoming games. Does NOT include completed games.

**Parameters:**
| Parameter | Description | Example |
|-----------|-------------|---------|
| comp | Competition code | E (EuroLeague), U (EuroCup) |
| seasonCode | Full season code | E2025, U2025 |
| limit | Results per page (offset/limit mechanism) | 100 |
| offset | Number of results to skip | 0, 100, 200, ... |

**`pageSize`/`pageNumber` are also accepted by the API, but this app uses
`limit`/`offset` instead** - they compose more naturally into a pagination
loop (`offset += limit`) than translating a page number.

A single request only returns up to `limit` games (a full season has
~400 games across ~4-8 pages), so `fetchUpcomingMatches()` pages through
**all** results via `fetchAllV2Games()`: it requests `limit=100` at a time,
incrementing `offset` by 100 each time, until `offset` reaches the
response's `metadata.totalItems` (or the API returns an empty page, as a
safety valve against an infinite loop).

**Example Request:**
```bash
curl -H "Accept: application/json" \
  "https://feeds.incrowdsports.com/provider/euroleague-feeds/v2/competitions/E/seasons/E2025/games?limit=100&offset=0"
```

**Response Format (JSON):**
```json
{
  "status": "success",
  "data": [
    {
      "id": "abc-123",
      "identifier": "E2025_180",
      "code": 180,
      "date": "2026-01-21T19:00:00.000Z",
      "status": "confirmed",
      "home": {
        "code": "BAR",
        "name": "FC Barcelona",
        "abbreviatedName": "Barcelona",
        "score": 0,
        "imageUrls": {
          "crest": "https://media-cdn.incrowdsports.com/xxx.png"
        }
      },
      "away": {
        "code": "MAD",
        "name": "Real Madrid",
        "abbreviatedName": "Real Madrid",
        "score": 0,
        "imageUrls": {
          "crest": "https://media-cdn.incrowdsports.com/yyy.png"
        }
      },
      "venue": {
        "name": "Palau Blaugrana",
        "capacity": 7585,
        "address": "Barcelona"
      },
      "broadcasters": [
        {
          "name": "EUROLEAGUE.TV",
          "linkUrl": "https://tv.euroleague.net/"
        }
      ]
    }
  ],
  "metadata": {
    "totalItems": 380,
    "pageNumber": 0,
    "pageSize": 100,
    "totalPages": 4
  }
}
```

### V2 Game Status Values

| Status | Meaning |
|--------|---------|
| `confirmed` | Game is scheduled |
| `result` | Game has been played (but V2 rarely has these) |

## Implementation Notes

### Combining APIs

```typescript
// Fetch from both APIs in parallel
const [completedMatches, upcomingMatches] = await Promise.all([
  fetchCompletedMatches(leagueId),  // V1 API
  fetchUpcomingMatches(leagueId),   // V2 API
]);

// Deduplicate by match ID (completed games take priority)
const matchMap = new Map<string, Match>();
for (const match of completedMatches) {
  matchMap.set(match.id, match);
}
for (const match of upcomingMatches) {
  if (!matchMap.has(match.id)) {
    matchMap.set(match.id, match);
  }
}
```

### Error Handling

Both APIs can fail independently. The implementation handles this gracefully:
- If V1 fails, only upcoming games are shown
- If V2 fails, only completed games are shown
- If both fail, `fetchEuroLeagueMatches()` throws so the data provider can
  show an error or use the configured mock fallback instead of presenting an
  ambiguous empty season

### Standings failures don't lose fixtures

`fetchEuroLeagueAllData()` fetches matches and standings independently (via
`Promise.allSettled`, not `Promise.all`). If fetching standings fails but
matches succeed, fixtures are still returned with an empty standings array
instead of discarding everything - this matters most right after the
August season rollover, when a new season's fixtures may be published
before its standings table exists. If fetching matches itself rejects,
that error is propagated (fixtures are the primary data the app needs).

### Team Logos

Only the V2 API provides team logo URLs via `imageUrls.crest`. V1 does not include logos.

### Date Formats

| API | Format | Example |
|-----|--------|---------|
| V1 | `MMM DD, YYYY` | "Jan 14, 2026" |
| V2 | ISO 8601 | "2026-01-21T19:00:00.000Z" |

## Team Codes (Common)

| Code | Team |
|------|------|
| MAD | Real Madrid |
| BAR | FC Barcelona |
| MCO | AS Monaco |
| PAN | Panathinaikos |
| OLY | Olympiacos |
| FEN | Fenerbahce |
| IST | Anadolu Efes |
| MUN | FC Bayern Munich |
| MAC | Maccabi Tel Aviv |
| PAR | Partizan Belgrade |
| ZAL | Zalgiris Kaunas |
| ASV | ASVEL Lyon-Villeurbanne |
| MIL | EA7 Milano |
| VIR | Virtus Bologna |
| CZV | Crvena Zvezda |
| BAS | Baskonia |
| VAL | Valencia Basket |

## Related Files

- `src/services/euroleagueApi.ts` - API implementation
- `src/services/__tests__/euroleagueApi.test.ts` - Tests
- `docs/adr/003-euroleague-api-version.md` - Decision record
