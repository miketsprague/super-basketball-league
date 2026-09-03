# Genius Sports API Documentation

This document describes the Genius Sports API used to fetch Super League Basketball (SLB) data.

## Overview

Super League Basketball's official website uses Genius Sports as their data provider. The Genius Sports API provides an embeddable widget system that returns JSON containing HTML, CSS, and JavaScript for rendering data.

We parse the HTML content from these responses to extract structured data for our application.

## Base URLs

| Environment | URL |
|-------------|-----|
| JSON API | `https://hosted.dcd.shared.geniussports.com/embednf/SLB/en` |
| HTML Pages | `https://hosted.wh.geniussports.com/SLB/en` |

The JSON API (`/embednf/`) returns parseable responses while the HTML pages are full web pages.

## Competition IDs

SLB has multiple competitions, each with a unique ID. The single source of
truth for these IDs is `SLB_COMPETITION_IDS` in `src/services/leagues.ts` -
`geniusSportsApi.ts`'s `DEFAULT_COMPETITION_ID` imports from there rather
than redeclaring the value, so the ID only needs to be updated in one place:

| Competition | ID | Description |
|-------------|-----|-------------|
| Championship | `49597` | Regular season 26-27 (36 games per team, 10 clubs) |
| Cup | `49599` | Knockout 26-27 (Play-In, QF, two-legged SF, Final) |
| Trophy | `42212` | **Discontinued.** Final 2025-26 edition, hidden from the selector |
| Play-offs | Not yet added | Top 6 knockout (created closer to May) |

**Important:** Each competition has its own schedule and standings. Cup
matches are **not** included in the main Championship schedule.

### IDs are per-season and must be refreshed every year

Genius Sports mints a **brand new competition ID for every edition of every
competition** - IDs are not stable across seasons. The published list lives in
the competition chooser on <https://hosted.dcd.shared.geniussports.com/SLB/en/>,
as a `<select id="competitionChooser">` of `competition/{id}` URLs labelled by
season. Read the new IDs from there each August; never guess or derive them.

Previous seasons, for reference:

| Season | Championship | Trophy | Cup | Play-offs |
|--------|-------------|--------|-----|-----------|
| 2025-26 | `41897` | `42212` | `47714` | `48758` |
| 2024-25 | `39625` | `39626` | `39732` | `39733` |

**Do not guess the Play-offs competition ID.** It is not published until
Genius Sports creates the competition (~May), and it will **not** be the
same ID as the Championship. Only add a `PLAYOFFS` entry to
`SLB_COMPETITION_IDS`/`predefinedLeagues` once the real ID has been
confirmed.

## Endpoints

> **Always use the competition-scoped form.** The bare `/standings` and
> `/schedule` endpoints are pinned server-side to a single competition and do
> **not** roll over to the new season - they were still serving 2025-26 data
> (competition `41897`) after the 2026-27 season had been published. Using
> them makes the app silently show a stale season.

### Standings

```
GET /competition/{competitionId}/standings
```

Returns current league standings for that competition.

**Examples:**
- Championship: `/competition/49597/standings`
- Cup: `/competition/49599/standings` (empty - knockout format)

**Response Format:**
```json
{
  "css": ["https://...css files..."],
  "js": ["https://...js files..."],
  "html": "<div class=\"standings-wrapper\">...</div>"
}
```

**HTML Structure:**
```html
<table class="standings">
  <tbody>
    <tr>
      <td>1</td>  <!-- Position -->
      <td class="team-logo"><img src="..."></td>
      <td class="team-name">
        <a href="/team/178241">
          <span class="team-name-full">Leicester Riders</span>
          <span class="team-name-code">LEI</span>
        </a>
      </td>
      <td class="STANDINGS_played">18</td>
      <td class="STANDINGS_won">16</td>
      <td class="STANDINGS_lost">2</td>
      <td class="STANDINGS_standingPoints">34</td>
    </tr>
  </tbody>
</table>
```

### Schedule / Fixtures

```
GET /competition/{competitionId}/schedule?roundNumber=-1
```

