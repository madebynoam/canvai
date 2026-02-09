---
name: canvai-install
description: First-time Canvai setup — install dependencies and configure Agentation MCP
---

# /canvai-install

First-time setup after cloning the Canvai repo.

## Steps

1. Install dependencies:
   ```bash
   npm install
   ```

2. Verify `.claude/settings.json` has the Agentation MCP server configured:
   ```json
   {
     "mcpServers": {
       "agentation": {
         "command": "npx",
         "args": ["agentation-mcp", "server"]
       }
     }
   }
   ```
   If the file is missing or the `agentation` entry is missing, create/update it.

3. Confirm setup:
   - `node_modules/` exists
   - `.claude/settings.json` has the agentation MCP entry
   - Report success: "Canvai is ready. Run `/canvai-init <project-name>` to start a new design project."
