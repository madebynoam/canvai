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

2. **Commit migration changes** — migrations modify consumer files (App.tsx, CLAUDE.md, settings.json, etc.). Commit them so there's a rollback point:
   ```bash
   git add -A && git diff --cached --quiet || git commit -m 'chore: canvai update migrations'
   ```
   (The `diff --quiet` check skips the commit if migrations made no changes.)

3. **Update the plugin marketplace repo** (git pull updates skills, MCP config, and CLAUDE.md):
   ```bash
   cd ~/.claude/plugins/marketplaces/canvai && git pull origin main 2>/dev/null; cd -
   ```

4. Tell the user:
   - npm package and plugin are updated
   - Migration changes committed (can `git revert` if needed)
   - **They must restart this Claude Code session** for plugin changes to take effect
   - If the dev server was running, restart it with `/canvai-dev`

## Why no `claude plugin update`?

`claude plugin update` cannot run inside a Claude Code session (nested sessions crash). The git pull in step 2 already updates all plugin files on disk — the restart in step 3 picks them up.
