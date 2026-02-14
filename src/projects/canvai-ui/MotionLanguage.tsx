import { useState, useRef, useCallback } from 'react'
import { ACCENT, SURFACE, BORDER, TEXT, TEXT_SEC, TEXT_TER, FONT } from './tokens'
import { SPRING, useSpring, type SpringConfig } from './spring'

/* ── Shared UI ───────────────────────────────────── */

function SectionLabel({ children }: { children: string }) {
  return <div style={{ fontSize: 11, color: TEXT_TER, marginBottom: 8, textWrap: 'pretty' } as React.CSSProperties}>{children}</div>
}

function Note({ children }: { children: string }) {
  return (
    <div style={{
      fontSize: 10, color: TEXT_TER, fontStyle: 'italic',
      padding: '4px 8px', borderLeft: `2px solid ${BORDER}`, marginTop: 4, textWrap: 'pretty',
    } as React.CSSProperties}>
      {children}
    </div>
  )
}

function PlayButton({ label, onClick, active }: { label: string; onClick: () => void; active?: boolean }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '8px 16px', borderRadius: 8,
        border: active ? `1px solid ${ACCENT}` : `1px solid ${BORDER}`,
        background: active ? 'rgba(232,89,12,0.06)' : hovered ? 'rgba(0,0,0,0.03)' : 'transparent',
        color: active ? ACCENT : TEXT_SEC,
        fontSize: 12, fontWeight: 500, fontFamily: FONT,
        transition: 'all 0.1s ease',
      }}
    >
      {label}
    </button>
  )
}

/* ═══════════════════════════════════════════════════════
   1. Motion Principles
   ═══════════════════════════════════════════════════════ */

