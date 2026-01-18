# Copilot Instructions for Super League Basketball App

## Project Overview

A mobile-first web app for tracking Super League Basketball (SLB) scores and standings. Built with React + TypeScript + Vite + Tailwind, deployed to GitHub Pages.

## Key Technical Context

### Data Providers

The app uses free APIs for different leagues - **no API keys required**:

| League | Provider | Notes |
|--------|----------|-------|
| Super League Basketball | Genius Sports | HTML parsing, use `roundNumber=-1` for full schedule |
| EuroLeague/EuroCup | EuroLeague v1 | XML responses |

### Critical API Details

**Genius Sports (SLB):**
- Base: `https://hosted.dcd.shared.geniussports.com/embednf/SLB/en`
- Schedule: `/schedule?roundNumber=-1` (the `-1` is required for full season!)
- Returns JSON with `html` field containing data to parse
- Match IDs: Extract from `id="extfix_XXXXXX"`
- Status: CSS class `STATUS_COMPLETE` or `STATUS_SCHEDULED`

**EuroLeague:**
- Use v1 API (v3 returns 405 errors)
- Season codes: `E2025` (EuroLeague), `U2025` (EuroCup)
- Returns XML, parse with DOMParser

### Known Issues & Solutions

| Issue | Solution |
|-------|----------|
| Only 6 matches showing | Add `roundNumber=-1` to schedule endpoint |
| EuroLeague 405 errors | Use v1 API instead of v3 |

## User Preferences

- **PRs preferred** over direct commits to main
- **Mobile-first** design approach
- **British English** terminology (e.g., "fixtures" not "games", "league table" not "standings")
- **Documentation** - create/update docs for significant changes
- **Tests** - add tests for new functionality

## Architecture

See `docs/ARCHITECTURE.md` for full details. Key pattern:

```
dataProvider.ts  →  geniusSportsApi.ts (SLB)
                →  euroleagueApi.ts (EuroLeague/EuroCup)
                →  mockProvider.ts (fallback)
```

## Documentation

- `docs/GENIUS_SPORTS_API.md` - Detailed Genius Sports API docs
- `docs/ARCHITECTURE.md` - System architecture
- `docs/adr/` - Architecture Decision Records
- `docs/session-history/` - Previous agent session summaries

## Running Locally

```bash
npm install
npm run dev      # Development server
npm run test     # Run tests
npm run build    # Production build
```

## Future Features (Planned)

- Match detail views with live scores and stats
- Real-time polling for live games
- Additional league support
