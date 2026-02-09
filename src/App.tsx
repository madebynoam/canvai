import './App.css'
import { Canvas } from './app/Canvas'
import { Frame } from './app/Frame'
import { useFrames } from './app/useFrames'
import { Agentation } from 'agentation'
import { SegmentedTabs } from './projects/test-tabs/SegmentedTabs'
import type { CanvasFrame } from './app/types'

const COL_W = 320
const ROW_H = 60
const GAP = 40
const X = 100
const Y0 = 120

const tabs2 = ['Monthly', 'Yearly']
const tabs3 = ['All', 'Active', 'Archived']
const tabs4 = ['Overview', 'Analytics', 'Reports', 'Settings']

// Columns: Default, Disabled
// Rows: 2 tabs, 3 tabs, 4 tabs × small, medium, large × filled, outline
const Label = ({ label }: { label: string }) => (
  <div style={{ fontSize: 13, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
)

const headers: CanvasFrame[] = [
  { id: 'h-filled', title: 'Variant: Filled', x: X, y: 40, width: COL_W, height: 30, component: Label, props: { label: 'Filled' } },
  { id: 'h-outline', title: 'Variant: Outline', x: X + COL_W + GAP, y: 40, width: COL_W, height: 30, component: Label, props: { label: 'Outline' } },
  { id: 'h-disabled', title: 'State: Disabled', x: X + (COL_W + GAP) * 2, y: 40, width: COL_W, height: 30, component: Label, props: { label: 'Disabled' } },
]

let row = 0
function nextY() {
  const y = Y0 + row * (ROW_H + GAP)
  row++
  return y
}

const matrix: CanvasFrame[] = []

// Small
const ySmall = nextY()
matrix.push(
  { id: 'tabs-sm-filled', title: 'Tabs / Small / Filled', x: X, y: ySmall, width: COL_W, height: ROW_H, component: SegmentedTabs, props: { tabs: tabs2, size: 'small', variant: 'filled' } },
  { id: 'tabs-sm-outline', title: 'Tabs / Small / Outline', x: X + COL_W + GAP, y: ySmall, width: COL_W, height: ROW_H, component: SegmentedTabs, props: { tabs: tabs2, size: 'small', variant: 'outline' } },
  { id: 'tabs-sm-disabled', title: 'Tabs / Small / Disabled', x: X + (COL_W + GAP) * 2, y: ySmall, width: COL_W, height: ROW_H, component: SegmentedTabs, props: { tabs: tabs2, size: 'small', disabled: true } },
)

// Medium
const yMed = nextY()
matrix.push(
  { id: 'tabs-md-filled', title: 'Tabs / Medium / Filled', x: X, y: yMed, width: COL_W, height: ROW_H, component: SegmentedTabs, props: { tabs: tabs3, size: 'medium', variant: 'filled' } },
  { id: 'tabs-md-outline', title: 'Tabs / Medium / Outline', x: X + COL_W + GAP, y: yMed, width: COL_W, height: ROW_H, component: SegmentedTabs, props: { tabs: tabs3, size: 'medium', variant: 'outline' } },
  { id: 'tabs-md-disabled', title: 'Tabs / Medium / Disabled', x: X + (COL_W + GAP) * 2, y: yMed, width: COL_W, height: ROW_H, component: SegmentedTabs, props: { tabs: tabs3, size: 'medium', disabled: true } },
)

// Large
const yLg = nextY()
matrix.push(
  { id: 'tabs-lg-filled', title: 'Tabs / Large / Filled', x: X, y: yLg, width: COL_W, height: ROW_H, component: SegmentedTabs, props: { tabs: tabs4, size: 'large', variant: 'filled' } },
  { id: 'tabs-lg-outline', title: 'Tabs / Large / Outline', x: X + COL_W + GAP, y: yLg, width: COL_W, height: ROW_H, component: SegmentedTabs, props: { tabs: tabs4, size: 'large', variant: 'outline' } },
  { id: 'tabs-lg-disabled', title: 'Tabs / Large / Disabled', x: X + (COL_W + GAP) * 2, y: yLg, width: COL_W, height: ROW_H, component: SegmentedTabs, props: { tabs: tabs4, size: 'large', disabled: true } },
)

function App() {
  const { frames, updateFrame } = useFrames([...headers, ...matrix])

  return (
    <div id="canvai-root" style={{ width: '100vw', height: '100vh' }}>
      <Canvas>
        {frames.map(frame => (
          <Frame
            key={frame.id}
            id={frame.id}
            title={frame.title}
            x={frame.x}
            y={frame.y}
            width={frame.width}
            height={frame.height}
            onMove={(id, newX, newY) => updateFrame(id, { x: newX, y: newY })}
          >
            <frame.component {...(frame.props ?? {})} />
          </Frame>
        ))}
      </Canvas>
      {import.meta.env.DEV && <Agentation endpoint="http://localhost:4747" />}
    </div>
  )
}

export default App
