# V4 Shell Redesign

## Context

The canvai-ui project has iterated the shell design through 4 versions. The current canvai runtime still uses the V1 design. This plan adapts the V4 direction into the actual runtime — new top bar with project picker, iteration sidebar with numbered circles, circular annotate icon button at bottom-right, mode-aware comment card, and pending annotation count.

## Changes Overview

| Area | Current | V4 |
|---|---|---|
| Annotate button | Orange pill, bottom-center | Circular icon, bottom-right |
| Comment card | Near element, no mode | Bottom-right, shows Manual/Watch badge |
| Sidebar | "Projects" text list | "Iterations" with numbered circles |
| Top bar | Project name + PageTabs | Project picker + iteration count + mode indicator |
| Layout | Sidebar left of everything | Top bar full-width, sidebar under it |

## Design Tokens

| Token | Value | Usage |
|---|---|---|
| Accent | `#E8590C` | Buttons, highlights, active circles |
| Accent hover | `#CF4F0B` | Button hover state |
| Accent pressed | `#D4520A` | Button pressed state |
| Canvas | `#F0F0F0` | Canvas background |
| Surface | `#FFFFFF` | Cards, top bar, popovers |
| Surface alt | `#F9FAFB` | Input backgrounds |
| Sidebar bg | `#FAFAFA` | Sidebar background |
| Border | `#E5E7EB` | Borders, dividers, inactive circles |
| Text primary | `#1F2937` | Body text |
| Text secondary | `#6B7280` | Labels |
| Text tertiary | `#9CA3AF` | Hints, metadata |
| Watch green | `#10B981` | Watch mode dot |
| Watch green dark | `#059669` | Watch mode text |
| Watch green bg | `#ECFDF5` | Watch mode pill background |
| Font | `-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif` | System font |

## Batch 1: New TopBar and ProjectPicker (3 new files)

### `src/runtime/ProjectPicker.tsx` (NEW)
- Props: `projects: { project: string }[], activeIndex: number, onSelect: (i) => void`
- Orange square (18x18, border-radius 4) with first letter + project name + chevron
- Dropdown: 220px, white bg, shadow, lists projects with checkmark on active
- Click-outside to close
- Reference: `canvai-ui/ProjectPicker.tsx`, `canvai-ui/ShellLayoutV4.tsx` lines 39-75

### `src/runtime/TopBar.tsx` (NEW)
- Props: `projects, activeProjectIndex, onSelectProject, iterationCount, pendingCount, mode`
- Left: ProjectPicker | divider (1px × 16px) | "N iterations" (fontSize 11, #9CA3AF)
- Right: pending count badge (16px orange circle + number + "pending" text in #E8590C) | divider | mode pill
- Mode pill: Manual = gray (#F3F4F6 bg, #6B7280 text, #9CA3AF dot), Watch = green (#ECFDF5 bg, #059669 text, #10B981 dot with glow)
- Full-width, 40px min-height, white bg, `borderBottom: '1px solid #E5E7EB'`
- Reference: `canvai-ui/ShellLayoutV4.tsx` lines 28-136, `canvai-ui/ModeIndicator.tsx`

### `src/runtime/IterationSidebar.tsx` (NEW, replaces ProjectSidebar)
- Props: `iterations: { name: string }[], activeIndex: number, onSelect: (i) => void`
- Header: "Iterations" uppercase, fontSize 11, fontWeight 600, #9CA3AF, letterSpacing 0.05em
- Each item: numbered circle (20x20, border-radius 50%) + name
  - Active: circle bg #E8590C, white text, row bg #E5E7EB, fontWeight 500
  - Inactive: circle bg #E5E7EB, text #9CA3AF, transparent row bg
- Collapsible: 200px expanded, 40px collapsed, transition 0.15s ease
- Reference: `canvai-ui/IterationSidebar.tsx`

## Batch 2: AnnotationOverlay — Icon Button + Bottom-Right Card

### `src/runtime/AnnotationOverlay.tsx` (MODIFY)
- Add `mode?: 'manual' | 'watch'` prop (default `'manual'`)
- **Annotate button** (idle mode):
  - 40×40 circle at `position: fixed, bottom: 16, right: 16`
  - Pencil SVG: `<path d="M11.5 2.5l4 4-10 10H1.5v-4l10-10z" />` + `<path d="M9.5 4.5l4 4" />`
  - States via `buttonState`: idle (#E8590C, small shadow), hover (#CF4F0B, larger shadow), pressed (#D4520A, scale 0.95)
  - Reference: `canvai-ui/AnnotateIconButton.tsx`
- **Comment card** (commenting mode):
  - Position: `fixed, bottom: 16, right: 16` (was near element)
  - Header: component·tag on left, mode badge on right ("Manual" gray / "Live" green pill)
  - Button: "Apply" in manual, "Send" with checkmark SVG in watch
  - Keyboard hint: "Cmd+Enter to apply/send · Esc to cancel"
  - Reference: `canvai-ui/CommentCardV2.tsx`
- **Toast**: keep at bottom-center (no conflict)

## Batch 3: App.tsx — New Shell Composition + Exports + Template

### `src/App.tsx` (MODIFY)
New layout:
```
div#canvai-root (flex column)        ← was flex row
  TopBar (full width)                ← new, replaces inline top bar
  div (flex row, flex: 1)
    IterationSidebar (pages)         ← was ProjectSidebar (projects)
    div (flex: 1) → Canvas + Frames
  AnnotationOverlay (mode prop)
```

State additions: `mode: 'manual' | 'watch'` (default 'manual')
Import changes: remove PageTabs/ProjectSidebar, add TopBar/IterationSidebar

### `src/runtime/index.ts` (MODIFY)
- Remove: `PageTabs`, `ProjectSidebar`
- Add: `TopBar`, `IterationSidebar`, `ProjectPicker`

### `src/cli/templates.js` (MODIFY)
- Update `appTsx` template to match new App.tsx layout and imports

### `src/runtime/ProjectSidebar.tsx` (DELETE)
### `src/runtime/PageTabs.tsx` (DELETE)

## NOT in this round (follow-up)

- **Annotation markers** (numbered dots on canvas elements) — needs element tracking across zoom/pan
- **useAnnotations polling hook** and live pending count — add when markers land
- **Watch mode detection** from server — mode is a static prop for now

## Files touched

| File | Action |
|---|---|
| `src/runtime/ProjectPicker.tsx` | Create |
| `src/runtime/TopBar.tsx` | Create |
| `src/runtime/IterationSidebar.tsx` | Create |
| `src/runtime/AnnotationOverlay.tsx` | Modify (icon button, bottom-right card, mode prop) |
| `src/App.tsx` | Modify (new layout, new imports) |
| `src/runtime/index.ts` | Modify (swap exports) |
| `src/cli/templates.js` | Modify (update appTsx template) |
| `src/runtime/ProjectSidebar.tsx` | Delete |
| `src/runtime/PageTabs.tsx` | Delete |

## Verification

1. Run `npx canvai dev` in the canvai repo
2. Confirm: top bar shows project picker + iteration count + mode indicator
3. Confirm: sidebar shows iterations with numbered circles, switching works
4. Confirm: project picker dropdown opens/closes, switches projects
5. Confirm: annotate icon button at bottom-right, hover/pressed states
6. Confirm: comment card appears at bottom-right, shows mode badge
7. Confirm: canvas zoom/pan still works
8. Confirm: annotations still POST to HTTP server and agent receives them

## Version bump

Bump plugin to 0.0.10 after all changes land. Commit and push.