export function MotionPrinciples() {
  const [springVisible, setSpringVisible] = useState(true)
  const [cssVisible, setCssVisible] = useState(true)

  // Spring box
  const springRef = useRef<HTMLDivElement>(null)
  const spring = useSpring(SPRING.gentle)

  const toggleSpring = useCallback(() => {
    const next = !springVisible
    setSpringVisible(next)
    spring.set(next ? 1 : 0, (v) => {
      if (springRef.current) {
        springRef.current.style.transform = `scale(${v})`
        springRef.current.style.opacity = `${v}`
      }
    })
  }, [springVisible, spring])

  return (
    <div style={{ fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: 20, padding: 8 }}>
      <div style={{
        fontSize: 13, fontWeight: 600, color: TEXT_TER,
        textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>
        Motion Language
      </div>

      {/* Philosophy */}
      <div style={{
        padding: 16, borderRadius: 8, backgroundColor: '#F9FAFB',
        border: `1px solid ${BORDER}`,
      }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: TEXT, marginBottom: 8, lineHeight: 1.4, textWrap: 'pretty' } as React.CSSProperties}>
          Not animation — motion. Objects have mass, momentum, and friction.
        </div>
        <div style={{ fontSize: 12, color: TEXT_SEC, lineHeight: 1.6, textWrap: 'pretty' } as React.CSSProperties}>
          Rams said "as little design as possible." Matas showed that the little design
          that remains should feel like physics. Every transition has a spring constant.
          Nothing teleports. Nothing floats.
        </div>
      </div>

      {/* Comparison */}
      <div>
        <SectionLabel>Click each to compare — CSS ease-out vs. spring physics</SectionLabel>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          {/* CSS ease */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: TEXT_TER, marginBottom: 8 }}>CSS ease-out</div>
            <div
              onClick={() => setCssVisible(v => !v)}
              style={{
                width: 120, height: 80, borderRadius: 8,
                backgroundColor: BORDER, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', cursor: 'default',
              }}
            >
              <div style={{
                width: 80, height: 48, borderRadius: 6,
                backgroundColor: TEXT_SEC,
                transform: cssVisible ? 'scale(1)' : 'scale(0)',
                opacity: cssVisible ? 1 : 0,
                transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
              }} />
            </div>
            <div style={{ fontSize: 10, color: TEXT_TER, marginTop: 4 }}>Smooth but lifeless</div>
          </div>

          {/* Spring */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: TEXT_TER, marginBottom: 8 }}>Spring physics</div>
            <div
              onClick={toggleSpring}
              style={{
                width: 120, height: 80, borderRadius: 8,
                backgroundColor: 'rgba(232,89,12,0.08)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', cursor: 'default',
              }}
            >
              <div
                ref={springRef}
                style={{
                  width: 80, height: 48, borderRadius: 6,
                  backgroundColor: ACCENT,
                }}
              />
            </div>
            <div style={{ fontSize: 10, color: ACCENT, marginTop: 4, fontWeight: 500 }}>Overshoots, then settles</div>
          </div>
        </div>
      </div>

      {/* Principles list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          ['Mass', 'Heavier elements move slower. A modal has more mass than a tooltip.'],
          ['Momentum', 'Objects in motion stay in motion. Swipe gestures carry velocity.'],
          ['Friction', 'Everything decelerates naturally. Nothing stops abruptly.'],
          ['Restraint', 'If it doesn\'t help the user, it doesn\'t move.'],
        ].map(([title, desc]) => (
          <div key={title} style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: TEXT, minWidth: 80 }}>{title}</span>
            <span style={{ fontSize: 12, color: TEXT_SEC, textWrap: 'pretty' } as React.CSSProperties}>{desc}</span>
          </div>
        ))}
      </div>

      <Note>Spring config: tension (stiffness), friction (damping), mass. No duration — motion is emergent from physics.</Note>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   2. Reveal & Dismiss
   ═══════════════════════════════════════════════════════ */

function SpringCard({ index, config, label }: { index: number; config: SpringConfig; label: string }) {
  const [visible, setVisible] = useState(true)
  const ref = useRef<HTMLDivElement>(null)
  const spring = useSpring(config)

  const toggle = useCallback(() => {
    const next = !visible
    setVisible(next)
    spring.set(next ? 1 : 0, (v) => {
      if (ref.current) {
        ref.current.style.transform = `scale(${0.8 + v * 0.2}) translateY(${(1 - v) * 12}px)`
        ref.current.style.opacity = `${Math.max(0, v)}`
      }
    })
  }, [visible, spring])

  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          width: 100, height: 72, borderRadius: 8,
          backgroundColor: SURFACE, border: `1px solid ${BORDER}`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'default', marginBottom: 4, overflow: 'hidden',
        }}
        onClick={toggle}
      >
        <div
          ref={ref}
          style={{
            width: 64, height: 40, borderRadius: 6,
            backgroundColor: index === 0 ? ACCENT : index === 1 ? '#6366F1' : '#0EA5E9',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 600, color: '#fff',
          }}
        >
          {visible ? 'tap' : '...'}
        </div>
      </div>
      <div style={{ fontSize: 10, color: TEXT_TER }}>{label}</div>
    </div>
  )
}

