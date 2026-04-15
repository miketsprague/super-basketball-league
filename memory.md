# Repo Assist Memory

## Last Updated
2026-04-15T23:09:00Z

## Last Run Tasks
- Task 2: Re-implemented EuroLeague season year fix on branch `repo-assist/fix-issue-101-euroleague-season-year` (`getCurrentSeasonYear()` replaces hardcoded `'2025'`; exported + 6 new tests; 87/87 tests pass, lint + build clean) — `create_pull_request` still broken (51st consecutive failure)
- Task 1: Commented on #101 with fix summary, test status, and branch name for maintainer review
- Task 11: Updated Monthly Activity 2026-04 issue (#94)

## Issue Backlog Cursor
Last processed: #113 (all non-automated open issues covered: #7, #98, #101)

## Comments Made
- #7 (2026-03-03): Native Swift iOS app — feasibility overview and suggested approach
- #98 (2026-04-02): create_pull_request investigation — root cause (gh-aw v0.50.6 bug) and fix (gh aw upgrade)
- #101 (2026-04-15): Fix summary, test status, branch name for maintainer review

## Issues Without Repo Assist Comments
(none — all current non-automated issues either have comments or were filed by Repo Assist)

## Open PRs (non-Repo Assist)
- #99: "docs: investigate create_pull_request MCP tool error" (Copilot coding agent, DRAFT) — documents fix in KNOWN_ISSUES.md

## Open Repo Assist PRs
(none — create_pull_request MCP tool broken for 51+ consecutive runs)

## Monthly Activity Summary
- Issue #94: [Repo Assist] Monthly Activity 2026-04 — open, updated this run

## Recent Maintainer Activity (2026-04-15)
- Issue #113: Daily Status Report — 15 April 2026 (auto-generated)
- No new maintainer comments or PRs since 2026-04-07

## Current Repo State
- npm vulnerabilities: **0** (all fixed)
- Tests: **81** passing on main; **87** passing on EuroLeague season year fix branch
- Open issues: 17 (#113, #112, #111, #110, #109, #108, #107, #106, #105, #104, #103, #102, #101, #100, #98, #94, #7)
- Open PRs: 1 (#99 docs for create_pull_request fix - DRAFT)

## Local Branches (need recreation each run — fresh runners don't persist)
- EuroLeague season year fix: `repo-assist/fix-issue-101-euroleague-season-year`
  - Replaced `CURRENT_SEASON_YEAR = '2025'` with exported `getCurrentSeasonYear()` (auto-derives: month>=10 ? year : year-1)
  - Added 6 tests covering season boundaries (87/87 pass), lint clean, build clean

## Pending Branches (need to be recreated + PR when tool fixed)
- EuroLeague season year fix: 87 tests (81 pre-existing + 6 new), lint + build clean
- Polling interval constant: 81/81 pass, lint + build clean
- LeagueSelector component tests: 17 tests, 98/98 pass
- MatchDetail component tests: 25 tests, 106/106 pass
- Fixtures component tests: 28 tests, 109/109 pass
- LeagueTable component tests: 15 tests, 96/96 pass
- ErrorBoundary + TeamView component tests: 28 tests, 109/109 pass
- Deps update: indirect dep updates only, 81/81 pass

## Fix Attempts
- 2026-03-03 to 2026-03-31: Security vulnerability fix — MERGED as PR #91 (maintainer did it)
- 2026-03-09 to 2026-03-31: dataProvider.ts tests — MERGED as PR #92 (maintainer did it)
- 2026-03-28 to 2026-04-02: Match detail perf fix — MERGED as PR #97 (Copilot coding agent did it) ✅
- 2026-04-02 to 2026-04-15: Deps update — recreated each run, PR creation still broken
- 2026-04-03 to 2026-04-15: EuroLeague season year fix — recreated each run, PR creation still broken (issue #101)
- 2026-04-06 to 2026-04-15: LeagueTable component tests — recreated each run, PR creation still broken
- 2026-04-07 to 2026-04-15: Polling interval constant — recreated each run, PR creation still broken
- 2026-04-10: Fixtures component tests — created, PR creation still broken
- 2026-04-11: MatchDetail component tests (25 tests) — created, PR creation still broken
- 2026-04-12: LeagueSelector component tests (17 tests) — created, PR creation still broken
- 2026-04-13: ErrorBoundary + TeamView component tests (28 tests) — created, PR creation still broken

## Improvement Ideas
- dataProvider.ts tests — DONE: merged as PR #92
- Security vulnerabilities — DONE: merged as PR #91
- Match detail perf fix — DONE: merged as PR #97
- Deps update (minor/patch) — PENDING: branch ready, PR creation broken
- EuroLeague season year hardcoding — PENDING: branch ready (87/87 pass), PR blocked (issue #101), commented on issue
- Polling interval constant — PENDING: branch ready (81/81 pass), PR creation blocked
- All component tests (LeagueSelector, LeagueTable, Fixtures, MatchDetail, ErrorBoundary, TeamView) — PENDING: all branches ready, PR creation blocked

## Notes
- `create_pull_request` MCP tool returns "context is not defined" consistently (runs: 2026-03-03 through 2026-04-15, 51+ runs)
- `push_to_pull_request_branch` also returns "context is not defined" (confirmed 2026-04-15)
- Root cause: repo-assist.lock.yml pinned to gh-aw v0.50.6 (schema v1) — known bug, fix: `gh aw upgrade`
- PR #99 documents this fix in KNOWN_ISSUES.md
- `update_issue` max 1 per run — use `add_comment` for additional issue updates
- `add_comment` appears to work reliably
- `create_issue` appears to work reliably
- `add_labels` appears to work reliably
- Issue #7 (iOS app request) is the only long-running user issue; no new human comments since last engagement (2026-03-04)
- Tests: 81 passing on main; 87 passing on EuroLeague fix branch
- NOTE: env var `VITE_USE_MOCK_FALLBACK` is evaluated at module load time in dataProvider.ts — vi.stubEnv won't work in tests for this flag
- NOTE: Match.homeTeam and Match.awayTeam are Team objects (not strings): { id, name, shortName, logo? }
- NOTE: StandingsEntry.team is a Team object; also has pointsFor, pointsAgainst, pointsDifference fields
- NOTE: MatchDetails extends Match; has homeStats/awayStats/homePlayers/awayPlayers (not homeTeamStats/awayTeamStats); quarterScores is optional
- NOTE: @testing-library/user-event is NOT installed; use fireEvent from @testing-library/react for click interactions
- NOTE: Fixtures.tsx uses useNavigate + useSearchParams from react-router-dom; mock useNavigate, wrap in MemoryRouter for tests
- NOTE: Fixtures tests use vi.setSystemTime(new Date('2026-04-10T12:00:00.000Z')) to fix "today" for stable date assertions
- NOTE: MatchDetail.tsx uses useParams, useNavigate, useSearchParams — wrap in MemoryRouter with Routes for tests
- NOTE: MatchDetail renders skeleton with animate-pulse class during loading
- NOTE: LeagueSelector.tsx uses useNavigate — mock it; wrap in MemoryRouter for tests
- NOTE: getCurrentSeasonYear() is exported from euroleagueApi.ts — test with vi.setSystemTime()
- Daily status report issues are auto-closed by maintainer; labelled `report`, `daily-status`
- Issue #108 has incorrect label 'report daily-status' (two labels merged); can't remove with safeoutputs (not in allowed list)
- Branch `fix/show-all-fixtures` exists on origin (pushed Jan 18 2026, no PR, 1 commit by miketsprague); content already incorporated into main; stale branch
- App.tsx uses `?league=` URL param for home page; Fixtures.tsx reads it via useSearchParams
- Fixtures.tsx handleMatchClick already passes `?league=` param to match detail route (merged PR #97)
- IMPORTANT: vitest test files must import { describe, it, expect, vi, ... } from 'vitest' explicitly (not globals) — tsconfig.app.json does not include vitest types
- npm outdated shows only major version bumps available for direct deps; all minor/patch are current
- All npm vulnerabilities: 0

## Remaining Major Version Updates (deferred — may have breaking changes)
- eslint: 9.39.4 → 10.2.0
- @eslint/js: 9.39.4 → 10.0.1
- @types/node: 24.12.2 → 25.5.2
- globals: 16.5.0 → 17.4.0
- jsdom: 27.4.0 → 29.0.2
- typescript: 5.9.3 → 6.0.2
- vite: 7.3.2 → 8.0.8
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
- 2026-04-09T23:04: Task 2 (EuroLeague fix), Task 3 (LeagueTable tests), Task 4 (deps update 20260409), Task 10 (polling interval constant), Task 11
- 2026-04-10T22:59: Task 3 (Fixtures component tests, 28 tests), Task 2 (EuroLeague fix), Task 11
- 2026-04-11T22:55: Task 2 (EuroLeague fix, 81/81 pass), Task 3 (MatchDetail component tests, 25 tests, 106/106 pass), Task 11
- 2026-04-12T22:57: Task 3 (LeagueSelector component tests, 17 tests, 98/98 pass), Task 2 (EuroLeague fix), Task 11
- 2026-04-13T23:09: Task 3 (ErrorBoundary + TeamView component tests, 28 tests, 109/109 pass), Task 2 (EuroLeague fix), Task 11
- 2026-04-14T23:07: Task 2 (EuroLeague fix with 6 new tests, 87/87 pass), Task 3 (polling interval constant, 81/81 pass), Task 11
- 2026-04-15T23:09: Task 2 (EuroLeague fix, 87/87 pass), Task 1 (commented on #101), Task 11
- Next run should prioritise: Task 3/10 (new improvement — accessibility, App.tsx tests, or API caching), Task 4 (deps update), Task 7 (labeling check)
