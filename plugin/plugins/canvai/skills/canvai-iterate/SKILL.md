---
name: canvai-iterate
description: Create a new design iteration for the current project
---

# /canvai-iterate [description]

Create a new version/iteration of the current design as a new entry in the manifest's `iterations` array.

## Steps

1. **Identify the active project.** Look at which project the designer has been working on (check recent file edits in `src/projects/`).

2. **Read the current manifest** — `src/projects/<project-name>/manifest.ts`

3. **Add a new iteration** to the `iterations` array in the manifest:
   - Name it `V<N>` where N is the next version number
   - Copy the pages from the previous iteration as a starting point
   - Apply the requested changes to the component or create a new variant

4. **Modify the component** if needed — update the `.tsx` file or create a new variant file.

5. **The canvas picks up the new iteration automatically** via HMR. The designer will see a new collapsible group in the sidebar.

6. **Confirm:** "Created V<N>. You can expand it in the sidebar to see its pages."

## Example

Designer says: "Let's try a version with rounded corners and no shadow"

The agent:
1. Reads `manifest.ts`, finds V1 with 1 page containing 9 frames
2. Adds V2 iteration with the same pages but pointing to updated props or a new component variant
3. Updates the component to support the new style
4. The sidebar now shows: `▼ V1` (with its pages) and `▼ V2` (with its pages)

## Rules

- Never delete or modify existing iterations — they are frozen snapshots
- Always add a new iteration for design versions
- The component can be shared across iterations (same file, different props) or forked (new file for major changes)
- Keep iteration names short (e.g. "V1", "V2")
- Page names within an iteration should be descriptive (e.g. "Design System", "Components", "States")
