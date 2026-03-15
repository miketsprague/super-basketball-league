# Repo Assist Memory

## Last Updated
2026-03-15T22:53:00Z

## Last Run Tasks
- Task 10: Prepared boxscore health check fix (branch created, PR blocked); documented manual fix in monthly summary
- Task 2: Security fix branch `repo-assist/fix-security-vulnerabilities-20260315` committed (4 vulns → 0, all 51 tests pass). `create_pull_request` STILL broken — 15th consecutive failure.
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
(none — create_pull_request MCP tool broken for 15 consecutive runs)

## Local Branches Ready (awaiting PR creation tool fix)
- NOTE: These branches are recreated each run since CI environment is ephemeral
- Boxscore health check fix: handle non-JSON responses as warnings, closes #72 (workflow-only change)
- Security fix: `npm audit fix` → 0 vulns (was 4: minimatch high x2, rollup high, +1 moderate), all 51 tests pass
- DataProvider tests: 29 unit tests for dataProvider.ts, closes #61

## Fix Attempts
- 2026-03-03 to 2026-03-15: Security vulnerability fix — local branch only (MCP tool failure, 15 total attempts)
- 2026-03-09 to 2026-03-11: dataProvider.ts tests — local branch only (MCP tool failure, 3 attempts)
- 2026-03-15: Boxscore health check fix — local branch only (MCP tool failure, 1st attempt); documented manual fix in issue #51

## Improvement Ideas
- dataProvider.ts tests — DONE: branch `repo-assist/improve-dataprovider-tests` ready; issue #61 created (2026-03-07); tests written (2026-03-11, 29 tests, 50→79)
- API health check boxscore fix — #72 opened 2026-03-14: fix PREPARED 2026-03-15 (branch), manual patch documented in #51

## Monthly Activity Summary
- Issue #51 is the canonical Monthly Activity 2026-03 issue (body updated 2026-03-15)

## Notes
- `create_pull_request` MCP tool returns "context is not defined" consistently (runs: 2026-03-03 through 2026-03-15, 15 runs)
- `update_issue` max 1 per run — use `add_comment` for additional issue updates
- `add_comment` appears to work reliably
- `create_issue` appears to work reliably
- Issue #58 ([aw] Repo Assist failed) — can be closed (expired Mar 12)
- Issue #61 (test coverage for dataProvider.ts) — tests WRITTEN in branch, awaiting PR
- Issue #72 (API Health Check Failed 2026-03-14) — root cause identified: boxscore endpoint returns non-JSON for old match IDs; FIX READY: add `jq empty` validity check before `.html` extraction (see #51 Suggested Actions for patch)
- Issue #7 (iOS app request) is the only non-automated open user issue; no new human comments since last engagement
- 4 npm security vulns: minimatch (high × 2 advisories), rollup (high), + 1 moderate — all fixable via `npm audit fix`; new rollup vuln appeared this run
- No releases exist (version 0.0.0)
- Last merge: PR #70 (Harden Genius Sports boxscore health check) on 2026-03-13
- Tests on main: 51 (dataProvider tests are in branch only)
- NOTE: env var `VITE_USE_MOCK_FALLBACK` is evaluated at module load time in dataProvider.ts — vi.stubEnv won't work in tests for this flag

## Recent Activity (since last memory update)
- 2026-03-15: Boxscore health check fix branch prepared (closes #72)
- 2026-03-15: Security fix branch prepared (4 vulns → 0, rollup vuln is new)
- 2026-03-15: Issue #51 updated (monthly activity summary)

## Round-Robin Task Schedule
- 2026-03-14T22:48: Task 1 (commented #72), Task 2 (security branch retry — 14th PR failure), Task 11 (updated body)
- 2026-03-15T22:50: Task 10 (boxscore fix prepared), Task 2 (security branch retry — 15th PR failure), Task 11 (updated body)
- Next run should prioritise: Task 8 (release preparation), Task 3 (codebase study/improvements), Task 1 (check for new comments on open issues)
