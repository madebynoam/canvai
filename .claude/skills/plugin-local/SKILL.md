---
name: plugin-local
description: Swap canvai plugin marketplace to local for testing skills and plugin changes before pushing
---

# Plugin Local Testing

One command to swap EVERYTHING to local — plugin (skills, MCP, CLAUDE.md) AND npm package (CLI, templates, migrations, runtime). No manual steps.

## Steps

1. Ask the user for the consumer project path if not known. Default: `../canvai-projects`

2. Get the repo root:
   ```bash
   REPO_ROOT="$(git -C /Users/noamalmosnino/Documents/GitHub/canvai rev-parse --show-toplevel)"
   ```

3. Swap the plugin marketplace to local:
   ```bash
   CLAUDECODE= claude plugin marketplace remove canvai 2>/dev/null || true
   CLAUDECODE= claude plugin marketplace add "$REPO_ROOT/plugin"
   CLAUDECODE= claude plugin install canvai@canvai 2>/dev/null || CLAUDECODE= claude plugin update canvai@canvai
   ```

4. Swap the npm package in the consumer project to local:
   ```bash
   cd <consumer-project-path>
   # Create package.json if it doesn't exist yet (prevents /canvai-init from installing from GitHub)
   [ ! -f package.json ] && npm init -y
   rm -rf node_modules/canvai
   npm install "$REPO_ROOT"
   ```
   This must use the absolute path and rm the old copy first — npm caches aggressively.
   Creating `package.json` first is critical: without it, `/canvai-init` will install canvai from GitHub (hardcoded in the skill), overwriting the local swap.

5. Verify both swaps worked:
   ```bash
   grep "claudeMd" <consumer-project-path>/node_modules/canvai/src/cli/templates.js
   grep "canvai" <consumer-project-path>/package.json
   ```
   The package.json should show `"canvai": "file:../canvai"` (not `github:`).

6. Tell the user:
   - Both plugin and npm package are now local
   - **Restart Claude Code** in the consumer folder to pick up changes
   - Test with `/canvai-init <project-name>`
   - Use `/plugin-release` when done to switch back to GitHub
