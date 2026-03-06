---
name: bryllen-update
description: Update bryllen to the latest version
---

# /bryllen-update

Update everything in one shot — npm package, migrations, and Claude Code plugin.

## Steps

1. **Update the npm package** (pulls latest from GitHub + runs migrations):
   ```bash
   npx bryllen update
   ```

2. **Get the new version number** — read it from the installed package:
   ```bash
   node -e "console.log(require('./node_modules/bryllen/package.json').version)"
   ```

3. **Commit migration changes** — migrations modify consumer files (App.tsx, CLAUDE.md, settings.json, etc.). Commit them so there's a rollback point:
   ```bash
   git add -A && git diff --cached --quiet || git commit -m 'chore: bryllen update migrations'
   ```
   (The `diff --quiet` check skips the commit if migrations made no changes.)

4. **Update the plugin marketplace repo** (git pull updates skills and CLAUDE.md):
   ```bash
   cd ~/.claude/plugins/marketplaces/bryllen && git pull origin main 2>/dev/null; cd -
   ```

5. Tell the user:
   - **"Updated to bryllen v{version}"** — show the version number from step 2
   - Migration changes committed (can `git revert` if needed)
   - **They must restart this Claude Code session** for plugin changes to take effect
   - If the dev server was running, restart it with `/bryllen-design`

## Why no `claude plugin update`?

`claude plugin update` cannot run inside a Claude Code session (nested sessions crash). The git pull in step 2 already updates all plugin files on disk — the restart in step 3 picks them up.
