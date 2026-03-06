# Canvai — Ship in 7 Days

> "Real artists ship." — Steve Jobs

---

## Jobs to Be Done

Canvai is hired for four jobs:

### Job 1: Explore Directions
> When I'm starting a design, I want to see multiple options at once, so I can find the right direction.

**Interaction:** Canvas shows directions side-by-side.

### Job 2: Iterate Without Context-Switching
> When I see something to change, I want to describe it in words, so I don't have to switch tools.

**Interaction:** Click → Type → Applied.

### Job 3: Decide and Move On
> When I've found the right design, I want to grab it and use it, so I can ship.

**Interaction:** Cmd+Shift+Click → Finder opens to the file.

### Job 4: Get Feedback
> When I need approval, I want to share a link, so stakeholders can see it.

**Interaction:** Share → Link.

---

## The Journey

| Stage | Job | Interaction |
|-------|-----|-------------|
| Start | I need a landing page | `canvai new` |
| Explore | Show me options | Canvas → directions |
| Iterate | Make this bigger | Click → annotate |
| Decide | This one | Cmd+Shift+Click |
| Feedback | What do you think? | Share → link |
| Ship | Let's use it | File is already there |

**The code was never a mockup.** Explore → Decide → Ship. No handoff.

---

## What We're Building

**Canvai** is an infinite canvas for Claude Code. Designers describe what they want, Claude generates multiple real React components, they compare side-by-side and ship the best one.

**Core insight:** Seeing multiple directions at once is the UX breakthrough. Not chat. Not one generation. A canvas full of options.

---

## The Plan

### Ship
- Core annotation loop (click → describe → apply)
- `canvai new` (instant scaffold)
- `canvai design` (canvas + watch mode)
- Cmd+Shift+Click → Finder (grab the file)
- Share button in UI (deploy to GH Pages)
- Vue-style docs (60 seconds to first design)

### Cut
- GitHub comments (defer to v2)
- `/close` command (Ctrl+C works)
- `/update` command (npm handles it)
- `/share` command (button is better)
- Export modal (file is already there)

---

## 7-Day Timeline

| Day | Focus | Owner |
|-----|-------|-------|
| 1-2 | Core loop polish | Eng |
| 3 | Share button + Cmd+Shift+Click | Eng |
| 4 | LP selection (pick 3) | Design |
| 5 | Homepage live | Design |
| 6 | Vue-style docs | PM |
| 7 | Ship 🚀 | All |

---

## Success Criteria

**Day 7:**
- New user: `canvai new` → shareable URL in < 5 min
- Core loop works 100%
- Cmd+Shift+Click opens Finder
- 3 beta users say "wow" unprompted

---

## The Name

"Canvai" may need to change. Top option: **Pano** (panoramic, pano.dev available).

Ship with current name. Rename later if needed.

---

## Docs Strategy

Learn from Vue.js:
1. **Quick Start** — 2 min, npx → first design
2. **Core Concepts** — 10 min, canvas/frames/annotations
3. **Guide** — 30 min, full workflow
4. **API Reference** — as needed

If they can't start in 60 seconds, we've failed.

---

Let's ship.
