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

2. **Update the plugin marketplace cache:**
   ```bash
   claude plugin marketplace update canvai
   ```

3. **Update the installed plugin:**
   ```bash
   claude plugin update canvai@canvai
   ```

4. Tell the user:
   - npm package and plugin are updated
   - **They must restart this Claude Code session** for plugin changes to take effect
   - If the dev server was running, restart it with `/canvai-dev`
