---
name: canvai-close
description: Stop all Canvai dev servers and free ports
---

# /canvai-close

Stop all running Canvai processes (Vite dev server, MCP HTTP server).

## Steps

1. **Kill only THIS project's servers** using the ports file:
   ```bash
   if [ -f .canvai-ports.json ]; then
     HTTP_PORT=$(node -e "console.log(JSON.parse(require('fs').readFileSync('.canvai-ports.json','utf8')).http)")
     VITE_PORT=$(node -e "console.log(JSON.parse(require('fs').readFileSync('.canvai-ports.json','utf8')).vite)")
     lsof -ti :$HTTP_PORT | xargs kill 2>/dev/null
     lsof -ti :$VITE_PORT | xargs kill 2>/dev/null
     rm -f .canvai-ports.json
   else
     echo "No .canvai-ports.json found — no servers to stop for this project."
   fi
   ```
   This only kills servers belonging to the current project. Other canvai instances on different ports are left alone.

2. **Confirm:** "Canvai servers stopped for this project."
