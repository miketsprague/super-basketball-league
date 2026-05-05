# Repo Assist Memory

## Last Updated
2026-05-05T06:28:00Z

## Last Run Tasks
- Task 3: Submitted component tests PR (ErrorBoundary, LeagueSelector, LeagueTable — 104 tests, 23 new)
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
- #168: feat: team logos + W% in LeagueTable — 81 tests ✅
- #169: feat: ARIA tab roles and panel ids — 81 tests ✅
- (new): test: component tests ErrorBoundary/LeagueSelector/LeagueTable — 104 tests ✅ — branch repo-assist/improve-component-tests-2026-05-05

## Open Non-Repo-Assist PRs
- #99: stale Copilot docs PR (nudged twice, Apr 19 + May 4)

## PR Creation Status
- PR creation IS WORKING
- PRs from 2026-05-03: #163, #164, #165, #166
- PRs from 2026-05-04: #168, #169
- PRs from 2026-05-05: component tests (# TBD)

## Proxy Issues to Close (when maintainer is ready)
#115, #116, #118, #120, #121, #123, #124, #126, #128, #130, #131, #132, #133, #135, #136, #137, #138, #140, #141, #142, #143, #147, #149, #151, #153, #155, #158, #159, #160, #161

## Branches Ready for PR (remaining)
- repo-assist/improve-component-tests-fixtures — Fixtures tests (complex: useNavigate + useSearchParams + MemoryRouter)
- repo-assist/improve-component-tests-matchdetail — MatchDetail tests (complex: useParams + polling + timers)
- repo-assist/test-app-component — App component tests (MemoryRouter + Routes)

## Monthly Activity Summary
- Issue #156: [Repo Assist] Monthly Activity 2026-05 — OPEN

## Current Repo State
- npm vulnerabilities: 0
- Tests: 81 passing on main; component tests branch has 104 (23 new)
- Baseline main: 81 tests (5 test files, all service layer)
- euroleague fix branch (#163): 87 tests

## Component Tests Added (new in 2026-05-05 PR)
- src/components/__tests__/ErrorBoundary.test.tsx — 6 tests
- src/components/__tests__/LeagueSelector.test.tsx — 8 tests
- src/components/__tests__/LeagueTable.test.tsx — 9 tests
- Pattern: MemoryRouter wrapper, mock useNavigate, mock console.error for ErrorBoundary

## Round-Robin Task Schedule
- 2026-04-29T06:37: Task 7 (labelled #147), Task 10 (LeagueTable logos + W%), Task 11
- 2026-04-30T06:43: Task 7 (labelled #151), Task 10 (ARIA tab accessibility), Task 11
- 2026-05-01T06:44: Task 10 (Tab URL persistence), Task 11
- 2026-05-02T06:30: Task 2/3/5 (prepared 4 PR branches), Task 11
- 2026-05-03T06:38: Task 2/3 (submitted 4 real PRs), Task 11
- 2026-05-04T06:54: Task 3 (2 more PRs), Task 6 (nudge #99), Task 11
- 2026-05-05T06:28: Task 3 (component tests PR), Task 11
- Next: Task 4 (deps check), Task 9 (welcome check), Task 3 (Fixtures/MatchDetail/App tests)

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
- POLL_INTERVAL_MS and LIVE_POLL_INTERVAL_MS in src/constants.ts
- LeagueTable (PR #168): team logos 20x20px aria-hidden, W% column desktop-only
- ARIA tab accessibility (PR #169): App.tsx nav has tablist/tab/aria-selected/tabpanel/aria-labelledby
- Component tests pattern: vi.mock useNavigate at module level, MemoryRouter wrapper, fireEvent for clicks
