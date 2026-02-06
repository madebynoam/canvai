import './App.css'
import { Canvas } from './components/Canvas'
import { Frame } from './components/Frame'
import { useFrames } from './hooks/useFrames'
import { Agentation } from 'agentation'
import { DashboardNavBar } from './components/DashboardNavBar'

const sampleSites = [
  { id: 'site-1', name: 'My Blog', url: 'myblog.wordpress.com' },
  { id: 'site-2', name: 'Portfolio', url: 'portfolio.design' },
  { id: 'site-3', name: 'Company Site', url: 'acme.com' },
]

const sampleUser = {
  name: 'Noam Almosnino',
  email: 'noam@example.com',
}

function App() {
  const { frames, updateFrame } = useFrames([
    {
      id: 'navbar-default',
      title: 'NavBar / Default',
      x: 100, y: 100, width: 720, height: 60,
      component: DashboardNavBar,
      props: {
        sites: sampleSites,
        activeSiteId: 'site-1',
        user: sampleUser,
      },
    },
    {
      id: 'navbar-alt-site',
      title: 'NavBar / Different Site',
      x: 100, y: 200, width: 720, height: 60,
      component: DashboardNavBar,
      props: {
        sites: sampleSites,
        activeSiteId: 'site-2',
        user: sampleUser,
      },
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
            onMove={(id, newX, newY) => updateFrame(id, { x: newX, y: newY })}
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
