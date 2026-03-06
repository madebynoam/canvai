---
name: plugin-local
description: Swap bryllen plugin marketplace to local for testing skills and plugin changes before pushing
---

# Plugin Local Testing

One command to swap EVERYTHING to local — plugin (skills, MCP, CLAUDE.md) AND npm package (CLI, templates, migrations, runtime). No manual steps.

## Steps

1. Ask the user for the consumer project path if not known. Default: `../bryllen-projects`

2. Get the repo root:
   ```bash
   REPO_ROOT="$(git -C /Users/noamalmosnino/Documents/GitHub/bryllen rev-parse --show-toplevel)"
   ```

3. Swap the plugin marketplace to local:
   ```bash
   CLAUDECODE= claude plugin marketplace remove bryllen 2>/dev/null || true
   CLAUDECODE= claude plugin marketplace add "$REPO_ROOT/plugin"
   CLAUDECODE= claude plugin install bryllen@bryllen 2>/dev/null || CLAUDECODE= claude plugin update bryllen@bryllen
   ```

4. Swap the npm package in the consumer project to local:
   ```bash
   cd <consumer-project-path>
   # Create package.json if it doesn't exist yet (prevents /bryllen-new from installing from GitHub)
   [ ! -f package.json ] && npm init -y
   rm -rf node_modules/bryllen
   npm install "$REPO_ROOT"
   ```
   This must use the absolute path and rm the old copy first — npm caches aggressively.
   Creating `package.json` first is critical: without it, `/bryllen-new` will install bryllen from GitHub (hardcoded in the skill), overwriting the local swap.

5. Verify both swaps worked:
   ```bash
   grep "claudeMd" <consumer-project-path>/node_modules/bryllen/src/cli/templates.js
   grep "bryllen" <consumer-project-path>/package.json
   ```
   The package.json should show `"bryllen": "file:../bryllen"` (not `github:`).

6. Tell the user:
   - Both plugin and npm package are now local
   - **Restart Claude Code** in the consumer folder to pick up changes
   - Test with `/bryllen-new <project-name>`
   - Use `/plugin-release` when done to switch back to GitHub
