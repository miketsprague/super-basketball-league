# Repo Assist Memory

## Last Updated
2026-05-07T06:55:00Z

## Last Run Tasks
- Task 3: MatchDetail component tests PR (29 tests, 110 total)
- Task 1: Commented on #174 (package-lock.json protected-file failure explanation)
- Task 11: Updated Monthly Activity Summary #156

## Issue Backlog Cursor
Last processed: #175 (all non-automated open issues covered)

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
- #169: feat: ARIA tab roles and panel ids — 81 tests ✅
- #171: test: component tests ErrorBoundary/LeagueSelector/LeagueTable — 104 tests ✅
- #173: test: Fixtures component tests (25 tests, 106 total) ✅
- #176: test: MatchDetail component tests (29 tests, 110 total) ✅

## Open Non-Repo-Assist PRs
- #99: stale Copilot docs PR (nudged twice, Apr 19 + May 4)

## PR Creation Status
- PR creation IS WORKING
- IMPORTANT: Deps update PRs are BLOCKED — package-lock.json is a protected file. Will always fail unless `allowed-files` is configured or `protected-files: fallback-to-issue` is set.

## Proxy Issues to Close (when maintainer is ready)
#115, #116, #118, #120, #121, #123, #124, #126, #128, #130, #131, #132, #133, #135, #136, #137, #138, #140, #141, #142, #143, #147, #149, #151, #153, #155, #158, #159, #160, #161

## Monthly Activity Summary
- Issue #156: [Repo Assist] Monthly Activity 2026-05 — OPEN (updated this run)

## Current Repo State
- npm vulnerabilities: 0
- Tests: 81 passing on main; 110 with MatchDetail tests; 106 with Fixtures tests; 104 with ErrorBoundary/LeagueSelector/LeagueTable tests
- Baseline main: 81 tests (5 test files, all service layer)

## Component Tests Added (pending PRs)
- #171 PR: src/components/__tests__/ErrorBoundary.test.tsx — 6 tests
- #171 PR: src/components/__tests__/LeagueSelector.test.tsx — 8 tests
- #171 PR: src/components/__tests__/LeagueTable.test.tsx — 9 tests
- #173 PR: src/components/__tests__/Fixtures.test.tsx — 25 tests
- #176 PR: src/components/__tests__/MatchDetail.test.tsx — 29 tests

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
- Next: Task 3 (App component tests), Task 6 (stale PR check), Task 8 (release check), Task 9 (welcome check)

## Key Code Notes
- VITE_USE_MOCK_FALLBACK evaluated at module load — vi.stubEnv needs vi.resetModules()
- Match.homeTeam/awayTeam are Team objects: { id, name, shortName, logo? }
- StandingsEntry.team is Team object; has pointsFor/Against/Difference
- MatchDetails extends Match; homeStats/awayStats/homePlayers/awayPlayers; quarterScores optional
- @testing-library/user-event NOT installed; use fireEvent
- Fixtures.tsx: useNavigate + useSearchParams — mock useNavigate, wrap in MemoryRouter with initialEntries
- MatchDetail.tsx: useParams, useNavigate, useSearchParams — MemoryRouter with Routes path="/match/:matchId"
- App.tsx: uses Routes (not BrowserRouter) — wrap in MemoryRouter; BrowserRouter in main.tsx
- App.tsx (main): activeTab now in URL param ?tab=table (pending PR #165)
- getCurrentSeasonYear() from euroleagueApi.ts — test with vi.setSystemTime() (pending PR #163)
- vitest: must import { describe, it, expect, vi } from 'vitest' explicitly
- MatchDetail polling: vi.useFakeTimers() BEFORE render; vi.advanceTimersByTime(15001) works
- LIVE_POLL_INTERVAL = 15000 defined locally in MatchDetail.tsx (not from constants.ts)
- Component tests pattern: vi.mock useNavigate at module level, MemoryRouter wrapper, fireEvent for clicks
- Fixtures.tsx SCROLL_KEY = 'fixtures-scroll-position' (sessionStorage)
- Fixtures.tsx: today/yesterday/tomorrow detection via getFullYear/getMonth/getDate in local timezone
- App.tsx: LeagueSelector + Fixtures/LeagueTable — wrap in MemoryRouter for testing

## Deps Update Notes (2026-05-06)
- BLOCKED: package-lock.json is a protected file — deps PR cannot be created
- Major version bumps NOT applied: @eslint/js 10.x, eslint 10.x, globals 17.x, jsdom 29.x, typescript 6.x, vite 8.x, @vitejs/plugin-react 6.x
