---
name: canvai-update
description: Update canvai to the latest version
---

# /canvai-update

Update the canvai npm package and Claude Code plugin to the latest version.

## Steps

1. **Update the npm package:**
   ```bash
   npm install github:madebynoam/canvai
   ```

2. **Update the Claude Code plugin** (refresh the marketplace cache first to avoid stale versions):
   ```bash
   cd ~/.claude/plugins/marketplaces/canvai && git pull origin main 2>/dev/null; cd -
   ```
   Then run:
   ```bash
   claude plugin update canvai@canvai
   ```

3. **Migrate App.tsx** if it still uses the old Agentation import:
   - Replace `import { Agentation } from 'agentation'` with `import { AnnotationOverlay } from 'canvai/runtime'` (add to existing canvai/runtime import if one exists)
   - Replace `<Agentation endpoint="http://localhost:4747" />` with `<AnnotationOverlay endpoint="http://localhost:4748" frames={frames} />`

4. **Remove old agentation deps** if present:
   ```bash
   npm uninstall agentation agentation-mcp 2>/dev/null
   ```

5. **Clear the Vite cache** so stale bundled deps don't linger:
   ```bash
   rm -rf node_modules/.vite
   ```

6. **Restart the dev server** if it's running. Kill the existing process and run:
   ```bash
   npx canvai dev
   ```

7. **Confirm:** "Canvai updated to latest. Dev server restarted."
