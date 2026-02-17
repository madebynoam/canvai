# canvai-ui-system

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
