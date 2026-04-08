# Repo Assist Memory

## Last Updated
2026-04-08T23:04:28Z

## Last Run Tasks
- Task 4: Recreated deps update branch `repo-assist/deps-update-20260408` (13 minor/patch updates; 81/81 tests pass) — `create_pull_request` still broken (42nd consecutive failure)
- Task 2: Recreated EuroLeague season year fix branch `repo-assist/fix-issue-101-euroleague-season-year` (replace `CURRENT_SEASON_YEAR = '2025'` with `getCurrentSeasonYear()`; 81/81 tests pass) — `create_pull_request` still broken (43rd consecutive failure)
- Task 3: Added LeagueTable component tests on branch `repo-assist/improve-leaguetable-tests` (15 tests, 96/96 tests pass, lint clean) — `create_pull_request` still broken
- Task 11: Updated Monthly Activity 2026-04 issue (#94)

## Issue Backlog Cursor
Last processed: #101 (all non-automated open issues covered: #7, #98, #101)

## Comments Made
- #7 (2026-03-03): Native Swift iOS app — feasibility overview and suggested approach
- #98 (2026-04-02): create_pull_request investigation — root cause (gh-aw v0.50.6 bug) and fix (gh aw upgrade)

## Issues Without Repo Assist Comments
(none — all current non-automated issues either have comments or were filed by Repo Assist)

## Open PRs (non-Repo Assist)
- #99: "docs: investigate create_pull_request MCP tool error" (Copilot coding agent, DRAFT) — documents fix in KNOWN_ISSUES.md

## Open Repo Assist PRs
(none — create_pull_request MCP tool broken for 43+ consecutive runs)

## Monthly Activity Summary
- Issue #94: [Repo Assist] Monthly Activity 2026-04 — open, updated this run

## Recent Maintainer Activity (2026-04-08)
- Issue #106 created: Daily status report (auto-generated)
- No new maintainer comments or PRs since 2026-04-07

## Current Repo State
- npm vulnerabilities: **0** (all fixed)
- Tests: **96** passing (LeagueTable tests branch), **81** passing (main)
- Open issues: 10 (#106, #105, #104, #103, #102 daily status, #101 EuroLeague season year, #100 daily status, #98 create_pull_request, #94 monthly summary, #7 iOS app)
- Open PRs: 1 (#99 docs for create_pull_request fix - DRAFT)

## Local Branches (need recreation each run — fresh runners don't persist)
- EuroLeague season year fix: `repo-assist/fix-issue-101-euroleague-season-year`
  - Replaced `CURRENT_SEASON_YEAR = '2025'` with `getCurrentSeasonYear()` (auto-derives: month>=10 ? year : year-1)
  - 81/81 tests pass, lint clean, build clean
  - Closes #101
- LeagueTable component tests: `repo-assist/improve-leaguetable-tests`
  - Created `src/components/__tests__/LeagueTable.test.tsx` (15 tests)
  - 96/96 tests pass (81 pre-existing + 15 new), lint clean
- Deps update: `repo-assist/deps-update-20260408`
  - Only package-lock.json updated (npm update)
  - Updates: react/react-dom 19.2.5, tailwind 4.2.2, @testing-library/react 16.3.2, @types/node 24.12.2, @types/react 19.2.14, @vitejs/plugin-react 5.2.0, eslint 9.39.4, @eslint/js 9.39.4, react-router-dom 7.14.0, typescript-eslint 8.58.1, vite 7.3.2, vitest 4.1.3
  - 81/81 tests pass, lint clean, build clean

## Fix Attempts
- 2026-03-03 to 2026-03-31: Security vulnerability fix — MERGED as PR #91 (maintainer did it)
- 2026-03-09 to 2026-03-31: dataProvider.ts tests — MERGED as PR #92 (maintainer did it)
- 2026-03-28 to 2026-04-02: Match detail perf fix — MERGED as PR #97 (Copilot coding agent did it) ✅
- 2026-04-02 to 2026-04-08: Deps update — recreated each run, PR creation still broken
- 2026-04-03 to 2026-04-08: EuroLeague season year fix — recreated each run, PR creation still broken (issue #101)
- 2026-04-06 to 2026-04-08: LeagueTable component tests — recreated each run, PR creation still broken
- 2026-04-07: Polling interval constant refactor — DONE but branch not recreated this run

## Improvement Ideas
- dataProvider.ts tests — DONE: merged as PR #92
- Security vulnerabilities — DONE: merged as PR #91
- Match detail perf fix — DONE: merged as PR #97
- Deps update (minor/patch) — PENDING: branch ready, PR creation broken
- EuroLeague season year hardcoding — PENDING: branch ready, PR creation broken (issue #101)
- Component tests (Fixtures, MatchDetail, LeagueSelector) — PENDING
- LeagueTable component tests — PENDING: branch ready (15 tests, 96/96 pass), PR creation blocked
- Polling interval constant — PENDING: need to recreate branch next run (src/constants.ts, POLL_INTERVAL_MS = 5 * 60 * 1000)

## Notes
- `create_pull_request` MCP tool returns "context is not defined" consistently (runs: 2026-03-03 through 2026-04-08, 43+ runs)
- Root cause: repo-assist.lock.yml pinned to gh-aw v0.50.6 (schema v1) — known bug, fix: `gh aw upgrade`
- PR #99 documents this fix in KNOWN_ISSUES.md
- `update_issue` max 1 per run — use `add_comment` for additional issue updates
- `add_comment` appears to work reliably
- `create_issue` appears to work reliably
- `add_labels` appears to work reliably
- Issue #7 (iOS app request) is the only long-running user issue; no new human comments since last engagement (2026-03-04)
- Tests: 81 passing on main; 96 passing on LeagueTable tests branch
- NOTE: env var `VITE_USE_MOCK_FALLBACK` is evaluated at module load time in dataProvider.ts — vi.stubEnv won't work in tests for this flag
- NOTE: Match.homeTeam and Match.awayTeam are Team objects (not strings): { id, name, shortName, logo? }
- NOTE: StandingsEntry.team is a Team object; also has pointsFor, pointsAgainst, pointsDifference fields
- NOTE: MatchDetails extends Match; has homeStats/awayStats/homePlayers/awayPlayers (not homeTeamStats/awayTeamStats); quarterScores is optional
- NOTE: @testing-library/user-event is NOT installed; use fireEvent from @testing-library/react for click interactions
- Daily status report issues are auto-closed by maintainer; labelled `report`, `daily-status`
- Branch `fix/show-all-fixtures` exists on origin (pushed Jan 18 2026, no PR, 1 commit by miketsprague); content already incorporated into main; stale branch
- App.tsx uses `?league=` URL param for home page; Fixtures.tsx reads it via useSearchParams
- Fixtures.tsx handleMatchClick already passes `?league=` param to match detail route (merged PR #97)
- IMPORTANT: vitest test files must import { describe, it, expect, vi, ... } from 'vitest' explicitly (not globals) — tsconfig.app.json does not include vitest types
- `src/constants.ts` created with `POLL_INTERVAL_MS = 5 * 60 * 1000` (5 minutes) — to be committed once PR tool works

## Remaining Major Version Updates (deferred — may have breaking changes)
- eslint: 9.39.4 → 10.2.0
- @eslint/js: 9.39.4 → 10.0.1
- @types/node: 24.12.2 → 25.5.2
- globals: 16.5.0 → 17.4.0
- jsdom: 27.4.0 → 29.0.2
- typescript: 5.9.3 → 6.0.2
- vite: 7.3.2 → 8.0.7
- eslint-plugin-react-refresh: 0.4.26 → 0.5.2
- @vitejs/plugin-react: 5.2.0 → 6.0.1

## Round-Robin Task Schedule
- 2026-04-02T22:54: Task 1 (#98 comment), Task 7 (#98 labels), Task 4 (deps update branch), Task 11
- 2026-04-03T22:56: Task 4 (deps update branch 20260403), Task 3/10 (filed issue #101 EuroLeague season year), Task 11
- 2026-04-04T22:54: Task 2/10 (implemented fix for #101, branch ready), Task 11
- 2026-04-05T22:53: Task 2 (re-implemented fix for #101 on fresh runner), Task 11
- 2026-04-06T23:01: Task 2 (re-implemented fix for #101), Task 3 (LeagueTable component tests), Task 4 (deps update), Task 11
- 2026-04-07T23:05: Task 2/10 (re-implemented fix for #101), Task 10 (polling interval constant), Task 11
- 2026-04-08T23:04: Task 4 (deps update 20260408), Task 2 (EuroLeague fix), Task 3 (LeagueTable tests 15 tests), Task 11
- Next run should prioritise: Task 10 (polling interval constant), Task 3 (Fixtures/LeagueSelector component tests), Task 9 (check new contributors)
