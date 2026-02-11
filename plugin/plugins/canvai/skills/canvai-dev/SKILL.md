---
name: canvai-dev
description: Start (or restart) the Canvai dev server and annotation MCP
---

# /canvai-dev

Start the Canvai dev server and annotation MCP, then enter the annotation watch loop.

## Steps

1. **Kill any existing canvai/vite processes** to avoid port conflicts:
   ```bash
   pkill -f "canvai dev" 2>/dev/null; pkill -f "vite" 2>/dev/null; pkill -f "src/mcp/server.js" 2>/dev/null
   ```
   It's fine if these fail (nothing was running).

2. **Start the dev server** in the background:
   ```bash
   npx canvai dev
   ```

3. **Confirm:** "Dev server running. Canvas at http://localhost:5173"

4. **Enter the annotation watch loop:** Call the `watch_annotations` MCP tool. This blocks until the designer submits an annotation from the canvas.

5. **When an annotation arrives:**
   - Read the `comment`, `componentName`, `selector`, and `computedStyles`
   - Edit the component file to apply the requested change
   - Call `resolve_annotation` with the annotation `id`
   - Call `watch_annotations` again — back to waiting for the next annotation

The designer clicks "Annotate" on the canvas, selects an element, types what they want changed, and clicks "Apply". The annotation arrives here automatically — no manual step needed.
