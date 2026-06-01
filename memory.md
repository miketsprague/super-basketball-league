# Repo Assist Memory

## Last Updated
2026-06-01T09:15:00Z

## Last Run Tasks
- Task 10: Created AGENTS.md PR (branch: repo-assist/add-agents-md; 81 tests ✅)
- Task 11: Closed May 2026 issue #156; created June 2026 monthly activity issue

## Issue Backlog Cursor
Last processed: #218 (no new issues since last run)

## Comments Made
- #7 (2026-03-03): Native Swift iOS app — feasibility overview
- #99 (2026-05-04): Second nudge — do not nudge again
- #174 (2026-05-07): Explained package-lock.json protected-file failure
- #218 (2026-06-01): API health check failure — identified as transient; second run passed

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
- #199: feat: share/copy-link button in MatchDetail — 86 tests ✅
- #201: feat: team form guide in league table — 91 tests ✅
- #203: feat: skeleton loading screens — 93 tests ✅
- #205: feat: dark mode toggle — 91 tests ✅
- #207: feat: season record stats banner in TeamView — 91 tests ✅
- #209: feat: highlight winning team + score margin — 93 tests ✅
- #211: feat: sortable columns in LeagueTable — 93 tests ✅
- #213: fix: preserve existing data when auto-refresh fails — 86 tests ✅
- TBD (pending push 2026-06-01): docs: add AGENTS.md — branch: repo-assist/add-agents-md; 81 tests ✅

## Open Non-Repo-Assist PRs
- #99: stale Copilot docs PR (nudged twice — do not nudge again)

## PR Notes
- Deps PRs BLOCKED: package-lock.json is a protected file
- PR creation IS WORKING (confirmed with PR #213)
- All open RA PRs except AGENTS.md have base SHA 2637d16c (pre-PR#217 main)
- Current main HEAD: d9c625e (PR #220 merged — updated repo-assist workflow allowed-files for AGENTS.md)
- PR #217 merged May 30: added full codebase (Copilot agent)
- PR #219 merged Jun 1: Allow Repo Assist to modify AGENTS.md (added to allowed-files)
- PR #220 merged Jun 1: Allow Repo Assist to update AGENTS.md via protected-files.exclude
- AGENTS.md is now in allowed-files — can modify/create via PR

## Proxy Issues to Close
#115, #116, #118, #120, #121, #123, #124, #126, #128, #130-#133, #135-#138, #140-#143, #147, #149, #151, #153, #155, #158-#161

## Monthly Activity Summary
- Issue #156: CLOSED (May 2026)
- June 2026 issue: CREATED this run (find actual number from next run — search for "[Repo Assist] Monthly Activity 2026-06")

## Round-Robin Next
- 2026-06-01: Task 10 (AGENTS.md), Task 11 (monthly summary)
- Next: Task 1 (issue triage), Task 5 (PR health), Task 7 (labelling), Task 9 (welcome), Task 8 (release prep)

## Key Code Notes
- vitest: import { describe, it, expect, vi } from 'vitest' explicitly
- @testing-library/user-event NOT installed — use fireEvent
- Match.homeTeam/awayTeam: Team { id, name, shortName, logo? }; venue required (can be 'TBC')
- MatchDetail.tsx: useParams, useNavigate, useSearchParams — MemoryRouter+Routes path="/match/:matchId"
- MatchDetail polling: vi.useFakeTimers() BEFORE render; vi.advanceTimersByTime(15001) works
- Fake timers + async fetch: act(async () => { await Promise.resolve(); }) to flush useEffect
- App.tsx: uses Routes (not BrowserRouter) — wrap in MemoryRouter for tests
- Fixtures.tsx: default tab shows date >= today || status === 'live'; results tab: past completed
- src/services/__tests__/ dir exists for service tests
- src/__tests__/ dir now exists for App tests (src/__tests__/App.test.tsx — 5 tests for auto-refresh fix)
- src/components/__tests__/ does NOT exist on main (component tests only in open PRs)
- LeagueTable: SortColumn type, useState sort state, useMemo sortedStandings, SortIndicator component (in PR #211)
- App.tsx: passes matches to LeagueTable (simple prop pass, no extra API calls) (in later PRs)
- MatchDetail share: shareStatus ('idle'|'copied'), handleShare useCallback; clipboard fallback 2s reset (PR #199)
- App.tsx: POLL_INTERVAL_NORMAL=5min, POLL_INTERVAL_LIVE=30s (#197); hasLiveMatches via useMemo
- App.tsx: LIVE badge aria-label="N live match(es)" on Fixtures tab (#195)
- vi.stubEnv for PROD: use boolean (true/false) not string
- serviceWorkerRegistration.ts: production-only, uses BASE_URL for SW path
- LeagueTable: playoffPositions/relegationPositions props (EuroLeague/Cup: 8/0; default: 4/2) (PR #184)
- Fixtures.tsx: SCROLL_KEY='fixtures-scroll-position' (sessionStorage)
- getCurrentSeasonYear(): August = season transition month (euroleagueApi.ts, pending PR #163)
- Skeleton.tsx: Skeleton, SkeletonLeagueTableRow, SkeletonMatchCard, SkeletonDateGroup components (PR #203)
- LeagueTable uses named export: { LeagueTable } not default export
- useDarkMode hook: src/hooks/useDarkMode.ts — reads localStorage 'basketball-dark-mode', OS pref fallback (PR #205)
- computeTeamRecord(matches, teamName): TeamRecord — in teamStorage.ts; only counts completed matches (PR #207)
- Fixtures.tsx: exports getMatchWinner(match) and getMatchMargin(match) (PR #209)
- App.tsx auto-refresh fix: isInitialLoad flag; background refresh errors are silent (not blocking); src/__tests__/App.test.tsx has regression tests
- App test pattern: wrap in <MemoryRouter initialEntries={['/']}> <App /> </MemoryRouter>
- Fake timers in App tests: vi.useFakeTimers() BEFORE render; waitFor doesn't work with fake timers (use act+Promise.resolve instead); separate describe blocks for real-timer tests vs fake-timer tests
- Fixtures shows match.homeTeam.shortName and match.awayTeam.shortName (not fullName) in match cards
- AGENTS.md added to repo root (PR pending 2026-06-01): captures conventions, testing patterns, API notes
- localStorage mock: Node.js 25+ native stub shadows jsdom — always use explicit storageMock pattern (see teamStorage.test.ts)
- Genius Sports API: User-Agent required (CloudFront blocks headless Chrome with 403)
- API health check failures #218: was transient (run attempt 2 passed); watch for seasonal changes
