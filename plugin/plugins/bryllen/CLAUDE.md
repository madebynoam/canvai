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

## Component hierarchy (mandatory)

```
Tokens (v<N>/tokens.css)     → CSS custom properties, all visual values
  ↓
Components (v<N>/components/) → use ONLY var(--token), can compose each other
  ↓
Pages (v<N>/pages/)           → import ONLY from ../components/
```

If a page needs a button, import `Button` from `../components/`. If it doesn't exist, create it in `components/` first. Never inline styled HTML in a page.

## Token system

Each iteration owns a complete token set scoped under `.iter-v<N>`. No cascade across iterations. First iteration includes `:root` fallbacks. **All colors in OKLCH — no hex.**

## Iterations

- Named **V1, V2, V3** — sequential, never descriptive. Include `description` field.
- Creating: freeze current (`frozen: true`), `cp -r v<N>/ v<N+1>/`, rename scope, add to manifest with `frozen: false`.
- Frozen iterations are immutable. No exceptions.
- No cross-iteration imports. Each `v<N>/` is self-contained.

## Before any edit (guard protocol)

1. **Read `manifest.ts`** — frozen? Stop.
2. **Hierarchy check** — pages import only from `../components/`. Components use only `var(--token)`.
3. **Check `components/index.ts`** — component exists? If not, create first.
4. **New components** — add to barrel AND to Components showcase page.
5. **Log to `CHANGELOG.md`**.
6. **Auto-commit** — `npx bryllen resolve <id>` auto-stages and commits. No manual git needed.

## Design directions

All directions on a single "All Directions" manifest page. Use `DirectionLabel` as first frame per row in N+1 column grid (1 label + N states). Each direction makes a genuinely different design bet.

Once chosen, generate all meaningful **variations × states** as frames. Columns = states, Rows = variations. Frame IDs: `<component>-<variation>-<state>`.

## Frame layout (HORIZONTAL, not vertical) — MANDATORY

**ALWAYS lay out frames HORIZONTALLY (increasing X, same Y).** Side-by-side comparison is Bryllen's core value. Vertical stacking defeats the entire purpose.

### Standard widths
- Desktop: `1440px`
- Tablet: `768px`
- Mobile: `390px`
- Gap: `40px`

### Calculate X positions (Y stays constant)
```
Frame 1: x = 0,    y = 0
Frame 2: x = 1480, y = 0  (previous x + width + gap)
Frame 3: x = 2960, y = 0
Frame 4: x = 4440, y = 0
Frame 5: x = 5920, y = 0
```

### Manifest example (CORRECT)
```ts
frames: [
  { id: 'dir-a', component: DirA, x: 0,    y: 0, width: 1440, height: 900 },
  { id: 'dir-b', component: DirB, x: 1480, y: 0, width: 1440, height: 900 },
  { id: 'dir-c', component: DirC, x: 2960, y: 0, width: 1440, height: 900 },
]
```

### WRONG (vertical stacking)
```ts
// DO NOT DO THIS:
frames: [
  { id: 'dir-a', x: 0, y: 0,   ... },
  { id: 'dir-b', x: 0, y: 940, ... },  // WRONG: same X, different Y
  { id: 'dir-c', x: 0, y: 1880, ... }, // WRONG: vertical stack
]
```

**If you generate frames with the same X and increasing Y, you have failed.**

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

**Refine mode** (default):
- Edit the specific element the designer targeted
- Make the requested change to existing code
- Result: updated component/token

**Ideate mode** (generates new frames):
- **FIRST: Invoke `/design-taste`** — this skill has mandatory layout rules
- Generate the number of variations specified in the annotation (check the comment for `[IDEATE MODE: ... exactly N ...]`)
- "Genuinely different" means different in **layout, hierarchy, interaction, or approach** — NOT just color or font variations
- **LAY OUT FRAMES HORIZONTALLY** (increasing X, same Y) — see "Frame layout" section above
- Each frame should be a distinct design bet, not a tweak of the same idea
- The designer chose ideate because they WANT options to compare side-by-side

**Pick mode** (CRITICAL — designer chose this direction):
- The designer selected frame(s) as THE direction(s) to move forward with
- **Single pick:** `frameId` contains one frame ID, store `pickedFrameId` in manifest
- **Multi-pick:** `frameIds` contains multiple frame IDs (from marquee selection), store `pickedFrameIds` array in manifest
- When creating the NEXT iteration after a pick:
  1. **Single pick:** Rebuild components from scratch based on the picked frame's actual rendered output
  2. **Multi-pick:** Combine ALL picked directions — extract shared patterns, merge complementary elements, resolve conflicts thoughtfully
  3. **Extract exact tokens** — colors, spacing, typography from the picked design(s), not the old tokens.css
  4. **Match 1:1** — the new iteration's components must visually match the picked frame(s) exactly
  5. Do NOT copy old components and tweak them — recreate based on what the picked frame(s) actually look like
- The pick is a commitment: all future work builds on this exact design, not approximations

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

**For ALL of the above: invoke `/design-taste` first, then generate frames HORIZONTALLY.**

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

Parse JSON comment `{ name, description, prompt }`, create project folder, generate initial design if prompted, resolve.

## CLI Commands (for agent use)

All annotation commands output JSON for easy parsing:

```bash
# Wait for next annotation (15s default timeout)
npx bryllen watch [--timeout N]

# Mark annotation as resolved (auto-commits)
npx bryllen resolve <id>

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
