# Repo Assist Memory

## Last Updated
2026-05-19T08:05:00Z

## Last Run Tasks
- Task 7: Labelled PR #197 with `enhancement`
- Task 10: Created share/copy-link button PR for MatchDetail (TBD — this run)
- Task 11: Updated Monthly Activity Summary #156

## Issue Backlog Cursor
Last processed: #198 (only human open issue is #7 — already commented)

## Comments Made
- #7 (2026-03-03): Native Swift iOS app — feasibility overview
- #99 (2026-04-19): Nudge — stale PR
- #99 (2026-05-04): Second nudge — do not nudge again
- #174 (2026-05-07): Explained package-lock.json protected-file failure

## Open Repo Assist PRs
- #163: fix: replace hardcoded CURRENT_SEASON_YEAR (Closes #101) — 87 tests ✅
- #164: docs: fix ARCHITECTURE.md (Closes #145) — docs only
- #165: feat: persist active tab in URL — 81 tests ✅
- #166: feat: PWA manifest and basketball icon — 81 tests ✅
- #168: feat: team logos + W% in LeagueTable — 81 tests ✅
- #169: feat: ARIA tab roles and panel ids — SUPERSEDED by #180
- #171: test: ErrorBoundary/LeagueSelector/LeagueTable — 104 tests ✅
- #173: test: Fixtures (25 tests) — 106 total ✅
- #176: test: MatchDetail (29 tests) — 110 total ✅
- #178: test: App (17 tests) — 98 total ✅
- #180: feat: keyboard nav + ARIA roles for tabs — 91 tests ✅
- #182: test: TeamView (12 tests) — 93 total ✅
- #184: feat: configurable playoff/relegation zones — 89 tests ✅
- #185: feat: highlight followed team fixtures — 81 tests ✅
- #187: feat: last refreshed timestamp in fixtures — 85 tests ✅
- #189: feat: team search/filter in Fixtures — 88 tests ✅
- #191: feat: highlight followed team row in league table — 87 tests ✅
- #193: feat: service worker for offline/PWA — 87 tests ✅
- #195: feat: LIVE badge on Fixtures tab — 86 tests ✅
- #197: feat: adaptive polling 30s when live — 86 tests ✅
- TBD (2026-05-19): feat: share/copy-link button in MatchDetail — 86 tests ✅ (5 new)

## Open Non-Repo-Assist PRs
- #99: stale Copilot docs PR (nudged twice — do not nudge again)

## PR Notes
- Deps PRs BLOCKED: package-lock.json is a protected file
- PR creation IS WORKING

## Proxy Issues to Close
#115, #116, #118, #120, #121, #123, #124, #126, #128, #130-#133, #135-#138, #140-#143, #147, #149, #151, #153, #155, #158-#161

## Monthly Activity Summary
- Issue #156: [Repo Assist] Monthly Activity 2026-05 — OPEN (updated 2026-05-19)

## Round-Robin Next
- 2026-05-19T07:57: Task 7 (label #197), Task 10 (share button PR TBD), Task 11
- Next: Task 1 (triage), Task 5 (PR health), Task 8 (release prep), Task 9 (new contributors)

## Key Code Notes
- vitest: import { describe, it, expect, vi } from 'vitest' explicitly
- @testing-library/user-event NOT installed — use fireEvent
- Match.homeTeam/awayTeam: Team { id, name, shortName, logo? }; venue required (can be 'TBC')
- MatchDetail.tsx: useParams, useNavigate, useSearchParams — MemoryRouter+Routes path="/match/:matchId"
- MatchDetail polling: vi.useFakeTimers() BEFORE render; vi.advanceTimersByTime(15001) works
- Fake timers + async fetch: act(async () => { await Promise.resolve(); }) to flush useEffect
- App.tsx: uses Routes (not BrowserRouter) — wrap in MemoryRouter for tests
- Fixtures.tsx: default tab shows date >= today || status === 'live'; results tab: past completed
- src/components/__tests__/ dir exists (created 2026-05-19 for shareButton tests)
- MatchDetail share: shareStatus ('idle'|'copied'), handleShare useCallback; clipboard fallback 2s reset
- App.tsx: POLL_INTERVAL_NORMAL=5min, POLL_INTERVAL_LIVE=30s (#197); hasLiveMatches via useMemo
- App.tsx: LIVE badge aria-label="N live match(es)" on Fixtures tab (#195)
- vi.stubEnv for PROD: use boolean (true/false) not string
- serviceWorkerRegistration.ts: production-only, uses BASE_URL for SW path
- LeagueTable: playoffPositions/relegationPositions props (EuroLeague/Cup: 8/0; default: 4/2)
- Fixtures.tsx: SCROLL_KEY='fixtures-scroll-position' (sessionStorage)
- getCurrentSeasonYear(): August = season transition month (euroleagueApi.ts, pending PR #163)
