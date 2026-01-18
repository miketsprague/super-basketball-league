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

## Endpoints

### Standings

```
GET /standings
```

Returns current league standings.

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
GET /schedule?roundNumber=-1
```

Returns all fixtures for the season (completed and upcoming).

**Important:** Without `roundNumber=-1`, only recent matches are returned (typically ~6). Use this parameter to get the full season schedule.

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
- Avoid excessive polling (refresh every 30-60 seconds max for live data)

## Error Handling

| HTTP Code | Meaning |
|-----------|---------|
| 200 | Success |
| 404 | Endpoint not found |
| 500+ | Server error |

On error, the API may return HTML error pages instead of JSON. Always check `response.ok` before parsing.

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
