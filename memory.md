# Repo Assist Memory

## Last Updated
2026-05-09T06:27:00Z

## Last Run Tasks
- Task 10: Keyboard navigation PR for tabs (91 tests ✅) — supersedes #169
- Task 11: Updated Monthly Activity Summary #156

## Issue Backlog Cursor
Last processed: #175 (all non-automated open issues covered)

## Comments Made
- #7 (2026-03-03): Native Swift iOS app — feasibility overview
- #98 (2026-04-02): create_pull_request investigation — root cause and fix
- #101 (2026-04-15): Fix summary, test status, and branch name
- #101 (2026-04-17): PR submitted confirmation
- #99 (2026-04-19): Nudge — stale PR, suggested merge or close
- #99 (2026-05-04): Second nudge — tooling now working, suggest merge or close
- #174 (2026-05-07): Explained package-lock.json protected-file failure

## Open Repo Assist PRs
- #163: fix: replace hardcoded CURRENT_SEASON_YEAR (Closes #101) — 87 tests ✅
- #164: docs: fix ARCHITECTURE.md (Closes #145) — docs only
- #165: feat: persist active tab in URL — 81 tests ✅
- #166: feat: PWA manifest and basketball icon — 81 tests ✅
- #168: feat: team logos + W% in LeagueTable — 81 tests ✅
- #169: feat: ARIA tab roles and panel ids — SUPERSEDED by keyboard nav PR below
- #171: test: component tests ErrorBoundary/LeagueSelector/LeagueTable — 104 tests ✅
- #173: test: Fixtures component tests (25 tests, 106 total) ✅
- #176: test: MatchDetail component tests (29 tests, 110 total) ✅
- #178: test: App component tests (17 tests, 98 total) ✅
- TBD (submitted 2026-05-09): feat: keyboard navigation + ARIA roles for tabs — 91 tests ✅

## Open Non-Repo-Assist PRs
- #99: stale Copilot docs PR (nudged twice, Apr 19 + May 4)

## PR Creation Status
- PR creation IS WORKING
- IMPORTANT: Deps update PRs are BLOCKED — package-lock.json is a protected file. Will always fail unless `allowed-files` is configured or `protected-files: fallback-to-issue` is set.

## Proxy Issues to Close (when maintainer is ready)
#115, #116, #118, #120, #121, #123, #124, #126, #128, #130, #131, #132, #133, #135, #136, #137, #138, #140, #141, #142, #143, #147, #149, #151, #153, #155, #158, #159, #160, #161

## Monthly Activity Summary
- Issue #156: [Repo Assist] Monthly Activity 2026-05 — OPEN (updated this run)

## Current Repo State
- npm vulnerabilities: 2 (1 moderate, 1 high) — can't fix without deps PR
- Tests: 81 passing on main; 91 with keyboard nav tests
- Baseline main: 81 tests (5 test files, all service layer)

## Component Tests Added (pending PRs)
- #171 PR: src/components/__tests__/ErrorBoundary.test.tsx — 6 tests
- #171 PR: src/components/__tests__/LeagueSelector.test.tsx — 8 tests
- #171 PR: src/components/__tests__/LeagueTable.test.tsx — 9 tests
- #173 PR: src/components/__tests__/Fixtures.test.tsx — 25 tests
- #176 PR: src/components/__tests__/MatchDetail.test.tsx — 29 tests
- #178 PR: src/components/__tests__/App.test.tsx — 17 tests
- TBD keyboard nav PR: src/components/__tests__/TabKeyboard.test.tsx — 10 tests

## Round-Robin Task Schedule
- 2026-04-29T06:37: Task 7 (labelled #147), Task 10 (LeagueTable logos + W%), Task 11
- 2026-04-30T06:43: Task 7 (labelled #151), Task 10 (ARIA tab accessibility), Task 11
- 2026-05-01T06:44: Task 10 (Tab URL persistence), Task 11
- 2026-05-02T06:30: Task 2/3/5 (prepared 4 PR branches), Task 11
- 2026-05-03T06:38: Task 2/3 (submitted 4 real PRs), Task 11
- 2026-05-04T06:54: Task 3 (2 more PRs), Task 6 (nudge #99), Task 11
- 2026-05-05T06:28: Task 3 (component tests PR #171), Task 11
- 2026-05-06T06:44: Task 4 (deps update FAILED — protected files), Task 3 (Fixtures tests PR #173), Task 11
- 2026-05-07T06:51: Task 3 (MatchDetail tests PR #176), Task 1 (#174 comment), Task 11
- 2026-05-08T06:08: Task 3 (App component tests PR #178), Task 11
- 2026-05-09T06:27: Task 10 (keyboard nav + ARIA PR), Task 11
- Next: Task 6 (stale PR check — but #99 already nudged twice), Task 7 (label issues), Task 8 (release check), Task 10 (service worker)

## Key Code Notes
- VITE_USE_MOCK_FALLBACK evaluated at module load — vi.stubEnv needs vi.resetModules()
- Match.homeTeam/awayTeam are Team objects: { id, name, shortName, logo? }
- StandingsEntry.team is Team object; has pointsFor/Against/Difference
- MatchDetails extends Match; homeStats/awayStats/homePlayers/awayPlayers; quarterScores optional
- @testing-library/user-event NOT installed; use fireEvent
- Fixtures.tsx: useNavigate + useSearchParams — mock useNavigate, wrap in MemoryRouter with initialEntries
- MatchDetail.tsx: useParams, useNavigate, useSearchParams — MemoryRouter with Routes path="/match/:matchId"
- App.tsx: uses Routes (not BrowserRouter) — wrap in MemoryRouter; BrowserRouter in main.tsx
- App.tsx: Fixtures renders shortName not name; future-dated scheduled matches for fixtures tab
- Fixtures.tsx: default tab shows date >= today || status === 'live'; past completed → Results tab
- getCurrentSeasonYear() from euroleagueApi.ts — test with vi.setSystemTime() (pending PR #163)
- vitest: must import { describe, it, expect, vi } from 'vitest' explicitly
- MatchDetail polling: vi.useFakeTimers() BEFORE render; vi.advanceTimersByTime(15001) works
- LIVE_POLL_INTERVAL = 15000 defined locally in MatchDetail.tsx (not from constants.ts)
- Component tests pattern: vi.mock useNavigate at module level, MemoryRouter wrapper, fireEvent for clicks
- Fixtures.tsx SCROLL_KEY = 'fixtures-scroll-position' (sessionStorage)
- Fixtures.tsx: today/yesterday/tomorrow detection via getFullYear/getMonth/getDate in local timezone
- App.tsx: LeagueSelector + Fixtures/LeagueTable — wrap in MemoryRouter for testing
- App.tsx keyboard nav: handleTabListKeyDown on tablist div; ArrowLeft/Right/Home/End; tabIndex roving pattern
- TabKeyboard.test.tsx: role='tablist' + onKeyDown; fireEvent.keyDown(tablist, { key: 'ArrowRight' })

## Deps Update Notes (2026-05-06)
- BLOCKED: package-lock.json is a protected file — deps PR cannot be created
- Major version bumps NOT applied: @eslint/js 10.x, eslint 10.x, globals 17.x, jsdom 29.x, typescript 6.x, vite 8.x, @vitejs/plugin-react 6.x
