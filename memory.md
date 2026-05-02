# Repo Assist Memory

## Last Updated
2026-05-02T06:30:00Z

## Last Run Tasks
- Task 2/3/5: Created 4 real PRs from existing remote branches (PR creation now works!)
- Task 11: Updated Monthly Activity Summary #156

## Issue Backlog Cursor
Last processed: #156 (all non-automated open issues covered)

## Comments Made
- #7 (2026-03-03): Native Swift iOS app — feasibility overview
- #98 (2026-04-02): create_pull_request investigation — root cause and fix
- #101 (2026-04-15): Fix summary, test status, and branch name
- #101 (2026-04-17): PR submitted confirmation

## Open PRs (non-Repo Assist)
- #99: stale docs DRAFT PR — nudged 2026-04-19 (>14d ago, consider another nudge on 2026-05-03)

## PR Creation Status
- PR creation IS NOW WORKING (lock files regenerated 2026-04-16)
- Created 4 PRs in run 2026-05-02:
  - fix-issue-101-euroleague-season-year (87 tests) — Closes #101
  - fix-issue-145-architecture-docs (docs only) — Closes #145
  - improve-tab-url-state — 81 tests
  - improve-pwa-manifest — 81 tests

## Branches Ready for PR (remaining)
- repo-assist/improve-aria-tab-accessibility-2637d16-f52dda97d04969b6 — ARIA tab accessibility — issue #121?
- repo-assist/improve-leaguetable-logos-winpct-2637d16-47155fe9e9b9d887 — LeagueTable logos + W%
- repo-assist/fix-issue-101-euroleague-season-year-63610fbef8098669-* — older variants (skip, main branch created)
- repo-assist/improve-component-tests-errorboundary-teamview-99c1e151de4bc764
- repo-assist/improve-component-tests-fixtures-2637d16-09d3a24a34c80364
- repo-assist/improve-component-tests-leagueselector-leaguetable-ec8838853a183df0
- repo-assist/improve-component-tests-matchdetail-815058ea8b7f5927
- repo-assist/improve-polling-constants-refactor-b91abe1986e9c547
- repo-assist/test-app-component-e5f391db7e4e99e1
These should be turned into PRs in future runs (4 per run limit reached)

## Monthly Activity Summary
- Issue #156: [Repo Assist] Monthly Activity 2026-05 — OPEN

## Current Repo State
- npm vulnerabilities: 0 (all fixed)
- Tests: 87 passing on main (fix-issue-101 branch adds 6 more euroleague tests)
- Proxy issues to close (superseded by real PRs or can be cleaned up):
  - #115, #116, #118, #120, #123, #124, #126, #128, #130-#133, #135, #136 (old duplicates)
  - #147, #149, #151, #153 (proxy issues from before PR creation was fixed)

## Round-Robin Task Schedule
- 2026-04-29T06:37: Task 7 (labelled #147), Task 10 (LeagueTable logos + W%), Task 11
- 2026-04-30T06:43: Task 7 (labelled #151), Task 10 (ARIA tab accessibility), Task 11
- 2026-05-01T06:44: Task 10 (Tab URL persistence), Task 11
- 2026-05-02T06:30: Task 2/3/5 (created 4 real PRs), Task 11
- Next: Task 3 (more PRs from remaining branches), Task 1 (triage #7 still open), Task 6 (nudge #99)

## Key Code Notes
- VITE_USE_MOCK_FALLBACK evaluated at module load — vi.stubEnv needs vi.resetModules()
- Match.homeTeam/awayTeam are Team objects: { id, name, shortName, logo? }
- StandingsEntry.team is Team object; has pointsFor/Against/Difference
- MatchDetails extends Match; homeStats/awayStats/homePlayers/awayPlayers; quarterScores optional
- @testing-library/user-event NOT installed; use fireEvent
- Fixtures.tsx: useNavigate + useSearchParams — mock useNavigate, wrap in MemoryRouter
- MatchDetail.tsx: useParams, useNavigate, useSearchParams — MemoryRouter with Routes
- App.tsx: uses Routes (not BrowserRouter) — wrap in MemoryRouter; BrowserRouter in main.tsx
- App.tsx (main): activeTab now in URL param ?tab=table (not useState) — as of 2026-05-02 (pending PR)
- getCurrentSeasonYear() from euroleagueApi.ts — test with vi.setSystemTime()
- vitest: must import { describe, it, expect, vi } from 'vitest' explicitly
- MatchDetail polling: vi.useFakeTimers() BEFORE render; vi.runAllTimersAsync() in act()
- POLL_INTERVAL_MS and LIVE_POLL_INTERVAL_MS in src/constants.ts (pending branch)
- PWA manifest (pending PR): public/manifest.json + basketball.svg; index.html uses %BASE_URL%
- LeagueTable (pending): team logos 20x20px aria-hidden, W% column desktop-only
- ARIA tab accessibility (pending): App.tsx nav has tablist/tab/aria-selected/tabpanel/aria-labelledby