export function MotionReveals() {
  const [panelOpen, setPanelOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const panelSpring = useSpring(SPRING.gentle)

  const togglePanel = useCallback(() => {
    const next = !panelOpen
    setPanelOpen(next)
    panelSpring.set(next ? 0 : -1, (v) => {
      if (panelRef.current) {
        panelRef.current.style.transform = `translateX(${v * 100}%)`
        panelRef.current.style.opacity = `${1 + v}`
      }
    })
  }, [panelOpen, panelSpring])

  // Dropdown
  const [dropOpen, setDropOpen] = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)
  const dropSpring = useSpring(SPRING.snappy)

  const toggleDrop = useCallback(() => {
    const next = !dropOpen
    setDropOpen(next)
    dropSpring.set(next ? 1 : 0, (v) => {
      if (dropRef.current) {
        dropRef.current.style.transform = `scaleY(${v}) translateY(${(1 - v) * -4}px)`
        dropRef.current.style.opacity = `${Math.max(0, v)}`
      }
    })
  }, [dropOpen, dropSpring])

  return (
    <div style={{ fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: 20, padding: 8 }}>
      <div style={{
        fontSize: 13, fontWeight: 600, color: TEXT_TER,
        textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>
        Reveal & Dismiss
      </div>

      {/* Spring presets */}
      <div>
        <SectionLabel>Spring presets — click each card to toggle</SectionLabel>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <SpringCard index={0} config={SPRING.snappy} label="Snappy (233/19)" />
          <SpringCard index={1} config={SPRING.gentle} label="Gentle (144/15)" />
          <SpringCard index={2} config={SPRING.soft} label="Soft (89/12)" />
        </div>
        <Note>Tension/friction — no duration. The motion emerges from the physics.</Note>
      </div>

      {/* Panel slide */}
      <div>
        <SectionLabel>Panel reveal — slides from left with spring overshoot</SectionLabel>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <PlayButton label={panelOpen ? 'Dismiss' : 'Reveal'} onClick={togglePanel} active={panelOpen} />
          <div style={{
            width: 200, height: 100, borderRadius: 8,
            backgroundColor: '#F9FAFB', border: `1px solid ${BORDER}`,
            overflow: 'hidden', position: 'relative',
          }}>
            <div
              ref={panelRef}
              style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: 80,
                backgroundColor: SURFACE, borderRight: `1px solid ${BORDER}`,
                display: 'flex', flexDirection: 'column', padding: 8, gap: 4,
                transform: 'translateX(-100%)',
                opacity: 0,
              }}
            >
              {['V3', 'V2', 'V1'].map(v => (
                <div key={v} style={{
                  fontSize: 10, padding: '4px 8px', borderRadius: 4,
                  backgroundColor: v === 'V3' ? 'rgba(0,0,0,0.04)' : 'transparent',
                  color: v === 'V3' ? TEXT : TEXT_TER, fontWeight: v === 'V3' ? 600 : 400,
                }}>{v}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dropdown */}
      <div>
        <SectionLabel>Dropdown — scaleY spring from anchor point</SectionLabel>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <PlayButton label={dropOpen ? 'Close' : 'Open'} onClick={toggleDrop} active={dropOpen} />
          <div
            ref={dropRef}
            style={{
              position: 'absolute', top: '100%', left: 0, marginTop: 4,
              width: 160, background: SURFACE, borderRadius: 8,
              border: `1px solid ${BORDER}`,
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              padding: 4, transformOrigin: 'top left',
              transform: 'scaleY(0)',
              opacity: 0,
            }}
          >
            {['Option A', 'Option B', 'Option C'].map(opt => (
              <div key={opt} style={{
                padding: '6px 10px', borderRadius: 4,
                fontSize: 12, color: TEXT,
              }}>{opt}</div>
            ))}
          </div>
        </div>
      </div>

      <Note>All reveals use the same spring engine — only tension/friction change. Dismiss is the reverse with slightly higher friction for a controlled exit.</Note>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   3. Micro-interactions
   ═══════════════════════════════════════════════════════ */

export function MotionMicroInteractions() {
  // Button spring
  const btnRef = useRef<HTMLButtonElement>(null)
  const btnSpring = useSpring(SPRING.snappy)

  const handlePress = useCallback(() => {
    btnSpring.state.value = 0.92
    btnSpring.state.velocity = -2
    btnSpring.set(1, (v) => {
      if (btnRef.current) {
        btnRef.current.style.transform = `scale(${v})`
      }
    })
  }, [btnSpring])

  // Toast
  const [toastVisible, setToastVisible] = useState(false)
  const toastRef = useRef<HTMLDivElement>(null)
  const toastSpring = useSpring(SPRING.gentle)

  const showToast = useCallback(() => {
    setToastVisible(true)
    toastSpring.set(1, (v) => {
      if (toastRef.current) {
        toastRef.current.style.transform = `translateY(${(1 - v) * 20}px)`
        toastRef.current.style.opacity = `${Math.max(0, v)}`
      }
    })
    setTimeout(() => {
      toastSpring.set(0, (v) => {
        if (toastRef.current) {
          toastRef.current.style.transform = `translateY(${(1 - v) * 20}px)`
          toastRef.current.style.opacity = `${Math.max(0, v)}`
        }
        if (v <= 0.01) setToastVisible(false)
      })
    }, 2000)
  }, [toastSpring])

  // Accordion
  const [expanded, setExpanded] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const accordionSpring = useSpring(SPRING.gentle)

  const toggleAccordion = useCallback(() => {
    const next = !expanded
    setExpanded(next)
    accordionSpring.set(next ? 1 : 0, (v) => {
      if (contentRef.current) {
        contentRef.current.style.height = `${v * 64}px`
        contentRef.current.style.opacity = `${v}`
      }
    })
  }, [expanded, accordionSpring])

  return (
    <div style={{ fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: 20, padding: 8 }}>
      <div style={{
        fontSize: 13, fontWeight: 600, color: TEXT_TER,
        textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>
        Micro-interactions
      </div>

      {/* Button press */}
      <div>
        <SectionLabel>Button press — spring squish and bounce-back</SectionLabel>
        <button
          ref={btnRef}
          onPointerDown={handlePress}
          style={{
            padding: '10px 24px', borderRadius: 8, border: 'none',
            backgroundColor: ACCENT, color: '#fff',
            fontSize: 13, fontWeight: 500, fontFamily: FONT,
            cursor: 'default',
          }}
        >
          Press me
        </button>
        <Note>No duration or easing — the spring resolves naturally. Feels like pressing a physical button.</Note>
      </div>

      {/* Toast */}
      <div>
        <SectionLabel>Toast — springs up, auto-dismisses with fade</SectionLabel>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <PlayButton label="Show toast" onClick={showToast} />
          <div style={{
            width: 200, height: 48, position: 'relative',
            borderRadius: 8, backgroundColor: '#F9FAFB', border: `1px solid ${BORDER}`,
            overflow: 'hidden',
          }}>
            {toastVisible && (
              <div
                ref={toastRef}
                style={{
                  position: 'absolute', bottom: 8, left: '50%', marginLeft: -72,
                  padding: '6px 16px', borderRadius: 16,
                  backgroundColor: TEXT, color: '#fff',
                  fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap',
                  transform: 'translateY(20px)',
                  opacity: 0,
                }}
              >
                Change applied
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Accordion */}
      <div>
        <SectionLabel>Expand / collapse — height animates via spring</SectionLabel>
        <div style={{
          width: 240, borderRadius: 8,
          border: `1px solid ${BORDER}`, overflow: 'hidden',
        }}>
          <button
            onClick={toggleAccordion}
            style={{
              width: '100%', padding: '10px 12px', border: 'none',
              backgroundColor: SURFACE, display: 'flex',
              alignItems: 'center', justifyContent: 'space-between',
              fontSize: 12, fontWeight: 500, color: TEXT, fontFamily: FONT,
            }}
          >
            Details
            <span style={{
              transition: 'transform 0.2s ease',
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              fontSize: 10, color: TEXT_TER,
            }}>▼</span>
          </button>
          <div
            ref={contentRef}
            style={{
              height: 0, opacity: 0, overflow: 'hidden',
              borderTop: `1px solid ${BORDER}`,
            }}
          >
            <div style={{
              padding: 12, fontSize: 12, color: TEXT_SEC,
              lineHeight: 1.5, textWrap: 'pretty',
            } as React.CSSProperties}>
              Spring-driven height. No fixed duration — the content reveals at the speed the physics dictate.
            </div>
          </div>
        </div>
      </div>

      {/* Spring configs table */}
      <div>
        <SectionLabel>Canvai spring presets</SectionLabel>
        <div style={{
          borderRadius: 8, border: `1px solid ${BORDER}`, overflow: 'hidden',
          fontSize: 11,
        }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '80px 60px 60px 1fr',
            padding: '6px 12px', backgroundColor: '#F9FAFB',
            fontWeight: 600, color: TEXT_SEC, borderBottom: `1px solid ${BORDER}`,
          }}>
            <span>Preset</span><span>Tension</span><span>Friction</span><span>Use for</span>
          </div>
          {[
            ['snappy', '233', '19', 'Buttons, toggles, micro-feedback'],
            ['gentle', '144', '15', 'Cards, panels, modals'],
            ['soft', '89', '12', 'Tooltips, toasts, page transitions'],
          ].map(([name, t, f, use]) => (
            <div key={name} style={{
              display: 'grid', gridTemplateColumns: '80px 60px 60px 1fr',
              padding: '6px 12px', borderBottom: `1px solid ${BORDER}`,
              color: TEXT,
            }}>
              <span style={{ fontWeight: 500, color: ACCENT }}>{name}</span>
              <span>{t}</span>
              <span>{f}</span>
              <span style={{ color: TEXT_SEC, textWrap: 'pretty' } as React.CSSProperties}>{use}</span>
            </div>
          ))}
        </div>
      </div>

      <Note>Production: use a spring library (react-spring, framer-motion). CSS transitions are for prototyping only — they can't express true overshoot.</Note>
    </div>
  )
}
