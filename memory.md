# Repo Assist Memory

## Last Updated
2026-03-28T22:57:00Z

## Last Run Tasks
- Task 7: Labelled #87 with `documentation`
- Task 2/3: Security fix branch created (30th PR creation failure); match detail perf improvement branch created (31st PR creation failure)
- Task 10: Investigated match detail views — MatchDetail.tsx is complete and well-implemented; implemented perf fix: preserve league context when navigating to match detail
- Task 11: Updated #51 (Monthly Activity 2026-03) body.

## Issue Backlog Cursor
Last processed: #87 (processed all open issues)

## Comments Made
- #7 (2026-03-03): Native Swift iOS app — feasibility overview and suggested approach
- #72 (2026-03-14): API Health Check Failed — root cause analysis (non-JSON boxscore response for old match ID)

## Issues Without Repo Assist Comments
(none — all non-automated issues have been commented on)

## Open PRs (non-Repo Assist)
(none)

## Open Repo Assist PRs
(none — create_pull_request MCP tool broken for 31+ consecutive runs)

## Local Branches Ready (awaiting PR creation tool fix)
- NOTE: These branches are recreated each run since CI environment is ephemeral
- Security fix: `npm audit fix --force` → 0 high vulns (was 6: rollup high, picomatch high x2, flatted moderate + others); 11 moderate dev-only remain; all 51 tests pass
- dataProvider tests: 27 unit tests for dataProvider.ts, closes #61, all 78 tests pass (51→78)
- Deps update: `repo-assist/deps-update-20260327` — 13 packages updated to latest minor/patch; all 51 tests pass; only package-lock.json changed
- Match detail perf fix: `repo-assist/improve-match-detail-league-context-20260328` — preserve league param in navigate, pass to fetchMatchDetails; eliminates up to 5 redundant API calls; 51/51 tests pass

## Fix Attempts
- 2026-03-03 to 2026-03-28: Security vulnerability fix — local branch only (MCP tool failure, 30+ total attempts)
- 2026-03-09 to 2026-03-27: dataProvider.ts tests — local branch only (MCP tool failure, 9+ attempts; 27 tests in latest branch, 51→78 total)
- 2026-03-27: Deps update — local branch only (MCP tool failure, 1 attempt; branch repo-assist/deps-update-20260327)
- 2026-03-28: Match detail perf fix — local branch only (MCP tool failure, 1st attempt)

## Improvement Ideas
- dataProvider.ts tests — DONE: branch `repo-assist/improve-dataprovider-tests-20260326` ready (27 tests); issue #61 created (2026-03-07); all 78 tests pass
- Match detail views — INVESTIGATED: MatchDetail.tsx is feature-complete (stats, quarter scores, top performers, live polling); perf fix implemented (league context in URL)
- Match detail views — NEXT: could investigate whether leagueId is actually populated on Match objects from API; if not, could add leagueId to returned matches from providers

## Monthly Activity Summary
- Issue #51 is the canonical Monthly Activity 2026-03 issue (body updated 2026-03-28)

## Notes
- `create_pull_request` MCP tool returns "context is not defined" consistently (runs: 2026-03-03 through 2026-03-28, 31+ runs)
- `update_issue` max 1 per run — use `add_comment` for additional issue updates
- `add_comment` appears to work reliably
- `create_issue` appears to work reliably
- Issue #58 ([aw] Repo Assist failed) — labelled `wontfix` on 2026-03-16; should be closed by maintainer
- Issue #61 (test coverage for dataProvider.ts) — 27 tests WRITTEN in branch `repo-assist/improve-dataprovider-tests-20260326`, awaiting PR
- Issue #72 — CLOSED by maintainer (2026-03-24) alongside PR #83
- Issue #7 (iOS app request) is the only non-automated open user issue; no new human comments since last engagement
- Security vulns as of 2026-03-28: 4 high (rollup, picomatch x2) + 2 moderate before fix; after `npm audit fix --force`: 0 high, 11 moderate in eslint/typescript-eslint dev deps only
- No releases exist (version 0.0.0)
- Last merge: PR #83 (Harden Genius Sports boxscore health check) on 2026-03-24
- Tests on main: 51; dataProvider 27 tests are in branch only (51→78 in branch)
- NOTE: env var `VITE_USE_MOCK_FALLBACK` is evaluated at module load time in dataProvider.ts — vi.stubEnv won't work in tests for this flag
- NOTE: Match.homeTeam and Match.awayTeam are Team objects (not strings): { id, name, shortName, logo? }
- NOTE: StandingsEntry.team is a Team object; also has pointsFor, pointsAgainst, pointsDifference fields
- NOTE: MatchDetails extends Match; has homeStats/awayStats/homePlayers/awayPlayers (not homeTeamStats/awayTeamStats); quarterScores is optional
- dataProvider tests: 27 tests covering APIError, fetchLeagues, fetchMatches, fetchStandings, fetchAllData, fetchMatchDetails (with/without leagueId), fetchMatchesForTeam
- Daily status report issues (#57–#87 and ongoing) — label all with `documentation`
- Daily status issues labelled with `documentation`: #57, #59, #60, #63, #64, #65, #66, #67, #68, #71, #73, #74, #75, #76, #77, #78, #79, #80, #81, #82, #84, #85, #86, #87
- Branch `fix/show-all-fixtures` exists on origin (pushed Jan 18 2026, no PR, 1 commit by miketsprague); content already incorporated into main; stale branch
- Deps update (2026-03-27): react 19.2.4, react-dom 19.2.4, react-router-dom 7.13.2, tailwindcss 4.2.2, @tailwindcss/vite 4.2.2, @vitejs/plugin-react 5.2.0, @testing-library/react 16.3.2, @types/react 19.2.14, @types/node 24.12.0, eslint 9.39.4, @eslint/js 9.39.4, typescript-eslint 8.57.2, vitest 4.1.2
- MatchDetail.tsx is feature-complete: skeleton, error state, score display with logos, quarter scores table, team stats bars, top performers, live polling at 15s interval
- fetchMatchDetails without leagueId tries: mock → Genius Sports (×3 competitions) → EuroLeague → EuroCup (up to 6 API calls); with leagueId, direct provider call

## Recent Activity (since last memory update)
- 2026-03-28: Labelled #87 with `documentation`
- 2026-03-28: Security fix branch `repo-assist/fix-security-vulnerabilities-20260328` created; 30th PR creation failure
- 2026-03-28: Match detail perf fix branch `repo-assist/improve-match-detail-league-context-20260328` created; 31st PR creation failure
- 2026-03-28: Issue #51 updated (monthly activity summary)

## Round-Robin Task Schedule
- 2026-03-25T22:58: Task 7 (labelled #57, #59, #60, #84), Task 2 (security branch — 27th PR failure), Task 11 (updated body)
- 2026-03-26T22:52: Task 7 (labelled #85), Task 2 (security fix branch — 28th PR failure), Task 10/3 (dataProvider tests — 29th PR failure), Task 11 (updated body)
- 2026-03-27T22:55: Task 7 (labelled #86), Task 4 (deps update branch — 29th PR failure), Task 11 (updated body)
- 2026-03-28T22:51: Task 7 (labelled #87), Task 2 (security fix — 30th PR failure), Task 10 (match detail investigation + perf fix — 31st PR failure), Task 11 (updated body)
- Next run should prioritise: Task 1 (check for new issues/comments on #7), Task 9 (welcome new contributors if any), Task 4 (retry deps update), Task 3 (explore other codebase improvements)
