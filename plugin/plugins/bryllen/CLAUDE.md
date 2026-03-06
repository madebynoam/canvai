# Bryllen — Agent Instructions

Bryllen is a canvas for Claude Code design. An infinite, zoomable surface where every generation lives as a frame — visible side by side, comparable across iterations. The comparison surface is the product.

## The designer is NOT a developer (CRITICAL)

**Assume the designer has ZERO technical knowledge:**
- They do NOT use terminal/command line
- They do NOT know npm, npx, git, or any CLI tools
- They do NOT understand localStorage, DevTools, or browser internals
- They do NOT read code — they see visual output only
- They do NOT know file paths, TypeScript, or React internals

**The agent handles ALL technical work:**
- Running commands silently in the background
- Managing files, code, and git
- Debugging errors without bothering the designer
- Never asking the designer to "run this command" or "check this file"

**Designer interactions are 100% visual:**
- They type descriptions in natural language
- They click on canvas elements to annotate
- They paste images for inspiration (Cmd+V)
- They click buttons in the UI (Apply, Save, New Iteration)

**If something breaks:**
- Fix it yourself. Don't ask the designer to run terminal commands.
- If you truly can't fix it, explain the problem in plain English with a solution they can click, not type.

## Core tenets

1. **Many at once, not one at a time.** Generate 3+ distinct design directions simultaneously. Without multiple directions visible side by side, Bryllen has no advantage over bare Claude Code.
2. **The code is the design.** Live React code, not mockups. What the designer sees runs.
3. **Point, don't describe.** Annotations carry selector, computed styles, and intent. No ambiguity survives the click.
4. **Proliferate before converging.** When a designer describes anything for the first time, generate multiple distinct directions — different bets, not states of the same idea.

## User workflow

1. `/bryllen-new <name>` — create project, start dev server
2. Describe — agent generates multiple directions on the canvas
3. Annotate — designer clicks elements, types changes, clicks Apply
4. Iterate — designer clicks "New Iteration" for snapshot copies
5. `/bryllen-share` — build and deploy to GitHub Pages

## Project structure

```
src/projects/<name>/
  v1/
    tokens.css          ← OKLCH custom properties (.iter-v1 scope)
    components/
      index.ts          ← barrel export
    pages/
    context/            ← inspiration images (pasted via Cmd+V)
  v2/                   ← literal copy of v1, then modified
  manifest.ts
  CHANGELOG.md
```

## Component hierarchy (MANDATORY — read this)

```
Tokens (v<N>/tokens.css)     → CSS custom properties, all visual values
  ↓
Components (v<N>/components/) → use ONLY var(--token), can compose each other
  ↓
Pages (v<N>/pages/)           → import ONLY from ../components/
```

**NEVER inline styled HTML in pages.** Every visual element must be a component.

### Creating a frame with UI elements — REQUIRED STEPS:

1. **Identify ALL components needed** — Card, Button, Sidebar, StatWidget, etc.
2. **For EACH component:**
   - Check if it exists in `v<N>/components/index.ts`
   - If NOT, create it in `v<N>/components/<Name>.tsx`
   - Add export to `v<N>/components/index.ts`
   - Add to Components showcase page
3. **THEN create the page** — import components from `../components/`
4. **Add page to manifest** — reference the page component

### Example — Dashboard with cards:

```
WRONG (inlining styles in page):
// pages/Dashboard.tsx
export function Dashboard() {
  return <div style={{ padding: 24 }}><div style={{ background: '#fff' }}>...</div></div>
}

CORRECT (components first):
// 1. Create components/StatCard.tsx
// 2. Create components/Sidebar.tsx
// 3. Export from components/index.ts
// 4. THEN create pages/Dashboard.tsx importing from ../components/
```

**If you skip this and inline HTML, the designer cannot iterate on individual pieces.**

## Token system

Each iteration owns a complete token set scoped under `.iter-v<N>`. No cascade across iterations. First iteration includes `:root` fallbacks. **All colors in OKLCH — no hex.**

## Iterations

- Named **V1, V2, V3** — sequential, never descriptive. Include `description` field.
- Creating: freeze current (`frozen: true`), `cp -r v<N>/ v<N+1>/`, rename scope, add to manifest with `frozen: false`.
- Frozen iterations are immutable. No exceptions.
- No cross-iteration imports. Each `v<N>/` is self-contained.
- **After creating a new iteration**, resolve with `--navigate` to auto-switch the UI:
  ```bash
  npx bryllen resolve <id> --navigate V8
  ```

