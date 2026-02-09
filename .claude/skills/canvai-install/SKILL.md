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

2. Verify `.mcp.json` (project root) has the Agentation MCP server configured:
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
   **Important:** The MCP config MUST be in `.mcp.json` at the project root — NOT in `.claude/settings.json` or `~/.claude/claude_code_config.json`. Those files do not load MCP servers.

3. Confirm setup:
   - `node_modules/` exists
   - `.mcp.json` has the agentation MCP entry
   - Report success: "Canvai is ready. Run `/canvai-init <project-name>` to start a new design project."
