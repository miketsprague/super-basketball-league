# Repo Assist Memory

## Last Updated
2026-03-13T22:49:00Z

## Last Run Tasks
- Task 2: Security fix branch `repo-assist/fix-security-vulnerabilities-20260313` committed (4 vulns → 0, all 51 tests pass). `create_pull_request` STILL broken — 13th consecutive failure.
- Task 11: Updated #51 (Monthly Activity 2026-03) body.

## Issue Backlog Cursor
Last processed: #7 (all current open issues processed — only #7 is open non-automated)

## Comments Made
- #7 (2026-03-03): Native Swift iOS app — feasibility overview and suggested approach
- #7 (2026-03-04): Security fix status update (automated note)

## Issues Without Repo Assist Comments
(none — only #7 is non-automated and it has been commented on)

## Open PRs (non-Repo Assist)
(none)

## Open Repo Assist PRs
(none — create_pull_request MCP tool broken for 13 consecutive runs)

## Local Branches Ready (awaiting PR creation tool fix)
- NOTE: These branches are recreated each run since CI environment is ephemeral
- Security fix: `npm audit fix --force` → 0 vulns (was 4: rollup high x1, minimatch high x1, ajv high x1, moderate x1), all 51 tests pass
- DataProvider tests: 29 unit tests for dataProvider.ts, closes #61

## Fix Attempts
- 2026-03-03 to 2026-03-13: Security vulnerability fix — local branch only (MCP tool failure, 13 total attempts)
- 2026-03-09 to 2026-03-11: dataProvider.ts tests — local branch only (MCP tool failure, 3 attempts)

## Improvement Ideas
- dataProvider.ts tests — DONE: branch `repo-assist/improve-dataprovider-tests` ready; issue #61 created (2026-03-07); tests written (2026-03-11, 29 tests, 50→79)

## Monthly Activity Summary
- Issue #51 is the canonical Monthly Activity 2026-03 issue (body updated 2026-03-13)
- Issue #56 was a duplicate — CLOSED 2026-03-06 (confirmed)
- Issue #55 was a duplicate — CLOSED (confirmed)

## Notes
- `create_pull_request` MCP tool returns "context is not defined" consistently (runs: 2026-03-03 through 2026-03-13, 13 runs)
- `update_issue` max 1 per run — use `add_comment` for additional issue updates
- `add_comment` appears to work reliably
- `create_issue` appears to work reliably
- Issue #58 ([aw] Repo Assist failed) — can be closed (expired Mar 12)
- Issue #61 (test coverage for dataProvider.ts) — tests WRITTEN in branch, awaiting PR
- Issue #7 (iOS app request) is the only non-automated open user issue; no new human comments since last engagement
- 4 npm security vulns exist in main (rollup high, minimatch high, ajv high, moderate) — all fixable via `npm audit fix --force`
  - NOTE: Vuln count went from 3 to 4 after PR #70 was merged on 2026-03-13 (may have bumped a dep)
- No releases exist (version 0.0.0)
- Last merge: PR #70 (Harden Genius Sports boxscore health check) on 2026-03-13
- Tests on main: 51 (dataProvider tests are in branch only)
- NOTE: env var `VITE_USE_MOCK_FALLBACK` is evaluated at module load time in dataProvider.ts — vi.stubEnv won't work in tests for this flag

## Recent Activity (since last memory update)
- PR #70 merged on 2026-03-13: "Harden Genius Sports boxscore health check against transient 5xxs" (by Copilot for miketsprague)
- Tests increased from 50 to 51

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
- Next run should prioritise: Task 8 (release preparation check), Task 10 (investigate new improvement — something different from security/dataProvider tests)
