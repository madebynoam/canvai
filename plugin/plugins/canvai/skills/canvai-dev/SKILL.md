---
name: canvai-dev
description: Start (or restart) the Canvai dev server
---

# /canvai-dev

Start the Canvai dev server and enter watch mode.

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

4. **Drain backlog:** Call `get_pending_annotations` to process any that arrived before the session started. Process each one following the guard protocol.

5. **Enter watch loop:** Call `watch_annotations` in a blocking loop. This waits for the designer to click "Apply" on annotations in the TopBar dropdown. When an annotation arrives:
   - Read the `comment`, `componentName`, `selector`, and `computedStyles`
   - **Follow the guard protocol** (see CLAUDE.md "Before any edit")
   - Map the annotation to the relevant file in `v<N>/components/` or `v<N>/pages/`
   - **Token routing:** Route visual value changes through `tokens.css`
   - Apply the requested changes
   - Call `resolve_annotation` with the annotation `id`
   - Log the change to `CHANGELOG.md`
   - Commit: `git add src/projects/ && git commit -m 'style: annotation #<N> — <brief description>'`
   - Call `watch_annotations` again — back to waiting

6. **Exit:** The designer sends any message to break out of watch mode and return to normal chat.
