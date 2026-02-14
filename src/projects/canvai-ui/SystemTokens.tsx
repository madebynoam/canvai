import { useState } from 'react'

import { ACCENT, BORDER, TEXT, TEXT_SEC, TEXT_TER, FONT, MONO } from './tokens'

const pretty = { textWrap: 'pretty' } as React.CSSProperties

/* ─── Palette data ──────────────────────────────────── */

interface ColorToken {
  name: string
  value: string
  usage: string
  light?: boolean
  large?: boolean
}

const palette: { section: string; colors: ColorToken[] }[] = [
  {
    section: 'Accent',
    colors: [
      { name: 'Accent', value: '#E8590C', usage: 'Buttons, highlights, selection', large: true },
      { name: 'Accent hover', value: '#CF4F0B', usage: 'Hover state for accent elements' },
      { name: 'Accent muted', value: 'rgba(232, 89, 12, 0.15)', usage: 'Disabled backgrounds', light: true },
      { name: 'Accent shadow', value: 'rgba(232, 89, 12, 0.25)', usage: 'Box shadows', light: true },
    ],
  },
  {
    section: 'Surface',
    colors: [
      { name: 'Surface', value: '#FFFFFF', usage: 'Cards, popovers', light: true },
      { name: 'Surface subtle', value: '#F9FAFB', usage: 'Input backgrounds', light: true },
      { name: 'Canvas', value: '#F3F4F6', usage: 'Canvas background', light: true },
    ],
  },
  {
    section: 'Text',
    colors: [
      { name: 'Primary', value: '#1F2937', usage: 'Body text' },
      { name: 'Secondary', value: '#6B7280', usage: 'Labels, captions' },
      { name: 'Tertiary', value: '#9CA3AF', usage: 'Hints, metadata', light: true },
    ],
  },
  {
    section: 'Border',
    colors: [
      { name: 'Border', value: '#E5E7EB', usage: 'Borders, dividers', light: true },
      { name: 'Hover', value: 'rgba(0,0,0,0.03)', usage: 'Hover bg', light: true },
      { name: 'Active', value: 'rgba(0,0,0,0.06)', usage: 'Active bg', light: true },
    ],
  },
]

/* ─── Typography data ───────────────────────────────── */

const typeScale = [
  { size: 24, weight: 700, label: 'Display', sample: 'Empty state headings', lineHeight: 1.4 },
  { size: 18, weight: 600, label: 'Heading', sample: 'Section titles and cards', lineHeight: 1.4 },
  { size: 15, weight: 600, label: 'Subheading', sample: 'Grouped content labels', lineHeight: 1.4 },
  { size: 13, weight: 400, label: 'Body', sample: 'The quick brown fox jumps over the lazy dog', lineHeight: 1.5 },
  { size: 13, weight: 600, label: 'Body bold', sample: 'Names, labels, and emphasis', lineHeight: 1.5 },
  { size: 12, weight: 500, label: 'Caption', sample: 'BUTTON TEXT AND PILL LABELS', lineHeight: 1.5 },
  { size: 11, weight: 400, label: 'Meta', sample: '2 min ago  /  12 items  /  Updated today', lineHeight: 1.5 },
  { size: 10, weight: 400, label: 'Micro', sample: 'Annotation markers and fine labels', lineHeight: 1.5 },
  { size: 9, weight: 700, label: 'Tiny', sample: '1  2  3  4  5', lineHeight: 1.5 },
]

/* ─── Swatch component ──────────────────────────────── */

function Swatch({ color, selected, onSelect }: {
  color: ColorToken
  selected: boolean
  onSelect: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const size = color.large ? 32 : 24

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '8px 8px',
        borderRadius: 8,
        backgroundColor: selected ? 'rgba(232, 89, 12, 0.06)' : hovered ? 'rgba(0,0,0,0.02)' : 'transparent',
        cursor: 'default',
        transition: 'background-color 120ms',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
    >
      <div style={{
        width: size,
        height: size,
        borderRadius: 4,
        backgroundColor: color.value,
        border: color.light ? `1px solid ${BORDER}` : 'none',
        flexShrink: 0,
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: TEXT, ...pretty }}>
            {color.name}
          </span>
          <span style={{ fontSize: 10, fontFamily: MONO, color: TEXT_TER }}>
            {color.value}
          </span>
        </div>
        {(hovered || selected) && (
          <div style={{ fontSize: 10, color: TEXT_SEC, marginTop: 2, ...pretty }}>
            {color.usage}
          </div>
        )}
      </div>
      {selected && (
        <div style={{
          width: 6, height: 6, borderRadius: '50%',
          backgroundColor: ACCENT, flexShrink: 0,
        }} />
      )}
    </div>
  )
}

