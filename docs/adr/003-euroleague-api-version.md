# ADR-003: EuroLeague API Version Selection

## Status
Updated

## Date
2026-01-18 (Updated: 2026-01-19, 2026-09-03)

## Context

The EuroLeague/EuroCup data needs to include both completed and upcoming matches. During investigation, we discovered that different APIs serve different purposes:

### Investigation

- **v1 API** (`api-live.euroleague.net/v1/results`) - Returns COMPLETED games only (XML format)
- **v2 API** (`feeds.incrowdsports.com/.../v2/.../games`) - Returns UPCOMING/SCHEDULED games only (JSON format)
- **v3 API** (`api-live.euroleague.net/v3/`) - Returns 405 Method Not Allowed

## Decision

Use BOTH v1 and v2 APIs to get complete match data:
- v1 API for completed match results (XML parsing)
- v2 API for upcoming/scheduled fixtures (JSON)

### Implementation

```typescript
// V1 API - Completed games (XML)
const V1_BASE = 'https://api-live.euroleague.net/v1';
const resultsUrl = `${V1_BASE}/results?seasoncode=${seasonCode}`;
const standingsUrl = `${V1_BASE}/standings?seasoncode=${seasonCode}`;

// V2 API - Upcoming games (JSON), paged via offset/limit until the
// complete fixture collection has been retrieved (see fetchAllV2Games)
const V2_BASE = 'https://feeds.incrowdsports.com/provider/euroleague-feeds/v2';
const gamesUrl = `${V2_BASE}/competitions/${comp}/seasons/${seasonCode}/games?limit=100&offset=${offset}`;

// Season codes are computed dynamically by getCurrentSeasonYear(), not
// hardcoded, since the season year rolls over every August:
// E2025 = EuroLeague 2025-26 season (used Jan-Jul 2026)
// E2026 = EuroLeague 2026-27 season (used from Aug 2026)
// U2025 = EuroCup 2025-26 season (used Jan-Jul 2026)
```

### 2026-09-03 update

Two follow-up issues were found and fixed:

1. **Hardcoded season year went stale.** The original implementation used a
   module-level `CURRENT_SEASON_YEAR = '2025'` constant. Once the real
   2026-27 season began publishing fixtures (from ~August 2026), this
   became wrong and the app kept requesting the previous season's data.
   Replaced with `getCurrentSeasonYear(referenceDate?: Date)`, exported and
   unit-tested for the August rollover boundary.
2. **V2 pagination only fetched the first page.** `pageSize=100` silently
   truncated a ~400-game season to its first 100 games. Replaced with
   `fetchAllV2Games()`, which pages through `limit`/`offset` until all of
   `metadata.totalItems` has been retrieved.

Additionally, `fetchEuroLeagueAllData()` now fetches matches and standings
via `Promise.allSettled` rather than `Promise.all`, so a standings failure
(e.g. immediately after the season rollover, before a standings table
exists) no longer discards already-fetched fixtures.

## Consequences

### Positive
- Complete match coverage (both completed and upcoming)
- Both APIs free, no authentication required
- V2 provides team logos and venue details
- Deduplication prevents duplicate matches

### Negative
- Two API calls per request (though parallelized)
- Different data formats (XML vs JSON) require separate parsing
- Need to handle one API failing gracefully

### Notes
- V1 API returns results immediately after matches complete
- V2 API provides schedule data for the entire season
- Both APIs are stable and reliable in testing

## Related
- `src/services/euroleagueApi.ts`
