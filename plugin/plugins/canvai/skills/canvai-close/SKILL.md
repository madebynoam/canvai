---
name: canvai-close
description: Stop all Canvai dev servers and free ports
---

# /canvai-close

Stop all running Canvai processes (Vite dev server, MCP HTTP server).

## Steps

1. **Kill all canvai-related processes:**
   ```bash
   pkill -f "canvai dev" 2>/dev/null; pkill -f "vite" 2>/dev/null; pkill -f "http-server.js" 2>/dev/null
   ```
   It's fine if these fail (nothing was running).

2. **Free the ports** in case orphaned processes are holding them:
   ```bash
   lsof -ti :4748 | xargs kill -9 2>/dev/null; lsof -ti :5173 | xargs kill -9 2>/dev/null
   ```

3. **Confirm:** "All Canvai servers stopped."
