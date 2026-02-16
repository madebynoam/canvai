# Changelog

## V1 — Initial

- Extracted primitives: Button, Avatar, Label, Swatch, HoverButton
- Base tokens.css with OKLCH custom properties (cerulean h=235 accent)
- Shell assembly using shared primitives + CSS custom properties
- Palette overview with neutral + accent scales
- Added Toggle and Checkbox spring primitives

## V2 — Rams Palette

- Warm neutrals: shifted from cool (c=0, no hue) to warm stone (h=80, c=0.003)
- Three Rams-authentic accent candidates:
  - **Braun Green** (h=155) — SK 4 power light, ET 66 calculator keys
  - **Braun Orange** (h=55) — TP 1 dial, SK 4 knob accents
  - **Signal Red** (h=28) — TG 60 record button, RT 20 dial
- Default accent: Braun Green — color as function indicator, not decoration
- Shell assembly: same layout as V1, different tokens (no invented UI)
- Toggle + Checkbox spring previews in palette page
- V1 frozen with pinned cerulean tokens

## V3 — Linear Layout

- No top bar — sidebar sits directly on chrome base
- Canvas elevated + inset with rounded corners (new canvas tokens)
- Floating watch/pending indicators on canvas with gradient fade
- Signal red accent (h=28)
- V2 frozen

## V4 — Session Dial

- Iteration picker in top bar center — replaces sidebar folder tree
- 10 standalone picker components (pickers.tsx), all fixed 160px width:
  - Hairline (ruler + needle + dot), Dots (filled = active), Segments (progress bar)
  - Pills (rounded tabs), Notch (triangle indicator), Stepper (arrows + label)
  - Radio (FM tuning needle), Underline (accent underline), Gauge (semicircle)
  - Hash (film strip edge + accent indicator)
- Picker matrix page: all 10 at 1, 3, and 8 iterations — tests density + edge cases
- 10 interactive shell explorations — one per picker, all clickable with sidebar sync:
  - Hairline, Dots, Segments, Pills, Notch, Stepper, Radio, Underline, Gauge, Hash
- Shared ShellFrame component — DRY chrome (top bar + sidebar + canvas + FABs)
- All pickers support onChange callback for shell integration
- **Finalists page** — Radio + Pills + RadioContained at 1, 4, 10, 20 iterations in interactive shells
  - `IterationRadio`: compact 20px height, labels collapse at 7+ items, full-width clickable ruler (click anywhere → nearest item), accent needle springs
  - `IterationPills`: continuous pill strip with drag-to-scrub — finger and strip are independent; crossing boundaries (24px per item) springs the strip to center the active item. ≤4 items all visible, 5+ clips with arrows + counter
  - `IterationRadioContained`: radio picker in rounded pill container, first/last labels at sides of ruler strip, active label appended when not first/last
- ShellFrame: interactive sidebar toggle (PanelLeft) + project picker (Avatar + ChevronDown)
- Sidebar restructured: "System" section (Tokens, Primitives) + iteration "Pages"
- System pages are shared across all iterations; Pages section updates when picker changes
- V3 frozen
