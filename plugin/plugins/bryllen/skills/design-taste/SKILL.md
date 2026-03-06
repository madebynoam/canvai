---
name: design-taste
description: Invoke before generating or refining any design frames. Ensures distinctive, tasteful output that avoids generic AI aesthetics.
---

# Design Taste

Before writing any component or page code, complete these steps. Do not skip.

## 1. Design Thinking (Required)

Answer these before coding:

1. **Purpose**: What problem does this interface solve? Who uses it?
2. **Tone**: Pick ONE bold direction — commit fully:
   - Brutally minimal
   - Maximalist / dense
   - Retro-futuristic
   - Organic / natural
   - Luxury / refined
   - Playful / toy-like
   - Editorial / magazine
   - Brutalist / raw
   - Art deco / geometric
   - Soft / pastel
   - Industrial / utilitarian
3. **Differentiation**: What's the ONE thing someone will remember about this design?

**Execute with precision.** Bold maximalism and refined minimalism both work — the key is intentionality, not intensity.

## 2. Anti-Patterns (Never Do This)

### Fonts
- **Avoid**: Arial, Roboto, system-ui defaults
- **Inter is fine** but don't default to it — consider the context
- **Better**: Pick fonts that match the tone. Display fonts for headers, refined body fonts for text.

### Colors
- **Avoid**: Purple gradients on white (classic AI slop), evenly-distributed "safe" palettes
- **Better**: Dominant color + sharp accent. Commit to a cohesive theme.

### Layouts
- **Avoid**: Predictable card grids, cookie-cutter dashboard layouts, center-everything
- **Better**: Asymmetry, intentional overlap, diagonal flow, grid-breaking hero elements

### General
- **Avoid**: Generic corporate SaaS aesthetic, designs that could belong to any product
- **Better**: Context-specific character — a music app should feel different from a finance tool

## 3. Typography

- **Pair fonts intentionally**: Display font for headlines, refined font for body
- **Create hierarchy through contrast**: Size, weight, AND spacing
- **Consider variable fonts** for nuanced weights
- **Line height matters**: Tighter for headlines (1.1-1.2), looser for body (1.5-1.6)

## 4. Color

- **One dominant color** — let it breathe
- **Sharp accent** for actions and emphasis — use sparingly
- **Extract from context images** when provided — reference specific colors
- **Commit to light OR dark** — execute fully, no half-measures
- **All colors in OKLCH** — perceptually uniform, better for gradients

## 5. Spatial Composition

- **Asymmetry over symmetry** — creates visual interest
- **Generous negative space** OR controlled density — pick one, commit
- **Overlap and layering** — elements can break boundaries
- **Diagonal flow** — guide the eye, don't just stack vertically
- **Grid-breaking moments** — hero elements that demand attention

## 6. Backgrounds & Atmosphere

Never default to flat solid colors. Create depth:

- **Gradient meshes** — subtle, multi-stop gradients
- **Noise / grain textures** — adds warmth and tactility
- **Geometric patterns** — subtle, not distracting
- **Layered transparencies** — glass, blur, depth
- **Contextual effects** — match the aesthetic direction

## 7. Motion (When Applicable)

- **High-impact moments** over scattered micro-interactions
- **Staggered reveals on load** — use animation-delay, orchestrate
- **Surprising hover states** — reward exploration
- **Match intensity to aesthetic**: Maximalist = elaborate, Minimal = subtle
- **Spring physics** for position/scale, CSS transitions for color

## 8. Frame Layout (MANDATORY — horizontal only)

**Frames MUST be laid out HORIZONTALLY (increasing X, constant Y).**

### Widths and Gap
- Desktop: `1440px`, Tablet: `768px`, Mobile: `390px`
- Gap: `40px`

### Correct Layout (all Y = 0)
```ts
frames: [
  { id: 'a', x: 0,    y: 0, width: 1440, height: 900 },
  { id: 'b', x: 1480, y: 0, width: 1440, height: 900 },
  { id: 'c', x: 2960, y: 0, width: 1440, height: 900 },
  { id: 'd', x: 4440, y: 0, width: 1440, height: 900 },
  { id: 'e', x: 5920, y: 0, width: 1440, height: 900 },
]
```

### WRONG (vertical — DO NOT DO)
```ts
// FAIL: same X, increasing Y = vertical stack
{ x: 0, y: 0 }, { x: 0, y: 940 }, { x: 0, y: 1880 }
```

**If your frames have the same X and different Y values, you have failed.** Horizontal side-by-side comparison is Bryllen's core value.

## 9. Variation Mandate

When generating multiple directions:

- **Every direction genuinely different** — layout, hierarchy, approach — not just colors
- **Vary light/dark themes** across generations
- **Different typography** per direction — don't converge on the same fonts
- **No two designs should feel the same**

### "Genuinely Different" Examples
- Dashboard: card-based vs. table-based vs. sidebar+main
- Navigation: top bar vs. sidebar vs. bottom sheet vs. command palette
- Data display: charts vs. metrics cards vs. timeline vs. list

### NOT "Genuinely Different"
- Same layout with different colors
- Same hierarchy with different fonts
- Same component with spacing tweaks

## 10. Before You Code

Checklist:
- [ ] Chose ONE bold aesthetic direction
- [ ] Know the ONE thing that makes this memorable
- [ ] Have a dominant color + sharp accent planned
- [ ] Frame positions calculated (horizontal, no overlap)
- [ ] Context images analyzed for palette/style extraction (if provided)

Now write the code.
