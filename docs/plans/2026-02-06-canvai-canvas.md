# Canvai Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a Figma-like infinite canvas React app where AI agents place and iterate on design components as live code.

**Architecture:** Vite + React app with a custom spatial canvas component (pan, zoom, drag). Frames on the canvas render live React components at absolute positions. Agentation MCP provides the annotation feedback layer. A CLAUDE.md file teaches the agent the canvas API.

**Tech Stack:** React 18, Vite, TypeScript, Agentation MCP

---

## Task 1: Scaffold the Vite + React + TypeScript project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/App.css`
- Create: `src/index.css`

**Step 1: Initialize the Vite project**

Run:
```bash
npm create vite@latest . -- --template react-ts
```

Accept overwrite prompts (the directory already has files). This generates the boilerplate.

**Step 2: Install dependencies**

Run:
```bash
npm install
```

**Step 3: Verify dev server starts**

Run:
```bash
npm run dev -- --host
```

Expected: Vite dev server starts on localhost, shows the default React page.

**Step 4: Clean up boilerplate**

Strip `App.tsx` down to a minimal shell:

```tsx
import './App.css'

function App() {
  return <div id="canvai-root" style={{ width: '100vw', height: '100vh' }} />
}

export default App
```

Strip `App.css` and `index.css` to just a CSS reset:

```css
/* index.css */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body, #root {
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  background: #1e1e1e;
  color: #e0e0e0;
}
```

**Step 5: Verify clean app loads**

Run:
```bash
npm run dev
```

Expected: Dark blank page, no errors in console.

**Step 6: Commit**

```bash
git add -A && git commit -m "scaffold: Vite + React + TypeScript project"
```

---

## Task 2: Build the Canvas component — pan and zoom

**Files:**
- Create: `src/components/Canvas.tsx`
- Create: `src/types.ts`
- Modify: `src/App.tsx`

**Step 1: Create the types file**

```ts
// src/types.ts
export interface CanvasFrame {
  id: string
  title: string
  x: number
  y: number
  width: number
  height: number
  component: React.ComponentType
  props?: Record<string, unknown>
}

export interface CanvasState {
  pan: { x: number; y: number }
  zoom: number
}
```

**Step 2: Create the Canvas component with pan and zoom**

```tsx
// src/components/Canvas.tsx
import { useRef, useState, useEffect, useCallback } from 'react'

const MIN_ZOOM = 0.1
const MAX_ZOOM = 5

interface CanvasProps {
  children?: React.ReactNode
}

export function Canvas({ children }: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  // Refs for direct DOM manipulation during gestures
  const panRef = useRef(pan)
  const zoomRef = useRef(zoom)
  panRef.current = pan
  zoomRef.current = zoom

  // Wheel handler: Ctrl/Cmd+scroll = zoom toward cursor, plain scroll = pan
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      if (e.ctrlKey || e.metaKey) {
        // Zoom toward mouse position
        const rect = container.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top

        const contentX = (mouseX - panRef.current.x) / zoomRef.current
        const contentY = (mouseY - panRef.current.y) / zoomRef.current

        const factor = e.deltaY > 0 ? 0.9 : 1.1
        const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoomRef.current * factor))

        const newPanX = mouseX - contentX * newZoom
        const newPanY = mouseY - contentY * newZoom

        setPan({ x: newPanX, y: newPanY })
        setZoom(newZoom)
        panRef.current = { x: newPanX, y: newPanY }
        zoomRef.current = newZoom
      } else {
        // Pan
        const newPan = {
          x: panRef.current.x - e.deltaX,
          y: panRef.current.y - e.deltaY,
        }
        setPan(newPan)
        panRef.current = newPan
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'grab',
      }}
    >
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          willChange: 'transform',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        {children}
      </div>
    </div>
  )
}
```

**Step 3: Wire Canvas into App**

