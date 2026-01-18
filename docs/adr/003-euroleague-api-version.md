# ADR-003: EuroLeague API Version Selection

## Status
Accepted

## Date
2026-01-18

## Context

The EuroLeague/EuroCup data was originally fetched from the EuroLeague API. During development, we encountered 405 errors from the v3 API endpoints.

### Investigation

- **v3 API** (`api-live.euroleague.net/v3/`) - Returns 405 Method Not Allowed
- **v1 API** (`api-live.euroleague.net/v1/`) - Works correctly, returns XML

## Decision

Use the EuroLeague v1 API with XML parsing.

### Implementation

```typescript
// Endpoint
const url = `https://api-live.euroleague.net/v1/standings?seasoncode=${seasonCode}`;

// Season codes
// E2025 = EuroLeague 2025-26 season
// U2025 = EuroCup 2025-26 season

// Response format: XML
// Parsed using DOMParser in the browser
```

## Consequences

### Positive
- Working API access without authentication
- Official data source
- Stable v1 API (likely maintained for backwards compatibility)

### Negative
- XML parsing more complex than JSON
- v1 may have fewer features than v3
- No documentation for v1 endpoints

### Notes
- The v3 API may require authentication or have been deprecated
- v1 API has been stable and reliable in testing

## Related
- `src/services/euroleagueApi.ts`