Returns all fixtures for the competition (completed and upcoming).

**Important:** Without `roundNumber=-1`, only recent matches are returned (typically ~6). Use this parameter to get the full season schedule.

**Examples:**
- Championship: `/competition/49597/schedule?roundNumber=-1` (~173 matches)
- Cup: `/competition/49599/schedule?roundNumber=-1` (~6 matches so far)

**Response Format:**
```json
{
  "css": ["https://...css files..."],
  "js": ["https://...js files..."],
  "html": "<div class=\"schedule-wrap\">...</div>"
}
```

**HTML Structure:**
```html
<div class="match-wrap STATUS_COMPLETE" id="extfix_2702593">
  <div class="match-details-wrap">
    <div class="match-details">
      <div class="match-time">
        <h6>Date / Time: </h6>
        <span>Jan 18, 2026, 7:30 PM</span>
      </div>
      <div class="match-venue">
        <h6>Venue: </h6>
        <a href="/venue/35252" class="venuename">Surrey Sports Park</a>
      </div>
    </div>
  </div>
  <div class="sched-teams">
    <div class="home-team">
      <div class="home-team-logo team-logo">
        <a href="/team/178238">
          <img src="https://images.statsengine.playbyplay.api.geniussports.com/...T1.png" alt="Surrey 89ers">
        </a>
      </div>
      <div class="team-name">
        <a href="/team/178238" class="teamnames">
          <span class="team-name-full">Surrey 89ers</span>
          <span class="team-name-code"></span>
        </a>
      </div>
      <div class="team-score homescore">
        <div class="fake-cell">88</div>  <!-- Score for completed, &nbsp; for scheduled -->
      </div>
    </div>
    <div class="away-team">
      <!-- Same structure as home-team -->
    </div>
  </div>
</div>
```

**Match Status Classes:**
- `STATUS_COMPLETE` - Match has finished
- `STATUS_SCHEDULED` - Match is scheduled (upcoming)
- `STATUS_LIVE` - Match is in progress

**Match ID:** Extract from the `id` attribute (e.g., `extfix_2702593` → ID is `2702593`)

**Score Detection:** 
- Scores are in `.team-score .fake-cell`
- Completed matches have numeric scores
- Scheduled matches have `&nbsp;` (non-breaking space)

## Team IDs

Teams are identified by numeric IDs in URLs. Current SLB teams:

| Team | ID |
|------|-----|
| Surrey 89ers | 178238 |
| B. Braun Sheffield Sharks | 178235 |
| Caledonia Gladiators | 178239 |
| Cheshire Phoenix | 178240 |
| Leicester Riders | 178241 |
| London Lions | TBD |
| Bristol Flyers | TBD |
| Newcastle Eagles | TBD |
| Manchester Basketball | TBD |

## Team Logos

Team logos are hosted on Genius Sports' image CDN:
```
https://images.statsengine.playbyplay.api.geniussports.com/{hash}T1.png
```

Logo URLs can be extracted from `<img>` tags within team elements.

## Date/Time Parsing

Dates are provided in US format within the HTML:
- Format: `Jan 30, 2026, 7:30 PM`
- JavaScript's `Date` constructor can parse this directly
- Times appear to be in UK timezone (GMT/BST)

## Rate Limiting

The API does not appear to have strict rate limits for reasonable usage, but:
- No API key is required
- Responses are cached on their CDN
- Avoid excessive polling (refresh every 15-30 seconds max for live data)

### Box Score (Match Statistics)

```
GET /competition/49597/match/{matchId}/boxscore
```

Returns detailed player statistics and team totals for a completed match.

**Response Format:** Same JSON structure with HTML content.

