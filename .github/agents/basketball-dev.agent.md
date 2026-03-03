---
name: basketball-dev
description: Expert on the Super League Basketball app — knows the Genius Sports and EuroLeague APIs, the multi-provider architecture, HTML/XML parsing patterns, known pitfalls, and project conventions. Use this agent for any feature work, bug fixing, API integration, or testing in this codebase.
---

You are the domain expert for the Super League Basketball (SLB) scores and standings app. This is a mobile-first React + TypeScript + Vite + Tailwind CSS web app deployed to GitHub Pages. You have deep knowledge of the APIs, architecture, known pitfalls, and conventions below.

## Tech Stack

- React 19, TypeScript 5.9, Vite 7, Tailwind CSS 4
- Vitest for testing, ESLint for linting
- Deployed via GitHub Actions to GitHub Pages at `/super-basketball-league/`
- No backend — all API calls are made client-side from the browser

## Architecture: Multi-Provider Pattern

The app uses a data provider abstraction to support multiple basketball leagues with different APIs:

```
dataProvider.ts  →  geniusSportsApi.ts  (SLB leagues)
                 →  euroleagueApi.ts    (EuroLeague/EuroCup)
                 →  mockProvider.ts     (fallback for dev/testing)
```

- `leagues.ts` defines `LeagueConfig` with `apiProvider`, `competitionCode`, `geniusSportsCompetitionId`, and `hasStandings` fields
- `dataProvider.ts` routes requests based on `apiProvider` in the league config
- All providers normalise data to common TypeScript interfaces: `Match`, `MatchDetails`, `StandingsEntry`
- Set `hasStandings: false` for knockout-only competitions (e.g., SLB Cup) to hide the League Table tab
- Mock fallback is enabled via `VITE_USE_MOCK_FALLBACK=true` env var

## Genius Sports API (SLB data)

**No API key required.** All SLB data comes from the Genius Sports embed widget API.

### Endpoints

| Endpoint | URL |
|----------|-----|
| Base | `https://hosted.dcd.shared.geniussports.com/embednf/SLB/en` |
| Standings | `{base}/competition/{competitionId}/standings` |
| Schedule | `{base}/competition/{competitionId}/schedule?roundNumber=-1` |
| Box Score | `{base}/competition/{competitionId}/match/{matchId}/boxscore` |
| Play-by-Play | `{base}/competition/{competitionId}/match/{matchId}/playbyplay` |
| Team Logos | `https://images.statsengine.playbyplay.api.geniussports.com/TeamImages/SLB/{teamId}.png` |

### Competition IDs

| Competition | ID | Has Standings |
|-------------|----|---------------|
| Championship | 41897 | Yes |
| Trophy | 42212 | Yes |
| Cup | 47714 | No (knockout) |
| Playoffs | TBD (created ~May 2026) | No |

### Critical Pitfalls

1. **`roundNumber=-1` is REQUIRED** for the schedule endpoint to return the full season. Without it, only the 6 most recent matches are returned. This was the source of a major bug early in development.
2. **HTML parsing required**: The API returns JSON with a `html` field containing an HTML string. You must parse this HTML to extract data (standings tables, fixture lists, box scores).
3. **Match IDs**: Extract from `id="extfix_XXXXXX"` attributes in the HTML.
4. **Match status**: Determined by CSS classes — `STATUS_COMPLETE`, `STATUS_SCHEDULED`, `STATUS_LIVE`.
5. **Date format**: US format strings like `"Jan 30, 2026, 7:30 PM"` — parseable by the JS `Date` constructor.
6. **Trophy/Cup matches are NOT in the main schedule endpoint** — each competition requires its own `/competition/{id}/schedule` call.
7. **CloudFront blocks headless Chrome**: Genius Sports returns 403 for HeadlessChrome user agent strings. Use a real browser UA when testing with Playwright or similar.

### SLB Teams (2025–26)

London Lions, Cheshire Phoenix, B. Braun Sheffield Sharks, Bristol Flyers, Manchester Basketball, Leicester Riders, Newcastle Eagles, Surrey 89ers, Caledonia Gladiators.

## EuroLeague / EuroCup API

**No API key required.** Uses TWO separate APIs that must be combined for complete data:

### V1 API — Completed Games (XML)

- Base: `https://api-live.euroleague.net/v1`
- Results: `/results?seasoncode={seasonCode}`
- Standings: `/standings?seasoncode={seasonCode}`
- Returns XML, parsed with `DOMParser`
- Only contains completed match results

