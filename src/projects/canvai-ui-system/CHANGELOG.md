# canvai-ui-system

## V9

- **ZoomControl shadow**: Reduced from `0 1px 3px rgba(0,0,0,0.16)` to `0 0.5px 1px rgba(0,0,0,0.06)` — subtler, less distracting (annotation #1)
- **FAB icon**: Changed icon color from `var(--txt-pri)` to `var(--text-on-accent)` — fixes invisible icon on dark FAB in light mode

## V7

- **CommentFlowV7 avatars**: All avatars now use `F.marker` (annotation blue) instead of per-user differentiation colors (annotation #1)

## V6

- **Frame content wrapper**: Removed border-radius and box-shadow from frame content — cleaner, no visual border around frames (annotation #3)

## V1 — Initial

- Dogfooding project: renders actual runtime tokens and components
- Tokens page: full OKLCH palette (N, A, W, F), spacing scale, radii, typography, icon sizes, elevation
- Components page: live TopBar, ProjectPicker, IterationPills, IterationSidebar with interactive state
- Swatch + ScaleRow components for token visualization
- Fix: sidebar hover highlight now matches active indicator width (consistent inset)
- Fix: iteration pills now absolutely centered in TopBar, no longer shift when project name changes
- Watch pill always visible: green (W tokens, h=155) when active, gray when off. Removed spring animation.
- Remove glow/shadow from watch dot
- IterationPills container + handle + buttons now use R.pill (20px) for consistent pill shape
- ProjectPicker: add `forceOpen` prop, show open-state preview in Components page for annotation

## V2 — Accent Exploration

- 10 OKLCH accent color options: Signal Red, Coral, Amber, Olive, Emerald, Teal, Cyan, Blue, Indigo, Violet
- Each shown with button, badge, letter icon, outline variant, and text link
- V1 frozen

## V3 — White Chrome + Charcoal Accent

- Created V3 from V2
- V2 frozen
- **chrome swatch**: Changed from L=0.952 warm neutral to L=1.000 pure white (annotation #1)
- **accent section**: Changed from signal red (h=28, c=0.20) to charcoal (h=80, c=0.005) (annotation #2)
- Local experimental tokens: V3 uses its own `tokens.ts` instead of runtime tokens to preview changes in isolation
- **shell sidebar**: White background — created PreviewSidebar component with V3 tokens (annotation #4)
- **shell topbar**: White background — created PreviewTopBar component with V3 tokens (annotation #5)
- **ProjectPicker avatar**: Charcoal letter avatars — created PreviewProjectPicker component with V3 tokens (annotation #6)
- **pending badge**: Charcoal accent badge — PreviewTopBar uses V3 A.accent for pending count (annotation #7)
- Created V3-local preview components (PreviewTopBar, PreviewSidebar, PreviewProjectPicker) to fully preview the white chrome + charcoal accent system without modifying runtime tokens
- **ColorPicker**: Interactive OKLCH color picker with hex/HSL/OKLCH input modes. Canvas-based L×C gradient area + hue strip. Click any token swatch to open. Gamut indicator for out-of-sRGB colors.
- **Swatch**: Now clickable — opens ColorPicker popover when `oklch` prop is provided

## V4 — Live Preview + Annotation-on-Apply

- Created V4 from V3
- V3 frozen
- **Swatch live preview**: Color updates in real-time as you drag or type in the picker (React state only, no file writes)
- **Annotation-on-apply**: Clicking Apply posts an annotation to the MCP server with the token change (e.g. "Change N.chrome to oklch(0.950 0.003 80)")
- **Pending marker**: Charcoal dot appears on swatch after Apply, disappears when agent resolves the annotation via SSE
- **ColorPicker onChange**: New callback fires on every color change for live preview
- Three swatch states: default (token color), previewing (picker open), pending (applied, awaiting agent)

## V5 — Color Experiments

- Created V5 from V4
- V4 frozen
- Tokens page now uses runtime `TokenSwatch` with CSS custom property tokenPaths (`--chrome`, `--accent`, etc.)
- All V5 pages and preview components use `var(--token)` CSS custom properties instead of JS constants for colors
- `tokens.css` populated with full OKLCH custom property set for live override support
- Token overrides now propagate to Shell page and all other pages via CSS inheritance
- **canvas token**: Changed from oklch(0.972 0.003 80) to oklch(0.972 0.001 197) — cool blue-tinted workspace background (annotation #12)
