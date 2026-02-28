---
name: canvai-design
description: Start (or restart) the Canvai dev server
---

# /canvai-design

Start the Canvai dev server and enter watch mode.

## Steps

1. **Kill only THIS project's existing servers** (not other canvai instances):
   ```bash
   if [ -f .canvai-ports.json ]; then
     # Kill by PID (safe) — never by port (could kill another project's server)
     node -e "
       const f = JSON.parse(require('fs').readFileSync('.canvai-ports.json','utf8'));
       for (const pid of [f.pid, f.vitePid, f.httpPid].filter(Boolean)) {
         try { process.kill(pid, 'SIGTERM'); } catch {}
       }
     "
     rm -f .canvai-ports.json
   fi
   ```
   This reads PIDs from the ports file and kills only THIS project's processes. Other canvai instances are untouched. It's fine if nothing was running.

2. **Start the dev server** in the background:
   ```bash
   npx canvai design
   ```

3. **Confirm:** "Dev server running. Canvas at http://localhost:5173"

4. **Drain backlog:** Call `get_pending_annotations` to process any that arrived before the session started. Process each one following the guard protocol.

5. **Check for context images:** Before generating any designs, call `get_context_images({ project, iteration })` to see if the designer has pasted inspiration images. If images exist, analyze them via Vision and incorporate their style into your generations.

6. **Enter watch loop:** Call `watch_annotations` in a loop. Each call waits up to 30 seconds for the designer to click "Apply" on an annotation. Three outcomes:

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
   - Call `resolve_annotation` with the annotation `id` (this auto-commits project changes)
   - Log the change to `CHANGELOG.md`
   - Call `watch_annotations` again — back to waiting

   **Iteration request arrives** (annotation has `type: 'iteration'`) — run the iteration protocol:
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
   9. Call `resolve_annotation` with the annotation `id` (this auto-commits project changes)
   10. Log to `CHANGELOG.md`
   - Call `watch_annotations` again — back to waiting

   **Project request arrives** (annotation has `type: 'project'`) — create a new project:
   1. Parse the JSON comment: `{ name, description, prompt }`
   2. Create the project folder structure: `src/projects/<name>/v1/{tokens.css, components/index.ts, pages/, context/}`
   3. Create `manifest.ts` and `CHANGELOG.md`
   4. If `prompt` is provided, generate the initial design following the "What happens next" sequence from `/canvai-new`. **CRITICAL: generate 3-5 distinct design directions shown side by side on an "All Directions" page.** The whole point of Canvai is seeing many at once — never generate just one design.
   5. Call `resolve_annotation` with the annotation `id`
   6. Call `watch_annotations` again — back to waiting

   **Context image annotation arrives** (annotation on a `Context Image` component) — use the image for inspiration:
   - Call `get_context_images({ project, iteration })` to retrieve all context images
   - Analyze the images via Vision to understand the design direction
   - Apply the designer's comment (e.g., "use these colors", "make more like this")
   - Reference specific visual elements from the context images when generating

   **Timeout** (response contains `"timeout": true`) — no annotation arrived. Call `watch_annotations` again to keep waiting. The timeout exists so you stay responsive to designer messages between polls.

7. **Chat while watching:** The designer can send messages at any time — you'll see them between `watch_annotations` calls. Handle the message (answer a question, make a change, kill the server, etc.), then resume the watch loop by calling `watch_annotations` again.
