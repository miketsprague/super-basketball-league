# Super League Basketball App - Architecture

This document provides an overview of the application architecture and key design decisions.

## Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Frontend | React 19 + TypeScript | Type safety, component reusability, large ecosystem |
| Build | Vite | Fast HMR, native ESM, excellent DX |
| Styling | Tailwind CSS 4 | Utility-first, mobile-first responsive design |
| Testing | Vitest | Native Vite integration, fast, Jest-compatible API |
| Hosting | GitHub Pages | Free, simple deployment, good for static sites |
| CI/CD | GitHub Actions | Integrated with repo, free for public repos |

## Data Architecture

### Multi-Provider Pattern

The app uses a data provider abstraction to fetch data from multiple basketball APIs:

```
┌─────────────────────────────────────────────────────────┐
│                    dataProvider.ts                       │
│  (Routes requests based on league configuration)         │
└─────────────────────┬───────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│ geniusSportsApi│ │ euroleagueApi │ │  mockProvider │
│ (SLB data)    │ │ (EL/EC data)  │ │ (fallback)    │
└───────────────┘ └───────────────┘ └───────────────┘
```

### League Configuration

Leagues are configured in `src/services/leagues.ts`:

```typescript
type ApiProvider = 'geniussports' | 'euroleague' | 'mock';

interface LeagueConfig {
  id: string;
  name: string;
  apiProvider: ApiProvider;
  // ...
}
```

### API Providers

| League | Provider | API Key Required | Notes |
|--------|----------|------------------|-------|
| Super League Basketball | Genius Sports | No | HTML parsing required |
| EuroLeague | EuroLeague v1 | No | XML responses |
| EuroCup | EuroLeague v1 | No | XML responses |

## Directory Structure

```
src/
├── components/          # React components
│   ├── MatchCard.tsx   # Individual match display
│   ├── MatchList.tsx   # List of matches
│   ├── StandingsTable.tsx
│   └── ...
├── services/           # Data fetching layer
│   ├── dataProvider.ts # Main routing logic
│   ├── geniusSportsApi.ts
│   ├── euroleagueApi.ts
│   ├── mockProvider.ts
│   └── leagues.ts      # League configuration
├── types/              # TypeScript interfaces
│   └── index.ts
├── hooks/              # Custom React hooks
└── App.tsx             # Main app component

docs/
├── GENIUS_SPORTS_API.md  # API documentation
├── ARCHITECTURE.md       # This file
├── adr/                  # Architecture Decision Records
└── session-history/      # Agent session summaries
```

## Key Design Decisions

See the `docs/adr/` directory for detailed Architecture Decision Records.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_SPORTS_KEY` | No* | API-Sports.io key (not currently used) |
| `VITE_USE_MOCK_FALLBACK` | No | Enable mock data fallback on API errors |

*API-Sports was replaced with Genius Sports which requires no API key.

## Deployment

The app is deployed to GitHub Pages via GitHub Actions:

1. Push to `main` triggers the deploy workflow
2. `npm ci` installs dependencies
3. `npm run build` creates production build
4. Built files uploaded to GitHub Pages

**Important:** Environment secrets require `environment: github-pages` in the workflow job definition.

## Future Considerations

- **Match Details**: Phase 2 feature for detailed match views with live scores
- **Caching**: Consider adding service worker caching for offline support
- **Real-time Updates**: WebSocket integration for live match data
- **Additional Leagues**: The multi-provider architecture supports adding new leagues