## Before any edit (guard protocol)

1. **Read `manifest.ts`** — frozen? Stop.
2. **List ALL UI elements** you're about to create (cards, buttons, sidebars, widgets, etc.)
3. **For EACH element:**
   - Read `components/index.ts` — is it exported?
   - If NO → create in `components/`, add to barrel, add to Components page
   - If YES → you can use it
4. **ONLY THEN create/edit pages** — pages import from `../components/` only
5. **Components use ONLY `var(--token)`** — no hardcoded colors/spacing
6. **Log to `CHANGELOG.md`**
7. **Auto-commit** — `npx bryllen resolve <id>` auto-stages and commits

**Shortcut that WILL break things:** Creating a page with inline styled divs. Don't do it.

## Design directions

All directions on a single "All Directions" manifest page. Use `DirectionLabel` as first frame per row in N+1 column grid (1 label + N states). Each direction makes a genuinely different design bet.

Once chosen, generate all meaningful **variations × states** as frames. Columns = states, Rows = variations. Frame IDs: `<component>-<variation>-<state>`.

## Frame layout (HORIZONTAL grid) — MANDATORY

Frames are auto-positioned using a **grid layout**. The `grid.columns` setting controls how many frames fit horizontally before wrapping. **Set columns >= number of frames for horizontal layout.**

### Standard widths
- Desktop: `1440px`
- Tablet: `768px`
- Mobile: `390px`
- Gap: `40px`

### Grid config (controls layout)
```ts
{
  name: 'All Directions',
  grid: {
    columns: 5,        // ← Frames per row (set this >= frame count for horizontal)
    columnWidth: 1440, // ← Frame width
    rowHeight: 900,    // ← Frame height (auto-expands to content)
    gap: 40,           // ← Spacing between frames
  },
  frames: [...]
}
```

### CRITICAL: Add ALL frames in ONE manifest edit

**WHY frames end up diagonal:** If you add frames one at a time (write Frame A → HMR → write Frame B → HMR), each new frame is positioned relative to the previous frame's adjusted position. Height changes between edits cause Y drift → diagonal cascade.

**CORRECT:** Write ALL frame components first, THEN add them all to the manifest in a SINGLE edit:
1. Create `DirA.tsx`, `DirB.tsx`, `DirC.tsx`
2. ONE manifest edit that adds all three frames at once
3. Canvas receives complete frame list, `layoutFrames()` positions them as a horizontal grid

**WRONG:** Add DirA to manifest → wait → add DirB to manifest → wait → add DirC to manifest

### Manifest example (CORRECT — 3 frames, 3+ columns = horizontal)
```ts
{
  name: 'All Directions',
  grid: { columns: 3, columnWidth: 1440, rowHeight: 900, gap: 40 },
  frames: [
    { id: 'dir-a', title: 'Direction A', component: DirA, width: 1440, height: 900 },
    { id: 'dir-b', title: 'Direction B', component: DirB, width: 1440, height: 900 },
    { id: 'dir-c', title: 'Direction C', component: DirC, width: 1440, height: 900 },
  ],
}
```

### WRONG (default columns: 4, but frames too wide = vertical wrap)
```ts
// DO NOT DO THIS — missing grid config means default columnWidth: 320
{
  name: 'All Directions',
  frames: [
    { id: 'dir-a', component: DirA, width: 1440 },  // Too wide for default grid
    { id: 'dir-b', component: DirB, width: 1440 },  // Wraps to next row
  ],
}
```

**CRITICAL:** Frames do NOT have x,y coordinates. Position is computed from `grid.columns`. Always set `grid.columns >= frame count` for horizontal layout.

## Mandatory pages

- **Tokens** — color swatches (using `TokenSwatch` from `bryllen/runtime`), typography, spacing
- **Components** — all building blocks with variations and states

### TokenSwatch

```tsx
import { TokenSwatch } from 'bryllen/runtime'
<TokenSwatch color="var(--chrome)" label="chrome" sublabel="oklch(0.952 0.003 80)"
  oklch={{ l: 0.952, c: 0.003, h: 80 }} tokenPath="--chrome" />
```

## Interactive navigation

Components with internal navigation (tabs, sidebar) use React state inside one component. Don't split into separate frames — navigation must work.

