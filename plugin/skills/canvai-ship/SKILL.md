---
name: canvai-ship
description: Ship the final component to a production repo
---

# /canvai-ship [target-repo]

Ship the finished component from the active design project to a production codebase.

## Steps

1. **Identify the active project** and which page/component the designer considers final. Ask if unclear.

2. **Identify the target repo.** If provided as an argument, use that. Otherwise ask:
   - "Which repo should I ship this to? (path or GitHub URL)"

3. **Copy the component files** (`.tsx` only, not the manifest) to the target repo:
   - Place them in a sensible location (e.g. `src/components/`)
   - Strip any Canvai-specific imports

4. **Open a PR** in the target repo:
   ```bash
   gh pr create --title "Add <ComponentName> component" --body "..."
   ```
   Include:
   - Component name and description
   - Props interface
   - Which variations/states are supported

5. **Confirm:** "PR opened: <url>"

## Rules

- Only ship component files, never the manifest or Canvai runtime code
- Strip relative imports that reference `../../runtime/` — those are Canvai internals
- If the component uses design tokens or shared styles, flag that to the designer
