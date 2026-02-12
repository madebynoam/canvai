---
name: plugin-local
description: Swap canvai plugin marketplace to local for testing skills and plugin changes before pushing
---

# Plugin Local Testing

Swap the canvai marketplace source from GitHub to the local `plugin/` directory so you can test plugin changes (skills, MCP, CLAUDE.md) without pushing to GitHub.

## Steps

1. Get the repo root:
   ```bash
   REPO_ROOT="$(git -C /Users/noamalmosnino/Documents/GitHub/canvai rev-parse --show-toplevel)"
   ```

2. Remove the current canvai marketplace (ignore errors if not present):
   ```bash
   claude plugin marketplace remove canvai 2>/dev/null || true
   ```

3. Add the local marketplace:
   ```bash
   claude plugin marketplace add "$REPO_ROOT/plugin"
   ```

4. Update the installed plugin from local:
   ```bash
   claude plugin update canvai@canvai
   ```

5. Tell the user:
   - Local marketplace is now active
   - **Restart Claude Code** in the consumer folder to pick up changes
   - Use `/plugin-release` when done testing to switch back to GitHub
