# AGENTS.md — Conventions for AI Coding Agents

This file captures project-specific conventions, testing patterns, and API notes for AI coding agents (Copilot, Claude, etc.) working on this repository.

## Project Overview

A mobile-first web app for tracking Super League Basketball (SLB) and European basketball scores and standings. Built with React + TypeScript + Vite + Tailwind CSS v4, deployed to GitHub Pages.

## Quick Start

```bash
npm install
npm run dev      # Development server (http://localhost:5173/super-basketball-league/)
npm run test     # Run tests (Vitest)
npm run build    # Production build
npm run lint     # ESLint
```

## Architecture

```
src/
├── App.tsx                  # Root component: data fetching, polling, tab routing
├── components/
│   ├── Fixtures.tsx         # Fixtures/Results tab
│   ├── LeagueSelector.tsx   # League switcher UI
│   ├── LeagueTable.tsx      # Standings table (named export: { LeagueTable })
│   ├── MatchDetail.tsx      # Match detail view (useParams, useNavigate)
│   └── TeamView.tsx         # Team profile/season record
├── services/
│   ├── dataProvider.ts      # Main abstraction layer — routes to correct API
│   ├── geniusSportsApi.ts   # Genius Sports API (SLB)
│   ├── euroleagueApi.ts     # EuroLeague/EuroCup APIs (v1 + v2)
│   ├── mockProvider.ts      # Mock data fallback
│   ├── leagues.ts           # League configuration constants
│   └── teamStorage.ts       # localStorage helpers + computeTeamRecord()
├── types/                   # TypeScript type definitions
└── test/setup.ts            # Vitest setup (@testing-library/jest-dom)
```

## Code Conventions

### TypeScript / React
- Functional components only; no class components.
- Named exports for components (e.g., `export { LeagueTable }`).
- All types live in `src/types/`; import with `import type { ... }`.
- `Match.homeTeam` / `Match.awayTeam` are `Team { id, name, shortName, logo? }`.
- `Match.venue` is required — use `'TBC'` if unknown.

### Tailwind CSS v4
- Uses `@custom-variant dark (...)` syntax (NOT `darkMode: 'class'` config).
- `dark:` variants work via this custom variant.

### Polling Constants (App.tsx)
- `POLL_INTERVAL_NORMAL = 5 * 60 * 1000` (5 minutes)
- `POLL_INTERVAL_LIVE = 30 * 1000` (30 seconds)
- `hasLiveMatches` computed via `useMemo`.

### Season Year
- Use `getCurrentSeasonYear()` from `euroleagueApi.ts` — do **not** hardcode the year.
- August is the season transition month.

### Auto-refresh Error Handling
- `isInitialLoad` flag in App.tsx: only the *initial* load shows a blocking error overlay.
- Background refresh failures are silent (data is preserved).

## Data Providers

### Genius Sports (SLB)
- Base URL: `https://hosted.dcd.shared.geniussports.com/embednf/SLB/en`
- Schedule: `/schedule?roundNumber=-1` (the `-1` is required for the full season)
- Returns JSON with an `html` field — parse with DOMParser.
- Match IDs: extract from `id="extfix_XXXXXX"`.
- Status: CSS class `STATUS_COMPLETE` or `STATUS_SCHEDULED`.
- **Requires** a realistic `User-Agent` header (CloudFront blocks headless Chrome with 403).

### EuroLeague / EuroCup (dual-API approach)
- **V1** (completed games, XML): `https://api-live.euroleague.net/v1/results?seasoncode=E2025`
- **V2** (upcoming games, JSON): `https://feeds.incrowdsports.com/provider/euroleague-feeds/v2/competitions/E/seasons/E2025/games`
- Season codes: `E2025` (EuroLeague), `U2025` (EuroCup).
- Both APIs must be combined for a complete fixture list.

## Testing

### Framework
- **Vitest** + **@testing-library/react** + **jsdom**.
- Always import explicitly: `import { describe, it, expect, vi } from 'vitest'`.
- `@testing-library/user-event` is **not** installed — use `fireEvent` instead.

### Test File Locations
- Service tests: `src/services/__tests__/<name>.test.ts`
- Component tests: `src/components/__tests__/<name>.test.tsx`  
  *(Note: this directory does not exist on `main` — create it when adding component tests.)*
- App-level tests: `src/__tests__/App.test.tsx`

### Router Setup
- `App.tsx` uses `<Routes>` but **not** `<BrowserRouter>` — wrap in `<MemoryRouter>` for tests.
- `MatchDetail` tests: wrap in `<MemoryRouter initialEntries={['/match/123']}><Routes path="/match/:matchId">`.

### Timer / Async Patterns
- `vi.useFakeTimers()` **before** rendering the component under test.
- To advance timers: `vi.advanceTimersByTime(N)`.
- After advancing timers, flush pending effects: `await act(async () => { await Promise.resolve(); })`.
- `waitFor` does **not** work reliably with fake timers — use `act` + `Promise.resolve` instead.
- Use **separate** `describe` blocks for fake-timer vs real-timer tests.

### localStorage Mock
- Node.js 25+ has a native `localStorage` stub that shadows jsdom.
- Always use the explicit `storageMock` pattern from `teamStorage.test.ts`:
  ```ts
  const storageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (k: string) => store[k] ?? null,
      setItem: (k: string, v: string) => { store[k] = v; },
      removeItem: (k: string) => { delete store[k]; },
      clear: () => { store = {}; },
    };
  })();
  Object.defineProperty(window, 'localStorage', { value: storageMock });
  ```

### Environment Variables
- Use `vi.stubEnv('PROD', true)` (boolean, **not** string `'true'`).

## Style / Language
- **British English**: "fixtures" not "games", "league table" not "standings" (in UI copy).
- Mobile-first design — test at 375 px width first.
- Prefer small, focused changes — one concern per PR.