/* ─── TokensPalette ─────────────────────────────────── */

export function TokensPalette() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div style={{ fontFamily: FONT, width: 480 }}>
      <div style={{
        fontSize: 13, fontWeight: 600, color: TEXT_TER,
        textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 20,
      }}>
        Palette
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {palette.map(group => (
          <div key={group.section}>
            <div style={{
              fontSize: 11, fontWeight: 600, color: TEXT,
              marginBottom: 8, paddingLeft: 8, ...pretty,
            }}>
              {group.section}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {group.colors.map(c => (
                <Swatch
                  key={c.name + c.value}
                  color={c}
                  selected={selected === c.name}
                  onSelect={() => setSelected(selected === c.name ? null : c.name)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── TokensTypography ──────────────────────────────── */

export function TokensTypography() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  return (
    <div style={{ fontFamily: FONT, width: 560 }}>
      <div style={{
        fontSize: 13, fontWeight: 600, color: TEXT_TER,
        textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 20,
      }}>
        Typography
      </div>

      {/* Type scale rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {typeScale.map((entry, i) => (
          <div
            key={entry.label}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 16,
              padding: '12px 8px',
              borderBottom: `1px solid ${i < typeScale.length - 1 ? '#F3F4F6' : 'transparent'}`,
              backgroundColor: hoveredIdx === i ? 'rgba(0,0,0,0.02)' : 'transparent',
              borderRadius: hoveredIdx === i ? 4 : 0,
              transition: 'background-color 120ms',
            }}
          >
            {/* Size label */}
            <div style={{
              width: 72, flexShrink: 0,
              display: 'flex', flexDirection: 'column', gap: 2,
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, fontFamily: MONO, color: TEXT }}>
                {entry.size}px
              </div>
              <div style={{ fontSize: 10, fontFamily: MONO, color: TEXT_TER }}>
                w{entry.weight}
              </div>
            </div>

            {/* Sample text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: entry.size,
                fontWeight: entry.weight,
                fontFamily: FONT,
                color: TEXT,
                lineHeight: entry.lineHeight,
                ...pretty,
              }}>
                {entry.sample}
              </div>
              {hoveredIdx === i && (
                <div style={{
                  fontSize: 10, color: TEXT_SEC, marginTop: 4,
                  fontFamily: MONO, ...pretty,
                }}>
                  {entry.label}  /  line-height: {entry.lineHeight}
                </div>
              )}
            </div>

            {/* Label */}
            <div style={{
              fontSize: 11, color: TEXT_TER, flexShrink: 0,
              ...pretty,
            }}>
              {entry.label}
            </div>
          </div>
        ))}
      </div>

      {/* Rules summary */}
      <div style={{
        marginTop: 24, padding: 16,
        backgroundColor: '#F9FAFB', borderRadius: 8, border: `1px solid ${BORDER}`,
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: TEXT_TER, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Rules
        </div>
        {[
          { label: 'Font family', value: 'system-ui stack (-apple-system, BlinkMacSystemFont, Segoe UI)' },
          { label: 'Line-height', value: '1.5 for body (13px and below)  /  1.4 for headings (15px and above)' },
          { label: 'Letter-spacing', value: '0.05em for uppercase labels  /  default for everything else' },
          { label: 'Weight scale', value: '400 regular  /  500 medium  /  600 semibold  /  700 bold' },
        ].map(rule => (
          <div key={rule.label} style={{ display: 'flex', gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: TEXT, flexShrink: 0, width: 96, ...pretty }}>
              {rule.label}
            </span>
            <span style={{ fontSize: 11, color: TEXT_SEC, ...pretty }}>
              {rule.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
