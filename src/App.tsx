import './App.css'
import { Canvas } from './app/Canvas'
import { Frame } from './app/Frame'
import { useFrames } from './app/useFrames'
import { Agentation } from 'agentation'

function App() {
  const { frames, updateFrame } = useFrames([])

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
