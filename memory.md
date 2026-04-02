# Repo Assist Memory

## Last Updated
2026-04-02T22:54:00Z

## Last Run Tasks
- Task 1: Commented on #98 (create_pull_request investigation) — explained root cause and fix
- Task 7: Labelled #98 with `bug`, `needs investigation`
- Task 4: Prepared deps update branch `repo-assist/deps-update-20260402` (10 minor/patch dep updates, 81/81 tests pass, build clean) — `create_pull_request` still broken (36th failure)
- Task 11: Updated Monthly Activity 2026-04 issue (#94)

## Issue Backlog Cursor
Last processed: #98 (processed all open non-automated issues: #7, #98)

## Comments Made
- #7 (2026-03-03): Native Swift iOS app — feasibility overview and suggested approach
- #98 (2026-04-02): create_pull_request investigation — root cause (gh-aw v0.50.6 bug) and fix (gh aw upgrade)

## Issues Without Repo Assist Comments
(none — all non-automated open issues have been commented on)

## Open PRs (non-Repo Assist)
- #99: "docs: investigate create_pull_request MCP tool error" (Copilot coding agent, DRAFT) — documents fix in KNOWN_ISSUES.md

## Open Repo Assist PRs
(none — create_pull_request MCP tool broken for 36+ consecutive runs)

## Monthly Activity Summary
- Issue #94: [Repo Assist] Monthly Activity 2026-04 — open, updated this run

## Recent Maintainer Activity (2026-04-02)
- Issue #98 created: Investigate mcp create_pull_request tool errors
- PR #99 created by Copilot coding agent: docs investigation of create_pull_request bug
- PR #97 merged: "perf: pass league context to match detail via query param" (match detail perf fix — NOW IN MAIN)
- Branch `repo-assist/improve-match-detail-league-context-20260401` cleaned up by maintainer (fix already in main as PR #97)

## Current Repo State
- npm vulnerabilities: **0** (all fixed)
- Tests: **81** passing
- Open issues: 3 (#94 monthly summary, #98 create_pull_request investigation, #7 iOS app request)
- Open PRs: 1 (#99 docs for create_pull_request fix - DRAFT)
- Match detail perf fix: MERGED as PR #97 ✅
- Deps update: branch `repo-assist/deps-update-20260402` ready (can't PR due to tool bug)

## Local Branches Ready (awaiting PR creation tool fix)
- Deps update: `repo-assist/deps-update-20260402`
  - Updated 10 packages to latest minor/patch: react, react-dom, react-router-dom, tailwindcss, @tailwindcss/vite, @testing-library/react, @types/react, typescript-eslint, vitest, @vitejs/plugin-react
  - 81/81 tests pass, lint clean, build clean

## Fix Attempts
- 2026-03-03 to 2026-03-31: Security vulnerability fix — MERGED as PR #91 (maintainer did it)
- 2026-03-09 to 2026-03-31: dataProvider.ts tests — MERGED as PR #92 (maintainer did it)
- 2026-03-28 to 2026-04-02: Match detail perf fix — MERGED as PR #97 (Copilot coding agent did it) ✅
- 2026-04-02: Deps update — local branch ready, PR creation still broken

## Improvement Ideas
- dataProvider.ts tests — DONE: merged as PR #92
- Security vulnerabilities — DONE: merged as PR #91
- Match detail perf fix — DONE: merged as PR #97
- Deps update (minor/patch) — PENDING: branch ready, PR creation broken

## Notes
- `create_pull_request` MCP tool returns "context is not defined" consistently (runs: 2026-03-03 through 2026-04-02, 36+ runs)
- Root cause: repo-assist.lock.yml pinned to gh-aw v0.50.6 (schema v1) — known bug, fix: `gh aw upgrade`
- PR #99 documents this fix in KNOWN_ISSUES.md
- `update_issue` max 1 per run — use `add_comment` for additional issue updates
- `add_comment` appears to work reliably
- `create_issue` appears to work reliably
- `add_labels` appears to work reliably
- Issue #7 (iOS app request) is the only non-automated open user issue; no new human comments since last engagement (2026-03-04)
- Tests: 81 passing on main (after PRs #91, #92, #93 merged)
- NOTE: env var `VITE_USE_MOCK_FALLBACK` is evaluated at module load time in dataProvider.ts — vi.stubEnv won't work in tests for this flag
- NOTE: Match.homeTeam and Match.awayTeam are Team objects (not strings): { id, name, shortName, logo? }
- NOTE: StandingsEntry.team is a Team object; also has pointsFor, pointsAgainst, pointsDifference fields
- NOTE: MatchDetails extends Match; has homeStats/awayStats/homePlayers/awayPlayers (not homeTeamStats/awayTeamStats); quarterScores is optional
- Daily status report issues are auto-closed by maintainer; labelled `report`, `daily-status`
- Branch `fix/show-all-fixtures` exists on origin (pushed Jan 18 2026, no PR, 1 commit by miketsprague); content already incorporated into main; stale branch
- App.tsx uses `?league=` URL param for home page; Fixtures.tsx reads it via useSearchParams
- Fixtures.tsx handleMatchClick already passes `?league=` param to match detail route (merged PR #97)

## Remaining Major Version Updates (deferred — may have breaking changes)
- eslint: 9.39.4 → 10.1.0
- @eslint/js: 9.39.4 → 10.0.1
- @types/node: 24.10.9 → 25.5.0
- globals: 16.5.0 → 17.4.0
- jsdom: 27.4.0 → 29.0.1
- typescript: 5.9.3 → 6.0.2
- vite: 7.3.1 → 8.0.3
- eslint-plugin-react-refresh: 0.4.26 → 0.5.2
- @vitejs/plugin-react: 5.2.0 → 6.0.1

## Round-Robin Task Schedule
- 2026-03-28T22:51: Task 7 (#87 labelled), Task 2 (security fix branch), Task 10 (match detail investigation + perf fix), Task 11
- 2026-03-29T22:53: Task 7 (#88 labelled), Task 2 (security fix branch), Task 11
- 2026-03-30T23:00: Task 7 (#89 labelled), Task 2 (security fix branch), Task 11
- 2026-03-31T23:00: Task 2 (match detail perf fix branch), Task 11 (new April summary)
- 2026-04-01T23:00: Task 3 (match detail perf fix implemented), Task 11 (updated April summary)
- 2026-04-02T22:54: Task 1 (#98 comment), Task 7 (#98 labels), Task 4 (deps update branch), Task 11
- Next run should prioritise: Task 9 (welcome new contributors? no recent ones), Task 5 (check PR #99), Task 8 (release prep?), Task 10 (new improvement idea), Task 11
