---
name: canvai-update
description: Update canvai to the latest version
---

# /canvai-update

Update the canvai npm package and Claude Code plugin to the latest version.

## Steps

1. **Update the npm package** (runs migrations automatically):
   ```bash
   npx canvai update
   ```

2. **Update the Claude Code plugin** (refresh marketplace cache first):
   ```bash
   cd ~/.claude/plugins/marketplaces/canvai && git pull origin main 2>/dev/null; cd -
   ```
   Then:
   ```bash
   claude plugin update canvai@canvai
   ```

3. **Restart the dev server** if it's running:
   ```bash
   npx canvai dev
   ```

4. **Confirm:** "Canvai updated to latest. Dev server restarted."
