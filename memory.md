# Repo Assist Memory

## Last Updated
2026-03-26T22:52:22Z

## Last Run Tasks
- Task 7: Labelled #85 with `documentation`
- Task 2: Security fix branch `repo-assist/fix-security-vulnerabilities-20260326` (4 high vulns → 0; 11 moderate dev-only remain, 51 tests pass). `create_pull_request` STILL broken — 28th consecutive failure.
- Task 10/3: dataProvider tests branch `repo-assist/improve-dataprovider-tests-20260326` (27 new tests, 51→78 total, closes #61). PR creation STILL broken — 29th failure.
- Task 11: Updated #51 (Monthly Activity 2026-03) body.

## Issue Backlog Cursor
Last processed: #85 (processed all open issues)

## Comments Made
- #7 (2026-03-03): Native Swift iOS app — feasibility overview and suggested approach
- #72 (2026-03-14): API Health Check Failed — root cause analysis (non-JSON boxscore response for old match ID)

## Issues Without Repo Assist Comments
(none — all non-automated issues have been commented on)

## Open PRs (non-Repo Assist)
(none)

## Open Repo Assist PRs
(none — create_pull_request MCP tool broken for 28+ consecutive runs)

## Local Branches Ready (awaiting PR creation tool fix)
- NOTE: These branches are recreated each run since CI environment is ephemeral
- Security fix: `npm audit fix --force` → 0 high vulns (was 6: rollup high, picomatch high x2, flatted moderate + others); 11 moderate dev-only remain; all 51 tests pass
- dataProvider tests: 27 unit tests for dataProvider.ts, closes #61, all 78 tests pass (51→78)

## Fix Attempts
- 2026-03-03 to 2026-03-26: Security vulnerability fix — local branch only (MCP tool failure, 28 total attempts)
- 2026-03-09 to 2026-03-26: dataProvider.ts tests — local branch only (MCP tool failure, 8+ attempts; 27 tests in latest branch, 51→78 total)

## Improvement Ideas
- dataProvider.ts tests — DONE: branch `repo-assist/improve-dataprovider-tests-20260326` ready (27 tests); issue #61 created (2026-03-07); all 78 tests pass
- Match detail views — on roadmap; MatchDetail.tsx already exists in codebase; next step: investigate completeness

## Monthly Activity Summary
- Issue #51 is the canonical Monthly Activity 2026-03 issue (body updated 2026-03-26)

## Notes
- `create_pull_request` MCP tool returns "context is not defined" consistently (runs: 2026-03-03 through 2026-03-26, 28+ runs)
- `update_issue` max 1 per run — use `add_comment` for additional issue updates
- `add_comment` appears to work reliably
- `create_issue` appears to work reliably
- Issue #58 ([aw] Repo Assist failed) — labelled `wontfix` on 2026-03-16; should be closed by maintainer
- Issue #61 (test coverage for dataProvider.ts) — 27 tests WRITTEN in branch `repo-assist/improve-dataprovider-tests-20260326`, awaiting PR
- Issue #72 — CLOSED by maintainer (2026-03-24) alongside PR #83
- Issue #7 (iOS app request) is the only non-automated open user issue; no new human comments since last engagement
- Security vulns as of 2026-03-26: 6 total before fix, after `npm audit fix --force`: 0 high (rollup fixed, picomatch fixed), 11 moderate in eslint/typescript-eslint dev deps only (not in prod builds)
- No releases exist (version 0.0.0)
- Last merge: PR #83 (Harden Genius Sports boxscore health check) on 2026-03-24
- Tests on main: 51; dataProvider 27 tests are in branch only (51→78 in branch)
- NOTE: env var `VITE_USE_MOCK_FALLBACK` is evaluated at module load time in dataProvider.ts — vi.stubEnv won't work in tests for this flag
- NOTE: Match.homeTeam and Match.awayTeam are Team objects (not strings): { id, name, shortName, logo? }
- NOTE: StandingsEntry.team is a Team object; also has pointsFor, pointsAgainst, pointsDifference fields
- NOTE: MatchDetails extends Match; has homeStats/awayStats/homePlayers/awayPlayers (not homeTeamStats/awayTeamStats); quarterScores is optional
- dataProvider tests: 27 tests covering APIError, fetchLeagues, fetchMatches, fetchStandings, fetchAllData, fetchMatchDetails (with/without leagueId), fetchMatchesForTeam
- Daily status report issues (#59–#85 and ongoing) — label all with `documentation`
- Daily status issues labelled with `documentation`: #57, #59, #60, #63, #64, #65, #66, #67, #68, #71, #73, #74, #75, #76, #77, #78, #79, #80, #81, #82, #84, #85
- Branch `fix/show-all-fixtures` exists on origin (pushed Jan 18 2026, no PR, 1 commit by miketsprague); content already incorporated into main; stale branch

## Recent Activity (since last memory update)
- 2026-03-26: Labelled #85 with `documentation`
- 2026-03-26: Security fix branch re-created (4 high → 0, 11 moderate dev-only; 51 tests pass); 28th PR creation failure
- 2026-03-26: dataProvider tests branch re-created (27 tests, 78 total); 29th PR creation failure  
- 2026-03-26: Issue #51 updated (monthly activity summary)

## Round-Robin Task Schedule
- 2026-03-23T22:55: Task 7 (labelled #80, #81), Task 2 (security branch — 25th PR failure), Task 11 (updated body)
- 2026-03-24T22:54: Task 7 (labelled #82 etc.), Task 2 (security branch — 26th PR failure), Task 11 (updated body)
- 2026-03-25T22:58: Task 7 (labelled #57, #59, #60, #84), Task 2 (security branch — 27th PR failure), Task 11 (updated body)
- 2026-03-26T22:52: Task 7 (labelled #85), Task 2 (security fix branch — 28th PR failure), Task 10/3 (dataProvider tests — 29th PR failure), Task 11 (updated body)
- Next run should prioritise: Task 1 (check for new issues/comments), Task 4 (check for outdated deps), Task 6 (stale PR check — no open PRs), Task 9 (welcome new contributors), Task 10 (match detail views investigation)
