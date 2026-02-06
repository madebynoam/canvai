# Canvai — Agent Instructions

This is a Canvai design canvas project. You are working inside a spatial canvas where design components are rendered as live React code.

## Project structure

- `src/App.tsx` — main app, renders Canvas with Frames
- `src/components/Canvas.tsx` — infinite canvas (pan, zoom, drag)
- `src/components/Frame.tsx` — individual frame on the canvas
- `src/hooks/useFrames.ts` — frame registry (add, update, remove)
- `src/types.ts` — TypeScript types

## How the canvas works

The canvas is an infinite 2D surface. Frames are placed at absolute `{ x, y }` positions. Each frame renders a live React component.

## Adding a frame

To add a new design component to the canvas, add a new entry to the frames array in `src/App.tsx`:

```tsx
{
  id: 'unique-id',
  title: 'Component / Variant',
  x: <number>,
  y: <number>,
  width: <number>,
  height: <number>,
  component: YourComponent,
  props: { /* component props */ },
}
```

## Spatial layout conventions

- Place new variations **to the right** of existing frames, with 40px gap
- Place new states **below** their parent variation
- Group related components together
- Keep consistent frame widths for the same component type

## Updating a frame

Modify the frame's entry in the frames array — change `component`, `props`, `width`, `height`, or position (`x`, `y`).

## Removing a frame

Delete the frame's entry from the frames array.

## Creating a design component

Create a new React component file in `src/components/` and import it into `App.tsx`. Place it in a frame.

## Annotation flow (Agentation)

When you receive annotation feedback via the Agentation MCP:
1. Read the annotation — it includes CSS selectors, component names, and computed styles
2. Map the selector to the relevant frame and component
3. Apply the requested changes to the component code
4. The canvas re-renders live — verify the change is correct

## Commands

- **Dev server:** `npm run dev`
- **Build:** `npm run build`
