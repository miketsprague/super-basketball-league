# Repo Assist Memory

## Last Updated
2026-09-29T18:55:00Z


## Prior Last Updated
2026-09-28T20:20:00Z

## Last Run Tasks
- Task 5: CI verified — API health check passing (2026-08-29); PR #163 CI passing (2026-08-29)
- Task 6: No non-RA stale PRs to nudge (#99 already nudged twice) (2026-08-29)
- Task 7: Labels check — all current (2026-08-29)
- Task 9: No new contributors in last 24 hours (2026-08-29)
- Task 11: Updated monthly activity issue #259 (2026-08-29)
- Task 1: Commented on #261 — transient failure explanation (2026-08-29)
- Task 8: Release check — PR #226 still open; no new release PR needed (2026-08-28)
- Task 2: No fixable issues; PR backlog at 50+ — not adding new PRs (2026-08-27)

## Issue Backlog Cursor
Last processed: #261 (2026-08-26). No new user issues since #236.
Note: #7 is only open real user issue; all proxy/automated issues are not user-facing.

## Comments Made
- #7 (2026-03-03): Native Swift iOS app — feasibility overview
- #99 (2026-05-04): Second nudge — do not nudge again
- #101 (2026-04-17): Fix implemented, PR #163 ready
- #145 (2026-06-05): Linked to PR #164
- #174 (2026-05-07): Explained package-lock.json protected-file failure
- #216 (2026-06-03): Daily-repo-status auth failure
- #218 (2026-06-01): API health check failure — transient
- #230 (2026-06-08): API health check failure — transient
- #232 (2026-06-09): Both Genius Sports endpoints failing; PR #233 created
- #235 (2026-06-12): Repo Assist failure — explained as infrastructure auth issue
- #236 (2026-06-12): API health check failure — off-season; linked to #233/#234
- #253 (2026-07-01): Repo Assist failure (2026-06-30) — transient auth issue, no fix needed
- #256 (2026-07-07): Repo Assist failure (2026-07-06) — CHANGELOG.md protected files; PR #226 needs manual CHANGELOG update
- #257 (2026-07-08): API health check failure — off-season HTTP 500 same pattern as Jun; PR #234 would fix
- #261 (2026-08-29): Repo Assist failure (2026-08-26) — transient safe output issue; no action needed
- PR #163 (2026-07-01): August urgency comment (INACCURATE — corrected 2026-07-05)
- PR #163 (2026-07-05): Correction comment — deadline is October, not August

## Open Repo Assist PRs (2026-08-29)
Large backlog #163–#255 (~50 PRs, mostly ✅ clean tests/features). Superseded (close): #169(by#180),#171(by#237),#173(by#228). #163 URGENT: dynamic season year, must merge before Oct 2026. #226 release blocked (CHANGELOG protected). Full detail was trimmed for memory size.


## Non-Repo-Assist PRs
- #99: stale Copilot docs PR (nudged twice — do not nudge again)

## Proxy Issues to Close
#115-#116, #118, #120-#121, #123-#124, #126, #128, #130-#133, #135-#138, #140-#143, #147, #149, #151, #153, #155, #158-#161

## Monthly Activity Summary
Issue #254 (July 2026): CLOSED 2026-08-01
Issue #259 (August 2026): open — updated 2026-08-29

## API Health Check Pattern
- Failures: Jun 1, Jun 8, Jun 9, Jun 12 (Genius Sports off-season), Jun 30 (auth transient), Jul 8 (off-season)
- Passes: consistently passing Jun 13 - Aug 29 (in-season); failures cluster in off-season windows.
- PR #231 MERGED: adds diagnostics; PR #233 (open): dedup; PR #234 (open): season-aware
- PR #238: Promise.allSettled partial resilience

## Dependency Status (2026-06-28)
Blocked: package.json + package-lock.json are protected files. Maintainer must run `npm update` + commit manually.
Note: npm audit shows 9 vulnerabilities (1 low, 7 high, 1 critical) — maintainer should run `npm audit fix`.

## Round-Robin Next
- Done 2026-08-29: Task 1, Task 5, Task 6, Task 7, Task 9, Task 11
- Done 2026-08-28: Task 1, Task 5, Task 8, Task 11
- Done 2026-08-27: Task 2, Task 5, Task 7, Task 11
- Done 2026-08-26: Task 1, Task 6, Task 11
- Done 2026-08-25: Task 3, Task 5, Task 8, Task 9, Task 11
- Done 2026-08-24: Task 1, Task 5, Task 6, Task 7, Task 11
- Done 2026-08-23: Task 5, Task 11
- Next: Task 2, Task 3, Task 8, Task 10, Task 11

## Key Code Notes
- vitest: import { describe, it, expect, vi } from 'vitest' explicitly
- @testing-library/user-event NOT installed — use fireEvent
- Match.homeTeam/awayTeam: Team { id, name, shortName, logo? }; venue required ('TBC' if unknown)
- src/components/__tests__/: EXISTS on main — Fixtures.winner.test.ts, LeagueTable.test.tsx, MatchDetail.shareButton.test.tsx
- src/services/__tests__/: dataProvider, euroleagueApi, geniusSportsApi, leagues, teamStorage
- src/__tests__/: does NOT exist on main yet (planned for App tests in PR #178)
- Component test naming convention: <Component>.<feature>.test.ts[x] for focused tests
- localStorage mock: Node.js 25+ native stub shadows jsdom — use explicit storageMock pattern
- App.tsx: uses Routes (not BrowserRouter) — wrap in MemoryRouter for tests
- vi.stubEnv for PROD: boolean (true/false) not string
- ESLint errors in Fixtures.tsx (2 pre-existing react-refresh errors) — FIXED by new PR (branch repo-assist/improve-extract-match-utils, 2026-09-28): helpers moved to src/utils/matchUtils.ts, tests to src/utils/__tests__/matchUtils.test.ts. src/utils/ NOW EXISTS on that branch.
- computeTeamForm(matches, teamId, maxResults?) — LeagueTable (local, no export) + PR #229
- Main branch test count: 132 tests (verified locally 2026-09-28, all passing; build OK)
- PRs #250 and #252 both modify Fixtures.tsx — merge order matters (avoid conflicts)
- Genius Sports: User-Agent required in health check (CloudFront 403), but NOT needed in browser app (browser sends it automatically)
- getCurrentSeasonYear(): October is season transition month (month >= 10 ? year : year - 1)
  - Jan-Sep 2026 → returns '2025'; Oct-Dec 2026 → returns '2026'
  - AGENTS.md previously said "August" — corrected in PR #255 commit (2026-07-03)
  - PR #163 description says "August" but the CODE correctly uses October — tests confirm
  - PR #163 urgency comments: Jul-01 inaccurately said "August"; corrected Jul-05 to say "October"
  - PR #163 updated 2026-08-11: JSDoc added to getCurrentSeasonYear; CI now triggered and passing ✅
- ✅ RESOLVED 2026-09-28: dynamic season year is now MERGED on main (PR #262). getCurrentSeasonYear() used at euroleagueApi.ts:443/487/549/732. October-transition tests present. PR #163 can likely be closed as superseded.
- LeagueTable uses named export: { LeagueTable }
- No src/utils/ directory in main branch (dateUtils, fixtureUtils, matchUtils are all in pending PRs)
- Bug fixed in PR #250 (2026-06-29): counts.resultsCount badge was `< today`, now `<= today` to match filterMatchesByTab
- Protected files: CHANGELOG.md, package.json, package-lock.json — cannot be pushed to by Repo Assist

## Forward Work Notes
- After PR #225 (matchUtils) and PR #229 (form guide) merged: refactor LeagueTable computeTeamForm to share
- Do NOT create more code PRs until backlog reduces — focus on triaging and maintaining existing ones
- October 2026 deadline: PR #163 (dynamic season year) must be merged before October or app breaks
- AGENTS.md fix (#255) now also includes season month correction


## Auth Outage Log (consolidated)
- 23 CONSECUTIVE runs blocked by 401 Bad credentials on ALL GitHub MCP/gh reads: 2026-09-08 -> 2026-09-29 (21+ days).
- Effect: no repo state readable -> no triage, labeling, PR maintenance, or monthly-summary (#259) updates possible. No blind writes ever made.
- ACTION FOR MAINTAINER: rotate/replace the GitHub App token for the repo-assist workflow. This is a persistent 21-day credential outage, NOT transient.
- Latest checked: 2026-09-29 (run 36614850657) - still 401 on get_me and list_issues.

## 2026-09-28 (run 36477533325)
- TWENTY-SECOND consecutive 401 Bad credentials on get_me and list_issues. Outage 20+ days (2026-09-08 → 2026-09-28). No GitHub reads possible → no triage/labeling/monthly-summary (#259) update.
- ACTION FOR MAINTAINER: rotate the GitHub App token for the repo-assist workflow. 20-day persistent credential outage.
- Did LOCAL work instead (Task 3): verified baseline (132 tests pass, build OK, 2 lint errors on main), then created PR from branch `repo-assist/improve-extract-match-utils` extracting getMatchWinner/getMatchMargin into src/utils/matchUtils.ts. Lint now clean, 132 tests pass, build OK. AGENTS.md updated with src/utils/ + utility-test convention.
- Memory correction: dynamic season year already merged via PR #262 — earlier "October 2026 deadline" urgency is RESOLVED.
- Next run (if auth restored): verify PR list, close superseded PR #163, update monthly summary #259, work the uncommented-issue backlog.

## 2026-09-29 (run 36614850657)
- TWENTY-THIRD consecutive 401 Bad credentials on get_me and list_issues. Outage 21+ days (2026-09-08 -> 2026-09-29). No GitHub reads possible -> no triage/labeling/monthly-summary (#259) update.
- ACTION FOR MAINTAINER: rotate the GitHub App token for the repo-assist workflow. 21-day persistent credential outage, not transient.
- Did LOCAL work instead (Task 3): created branch `repo-assist/improve-leagueselector-tests` adding src/components/__tests__/LeagueSelector.test.tsx (8 tests). Test-only change, no source files touched -> conflict-free with other open PRs.
- Verified: 140 tests pass (132 baseline + 8 new), build OK. Lint: 2 pre-existing Fixtures.tsx react-refresh errors on main (fixed by pending PR from branch repo-assist/improve-extract-match-utils, 2026-09-28).
- Untested components remaining: TeamView, App. Good candidates for future runs.
- Next run (if auth restored): verify PR list, close superseded PR #163, update monthly summary #259, work the uncommented-issue backlog.