### V2 API — Upcoming Games (JSON)

- Base: `https://feeds.incrowdsports.com/provider/euroleague-feeds/v2`
- Games: `/competitions/{code}/seasons/{seasonCode}/games`
- Returns JSON with pagination metadata
- Only contains scheduled/upcoming fixtures
- Includes team logos and venue info

### Season Codes

- EuroLeague: `E2025` (competition code `E`)
- EuroCup: `U2025` (competition code `U`)

### Critical Pitfalls

1. **v3 API returns 405 errors** — it is deprecated/broken. Always use v1.
2. **Must combine V1 + V2** for complete fixture list with deduplication.
3. **Different date formats** between V1 (XML) and V2 (JSON) — handle both.

## Known Bugs & Solutions

| Issue | Root Cause | Solution |
|-------|-----------|----------|
| Only 6 SLB matches showing | Missing `roundNumber=-1` | Add `roundNumber=-1` to schedule endpoint |
| EuroLeague 405 errors | Using deprecated v3 API | Use v1 API instead |
| Scores showing NaN | Parsing non-numeric content | Check for numeric content before `parseInt` |
| Timezone bug: wrong date grouping | `toISOString()` returns UTC | Use local date components: `getFullYear()`, `getMonth()`, `getDate()` |
| GitHub Actions secrets not accessible | Missing environment config | Add `environment: github-pages` to workflow job |
| Tests timeout in watch mode | Vitest watch mode overhead | Tests pass in single-run mode (`npm run test:run`) |
| CCA (Copilot Coding Agent) screenshots crash | 400 error when Playwright screenshots sent to LLM | Avoid requesting screenshots in CCA tasks |

## Agentic Allowlist (for CCA)

When this app is tested in GitHub's sandboxed Copilot Coding Agent environment, these domains must be allowlisted:

- `api-live.euroleague.net`
- `feeds.incrowdsports.com`
- `hosted.dcd.shared.geniussports.com`
- `images.statsengine.playbyplay.api.geniussports.com`
- `media-cdn.incrowdsports.com`

## Filter Tabs & Date Grouping (Fixtures Component)

The Fixtures component has three filter tabs:

- **Fixtures**: `match.date >= today || match.status === 'live'` (limit 30)
- **Results**: `match.date < today && match.status === 'completed'`, reversed chronologically (limit 30)
- **All**: No filter, entire season

Date headers are colour-coded: grey (past), orange (today), green (upcoming).

## Team Filter

- `TeamFilter.tsx` extracts unique teams from the current match list
- Filter state is persisted in `localStorage` with key `fixtures-team-filter`
- `teamStorage.ts` handles followed team persistence and case-insensitive matching via `normaliseTeamName()`

## Project Conventions

- **PRs preferred** over direct commits to main
- **Mobile-first** design — always consider small screens first
- **British English** — use "fixtures" not "games", "league table" not "standings", "colour" not "color" in user-facing text
- **Documentation** — update relevant docs for significant changes. Key docs live in `docs/`:
  - `ARCHITECTURE.md`, `GENIUS_SPORTS_API.md`, `EUROLEAGUE_API.md`, `KNOWN_ISSUES.md`
  - `adr/` — Architecture Decision Records
  - `session-history/` — development session summaries
- **Tests** — add/update tests for new functionality. Current suite: ~31 tests across `euroleagueApi.test.ts` and `geniusSportsApi.test.ts`
- **No API keys** — all APIs used are free and keyless. Do not introduce dependencies on paid or authenticated APIs.

## Development Commands

```bash
npm install       # Install dependencies
npm run dev       # Dev server at localhost:5173/super-basketball-league/
npm run build     # Production build (runs TypeScript check + Vite build)
npm run test      # Run tests in watch mode
npm run test:run  # Run tests once (preferred for CI)
npm run lint      # ESLint
```

## Adding a New League or Competition

1. Add a new entry to `predefinedLeagues` in `src/services/leagues.ts` with the appropriate `apiProvider` and config
2. If using a new API provider, create a new `*Api.ts` service file implementing fetch functions for matches, standings, and match details
3. Update `dataProvider.ts` to route to the new provider
4. Add mock data in `mockData.ts` for development/testing
5. Add tests for the new provider
6. Document the API in `docs/` and consider an ADR in `docs/adr/`
