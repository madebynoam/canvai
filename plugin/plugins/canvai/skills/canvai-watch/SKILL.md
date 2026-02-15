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
   - Follow the **"Before any edit"** protocol (frozen check → primitive check → token usage)
   - If frozen, resolve with a note and re-enter loop
   - Edit the component or primitive using `var(--token)` values
   - Call `resolve_annotation`, log to CHANGELOG.md
   - Call `watch_annotations` again — back to waiting

5. **Exit:** The designer sends any message to break out of watch mode and return to normal chat.
