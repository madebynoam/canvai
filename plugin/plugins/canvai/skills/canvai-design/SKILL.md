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

4. **Drain backlog:** Run `npx canvai pending` to check for annotations that arrived before the session started. Process each one following the guard protocol.

5. **Check for context images:** Before generating any designs, run:
   ```bash
   npx canvai context --project <name> --iteration <v>
   ```
   This returns paths to inspiration images. Read them with the Read tool and analyze via Vision. Incorporate their style into your generations.

6. **Enter watch loop:** Run `npx canvai watch` in a loop. Each call waits up to 15 seconds for the designer to click "Apply" on an annotation. Three outcomes:

   **Regular annotation arrives** (JSON with annotation data) — process it:
   - Run `npx canvai progress <id> "Reading file..."` to show status on canvas
   - **Fast file lookup:** Parse `frameId` (e.g. `"v9-shell"`) to get the iteration (`v9`) and component hint. Grep for `componentName` in that iteration's folder. The annotation metadata is a direct map to the file — never use an Explore agent or broad codebase search.
   - Read the `comment`, `componentName`, `selector`, and `computedStyles`
   - **Follow the guard protocol** (see CLAUDE.md "Before any edit")
   - Map to file in `v<N>/components/` or `v<N>/pages/`
   - Run `npx canvai progress <id> "Applying changes..."`
   - **Token routing:** Route visual value changes through `tokens.css`
   - Apply the requested changes
   - Run `npx canvai progress <id> "Taking screenshot..."`
   - **Visual review:** Run `npx canvai screenshot --frame <frameId>`
     - Read the returned screenshot file to see the result
     - Check for: broken contrast, overflow/clipping, misalignment, wrong colors, missing styles
     - If issues found: fix them and screenshot again
     - If clean: proceed
   - Run `npx canvai resolve <id>` (this auto-commits project changes)
   - Log the change to `CHANGELOG.md`
   - Run `npx canvai watch` again — back to waiting

   **Iteration request arrives** (JSON has `type: 'iteration'`) — run the iteration protocol:
   1. Read `manifest.ts`, find the active iteration (last with `frozen: false`)
   2. Freeze it (`frozen: true`)
   3. Copy folder: `cp -r v<N>/ v<N+1>/`
   4. Rename CSS scope in `v<N+1>/tokens.css`: `.iter-v<N>` → `.iter-v<N+1>`
   5. Add new iteration to manifest with `frozen: false`, update import paths
   6. Apply the changes described in the annotation's `comment`
   7. Follow all guards (showcase, component hierarchy, token routing)
   8. **Visual review:** Run `npx canvai screenshot` (no --frame = all frames)
      - Read the screenshot to verify the new iteration looks correct
      - Fix any visual issues before resolving
   9. Run `npx canvai resolve <id>` (this auto-commits project changes)
   10. Log to `CHANGELOG.md`
   - Run `npx canvai watch` again — back to waiting

   **Project request arrives** (JSON has `type: 'project'`) — create a new project:
   1. Parse the JSON comment: `{ name, description, prompt }`
   2. Create the project folder structure: `src/projects/<name>/v1/{tokens.css, components/index.ts, pages/, context/}`
   3. Create `manifest.ts` and `CHANGELOG.md`
   4. If `prompt` is provided, follow the "What happens next" sequence from `/canvai-new` **EXACTLY** — especially step 1 which REQUIRES generating 3-5 genuinely different design directions. The "All Directions" page must be the first thing the designer sees.
   5. Run `npx canvai resolve <id>`
   6. Run `npx canvai watch` again — back to waiting

   **Context image annotation arrives** (annotation on a `Context Image` component) — use the image for inspiration:
   - Run `npx canvai context --project <name> --iteration <v>` to get image paths
   - Read the images with the Read tool to analyze via Vision
   - Apply the designer's comment (e.g., "use these colors", "make more like this")
   - Reference specific visual elements from the context images when generating

   **Timeout** (JSON contains `"timeout": true`) — no annotation arrived. Run `npx canvai watch` again to keep waiting. The timeout exists so you stay responsive to designer messages between polls.

7. **Chat while watching:** The designer can send messages at any time — you'll see them between `watch` calls. Handle the message (answer a question, make a change, kill the server, etc.), then resume the watch loop by running `npx canvai watch` again.

## CLI Commands Reference

All annotation commands output JSON for easy parsing:

```bash
# Wait for next annotation (15s default timeout)
npx canvai watch [--timeout N]

# Mark annotation as resolved (auto-commits)
npx canvai resolve <id>

# List pending annotations
npx canvai pending

# List all annotations
npx canvai list

# Screenshot canvas
npx canvai screenshot [--frame <id>] [--delay <ms>]

# Get context image paths
npx canvai context --project <name> --iteration <v>
```