```tsx
// src/App.tsx
import './App.css'
import { Canvas } from './components/Canvas'

function App() {
  return (
    <div id="canvai-root" style={{ width: '100vw', height: '100vh' }}>
      <Canvas>
        {/* Test content */}
        <div style={{
          position: 'absolute',
          left: 100,
          top: 100,
          width: 200,
          height: 200,
          background: '#333',
          border: '1px solid #555',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          borderRadius: 8,
        }}>
          Test Frame
        </div>
      </Canvas>
    </div>
  )
}

export default App
```

**Step 4: Verify pan and zoom work**

Run:
```bash
npm run dev
```

Expected: Grey box on dark canvas. Scroll pans. Ctrl+scroll zooms toward cursor.

**Step 5: Commit**

```bash
git add src/components/Canvas.tsx src/types.ts src/App.tsx
git commit -m "feat: Canvas component with pan and zoom"
```

---

## Task 3: Add background drag-to-pan

**Files:**
- Modify: `src/components/Canvas.tsx`

**Step 1: Add pointer event handlers for drag-to-pan on background**

Add to the `Canvas` component, inside the component body:

```tsx
const [isDragging, setIsDragging] = useState(false)
const dragStartRef = useRef({ x: 0, y: 0 })
const panStartRef = useRef({ x: 0, y: 0 })

const handlePointerDown = useCallback((e: React.PointerEvent) => {
  // Only pan when clicking the canvas background (not children)
  if (e.target !== containerRef.current) return
  e.preventDefault()
  setIsDragging(true)
  dragStartRef.current = { x: e.clientX, y: e.clientY }
  panStartRef.current = { ...panRef.current }
  ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
}, [])

const handlePointerMove = useCallback((e: React.PointerEvent) => {
  if (!isDragging) return
  const dx = e.clientX - dragStartRef.current.x
  const dy = e.clientY - dragStartRef.current.y
  const newPan = {
    x: panStartRef.current.x + dx,
    y: panStartRef.current.y + dy,
  }
  setPan(newPan)
  panRef.current = newPan
}, [isDragging])

const handlePointerUp = useCallback(() => {
  setIsDragging(false)
}, [])
```

Attach these to the container `<div>`:

```tsx
<div
  ref={containerRef}
  onPointerDown={handlePointerDown}
  onPointerMove={handlePointerMove}
  onPointerUp={handlePointerUp}
  style={{
    // ... existing styles
    cursor: isDragging ? 'grabbing' : 'grab',
  }}
>
```

**Step 2: Verify drag-to-pan works**

Run: `npm run dev`

Expected: Click and drag on the dark background pans the canvas. Clicking the grey box does NOT pan.

**Step 3: Commit**

```bash
git add src/components/Canvas.tsx
git commit -m "feat: drag-to-pan on canvas background"
```

---

## Task 4: Add keyboard shortcuts for zoom

**Files:**
- Modify: `src/components/Canvas.tsx`

**Step 1: Add keyboard zoom handlers**

Add a `useEffect` inside Canvas:

```tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    const isMod = e.metaKey || e.ctrlKey

    if (isMod && (e.key === '=' || e.key === '+')) {
      e.preventDefault()
      setZoom(z => {
        const newZoom = Math.min(MAX_ZOOM, z * 1.2)
        zoomRef.current = newZoom
        return newZoom
      })
    } else if (isMod && e.key === '-') {
      e.preventDefault()
      setZoom(z => {
        const newZoom = Math.max(MIN_ZOOM, z * 0.8)
        zoomRef.current = newZoom
        return newZoom
      })
    } else if (isMod && e.key === '0') {
      e.preventDefault()
      // Fit all: reset to center
      setZoom(1)
      setPan({ x: 0, y: 0 })
      zoomRef.current = 1
      panRef.current = { x: 0, y: 0 }
    }
  }

  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [])
```

**Step 2: Verify keyboard shortcuts**

Run: `npm run dev`

