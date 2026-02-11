---
name: canvai-dev
description: Start (or restart) the Canvai dev server and annotation MCP
---

# /canvai-dev

Start the Canvai dev server, then choose an annotation mode.

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

5. **Stay in chat mode (default).** The designer can chat, ask questions, and request changes. Periodically call `get_pending_annotations` between tasks to check for new annotations from the canvas.

## Watch mode (opt-in)

If the designer says "enter watch mode" or "start watching":

1. Call `watch_annotations` — this blocks until an annotation arrives.
2. When an annotation arrives:
   - Read the `comment`, `componentName`, `selector`, and `computedStyles`
   - Edit the component file to apply the requested change
   - Call `resolve_annotation` with the annotation `id`
   - Call `watch_annotations` again — back to waiting
3. The designer can exit watch mode by sending any message.

## How it works

The designer clicks "Annotate" on the canvas, selects an element, types what they want changed, and clicks "Apply". The annotation is sent to the HTTP server. In chat mode, call `get_pending_annotations` to fetch them. In watch mode, `watch_annotations` returns them automatically.
