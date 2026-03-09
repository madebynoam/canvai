---
name: bryllen-design
description: Start (or restart) the Bryllen dev server
---

# /bryllen-design

Start the Bryllen dev server and enter watch mode.

## Steps

1. **Kill only THIS project's existing servers** (not other bryllen instances):
   ```bash
   if [ -f .bryllen-ports.json ]; then
     # Kill by PID (safe) — never by port (could kill another project's server)
     node -e "
       const f = JSON.parse(require('fs').readFileSync('.bryllen-ports.json','utf8'));
       for (const pid of [f.pid, f.vitePid, f.httpPid].filter(Boolean)) {
         try { process.kill(pid, 'SIGTERM'); } catch {}
       }
     "
     rm -f .bryllen-ports.json
   fi
   ```
   This reads PIDs from the ports file and kills only THIS project's processes. Other bryllen instances are untouched. It's fine if nothing was running.

2. **Start the dev server** in the background:
   ```bash
   npx bryllen design
   ```

3. **Confirm:** "Dev server running. Canvas at http://localhost:5173"

4. **Drain backlog:** Run `npx bryllen pending` to check for annotations that arrived before the session started. Process each one following the guard protocol.

5. **Check for context images:** Before generating any designs, run:
   ```bash
   npx bryllen context --project <name> --iteration <v>
   ```
   This returns paths to inspiration images. Read them with the Read tool and analyze via Vision. Incorporate their style into your generations.

