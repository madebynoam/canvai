---
name: plugin-release
description: Swap bryllen plugin marketplace back to GitHub after local testing is complete
---

# Plugin Release

One command to swap EVERYTHING back to GitHub — plugin AND npm package. Run this after pushing your changes to main.

## Steps

1. Ask the user for the consumer project path if not known. Default: `../bryllen-projects`

2. Swap the plugin marketplace back to GitHub:
   ```bash
   CLAUDECODE= claude plugin marketplace remove bryllen 2>/dev/null || true
   CLAUDECODE= claude plugin marketplace add madebynoam/bryllen
   CLAUDECODE= claude plugin install bryllen@bryllen 2>/dev/null || CLAUDECODE= claude plugin update bryllen@bryllen
   ```

3. Swap the npm package in the consumer project back to GitHub:
   ```bash
   cd <consumer-project-path>
   rm -rf node_modules/bryllen
   npm install github:madebynoam/bryllen
   ```

4. Verify:
   ```bash
   grep "bryllen" <consumer-project-path>/package.json
   ```
   Should show `"bryllen": "github:madebynoam/bryllen"` (not `file:`).

5. Tell the user:
   - Both plugin and npm package are back on GitHub
   - **Restart Claude Code** in the consumer folder to pick up the released version