Expected: Cmd+Plus zooms in, Cmd+Minus zooms out, Cmd+0 resets to 1x at origin.

**Step 3: Commit**

```bash
git add src/components/Canvas.tsx
git commit -m "feat: keyboard shortcuts for zoom (Cmd+Plus/Minus/0)"
```

---

## Task 5: Build the Frame component

**Files:**
- Create: `src/components/Frame.tsx`
- Modify: `src/types.ts` (if needed)

**Step 1: Create the Frame component**

Each frame renders a live React component at a canvas position with a title label:

```tsx
// src/components/Frame.tsx
import React from 'react'

interface FrameProps {
  id: string
  title: string
  x: number
  y: number
  width: number
  height: number
  zoom: number
  children: React.ReactNode
}

export function Frame({ title, x, y, width, height, zoom, children }: FrameProps) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
      }}
    >
      {/* Label — counter-scaled to stay readable at any zoom */}
      <div
        style={{
          fontSize: 12 / zoom,
          color: '#999',
          marginBottom: 8 / zoom,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: width,
        }}
      >
        {title}
      </div>
      {/* Content area */}
      <div
        style={{
          width,
          minHeight: height,
          background: '#fff',
          borderRadius: 8 / zoom,
          boxShadow: `0 ${2 / zoom}px ${8 / zoom}px rgba(0,0,0,0.3)`,
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  )
}
```

**Step 2: Test Frame in App with a sample component**

```tsx
// src/App.tsx
import './App.css'
import { Canvas } from './components/Canvas'
import { Frame } from './components/Frame'

function SampleButton({ variant }: { variant: 'primary' | 'secondary' }) {
  return (
    <div style={{ padding: 24 }}>
      <button
        style={{
          padding: '8px 16px',
          background: variant === 'primary' ? '#3858e9' : 'transparent',
          color: variant === 'primary' ? '#fff' : '#3858e9',
          border: `2px solid #3858e9`,
          borderRadius: 6,
          cursor: 'pointer',
          fontSize: 14,
        }}
      >
        {variant === 'primary' ? 'Primary' : 'Secondary'}
      </button>
    </div>
  )
}

function App() {
  const zoom = 1 // We'll thread this through later

  return (
    <div id="canvai-root" style={{ width: '100vw', height: '100vh' }}>
      <Canvas>
        <Frame id="btn-primary" title="Button / Primary" x={100} y={100} width={200} height={80} zoom={zoom}>
          <SampleButton variant="primary" />
        </Frame>
        <Frame id="btn-secondary" title="Button / Secondary" x={340} y={100} width={200} height={80} zoom={zoom}>
          <SampleButton variant="secondary" />
        </Frame>
      </Canvas>
    </div>
  )
}

export default App
```

**Step 3: Verify frames render**

Run: `npm run dev`

Expected: Two white frames on dark canvas, each with a label and a button inside. Pan and zoom still work. Labels stay readable at all zoom levels.

**Step 4: Commit**

```bash
git add src/components/Frame.tsx src/App.tsx
git commit -m "feat: Frame component with counter-scaled labels"
```

---

## Task 6: Thread zoom state to Frame labels

**Files:**
- Modify: `src/components/Canvas.tsx`
- Modify: `src/App.tsx`

**Step 1: Expose zoom via a React context**

Add to `Canvas.tsx`:

```tsx
import { createContext, useContext } from 'react'

const CanvasContext = createContext({ zoom: 1, pan: { x: 0, y: 0 } })

export function useCanvas() {
  return useContext(CanvasContext)
}
```

Wrap the children in the Canvas render with the provider:

```tsx
<CanvasContext.Provider value={{ zoom, pan }}>
  <div style={{ transform: ... }}>
    {children}
  </div>
</CanvasContext.Provider>
```

**Step 2: Update Frame to consume zoom from context**

Remove the `zoom` prop from `Frame` and read from context:

```tsx
import { useCanvas } from './Canvas'