## Design language (Bryllen runtime only)

The rules below apply to **Bryllen's own shell UI** (canvas, toolbar, sidebar), NOT to designs generated for designers. For generated designs, invoke `/design-taste`.

Braun / Jony Ive aesthetic. For full palette tables, typography scale, spacing, border radius, spring presets, and feature inventory, see `DESIGN-REFERENCE.md`.

**Key rules:**
- All colors OKLCH. No hex values.
- 4px spacing grid (font sizes exempt).
- One accent hue. Shell is achromatic (c <= 0.003).
- `cursor: default` for shell UI.
- `text-wrap: pretty` on all text.
- Components must be interactive — inputs typeable, menus openable.
- Icons: Lucide React, `strokeWidth={1.5}`. Sizes: 16/14/12px.
- Motion: spring physics, not CSS durations. Never `ease-in-out`.

### Feature inventory rule

If a designer asks for a feature not in the inventory (see `DESIGN-REFERENCE.md`), say: "That feature doesn't exist in Bryllen yet. Would you like to design it as a new component instead?"

## Context images (inspiration)

Designers can paste images (Cmd+V) onto the canvas as visual inspiration. These appear as draggable frames on the Context page and are stored in `v<N>/context/`.

### Using context images in generation

Before generating designs, run:

```bash
npx bryllen context --project my-project --iteration v1
```

This returns image paths. Read them with the Read tool to analyze via Vision. Look for:
- Color palettes and usage patterns
- Typography styles and hierarchy
- Layout patterns and spacing
- UI component styles (buttons, cards, inputs)
- Overall aesthetic and mood

Reference specific images when generating: "Using the warm tones from context image #1 and the card layout from image #2."

### Annotation on context images

Designers can annotate context images like any other frame. Clicking a context image in targeting mode allows adding comments like "make more like this" or "use these colors."

**CRITICAL: Identify the SPECIFIC image from the annotation.** The annotation includes:
- `componentName: "Context Image"`
- `props.src`: URL like `http://localhost:4748/context-image?project=X&iteration=v1&filename=inspiration-123.png`

**Extract the filename from `props.src`** (the `filename` query parameter). Then read THAT specific image file:

```bash
# Get list of context images
npx bryllen context --project my-project --iteration v1
# Returns: { "images": [{ "filename": "inspiration-123.png", "path": "/path/to/file" }, ...] }

# Find the matching image by filename and read THAT file with the Read tool
```

**Do NOT read all images and pick one arbitrarily.** The designer annotated a SPECIFIC image — use that one.

## Annotation flow

```
draft → pending → resolved
(Save)   (Apply)   (agent done)
```

Drafts created on Save, visible in TopBar dropdown. "Apply" promotes to pending — only then does the agent receive them. Immediate annotations (`type: 'iteration'`, `type: 'project'`) skip draft stage.

### Annotation mode (`mode` field)

Every annotation has a `mode` field: `'refine'`, `'ideate'`, or `'pick'`.

**ALL MODES require the guard protocol.** Before generating or editing ANY frame:
1. Read manifest (check frozen)
2. List ALL UI elements needed
3. Check components/index.ts — create missing components FIRST
4. ONLY THEN proceed with the mode-specific workflow

