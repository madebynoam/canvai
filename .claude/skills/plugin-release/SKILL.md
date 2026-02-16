---
name: plugin-release
description: Swap canvai plugin marketplace back to GitHub after local testing is complete
---

# Plugin Release

One command to swap EVERYTHING back to GitHub — plugin AND npm package. Run this after pushing your changes to main.

## Steps

1. Ask the user for the consumer project path if not known. Default: `../canvai-projects`

2. Swap the plugin marketplace back to GitHub:
   ```bash
   CLAUDECODE= claude plugin marketplace remove canvai 2>/dev/null || true
   CLAUDECODE= claude plugin marketplace add madebynoam/canvai
   CLAUDECODE= claude plugin install canvai@canvai 2>/dev/null || CLAUDECODE= claude plugin update canvai@canvai
   ```

3. Swap the npm package in the consumer project back to GitHub:
   ```bash
   cd <consumer-project-path>
   rm -rf node_modules/canvai
   npm install github:madebynoam/canvai
   ```

4. Verify:
   ```bash
   grep "canvai" <consumer-project-path>/package.json
   ```
   Should show `"canvai": "github:madebynoam/canvai"` (not `file:`).

5. Tell the user:
   - Both plugin and npm package are back on GitHub
   - **Restart Claude Code** in the consumer folder to pick up the released version
