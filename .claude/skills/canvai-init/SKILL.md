---
name: canvai-init
description: Create a new design project and start designing
---

# /canvai-init <project-name>

Create a new design project inside Canvai and launch the dev environment.

## Steps

1. **Parse the project name** from the user's command (e.g. `/canvai-init team-permissions`). If no name is provided, ask for one.

2. **Create the project folder:**
   ```
   src/projects/<project-name>/
   ```

3. **Launch the dev server** in the background:
   ```bash
   npm run dev -- --open
   ```

4. **Confirm:** "Project `<project-name>` is ready. Describe a component — I'll generate its variations and states as a matrix on the canvas."

## What happens next

After init, the designer describes a component (or attaches a sketch). The agent then:

1. **Identifies variations** — content scenarios, types, sizes (these become rows)
2. **Identifies states** — interaction phases, conditions (these become columns)
3. **Generates the matrix** — builds the component with props for each variation × state combination
4. **Lays out the grid** — places every combination as a frame on the canvas, columns = states, rows = variations, all visible at once

See CLAUDE.md "Component matrix" for layout specifics.