**Refine mode** (default):
- **Run guard protocol first** (check frozen, list elements, verify components exist)
- Edit the specific element the designer targeted
- Route visual changes through tokens (don't hardcode)
- Result: updated component/token

**Ideate mode** (generates new frames):
- **Run guard protocol**: identify ALL UI elements needed for variations
- **Create missing components** in v<N>/components/, add to barrel
- THEN invoke `/design-taste` — this skill has mandatory layout rules
- Generate the number of variations specified in the annotation (check the comment for `[IDEATE MODE: ... exactly N ...]`)
- "Genuinely different" means different in **layout, hierarchy, interaction, or approach** — NOT just color or font variations
- **LAY OUT FRAMES HORIZONTALLY** (increasing X, same Y) — see "Frame layout" section above
- Each frame should be a distinct design bet, not a tweak of the same idea
- The designer chose ideate because they WANT options to compare side-by-side

**Pick mode** (CRITICAL — designer chose this direction):
- The designer selected frame(s) as THE direction(s) to move forward with
- **Single pick:** `frameId` contains one frame ID, store `pickedFrameId` in manifest
- **Multi-pick:** `frameIds` contains multiple frame IDs (from marquee selection), store `pickedFrameIds` array in manifest

**MANDATORY: Read the picked frame's code:**
1. `frameId` maps to a component — find it in the manifest's frames array
2. Read the component file (in `v<N>/components/` or `v<N>/pages/`)
3. The code IS the design — understand every element it renders

- When creating the NEXT iteration after a pick:
  1. **READ THE COMPONENT CODE** for the picked frame(s)
  2. **Identify ALL elements** in the code: every div, card, button, text, icon
  3. **Extract exact tokens** — copy the colors, spacing, typography values from the code
  4. **Build components for EVERY element** — not just one piece. If there's a sidebar, header, cards, stats — build them ALL
  5. **Match 1:1** — the new iteration must render identically to the picked frame
- The pick is a commitment: all future work builds on this exact design

**Multi-pick strategy (when `frameIds` has 2+ entries):**
- The designer wants to combine strengths from multiple directions
- Extract what works best from each direction (layout from A, color palette from B, interaction from C)
- Resolve conflicts by choosing the stronger solution or creating a synthesis
- The result should feel cohesive, not like a Frankenstein of disconnected parts
- When in doubt, the comment field may clarify which elements to prioritize

**Why this matters:**
During ideation, multiple directions may have different component implementations. When the designer picks one (or multiple), they're choosing THAT specific visual result. Copying old components and adjusting defeats the purpose — the new iteration must faithfully reproduce the picked design.

**First generation always implies ideate behavior:**
- When a designer describes a component for the first time (no existing frames)
- When `type: 'project'` is received (new project)
- When `type: 'iteration'` includes design prompts

**For ALL of the above:**
1. **Run guard protocol** — list ALL UI elements, create missing components
2. Invoke `/design-taste`
3. Generate frames HORIZONTALLY using the component library

**Examples of "genuinely different":**
- Dashboard: card-based vs. table-based vs. sidebar+main layout
- Button group: horizontal pills vs. segmented control vs. icon toggle
- Navigation: top bar vs. sidebar vs. bottom sheet

**Not "genuinely different":**
- Same layout with different accent colors
- Same component with minor spacing tweaks
- Same hierarchy with different font weights

### Processing annotations

1. Read `frameId`, `componentName`, `selector`, `comment`, `computedStyles`
2. Follow guard protocol
3. Map to file in `v<N>/components/` or `v<N>/pages/`
4. **Route visual changes through tokens** — find/create semantic token in `tokens.css`, never hardcode values
5. Run `npx bryllen resolve <id>` (auto-commits)
6. Log to `CHANGELOG.md`

### Processing project annotations (`type: 'project'`)

1. Parse JSON comment `{ name, description, prompt }`
2. Create project folder structure (v1/, manifest.ts, CHANGELOG.md)
3. **Run guard protocol**: identify ALL UI elements from the prompt
4. Create tokens.css, ALL required components, mandatory pages (Tokens, Components)
5. Invoke `/design-taste`, generate initial frames
6. Resolve with `--navigate V1`

## CLI Commands (for agent use)

All annotation commands output JSON for easy parsing:

```bash
# Wait for next annotation (15s default timeout)
npx bryllen watch [--timeout N]

# Mark annotation as resolved (auto-commits)
npx bryllen resolve <id>

# Mark resolved AND navigate UI to a specific iteration
npx bryllen resolve <id> --navigate V8

# Update progress shown on canvas (designer sees this)
npx bryllen progress <id> "Reading file..."

# List pending annotations
npx bryllen pending

# List all annotations
npx bryllen list

# Screenshot canvas
npx bryllen screenshot [--frame <id>] [--delay <ms>]

# Get context image paths
npx bryllen context --project <name> --iteration <v>
```

**Progress updates:** Call `progress` at key points so the designer sees what's happening:
- `"Reading file..."` — after identifying the target file
- `"Applying changes..."` — before editing
- `"Taking screenshot..."` — before visual review

## Skills

- `/bryllen-new <name>` — Create project and start designing
- `/bryllen-design` — Start dev server and watch mode
- `/bryllen-share` — Build and deploy to GitHub Pages
- `/bryllen-close` — Stop dev servers
- `/bryllen-update` — Update bryllen
- `/design-taste` — **Invoke before generating any frames** — ensures distinctive, tasteful output
