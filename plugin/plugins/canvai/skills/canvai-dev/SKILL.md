---
name: canvai-dev
description: Start (or restart) the Canvai dev server
---

# /canvai-dev

Start the Canvai dev server and stay in chat mode.

## Steps

1. **Kill any existing canvai/vite processes** to avoid port conflicts:
   ```bash
   pkill -f "canvai dev" 2>/dev/null; pkill -f "vite" 2>/dev/null; pkill -f "http-server.js" 2>/dev/null
   ```
   It's fine if these fail (nothing was running).

2. **Start the dev server** in the background:
   ```bash
   npx canvai dev
   ```

3. **Confirm:** "Dev server running. Canvas at http://localhost:5173"

4. **Check for pending annotations:** Call `get_pending_annotations` to process any that arrived before the session started.

5. **Stay in chat mode.** The designer can chat, ask questions, and request changes. Periodically call `get_pending_annotations` between tasks to check for new annotations from the canvas. For rapid annotation sessions, the designer can run `/canvai-watch`.
