# ADR-001: Use Genius Sports API for Super League Basketball Data

## Status
Accepted

## Date
2026-01-18

## Context

We needed a data source for Super League Basketball (SLB) fixtures and standings. Initial options considered:

1. **API-Sports.io** - Commercial basketball API
2. **Official EuroLeague API** - For European competitions
3. **Web scraping** - Direct scraping of SLB website
4. **Genius Sports** - Widget API used by SLB website

### Investigation Results

**API-Sports.io:**
- ✅ Has SLB data (league ID 108)
- ❌ Free tier blocks current season data (2025-26)
- ❌ Requires paid subscription for live data
- Note: Initially used wrong league ID (79 = Romanian Women's League)

**Genius Sports:**
- ✅ Powers the official SLB website
- ✅ No API key required
- ✅ Has current 2025-26 season data
- ✅ Includes standings, fixtures, team logos
- ⚠️ Returns HTML embedded in JSON (requires parsing)
- ⚠️ Unofficial/undocumented API

## Decision

Use the Genius Sports embed API (`hosted.dcd.shared.geniussports.com/embednf/SLB/en/`) for SLB data.

Key endpoints:
- `/standings` - League table
- `/schedule?roundNumber=-1` - All fixtures (the `-1` parameter is crucial for full season)

## Consequences

### Positive
- Free access to current season data
- No API key management
- Same data source as official website (authoritative)
- Team logos included

### Negative
- Must parse HTML from JSON responses
- API structure could change without notice
- No official documentation or support
- Rate limiting unknown (use conservatively)

### Mitigations
- Created comprehensive API documentation (`docs/GENIUS_SPORTS_API.md`)
- Robust HTML parsing with fallbacks
- Mock data provider as backup
- Can switch to API-Sports for historical data if needed

## Related
- `src/services/geniusSportsApi.ts` - Implementation
- `docs/GENIUS_SPORTS_API.md` - API documentation
