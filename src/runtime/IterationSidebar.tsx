import { useState } from 'react'
import { Palette, Layers, Image } from 'lucide-react'
import { N, S, R, T, ICON, FONT, DIM } from './tokens'
import { InfoButton } from './InfoButton'

interface IterationSidebarProps {
  iterationName: string
  pages: { name: string }[]
  activePageIndex: number
  onSelectPage: (pageIndex: number) => void
  collapsed: boolean
}

/* Section header — aligned with row text */
function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      padding: `0 ${S.md}px`, marginBottom: S.xs,
      fontSize: T.ui, fontWeight: 500, color: N.txtMuted,
    }}>
      {children}
    </div>
  )
}

/* Sidebar row — icon + label, active state */
function SidebarRow({ children, icon, active, onClick }: {
  children: React.ReactNode
  icon?: React.ReactNode
  active?: boolean
  onClick?: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: S.sm,
        width: `calc(100% - ${S.md}px)`,
        height: DIM.row,
        border: 'none',
        padding: `0 ${S.sm}px`,
        margin: `0 ${S.xs}px`,
        borderRadius: R.ui, cornerShape: 'squircle',
        backgroundColor: active ? N.active : hovered ? 'rgba(0,0,0,0.03)' : 'transparent',
        fontFamily: FONT, textAlign: 'left',
        fontSize: T.ui,
        fontWeight: 400,
        color: N.txtPri,
        cursor: 'default',
      }}
    >
      {icon}
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {children}
      </span>
    </button>
  )
}

export function IterationSidebar({ iterationName, pages, activePageIndex, onSelectPage, collapsed }: IterationSidebarProps) {
  if (pages.length === 0) return null

  /* Split pages into system pages (Tokens, Components, Context) and iteration pages */
  const systemNames = ['Tokens', 'Components', 'Context']
  const systemPages: { name: string; index: number }[] = []
  const iterPages: { name: string; index: number }[] = []

  pages.forEach((page, i) => {
    if (systemNames.includes(page.name)) {
      systemPages.push({ name: page.name, index: i })
    } else {
      iterPages.push({ name: page.name, index: i })
    }
  })

  const iconForSystem = (name: string) => {
    if (name === 'Tokens') return <Palette size={ICON.sm} strokeWidth={1.5} style={{ color: N.txtMuted, flexShrink: 0 }} />
    if (name === 'Components') return <Layers size={ICON.sm} strokeWidth={1.5} style={{ color: N.txtMuted, flexShrink: 0 }} />
    if (name === 'Context') return <Image size={ICON.sm} strokeWidth={1.5} style={{ color: N.txtMuted, flexShrink: 0 }} />
    return null
  }

  return (
    <div style={{
      width: collapsed ? 0 : DIM.sidebar,
      backgroundColor: N.chrome,
      padding: `${S.md}px 0`,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      flexShrink: 0,
      fontFamily: FONT,
    }}>
      {/* System section */}
      {systemPages.length > 0 && (
        <div style={{ marginBottom: S.lg }}>
          <SectionHeader>System</SectionHeader>
          {systemPages.map(sp => (
            <SidebarRow
              key={sp.name}
              icon={iconForSystem(sp.name)}
              active={sp.index === activePageIndex}
              onClick={() => onSelectPage(sp.index)}
            >
              {sp.name}
            </SidebarRow>
          ))}
        </div>
      )}

      {/* Divider */}
      {systemPages.length > 0 && iterPages.length > 0 && (
        <div style={{ height: 1, backgroundColor: N.border, margin: `0 ${S.md}px` }} />
      )}

      {/* Iteration pages section */}
      {iterPages.length > 0 && (
        <div style={{ marginTop: systemPages.length > 0 ? S.md : 0 }}>
          <SectionHeader>Pages</SectionHeader>
          {iterPages.map(ip => (
            <SidebarRow
              key={ip.name}
              active={ip.index === activePageIndex}
              onClick={() => onSelectPage(ip.index)}
            >
              {ip.name}
            </SidebarRow>
          ))}
        </div>
      )}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Info button */}
      <div style={{ padding: `0 ${S.md}px`, paddingBottom: S.xs }}>
        <InfoButton />
      </div>
    </div>
  )
}
