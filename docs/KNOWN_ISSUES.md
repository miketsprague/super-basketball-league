# Known Issues & Solutions

Quick reference for common issues encountered in this project.

## API Issues

### Genius Sports - Only Shows Recent Matches
**Symptom:** Only 6 completed matches displayed instead of full season  
**Cause:** Default schedule endpoint returns recent matches only  
**Solution:** Add `roundNumber=-1` parameter to fetch all 142 matches
```
/schedule?roundNumber=-1
```

### EuroLeague - 405 Method Not Allowed
**Symptom:** EuroLeague/EuroCup data returns 405 errors  
**Cause:** v3 API is deprecated or requires authentication  
**Solution:** Use v1 API instead
```typescript
// ❌ Wrong
https://api-live.euroleague.net/v3/standings

// ✅ Correct
https://api-live.euroleague.net/v1/standings?seasoncode=E2025
```

### EuroLeague - Hardcoded season year goes stale every August
**Symptom:** App keeps showing last season's fixtures/standings after a new EuroLeague/EuroCup season starts
**Cause:** Season code (`E2025`, `U2025`, ...) was a hardcoded module constant (`CURRENT_SEASON_YEAR = '2025'`) that never changed
**Solution:** Compute the season year dynamically with `getCurrentSeasonYear()` in `src/services/euroleagueApi.ts`, which rolls over every 1 August (seasons run roughly October-June, but next season's fixtures are published from around August)
```typescript
// ❌ Wrong
const CURRENT_SEASON_YEAR = '2025';

// ✅ Correct
export function getCurrentSeasonYear(referenceDate: Date = new Date()): string {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  return String(month >= 7 ? year : year - 1); // August rollover
}
```
The `.github/workflows/api-health-check.yml` workflow mirrors this same rollover logic in bash so it always checks the current season.

### EuroLeague - V2 API only returns the first page of fixtures
**Symptom:** A full season (~400 games) truncated to only the first ~100 upcoming fixtures
**Cause:** V2 request used a single `pageSize=100` call and never fetched subsequent pages
**Solution:** Page through the complete collection using the API's `limit`/`offset` mechanism until `metadata.totalItems` has been retrieved (see `fetchAllV2Games()`)

### Standings failure was hiding otherwise-working fixtures
**Symptom:** A standings/league-table endpoint failure (e.g. before a new season's table is published) caused the whole page to show an error, even though fixtures had loaded successfully
**Cause:** `fetchGeniusSportsAllData()`/`fetchEuroLeagueAllData()` used `Promise.all`, so one rejected promise discarded both results
**Solution:** Use `Promise.allSettled` and only rethrow when the *matches* fetch fails; a standings failure now returns the fetched fixtures with an empty standings array

### Knockout-only competitions unnecessarily hit a standings endpoint
**Symptom:** SLB Cup (knockout format, no league table) still made a standings request that had nothing useful to return
**Cause:** `fetchAllData()` always fetched standings regardless of competition format
**Solution:** Check `leagueConfig.hasStandings === false` in `dataProvider.fetchAllData()` and skip the standings request entirely for those competitions, returning `standings: []`

### Genius Sports - Bare `/schedule` and `/standings` endpoints are pinned to a stale season
**Symptom:** SLB Championship kept showing the previous season's fixtures and league table even after the new season's competition ID was configured
**Cause:** `fetchGeniusSportsMatches()`/`fetchGeniusSportsStandings()` special-cased the default competition to use the **bare** `/schedule?roundNumber=-1` and `/standings` endpoints. Those are pinned server-side to one fixed competition and never roll over - they were still returning competition `41897` (2025-26) well after the 2026-27 season went live, so changing `SLB_COMPETITION_IDS` had no effect on the Championship.
**Solution:** Always use the competition-scoped endpoint, including for the default competition
```typescript
// ❌ Wrong - the bare endpoint is frozen on an old season
const endpoint = competitionId === DEFAULT_COMPETITION_ID
  ? '/schedule?roundNumber=-1'
  : `/competition/${competitionId}/schedule?roundNumber=-1`;

// ✅ Correct
const endpoint = `/competition/${competitionId}/schedule?roundNumber=-1`;
```
`.github/workflows/api-health-check.yml` was hitting the same bare endpoints and is now competition-scoped too, so the health check monitors the season the app actually shows.

### Genius Sports - Competition IDs change every season
**Symptom:** Fixtures/standings go stale at the start of a new season
**Cause:** Genius Sports mints a **new competition ID for every edition of every competition**; IDs are not stable year to year
**Solution:** Refresh `SLB_COMPETITION_IDS` in `src/services/leagues.ts` each August from the competition chooser on <https://hosted.dcd.shared.geniussports.com/SLB/en/> (a `<select id="competitionChooser">` listing `competition/{id}` URLs labelled by season). Never guess or derive an ID.

### SLB Trophy discontinued for 2026-27
**Symptom:** No `Trophy 26-27` competition exists in the Genius Sports chooser
**Cause:** The Trophy was scrapped and absorbed into the restructured Cup (Play-In → Quarter-Finals → two-legged Semi-Finals → Final)
**Solution:** The Trophy `LeagueConfig` is kept pointing at its final 2025-26 edition (`42212`) but marked `hidden: true`. Hidden leagues are excluded from `visibleLeagues` (so they don't appear in the league selector or pollute current-season team records) while remaining in `predefinedLeagues` so historic match deep links still resolve.

## GitHub Actions Issues

### Environment Secrets Not Working
**Symptom:** Environment secrets not accessible during build  
**Cause:** Job missing environment declaration  
**Solution:** Add `environment: github-pages` to the job
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    environment: github-pages  # ← Required for secrets!
    steps:
      # ...
```

## Data Parsing Issues

### Match Scores Showing NaN
**Symptom:** Scores display as NaN for scheduled matches  
**Cause:** Parsing `&nbsp;` or empty strings as numbers  
**Solution:** Check for numeric content before parsing
```typescript
const score = /^\d+$/.test(scoreText) ? parseInt(scoreText, 10) : undefined;
```

## Development Issues

### Tests Failing After API Changes
**Symptom:** Tests fail with URL mismatch or undefined values  
**Cause:** Mock HTML structure doesn't match actual API  
**Solution:** Update mock HTML to match real Genius Sports structure (see test file)

### TypeScript Unused Variable Error
**Symptom:** Build fails with "declared but never read" error  
**Cause:** Leftover variable after refactoring  
**Solution:** Remove unused variables or prefix with `_`
