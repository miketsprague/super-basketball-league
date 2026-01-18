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
