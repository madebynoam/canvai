---
name: canvai-iterate
description: Create a new design iteration (page) for the current project
---

# /canvai-iterate [description]

Create a new version/iteration of the current design as a new page in the manifest.

## Steps

1. **Identify the active project.** Look at which project the designer has been working on (check recent file edits in `src/projects/`).

2. **Read the current manifest** — `src/projects/<project-name>/manifest.ts`

3. **Add a new page** to the `pages` array in the manifest:
   - Name it `V<N> — <description>` where N is the next version number
   - Copy the frames from the previous page as a starting point
   - Apply the requested changes to the component or create a new variant

4. **Modify the component** if needed — update the `.tsx` file or create a new variant file.

5. **The canvas picks up the new page automatically** via HMR. The designer will see a new tab in the page tabs bar.

6. **Confirm:** "Created V<N> — <description>. You can switch between versions using the page tabs."

## Example

Designer says: "Let's try a version with rounded corners and no shadow"

The agent:
1. Reads `manifest.ts`, finds V1 with 9 frames
2. Adds V2 page with same 9 frames but pointing to updated props or a new component variant
3. Updates the component to support the new style
4. The canvas now shows: `[V1 — Initial] [V2 — Rounded]`

## Rules

- Never delete or modify existing pages — they are frozen snapshots
- Always add a new page for iterations
- The component can be shared across pages (same file, different props) or forked (new file for major changes)
- Keep page names short and descriptive
