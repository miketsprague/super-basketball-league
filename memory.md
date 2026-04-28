# Repo Assist Memory

## Last Updated
2026-04-28T06:44:00Z

## Last Run Tasks
- Task 10: Added PWA manifest (public/manifest.json, public/basketball.svg, index.html), branch repo-assist/improve-pwa-manifest-2637d16, 81/81 tests, build clean
- Task 11: Updated Monthly Activity 2026-04 issue (#94)

## Issue Backlog Cursor
Last processed: #148 (all non-automated open issues covered)

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
- The `create_pull_request` tool creates a proxy issue instead of an actual PR
- Proxy issues contain a "Click here to create the pull request" link with the branch
- Maintainer can click the link in proxy issues to create PRs manually
- Fix: Settings → Actions → General → enable "Allow GitHub Actions to create and approve pull requests"

## Branches Ready for PR (code complete, awaiting maintainer to create PR)
- `repo-assist/improve-pwa-manifest-2637d16` — PWA manifest + basketball icon + index.html meta — 81/81 tests
- `repo-assist/fix-issue-145-architecture-docs-94a92a011ae44981` — ARCHITECTURE.md docs fix (closes #145) — 81/81 tests
- `repo-assist/fix-issue-101-euroleague-season-year-63610fbef8098669` — EuroLeague season year fix (closes #101, #115) — 87/87 tests
- `repo-assist/test-app-component-e5f391db7e4e99e1` — App component tests (15 tests) (closes #116) — 87/87 tests
- `repo-assist/improve-component-tests-leagueselector-leaguetable-ec8838853a183df0` — LeagueSelector/LeagueTable tests (33 tests) (closes #118) — 114/114 tests
- `repo-assist/improve-component-tests-errorboundary-teamview-99c1e151de4bc764` — ErrorBoundary/TeamView tests (31 tests) (closes #121) — 112/112 tests
- `repo-assist/improve-component-tests-fixtures-2637d16-09d3a24a34c80364` — Fixtures tests (33 tests) (closes #124) — 114/114 tests
- `repo-assist/improve-component-tests-matchdetail-815058ea8b7f5927` — MatchDetail tests (38 tests) (closes #126) — 119/119 tests
- `repo-assist/improve-polling-constants-refactor-b91abe1986e9c547` — polling constants refactor (closes #128, #136) — 81/81 tests

## Monthly Activity Summary
- Issue #94: [Repo Assist] Monthly Activity 2026-04 — open, updated 2026-04-28

## Recent Maintainer Activity
- 2026-04-16: maintainer committed "fix: regenerate agentic workflow lock files" — gh-aw upgrade done
- NOTE: Despite the fix, GitHub Actions still cannot create PRs (separate settings permission needed)

## Current Repo State
- npm vulnerabilities: **0** (all fixed)
- Tests: **81** passing on main (component tests in pending branches add up to ~152 more)
- Open issues: ~50 (including daily status reports and Repo Assist proposals/PR-proxy issues)
- Open PRs: 1 (#99 docs for create_pull_request fix - DRAFT)

## Duplicate issues to close (maintainer task)
- #115, #116, #118, #120, #123, #124, #126, #128, #130, #131, #132, #133, #135, #136 — older versions superseded by #140–#143, #137, #138, #121

## Fix Attempts
- 2026-03-03 to 2026-03-31: Security vulnerability fix — MERGED as PR #91 (maintainer did it)
- 2026-03-09 to 2026-03-31: dataProvider.ts tests — MERGED as PR #92 (maintainer did it)
- 2026-03-28 to 2026-04-02: Match detail perf fix — MERGED as PR #97 (Copilot coding agent did it)
- 2026-04-17+: EuroLeague season year fix — branches ready, awaiting PR creation
- 2026-04-18+: All component tests — branches ready, awaiting PR creation
- 2026-04-22+: Polling constants refactor — branch ready, awaiting PR creation
- 2026-04-27+: ARCHITECTURE.md docs fix — branch ready, proxy issue #147 with PR link
- 2026-04-28+: PWA manifest — branch ready, awaiting PR creation

## Improvement Ideas
- dataProvider.ts tests — DONE: merged as PR #92
- Security vulnerabilities — DONE: merged as PR #91
- Match detail perf fix — DONE: merged as PR #97
- EuroLeague season year hardcoding — branch ready, awaiting PR creation (issue #140)
- App component tests — branch ready, awaiting PR creation (issue #142)
- LeagueSelector + LeagueTable tests — branch ready, awaiting PR creation (issue #143)
- ErrorBoundary + TeamView tests — branch ready, awaiting PR creation (issue #121)
- Fixtures component tests — branch ready, awaiting PR creation (issue #137)
- MatchDetail component tests — branch ready, awaiting PR creation (issue #138)
- Polling interval constants — branch ready, awaiting PR creation (issue #141)
- ARCHITECTURE.md docs fix — DONE: branch + proxy issue #147 (issue #145)
- PWA manifest — DONE: branch repo-assist/improve-pwa-manifest-2637d16 (2026-04-28)
- Deps update (minor/patch) — next priority AFTER permission issue resolved
- Service worker/offline support — possible future task (follow-on to PWA manifest)

## Notes
- `create_pull_request` tool creates proxy issues not real PRs — GitHub Actions permission limitation
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
- NOTE: POLL_INTERVAL_MS and LIVE_POLL_INTERVAL_MS are now exported from src/constants.ts (added 2026-04-22) — in pending branch only
- npm outdated shows only major version bumps available for direct deps; all minor/patch are current
- ARCHITECTURE.md docs fix done: components/hooks/teamStorage/futureWork all corrected
- PWA manifest: public/manifest.json and public/basketball.svg added; index.html uses %BASE_URL% for paths

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
- 2026-04-22T06:09: Task 10 (polling interval constants refactor), Task 11
- 2026-04-23T06:17: Task 2/5 (submitted 4 PRs from pending branches), Task 11
- 2026-04-24T06:21: Task 2/5 (created 4 PRs from remaining branches → created issues), Task 11
- 2026-04-25T05:58: Task 2/5 (attempted 4 PRs → created issues), Task 7 (labeling), Task 11
- 2026-04-26T06:20: Task 7 (labeling #128 refactor, #115 bug), Task 10 (docs issue), Task 11
- 2026-04-27T06:41: Task 10 (ARCHITECTURE.md fix, branch+PR), Task 11
- 2026-04-28T06:44: Task 10 (PWA manifest: manifest.json, basketball.svg, index.html meta), Task 11
- Next run should prioritise: Task 1 (any new issues), Task 6 (stale PR nudge if #99 still open), Task 9 (new contributors?), Task 11
