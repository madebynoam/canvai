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
   - Edit the component file to apply the requested change
   - Call `resolve_annotation` with the annotation `id`
   - Call `watch_annotations` again — back to waiting

5. **Exit:** The designer sends any message to break out of watch mode and return to normal chat.
