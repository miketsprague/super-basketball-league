# Repo Assist Memory

## Last Updated
2026-03-09T22:53:00Z

## Last Run Tasks
- Task 2: Security fix branch `repo-assist/fix-security-vulnerabilities-20260309` committed (3 vulns → 0, all 83 tests pass, build succeeds). `create_pull_request` STILL broken — 8th consecutive failure.
- Task 10: Wrote 33 unit tests for `dataProvider.ts` on branch `repo-assist/improve-dataprovider-tests`. All 83 tests pass. `create_pull_request` STILL broken.
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
(none — create_pull_request MCP tool broken for 8 consecutive runs)

## Local Branches Ready (awaiting PR creation tool fix)
- `repo-assist/fix-security-vulnerabilities-20260309`: security fix (npm audit fix), 0 vulns, 83/83 tests pass
- `repo-assist/improve-dataprovider-tests`: 33 new unit tests for dataProvider.ts, 83/83 tests pass, closes #61

## Fix Attempts
- 2026-03-03: Security vulnerability fix — local branch only (MCP tool failure)
- 2026-03-04: Security vulnerability fix — local branch only (MCP tool failure)
- 2026-03-05: Security vulnerability fix — local branch only (run failed)
- 2026-03-06: Security vulnerability fix — local branch only (MCP tool failure, 4th attempt)
- 2026-03-07: Security vulnerability fix — local branch `repo-assist/fix-security-vulnerabilities-20260307` — local branch only (MCP tool failure, 5th attempt)
- 2026-03-08: Security vulnerability fix — local branch `repo-assist/fix-security-vulnerabilities-20260308` — local branch only (MCP tool failure, 6th attempt)
- 2026-03-09: Security vulnerability fix — local branch `repo-assist/fix-security-vulnerabilities-20260309` — local branch only (MCP tool failure, 7th attempt)
- 2026-03-09: dataProvider.ts tests — local branch `repo-assist/improve-dataprovider-tests` — local branch only (MCP tool failure, 1st attempt)

## Improvement Ideas
- dataProvider.ts tests — DONE: branch `repo-assist/improve-dataprovider-tests` ready; issue #61 created (2026-03-07); tests written (2026-03-09)

## Monthly Activity Summary
- Issue #51 is the canonical Monthly Activity 2026-03 issue (body updated 2026-03-09)
- Issue #56 was a duplicate — CLOSED 2026-03-06 (confirmed)
- Issue #55 was a duplicate — CLOSED (confirmed)

## Notes
- `create_pull_request` MCP tool returns "context is not defined" consistently (runs: 2026-03-03 through 2026-03-09, 8 runs)
- `update_issue` max 1 per run — use `add_comment` for additional issue updates
- `add_comment` appears to work reliably
- `create_issue` appears to work reliably
- Issue #58 ([aw] Repo Assist failed) auto-expires 2026-03-12
- Issue #61 (test coverage for dataProvider.ts) — tests WRITTEN in branch, awaiting PR
- Issue #7 (iOS app request) is the only non-automated open user issue
- 3 npm security vulns exist in main (rollup high, minimatch high x2) — all fixable via `npm audit fix` — branch ready
- No releases exist (version 0.0.0)
- Last merge: PR #54 (API Health Check Workflow)
- Total tests after improvements: 83 (was 50)

## Round-Robin Task Schedule
- 2026-03-03T17:27: Task 1, Task 7, Task 11
- 2026-03-03T22:50: Task 4 (partial), Task 11
- 2026-03-04T22:54: Task 4 (partial), Task 11 (partial — duplicates created)
- 2026-03-05T23:32: Task 4 (partial), Task 11 (cleanup)
- 2026-03-06T22:51: Task 2/4 (partial — branch created, PR blocked), Task 11 (comment + closed #56)
- 2026-03-07T22:44: Task 2/4 (partial — branch created, PR blocked), Task 3 (filed #61), Task 11 (updated body)
- 2026-03-08T22:45: Task 2/4 (partial — branch created, PR blocked), Task 9 (no new contributors), Task 11 (updated body)
- 2026-03-09T22:50: Task 2/4 (security branch), Task 10 (dataProvider tests), Task 11 (updated body)
- Next run should prioritise: Task 8 (release preparation), Task 6 (stale PR nudges), Task 1 (re-check issues)
