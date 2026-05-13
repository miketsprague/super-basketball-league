# Repo Assist Memory

## Last Updated
2026-05-13T07:33:00Z

## Last Run Tasks
- Task 7: Labelled PRs #176, #178, #180 with 'enhancement'
- Task 9: No new human contributors (only github-actions bot in last 24h)
- Task 10: feat: show last refreshed timestamp in fixtures view (PR TBD — new branch: repo-assist/improve-last-refreshed-timestamp)
- Task 11: Updated Monthly Activity Summary #156

## Issue Backlog Cursor
Last processed: #183 (all non-automated open issues covered; #183 is daily status report)

## Comments Made
- #7 (2026-03-03): Native Swift iOS app — feasibility overview
- #98 (2026-04-02): create_pull_request investigation — root cause and fix
- #101 (2026-04-15): Fix summary, test status, and branch name
- #101 (2026-04-17): PR submitted confirmation
- #99 (2026-04-19): Nudge — stale PR, suggested merge or close
- #99 (2026-05-04): Second nudge — tooling now working, suggest merge or close
- #174 (2026-05-07): Explained package-lock.json protected-file failure

## Open Repo Assist PRs
- #163: fix: replace hardcoded CURRENT_SEASON_YEAR (Closes #101) — 87 tests ✅
- #164: docs: fix ARCHITECTURE.md (Closes #145) — docs only
- #165: feat: persist active tab in URL — 81 tests ✅
- #166: feat: PWA manifest and basketball icon — 81 tests ✅
- #168: feat: team logos + W% in LeagueTable — 81 tests ✅
- #169: feat: ARIA tab roles and panel ids — SUPERSEDED by #180
- #171: test: component tests ErrorBoundary/LeagueSelector/LeagueTable — 104 tests ✅
- #173: test: Fixtures component tests (25 tests, 106 total) ✅
- #176: test: MatchDetail component tests (29 tests, 110 total) ✅
- #178: test: App component tests (17 tests, 98 total) ✅
- #180: feat: keyboard navigation + ARIA roles for tabs — 91 tests ✅
- #182: test: TeamView component tests (12 tests, 93 total) ✅
- #184: feat: configurable playoff/relegation zones per league — 89 tests ✅
- #185: feat: highlight followed team fixtures — 81 tests ✅
- TBD (submitted 2026-05-13): feat: show last refreshed timestamp in fixtures view — 85 tests ✅

## Open Non-Repo-Assist PRs
- #99: stale Copilot docs PR (nudged twice, Apr 19 + May 4)

## PR Creation Status
- PR creation IS WORKING
- IMPORTANT: Deps update PRs are BLOCKED — package-lock.json is a protected file. Will always fail unless `allowed-files` is configured or `protected-files: fallback-to-issue` is set.

## Proxy Issues to Close (when maintainer is ready)
#115, #116, #118, #120, #121, #123, #124, #126, #128, #130, #131, #132, #133, #135, #136, #137, #138, #140, #141, #142, #143, #147, #149, #151, #153, #155, #158, #159, #160, #161

## Monthly Activity Summary
- Issue #156: [Repo Assist] Monthly Activity 2026-05 — OPEN (updated 2026-05-13)

## Current Repo State
- npm vulnerabilities: 2 (1 moderate, 1 high) — can't fix without deps PR
- Tests: 81 passing on main; 85 with last-refreshed-timestamp changes (PR TBD)
- Baseline main: 81 tests (5 test files, all service layer)

## Component Tests Added (pending PRs)
- #171 PR: ErrorBoundary (6), LeagueSelector (8), LeagueTable (9)
- #173 PR: Fixtures (25)
- #176 PR: MatchDetail (29)
- #178 PR: App (17)
- #180 PR: TabKeyboard (10)
- #182 PR: TeamView (12) — ALL components now covered
- TBD PR: Fixtures.lastRefreshed (4)

