import { useState } from 'react'

export function Input({ label, placeholder, value, onChange, type = 'text' }: {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (v: string) => void
  type?: string
}) {
  const [focused, setFocused] = useState(false)
  const [internal, setInternal] = useState(value ?? '')
  const val = value ?? internal
  const set = onChange ?? setInternal

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && (
        <label style={{
          fontSize: 12, fontWeight: 500, color: 'var(--text-primary)',
        }}>{label}</label>
      )}
      <input
        type={type}
        value={val}
        onChange={(e) => set(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        style={{
          padding: 'var(--space-2) var(--space-3)',
          fontSize: 13,
          fontFamily: 'inherit',
          border: `1px solid ${focused ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--surface)',
          color: 'var(--text-primary)',
          outline: 'none',
        }}
      />
    </div>
  )
}
