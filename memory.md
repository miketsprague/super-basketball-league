# Repo Assist Memory

## Last Updated
2026-03-16T22:59:00Z

## Last Run Tasks
- Task 2: Security fix branch `repo-assist/fix-security-vulnerabilities-20260316` (4 vulns → 0, 83 tests pass). `create_pull_request` STILL broken — 16th consecutive failure.
- Task 10: Created 32 unit tests for `dataProvider.ts` on branch `repo-assist/improve-dataprovider-tests-20260316` (51 → 83 tests). PR creation still blocked.
- Task 7: Labelled #58 with `wontfix`, labelled #72 with `bug`
- Task 11: Updated #51 (Monthly Activity 2026-03) body.

## Issue Backlog Cursor
Last processed: #74 (processed all open issues this run)

## Comments Made
- #7 (2026-03-03): Native Swift iOS app — feasibility overview and suggested approach
- #7 (2026-03-04): Security fix status update (automated note)
- #72 (2026-03-14): API Health Check Failed — root cause analysis (non-JSON boxscore response for old match ID)

## Issues Without Repo Assist Comments
(none — all non-automated issues have been commented on)

## Open PRs (non-Repo Assist)
(none)

## Open Repo Assist PRs
(none — create_pull_request MCP tool broken for 16 consecutive runs)

## Local Branches Ready (awaiting PR creation tool fix)
- NOTE: These branches are recreated each run since CI environment is ephemeral
- Security fix: `npm audit fix` → 0 vulns (was 4: minimatch high x3, rollup high), all 83 tests pass
- dataProvider tests: 32 unit tests for dataProvider.ts, closes #61, all 83 tests pass (was 51)
- Boxscore health check fix: handle non-JSON responses as warnings, closes #72 (workflow-only change)

## Fix Attempts
- 2026-03-03 to 2026-03-16: Security vulnerability fix — local branch only (MCP tool failure, 16 total attempts)
- 2026-03-09 to 2026-03-16: dataProvider.ts tests — local branch only (MCP tool failure, 4 attempts; now 32 tests vs 29 earlier)
- 2026-03-15: Boxscore health check fix — local branch only (MCP tool failure, 1st attempt)

## Improvement Ideas
- dataProvider.ts tests — DONE: branch `repo-assist/improve-dataprovider-tests-20260316` ready; issue #61 created (2026-03-07); 32 tests written (2026-03-16, 51→83)
- API health check boxscore fix — #72 opened 2026-03-14: fix PREPARED 2026-03-15 (branch), manual patch documented in #51

## Monthly Activity Summary
- Issue #51 is the canonical Monthly Activity 2026-03 issue (body updated 2026-03-16)

## Notes
- `create_pull_request` MCP tool returns "context is not defined" consistently (runs: 2026-03-03 through 2026-03-16, 16 runs)
- `update_issue` max 1 per run — use `add_comment` for additional issue updates
- `add_comment` appears to work reliably
- `create_issue` appears to work reliably
- Issue #58 ([aw] Repo Assist failed) — labelled `wontfix` this run; should be closed by maintainer
- Issue #61 (test coverage for dataProvider.ts) — 32 tests WRITTEN in branch `repo-assist/improve-dataprovider-tests-20260316`, awaiting PR
- Issue #72 (API Health Check Failed 2026-03-14) — labelled `bug` this run; health check has been PASSING since 2026-03-15; can be closed; fix still pending for future fragility
- Issue #7 (iOS app request) is the only non-automated open user issue; no new human comments since last engagement
- 4 npm security vulns: minimatch (high × 3 advisories), rollup (high) — all fixable via `npm audit fix`; all 83 tests pass
- No releases exist (version 0.0.0)
- Last merge: PR #70 (Harden Genius Sports boxscore health check) on 2026-03-13
- Tests on main: 51 (dataProvider 32 tests are in branch only)
- NOTE: env var `VITE_USE_MOCK_FALLBACK` is evaluated at module load time in dataProvider.ts — vi.stubEnv won't work in tests for this flag

## Recent Activity (since last memory update)
- 2026-03-16: Security fix branch re-created (4 vulns → 0, 83 tests pass)
- 2026-03-16: dataProvider test branch created (32 new tests, 51→83 total)
- 2026-03-16: Issues #58, #72 labelled
- 2026-03-16: Issue #51 updated (monthly activity summary)
- 2026-03-16: API health check confirmed passing (2 consecutive successes since PR #70)

## Round-Robin Task Schedule
- 2026-03-15T22:50: Task 10 (boxscore fix prepared), Task 2 (security branch retry — 15th PR failure), Task 11 (updated body)
- 2026-03-16T22:54: Task 2 (security branch — 16th PR failure), Task 10 (dataProvider tests — 32 new tests), Task 7 (labelled #58, #72), Task 11 (updated body)
- Next run should prioritise: Task 1 (check for new comments), Task 8 (release preparation), Task 3 (codebase study)