## Round-Robin Task Schedule
- 2026-04-29T06:37: Task 7 (labelled #147), Task 10 (LeagueTable logos + W%), Task 11
- 2026-04-30T06:43: Task 7 (labelled #151), Task 10 (ARIA tab accessibility), Task 11
- 2026-05-01T06:44: Task 10 (Tab URL persistence), Task 11
- 2026-05-02T06:30: Task 2/3/5 (prepared 4 PR branches), Task 11
- 2026-05-03T06:38: Task 2/3 (submitted 4 real PRs), Task 11
- 2026-05-04T06:54: Task 3 (2 more PRs), Task 6 (nudge #99), Task 11
- 2026-05-05T06:28: Task 3 (component tests PR #171), Task 11
- 2026-05-06T06:44: Task 4 (deps update FAILED — protected files), Task 3 (Fixtures tests PR #173), Task 11
- 2026-05-07T06:51: Task 3 (MatchDetail tests PR #176), Task 1 (#174 comment), Task 11
- 2026-05-08T06:08: Task 3 (App component tests PR #178), Task 11
- 2026-05-09T06:27: Task 10 (keyboard nav + ARIA PR #180), Task 11
- 2026-05-10T06:43: Task 3/10 (TeamView tests PR #182), Task 11
- 2026-05-11T07:53: Task 10 (league zone config PR #184), Task 11
- 2026-05-12T06:57: Task 5 (PR health check), Task 8 (no releases), Task 10 (followed team fixtures PR #185), Task 11
- 2026-05-13T07:25: Task 7 (labels #176/#178/#180), Task 9 (no new contributors), Task 10 (last refreshed timestamp PR TBD), Task 11
- Next: Task 1 (triage new issues), Task 2 (fix bugs), Task 5 (PR maintenance), Task 6 (stale PRs)

## Key Code Notes
- VITE_USE_MOCK_FALLBACK evaluated at module load — vi.stubEnv needs vi.resetModules()
- Match.homeTeam/awayTeam are Team objects: { id, name, shortName, logo? }
- StandingsEntry.team is Team object; has pointsFor/Against/Difference
- MatchDetails extends Match; homeStats/awayStats/homePlayers/awayPlayers; quarterScores optional
- @testing-library/user-event NOT installed; use fireEvent
- Fixtures.tsx: useNavigate + useSearchParams — mock useNavigate, wrap in MemoryRouter with initialEntries
- MatchDetail.tsx: useParams, useNavigate, useSearchParams — MemoryRouter with Routes path="/match/:matchId"
- App.tsx: uses Routes (not BrowserRouter) — wrap in MemoryRouter; BrowserRouter in main.tsx
- App.tsx: Fixtures renders shortName not name; future-dated scheduled matches for fixtures tab
- Fixtures.tsx: default tab shows date >= today || status === 'live'; past completed → Results tab
- getCurrentSeasonYear() from euroleagueApi.ts — test with vi.setSystemTime() (pending PR #163)
- vitest: must import { describe, it, expect, vi } from 'vitest' explicitly
- MatchDetail polling: vi.useFakeTimers() BEFORE render; vi.advanceTimersByTime(15001) works
- LIVE_POLL_INTERVAL = 15000 defined locally in MatchDetail.tsx (not from constants.ts)
- Component tests pattern: vi.mock useNavigate at module level, MemoryRouter wrapper, fireEvent for clicks
- Fixtures.tsx SCROLL_KEY = 'fixtures-scroll-position' (sessionStorage)
- Fixtures.tsx: today/yesterday/tomorrow detection via getFullYear/getMonth/getDate in local timezone
- App.tsx: LeagueSelector + Fixtures/LeagueTable — wrap in MemoryRouter for testing
- App.tsx keyboard nav: handleTabListKeyDown on tablist div; ArrowLeft/Right/Home/End; tabIndex roving pattern
- TabKeyboard.test.tsx: role='tablist' + onKeyDown; fireEvent.keyDown(tablist, { key: 'ArrowRight' })
- TeamView.tsx: useParams (teamName), useNavigate, Link — wrap in MemoryRouter with Route path="/team/:teamName"
- TeamView.tsx: auto-refresh every 5 min via setInterval; vi.useFakeTimers() ONLY in auto-refresh test (not beforeEach — breaks waitFor)
- TeamView.tsx: mock Fixtures as stub to avoid dependency chain; mock dataProvider + teamStorage
- TeamView.tsx: decodes URL-encoded teamName via decodeURIComponent
- LeagueConfig: now has playoffPositions and relegationPositions fields (added PR #184)
- LeagueTable: accepts playoffPositions and relegationPositions props (defaults: 4/2); legend is dynamic
- EuroLeague: playoffPositions=8, relegationPositions=0 (not 4/2)
- EuroCup: playoffPositions=8, relegationPositions=0 (not 4/2)
- Fixtures.tsx: now accepts followedTeamName?: string prop (added PR #185, not on main yet)
- App.tsx: passes followedTeam?.name to Fixtures component (added PR #185, not on main yet)
- matchInvolvesTeam() imported in Fixtures.tsx from ../services/teamStorage (case-insensitive name match)
- Fixtures.tsx: now accepts lastRefreshed?: Date | null prop (added PR TBD 2026-05-13)
- App.tsx: tracks lastRefreshed state, sets after successful fetchAllData and handleRetry
- Fixtures.tsx: renders "Updated HH:MM" as aria-live=polite; shown even in empty-matches state
- Fixtures.lastRefreshed.test.tsx: component tests for lastRefreshed prop (4 tests, requires MemoryRouter)
- IMPORTANT: Fixtures.tsx early return for matches.length===0 must include lastRefreshed display (done in TBD PR)
- Fixtures.tsx formatLastRefreshed must be defined BEFORE the loading/empty early returns

## Deps Update Notes (2026-05-06)
- BLOCKED: package-lock.json is a protected file — deps PR cannot be created
- Major version bumps NOT applied: @eslint/js 10.x, eslint 10.x, globals 17.x, jsdom 29.x, typescript 6.x, vite 8.x, @vitejs/plugin-react 6.x
