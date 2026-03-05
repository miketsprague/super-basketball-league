# Repo Assist Memory

## Last Updated
2026-03-05T23:33:00Z

## Last Run Tasks
- Task 4 (security fix): branch `repo-assist/fix-security-vulnerabilities-20260305` committed locally (3 npm vulns → 0, all 50 tests pass, build succeeds). PR creation STILL blocked by "context is not defined" MCP error.
- Task 11: Updated #51 (Monthly Activity 2026-03). Closed duplicate issues #55 and #56.

## Issue Backlog Cursor
Last processed: #7 (all current open issues processed — only #7 is open, plus automated daily status reports which don't need engagement).

## Comments Made
- #7 (2026-03-03): Native Swift iOS app — feasibility overview and suggested approach

## Issues Without Repo Assist Comments
(none — only #7 is open and it has been commented on)

## Open PRs (non-Repo Assist)
(none)

## Open Repo Assist PRs
(none — create_pull_request MCP tool broken for 3 consecutive runs)

## Fix Attempts
- 2026-03-03: Security vulnerability fix — local branch only (MCP tool failure)
- 2026-03-04: Security vulnerability fix — local branch only (MCP tool failure)
- 2026-03-05: Security vulnerability fix — local branch only (MCP tool failure)

## Improvement Ideas
(none yet — to investigate: test coverage for edge cases, documentation gaps)

## Monthly Activity Summary
- Issue #51 is the canonical Monthly Activity 2026-03 issue (updated 2026-03-05)
- Issues #55 and #56 were duplicates — closed 2026-03-05

## Notes
- `create_pull_request` MCP tool returns "context is not defined" consistently (runs: 2026-03-03, 2026-03-04, 2026-03-05)
- `create_issue` sometimes creates duplicates (created #55 AND #56 in single run on 2026-03-04)
- `update_issue` appears to work
- `add_comment` appears to work (unverified for #7 comment)
- Daily status report issues (#42, #45–#57) are auto-generated — no need to comment
- Issue #7 (iOS app request) is the only non-automated open issue
- 3 npm security vulns exist in main (rollup high, minimatch high x2, ajv moderate) — all fixable via `npm audit fix`
- No releases exist (version 0.0.0)
- Last merge: PR #54 (API Health Check Workflow)

## Round-Robin Task Schedule
- 2026-03-03T17:27: Task 1, Task 7, Task 11
- 2026-03-03T22:50: Task 4 (partial), Task 11
- 2026-03-04T22:54: Task 4 (partial), Task 11 (partial — duplicates created)
- 2026-03-05T23:32: Task 4 (partial), Task 11 (cleanup)
- Next run should prioritise: Task 3 (codebase study + improvement proposal via issue), Task 6, Task 9
- CRITICAL: `create_pull_request` MCP tool broken — consider using `push_to_pull_request_branch` as alternative if PR can be created another way
