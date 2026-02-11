---
name: canvai-update
description: Update canvai to the latest version
---

# /canvai-update

Update the canvai package to the latest version from GitHub.

## Steps

1. **Run the update:**
   ```bash
   npm install github:madebynoam/canvai
   ```

2. **Migrate App.tsx** if it still uses the old Agentation import:
   - Replace `import { Agentation } from 'agentation'` with `import { AnnotationOverlay } from 'canvai/runtime'` (add to existing canvai/runtime import if one exists)
   - Replace `<Agentation endpoint="http://localhost:4747" />` with `<AnnotationOverlay endpoint="http://localhost:4748" frames={frames} />`

3. **Remove old agentation deps** if present:
   ```bash
   npm uninstall agentation agentation-mcp 2>/dev/null
   ```

4. **Clear the Vite cache** so stale bundled deps don't linger:
   ```bash
   rm -rf node_modules/.vite
   ```

5. **Restart the dev server** if it's running. Kill the existing process and run:
   ```bash
   npx canvai dev
   ```

6. **Confirm:** "Canvai updated to latest. Dev server restarted."