export function Frame({ title, x, y, width, height, children }: FrameProps) {
  const { zoom } = useCanvas()
  // ... rest stays the same
}
```

**Step 3: Update App.tsx to remove zoom prop from Frames**

Remove the `zoom` variable and the `zoom` prop from each `<Frame>`.

**Step 4: Verify labels still counter-scale**

Run: `npm run dev`

Expected: Same behavior. Labels stay readable when zooming in/out.

**Step 5: Commit**

```bash
git add src/components/Canvas.tsx src/components/Frame.tsx src/App.tsx
git commit -m "feat: Canvas context for zoom, Frame reads zoom from context"
```

---

## Task 7: Build the frame registry and canvas API

**Files:**
- Create: `src/hooks/useFrames.ts`
- Modify: `src/App.tsx`

**Step 1: Create the useFrames hook**

This is the core API the agent uses to add/update/remove/reposition frames:

```ts
// src/hooks/useFrames.ts
import { useState, useCallback } from 'react'
import type { CanvasFrame } from '../types'

const FRAME_GAP = 40

export function useFrames(initialFrames: CanvasFrame[] = []) {
  const [frames, setFrames] = useState<CanvasFrame[]>(initialFrames)

  const addFrame = useCallback((frame: CanvasFrame) => {
    setFrames(prev => [...prev, frame])
  }, [])

  const updateFrame = useCallback((id: string, updates: Partial<CanvasFrame>) => {
    setFrames(prev =>
      prev.map(f => (f.id === id ? { ...f, ...updates } : f))
    )
  }, [])

  const removeFrame = useCallback((id: string) => {
    setFrames(prev => prev.filter(f => f.id !== id))
  }, [])

  // Calculate position for the next frame (to the right of all existing)
  const getNextPosition = useCallback(() => {
    if (frames.length === 0) return { x: 100, y: 100 }
    const rightmost = frames.reduce((max, f) =>
      f.x + f.width > max.x + max.width ? f : max
    )
    return {
      x: rightmost.x + rightmost.width + FRAME_GAP,
      y: rightmost.y,
    }
  }, [frames])

  return { frames, addFrame, updateFrame, removeFrame, getNextPosition }
}
```

**Step 2: Wire useFrames into App.tsx**

Replace the hardcoded frames in `App.tsx` with the `useFrames` hook. Initialize with the two sample button frames. Render frames dynamically:

```tsx
import { useFrames } from './hooks/useFrames'
import type { CanvasFrame } from './types'

