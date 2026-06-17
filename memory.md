# Repo Assist Memory

## Last Updated
2026-06-17T16:58:00Z

## Last Run Tasks
- Task 10 (forward progress): Created PR #242 — feat: add computeNextFixture utility and Next Game banner in TeamView — 116 tests ✅
- Task 5 (maintain PRs): Verified PRs #163, #178 CI status — both mergeable_state: clean ✅
- Task 11: Updated June 2026 monthly activity issue #222

## Issue Backlog Cursor
Last processed: #236 (commented 2026-06-12)
No new issues since #236 as of 2026-06-17.

## Comments Made
- #7 (2026-03-03): Native Swift iOS app — feasibility overview
- #99 (2026-05-04): Second nudge — do not nudge again
- #101 (2026-04-17): Two comments: fix implemented, PR ready (note: PR #163 is the current live PR)
- #145 (2026-06-05): Linked to PR #164 for ARCHITECTURE.md fix
- #174 (2026-05-07): Explained package-lock.json protected-file failure
- #216 (2026-06-03): Daily-repo-status auth failure — explained transient issue, suggested fix
- #218 (2026-06-01): API health check failure — identified as transient; second run passed
- #230 (2026-06-08): API health check failure — identified as likely transient (same pattern as Jun 1); PR #231 created for better diagnostics
- #232 (2026-06-09): API health check failure — BOTH Genius Sports endpoints failing, likely season-end escalation; PR #233 created for deduplication
- #235 (2026-06-12): Repo Assist workflow failure (authentication expired mid-run) — infrastructure issue, no code fix needed
- #236 (2026-06-12): API health check failure — recurring off-season pattern; linked to fix PRs #233 and #234

## Open Repo Assist PRs (as of 2026-06-17 16:58)
- #163: fix: replace hardcoded CURRENT_SEASON_YEAR (Closes #101) — mergeable_state: clean ✅
- #164: docs: fix ARCHITECTURE.md (Closes #145) — docs only
- #165: feat: persist active tab in URL — 81 tests ✅
- #166: feat: PWA manifest and basketball icon — 81 tests ✅
- #168: feat: team logos + W% in LeagueTable — 81 tests ✅
- #169: feat: ARIA tab roles — SUPERSEDED by #180
- #171: test: ErrorBoundary/LeagueSelector/LeagueTable — SUPERSEDED by #237
- #173: test: Fixtures (25 tests) — SUPERSEDED by #228
- #176: test: MatchDetail (29 tests) — 110 total ✅
- #178: test: App (17 tests) — mergeable_state: clean ✅
- #180: feat: keyboard nav + ARIA roles for tabs — 91 tests ✅
- #182: test: TeamView (12 tests) — 93 total ✅
- #184: feat: configurable playoff/relegation zones — 89 tests ✅
- #185: feat: highlight followed team fixtures — 81 tests ✅
- #187: feat: last refreshed timestamp in fixtures — 85 tests ✅
- #189: feat: team search/filter in Fixtures — 88 tests ✅
- #191: feat: highlight followed team row in league table — 87 tests ✅
- #193: feat: service worker for offline/PWA — 87 tests ✅
- #195: feat: LIVE badge on Fixtures tab — 86 tests ✅
- #197: feat: adaptive polling 30s when live — 86 tests ✅
- #203: feat: skeleton loading screens — 93 tests ✅
- #205: feat: dark mode toggle — 91 tests ✅
- #207: feat: season record stats banner in TeamView — 91 tests ✅
- #211: feat: sortable columns in LeagueTable — 93 tests ✅
- #213: fix: preserve existing data when auto-refresh fails — 86 tests ✅ mergeable_state: clean
- #225: fix: move match utility functions to src/utils/matchUtils.ts — 108 tests ✅ lint clean — mergeable_state: clean
- #226: chore: release v0.1.0 — CHANGELOG.md + version bump — 108 tests ✅
- #227: feat: add head-to-head season record section to MatchDetail — 119 tests ✅
- #228: test: add Fixtures component tests (26 tests) — CI passing ✅ — mergeable_state: clean
- #229: feat: pre-match team form guide in MatchDetail — 117 tests ✅
- #233: ci: deduplicate health check failure issues — workflow only — mergeable_state: clean
- #234: ci: make API health check season-aware for Genius Sports — workflow only
- #237: test: add ErrorBoundary and LeagueSelector component tests (14 tests) — 122 tests ✅ — CI PASSING ✅
- #238: fix: use Promise.allSettled in fetchGeniusSportsAllData — 111 tests ✅ — CI PASSING ✅
- #239: feat: improve Fixtures accessibility (ARIA roles/labels) — 123 tests ✅ — CI PASSING ✅
- #240: feat: add 10-second request timeout to Genius Sports + EuroLeague API fetch calls — 114 tests ✅ — CI PASSING ✅
- #241: feat: add computeTeamRecord utility to teamStorage — 117 tests ✅ — CREATED 2026-06-16
- #242: feat: add computeNextFixture utility and Next Game banner in TeamView — 116 tests ✅ — CREATED 2026-06-17

