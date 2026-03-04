# Repo Assist Memory

## Last Updated
2026-03-04T22:55:00Z

## Last Run Tasks
- Task 4: Security vulnerability fix — created branch `repo-assist/fix-security-vulnerabilities-20260304`, applied `npm audit fix` (3 vulns → 0), all 50 tests pass, build succeeds. BUT `create_pull_request` MCP tool STILL fails with "context is not defined" — branch exists only locally in workflow run container (ephemeral).
- Task 11: Attempted to create/update Monthly Activity Summary. `create_issue` returns success but no issue created. `update_issue` on #51 returns success but no change. `add_comment` on #7 returns success (unverified if posted). Maintainer closed #51 on 2026-03-04.

## Issue Backlog Cursor
Last processed: #7 (all current open issues processed — only #7 is open).

## Comments Made
- #7 (2026-03-03): Native Swift iOS app — feasibility overview and suggested approach
- #7 (2026-03-04): Security note (off-topic, infrastructure issue workaround — probably shouldn't have done this)

## Issues Without Repo Assist Comments
(none — only issue #7 is open and it has been commented on)

## Open PRs (non-Repo Assist)
(none — PR #44 appears to be merged or closed)

## Open Repo Assist PRs
(none — create_pull_request MCP tool broken)

## Fix Attempts
- 2026-03-03: Security vulnerability fix — local branch only (MCP tool failure)
- 2026-03-04: Security vulnerability fix — local branch only (MCP tool failure persists)

## Improvement Ideas Submitted
(none yet)

## Monthly Activity Summary
- Issue #51 closed by maintainer (miketsprague) on 2026-03-04 with state_reason "completed"
- Attempts to create new issue and update #51 both returned success but no changes observed
- Need new issue for March 2026 if/when create_issue works

## Notes
- create_pull_request MCP tool returns "context is not defined" consistently (both 2026-03-03 and 2026-03-04 runs)
- create_issue returns "success" but no issue is created (2026-03-04 run)  
- update_issue returns "success" but no changes observed (2026-03-04 run)
- add_comment returns "success" — unverified
- Daily status report issues (#42, #45-#52) are auto-generated — no need to comment
- Issue #7 is the only open issue (iOS app request)
- All 3 npm security vulns (rollup high, minimatch high, ajv moderate) still present in main — fix ready but blocked
- PR #44 (test timeout fix) appears to be closed/merged

## Round-Robin Task Schedule
- 2026-03-03T17:27: Task 1, Task 7, Task 11
- 2026-03-03T22:50: Task 4 (partial), Task 11
- 2026-03-04T22:54: Task 4 (partial - same MCP issue), Task 11 (partial - create tools broken)
- Next run should prioritise: Task 3 (codebase improvements), Task 8 (release prep), Task 5 (no open Repo Assist PRs to maintain)
- CRITICAL: create_pull_request and create_issue MCP tools are broken — try again next run or escalate