function App() {
  const { frames } = useFrames([
    {
      id: 'btn-primary',
      title: 'Button / Primary',
      x: 100, y: 100, width: 200, height: 80,
      component: SampleButton,
      props: { variant: 'primary' },
    },
    {
      id: 'btn-secondary',
      title: 'Button / Secondary',
      x: 340, y: 100, width: 200, height: 80,
      component: SampleButton,
      props: { variant: 'secondary' },
    },
  ])

  return (
    <div id="canvai-root" style={{ width: '100vw', height: '100vh' }}>
      <Canvas>
        {frames.map(frame => (
          <Frame key={frame.id} id={frame.id} title={frame.title}
            x={frame.x} y={frame.y} width={frame.width} height={frame.height}>
            <frame.component {...(frame.props ?? {})} />
          </Frame>
        ))}
      </Canvas>
    </div>
  )
}
```

**Step 3: Update types.ts to ensure CanvasFrame has component field**

```ts
export interface CanvasFrame {
  id: string
  title: string
  x: number
  y: number
  width: number
  height: number
  component: React.ComponentType<any>
  props?: Record<string, unknown>
}
```

**Step 4: Verify**

Run: `npm run dev`

Expected: Same two buttons render, same canvas interactions.

**Step 5: Commit**

```bash
git add src/hooks/useFrames.ts src/App.tsx src/types.ts
git commit -m "feat: frame registry with useFrames hook"
```

---

## Task 8: Add Cmd+0 fit-all-frames

**Files:**
- Modify: `src/components/Canvas.tsx`

**Step 1: Calculate bounding box of all children and fit**

Update the Cmd+0 handler to compute a bounding box from the DOM and set zoom/pan to fit all content with padding:

```tsx
// Inside the keydown handler, replace the Cmd+0 case:
} else if (isMod && e.key === '0') {
  e.preventDefault()
  const container = containerRef.current
  if (!container) return
  const content = container.firstElementChild as HTMLElement
  if (!content) return

  // Get bounding box of all children in canvas space
  const children = content.children
  if (children.length === 0) return

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  for (let i = 0; i < children.length; i++) {
    const child = children[i] as HTMLElement
    const left = parseFloat(child.style.left) || 0
    const top = parseFloat(child.style.top) || 0
    const w = child.offsetWidth
    const h = child.offsetHeight
    minX = Math.min(minX, left)
    minY = Math.min(minY, top)
    maxX = Math.max(maxX, left + w)
    maxY = Math.max(maxY, top + h)
  }

  if (!isFinite(minX)) return

  const contentWidth = maxX - minX
  const contentHeight = maxY - minY
  const containerRect = container.getBoundingClientRect()
  const padding = 60

  const scaleX = (containerRect.width - padding * 2) / contentWidth
  const scaleY = (containerRect.height - padding * 2) / contentHeight
  const fitZoom = Math.min(Math.max(Math.min(scaleX, scaleY), MIN_ZOOM), MAX_ZOOM)

  const centerX = (minX + maxX) / 2
  const centerY = (minY + maxY) / 2
  const newPanX = containerRect.width / 2 - centerX * fitZoom
  const newPanY = containerRect.height / 2 - centerY * fitZoom

  setZoom(fitZoom)
  setPan({ x: newPanX, y: newPanY })
  zoomRef.current = fitZoom
  panRef.current = { x: newPanX, y: newPanY }
}
```

**Step 2: Verify fit-all**

Run: `npm run dev`

Expected: Pressing Cmd+0 fits all frames into view with padding.

**Step 3: Commit**

```bash
git add src/components/Canvas.tsx
git commit -m "feat: Cmd+0 fits all frames into view"
```

---

## Task 9: Add Agentation integration

**Files:**
- Modify: `package.json`
- Create: `.claude/settings.json` (for MCP config)
- Modify: `src/App.tsx`

**Step 1: Install Agentation**

Run:
```bash
npm install agentation -D
```

**Step 2: Add the Agentation component to App**

Add to `App.tsx`, after the Canvas:

```tsx
import { Agentation } from 'agentation'

// Inside the return, after </Canvas>:
{import.meta.env.DEV && <Agentation />}
```

**Step 3: Configure the MCP server**

Create `.claude/settings.json`:

```json
{
  "mcpServers": {
    "agentation": {
      "command": "npx",
      "args": ["agentation-mcp", "server"]
    }
  }
}
```

**Step 4: Verify Agentation loads in dev**

Run: `npm run dev`

Expected: Agentation toolbar appears in the corner of the page (or fails gracefully if the package isn't published yet).

**Step 5: Commit**

```bash
git add package.json package-lock.json src/App.tsx .claude/settings.json
git commit -m "feat: integrate Agentation for annotation feedback"
```

---

## Task 10: Write the CLAUDE.md

**Files:**
- Create: `CLAUDE.md`

**Step 1: Write the CLAUDE.md that teaches the agent the canvas API**

```markdown
# Canvai — Agent Instructions

This is a Canvai design canvas project. You are working inside a spatial canvas where design components are rendered as live React code.

## Project structure

- `src/App.tsx` — main app, renders Canvas with Frames
- `src/components/Canvas.tsx` — infinite canvas (pan, zoom, drag)
- `src/components/Frame.tsx` — individual frame on the canvas
- `src/hooks/useFrames.ts` — frame registry (add, update, remove)
- `src/types.ts` — TypeScript types

