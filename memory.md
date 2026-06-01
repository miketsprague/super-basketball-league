# Repo Assist Memory

## Last Updated
2026-06-01T19:12:00Z

## Last Run Tasks
- Task 5: Checked PR health — maintainer merged #199, #201, #209, #221 today
- Task 11: Updated June 2026 monthly activity issue #222

## Issue Backlog Cursor
Last processed: #222 (no new human issues; only automation/report issues open)

## Comments Made
- #7 (2026-03-03): Native Swift iOS app — feasibility overview
- #99 (2026-05-04): Second nudge — do not nudge again
- #174 (2026-05-07): Explained package-lock.json protected-file failure
- #218 (2026-06-01): API health check failure — identified as transient; second run passed

## Open Repo Assist PRs (as of 2026-06-01 19:12)
- #163: fix: replace hardcoded CURRENT_SEASON_YEAR (Closes #101) — 87 tests ✅
- #164: docs: fix ARCHITECTURE.md (Closes #145) — docs only
- #165: feat: persist active tab in URL — 81 tests ✅
- #166: feat: PWA manifest and basketball icon — 81 tests ✅
- #168: feat: team logos + W% in LeagueTable — 81 tests ✅
- #169: feat: ARIA tab roles — SUPERSEDED by #180
- #171: test: ErrorBoundary/LeagueSelector/LeagueTable — 104 tests ✅
- #173: test: Fixtures (25 tests) — 106 total ✅
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
- All open RA PRs have base SHA 2637d16c (pre-PR#217 main)
- Current main HEAD: 6e0299c (PR #199 merge — latest workspace)
- AGENTS.md is in main (merged via PR #221)

## Proxy Issues to Close
#115, #116, #118, #120, #121, #123, #124, #126, #128, #130-#133, #135-#138, #140-#143, #147, #149, #151, #153, #155, #158-#161

## Monthly Activity Summary
- Issue #222: OPEN (June 2026) — updated this run

## Round-Robin Next
- 2026-06-01 19:12: Task 5 (PR health), Task 11 (monthly summary)
- Next: Task 1 (issue triage), Task 7 (labelling), Task 10 (feature work), Task 8 (release prep)

## Key Code Notes
- vitest: import { describe, it, expect, vi } from 'vitest' explicitly
- @testing-library/user-event NOT installed — use fireEvent
- Match.homeTeam/awayTeam: Team { id, name, shortName, logo? }; venue required (can be 'TBC')
- MatchDetail.tsx: useParams, useNavigate, useSearchParams — MemoryRouter+Routes path="/match/:matchId"
- MatchDetail polling: vi.useFakeTimers() BEFORE render; vi.advanceTimersByTime(15001) works
- Fake timers + async fetch: act(async () => { await Promise.resolve(); }) to flush useEffect
- App.tsx: uses Routes (not BrowserRouter) — wrap in MemoryRouter for tests
- Fixtures.tsx: default tab shows date >= today || status === 'live'; results tab: past completed
- src/services/__tests__/ dir exists for service tests
- src/__tests__/ dir now exists for App tests (src/__tests__/App.test.tsx — 5 tests for auto-refresh fix)
- src/components/__tests__/ does NOT exist on main (component tests only in open PRs)
- LeagueTable: SortColumn type, useState sort state, useMemo sortedStandings, SortIndicator component (in PR #211)
- App.tsx: passes matches to LeagueTable (simple prop pass, no extra API calls) (in later PRs)
- MatchDetail share: shareStatus ('idle'|'copied'), handleShare useCallback; clipboard fallback 2s reset (PR #199 — MERGED)
- App.tsx: POLL_INTERVAL_NORMAL=5min, POLL_INTERVAL_LIVE=30s (#197); hasLiveMatches via useMemo
- App.tsx: LIVE badge aria-label="N live match(es)" on Fixtures tab (#195)
- vi.stubEnv for PROD: use boolean (true/false) not string
- serviceWorkerRegistration.ts: production-only, uses BASE_URL for SW path
- LeagueTable: playoffPositions/relegationPositions props (EuroLeague/Cup: 8/0; default: 4/2) (PR #184)
- Fixtures.tsx: SCROLL_KEY='fixtures-scroll-position' (sessionStorage)
- getCurrentSeasonYear(): August = season transition month (euroleagueApi.ts, pending PR #163)
- Skeleton.tsx: Skeleton, SkeletonLeagueTableRow, SkeletonMatchCard, SkeletonDateGroup components (PR #203)
- LeagueTable uses named export: { LeagueTable } not default export
- useDarkMode hook: src/hooks/useDarkMode.ts — reads localStorage 'basketball-dark-mode', OS pref fallback (PR #205)
- computeTeamRecord(matches, teamName): TeamRecord — in teamStorage.ts; only counts completed matches (PR #207)
- Fixtures.tsx: exports getMatchWinner(match) and getMatchMargin(match) (PR #209 — MERGED)
- App.tsx auto-refresh fix: isInitialLoad flag; background refresh errors are silent; regression tests in src/__tests__/App.test.tsx
- Fixtures shows match.homeTeam.shortName and match.awayTeam.shortName (not fullName) in match cards
- AGENTS.md now in main (merged via PR #221)
- localStorage mock: Node.js 25+ native stub shadows jsdom — always use explicit storageMock pattern
- Genius Sports API: User-Agent required (CloudFront blocks headless Chrome with 403)
- Team form guide in league table (PR #201 — MERGED)
