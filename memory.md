# Repo Assist Memory

## Last Updated
2026-04-25T05:58:00Z

## Last Run Tasks
- Task 2/5: Attempted PR creation for 4 branches (EuroLeague fix, polling constants, App tests, LeagueSelector/LeagueTable tests) — all created as issues due to permissions
- Task 7: Labelled #135 (bug), #136 (refactor), #137 (enhancement), #138 (enhancement)
- Task 11: Updated Monthly Activity 2026-04 issue (#94)

## Issue Backlog Cursor
Last processed: #139 (all non-automated open issues covered: #7, #98, #101)

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

## KEY ISSUE: GitHub Actions cannot create PRs
- The `create_pull_request` tool creates issues with "Click to create PR" links instead of actual PRs
- This is because "Allow GitHub Actions to create and approve pull requests" is NOT enabled in repo settings
- **DO NOT call create_pull_request again** until the maintainer enables this setting
- Each call creates a new branch (with suffix) and a new issue — this creates noise
- Issues #135–#138 (from 2026-04-24 run) + ~4 more (from 2026-04-25 run) are PR-proxy issues
- Maintainer can click links in these issues to create PRs manually

## Branches Ready for PR (code complete, awaiting maintainer to create PR)
- `repo-assist/fix-issue-101-euroleague-season-year-63610fbef8098669` — EuroLeague season year fix (closes #101, #115) — 87/87 tests
- `repo-assist/test-app-component-e5f391db7e4e99e1` — App component tests (15 tests) (closes #116) — 87/87 tests
- `repo-assist/improve-component-tests-leagueselector-leaguetable-ec8838853a183df0` — LeagueSelector/LeagueTable tests (33 tests) (closes #118) — 114/114 tests
- `repo-assist/improve-component-tests-errorboundary-teamview-99c1e151de4bc764` — ErrorBoundary/TeamView tests (31 tests) (closes #121) — 112/112 tests
- `repo-assist/improve-component-tests-fixtures-2637d16-09d3a24a34c80364` — Fixtures tests (33 tests) (closes #124) — 114/114 tests
- `repo-assist/improve-component-tests-matchdetail-815058ea8b7f5927` — MatchDetail tests (38 tests) (closes #126) — 119/119 tests
- `repo-assist/improve-polling-constants-refactor-b91abe1986e9c547` — polling constants refactor (closes #128, #136) — 81/81 tests

## Monthly Activity Summary
- Issue #94: [Repo Assist] Monthly Activity 2026-04 — open, updated 2026-04-25

## Recent Maintainer Activity
- 2026-04-16: maintainer committed "fix: regenerate agentic workflow lock files" — gh-aw upgrade done
- NOTE: Despite the fix, GitHub Actions still cannot create PRs (separate settings permission needed)

## Current Repo State
- npm vulnerabilities: **0** (all fixed)
- Tests: **81** passing on main (component tests in pending branches add up to ~152 more)
- Open issues: ~35+ (including daily status reports and Repo Assist proposals/PR-proxy issues)
- Open PRs: 1 (#99 docs for create_pull_request fix - DRAFT)
- **create_pull_request tool creates issues (not PRs)** — GitHub Actions lacks permission to create PRs

## Duplicate issues to close (maintainer task)
- #120 (dup of #121 — both ErrorBoundary/TeamView tests)
- #123 (dup of #124 — both Fixtures tests)
- #130 (dup of EuroLeague fix)
- #131 (dup of App tests)
- #132 (dup of LeagueSelector tests)
- #133 (dup of ErrorBoundary/TeamView tests)
- Plus ~4 more from 2026-04-25 run (unknown numbers)

## Fix Attempts
- 2026-03-03 to 2026-03-31: Security vulnerability fix — MERGED as PR #91 (maintainer did it)
- 2026-03-09 to 2026-03-31: dataProvider.ts tests — MERGED as PR #92 (maintainer did it)
- 2026-03-28 to 2026-04-02: Match detail perf fix — MERGED as PR #97 (Copilot coding agent did it)
- 2026-04-17+: EuroLeague season year fix — branches ready, awaiting PR creation
- 2026-04-18+: All component tests — branches ready, awaiting PR creation
- 2026-04-22+: Polling constants refactor — branch ready, awaiting PR creation

## Improvement Ideas
- dataProvider.ts tests — DONE: merged as PR #92
- Security vulnerabilities — DONE: merged as PR #91
- Match detail perf fix — DONE: merged as PR #97
- EuroLeague season year hardcoding — branch ready, awaiting PR creation
- App component tests — branch ready, awaiting PR creation
- LeagueSelector + LeagueTable tests — branch ready, awaiting PR creation
- ErrorBoundary + TeamView tests — branch ready, awaiting PR creation
- Fixtures component tests — branch ready, awaiting PR creation
- MatchDetail component tests — branch ready, awaiting PR creation
- Polling interval constants — branch ready, awaiting PR creation
- Deps update (minor/patch) — next priority AFTER permission issue resolved

## Notes
- `create_pull_request` tool creates issues NOT PRs — needs GitHub Actions PR creation permission
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
- NOTE: Fixtures.tsx: mock useNavigate from react-router-dom; wrap in MemoryRouter; use vi.useFakeTimers() + vi.setSystemTime() for date-based filtering
- NOTE: MatchDetail.tsx polling tests: use vi.useFakeTimers() BEFORE render, then use vi.runAllTimersAsync() + vi.advanceTimersByTimeAsync() inside act() — do NOT use waitFor with fake timers (causes timeout)
- NOTE: POLL_INTERVAL_MS and LIVE_POLL_INTERVAL_MS are now exported from src/constants.ts (added 2026-04-22)
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
- 2026-04-20T06:29: Task 3 (Fixtures tests, 33 tests, 114/114 pass), Task 11
- 2026-04-21T06:13: Task 3 (MatchDetail tests, 38 tests, 119/119 pass), Task 11
- 2026-04-22T06:09: Task 10 (polling interval constants refactor), Task 11
- 2026-04-23T06:17: Task 2/5 (submitted 4 PRs from pending branches), Task 11
- 2026-04-24T06:21: Task 2/5 (created 4 PRs from remaining branches → created issues), Task 11
- 2026-04-25T05:58: Task 2/5 (attempted 4 PRs → created issues), Task 7 (labeling), Task 11
- Next run should prioritise: Task 1 (check new issues), Task 10 (find other improvements since PR creation is blocked), Task 11