## How the canvas works

The canvas is an infinite 2D surface. Frames are placed at absolute `{ x, y }` positions. Each frame renders a live React component.

## Adding a frame

To add a new design component to the canvas, add a new entry to the frames array in `src/App.tsx`:

```tsx
{
  id: 'unique-id',
  title: 'Component / Variant',
  x: <number>,
  y: <number>,
  width: <number>,
  height: <number>,
  component: YourComponent,
  props: { /* component props */ },
}
```

## Spatial layout conventions

- Place new variations **to the right** of existing frames, with 40px gap
- Place new states **below** their parent variation
- Group related components together
- Keep consistent frame widths for the same component type

## Updating a frame

Modify the frame's entry in the frames array — change `component`, `props`, `width`, `height`, or position (`x`, `y`).

## Removing a frame

Delete the frame's entry from the frames array.

## Creating a design component

Create a new React component file in `src/components/` and import it into `App.tsx`. Place it in a frame.

## Annotation flow (Agentation)

When you receive annotation feedback via the Agentation MCP:
1. Read the annotation — it includes CSS selectors, component names, and computed styles
2. Map the selector to the relevant frame and component
3. Apply the requested changes to the component code
4. The canvas re-renders live — verify the change is correct

## Commands

- **Dev server:** `npm run dev`
- **Build:** `npm run build`
```

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: CLAUDE.md agent instructions for canvas API"
```

---

## Task 11: Create the `/init design project` skill scaffold

**Files:**
- Create: `skill/init-design-project.md`

**Step 1: Write the skill file**

```markdown
---
name: init-design-project
description: Bootstrap a new Canvai design project from the template
---

# Init Design Project

## Usage
```
/init design project <project-name>
```

## Steps

1. Clone the canvai repo:
   ```bash
   git clone https://github.com/<owner>/canvai.git <project-name>
   ```

2. Reset git history:
   ```bash
   cd <project-name>
   rm -rf .git
   git init
   git add -A
   git commit -m "init: canvai project <project-name>"
   ```

3. Update package.json name:
   ```bash
   # Set "name" field to <project-name>
   ```

4. Configure Agentation MCP in `.claude/settings.json` (already present in template).

5. Install dependencies:
   ```bash
   npm install
   ```

6. Launch dev server:
   ```bash
   npm run dev -- --open
   ```

7. Confirm the canvas loads in the browser. Ready to design.
```

**Step 2: Commit**

```bash
git add skill/
git commit -m "feat: /init design project skill scaffold"
```

---

## Task 12: Add .gitignore and clean up

**Files:**
- Create: `.gitignore`

**Step 1: Create .gitignore**

```
node_modules/
dist/
.DS_Store
*.local
```

**Step 2: Final verification**

Run:
```bash
npm run build
```

Expected: Clean build with no errors.

Run:
```bash
npm run dev
```

Expected: Canvas loads with two sample button frames. Pan, zoom, drag-to-pan, keyboard shortcuts all work. Cmd+0 fits frames.

**Step 3: Commit**

```bash
git add .gitignore
git commit -m "chore: add .gitignore"
```

---

## Summary

| Task | What it builds |
|------|---------------|
| 1 | Vite + React + TS scaffold |
| 2 | Canvas component — pan and zoom |
| 3 | Drag-to-pan on background |
| 4 | Keyboard shortcuts (Cmd+/-, Cmd+0) |
| 5 | Frame component with counter-scaled labels |
| 6 | Canvas context for zoom threading |
| 7 | Frame registry hook (useFrames) |
| 8 | Cmd+0 fit-all-frames |
| 9 | Agentation integration |
| 10 | CLAUDE.md agent instructions |
| 11 | /init design project skill |
| 12 | .gitignore and final cleanup |