**HTML Structure:**
```html
<table class="tableClass footable">
  <thead>
    <tr>
      <th>No</th>
      <th>Player</th>
      <th>Mins</th>
      <th>FGM</th><th>FGA</th><th>FG%</th>
      <th>3PM</th><th>3PA</th><th>3P%</th>
      <th>FTM</th><th>FTA</th><th>FT%</th>
      <th>OFF</th><th>DEF</th><th>REB</th>
      <th>AST</th><th>STL</th><th>BLK</th>
      <th>PF</th><th>TO</th><th>Pts</th><th>+/-</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="playerNumber">2</td>
      <td class="playerName">
        <a href="/person/2315157">Duke Shelton</a>
      </td>
      <td data-sort-value="18.833333">18:49</td>
      <td data-sort-value="3">3</td>
      <!-- ... more stats ... -->
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td>Totals</td>
      <td>&nbsp;</td>
      <td></td>
      <td>24</td><td>49</td><td>49.0</td>
      <!-- ... team totals ... -->
    </tr>
  </tfoot>
</table>
```

**Available Stats:**
- Minutes played (Mins)
- Field Goals Made/Attempted/Percentage (FGM, FGA, FG%)
- 3-Pointers Made/Attempted/Percentage (3PM, 3PA, 3P%)
- Free Throws Made/Attempted/Percentage (FTM, FTA, FT%)
- Offensive/Defensive/Total Rebounds (OFF, DEF, REB)
- Assists (AST)
- Steals (STL)
- Blocks (BLK)
- Personal Fouls (PF)
- Turnovers (TO)
- Points (Pts)
- Plus/Minus (+/-)

### Play-by-Play

```
GET /competition/49597/match/{matchId}/playbyplay
```

Returns play-by-play data with running scores.

**Response Format:** Same JSON structure with HTML content.

**HTML Structure:**
```html
<div class="pbpa pbpt0 pbptyperiod per_1 per_reg">
  <div class="pbp-action">Period start</div>
  <span class="pbpsc">0-0</span>
</div>
<div class="pbpa">
  <div class="pbp-action">3 Point Shot Made</div>
  <span class="pbpsc">3-0</span>
</div>
<!-- ... more plays ... -->
<div class="pbpa">
  <div class="pbp-action">Period end</div>
  <span class="pbpsc">14-18</span>
</div>
```

**Deriving Quarter Scores:**
1. Find all actions with "Period end" text
2. Extract the score at each period end from `.pbpsc` (format: "home-away")
3. Calculate individual quarter scores by subtracting cumulative totals

### Shot Chart

```
GET /competition/49597/match/{matchId}/shotchart
```

Returns shot chart data (not currently used in our app).

## Error Handling

| HTTP Code | Meaning |
|-----------|---------|
| 200 | Success |
| 404 | Endpoint not found |
| 500+ | Server error |

On error, the API may return HTML error pages instead of JSON. Always check `response.ok` before parsing.

### Resilience: standings failures don't lose fixtures

`fetchGeniusSportsAllData()` fetches matches and standings independently
(via `Promise.allSettled`, not `Promise.all`). If the standings request
fails but matches succeed, fixtures are still returned with an empty
standings array rather than discarding everything. If the matches request
itself fails, the error is propagated (fixtures are the primary data the
app needs). This matters most for the Cup, whose knockout format standings
sometimes differ in shape from the round-robin competitions.

### Knockout-only competitions skip standings entirely

For competitions with `hasStandings: false` in `leagues.ts` (currently only
the Cup), `dataProvider.fetchAllData()` skips the standings request
entirely rather than calling an endpoint that has nothing meaningful to
return - it calls `fetchGeniusSportsMatches()` directly and returns an
empty standings array.

## Example Usage

```typescript
async function fetchSchedule() {
  const response = await fetch(
    'https://hosted.dcd.shared.geniussports.com/embednf/SLB/en/schedule?roundNumber=-1',
    { headers: { 'Accept': 'application/json' } }
  );
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  const data = await response.json();
  // Parse data.html to extract matches
  return parseScheduleHTML(data.html);
}
```

## Related Resources

- [Official SLB Website](https://www.superleaguebasketballm.co.uk/)
- [Genius Sports](https://www.geniussports.com/)
- [FIBA LiveStats](https://www.fibalivestats.com/) - Live game statistics

## Notes

1. This is an unofficial documentation of a third-party API
2. The API structure may change without notice
3. Always respect the terms of service of the data provider
4. This data is for personal/educational use only
