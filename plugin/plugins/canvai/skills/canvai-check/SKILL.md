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
   - Apply the requested changes
   - Call `resolve_annotation` with the annotation ID
   - Log the change to `src/projects/<project-name>/CHANGELOG.md`

4. **Report** what was changed.

## Notes

- If an annotation requests exploration or new iterations, use the `/canvai-iterate` workflow
- Process annotations in order (lowest ID first)
- Always resolve annotations after applying changes
- If an annotation targets a frozen iteration, resolve it with a note and skip
