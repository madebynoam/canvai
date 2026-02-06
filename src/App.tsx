import './App.css'
import { Canvas } from './components/Canvas'
import { Frame } from './components/Frame'
import { useFrames } from './hooks/useFrames'
import { Agentation } from 'agentation'

function SampleButton({ variant }: { variant: 'primary' | 'secondary' }) {
  return (
    <div style={{ padding: 24 }}>
      <button
        style={{
          padding: '8px 16px',
          background: variant === 'primary' ? '#3858e9' : 'transparent',
          color: variant === 'primary' ? '#fff' : '#3858e9',
          border: '2px solid #3858e9',
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
          <Frame
            key={frame.id}
            id={frame.id}
            title={frame.title}
            x={frame.x}
            y={frame.y}
            width={frame.width}
            height={frame.height}
          >
            <frame.component {...(frame.props ?? {})} />
          </Frame>
        ))}
      </Canvas>
      {import.meta.env.DEV && <Agentation />}
    </div>
  )
}

export default App
