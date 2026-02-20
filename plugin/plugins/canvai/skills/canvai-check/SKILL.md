---
name: canvai-check
description: Check for pending annotations and process them
---

# /canvai-check

Check for pending canvas annotations and process them.

## Steps

1. **Call `get_pending_annotations`** to fetch all unresolved annotations.

2. **If none pending**, report "No pending annotations." and stop.

3. **For each annotation**, process it:
   - Read the annotation — `frameId`, `componentName`, `selector`, `comment`, `computedStyles`
   - **Follow the guard protocol** (see CLAUDE.md "Before any edit"):
     1. Read `manifest.ts` — check if the target iteration is frozen. If frozen, resolve with a note ("Iteration V<N> is frozen — skipping") and move to the next annotation.
     2. Check component hierarchy — if the target is in `pages/`, ensure changes go through `components/`
     3. Check `components/index.ts` — does a component already exist for this?
   - Map the annotation to the relevant file in `v<N>/components/` or `v<N>/pages/`
   - If the change targets a page element, modify or create the component in `components/` first, then update the page
   - **Token routing:** If the annotation changes a visual value (color, background, border, shadow, size, spacing):
     1. Open `v<N>/tokens.css` and look for a matching semantic token
     2. Found → update the token value; the component already uses `var(--token)`, no component edit needed
     3. Not found → add a new semantic token to `tokens.css`, then update the component to use `var(--new-token)`
     4. Never hardcode a visual value — not in components, not in pages, ever
   - Apply the requested changes
   - **Showcase guard:** If you created a new component file, verify it's exported from `components/index.ts` AND has a showcase entry in `pages/components.tsx` with its variations and states. Both registrations are mandatory — a component the designer can't see on the Components page can't be annotated.
   - Call `resolve_annotation` with the annotation ID
   - Log the change to `src/projects/<project-name>/CHANGELOG.md`
   - Commit the changes: `git add src/projects/ && git commit -m 'style: annotation #<N> — <brief description>'`

4. **Report** what was changed.

## Notes

- Annotations only become pending after the designer clicks "Apply" in the TopBar dropdown. Draft annotations are not visible to the agent.
- If an annotation requests exploration or new iterations, use the `/canvai-iterate` workflow
- Process annotations in order (lowest ID first)
- Always resolve annotations after applying changes
- If an annotation targets a frozen iteration, resolve it with a note and skip
