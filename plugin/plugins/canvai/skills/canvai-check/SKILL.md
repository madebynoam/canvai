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
   - Follow the **"Before any edit"** protocol in CLAUDE.md (frozen check, primitive check, token usage)
   - Read the annotation — `frameId`, `componentName`, `selector`, `comment`, `computedStyles`
   - If the iteration is frozen, resolve the annotation with a note and skip
   - Map the `componentName` and `selector` to the relevant component or primitive
   - Apply changes using `var(--token)` values
   - Call `resolve_annotation` with the annotation ID
   - Log the change to `src/projects/<project-name>/CHANGELOG.md`

4. **Report** what was changed.

## Notes

- If an annotation requests exploration or new iterations, use the `/canvai-iterate` workflow
- Process annotations in order (lowest ID first)
- Always resolve annotations after applying changes
