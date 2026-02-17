---
name: canvai-iterate
description: Create a new design iteration for the current project
---

# /canvai-iterate [description]

Create a new iteration as a complete snapshot copy of the current active iteration. The old iteration is frozen, the new one becomes active.

## Steps

1. **Identify the active project.** Look at which project the designer has been working on (check recent file edits in `src/projects/`).

2. **Read the current manifest** — `src/projects/<project-name>/manifest.ts`. Find the active iteration (the last one with `frozen: false`).

3. **Freeze the active iteration.** In the manifest, set `frozen: true` on the current iteration.

4. **Copy the entire iteration folder:**
   ```bash
   cp -r src/projects/<project-name>/v<N>/ src/projects/<project-name>/v<N+1>/
   ```
   This copies EVERYTHING — tokens, components, pages, spring.ts. The new iteration is a complete, self-contained snapshot.

5. **Rename the CSS scope** in `v<N+1>/tokens.css`:
   - Replace `.iter-v<N>` with `.iter-v<N+1>` (all occurrences)

6. **Add the new iteration to the manifest:**
   - Add a new entry to the `iterations` array with `name: 'V<N+1>'` and `frozen: false`
   - Copy all pages from the previous iteration's manifest entry
   - Update all import paths: `./v<N>/` → `./v<N+1>/`
   - Add the CSS import: `import './v<N+1>/tokens.css'`

7. **Apply the requested changes** in the new iteration. Follow the guard protocol for every edit:
   - Components go in `v<N+1>/components/`, pages in `v<N+1>/pages/`
   - If a page needs an element, create it as a component first

8. **Showcase guard — mandatory.** After all changes, check: did you create any new component files in `v<N+1>/components/`?
   - For each new component: verify it's exported from `components/index.ts` AND has a showcase entry in `pages/components.tsx` showing its variations and states
   - The barrel export and the showcase are **two separate registrations** — both are mandatory
   - A component that exists in `components/` but isn't visible on the Components page is invisible to the designer — they can't annotate what they can't see

9. **Log to CHANGELOG.md:** "Created V<N+1> from V<N>" plus any changes made

10. **Confirm:** "Created V<N+1>. The previous iteration (V<N>) is now frozen. You can see V<N+1> in the iteration pills."

## Example

Designer says: "Let's try a version with rounded corners and no shadow"

The agent:
1. Reads `manifest.ts`, finds V2 is active (`frozen: false`)
2. Sets V2 to `frozen: true`
3. Runs `cp -r v2/ v3/`
4. Renames `.iter-v2` → `.iter-v3` in `v3/tokens.css`
5. Adds V3 iteration to manifest with updated imports
6. Makes the requested changes (rounded corners, no shadow) in `v3/components/`
7. Showcase guard: if a new `Card.tsx` was created in `v3/components/`, verifies it's in `index.ts` AND has a section in `v3/pages/components.tsx`
8. The iteration pills now show V1, V2, V3 — with V3 active

## Rules

- **Copy EVERYTHING.** Pages added in V2 carry forward to V3. Components created in V2 carry forward. The folder copy handles this automatically.
- **Forward-only.** Never merge, never delete iterations. Old iterations are frozen snapshots.
- **No cross-iteration imports.** Each `v<N>/` is completely self-contained. Never import from `../v1/components/` in `v2/`.
- **One active iteration.** Only the last iteration (with `frozen: false`) can be edited.
- **Keep iteration names short.** `V1`, `V2`, `V3` — not descriptions.
