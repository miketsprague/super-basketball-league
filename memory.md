# Repo Assist Memory

## Last Updated
2026-04-03T22:56:00Z

## Last Run Tasks
- Task 4: Prepared deps update branch `repo-assist/deps-update-20260403` (13 minor/patch dep updates, 81/81 tests pass, build clean) — `create_pull_request` still broken (37th failure)
- Task 3/10: Filed issue #101: EuroLeague API hardcoded `CURRENT_SEASON_YEAR` will break at season transition
- Task 11: Updated Monthly Activity 2026-04 issue (#94)

## Issue Backlog Cursor
Last processed: #101 (all non-automated open issues covered: #7, #98, #101)

## Comments Made
- #7 (2026-03-03): Native Swift iOS app — feasibility overview and suggested approach
- #98 (2026-04-02): create_pull_request investigation — root cause (gh-aw v0.50.6 bug) and fix (gh aw upgrade)

## Issues Without Repo Assist Comments
- #101 (new issue filed by Repo Assist — no need to comment on own issue)

## Open PRs (non-Repo Assist)
- #99: "docs: investigate create_pull_request MCP tool error" (Copilot coding agent, DRAFT) — documents fix in KNOWN_ISSUES.md

## Open Repo Assist PRs
(none — create_pull_request MCP tool broken for 37+ consecutive runs)

## Monthly Activity Summary
- Issue #94: [Repo Assist] Monthly Activity 2026-04 — open, updated this run

## Recent Maintainer Activity (2026-04-03)
- Issue #100 created: Daily status report (auto-generated, labelled `report`, `daily-status`)
- No new maintainer comments or PRs since 2026-04-02

## Current Repo State
- npm vulnerabilities: **0** (all fixed)
- Tests: **81** passing
- Open issues: 5 (#100 daily status, #101 EuroLeague season year, #98 create_pull_request, #94 monthly summary, #7 iOS app request)
- Open PRs: 1 (#99 docs for create_pull_request fix - DRAFT)
- Deps update: branch `repo-assist/deps-update-20260403` ready (can't PR due to tool bug)

## Local Branches Ready (awaiting PR creation tool fix)
- Deps update: `repo-assist/deps-update-20260403`
  - Updated 13 packages to latest minor/patch: tailwindcss, @tailwindcss/vite, react, react-dom, react-router-dom, @types/react, @types/node, @vitejs/plugin-react, eslint, @eslint/js, typescript-eslint, @testing-library/react, vitest
  - 81/81 tests pass, lint clean, build clean

## Fix Attempts
- 2026-03-03 to 2026-03-31: Security vulnerability fix — MERGED as PR #91 (maintainer did it)
- 2026-03-09 to 2026-03-31: dataProvider.ts tests — MERGED as PR #92 (maintainer did it)
- 2026-03-28 to 2026-04-02: Match detail perf fix — MERGED as PR #97 (Copilot coding agent did it) ✅
- 2026-04-02 to 2026-04-03: Deps update — local branch ready, PR creation still broken

## Improvement Ideas
- dataProvider.ts tests — DONE: merged as PR #92
- Security vulnerabilities — DONE: merged as PR #91
- Match detail perf fix — DONE: merged as PR #97
- Deps update (minor/patch) — PENDING: branch ready, PR creation broken
- EuroLeague season year hardcoding — PENDING: issue #101 filed, fix involves auto-deriving year from current date in euroleagueApi.ts
- Component tests (Fixtures, MatchDetail, etc.) — PENDING: no tests exist for any React components

## Notes
- `create_pull_request` MCP tool returns "context is not defined" consistently (runs: 2026-03-03 through 2026-04-03, 37+ runs)
- Root cause: repo-assist.lock.yml pinned to gh-aw v0.50.6 (schema v1) — known bug, fix: `gh aw upgrade`
- PR #99 documents this fix in KNOWN_ISSUES.md
- `update_issue` max 1 per run — use `add_comment` for additional issue updates
- `add_comment` appears to work reliably
- `create_issue` appears to work reliably
- `add_labels` appears to work reliably
- Issue #7 (iOS app request) is the only long-running user issue; no new human comments since last engagement (2026-03-04)
- Issue #101 (EuroLeague season year): fix = derive year automatically from current date: `month >= 10 ? year : year - 1`
- Tests: 81 passing on main
- NOTE: env var `VITE_USE_MOCK_FALLBACK` is evaluated at module load time in dataProvider.ts — vi.stubEnv won't work in tests for this flag
- NOTE: Match.homeTeam and Match.awayTeam are Team objects (not strings): { id, name, shortName, logo? }
- NOTE: StandingsEntry.team is a Team object; also has pointsFor, pointsAgainst, pointsDifference fields
- NOTE: MatchDetails extends Match; has homeStats/awayStats/homePlayers/awayPlayers (not homeTeamStats/awayTeamStats); quarterScores is optional
- Daily status report issues are auto-closed by maintainer; labelled `report`, `daily-status`
- Branch `fix/show-all-fixtures` exists on origin (pushed Jan 18 2026, no PR, 1 commit by miketsprague); content already incorporated into main; stale branch
- App.tsx uses `?league=` URL param for home page; Fixtures.tsx reads it via useSearchParams
- Fixtures.tsx handleMatchClick already passes `?league=` param to match detail route (merged PR #97)
- Polling interval `5 * 60 * 1000` is duplicated in App.tsx:111 and TeamView.tsx:44 — could be extracted to a shared constant

## Remaining Major Version Updates (deferred — may have breaking changes)
- eslint: 9.39.4 → 10.2.0
- @eslint/js: 9.39.4 → 10.0.1
- @types/node: 24.12.2 → 25.5.2
- globals: 16.5.0 → 17.4.0
- jsdom: 27.4.0 → 29.0.1
- typescript: 5.9.3 → 6.0.2
- vite: 7.3.1 → 8.0.3
- eslint-plugin-react-refresh: 0.4.26 → 0.5.2
- @vitejs/plugin-react: 5.2.0 → 6.0.1

## Round-Robin Task Schedule
- 2026-04-02T22:54: Task 1 (#98 comment), Task 7 (#98 labels), Task 4 (deps update branch), Task 11
- 2026-04-03T22:56: Task 4 (deps update branch 20260403), Task 3/10 (filed issue #101 EuroLeague season year), Task 11
- Next run should prioritise: Task 1 (re-check all open issues, especially #101), Task 5 (PR #99 maintenance), Task 9 (welcome new contributors?), Task 7 (label #101), Task 10 (implement fix for #101 if PR tool fixed)
