# ADR-002: Multi-Provider Data Architecture

## Status
Accepted

## Date
2026-01-18

## Context

The app displays data from multiple basketball leagues:
- Super League Basketball (UK)
- EuroLeague (Europe)
- EuroCup (Europe)

Each league has different data sources with different APIs, response formats, and authentication requirements.

## Decision

Implement a **data provider abstraction** that:

1. Routes requests to the appropriate API based on league configuration
2. Normalizes responses to common TypeScript interfaces
3. Allows easy addition of new leagues/providers
4. Supports fallback to mock data

### Architecture

```typescript
// leagues.ts - Configuration
type ApiProvider = 'geniussports' | 'euroleague' | 'mock';

const predefinedLeagues: LeagueConfig[] = [
  { id: 'super-league', apiProvider: 'geniussports' },
  { id: 'euroleague', apiProvider: 'euroleague' },
  // ...
];

// dataProvider.ts - Routing
async function fetchMatches(leagueId: string): Promise<Match[]> {
  const provider = getApiProvider(leagueId);
  switch (provider) {
    case 'geniussports': return geniusSportsApi.fetchMatches();
    case 'euroleague': return euroleagueApi.fetchMatches(leagueId);
    default: return mockProvider.fetchMatches(leagueId);
  }
}
```

### Common Interfaces

All providers return data conforming to shared types:

```typescript
interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore?: number;
  awayScore?: number;
  date: string;
  time: string;
  venue: string;
  status: 'scheduled' | 'live' | 'completed';
}

interface StandingsEntry {
  position: number;
  team: Team;
  played: number;
  won: number;
  lost: number;
  points: number;
  // ...
}
```

## Consequences

### Positive
- Clean separation of concerns
- Easy to add new leagues
- Consistent data format for UI components
- Testable with mock provider

### Negative
- Some data loss in normalization (provider-specific fields)
- Must maintain multiple API implementations
- Provider-specific quirks handled in individual modules

## Related
- `src/services/dataProvider.ts`
- `src/services/leagues.ts`
- `src/types/index.ts`
