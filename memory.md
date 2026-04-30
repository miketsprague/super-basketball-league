# Repo Assist Memory

## Last Updated
2026-04-30T06:44:00Z

## Last Run Tasks
- Task 7: Labelled #151 with `enhancement`
- Task 10: ARIA tab accessibility in App.tsx — branch repo-assist/improve-aria-tab-accessibility-2637d16, 81/81 tests
- Task 11: Updated Monthly Activity 2026-04 issue (#94)

## Issue Backlog Cursor
Last processed: #152 (all non-automated open issues covered)

## Comments Made
- #7 (2026-03-03): Native Swift iOS app — feasibility overview
- #98 (2026-04-02): create_pull_request investigation — root cause and fix
- #101 (2026-04-15): Fix summary, test status, and branch name
- #101 (2026-04-17): PR submitted confirmation
- #99 (2026-04-19): Stale PR nudge

## Open PRs (non-Repo Assist)
- #99: stale docs DRAFT PR — nudged 2026-04-19 (14-day stale ~2026-05-03)

## KEY ISSUE: GitHub Actions cannot create PRs
- create_pull_request creates proxy issues instead of real PRs
- Fix: Settings > Actions > General > enable "Allow GitHub Actions to create and approve pull requests"

## Branches Ready for PR
- repo-assist/improve-aria-tab-accessibility-2637d16 — ARIA tab accessibility — 81/81 (2026-04-30)
- repo-assist/improve-leaguetable-logos-winpct-2637d16 — LeagueTable logos + W% — proxy #151
- repo-assist/improve-pwa-manifest-2637d16-9ae14711dd10a82c — PWA manifest — proxy #149
- repo-assist/fix-issue-145-architecture-docs-94a92a011ae44981 — ARCHITECTURE.md fix — proxy #147
- repo-assist/fix-issue-101-euroleague-season-year-63610fbef8098669 — EuroLeague season year — 87/87 — issue #140
- repo-assist/test-app-component-e5f391db7e4e99e1 — App tests (15) — issue #142
- repo-assist/improve-component-tests-leagueselector-leaguetable-ec8838853a183df0 — LeagueSel/Table tests (33) — issue #143
- repo-assist/improve-component-tests-errorboundary-teamview-99c1e151de4bc764 — ErrorBoundary/TeamView tests (31) — issue #121
- repo-assist/improve-component-tests-fixtures-2637d16-09d3a24a34c80364 — Fixtures tests (33) — issue #137
- repo-assist/improve-component-tests-matchdetail-815058ea8b7f5927 — MatchDetail tests (38) — issue #138
- repo-assist/improve-polling-constants-refactor-b91abe1986e9c547 — polling constants refactor — issue #141

## Monthly Activity Summary
- Issue #94: [Repo Assist] Monthly Activity 2026-04 — open, updated 2026-04-30

## Current Repo State
- npm vulnerabilities: 0 (all fixed)
- Tests: 81 passing on main
- Duplicate issues to close: #115, #116, #118, #120, #123, #124, #126, #128, #130-#133, #135, #136

## Round-Robin Task Schedule
- 2026-04-29T06:37: Task 7 (labelled #147), Task 10 (LeagueTable logos + W%), Task 11
- 2026-04-30T06:43: Task 7 (labelled #151), Task 10 (ARIA tab accessibility), Task 11
- Next: Task 6 (stale PR #99 nudge ~2026-05-03), Task 1 (new issues?), Task 10 (service worker/offline or keyboard nav for tabs)

## Key Code Notes
- VITE_USE_MOCK_FALLBACK evaluated at module load — vi.stubEnv needs vi.resetModules()
- Match.homeTeam/awayTeam are Team objects: { id, name, shortName, logo? }
- StandingsEntry.team is Team object; has pointsFor/Against/Difference
- MatchDetails extends Match; homeStats/awayStats/homePlayers/awayPlayers; quarterScores optional
- @testing-library/user-event NOT installed; use fireEvent
- Fixtures.tsx: useNavigate + useSearchParams — mock useNavigate, wrap in MemoryRouter
- MatchDetail.tsx: useParams, useNavigate, useSearchParams — MemoryRouter with Routes
- App.tsx: uses Routes (not BrowserRouter) — wrap in MemoryRouter; BrowserRouter in main.tsx
- getCurrentSeasonYear() from euroleagueApi.ts — test with vi.setSystemTime()
- vitest: must import { describe, it, expect, vi } from 'vitest' explicitly
- MatchDetail polling: vi.useFakeTimers() BEFORE render; vi.runAllTimersAsync() in act()
- POLL_INTERVAL_MS and LIVE_POLL_INTERVAL_MS in src/constants.ts (pending branch only)
- PWA manifest (pending): public/manifest.json + basketball.svg; index.html uses %BASE_URL%
- LeagueTable (pending): team logos 20x20px aria-hidden, W% column desktop-only
- ARIA tab accessibility (pending): App.tsx nav has tablist/tab/aria-selected/tabpanel/aria-labelledby
