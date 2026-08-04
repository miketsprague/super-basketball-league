# Repo Assist Memory

## Last Updated
2026-08-04T15:59:54Z

## Last Run Tasks
- Task 5: CI verification — PR #255 ✅, PR #252 ✅, PR #163 no CI; main: 108 tests passing
- Task 3: Codebase study — no new PRs (backlog too large)
- Task 11: Updated monthly activity issue #259

## Issue Backlog Cursor
Last processed: #257 (2026-07-08). No new user issues since #236.
Note: #7 is only open real user issue; all proxy/automated issues are not user-facing.
Issue #258: agentic-workflows Detection Runs — infrastructure, no action needed.

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
- PR #163 (2026-07-01): August urgency comment (INACCURATE — corrected 2026-07-05)
- PR #163 (2026-07-05): Correction comment — deadline is October, not August

## Open Repo Assist PRs (2026-08-04)
Active (not superseded):
- #163: fix: CURRENT_SEASON_YEAR → dynamic (Closes #101) — no CI ⚠️ URGENT: breaks Oct 2026 season transition
- #164: docs: fix ARCHITECTURE.md (Closes #145)
- #165: feat: persist active tab in URL
- #166: feat: PWA manifest and basketball icon
- #168: feat: team logos + W% in LeagueTable
- #176: test: MatchDetail (29 tests)
- #178: test: App (17 tests) ✅ clean
- #180: feat: keyboard nav + ARIA roles (supersedes #169)
- #182: test: TeamView (12 tests)
- #184: feat: playoff/relegation zones
- #185: feat: highlight followed team fixtures
- #187: feat: last refreshed timestamp
- #189: feat: team search/filter
- #191: feat: highlight followed team in league table
- #193: feat: service worker/PWA
- #195: feat: LIVE badge on Fixtures tab
- #197: feat: adaptive polling 30s when live
- #203: feat: skeleton loading screens
- #205: feat: dark mode toggle
- #207: feat: season record banner in TeamView
- #211: feat: sortable columns in LeagueTable
- #213: fix: preserve data on auto-refresh ✅ clean
- #225: fix: move match utils to matchUtils.ts ✅ clean
- #226: chore: release v0.1.0 — CHANGELOG.md protected file; cannot be auto-updated; maintainer must update CHANGELOG manually
- #227: feat: head-to-head section in MatchDetail
- #228: test: Fixtures (26 tests) ✅ clean
- #229: feat: pre-match form guide in MatchDetail
- #233: ci: deduplicate health check issues ✅ clean
- #234: ci: season-aware health check
- #237: test: ErrorBoundary+LeagueSelector (14 tests) ✅
- #238: fix: Promise.allSettled in fetchGeniusSportsAllData ✅
- #239: feat: Fixtures ARIA roles ✅
- #240: feat: 10s request timeout ✅
- #241: feat: computeTeamRecord utility ✅
- #242: feat: computeNextFixture + Next Game banner ✅
- #243: feat: iCal calendar export ✅
- #244: feat: computeHomeAwayRecord + H/A record in TeamView ✅
- #245: feat: computeWinStreak + streak badge in TeamView ✅
- #246: feat: computeScoringAverage + scoring avg banner in TeamView ✅
- #247: feat: computeCloseGameRecord + clutch record banner in TeamView ✅
- #248: feat: computeAverageMargin + avg margin banner in TeamView ✅
- #249: feat: computeRecentRecord + recent form banner in TeamView ✅
- #250: fix: include today's completed matches in Results tab ✅ clean
- #251: feat: shared date formatting utilities (dateUtils.ts) — 24 new tests ✅
- #252: fix: update 'today' at midnight — useState+useEffect midnight scheduler, 5 new tests ✅ clean
- #255: docs: correct AGENTS.md test file locations + naming convention + season month fix ✅ CI passing
Superseded (close these): #169 (by #180), #171 (by #237), #173 (by #228)

