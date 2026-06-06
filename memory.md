# Repo Assist Memory

## Last Updated
2026-06-06T15:12:00Z

## Last Run Tasks
- Task 5: CI verified: PRs #225, #226, #227 all passing ✅
- Task 10: Created Fixtures component tests PR (26 tests, 134 total) — branch: repo-assist/improve-venue-in-fixtures (PR# TBD next run)
- Task 11: Updated June 2026 monthly activity issue #222

## Issue Backlog Cursor
Last processed: #222 (no new non-status issues since last run)

## Comments Made
- #7 (2026-03-03): Native Swift iOS app — feasibility overview
- #99 (2026-05-04): Second nudge — do not nudge again
- #101 (2026-04-17): Two comments: fix implemented, PR ready (note: PR #163 is the current live PR)
- #145 (2026-06-05): Linked to PR #164 for ARCHITECTURE.md fix
- #174 (2026-05-07): Explained package-lock.json protected-file failure
- #216 (2026-06-03): Daily-repo-status auth failure — explained transient issue, suggested fix
- #218 (2026-06-01): API health check failure — identified as transient; second run passed

## Open Repo Assist PRs (as of 2026-06-06 15:12)
- #163: fix: replace hardcoded CURRENT_SEASON_YEAR (Closes #101) — 87 tests ✅
- #164: docs: fix ARCHITECTURE.md (Closes #145) — docs only
- #165: feat: persist active tab in URL — 81 tests ✅
- #166: feat: PWA manifest and basketball icon — 81 tests ✅
- #168: feat: team logos + W% in LeagueTable — 81 tests ✅
- #169: feat: ARIA tab roles — SUPERSEDED by #180
- #171: test: ErrorBoundary/LeagueSelector/LeagueTable — 104 tests ✅ (may conflict with main's LeagueTable.test.tsx)
- #173: test: Fixtures (25 tests) — may be superseded by new Fixtures tests PR (branch: repo-assist/improve-venue-in-fixtures)
- #176: test: MatchDetail (29 tests) — 110 total ✅
- #178: test: App (17 tests) — 98 total ✅
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
- #213: fix: preserve existing data when auto-refresh fails — 86 tests ✅
- #225: fix: move match utility functions to src/utils/matchUtils.ts — 108 tests ✅ lint clean
- #226: chore: release v0.1.0 — CHANGELOG.md + version bump — 108 tests ✅
- #227: feat: add head-to-head season record section to MatchDetail — 119 tests ✅
- NEW (TBD#): test: add Fixtures component tests (26 tests) — 134 tests ✅ — branch: repo-assist/improve-venue-in-fixtures (PR# unknown, update next run)

## Recently Merged PRs (2026-06-01)
- #199: feat: add share/copy-link button to MatchDetail ✅ MERGED
- #201: feat: add team form guide to league table ✅ MERGED
- #209: feat: highlight winning team and show score margin ✅ MERGED
- #221: docs: add AGENTS.md with project conventions ✅ MERGED

## Open Non-Repo-Assist PRs
- #99: stale Copilot docs PR (nudged twice — do not nudge again)

## PR Notes
- Deps PRs BLOCKED: package-lock.json is a protected file
- PR creation IS WORKING
- ESLint errors from PR #209 fixed in PR #225 (not yet merged)
- Current main HEAD: 6e0299c (PR #199 merge)
- AGENTS.md is in main (merged via PR #221)
- Release v0.1.0 PR is #226
- PR #171 likely conflicts with main (main already has LeagueTable.test.tsx with 10 tests; PR #171's has 9)
- PR #173 likely superseded by new Fixtures tests PR (branch: repo-assist/improve-venue-in-fixtures)

## Proxy Issues to Close
#115, #116, #118, #120, #121, #123, #124, #126, #128, #130-#133, #135-#138, #140-#143, #147, #149, #151, #153, #155, #158-#161

## Monthly Activity Summary
- Issue #222: OPEN (June 2026) — updated this run (2026-06-06)

## Round-Robin Next
- 2026-06-06 15:12: Task 5 (CI check), Task 10 (Fixtures tests PR), Task 11 (monthly summary)
- Next: Task 1 (triage issues), Task 2 (fix issues), Task 7 (labels), Task 9 (new contributors)

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
- src/components/__tests__/ has 4 test files now: Fixtures.test.tsx (NEW), Fixtures.winner.test.ts, LeagueTable.test.tsx, MatchDetail.shareButton.test.tsx
- getMatchWinner/getMatchMargin in Fixtures.tsx (2 ESLint errors — moved to utils in PR #225)
- computeH2HRecord + H2HRecord exported from dataProvider.ts (added in PR #227, not yet merged)
- LeagueTable: uses named export: { LeagueTable } not default export
- App.tsx: POLL_INTERVAL hardcoded at 5min on main (PR #197 adds adaptive polling, not merged)
- localStorage mock: Node.js 25+ native stub shadows jsdom — always use explicit storageMock pattern
- Genius Sports API: User-Agent required (CloudFront blocks headless Chrome with 403)
- vi.stubEnv for PROD: use boolean (true/false) not string
- Fixtures shows match.homeTeam.shortName and match.awayTeam.shortName (not fullName) in match cards
- getCurrentSeasonYear(): August = season transition month (euroleagueApi.ts, pending PR #163)
- Main branch test count: 134 tests (9 test files) [after new Fixtures tests PR is merged]
- Current main test count: 108 tests (8 test files) [before new PR merge]
- Main branch ESLint: 2 errors in Fixtures.tsx (pre-existing, fixed by PR #225)
