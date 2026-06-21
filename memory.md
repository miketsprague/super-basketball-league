# Repo Assist Memory

## Last Updated
2026-06-21T15:30:00Z

## Last Run Tasks
- Task 5: PRs #244, #245 CI passing ✅
- Task 10: Created PR #246 — computeScoringAverage + scoring stats banner in TeamView — 119 tests ✅
- Task 11: Updated June 2026 monthly activity issue #222

## Issue Backlog Cursor
Last processed: #236 (2026-06-12). No new issues since.

## Comments Made
- #7 (2026-03-03): Native Swift iOS app — feasibility overview
- #99 (2026-05-04): Second nudge — do not nudge again
- #101 (2026-04-17): Fix implemented, PR #163 ready
- #145 (2026-06-05): Linked to PR #164
- #174 (2026-05-07): Explained package-lock.json protected-file failure
- #216 (2026-06-03): Daily-repo-status auth failure
- #218 (2026-06-01): API health check failure — transient
- #230 (2026-06-08): API health check failure — transient; PR #231 created
- #232 (2026-06-09): Both Genius Sports endpoints failing; PR #233 created
- #235 (2026-06-12): Workflow auth failure — infrastructure issue
- #236 (2026-06-12): API health check failure — off-season; linked to #233/#234

## Open Repo Assist PRs (2026-06-21)
Active (not superseded):
- #163: fix: CURRENT_SEASON_YEAR → dynamic (Closes #101) ✅ clean
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
- #213: fix: preserve data on auto-refresh fail ✅ clean
- #225: fix: move match utils to matchUtils.ts ✅ clean
- #226: chore: release v0.1.0
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
- #246: feat: computeScoringAverage + scoring avg banner in TeamView ✅ CREATED 2026-06-21
Superseded (close these): #169 (by #180), #171 (by #237), #173 (by #228)

## Non-Repo-Assist PRs
- #99: stale Copilot docs PR (nudged twice — do not nudge again)

## Proxy Issues to Close
#115-#116, #118, #120-#121, #123-#124, #126, #128, #130-#133, #135-#138, #140-#143, #147, #149, #151, #153, #155, #158-#161

## Monthly Activity Summary
Issue #222: OPEN (June 2026) — updated 2026-06-21

## API Health Check Pattern
- Failures: Jun 1, Jun 8, Jun 9, Jun 12 (Genius Sports off-season)
- Passes: Jun 13, Jun 14, Jun 17, Jun 18, Jun 19
- PR #231 MERGED: adds diagnostics; PR #233 (open): dedup; PR #234 (open): season-aware
- PR #238: Promise.allSettled partial resilience

## Round-Robin Next
- Done 2026-06-21: Task 5, Task 10, Task 11
- Next: Task 1 (issue triage), Task 7 (labels), Task 9 (new contributors), Task 6 (stale PR nudges)

## Key Code Notes
- vitest: import { describe, it, expect, vi } from 'vitest' explicitly
- @testing-library/user-event NOT installed — use fireEvent
- Match.homeTeam/awayTeam: Team { id, name, shortName, logo? }; venue required ('TBC' if unknown)
- src/components/__tests__/: Fixtures.winner.test.ts, LeagueTable.test.tsx, MatchDetail.shareButton.test.tsx
- src/services/__tests__/: dataProvider, euroleagueApi, geniusSportsApi, leagues, teamStorage
- localStorage mock: Node.js 25+ native stub shadows jsdom — use explicit storageMock pattern
- App.tsx: uses Routes (not BrowserRouter) — wrap in MemoryRouter for tests
- vi.stubEnv for PROD: boolean (true/false) not string
- ESLint errors in Fixtures.tsx (2 pre-existing react-refresh errors — fixed in PR #225)
- computeTeamForm(matches, teamId, maxResults?) — teamStorage (PR #229)
- computeTeamRecord(matches, teamId): TeamRecord — teamStorage (PR #241)
- computeNextFixture(matches, teamName): Match | null — teamStorage (PR #242)
- computeHomeAwayRecord(matches, teamName): HomeAwayRecord — teamStorage (PR #244)
- computeWinStreak(matches, teamName): WinStreak | null — teamStorage (PR #245)
- computeScoringAverage(matches, teamName): ScoringAverage | null — teamStorage (PR #246)
- computeH2HRecord from dataProvider.ts (PR #227, not merged)
- Genius Sports: User-Agent required in health check (CloudFront 403)
- getCurrentSeasonYear(): August = season transition (euroleagueApi.ts, PR #163)
- LeagueTable uses named export: { LeagueTable }
- TeamView shows: H/A record (PR #244), streak badge (PR #245), scoring avg banner (PR #246)
- calendarExport.ts in src/utils/ (PR #243): generateICalContent, formatICalDateTime, etc.
- Main branch test count: 108 tests — PRs add 11 each on average
