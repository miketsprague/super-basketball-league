# Repo Assist Memory

## Last Updated
2026-05-03T06:38:00Z

## Last Run Tasks
- Task 2/3: Submitted 4 real GitHub PRs from existing branches
- Task 11: Updated Monthly Activity Summary #156

## Issue Backlog Cursor
Last processed: #162 (all non-automated open issues covered)

## Comments Made
- #7 (2026-03-03): Native Swift iOS app — feasibility overview
- #98 (2026-04-02): create_pull_request investigation — root cause and fix
- #101 (2026-04-15): Fix summary, test status, and branch name
- #101 (2026-04-17): PR submitted confirmation

## Open PRs (non-Repo Assist)
- #99: stale docs DRAFT PR — nudged 2026-04-19 (consider another nudge)

## PR Creation Status
- PR creation IS NOW WORKING (safeoutputs create_pull_request returns "success")
- PRs submitted this run (2026-05-03) — may appear after workflow completes:
  - fix-issue-101-euroleague-season-year (87 tests) — Closes #101
  - fix-issue-145-architecture-docs (docs only) — Closes #145
  - improve-tab-url-state — 81 tests
  - improve-pwa-manifest — 81 tests

## Proxy Issues to Close (when maintainer is ready)
#115, #116, #118, #120, #121, #123, #124, #126, #128, #130, #131, #132, #133, #135, #136, #137, #138, #140, #141, #142, #143, #147, #149, #151, #153, #155, #158, #159, #160, #161

## Branches Ready for PR (remaining after this run)
- repo-assist/improve-aria-tab-accessibility-2637d16-f52dda97d04969b6 — ARIA tab accessibility
- repo-assist/improve-leaguetable-logos-winpct-2637d16-47155fe9e9b9d887 — LeagueTable logos + W%
- repo-assist/improve-component-tests-errorboundary-teamview-99c1e151de4bc764 — ErrorBoundary/TeamView tests
- repo-assist/improve-component-tests-fixtures-2637d16-09d3a24a34c80364 — Fixtures tests
- repo-assist/improve-component-tests-leagueselector-leaguetable-ec8838853a183df0 — LeagueSelector/LeagueTable tests
- repo-assist/improve-component-tests-matchdetail-815058ea8b7f5927 — MatchDetail tests
- repo-assist/improve-polling-constants-refactor-b91abe1986e9c547 — polling constants refactor
- repo-assist/test-app-component-e5f391db7e4e99e1 — App component tests

## Monthly Activity Summary
- Issue #156: [Repo Assist] Monthly Activity 2026-05 — OPEN

## Current Repo State
- npm vulnerabilities: 0 (all fixed)
- Tests: 87 passing on main (fix-issue-101 branch adds 6 more euroleague tests)

## Round-Robin Task Schedule
- 2026-04-29T06:37: Task 7 (labelled #147), Task 10 (LeagueTable logos + W%), Task 11
- 2026-04-30T06:43: Task 7 (labelled #151), Task 10 (ARIA tab accessibility), Task 11
- 2026-05-01T06:44: Task 10 (Tab URL persistence), Task 11
- 2026-05-02T06:30: Task 2/3/5 (prepared 4 PR branches), Task 11
- 2026-05-03T06:38: Task 2/3 (submitted 4 real PRs), Task 11
- Next: Task 3 (more PRs from remaining branches), Task 1 (triage), Task 6 (nudge #99 again)

## Key Code Notes
- VITE_USE_MOCK_FALLBACK evaluated at module load — vi.stubEnv needs vi.resetModules()
- Match.homeTeam/awayTeam are Team objects: { id, name, shortName, logo? }
- StandingsEntry.team is Team object; has pointsFor/Against/Difference
- MatchDetails extends Match; homeStats/awayStats/homePlayers/awayPlayers; quarterScores optional
- @testing-library/user-event NOT installed; use fireEvent
- Fixtures.tsx: useNavigate + useSearchParams — mock useNavigate, wrap in MemoryRouter
- MatchDetail.tsx: useParams, useNavigate, useSearchParams — MemoryRouter with Routes
- App.tsx: uses Routes (not BrowserRouter) — wrap in MemoryRouter; BrowserRouter in main.tsx
- App.tsx (main): activeTab now in URL param ?tab=table (not useState) — pending PR
- getCurrentSeasonYear() from euroleagueApi.ts — test with vi.setSystemTime()
- vitest: must import { describe, it, expect, vi } from 'vitest' explicitly
- MatchDetail polling: vi.useFakeTimers() BEFORE render; vi.runAllTimersAsync() in act()
- POLL_INTERVAL_MS and LIVE_POLL_INTERVAL_MS in src/constants.ts (pending branch)
- PWA manifest (pending PR): public/manifest.json + basketball.svg; index.html uses %BASE_URL%
- LeagueTable (pending): team logos 20x20px aria-hidden, W% column desktop-only
- ARIA tab accessibility (pending): App.tsx nav has tablist/tab/aria-selected/tabpanel/aria-labelledby
