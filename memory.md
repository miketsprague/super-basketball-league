# Repo Assist Memory

## Last Updated
2026-03-14T22:49:00Z

## Last Run Tasks
- Task 1: Commented on #72 (API Health Check Failed - 2026-03-14) — root cause: boxscore endpoint returning non-JSON for old match ID
- Task 2: Security fix branch `repo-assist/fix-security-vulnerabilities-20260314` committed (4 vulns → 0, all 51 tests pass). `create_pull_request` STILL broken — 14th consecutive failure.
- Task 11: Updated #51 (Monthly Activity 2026-03) body.

## Issue Backlog Cursor
Last processed: #72 (processed all open issues this run)

## Comments Made
- #7 (2026-03-03): Native Swift iOS app — feasibility overview and suggested approach
- #7 (2026-03-04): Security fix status update (automated note)
- #72 (2026-03-14): API Health Check Failed — root cause analysis (non-JSON boxscore response for old match ID)

## Issues Without Repo Assist Comments
(none — all non-automated issues have been commented on)

## Open PRs (non-Repo Assist)
(none)

## Open Repo Assist PRs
(none — create_pull_request MCP tool broken for 14 consecutive runs)

## Local Branches Ready (awaiting PR creation tool fix)
- NOTE: These branches are recreated each run since CI environment is ephemeral
- Security fix: `npm audit fix` → 0 vulns (was 4: flatted high, minimatch high x3, ajv moderate), all 51 tests pass
- DataProvider tests: 29 unit tests for dataProvider.ts, closes #61

## Fix Attempts
- 2026-03-03 to 2026-03-14: Security vulnerability fix — local branch only (MCP tool failure, 14 total attempts)
- 2026-03-09 to 2026-03-11: dataProvider.ts tests — local branch only (MCP tool failure, 3 attempts)

## Improvement Ideas
- dataProvider.ts tests — DONE: branch `repo-assist/improve-dataprovider-tests` ready; issue #61 created (2026-03-07); tests written (2026-03-11, 29 tests, 50→79)
- API health check boxscore fix — #72 opened 2026-03-14: handle non-JSON responses gracefully

## Monthly Activity Summary
- Issue #51 is the canonical Monthly Activity 2026-03 issue (body updated 2026-03-14)
- Issue #56 was a duplicate — CLOSED 2026-03-06 (confirmed)
- Issue #55 was a duplicate — CLOSED (confirmed)

## Notes
- `create_pull_request` MCP tool returns "context is not defined" consistently (runs: 2026-03-03 through 2026-03-14, 14 runs)
- `update_issue` max 1 per run — use `add_comment` for additional issue updates
- `add_comment` appears to work reliably
- `create_issue` appears to work reliably
- Issue #58 ([aw] Repo Assist failed) — can be closed (expired Mar 12)
- Issue #61 (test coverage for dataProvider.ts) — tests WRITTEN in branch, awaiting PR
- Issue #72 (API Health Check Failed 2026-03-14) — Repo Assist commented: root cause = boxscore endpoint returns non-JSON (HTML) for old match 2702542; HTTP 200 but jq parse error
- Issue #7 (iOS app request) is the only non-automated open user issue; no new human comments since last engagement
- 4 npm security vulns in main (flatted high, minimatch high x3, ajv moderate) — all fixable via `npm audit fix`
- No releases exist (version 0.0.0)
- Last merge: PR #70 (Harden Genius Sports boxscore health check) on 2026-03-13
- Tests on main: 51 (dataProvider tests are in branch only)
- NOTE: env var `VITE_USE_MOCK_FALLBACK` is evaluated at module load time in dataProvider.ts — vi.stubEnv won't work in tests for this flag

## Recent Activity (since last memory update)
- Issue #72 opened 2026-03-14: API Health Check Failed (boxscore endpoint)
- Repo Assist commented on #72 with root cause analysis

## Round-Robin Task Schedule
- 2026-03-03T17:27: Task 1, Task 7, Task 11
- 2026-03-03T22:50: Task 4 (partial), Task 11
- 2026-03-04T22:54: Task 4 (partial), Task 11 (partial — duplicates created)
- 2026-03-05T23:32: Task 4 (partial), Task 11 (cleanup)
- 2026-03-06T22:51: Task 2/4 (partial — branch created, PR blocked), Task 11 (comment + closed #56)
- 2026-03-07T22:44: Task 2/4 (partial — branch created, PR blocked), Task 3 (filed #61), Task 11 (updated body)
- 2026-03-08T22:45: Task 2/4 (partial — branch created, PR blocked), Task 9 (no new contributors), Task 11 (updated body)
- 2026-03-09T22:50: Task 2/4 (security branch), Task 10 (dataProvider tests), Task 11 (updated body)
- 2026-03-10T22:49: Task 2 (security branch retry), Task 10 (dataProvider tests retry), Task 11 (updated body)
- 2026-03-11T22:45: Task 2 (security branch retry), Task 10 (dataProvider tests retry), Task 11 (updated body)
- 2026-03-12T22:48: Task 2 (security branch retry — 12th PR failure), Task 11 (updated body)
- 2026-03-13T22:47: Task 2 (security branch retry — 13th PR failure), Task 11 (updated body)
- 2026-03-14T22:48: Task 1 (commented #72), Task 2 (security branch retry — 14th PR failure), Task 11 (updated body)
- Next run should prioritise: Task 10 (investigate and fix API health check boxscore false-positive), Task 8 (release preparation check)
