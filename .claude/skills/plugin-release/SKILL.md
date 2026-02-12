---
name: plugin-release
description: Swap canvai plugin marketplace back to GitHub after local testing is complete
---

# Plugin Release

Swap the canvai marketplace source back to GitHub after local testing is complete. Run this after pushing your changes to main.

## Steps

1. Remove the local canvai marketplace:
   ```bash
   claude plugin marketplace remove canvai 2>/dev/null || true
   ```

2. Add the GitHub marketplace back:
   ```bash
   claude plugin marketplace add madebynoam/canvai
   ```

3. Update the installed plugin from GitHub:
   ```bash
   claude plugin update canvai@canvai
   ```

4. Tell the user:
   - GitHub marketplace is restored
   - **Restart Claude Code** in the consumer folder to pick up the released version
