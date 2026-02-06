# Canvai

A lightweight design canvas for AI-assisted product design. Code is the surface.

Canvai gives designers a Figma-like infinite canvas where every iteration is code from the start. Attach it to a Claude Code skill, and the full design loop (concept, iteration, review, production) happens without switching tools or translating formats.

## How it works

A designer runs a skill:

```
/init design project team-permissions
```

This clones the canvai boilerplate, sets up the Agentation MCP server, and launches the dev server in the browser. From there:

1. **Brainstorm** - Describe or attach a sketch. The agent generates the component with its variations and states and places them on the spatial canvas.
2. **Iterate** - Annotate elements with Agentation. The agent reads the structured feedback (CSS selectors, component names, computed styles) and updates directly.
3. **Review** - Commit and deploy to GitHub Pages. Team reviews a live, interactive page.
4. **Ship** - PR to the production codebase. The code was the material the whole time.

## What's in the box

- **React app** (Vite) - minimal, no extra framework
- **Spatial canvas component** - pan, zoom, drag. Figma-like interactions, zero dependencies. Based on the [WPUI Lab](https://github.com/madebynoam/WPUI-Lab) canvas.
- **Agentation integration** - pre-installed via [agentation.dev/install](https://agentation.dev/install). MCP server configured on init so the agent can read annotations without copy-paste.
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

The CLAUDE.md in each canvai project teaches the agent:

- The canvas API: how to add a frame, update it, remove it, reposition it
- Spatial conventions: new variations and states go to the right of existing ones, spaced consistently
- Frame structure: each frame on the canvas renders a React component at a position `{ x, y, width, height }`
- Annotation flow: when Agentation output is piped in, map selectors to frames and apply feedback

## Skill: `/init design project`

The Claude Code skill that bootstraps a canvai project:

1. Clones this repo into a new directory named after the project
2. Removes the `.git` folder and reinitializes
3. Updates `package.json` name field
4. Configures Agentation MCP server in `.claude/settings.json`
5. Runs `npm install`
6. Launches `npm run dev` and opens the browser
7. Ready to design

On subsequent sessions, `/start` reconnects: starts the dev server, verifies MCP, opens the browser.

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