## Non-Repo-Assist PRs
- #99: stale Copilot docs PR (nudged twice — do not nudge again)

## Proxy Issues to Close
#115-#116, #118, #120-#121, #123-#124, #126, #128, #130-#133, #135-#138, #140-#143, #147, #149, #151, #153, #155, #158-#161

## Monthly Activity Summary
Issue #254 (July 2026): CLOSED 2026-08-01
Issue #259 (August 2026): open — updated 2026-08-04

## API Health Check Pattern
- Failures: Jun 1, Jun 8, Jun 9, Jun 12 (Genius Sports off-season), Jun 30 (auth transient), Jul 8 (off-season)
- Passes: Jun 13, Jun 14, Jun 17, Jun 18, Jun 19, Jul 3, Jul 4, Jul 7, Jul 9, Jul 15, Jul 22, Jul 23
- PR #231 MERGED: adds diagnostics; PR #233 (open): dedup; PR #234 (open): season-aware
- PR #238: Promise.allSettled partial resilience

## Dependency Status (2026-06-28)
Blocked: package.json + package-lock.json are protected files. Maintainer must run `npm update` + commit manually.
Note: npm audit shows 9 vulnerabilities (1 low, 7 high, 1 critical) — maintainer should run `npm audit fix`.

## Round-Robin Next
- Done 2026-08-04: Task 5 (CI verification), Task 3 (codebase study), Task 11
- Done 2026-08-03: Task 7 (labelling scan), Task 1 (issue triage), Task 11
- Done 2026-08-02: Task 5 (CI verification), Task 1 (issue triage), Task 11
- Done 2026-08-01: Task 11 (close July, open August)
- Done 2026-07-31: Task 5 (PR CI verification), Task 11
- Done 2026-07-30: Task 5 (PR CI verification), Task 11
- Done 2026-07-29: Task 1 (issue triage), Task 11
- Done 2026-07-28: Task 5 (PR CI verification), Task 11
- Next: Task 1 (issue triage — check for new issues), Task 8 (release prep check), Task 10 (forward progress), Task 11

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
- ESLint errors in Fixtures.tsx (2 pre-existing react-refresh errors — fixed in PR #225)
- computeTeamForm(matches, teamId, maxResults?) — LeagueTable (local, no export) + PR #229
- Main branch test count: 108 tests (on main as of 2026-08-04)
- PRs #250 and #252 both modify Fixtures.tsx — merge order matters (avoid conflicts)
- Genius Sports: User-Agent required in health check (CloudFront 403), but NOT needed in browser app (browser sends it automatically)
- getCurrentSeasonYear(): October is season transition month (month >= 10 ? year : year - 1)
  - Jan-Sep 2026 → returns '2025'; Oct-Dec 2026 → returns '2026'
  - AGENTS.md previously said "August" — corrected in PR #255 commit (2026-07-03)
  - PR #163 description says "August" but the CODE correctly uses October — tests confirm
  - PR #163 urgency comments: Jul-01 inaccurately said "August"; corrected Jul-05 to say "October"
- CURRENT_SEASON_YEAR = '2025' still hardcoded on main — ⚠️ breaks October 2026 season transition
- LeagueTable uses named export: { LeagueTable }
- No src/utils/ directory in main branch (dateUtils, fixtureUtils, matchUtils are all in pending PRs)
- Bug fixed in PR #250 (2026-06-29): counts.resultsCount badge was `< today`, now `<= today` to match filterMatchesByTab
- Protected files: CHANGELOG.md, package.json, package-lock.json — cannot be pushed to by Repo Assist

## Forward Work Notes
- After PR #225 (matchUtils) and PR #229 (form guide) merged: refactor LeagueTable computeTeamForm to share
- Do NOT create more code PRs until backlog reduces — focus on triaging and maintaining existing ones
- October 2026 deadline: PR #163 (dynamic season year) must be merged before October or app breaks
- AGENTS.md fix (#255) now also includes season month correction
