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

## 8. Frame Layout (Critical)

**Frames must be laid out HORIZONTALLY, not vertically.**

### Width Calculation
- Desktop frames: `1440px` wide
- Tablet frames: `768px` wide
- Mobile frames: `390px` wide
- Gap between frames: `40px`

### Horizontal Layout Formula
```
Frame 1: x = 0
Frame 2: x = Frame1.width + 40
Frame 3: x = Frame2.x + Frame2.width + 40
...
```

### Example: 5 Desktop Frames
```
Frame 1: x=0,     width=1440
Frame 2: x=1480,  width=1440
Frame 3: x=2960,  width=1440
Frame 4: x=4440,  width=1440
Frame 5: x=5920,  width=1440
```

### Example: Mixed Widths (Desktop + 2 Mobile)
```
Desktop:  x=0,    width=1440
Mobile 1: x=1480, width=390
Mobile 2: x=1910, width=390
```

**Never stack frames vertically unless explicitly requested.** Horizontal layout enables side-by-side comparison, which is the core value of Canvai.

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