## Recently Merged PRs
- #199: feat: add share/copy-link button to MatchDetail ✅ MERGED (2026-06-01)
- #201: feat: add team form guide to league table ✅ MERGED (2026-06-01)
- #209: feat: highlight winning team and show score margin ✅ MERGED (2026-06-01)
- #221: docs: add AGENTS.md with project conventions ✅ MERGED (2026-06-01)
- #231: ci: add failure diagnostics to API health check issue reports ✅ MERGED (2026-06-09)

## Open Non-Repo-Assist PRs
- #99: stale Copilot docs PR (nudged twice — do not nudge again)

## PR Notes
- Deps PRs BLOCKED: package-lock.json is a protected file
- PR creation IS WORKING
- ESLint errors from PR #209 fixed in PR #225 (not yet merged) — mergeable_state: clean
- Current main HEAD: 5a1a8ec (PR #231 merged 2026-06-09)
- AGENTS.md is in main (merged via PR #221)
- Release v0.1.0 PR is #226
- PR #171 superseded by #237 (new PR with just ErrorBoundary + LeagueSelector tests, no conflict)
- PR #173 superseded by #228 (new Fixtures tests PR)
- PR #169 superseded by #180 (keyboard nav + ARIA)
- computeTeamForm(matches, teamId, maxResults?) now exported from teamStorage.ts (added in PR #229)
- FormResult = 'W' | 'L' exported from teamStorage.ts
- computeH2HRecord + H2HRecord exported from dataProvider.ts (added in PR #227, not yet merged)
- computeTeamRecord + TeamRecord exported from teamStorage.ts (added in PR #241)
- computeNextFixture(matches, teamName) exported from teamStorage.ts (added in PR #242)
- PR #233: deduplication (comment on existing issue), clean against main — protected file
- PR #234: season-aware health check, clean against main — protected file; non-conflicting with #233
- Main branch test count: 108 tests (8 test files) — current main
- PR #242 (pending): 116 tests on its branch; adds computeNextFixture to teamStorage.ts + Next Game banner to TeamView
- PR #241 (pending): 117 tests on its branch; adds computeTeamRecord to teamStorage.ts
- PR #240 (pending): 10-second AbortController timeout in fetchFromGeniusSports, fetchXMLFromEuroLeague, fetchJSONFromEuroLeagueV2 — 114 tests on its branch
- AbortError detection: fetchError instanceof Error && fetchError.name === 'AbortError'
- REQUEST_TIMEOUT_MS = 10000 added to both geniusSportsApi.ts and euroleagueApi.ts
- PR #237 (pending): will bring to 122/10 tests
- PR #238 (pending): uses Promise.allSettled in fetchGeniusSportsAllData — 111 tests on its branch
- PR #239 (pending): accessibility improvements to Fixtures.tsx — 123 tests on its branch

## Proxy Issues to Close
#115, #116, #118, #120, #121, #123, #124, #126, #128, #130-#133, #135-#138, #140-#143, #147, #149, #151, #153, #155, #158-#161

## Monthly Activity Summary
- Issue #222: OPEN (June 2026) — updated this run (2026-06-17)

## API Health Check Pattern
- Genius Sports failures: Jun 1 (/standings), Jun 8 (/standings), Jun 9 (/standings AND /schedule), Jun 12 (/standings HTTP 500)
- Jun 13: API Health Check PASSED ✅
- Jun 14 09:46 UTC: API Health Check PASSED ✅ (run #102)
- Jun 17 11:07 UTC: API Health Check PASSED ✅ (run #105)
- EuroLeague endpoints: passed all runs
- Season-end confirmed: SLB season typically ends April/May; off-season HTML lacks CSS selectors
- PR #231 (MERGED 2026-06-09): adds diagnostic info to failure issues
- PR #233 (open): prevents duplicate issues on recurring failures
- PR #234 (open): makes health check season-aware; skips CSS selector checks Jun-Sep
- PR #238 (open): fetchGeniusSportsAllData now returns partial data if only one endpoint fails

## Round-Robin Next
- 2026-06-17 16:58: Task 10 (computeNextFixture PR #242), Task 5 (CI verify #163, #178), Task 11 (monthly summary)
- Next: Task 1 (issue triage — no new issues), Task 4 (deps — blocked), Task 7 (labels), Task 9 (new contributors), Task 6 (stale PR nudges)

## Key Code Notes
- vitest: import { describe, it, expect, vi } from 'vitest' explicitly
- @testing-library/user-event NOT installed — use fireEvent
- Match.homeTeam/awayTeam: Team { id, name, shortName, logo? }; venue required (can be 'TBC')
- MatchDetail.tsx: useParams, useNavigate, useSearchParams — MemoryRouter+Routes path="/match/:matchId"
- MatchDetail polling: vi.useFakeTimers() BEFORE render; vi.advanceTimersByTime(15001) works
- Fake timers + async fetch: act(async () => { await Promise.resolve(); }) to flush useEffect
- App.tsx: uses Routes (not BrowserRouter) — wrap in MemoryRouter for tests
- Fixtures.tsx: default tab shows date >= today || status === 'live'; results tab: past completed
- Fixtures.tsx: now shows venue below teams (when not 'TBC'), "View details →" text on every card
- src/services/__tests__/ dir exists for service tests
- src/__tests__/ does NOT exist on main
- src/components/__tests__/ has 3 test files on main: Fixtures.winner.test.ts, LeagueTable.test.tsx, MatchDetail.shareButton.test.tsx
- PR #237 adds: ErrorBoundary.test.tsx + LeagueSelector.test.tsx (components/__tests__/)
- PR #178 adds: App.test.tsx — located in src/__tests__/App.test.tsx
- PR #213 adds: src/__tests__/App.test.tsx (isInitialLoad bug fix tests)
- getMatchWinner/getMatchMargin in Fixtures.tsx (2 ESLint errors — moved to utils in PR #225)
- computeH2HRecord + H2HRecord exported from dataProvider.ts (PR #227, not yet merged)
- computeTeamForm(matches, teamId, maxResults?) exported from teamStorage.ts (PR #229)
- computeTeamRecord(matches, teamId) + TeamRecord exported from teamStorage.ts (PR #241)
- computeNextFixture(matches, teamName): Match | null — exported from teamStorage.ts (PR #242)
- FormResult = 'W' | 'L' exported from teamStorage.ts
- LeagueTable: uses named export: { LeagueTable } not default export
- App.tsx: POLL_INTERVAL hardcoded at 5min on main (PR #197 adds adaptive polling, not merged)
- localStorage mock: Node.js 25+ native stub shadows jsdom — always use explicit storageMock pattern
- Genius Sports API: User-Agent required in health check (CloudFront blocks headless Chrome with 403)
- vi.stubEnv for PROD: use boolean (true/false) not string
- Fixtures shows match.homeTeam.shortName and match.awayTeam.shortName (not fullName) in match cards
- getCurrentSeasonYear(): August = season transition month (euroleagueApi.ts, pending PR #163)
- fetchGeniusSportsAllData now uses Promise.allSettled (PR #238) — returns partial data on single-endpoint failure
- Fixtures.tsx ARIA (PR #239): role="tablist" on filter bar, role="tab"/aria-selected on each tab, role="tabpanel" on matches container, aria-label on each match card button
- Fixtures.accessibility.test.tsx: uses real useSearchParams (only mocks useNavigate), MemoryRouter with initialEntries for tab state
- TeamView.tsx: uses useMemo for computeNextFixture; shows "Next Game" banner above fixtures when upcoming match exists
