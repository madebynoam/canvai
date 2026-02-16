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
