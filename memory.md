# Repo Assist Memory

## Last Updated
2026-05-04T06:54:00Z

## Last Run Tasks
- Task 3: Submitted 2 more PRs (LeagueTable logos+W%, ARIA tab accessibility)
- Task 6: Nudged PR #99 (stale since Apr 2, tooling now fixed)
- Task 11: Updated Monthly Activity Summary #156

## Issue Backlog Cursor
Last processed: #162 (all non-automated open issues covered)

## Comments Made
- #7 (2026-03-03): Native Swift iOS app — feasibility overview
- #98 (2026-04-02): create_pull_request investigation — root cause and fix
- #101 (2026-04-15): Fix summary, test status, and branch name
- #101 (2026-04-17): PR submitted confirmation
- #99 (2026-04-19): Nudge — stale PR, suggested merge or close
- #99 (2026-05-04): Second nudge — tooling now working, suggest merge or close

## Open Repo Assist PRs
- #163: fix: replace hardcoded CURRENT_SEASON_YEAR (Closes #101) — 87 tests ✅
- #164: docs: fix ARCHITECTURE.md (Closes #145) — docs only
- #165: feat: persist active tab in URL — 81 tests ✅
- #166: feat: PWA manifest and basketball icon — 81 tests ✅
- (new): feat: team logos + W% in LeagueTable — 81 tests ✅ — branch improve-leaguetable-logos-winpct-2637d16-47155fe9e9b9d887-new
- (new): feat: ARIA tab roles and panel ids — 81 tests ✅ — branch improve-aria-tab-accessibility-pr

## Open Non-Repo-Assist PRs
- #99: stale Copilot docs PR (nudged twice, Apr 19 + May 4)

## PR Creation Status
- PR creation IS WORKING
- PRs from 2026-05-03: #163, #164, #165, #166
- PRs from 2026-05-04: numbers TBD (submitted as improve-leaguetable... and improve-aria...)

## Proxy Issues to Close (when maintainer is ready)
#115, #116, #118, #120, #121, #123, #124, #126, #128, #130, #131, #132, #133, #135, #136, #137, #138, #140, #141, #142, #143, #147, #149, #151, #153, #155, #158, #159, #160, #161

## Branches Ready for PR (remaining)
- repo-assist/improve-component-tests-errorboundary-teamview-99c1e151de4bc764 — ErrorBoundary/TeamView tests
- repo-assist/improve-component-tests-fixtures-2637d16-09d3a24a34c80364 — Fixtures tests
- repo-assist/improve-component-tests-leagueselector-leaguetable-ec8838853a183df0 — LeagueSelector/LeagueTable tests
- repo-assist/improve-component-tests-matchdetail-815058ea8b7f5927 — MatchDetail tests
- repo-assist/improve-polling-constants-refactor-b91abe1986e9c547 — polling constants refactor
- repo-assist/test-app-component-e5f391db7e4e99e1 — App component tests

## Monthly Activity Summary
- Issue #156: [Repo Assist] Monthly Activity 2026-05 — OPEN

## Current Repo State
- npm vulnerabilities: 0
- Tests: 81 passing on main (fix #163 branch adds 6 more euroleague tests = 87)

## Round-Robin Task Schedule
- 2026-04-29T06:37: Task 7 (labelled #147), Task 10 (LeagueTable logos + W%), Task 11
- 2026-04-30T06:43: Task 7 (labelled #151), Task 10 (ARIA tab accessibility), Task 11
- 2026-05-01T06:44: Task 10 (Tab URL persistence), Task 11
- 2026-05-02T06:30: Task 2/3/5 (prepared 4 PR branches), Task 11
- 2026-05-03T06:38: Task 2/3 (submitted 4 real PRs), Task 11
- 2026-05-04T06:54: Task 3 (2 more PRs), Task 6 (nudge #99), Task 11
- Next: Task 3 (more PRs from remaining branches), Task 4 (deps check), Task 9 (welcome check)

## Key Code Notes
- VITE_USE_MOCK_FALLBACK evaluated at module load — vi.stubEnv needs vi.resetModules()
- Match.homeTeam/awayTeam are Team objects: { id, name, shortName, logo? }
- StandingsEntry.team is Team object; has pointsFor/Against/Difference
- MatchDetails extends Match; homeStats/awayStats/homePlayers/awayPlayers; quarterScores optional
- @testing-library/user-event NOT installed; use fireEvent
- Fixtures.tsx: useNavigate + useSearchParams — mock useNavigate, wrap in MemoryRouter
- MatchDetail.tsx: useParams, useNavigate, useSearchParams — MemoryRouter with Routes
- App.tsx: uses Routes (not BrowserRouter) — wrap in MemoryRouter; BrowserRouter in main.tsx
- App.tsx (main): activeTab now in URL param ?tab=table (pending PR #165)
- getCurrentSeasonYear() from euroleagueApi.ts — test with vi.setSystemTime() (pending PR #163)
- vitest: must import { describe, it, expect, vi } from 'vitest' explicitly
- MatchDetail polling: vi.useFakeTimers() BEFORE render; vi.runAllTimersAsync() in act()
- POLL_INTERVAL_MS and LIVE_POLL_INTERVAL_MS in src/constants.ts (pending branch)
- LeagueTable (PR submitted): team logos 20x20px aria-hidden, W% column desktop-only
- ARIA tab accessibility (PR submitted): App.tsx nav has tablist/tab/aria-selected/tabpanel/aria-labelledby
