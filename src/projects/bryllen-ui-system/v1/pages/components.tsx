import { useState } from 'react'
import { N, A, S, R, T, ICON, FONT } from '../../../../runtime/tokens'
import { TopBar } from '../../../../runtime/TopBar'
import { ProjectPicker } from '../../../../runtime/ProjectPicker'
import { IterationPills } from '../../../../runtime/IterationPills'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: S.xxl }}>
      <div style={{
        fontSize: T.label, fontWeight: 600, color: N.txtFaint,
        textTransform: 'uppercase', letterSpacing: '0.08em',
        marginBottom: S.sm, fontFamily: FONT,
      }}>
        {title}
      </div>
      {children}
    </div>
  )
}

const sampleProjects = [
  { project: 'settings-page' },
  { project: 'dashboard' },
  { project: 'onboarding' },
]

const sampleIterations = [
  { name: 'V1' },
  { name: 'V2' },
  { name: 'V3' },
]

const samplePages = [
  { name: 'Tokens' },
  { name: 'Components' },
  { name: 'Team Settings' },
  { name: 'Dashboard' },
]

export function Components() {
  const [projectIdx, setProjectIdx] = useState(0)
  const [iterIdx, setIterIdx] = useState(0)

  return (
    <div style={{ padding: S.xxl, fontFamily: FONT }}>
      <div style={{ fontSize: T.title, fontWeight: 600, color: N.txtPri, marginBottom: S.xl }}>
        Runtime Components
      </div>

      <Section title="TopBar">
        <div style={{ border: `1px solid ${N.border}`, borderRadius: R.card, overflow: 'hidden' }}>
          <TopBar
            projects={sampleProjects}
            activeProjectIndex={projectIdx}
            onSelectProject={setProjectIdx}
            annotationEndpoint="http://localhost:4748"
            projectName="settings-page"
          />
        </div>
      </Section>

      <Section title="ProjectPicker">
        <div style={{ display: 'inline-block' }}>
          <ProjectPicker
            projects={sampleProjects}
            activeIndex={projectIdx}
            onSelect={setProjectIdx}
          />
        </div>
      </Section>

      <Section title="ProjectPicker — Open">
        <div style={{ display: 'inline-block', position: 'relative', minHeight: 160 }}>
          <ProjectPicker
            projects={sampleProjects}
            activeIndex={projectIdx}
            onSelect={setProjectIdx}
            forceOpen
          />
        </div>
      </Section>

      <Section title="IterationPills — 3 items">
        <div style={{ display: 'inline-block', padding: S.sm, backgroundColor: N.chrome, borderRadius: R.card }}>
          <IterationPills
            items={['V1', 'V2', 'V3']}
            activeIndex={iterIdx}
            onSelect={setIterIdx}
          />
        </div>
      </Section>

      <Section title="IterationPills — 6 items (scrolling)">
        <div style={{ display: 'inline-block', padding: S.sm, backgroundColor: N.chrome, borderRadius: R.card }}>
          <IterationPills
            items={['V1', 'V2', 'V3', 'V4', 'V5', 'V6']}
            activeIndex={0}
            onSelect={() => {}}
          />
        </div>
      </Section>
    </div>
  )
}
