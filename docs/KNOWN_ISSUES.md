# Known Issues & Solutions

Quick reference for common issues encountered in this project.

## API Issues

### Genius Sports - Only Shows Recent Matches
**Symptom:** Only 6 completed matches displayed instead of full season  
**Cause:** Default schedule endpoint returns recent matches only  
**Solution:** Add `roundNumber=-1` parameter to fetch all 142 matches
```
/schedule?roundNumber=-1
```

### EuroLeague - 405 Method Not Allowed
**Symptom:** EuroLeague/EuroCup data returns 405 errors  
**Cause:** v3 API is deprecated or requires authentication  
**Solution:** Use v1 API instead
```typescript
// ❌ Wrong
https://api-live.euroleague.net/v3/standings

// ✅ Correct
https://api-live.euroleague.net/v1/standings?seasoncode=E2025
```

## GitHub Actions Issues

### Repo Assist `create_pull_request` MCP Tool — "context is not defined"
**Symptom:** Repo Assist workflow runs successfully but cannot create pull requests.
The `create_pull_request` MCP tool returns "context is not defined" on every attempt.
This blocked PR creation for 35+ consecutive daily runs (March–April 2026).

**Root Cause:** A bug in the `gh-aw` safeoutputs MCP server — the component that handles
safe-output tool calls (like `create_pull_request`) during the agent job. The bug was
tracked upstream as `github/gh-aw#18751` and `github/gh-aw#18643` (both now closed/fixed).
The `repo-assist.lock.yml` was pinned to `gh-aw v0.50.6` (schema v1, MCP Gateway v0.1.5)
which contained the buggy safeoutputs server code.

**Solution:** Regenerate the lock file to pick up the fixed infrastructure:
```bash
# Option 1 — upgrade all agentic workflows in the repo
gh aw upgrade

# Option 2 — recompile and validate lock files
gh aw compile --validate --verbose

# Then commit the updated lock files
git add .github/workflows/*.lock.yml
git commit -m "fix: regenerate agentic workflow lock files"
git push
```

**Verification:** After regenerating, trigger a manual Repo Assist run via
`workflow_dispatch` and check that the `create_pull_request` tool call succeeds
in the safe_outputs job logs.

### Environment Secrets Not Working
**Symptom:** Environment secrets not accessible during build  
**Cause:** Job missing environment declaration  
**Solution:** Add `environment: github-pages` to the job
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    environment: github-pages  # ← Required for secrets!
    steps:
      # ...
```

## Data Parsing Issues

### Match Scores Showing NaN
**Symptom:** Scores display as NaN for scheduled matches  
**Cause:** Parsing `&nbsp;` or empty strings as numbers  
**Solution:** Check for numeric content before parsing
```typescript
const score = /^\d+$/.test(scoreText) ? parseInt(scoreText, 10) : undefined;
```

## Development Issues

### Tests Failing After API Changes
**Symptom:** Tests fail with URL mismatch or undefined values  
**Cause:** Mock HTML structure doesn't match actual API  
**Solution:** Update mock HTML to match real Genius Sports structure (see test file)

### TypeScript Unused Variable Error
**Symptom:** Build fails with "declared but never read" error  
**Cause:** Leftover variable after refactoring  
**Solution:** Remove unused variables or prefix with `_`
