---
name: canvai-update
description: Update canvai to the latest version
---

# /canvai-update

Update the canvai npm package and Claude Code plugin to the latest version.

## Steps

1. **Update the npm package** (this also runs migrations and clears the Vite cache):
   ```bash
   npx canvai update
   ```

2. **Update the Claude Code plugin** (refresh the marketplace cache first to avoid stale versions):
   ```bash
   cd ~/.claude/plugins/marketplaces/canvai && git pull origin main 2>/dev/null; cd -
   ```
   Then run:
   ```bash
   claude plugin update canvai@canvai
   ```

3. **Verify App.tsx imports** — if `src/App.tsx` still references any of these removed exports, the migration in step 1 should have fixed it. If not, manually update:
   - `PageTabs` → removed (functionality now in TopBar)
   - `ProjectSidebar` → replaced by `IterationSidebar`
   - Import line should be: `import { Canvas, Frame, useFrames, layoutFrames, TopBar, IterationSidebar, AnnotationOverlay } from 'canvai/runtime'`
   - `AnnotationOverlay` now accepts an `annotateMode` prop (`'manual' | 'watch'`)

4. **Restart the dev server** if it's running. Kill the existing process and run:
   ```bash
   npx canvai dev
   ```

5. **Confirm:** "Canvai updated to latest. Dev server restarted."
