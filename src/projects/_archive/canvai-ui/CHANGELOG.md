# Changelog

## V8 — System Parts (Cerulean 400)

- **Annotation FAB**: Replaced gradients with flat accent surfaces + inset shadows for physicality. Idle uses bottom inset, hover lightens to A[300], pressed deepens with top inset shadow. (annotation #7)
- **Annotation Markers**: Replaced gradient fills with flat A[400] + subtle drop shadow. (annotation #7)
- **Assembly FAB + markers**: Updated to match flat style. (annotation #7)

## V6 — Polished Showcase (motion audit)

- **App Shell**: Full app shell in watch mode (sidebar open, 3 pending) and manual mode (sidebar collapsed) using real TopBar + IterationSidebar
- **TopBar**: Three instances — manual/0 pending, watch/3 pending, watch/sidebar closed — all interactive
- **ProjectPicker**: Closed trigger + open dropdown side by side with real component
- **Iteration Sidebar**: Expanded (5 iterations, active page) + collapsed state side by side
- **Annotate**: FAB idle/hover/pressed states, mini canvas with FAB, numbered markers
- **Targeting**: Mini canvas with crosshair cursor + orange highlight box on elements
- **Commenting**: Comment card in 3 states (empty/filled-manual/filled-watch) + toast, all textareas typeable
- **Interaction Playground**: Full working mini-app with every component — TopBar, Sidebar, Picker, FAB, targeting, commenting, markers, toast
- **Feature inventory**: Added to plugin CLAUDE.md — hard constraint preventing fictional features

### Motion audit fixes (Emil primary, Jakub secondary)

- **`prefers-reduced-motion`**: All springs snap to target when reduced motion is enabled — TopBar, ProjectPicker, IterationSidebar, AnnotationOverlay
- **AnnotationOverlay > FAB**: Fixed `transition: all` to target specific properties (`transform, box-shadow, background-color`)
- **AnnotationOverlay > comment card**: Spring enter (opacity + translateY + scale) and exit animation via `useSpringMount`
- **AnnotationOverlay > toast**: Spring enter from below (translateY 16→0), fade exit
- **AnnotationOverlay > FAB**: Spring scale enter/exit on mode change (scale 0.8→1)
- **AnnotationOverlay > markers**: Spring scale on placement (0.5→1, snappy preset with overshoot)
- **AnnotationOverlay > buttons**: Hover states on delete (Trash2), Cancel, and Apply buttons (150ms bg transition)
- **AnnotationOverlay > keyboard**: Cmd+Enter skips exit animation (Emil: keyboard = instant)
- **ProjectPicker > spring**: Tightened friction 19→21 for faster settle (~280ms)
- **IterationSidebar > spring**: Tightened friction 19→21 to match
- **Highlight box**: Fixed `transition: all` to target specific position/size properties

### Annotation changes (watch mode)

- **IterationSidebar > page button**: Removed fontWeight change on active state — dark text color alone is sufficient (annotation #1, #3)
- **ProjectPicker > dropdown**: Changed reveal animation from scaleY (visible height change) to scale + translateY spring (annotation #2, #4)
- **AnnotationOverlay > comment card**: Added Trash2 delete icon in header when re-editing a pending annotation (annotation #5)
- **AnnotationOverlay > comment card**: Removed Manual/Live mode badges — redundant with toolbar indicator (annotation #6)

## V5 — System

- **THREAD_MENU_ITEMS > button "Copy thread link"**: Changed icon from MoreHorizontal to Link (annotation #14)
- **THREAD_MENU_ITEMS > button "Mute thread"**: Removed — feature won't be built (annotation #15)
- **THREAD_MENU_ITEMS**: Shortened labels — "Copy thread link" to "Copy link", "Delete thread" to "Delete". Rams: as little design as possible. (annotation #16)
- **ThreadMessage reactions**: Replaced "+1" text with actual emoji reactions (👍 2, 🔥 1) (annotation #17)
