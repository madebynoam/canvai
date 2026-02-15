# Primitives + Token Scoping Architecture

**Date:** 2026-02-15
**Status:** Draft
**Problem:** Projects grow ad-hoc with duplicated components, no shared building blocks, no iteration freezing, and 12k+ lines of context the agent must read for every change.

---

## Problem Statement

The canvai-ui project has 12,229 lines across 26 files for one component (the shell UI). ~70-80% is copy-paste duplication. Primitives like Avatar, Button, and HoverButton are redefined in 4-8 different files. When the designer says "bump button font size," nothing propagates — the agent must find and edit every copy. Past iterations get mutated because nothing enforces immutability. The agent reads the entire project (~50k tokens) for a 3-line change because there's no index or structure to narrow scope.

### Root causes

1. No shared component library — every variation redefines its own atoms
2. No token system consumed by components — colors/sizes are inline literals
3. No folder-level iteration isolation — frozen iterations share files with active ones
4. No lightweight index — the agent has no shortcut to "what exists where"

---

## Architecture

### Folder structure (per project)

```
src/projects/<project-name>/
  primitives/              <- shared building blocks
    tokens.css             <- CSS custom properties (OKLCH palette, spacing, type)
    Button.tsx             <- uses var(--btn-bg), var(--radius-sm), etc.
    Avatar.tsx
    Label.tsx
    HoverButton.tsx
    index.ts               <- auto-maintained: component name + one-liner + path
  iterations/
    v1/                    <- frozen
      tokens.css           <- overrides (pin visual expression for this iteration)
      toolbar-minimal.tsx
      toolbar-radial.tsx
      index.ts             <- one-liner per variation
    v2/                    <- frozen
      tokens.css
      toolbar-dock.tsx
      index.ts
    v3/                    <- active (only this gets edited)
      tokens.css
      sidebar-tabs.tsx
      index.ts
  manifest.ts              <- iterations: [{ name: 'V3', frozen: false }, { name: 'V2', frozen: true }, ...]
  CHANGELOG.md             <- micro change journal
```

### Design principles

1. **Primitives are LEGO bricks** — shared atoms that every variation imports. The AI can compose them into any layout. No structural constraints on variations.
2. **Tokens are CSS custom properties** — primitives reference `var(--token-name)`, iteration token files set the values. Scoped per-iteration via CSS class.
3. **Freezing = don't touch iteration folder** — agent checks manifest for `frozen: true` before editing. Frozen iteration files are never modified.
4. **Token scoping controls visual pinning** — if a frozen iteration's `tokens.css` overrides `--btn-bg`, that iteration keeps its color even when the base `primitives/tokens.css` changes. Tokens not overridden inherit from the base (floating).
5. **One file per variation** — no mega-files with 17 exports. Each variation is its own file in its iteration folder. Clean freezing, clean context.

---

## Token System

### Base tokens (primitives/tokens.css)

Defines all CSS custom properties. This is the "latest" visual expression:

```css
:root {
  /* OKLCH palette */
  --surface: oklch(0.995 0 0);
  --chrome: oklch(0.955 0 0);
  --canvas-bg: oklch(0.975 0 0);
  --border: oklch(0.900 0 0);
  --border-soft: oklch(0.920 0 0);
  --text-primary: oklch(0.200 0 0);
  --text-secondary: oklch(0.400 0 0);
  --text-tertiary: oklch(0.560 0 0);
  --accent: oklch(0.62 0.20 55);

  /* Spacing (4px grid) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-pill: 20px;

  /* Type */
  --text-xs: 11px;
  --text-sm: 13px;
  --text-md: 15px;
  --text-lg: 18px;
}
```

### Iteration token overrides (iterations/v1/tokens.css)

Only overrides what this iteration pins. Everything else inherits from base:

```css
.iter-v1 {
  --accent: oklch(0.62 0.20 55);   /* pin V1's orange accent */
  --radius-md: 10px;                /* V1 used 10px cards */
}
```

### Primitive components consume tokens

```tsx
// primitives/Button.tsx
export function Button({ children, variant = 'primary' }) {
  return (
    <button style={{
      background: variant === 'primary' ? 'var(--accent)' : 'transparent',
      color: variant === 'primary' ? 'white' : 'var(--text-primary)',
      borderRadius: 'var(--radius-sm)',
      padding: 'var(--space-2) var(--space-4)',
      fontSize: 'var(--text-sm)',
      border: variant === 'outline' ? '1px solid var(--border)' : 'none',
      cursor: 'default',
    }}>
      {children}
    </button>
  )
}
```

### CSS scoping in the runtime

The App.tsx wraps the canvas in the active iteration's scope class:

```tsx
<div className={`iter-${activeIteration.name.toLowerCase()}`}>
  <Canvas>
    {frames.map(frame => <Frame ... />)}
  </Canvas>
</div>
```

Each iteration's `tokens.css` is imported in the manifest, so it's always loaded. The scoped class (`.iter-v1`, `.iter-v2`) controls which overrides apply.

---

## Iteration Freezing

### Manifest changes

Add `frozen?: boolean` to `IterationManifest`:

```ts
export interface IterationManifest {
  name: string
  frozen?: boolean    // <-- new
  pages: PageManifest[]
}
```

### Agent behavior

The agent MUST check `frozen` before editing any file in an iteration folder:

1. Read `manifest.ts` — identify which iteration is active (`frozen !== true`)
2. Only create/edit files in the active iteration's folder
3. If a change request targets a frozen iteration, create a new iteration first

### Freeze semantics

| What | Frozen behavior | Active behavior |
|---|---|---|
| Iteration folder files | Never edited | Freely edited |
| Iteration tokens.css | Never edited | Freely edited |
| Primitives folder | Always editable (shared) | Always editable |
| Base tokens.css | Always editable | Always editable |

Token changes in `primitives/tokens.css` propagate to frozen iterations UNLESS the iteration's `tokens.css` overrides that specific token. This is CSS cascade — more specific wins.

---

## Context Efficiency

### Component index (primitives/index.ts)

Auto-maintained by the agent after creating/modifying primitives:

```ts
// Auto-generated — do not edit manually
// Button: Primary, outline, ghost, danger variants | Button.tsx
// Avatar: Circular avatar with letter fallback | Avatar.tsx
// Label: Section label with optional count | Label.tsx
// HoverButton: Icon button with hover background | HoverButton.tsx
```

### Variation index (iterations/v1/index.ts)

Auto-maintained by the agent after creating/modifying variations:

```ts
// Auto-generated — do not edit manually
// toolbar-minimal: Clean toolbar, icon-only actions | toolbar-minimal.tsx
// toolbar-radial: Circular radial menu, drag to select | toolbar-radial.tsx
```

### Change journal (CHANGELOG.md)

Micro entries appended after each edit. Agent reads last ~20 lines for session context:

```markdown
# Changelog

## V3 (active)
- Added sidebar-tabs variation with tabbed navigation
- Updated --accent to cerulean (oklch 0.55 0.18 250)
- Bumped Button font-size from 13px to 14px in primitives

## V2 (frozen)
- Refined toolbar-dock with collapsed mode
- Added sidebar-clean with minimal chrome
```

### Context budget per agent turn

| File | Lines | When |
|---|---|---|
| primitives/index.ts | ~20 | Always |
| Active iteration index.ts | ~15 | Always |
| CHANGELOG.md (last 20) | ~20 | Always |
| The variation being edited | ~100-200 | When editing |
| A primitive being modified | ~50-80 | When modifying |
| **Total** | **~300** | **vs 12,000 today** |

---

## Skill Changes

### /canvai-init

Update project scaffold to create:
- `primitives/` folder with base `tokens.css` and `index.ts`
- `iterations/v1/` folder with empty `tokens.css` and `index.ts`
- Manifest with `frozen: false` on V1

### /canvai-iterate

Update to:
1. Mark current active iteration as `frozen: true` in manifest
2. Create new iteration folder `iterations/v<N>/`
3. Copy specified variation files into new folder (or all if none specified)
4. Copy `tokens.css` from previous iteration as starting point
5. Create empty `index.ts` in new folder
6. Add new iteration to manifest with `frozen: false`

### Plugin CLAUDE.md

Add sections on:
- Primitives workflow (when to create, when to use local)
- Token system (base vs override, CSS custom properties)
- Freezing rules (check manifest before editing)
- Context reading protocol (index files + changelog first)

---

## Implementation Plan

### Phase 1: Data model + types
1. Add `frozen?: boolean` to `IterationManifest` in `src/runtime/types.ts`
2. Update export contract test if needed

### Phase 2: Archive + clean slate
3. Archive `src/projects/canvai-ui/` to `src/projects/_archive/canvai-ui/`
4. Delete `src/projects/pricing-cards/` and `src/projects/user-profile/`
5. Create new test project `src/projects/shell-system/` with the new structure

### Phase 3: Primitives scaffold for test project
6. Create `primitives/tokens.css` with OKLCH base tokens
7. Extract shared primitives from canvai-ui into `primitives/` (Button, Avatar, Label, HoverButton, Swatch, SectionLabel)
8. Create `primitives/index.ts`

### Phase 4: Iteration structure for test project
9. Create `iterations/v1/` with a few variations using the primitives
10. Create `iterations/v1/tokens.css` (empty — inherits base)
11. Create `iterations/v1/index.ts`
12. Write `manifest.ts` with the new structure

### Phase 5: CSS scoping in runtime
13. Import iteration token CSS files in the manifest
14. Add iteration CSS class wrapper in App.tsx template (or in Frame component)
15. Verify token scoping works — changing base tokens propagates, overrides pin

### Phase 6: Skill updates
16. Update `/canvai-init` skill to scaffold primitives + iterations structure
17. Update `/canvai-iterate` skill to handle folders + freezing
18. Update plugin `CLAUDE.md` with primitives workflow, token system, freezing rules, context protocol

### Phase 7: Test + verify
19. Run `npm test` — export contract holds
20. Test the new project renders correctly on the canvas
21. Test iteration freezing — agent respects frozen flag
22. Test token scoping — override pins, base propagates
23. Verify context budget — agent reads ~300 lines not 12k

---

## What we're NOT doing

- No component variant system (Figma-style property panels) — variations are free-form files
- No branching iterations — linear V1 → V2 → V3 only
- No automatic primitive extraction — agent uses judgment to promote local → primitive
- No version pinning on primitive structure — only tokens are pinnable via CSS override
- No side-by-side iteration comparison — view one iteration at a time (future feature)
