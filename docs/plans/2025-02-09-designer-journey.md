# The Designer's Journey

## 1. Setup (once, 5 minutes)

The designer installs the Canvai plugin in Claude Code:
```
claude plugin add canvai
```

That's it. No repo to clone, no npm install, no config files. The plugin gives Claude Code the skills, the Agentation MCP, and the knowledge of how to build component matrices.

## 2. Start a new design project

The designer opens Claude Code in any folder (or a shared team repo) and types:

```
/canvai-init button
```

The agent:
- Creates `src/projects/button/` if it doesn't exist
- Starts the dev server + Agentation MCP with one command (`npx canvai dev`)
- Opens the browser to the canvas
- Says: "Ready. Describe the component."

## 3. Describe

The designer types in Claude Code:

> "Build me a primary button with small, medium, and large sizes. It should have hover and disabled states."

The agent:
- Creates `src/projects/button/Button.tsx` with the component
- Creates `src/projects/button/manifest.ts` with page V1 containing the full matrix:

```
         Default    Hover      Disabled
Small    [button]   [button]   [button]
Medium   [button]   [button]   [button]
Large    [button]   [button]   [button]
```

- The canvas renders all 9 frames live. The designer sees every combination at once.

## 4. Annotate

The designer looks at the canvas in the browser. The medium hover button doesn't look right — the shadow is too heavy.

They click the Agentation toolbar, click on the medium hover button, and type: "Shadow is too heavy, make it subtle"

The annotation hits the MCP. Claude Code picks it up automatically (it's watching). The agent:
- Reads the annotation: element is `<Button>`, variant medium, state hover
- Edits `Button.tsx` — reduces the box-shadow
- Vite hot-reloads — the designer sees the change instantly on canvas

## 5. Iterate

After a few rounds of annotation, the designer wants to try a different direction. They type in Claude Code:

> "Let's try a version with fully rounded corners and no shadow at all"

The agent:
- Adds page V2 to the manifest
- Creates the variant
- The canvas now has tabs: `[V1 — Original] [V2 — Rounded]`
- The designer can click between tabs to compare

## 6. More annotation on V2

The designer switches to V2, annotates: "The border radius is too much on small, dial it back." The agent adjusts. Back and forth until V2 feels right.

## 7. Ship

The designer is happy with V2. They type:

> "Ship this to our production repo"

The agent:
- Copies `Button.tsx` (the final component) to the target repo
- Opens a PR with the component, props interface, and a screenshot from the canvas

---

## What the designer never thinks about:

- App.tsx wiring
- Frame coordinates or layout math
- Import statements
- MCP configuration
- Git tags or version management
- npm install or dependency management

## What lives in git:

- `src/projects/button/Button.tsx` — the component
- `src/projects/button/manifest.ts` — the pages and frame declarations
- Every annotation cycle is a commit the agent makes
