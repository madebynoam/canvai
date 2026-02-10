---
name: canvai-dev
description: Start (or restart) the Canvai dev server and Agentation MCP
---

# /canvai-dev

Start the Canvai dev server and Agentation MCP. Use this when opening a new session, new terminal, or after updating canvai.

## Steps

1. **Kill any existing canvai/vite processes** to avoid port conflicts:
   ```bash
   pkill -f "canvai dev" 2>/dev/null; pkill -f "vite" 2>/dev/null; pkill -f "agentation-mcp" 2>/dev/null
   ```
   It's fine if these fail (nothing was running).

2. **Start the dev server** in the background:
   ```bash
   npx canvai dev
   ```

3. **Confirm:** "Dev server running. Canvas at http://localhost:5173"
