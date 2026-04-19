# Repo Assist Memory

## Last Updated
2026-04-19T06:07:47Z

## Last Run Tasks
- Task 3: Added ErrorBoundary (11 tests) + TeamView (20 tests) component tests on branch `repo-assist/improve-component-tests-errorboundary-teamview` — 112/112 tests pass, lint + build clean — issue #120 created for maintainer to create PR
- Task 6: Nudged stale PR #99 (open since Apr 2, 17 days)
- Task 11: Updated Monthly Activity 2026-04 issue (#94)

## Issue Backlog Cursor
Last processed: #119 (all non-automated open issues covered: #7, #98, #101)

## Comments Made
- #7 (2026-03-03): Native Swift iOS app — feasibility overview and suggested approach
- #98 (2026-04-02): create_pull_request investigation — root cause (gh-aw v0.50.6 bug) and fix (gh aw upgrade)
- #101 (2026-04-15): Fix summary, test status, and branch name for maintainer review
- #101 (2026-04-17): PR submitted confirmation
- #99 (2026-04-19): Stale PR nudge

## Issues Without Repo Assist Comments
(none — all current non-automated issues either have comments or were filed by Repo Assist)

## Open PRs (non-Repo Assist)
- #99: "docs: investigate create_pull_request MCP tool error" (Copilot coding agent, DRAFT) — nudged 2026-04-19

## Pending Repo Assist Branches / Issues
- issue #115: branch `repo-assist/fix-issue-101-euroleague-season-year-63610fbef8098669` — EuroLeague season year fix (Closes #101, 87/87 tests) — awaiting maintainer to click branch link and create PR
- issue #116: branch `repo-assist/test-app-component-e5f391db7e4e99e1` — App component tests (15 tests, 96/96 pass) — awaiting maintainer to click branch link and create PR
- issue #118: branch `repo-assist/improve-component-tests-leagueselector-leaguetable-ec8838853a183df0` — LeagueSelector + LeagueTable tests (33 tests, 114/114) — awaiting maintainer PR creation
- issue #120: branch `repo-assist/improve-component-tests-errorboundary-teamview` — ErrorBoundary + TeamView tests (31 tests, 112/112) — awaiting maintainer PR creation

## Monthly Activity Summary
- Issue #94: [Repo Assist] Monthly Activity 2026-04 — open, updated this run

## Recent Maintainer Activity
- No new maintainer comments or PRs since 2026-04-07

## Current Repo State
- npm vulnerabilities: **0** (all fixed)
- Tests: **81** passing on main (will be 112 after ErrorBoundary+TeamView PR merged)
- Open issues: ~22 (#7, #94, #98, #101, #115, #116, #118, #120, + daily status reports)
- Open PRs: 1 (#99 docs for create_pull_request fix - DRAFT)
- **create_pull_request MCP tool creates issues (not PRs)**: GitHub Actions cannot create/approve PRs — maintainer must enable in Settings → Actions → General

## Fix Attempts
- 2026-03-03 to 2026-03-31: Security vulnerability fix — MERGED as PR #91 (maintainer did it)
- 2026-03-09 to 2026-03-31: dataProvider.ts tests — MERGED as PR #92 (maintainer did it)
- 2026-03-28 to 2026-04-02: Match detail perf fix — MERGED as PR #97 (Copilot coding agent did it)
- 2026-04-17: EuroLeague season year fix — issue #115 (branch pushed, waiting for PR)
- 2026-04-17: App component tests (15 tests) — issue #116 (branch pushed, waiting for PR)
- 2026-04-18: LeagueSelector + LeagueTable tests (33 tests) — issue #118 (branch pushed, waiting for PR)
- 2026-04-19: ErrorBoundary + TeamView tests (31 tests) — issue #120 (branch pushed, waiting for PR)

## Improvement Ideas
- dataProvider.ts tests — DONE: merged as PR #92
- Security vulnerabilities — DONE: merged as PR #91
- Match detail perf fix — DONE: merged as PR #97
- EuroLeague season year hardcoding — PENDING PR (issue #115, branch ready)
- App component tests — PENDING PR (issue #116, branch ready)
- LeagueSelector + LeagueTable tests — PENDING PR (issue #118, branch ready)
- ErrorBoundary + TeamView tests — PENDING PR (issue #120, branch ready)
- Polling interval constant — PENDING: needs fresh branch + PR
- Remaining component tests (Fixtures, MatchDetail) — PENDING

## Notes
- `create_pull_request` MCP tool creates issues instead of PRs — GitHub Actions PR creation is restricted in this repo. Maintainer needs to enable it in Settings → Actions → General, or manually click branch links to create PRs.
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
- NOTE: LeagueTable shows shortName in buttons, uses full name for navigate URL; getByText matches on shortName
- NOTE: getByText on simple numbers (like position '1') will fail if number appears in multiple cells — use getAllByText
- NOTE: TeamView follow button accessible name includes "☆" prefix — use getByText('Follow') / queryByText('Following') instead of getByRole with exact name regex
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
- 2026-04-17T06:13: Task 2 (EuroLeague fix), Task 10/3 (App tests), Task 1 (#101 comment), Task 11
- 2026-04-18T05:49: Task 3 (LeagueSelector + LeagueTable tests), Task 11
- 2026-04-19T06:07: Task 3 (ErrorBoundary + TeamView tests), Task 6 (stale PR nudge #99), Task 11
- Next run should prioritise: Task 3 (Fixtures or MatchDetail tests), Task 10 (polling interval constant PR), Task 4 (check deps)