6. **Enter watch loop:** Run `npx bryllen watch` in a loop. Each call waits up to 15 seconds for the designer to click "Apply" on an annotation. Three outcomes:

   **Regular annotation arrives** (JSON with annotation data) — process it:

   **The annotation IS the map. Read the fields, construct the path, done:**
   - `project` → `src/projects/{project}/`
   - `frameId` prefix (e.g. `v9-shell`) → `v9/` folder
   - `componentName` → file in `components/` or `pages/`

   **NEVER guess the project from git commits, Explore agents, or "which is active" heuristics.**

   - Run `npx bryllen progress <id> "Reading file..."` to show status on canvas
   - Grep for `componentName` in `src/projects/{project}/{iteration}/` — that's the file
   - Read the `comment`, `selector`, and `computedStyles` for what to change
   - **Follow the guard protocol** (see CLAUDE.md "Before any edit")
   - Map to file in `v<N>/components/` or `v<N>/pages/`
   - Run `npx bryllen progress <id> "Applying changes..."`
   - **Token routing:** Route visual value changes through `tokens.css`
   - Apply the requested changes
   - Run `npx bryllen progress <id> "Taking screenshot..."`
   - **Visual review:** Run `npx bryllen screenshot --frame <frameId>`
     - Read the returned screenshot file to see the result
     - Check for: broken contrast, overflow/clipping, misalignment, wrong colors, missing styles
     - If issues found: fix them and screenshot again
     - If clean: proceed
   - Run `npx bryllen resolve <id>` (this auto-commits project changes)
   - Log the change to `CHANGELOG.md`
   - Run `npx bryllen watch` again — back to waiting

   **Iteration request arrives** (JSON has `type: 'iteration'`) — run the iteration protocol:
   1. Read `manifest.ts`, find the active iteration (last with `frozen: false`)
   2. Freeze it (`frozen: true`)
   3. Copy folder: `cp -r v<N>/ v<N+1>/`
   4. Rename CSS scope in `v<N+1>/tokens.css`: `.iter-v<N>` → `.iter-v<N+1>`
   5. Add new iteration to manifest with `frozen: false`, update import paths
   6. Apply the changes described in the annotation's `comment`
   7. Follow all guards (showcase, component hierarchy, token routing)
   8. **Visual review:** Run `npx bryllen screenshot` (no --frame = all frames)
      - Read the screenshot to verify the new iteration looks correct
      - Fix any visual issues before resolving
   9. Run `npx bryllen resolve <id>` (this auto-commits project changes)
   10. Log to `CHANGELOG.md`
   - Run `npx bryllen watch` again — back to waiting

   **Project request arrives** (JSON has `type: 'project'`) — create a new project:
   1. Parse the JSON comment: `{ name, description, prompt }`
   2. Create the project folder structure: `src/projects/<name>/v1/{tokens.css, components/index.ts, pages/, context/}`
   3. Create `manifest.ts` and `CHANGELOG.md`
   4. If `prompt` is provided, follow the "What happens next" sequence from `/bryllen-new` **EXACTLY** — especially step 1 which REQUIRES generating 3-5 genuinely different design directions. The "All Directions" page must be the first thing the designer sees.
   5. Run `npx bryllen resolve <id>`
   6. Run `npx bryllen watch` again — back to waiting

   **Share request arrives** (JSON has `type: 'share'`) — deploy to GitHub Pages:
   1. Parse the JSON comment: `{ project: '<name>' }`
   2. Run `npx bryllen progress <id> "Checking GitHub authentication..."`
   3. Check GitHub auth: run `gh auth status`
      - If not logged in: check for token in `~/.bryllen/auth.json`
      - If token exists: set `GH_TOKEN` env var for gh-pages
      - If no token: tell designer to click "Login with GitHub" in the Share popover
   4. Check gh CLI: run `which gh`
      - If not installed: use `npm:gh-pages` package directly (it uses GH_TOKEN)
   5. Run `npx bryllen progress <id> "Building project..."`
   6. Invoke `/bryllen-share <project-name>` — this handles build, deploy, and URL writing
   7. Run `npx bryllen resolve <id>`
   8. Run `npx bryllen watch` again — back to waiting

   **Pick request arrives** (JSON has `type: 'pick'`) — promote the picked direction(s) to a new iteration:
   1. Read the `frameId`, `frameIds`, and `comment` from the annotation
      - `frameIds` is an array when multiple frames were selected (marquee multi-select)
      - `frameId` is a `+`-joined string of all IDs (e.g., `"dir-a+dir-b+dir-c"`)
   2. Run `npx bryllen progress <id> "Picking direction..."`
   3. Find each frame's source file (component or page) from the frameIds
   4. Create a new iteration that:
      - **Single pick:** Copies the picked direction as the starting point
      - **Multi-pick:** Combines ALL picked directions — extract shared patterns, merge complementary elements, resolve conflicts thoughtfully
      - Builds out all states (loading, error, empty, success, etc.)
      - Names it appropriately (e.g., "V3 — Picked Direction" or "V3 — Combined")
   5. Update the **previous iteration's manifest** entry:
      - **Single pick:** Set `pickedFrameId` to the chosen frame's ID (this fades other frames)
      - **Multi-pick:** Set `pickedFrameIds` to the array of chosen frame IDs (all picked frames stay unfaded)
      - Set `frozen: true`
   6. Add the new iteration to manifest with `frozen: false`
   7. Run `npx bryllen progress <id> "Taking screenshot..."`
   8. Run `npx bryllen screenshot` to verify the result
   9. Run `npx bryllen resolve <id>` (auto-commits)
   10. Log to `CHANGELOG.md`
   - Run `npx bryllen watch` again — back to waiting

   **Multi-pick strategy:**
   When the designer selects multiple frames, they want to combine strengths from each:
   - Extract what works best from each direction (layout from A, color palette from B, interaction from C)
   - Resolve conflicts by choosing the stronger solution or creating a synthesis
   - The result should feel cohesive, not like a Frankenstein of disconnected parts
   - When in doubt, ask the designer which element they prefer via a comment in the annotation response

   **Context image annotation arrives** (annotation on a `Context Image` component) — use the image for inspiration:
   - Run `npx bryllen context --project <name> --iteration <v>` to get image paths
   - Read the images with the Read tool to analyze via Vision
   - Apply the designer's comment (e.g., "use these colors", "make more like this")
   - Reference specific visual elements from the context images when generating

   **Timeout** (JSON contains `"timeout": true`) — no annotation arrived. Run `npx bryllen watch` again to keep waiting. The timeout exists so you stay responsive to designer messages between polls.

7. **Chat while watching:** The designer can send messages at any time — you'll see them between `watch` calls. Handle the message (answer a question, make a change, kill the server, etc.), then resume the watch loop by running `npx bryllen watch` again.

## CLI Commands Reference

All annotation commands output JSON for easy parsing:

```bash
# Wait for next annotation (15s default timeout)
npx bryllen watch [--timeout N]

# Mark annotation as resolved (auto-commits)
npx bryllen resolve <id>

# List pending annotations
npx bryllen pending

# List all annotations
npx bryllen list

# Screenshot canvas
npx bryllen screenshot [--frame <id>] [--delay <ms>]

# Get context image paths
npx bryllen context --project <name> --iteration <v>
```
