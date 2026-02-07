# Canvai

A lightweight design canvas for AI-assisted product design. Code is the surface.

Canvai gives designers a Figma-like infinite canvas where every iteration is code from the start. Attach it to a Claude Code skill, and the full design loop (concept, iteration, review, production) happens without switching tools or translating formats.

## How it works

1. **Clone** — `git clone` this repo once. It's the design studio.
2. **`/install`** — First-time setup. Installs dependencies, configures the Agentation MCP server.
3. **`/init team-permissions`** — Creates `src/projects/team-permissions/`, wires it into the canvas, launches the dev server and MCP. Ready to design.
4. **Describe** — Tell the agent what to build. It generates the component with variations and states, placed as frames on the canvas.
5. **Annotate** — Use Agentation in the browser to annotate elements. The MCP feeds structured feedback to the agent, who applies changes directly.
6. **Ship** — PR the finished components to the production codebase. The code was the material the whole time.

## What's in the box

- **`src/app/`** - the platform. Canvas, Frame, useFrames, types. Don't modify.
- **`src/projects/`** - your design projects. Each project is a folder with its own components.
- **`src/App.tsx`** - wiring. Register frames from your project components here.
- **Spatial canvas component** - pan, zoom, drag. Figma-like interactions, zero dependencies. Based on the [WPUI Lab](https://github.com/madebynoam/WPUI-Lab) canvas.
- **Agentation integration** - pre-installed via [agentation.dev/install](https://agentation.dev/install). MCP server configured so the agent can read annotations without copy-paste.
- **CLAUDE.md** - teaches the agent how the canvas works, how to add/update/remove design components, and the spatial layout conventions.

## The canvas

The canvas component handles:

- **Wheel zoom** - Ctrl/Cmd+scroll, mouse-centered (zoom toward cursor)
- **Pan** - Scroll without modifier, or click+drag on background
- **Zoom range** - 0.1x to 5x, clamped
- **Viewport clipping** - only renders visible items for performance
- **CSS transforms** - single transform layer: `translate(pan) scale(zoom)`, `transformOrigin: 0 0`
- **Keyboard shortcuts** - Cmd+Plus/Minus for zoom, Cmd+0 to fit all

The agent places the component being designed on the canvas, along with its variations and states, each in its own frame, arranged spatially (side by side, like artboards). Each frame contains a live, rendered React component. The canvas is the layout; the frames are the designs.

## CLAUDE.md contract

The CLAUDE.md teaches the agent:

- The canvas API: how to add a frame, update it, remove it, reposition it
- Spatial conventions: new variations and states go to the right of existing ones, spaced consistently
- Frame structure: each frame on the canvas renders a React component at a position `{ x, y, width, height }`
- Annotation flow: when Agentation output is piped in, map selectors to frames and apply feedback

## Skills

### `/install`

First-time setup after cloning:

1. Runs `npm install`
2. Verifies/creates `.claude/settings.json` with the Agentation MCP server config
3. Confirms everything is ready

### `/init <project-name>`

Creates a new design project:

1. Creates `src/projects/<project-name>/` with a placeholder component
2. Wires the placeholder into `src/App.tsx` as a frame
3. Launches `npm run dev -- --open`
4. Ready to design

## Not in v1

- **Design system awareness** - a skill layer that maps freeform HTML to design system components. Requires the agent to know the component library. Will iterate on this after the canvas and workflow are solid.
- **Multi-user collaboration** - single designer + agent for now.
- **Persistent annotation layers** - annotations live in Agentation, not in the project.

## Stack

- React + Vite
- Custom canvas component (no dependencies)
- Agentation MCP
- Claude Code skills

## Reference

- Pan/zoom implementation adapted from [WPUI Lab ProjectCanvas](https://github.com/madebynoam/WPUI-Lab)
- Annotation layer powered by [Agentation](https://agentation.dev)
