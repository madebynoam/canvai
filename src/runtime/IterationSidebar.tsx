import { useState } from 'react'
import { Palette, Layers } from 'lucide-react'
import { N, S, R, T, ICON, FONT } from './tokens'
import { InfoButton } from './InfoButton'

interface IterationSidebarProps {
  iterationName: string
  pages: { name: string }[]
  activePageIndex: number
  onSelectPage: (pageIndex: number) => void
  collapsed: boolean
}

/* Section header — uppercase, faint, spaced */
function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      padding: `0 ${S.lg}px`, marginBottom: S.xs,
      fontSize: T.label, fontWeight: 600, color: N.txtFaint,
      textTransform: 'uppercase', letterSpacing: '0.08em',
      textWrap: 'pretty',
    } as React.CSSProperties}>
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
        width: `calc(100% - ${S.lg}px)`,
        border: 'none',
        padding: `${S.xs}px ${S.sm}px`,
        margin: `0 ${S.sm}px`,
        borderRadius: R.control,
        backgroundColor: active ? N.chromeSub : hovered ? 'rgba(0,0,0,0.03)' : 'transparent',
        fontFamily: FONT, textAlign: 'left',
        fontSize: T.body,
        fontWeight: 400,
        color: active ? N.txtPri : N.txtSec,
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

  /* Split pages into system pages (Tokens, Components) and iteration pages */
  const systemNames = ['Tokens', 'Components']
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
    if (name === 'Tokens') return <Palette size={ICON.sm} strokeWidth={1.5} style={{ color: N.txtFaint, flexShrink: 0 }} />
    if (name === 'Components') return <Layers size={ICON.sm} strokeWidth={1.5} style={{ color: N.txtFaint, flexShrink: 0 }} />
    return null
  }

  return (
    <div style={{
      width: collapsed ? 0 : 160,
      backgroundColor: N.chrome,
      padding: `${S.md}px 0`,
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.15s ease',
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
        <div style={{ height: 1, backgroundColor: N.borderSoft, margin: `0 ${S.lg}px` }} />
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
      <div style={{ padding: `0 ${S.lg}px`, paddingBottom: S.xs }}>
        <InfoButton />
      </div>
    </div>
  )
}
