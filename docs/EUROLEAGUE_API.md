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

## V1 API (Completed Games + Standings)

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
| pageSize | Results per page (max 100) | 100 |
| pageNumber | Page index (0-based) | 0 |

**Example Request:**
```bash
curl -H "Accept: application/json" \
  "https://feeds.incrowdsports.com/provider/euroleague-feeds/v2/competitions/E/seasons/E2025/games?pageSize=100"
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
- If both fail, an error is thrown

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
