# Repo Assist Memory

## Last Updated
2026-03-31T23:00:00Z

## Last Run Tasks
- Task 2: Prepared match detail perf fix branch `repo-assist/improve-match-detail-league-context-20260331` (pass league context in URL, eliminate up to 5 redundant API calls; 81/81 tests pass) — PR creation still broken (34th failure)
- Task 11: Created new Monthly Activity 2026-04 issue (issue #51 for March was closed by maintainer on 2026-03-31)

## Issue Backlog Cursor
Last processed: #7 (only open non-automated issue)

## Comments Made
- #7 (2026-03-03): Native Swift iOS app — feasibility overview and suggested approach

## Issues Without Repo Assist Comments
(none — #7 is the only non-automated open issue and was already commented on)

## Open PRs (non-Repo Assist)
(none)

## Open Repo Assist PRs
(none — create_pull_request MCP tool broken for 34+ consecutive runs)

## Monthly Activity Summary
- Issue #51 was closed by maintainer (miketsprague) on 2026-03-31 as "not_planned"
- New issue for April 2026 created this run (create_issue returned success; exact number unknown - search didn't index in time)
- April issue title: [Repo Assist] Monthly Activity 2026-04

## Recent Maintainer Activity (2026-03-31)
- PR #91 merged: "Fix 6 npm security vulnerabilities in dev dependencies" (0 vulns now!)
- PR #92 merged: "Add unit tests for dataProvider.ts" (51→81 tests; included #93 fix)
- PR #93 merged: "Fix leagueName annotation using league.name instead of league.shortName"
- Issue #90 closed: Daily status report for March 31
- Issue #51 closed: Monthly Activity 2026-03 (marked "not_planned")

## Current Repo State
- npm vulnerabilities: **0** (all fixed)
- Tests: **81** passing
- Open issues: 1 (#7 - Native Swift iOS app)
- Open PRs: 0

## Local Branches Ready (awaiting PR creation tool fix)
- NOTE: These branches are recreated each run since CI environment is ephemeral
- Match detail perf fix: `repo-assist/improve-match-detail-league-context-20260331`
  - Fixtures.tsx: handleMatchClick passes leagueId as ?league= query param
  - MatchDetail.tsx: reads league search param, passes to fetchMatchDetails(matchId, leagueId)
  - Eliminates up to 5 redundant API calls per match detail page load
  - 81/81 tests pass, lint clean

## Fix Attempts
- 2026-03-03 to 2026-03-31: Security vulnerability fix — MERGED as PR #91 (maintainer did it)
- 2026-03-09 to 2026-03-31: dataProvider.ts tests — MERGED as PR #92 (maintainer did it)
- 2026-03-28 to 2026-03-31: Match detail perf fix — local branch only (34th PR failure)

## Improvement Ideas
- dataProvider.ts tests — DONE: merged as PR #92
- Security vulnerabilities — DONE: merged as PR #91
- Match detail perf fix — PENDING: branch ready, PR creation still broken

## Notes
- `create_pull_request` MCP tool returns "context is not defined" consistently (runs: 2026-03-03 through 2026-03-31, 34+ runs)
- `update_issue` max 1 per run — use `add_comment` for additional issue updates
- `add_comment` appears to work reliably
- `create_issue` appears to work reliably
- Issue #7 (iOS app request) is the only non-automated open user issue; no new human comments since last engagement (2026-03-04)
- Tests: 81 passing on main (after PRs #91, #92, #93 merged)
- NOTE: env var `VITE_USE_MOCK_FALLBACK` is evaluated at module load time in dataProvider.ts — vi.stubEnv won't work in tests for this flag
- NOTE: Match.homeTeam and Match.awayTeam are Team objects (not strings): { id, name, shortName, logo? }
- NOTE: StandingsEntry.team is a Team object; also has pointsFor, pointsAgainst, pointsDifference fields
- NOTE: MatchDetails extends Match; has homeStats/awayStats/homePlayers/awayPlayers (not homeTeamStats/awayTeamStats); quarterScores is optional
- Daily status report issues are auto-closed by maintainer; labelled `report`, `daily-status`
- Branch `fix/show-all-fixtures` exists on origin (pushed Jan 18 2026, no PR, 1 commit by miketsprague); content already incorporated into main; stale branch

## Round-Robin Task Schedule
- 2026-03-28T22:51: Task 7 (#87 labelled), Task 2 (security fix branch), Task 10 (match detail investigation + perf fix), Task 11
- 2026-03-29T22:53: Task 7 (#88 labelled), Task 2 (security fix branch), Task 11
- 2026-03-30T23:00: Task 7 (#89 labelled), Task 2 (security fix branch), Task 11
- 2026-03-31T23:00: Task 2 (match detail perf fix branch), Task 11 (new April summary)
- Next run should prioritise: Task 3 (explore codebase improvements), Task 7 (label any new issues), Task 9 (welcome new contributors if any)
