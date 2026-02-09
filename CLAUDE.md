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
  app/              ← platform (do not modify)
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

## Adding a frame

Add a new entry to the frames array in `src/App.tsx`:

```tsx
{
  id: 'unique-id',
  title: 'Component / Variant',
  x: <number>, y: <number>,
  width: <number>, height: <number>,
  component: YourComponent,
  props: { /* component props */ },
}
```

Import the component from `src/projects/<project-name>/`.

## Spatial layout conventions

- Place new variations **to the right** of existing frames, with 40px gap
- Place new states **below** their parent variation
- Group related components together
- Keep consistent frame widths for the same component type

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
