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

5. **Enter watch loop:** Call `watch_annotations` in a loop. Each call waits up to 30 seconds for the designer to click "Apply" on an annotation. Three outcomes:

   **Regular annotation arrives** (no `type` field or `type: 'annotation'`) — process it:
   - **Fast file lookup:** Parse `frameId` (e.g. `"v9-shell"`) to get the iteration (`v9`) and component hint. Grep for `componentName` in that iteration's folder. The annotation metadata is a direct map to the file — never use an Explore agent or broad codebase search.
   - Read the `comment`, `componentName`, `selector`, and `computedStyles`
   - **Follow the guard protocol** (see CLAUDE.md "Before any edit")
   - Map the annotation to the relevant file in `v<N>/components/` or `v<N>/pages/`
   - **Token routing:** Route visual value changes through `tokens.css`
   - Apply the requested changes
   - **Visual review:** Call `screenshot_canvas` with the annotation's `frameId`
     - Read the returned screenshot file to see the result
     - Check for: broken contrast, overflow/clipping, misalignment, wrong colors, missing styles
     - If issues found: fix them and screenshot again
     - If clean: proceed
   - Call `resolve_annotation` with the annotation `id`
   - Log the change to `CHANGELOG.md`
   - Commit: `git add src/projects/ && git commit -m 'style: annotation #<N> — <brief description>'`
   - Call `watch_annotations` again — back to waiting

   **Iteration request arrives** (annotation has `type: 'iteration'`) — run the full `/canvai-iterate` protocol:
   1. Read `manifest.ts`, find the active iteration (last with `frozen: false`)
   2. Freeze it (`frozen: true`)
   3. Copy folder: `cp -r v<N>/ v<N+1>/`
   4. Rename CSS scope in `v<N+1>/tokens.css`: `.iter-v<N>` → `.iter-v<N+1>`
   5. Add new iteration to manifest with `frozen: false`, update import paths
   6. Apply the changes described in the annotation's `comment`
   7. Follow all guards (showcase, component hierarchy, token routing)
   8. **Visual review:** Call `screenshot_canvas` (no frameId — screenshot all frames)
      - Read the screenshot to verify the new iteration looks correct
      - Fix any visual issues before resolving
   9. Call `resolve_annotation` with the annotation `id`
   10. Log to `CHANGELOG.md`, commit: `git add src/projects/ && git commit -m 'feat: iteration V<N+1> — <brief description>'`
   - Call `watch_annotations` again — back to waiting

   **Timeout** (response contains `"timeout": true`) — no annotation arrived. Call `watch_annotations` again to keep waiting. The timeout exists so you stay responsive to designer messages between polls.

6. **Chat while watching:** The designer can send messages at any time — you'll see them between `watch_annotations` calls. Handle the message (answer a question, make a change, kill the server, etc.), then resume the watch loop by calling `watch_annotations` again.
