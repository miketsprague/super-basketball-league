# Repo Assist Memory

## Last Updated
2026-03-18T22:54:00Z

## Last Run Tasks
- Task 2: Security fix branch `repo-assist/fix-security-vulnerabilities-20260318` (4 vulns → 0, 51 tests pass). `create_pull_request` STILL broken — 19th consecutive failure.
- Task 7: Labelled #76 with `documentation`
- Task 11: Updated #51 (Monthly Activity 2026-03) body.

## Issue Backlog Cursor
Last processed: #76 (processed all open issues this run)

## Comments Made
- #7 (2026-03-03): Native Swift iOS app — feasibility overview and suggested approach
- #7 (2026-03-04): Security fix status update (automated note)
- #72 (2026-03-14): API Health Check Failed — root cause analysis (non-JSON boxscore response for old match ID)

## Issues Without Repo Assist Comments
(none — all non-automated issues have been commented on)

## Open PRs (non-Repo Assist)
(none)

## Open Repo Assist PRs
(none — create_pull_request MCP tool broken for 19 consecutive runs)

## Local Branches Ready (awaiting PR creation tool fix)
- NOTE: These branches are recreated each run since CI environment is ephemeral
- Security fix: `npm audit fix` → 0 vulns (was 4: minimatch high x3, rollup high), all 51 tests pass
- dataProvider tests: 34 unit tests for dataProvider.ts, closes #61, all 85 tests pass (was 51)
- Boxscore health check fix: handle non-JSON responses as warnings, closes #72 (workflow-only change)

## Fix Attempts
- 2026-03-03 to 2026-03-18: Security vulnerability fix — local branch only (MCP tool failure, 19 total attempts)
- 2026-03-09 to 2026-03-17: dataProvider.ts tests — local branch only (MCP tool failure, 5 attempts; now 34 tests vs 32 earlier)
- 2026-03-15: Boxscore health check fix — local branch only (MCP tool failure, 1st attempt)

## Improvement Ideas
- dataProvider.ts tests — DONE: branch `repo-assist/improve-dataprovider-tests-20260317` ready; issue #61 created (2026-03-07); 34 tests written (2026-03-17, 51→85)
- API health check boxscore fix — #72 opened 2026-03-14: fix PREPARED 2026-03-15 (branch), manual patch documented in #51

## Monthly Activity Summary
- Issue #51 is the canonical Monthly Activity 2026-03 issue (body updated 2026-03-18)

## Notes
- `create_pull_request` MCP tool returns "context is not defined" consistently (runs: 2026-03-03 through 2026-03-18, 19 runs)
- `update_issue` max 1 per run — use `add_comment` for additional issue updates
- `add_comment` appears to work reliably
- `create_issue` appears to work reliably
- Issue #58 ([aw] Repo Assist failed) — labelled `wontfix` on 2026-03-16; should be closed by maintainer
- Issue #61 (test coverage for dataProvider.ts) — 34 tests WRITTEN in branch `repo-assist/improve-dataprovider-tests-20260317`, awaiting PR
- Issue #72 (API Health Check Failed 2026-03-14) — labelled `bug` on 2026-03-16; health check has been PASSING since 2026-03-15; can be closed; fix still pending for future fragility
- Issue #7 (iOS app request) is the only non-automated open user issue; no new human comments since last engagement
- 4 npm security vulns: minimatch (high × 3 advisories), rollup (high) — all fixable via `npm audit fix`; all 51 tests pass
- No releases exist (version 0.0.0)
- Last merge: PR #70 (Harden Genius Sports boxscore health check) on 2026-03-13
- Tests on main: 51 (dataProvider 34 tests are in branch only)
- NOTE: env var `VITE_USE_MOCK_FALLBACK` is evaluated at module load time in dataProvider.ts — vi.stubEnv won't work in tests for this flag
- NOTE: fetchAllData for unknown league uses mockProvider.fetchMockAllData(), NOT fetchMockMatches + fetchMockStandings

## Recent Activity (since last memory update)
- 2026-03-18: Security fix branch re-created (4 vulns → 0, 51 tests pass)
- 2026-03-18: Labelled #76 with `documentation`
- 2026-03-18: Issue #51 updated (monthly activity summary)
- API health check confirmed passing (no failures since PR #70 on 2026-03-13)

## Round-Robin Task Schedule
- 2026-03-16T22:54: Task 2 (security branch — 16th PR failure), Task 10 (dataProvider tests — 32 new tests), Task 7 (labelled #58, #72), Task 11 (updated body)
- 2026-03-17T22:55: Task 2 (security branch — 18th PR failure), Task 10 (dataProvider tests — 34 new tests), Task 11 (updated body)
- 2026-03-18T22:51: Task 2 (security branch — 19th PR failure), Task 7 (labelled #76), Task 11 (updated body)
- Next run should prioritise: Task 1 (check for new comments), Task 8 (release prep check), Task 10 (codebase improvements)
