# Canvai — Agent Instructions

Canvai is a design studio. A Figma-like infinite canvas where every design is live React code. The designer describes what they want, the agent builds it on the canvas, the designer annotates with Agentation to iterate, and the final code gets PR'd to a production repo.

## User workflow

1. **Clone** — `git clone` this repo once. It's the app.
2. **`/canvai-install`** — First-time setup. Installs dependencies, configures the Agentation MCP server.
3. **`/canvai-init <project-name>`** — Creates a new design project in `src/projects/<project-name>/`, wires it into the canvas, launches the dev server and MCP. Ready to design.
4. **Describe** — The designer describes the component (or attaches a sketch). The agent generates the component with variations and states, places them as frames on the canvas.
5. **Annotate** — The designer uses Agentation to annotate elements in the browser. The MCP feeds structured feedback (CSS selectors, component names, computed styles) to the agent, who applies the changes directly.
6. **Ship** — PR the finished components to the production codebase.

## Project structure

```
src/
  runtime/          ← platform (do not modify)
    Canvas.tsx      ← infinite canvas (pan, zoom, drag)
    Frame.tsx       ← draggable frame on the canvas
    useFrames.ts    ← frame registry (add, update, remove)
    types.ts        ← TypeScript types
  projects/         ← design projects (one folder per project)
    <project-name>/
      Component.tsx
      ...
  App.tsx           ← wiring (frames array lives here)
```

## How the canvas works

The canvas is an infinite 2D surface. Frames are placed at absolute `{ x, y }` positions. Each frame renders a live React component. Frames are transparent — no background, no border. The component IS the frame content.

## Component matrix

When the designer describes a component, don't just build one instance. Think through the component's **variations** and **states**, then generate all meaningful combinations as a grid on the canvas.

- **Columns** = states or interaction phases (e.g. Default, Hover, Active, Disabled)
- **Rows** = variations or content scenarios (e.g. Short text, Long text, With icon, Error)

This is how designers think — every combination visible at once, like a spec sheet.

### Example

A designer says: "Build a writing suggestion card."

The agent should generate:

| | Highlight | Hover | Suggestion |
|---|---|---|---|
| Complex word | highlight state | hover popover | suggestion card |
| Long sentence | highlight state | hover popover | suggestion card |
| Adverb | highlight state | hover popover | suggestion card |

Each cell is a separate frame on the canvas, each rendering a live React component with the right props for that variation × state.

### How to lay out the grid

1. **Pick a grid origin** (default: `x: 100, y: 100`)
2. **Column width** = consistent per component type (e.g. 300px)
3. **Row height** = consistent per component type (e.g. 160px)
4. **Gap** = 40px between frames
5. **Column headers** = small label frames at `y: 60` (above the grid)
6. **Row labels** = implicit in the frame title

```
Column headers:    "Default"        "Hover"          "Active"
                   x:100            x:440            x:780
Row 1 (y:100):     [variation-1]    [variation-1]    [variation-1]
Row 2 (y:300):     [variation-2]    [variation-2]    [variation-2]
Row 3 (y:500):     [variation-3]    [variation-3]    [variation-3]
```

### Adding frames to the canvas

Add entries to the frames array in `src/App.tsx`:

```tsx
{
  id: 'card-complex-word-highlight',
  title: 'Card / Complex Word / Highlight',
  x: 100, y: 100,
  width: 300, height: 160,
  component: SuggestionCard,
  props: { variant: 'complex-word', state: 'highlight' },
}
```

Import components from `src/projects/<project-name>/`.

### Naming convention

Frame IDs and titles follow: `<component>-<variation>-<state>`

Title format: `Component / Variation / State`

## Spatial layout conventions

- **Columns** = states, flowing left to right, 40px gap
- **Rows** = variations, flowing top to bottom, 40px gap
- Keep consistent column widths and row heights per component
- When adding a new component, start a new grid section below the previous one with 80px vertical gap

## Annotation flow (Agentation)

When you receive annotation feedback via the Agentation MCP:
1. Read the annotation — it includes CSS selectors, component names, and computed styles
2. Map the selector to the relevant frame and component
3. Apply the requested changes to the component code
4. The canvas re-renders live — verify the change is correct

## Skills

- **`/canvai-install`** — First-time setup (npm install, Agentation MCP config)
- **`/canvai-init <project-name>`** — Create a new design project and start designing

## Commands

- `npm run dev` — start dev server
- `npm run build` — build for production
