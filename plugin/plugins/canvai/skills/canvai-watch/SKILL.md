---
name: canvai-watch
description: Enter watch mode — process annotations from the canvas as they arrive
---

# /canvai-watch

Enter watch mode for rapid visual iteration. The agent listens for annotations from the canvas and applies them automatically.

## Prerequisites

The dev server must be running (`/canvai-dev` or `npx canvai dev`).

## Steps

1. **Check for pending annotations first:** Call `get_pending_annotations`. Process any that are waiting before entering the loop.

2. **Confirm:** "Watching for annotations. Send any message to exit."

3. **Enter the watch loop:** Call `watch_annotations`. This blocks until the designer submits an annotation from the canvas.

4. **When an annotation arrives:**
   - Read the `comment`, `componentName`, `selector`, and `computedStyles`
   - **Follow the guard protocol** (see CLAUDE.md "Before any edit"):
     1. Check if the target iteration is frozen — if so, resolve with a note and continue watching
     2. Check component hierarchy — if target is in `pages/`, route changes through `components/`
     3. Check `components/index.ts` for existing components before creating new ones
   - Map the annotation to the relevant file in `v<N>/components/` or `v<N>/pages/`
   - **Token routing:** If the annotation changes a visual value (color, background, border, shadow, size, spacing):
     1. Open `v<N>/tokens.css` and look for a matching semantic token
     2. Found → update the token value; the component already uses `var(--token)`, no component edit needed
     3. Not found → add a new semantic token to `tokens.css`, then update the component to use `var(--new-token)`
     4. Never hardcode a visual value — not in components, not in pages, ever
   - Edit the component/page file to apply structural changes (layout, composition, new elements)
   - Call `resolve_annotation` with the annotation `id`
   - Log the change to `CHANGELOG.md`
   - Commit the changes: `git add src/projects/ && git commit -m 'style: annotation #<N> — <brief description>'`
   - Call `watch_annotations` again — back to waiting

5. **Exit:** The designer sends any message to break out of watch mode and return to normal chat.
