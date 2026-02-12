---
name: canvai-update
description: Update canvai to the latest version
---

# /canvai-update

Update everything in one shot — npm package, migrations, and Claude Code plugin.

## Steps

1. **Update the npm package** (pulls latest from GitHub + runs migrations):
   ```bash
   npx canvai update
   ```

2. **Update the plugin marketplace repo** (git pull is more reliable from inside a running session than `claude plugin` CLI commands):
   ```bash
   cd ~/.claude/plugins/marketplaces/canvai && git pull origin main 2>/dev/null; cd -
   ```

3. **Update the installed plugin:**
   ```bash
   claude plugin update canvai@canvai
   ```
   If that fails, it's fine — the git pull in step 2 already updated the files.

4. Tell the user:
   - npm package and plugin are updated
   - **They must restart this Claude Code session** for plugin changes to take effect
   - If the dev server was running, restart it with `/canvai-dev`
