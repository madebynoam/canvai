const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
const MONO = 'SF Mono, Monaco, Inconsolata, monospace'
const ACCENT = '#E8590C'
const TEXT = '#1F2937'
const TEXT_SEC = '#6B7280'
const TEXT_TER = '#9CA3AF'
const BORDER = '#E5E7EB'

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 13, fontWeight: 600, color: TEXT_TER,
      textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16,
    }}>
      {children}
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 500, color: TEXT_TER,
      textTransform: 'uppercase', letterSpacing: '0.08em',
      marginBottom: 8,
    }}>
      {children}
    </div>
  )
}

/** Visual 4px spacing scale */
export function SpacingGrid() {
  const steps = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64]

  return (
    <div style={{ fontFamily: FONT, width: 560 }}>
      <SectionTitle>4px Spacing Grid</SectionTitle>

      {/* Visual bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {steps.map(px => (
          <div key={px} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 32, textAlign: 'right',
              fontSize: 11, fontWeight: 600, fontFamily: MONO, color: TEXT,
            }}>
              {px}
            </div>
            <div style={{
              width: px * 4,
              height: 12,
              backgroundColor: ACCENT,
              borderRadius: 2,
              opacity: 0.15 + (px / 64) * 0.85,
            }} />
            <div style={{ fontSize: 11, color: TEXT_TER }}>
              {px === 4 && 'micro gap, pill padding-y'}
              {px === 8 && 'standard gap, control padding'}
              {px === 12 && 'section padding, bar padding-x'}
              {px === 16 && 'card padding, generous gap'}
              {px === 20 && 'icon size, indent'}
              {px === 24 && 'sidebar indent, toggle size'}
              {px === 32 && 'section spacing'}
              {px === 40 && 'bar height, large spacing'}
              {px === 48 && 'panel padding'}
              {px === 64 && 'page margin'}
            </div>
          </div>
        ))}
      </div>

      {/* Forbidden values */}
      <div style={{ marginTop: 24, padding: 12, backgroundColor: '#FEF2F2', borderRadius: 8, border: '1px solid #FECACA' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#991B1B', marginBottom: 4 }}>
          Off-grid (never use)
        </div>
        <div style={{ fontSize: 11, color: '#7F1D1D', fontFamily: MONO }}>
          3, 5, 6, 7, 9, 10, 11, 13, 14, 15, 17, 18, 19, 22, 25, 26, 30...
        </div>
        <div style={{ fontSize: 10, color: '#991B1B', marginTop: 4 }}>
          Font sizes are exempt from the grid.
        </div>
      </div>
    </div>
  )
}

/** Hover, active, and interaction values */
export function InteractionTokens() {
  return (
    <div style={{ fontFamily: FONT, width: 560 }}>
      <SectionTitle>Interaction Tokens</SectionTitle>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Hover / Active swatches */}
        <div>
          <Label>Background States</Label>
          <div style={{ display: 'flex', gap: 16 }}>
            {([
              { label: 'Rest', value: 'transparent', css: 'transparent', border: true },
              { label: 'Hover', value: 'rgba(0,0,0,0.03)', css: 'rgba(0,0,0,0.03)', border: false },
              { label: 'Active', value: 'rgba(0,0,0,0.06)', css: 'rgba(0,0,0,0.06)', border: false },
            ] as const).map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 80, height: 48, borderRadius: 8,
                  backgroundColor: s.value,
                  border: s.border ? `1px dashed ${BORDER}` : `1px solid ${BORDER}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, color: TEXT_SEC,
                }}>
                  Row
                </div>
                <div style={{ fontSize: 11, fontWeight: 500, color: TEXT, marginTop: 8 }}>{s.label}</div>
                <div style={{ fontSize: 10, fontFamily: MONO, color: TEXT_TER, marginTop: 2 }}>{s.css}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Cursor rules */}
        <div>
          <Label>Cursor</Label>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{
              flex: 1, padding: 12, borderRadius: 8,
              backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0',
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#166534', marginBottom: 4 }}>cursor: default</div>
              <div style={{ fontSize: 10, color: '#15803D' }}>All shell UI — buttons, rows, toggles, pills</div>
            </div>
            <div style={{
              flex: 1, padding: 12, borderRadius: 8,
              backgroundColor: '#FEF2F2', border: '1px solid #FECACA',
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#991B1B', marginBottom: 4 }}>cursor: pointer</div>
              <div style={{ fontSize: 10, color: '#7F1D1D' }}>Never in shell. Only inside designer sandboxes.</div>
            </div>
          </div>
        </div>

        {/* Border-radius tiers */}
        <div>
          <Label>Border-Radius Tiers</Label>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
            {([
              { px: 4, label: 'Controls', w: 48, h: 32 },
              { px: 8, label: 'Cards / Dropdowns', w: 64, h: 44 },
              { px: 12, label: 'Pills', w: 72, h: 32 },
              { px: 20, label: 'Toasts', w: 80, h: 36 },
            ] as const).map(t => (
              <div key={t.px} style={{ textAlign: 'center' }}>
                <div style={{
                  width: t.w, height: t.h, borderRadius: t.px,
                  border: `2px solid ${ACCENT}`,
                  backgroundColor: 'rgba(232, 89, 12, 0.06)',
                  margin: '0 auto',
                }} />
                <div style={{ fontSize: 11, fontWeight: 600, color: TEXT, marginTop: 8 }}>{t.px}px</div>
                <div style={{ fontSize: 10, color: TEXT_TER, marginTop: 2 }}>{t.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Rams principles */}
        <div>
          <Label>Rams Principles (Shell)</Label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              'Honest — No decoration. Every element earns its place.',
              'Unobtrusive — The shell disappears; the designer\'s work is the hero.',
              'Thorough — Every detail: spacing, alignment, color, cursor.',
              'As little as possible — Remove until it breaks, then add one thing back.',
            ].map((p, i) => (
              <div key={i} style={{
                fontSize: 11, color: TEXT_SEC, lineHeight: 1.6, textWrap: 'pretty',
                paddingLeft: 12, borderLeft: `2px solid ${i === 0 ? ACCENT : BORDER}`,
              }}>
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
