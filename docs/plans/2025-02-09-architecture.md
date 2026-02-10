# Canvai Architecture — How It Actually Works

## Two Pieces

### Piece 1: The `canvai` npm package (the runtime)

This is what runs in the browser. Published to npm. Contains:
- `Canvas.tsx`, `Frame.tsx`, `useFrames.ts` — the canvas runtime
- A Vite plugin that auto-discovers `src/projects/*/manifest.ts`
- A `bin` entry: `canvai dev` (starts Vite + Agentation MCP together)

The designer's repo has this as a dependency in `package.json`. It's like how Next.js is an npm package — you `npm install next` and then `next dev` runs the app.

### Piece 2: The `canvai` Claude Code plugin (the brain)

This is what makes Claude Code know how to use the runtime. Contains:
- Skills: `/canvai-init`, `/canvai-iterate`, `/canvai-ship`
- MCP: Agentation server config
- CLAUDE.md knowledge: how to write manifests, lay out matrices, handle annotations

## How They Connect at Each Step

**`/canvai-init button`** — the designer types this in Claude Code.

1. The **plugin** delivers the skill. The agent reads it.
2. The skill says: "Check if `package.json` exists. If not, run `npm init -y && npm install canvai`."
3. The **agent** (not the plugin, not the package) runs that command via Bash.
4. The skill says: "Create `src/projects/button/` with a starter component and manifest."
5. The **agent** creates the files using Write tool.
6. The skill says: "Run `npx canvai dev` to start the dev server."
7. The **agent** runs that via Bash. The `canvai` npm package's CLI starts Vite + Agentation.
8. Browser opens. Canvas renders. Ready.

So the flow is:

```
Designer types → Plugin delivers skill → Agent follows skill →
Agent uses npm package's CLI → Runtime serves the canvas
```

The plugin is instructions. The npm package is the engine. The agent is the glue that connects them.

## The Key Insight

The agent does the scaffolding, not the plugin or the package. That's what makes it work. The plugin doesn't need to "pull" anything or "do the npx" — it just tells the agent *what to do*, and the agent has Bash, Write, Edit tools to actually do it.

This is different from, say, `create-react-app` where the CLI does everything. Here, the **AI agent** is the CLI. The plugin is its playbook.

## What a Claude Code Plugin Can Do

- Deliver skills (markdown files the agent reads and follows)
- Deliver MCP servers (like Agentation)
- Inject context into the agent

## What a Claude Code Plugin Cannot Do

- Run a Vite dev server
- Scaffold files on disk
- Install npm packages
- Serve a React app in the browser

## Updating

- **Shell update:** `npm update canvai` in the designer's repo. New canvas features, bug fixes, Vite plugin improvements. Agent can even do this when the skill tells it to check for updates.
- **Brain update:** Claude Code plugin auto-updates (like your other plugins). New skills, better matrix generation logic, improved annotation handling.
- **Designer's work:** never touched by either update. It's just `.tsx` files in `src/projects/`.

## Pages / Versioning Model

Pages use the manifest-based approach. Each project's `manifest.ts` has a `pages` array:

```ts
export default {
  project: 'button',
  pages: [
    {
      name: 'V1 — Exploration',
      frames: [
        { id: 'btn-primary-default', title: 'Button / Primary / Default', component: Button, props: { variant: 'primary' } },
        // ... full matrix
      ]
    },
    {
      name: 'V2 — Rounded',
      frames: [
        { id: 'btn-v2-primary-default', title: 'Button / Primary / Default', component: ButtonV2, props: { variant: 'primary' } },
        // ... full matrix
      ]
    }
  ]
}
```

The canvas shows tabs for pages. `/canvai-iterate` adds a new page. Git tracks everything naturally — no separate versioning system needed.

## What Lives in the Designer's Repo

```
package.json              ← { "dependencies": { "canvai": "^1.0" } }
src/projects/
  button/
    Button.tsx            ← the component
    manifest.ts           ← pages × frames
  checkout-flow/
    CheckoutCard.tsx
    manifest.ts
```

No App.tsx. No canvas code. No MCP config. Just components and manifests.
