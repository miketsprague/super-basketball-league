# Repo Assist Memory

## Last Updated
2026-04-17T06:13:52Z

## Last Run Tasks
- Task 2: Implemented EuroLeague season year fix on branch `repo-assist/fix-issue-101-euroleague-season-year` — `getCurrentSeasonYear()` replaces hardcoded `'2025'`; exported + 6 new tests; 87/87 tests pass, lint + build clean — **PR CREATED** (create_pull_request NOW WORKING!)
- Task 10/3: Added App component tests (15 tests) on branch `repo-assist/test-app-component` — 96/96 tests pass, lint + build clean — **PR CREATED**
- Task 1: Commented on #101 with PR submitted update
- Task 11: Updated Monthly Activity 2026-04 issue (#94)

## Issue Backlog Cursor
Last processed: #114 (all non-automated open issues covered: #7, #98, #101)

## Comments Made
- #7 (2026-03-03): Native Swift iOS app — feasibility overview and suggested approach
- #98 (2026-04-02): create_pull_request investigation — root cause (gh-aw v0.50.6 bug) and fix (gh aw upgrade)
- #101 (2026-04-15): Fix summary, test status, and branch name for maintainer review
- #101 (2026-04-17): PR submitted confirmation

## Issues Without Repo Assist Comments
(none — all current non-automated issues either have comments or were filed by Repo Assist)

## Open PRs (non-Repo Assist)
- #99: "docs: investigate create_pull_request MCP tool error" (Copilot coding agent, DRAFT) — documents fix in KNOWN_ISSUES.md

## Open Repo Assist PRs
- fix-issue-101-euroleague-season-year: **PR submitted this run** (create_pull_request now working!)
- test-app-component: **PR submitted this run**
- NOTE: PR numbers not yet visible in API (queued for creation at workflow end)

## Monthly Activity Summary
- Issue #94: [Repo Assist] Monthly Activity 2026-04 — open, updated this run

## Recent Maintainer Activity (2026-04-17)
- Issue #114: Daily Status Report — 16 April 2026 (auto-generated)
- No new maintainer comments or PRs since 2026-04-07

## Current Repo State
- npm vulnerabilities: **0** (all fixed)
- Tests: **81** passing on main; **96** passing on App component test branch; **87** on EuroLeague fix branch
- Open issues: 18 (#114, #113, ... #100, #101, #98, #94, #7)
- Open PRs: 1 (#99 docs for create_pull_request fix - DRAFT)
- **create_pull_request MCP tool NOW WORKING** (first success after 51+ failures!)

## Fix Attempts
- 2026-03-03 to 2026-03-31: Security vulnerability fix — MERGED as PR #91 (maintainer did it)
- 2026-03-09 to 2026-03-31: dataProvider.ts tests — MERGED as PR #92 (maintainer did it)
- 2026-03-28 to 2026-04-02: Match detail perf fix — MERGED as PR #97 (Copilot coding agent did it) ✅
- 2026-04-17: EuroLeague season year fix — PR CREATED (first successful PR creation in 51+ runs!)
- 2026-04-17: App component tests (15 tests) — PR CREATED

## Improvement Ideas
- dataProvider.ts tests — DONE: merged as PR #92
- Security vulnerabilities — DONE: merged as PR #91
- Match detail perf fix — DONE: merged as PR #97
- EuroLeague season year hardcoding — PENDING PR review (PR submitted 2026-04-17)
- App component tests — PENDING PR review (PR submitted 2026-04-17)
- Deps update (minor/patch) — PENDING: needs fresh branch + PR (all major version bumps, defer)
- Polling interval constant — PENDING: needs fresh branch + PR
- All component tests (LeagueSelector, LeagueTable, Fixtures, MatchDetail, ErrorBoundary, TeamView) — PENDING: needs fresh branches + PRs

## Notes
- `create_pull_request` MCP tool NOW WORKING as of 2026-04-17 (was broken for 51+ runs)
- `push_to_pull_request_branch` — unknown status, need to test
- `update_issue` max 1 per run — use `add_comment` for additional issue updates
- `add_comment` works reliably
- `create_issue` works reliably
- `add_labels` works reliably
- Issue #7 (iOS app request) is the only long-running user issue; no new human comments since last engagement (2026-03-04)
- Daily status report issues are auto-closed by maintainer; labelled `report`, `daily-status`
- NOTE: env var `VITE_USE_MOCK_FALLBACK` is evaluated at module load time in dataProvider.ts — vi.stubEnv won't work in tests for this flag
- NOTE: Match.homeTeam and Match.awayTeam are Team objects (not strings): { id, name, shortName, logo? }
- NOTE: StandingsEntry.team is a Team object; also has pointsFor, pointsAgainst, pointsDifference fields
- NOTE: MatchDetails extends Match; has homeStats/awayStats/homePlayers/awayPlayers (not homeTeamStats/awayTeamStats); quarterScores is optional
- NOTE: @testing-library/user-event is NOT installed; use fireEvent from @testing-library/react for click interactions
- NOTE: Fixtures.tsx uses useNavigate + useSearchParams from react-router-dom; mock useNavigate, wrap in MemoryRouter for tests
- NOTE: MatchDetail.tsx uses useParams, useNavigate, useSearchParams — wrap in MemoryRouter with Routes for tests
- NOTE: App.tsx uses Routes (not BrowserRouter) — wrap in MemoryRouter for tests; BrowserRouter is in main.tsx
- NOTE: getCurrentSeasonYear() is exported from euroleagueApi.ts — test with vi.setSystemTime()
- NOTE: vitest test files must import { describe, it, expect, vi, ... } from 'vitest' explicitly
- npm outdated shows only major version bumps available for direct deps; all minor/patch are current

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
- 2026-04-17T06:13: Task 2 (EuroLeague fix PR CREATED!), Task 10/3 (App tests PR CREATED!), Task 1 (#101 comment), Task 11
- Next run should prioritise: Task 3 (component tests — LeagueSelector, LeagueTable, Fixtures, MatchDetail, ErrorBoundary, TeamView), Task 10 (polling interval constant PR), Task 4 (deps update if new patch updates available)
