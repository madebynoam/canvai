import { useState, useRef, useEffect, useCallback } from 'react'
import { Check, ChevronDown, Search, Eye, EyeOff, X } from 'lucide-react'
import { ACCENT, ACCENT_HOVER, SURFACE, BORDER, TEXT, TEXT_SEC, TEXT_TER, FONT, DANGER } from './tokens'
import { SPRING, useSpring } from './spring'

/* ── Shared UI ────────────────────────────────────── */

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

/* =================================================================
   Export 1: ComponentButtons
   ================================================================= */

function SpringButton({ label, style: extraStyle }: { label: string; style: React.CSSProperties }) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const spring = useSpring(SPRING.snappy)
  const [hovered, setHovered] = useState(false)

  const handlePress = useCallback(() => {
    spring.state.value = 0.92
    spring.state.velocity = -2
    spring.set(1, (v) => {
      if (btnRef.current) {
        btnRef.current.style.transform = `scale(${v})`
      }
    })
  }, [spring])

  return (
    <button
      ref={btnRef}
      onPointerDown={handlePress}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '8px 20px', fontSize: 13, fontWeight: 500, fontFamily: FONT,
        borderRadius: 8, cursor: 'default', outline: 'none',
        ...extraStyle,
        ...(hovered && extraStyle.backgroundColor === ACCENT ? { backgroundColor: ACCENT_HOVER } : {}),
      }}
    >
      {label}
    </button>
  )
}

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn)
  const thumbRef = useRef<HTMLDivElement>(null)
  const spring = useSpring(SPRING.snappy)

  const toggle = useCallback(() => {
    const next = !on
    setOn(next)
    spring.set(next ? 1 : 0, (v) => {
      if (thumbRef.current) {
        thumbRef.current.style.transform = `translateX(${v * 20}px)`
      }
    })
  }, [on, spring])

  // Set initial position
  useEffect(() => {
    if (thumbRef.current) {
      thumbRef.current.style.transform = `translateX(${on ? 20 : 0}px)`
    }
  }, [])

  return (
    <div
      onClick={toggle}
      style={{
        width: 40, height: 20, borderRadius: 10, cursor: 'default',
        backgroundColor: on ? ACCENT : '#D1D5DB',
        padding: 2, display: 'flex', alignItems: 'center',
      }}
    >
      <div
        ref={thumbRef}
        style={{
          width: 16, height: 16, borderRadius: 8,
          backgroundColor: SURFACE,
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        }}
      />
    </div>
  )
}

function Checkbox({ defaultChecked = false, label }: { defaultChecked?: boolean; label: string }) {
  const [checked, setChecked] = useState(defaultChecked)
  const boxRef = useRef<HTMLDivElement>(null)
  const spring = useSpring(SPRING.snappy)

  const toggle = useCallback(() => {
    const next = !checked
    setChecked(next)
    spring.state.value = next ? 0.6 : 1.2
    spring.state.velocity = next ? 4 : -4
    spring.set(1, (v) => {
      if (boxRef.current) {
        boxRef.current.style.transform = `scale(${v})`
      }
    })
  }, [checked, spring])

  return (
    <div onClick={toggle} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'default' }}>
      <div
        ref={boxRef}
        style={{
          width: 16, height: 16, borderRadius: 4, flexShrink: 0,
          border: checked ? 'none' : `1.5px solid ${BORDER}`,
          backgroundColor: checked ? ACCENT : SURFACE,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {checked && <Check size={11} color="#fff" strokeWidth={2.5} />}
      </div>
      <span style={{ fontSize: 12, color: TEXT, textWrap: 'pretty' } as React.CSSProperties}>{label}</span>
    </div>
  )
}

function DestructiveButton() {
  const btnRef = useRef<HTMLButtonElement>(null)
  const spring = useSpring(SPRING.snappy)
  const [hovered, setHovered] = useState(false)

  const handlePress = useCallback(() => {
    spring.state.value = 0.92
    spring.state.velocity = -2
    spring.set(1, (v) => {
      if (btnRef.current) {
        btnRef.current.style.transform = `scale(${v})`
      }
    })
  }, [spring])

  return (
    <button
      ref={btnRef}
      onPointerDown={handlePress}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '8px 20px', fontSize: 13, fontWeight: 500, fontFamily: FONT,
        borderRadius: 8, cursor: 'default', outline: 'none',
        border: `1px solid ${hovered ? DANGER : BORDER}`,
        backgroundColor: hovered ? 'rgba(220,38,38,0.06)' : 'transparent',
        color: hovered ? DANGER : TEXT_SEC,
      }}
    >
      Delete
    </button>
  )
}

export function ComponentButtons() {
  return (
    <div style={{ fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: 20, padding: 8 }}>
      <div style={{
        fontSize: 13, fontWeight: 600, color: TEXT_TER,
        textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>
        Buttons & Controls
      </div>

      {/* Buttons */}
      <div>
        <SectionLabel>Button variants -- spring press on each</SectionLabel>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <SpringButton
            label="Primary"
            style={{ backgroundColor: ACCENT, color: '#fff', border: 'none' }}
          />
          <SpringButton
            label="Secondary"
            style={{ backgroundColor: 'transparent', color: TEXT, border: `1px solid ${BORDER}` }}
          />
          <SpringButton
            label="Ghost"
            style={{ backgroundColor: 'transparent', color: TEXT_SEC, border: 'none' }}
          />
          <DestructiveButton />
        </div>
        <Note>Every button uses spring physics for press feedback. Scale to 0.92 with velocity, then spring back to 1. No CSS transition durations.</Note>
      </div>

      {/* Toggles */}
      <div>
        <SectionLabel>Toggle switches -- pill slides with spring</SectionLabel>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Toggle defaultOn={false} />
            <span style={{ fontSize: 12, color: TEXT_SEC }}>Autosave</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Toggle defaultOn={true} />
            <span style={{ fontSize: 12, color: TEXT_SEC }}>Watch mode</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Toggle defaultOn={false} />
            <span style={{ fontSize: 12, color: TEXT_SEC }}>Dark mode</span>
          </div>
        </div>
        <Note>Track: 40x20 rounded pill, gray off, accent on. Thumb: 16x16 circle, slides with spring physics.</Note>
      </div>

      {/* Checkboxes */}
      <div>
        <SectionLabel>Checkboxes -- spring scale on check/uncheck</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Checkbox defaultChecked={true} label="Export annotations" />
          <Checkbox defaultChecked={false} label="Include source maps" />
          <Checkbox defaultChecked={true} label="Minify output" />
        </div>
        <Note>16x16 rounded square. Border when unchecked, accent fill with white check icon when checked. Spring scale animates the state change.</Note>
      </div>
    </div>
  )
}

/* =================================================================
   Export 2: ComponentInputs
   ================================================================= */

function TextInput({ label, placeholder }: { label: string; placeholder: string }) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 11, fontWeight: 500, color: TEXT_SEC, textWrap: 'pretty' } as React.CSSProperties}>{label}</label>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        style={{
          padding: '8px 12px', fontSize: 13, fontFamily: FONT,
          borderRadius: 8, outline: 'none',
          border: `1px solid ${focused ? ACCENT : BORDER}`,
          backgroundColor: '#F9FAFB',
          color: TEXT,
          boxShadow: focused ? `0 0 0 2px rgba(232,89,12,0.12)` : 'none',
          textWrap: 'pretty',
        } as React.CSSProperties}
      />
    </div>
  )
}

function SearchInput() {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const clearRef = useRef<HTMLButtonElement>(null)
  const clearSpring = useSpring(SPRING.snappy)

  const handleClear = useCallback(() => {
    clearSpring.state.value = 0.92
    clearSpring.state.velocity = -2
    clearSpring.set(1, (v) => {
      if (clearRef.current) {
        clearRef.current.style.transform = `scale(${v})`
      }
    })
    setValue('')
  }, [clearSpring])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 11, fontWeight: 500, color: TEXT_SEC }}>Search</label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <Search size={14} color={TEXT_TER} style={{ position: 'absolute', left: 10, pointerEvents: 'none' }} />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search components..."
          style={{
            padding: '8px 32px 8px 32px', fontSize: 13, fontFamily: FONT,
            borderRadius: 8, outline: 'none', width: '100%',
            border: `1px solid ${focused ? ACCENT : BORDER}`,
            backgroundColor: '#F9FAFB',
            color: TEXT,
            boxShadow: focused ? `0 0 0 2px rgba(232,89,12,0.12)` : 'none',
          }}
        />
        {value && (
          <button
            ref={clearRef}
            onClick={handleClear}
            style={{
              position: 'absolute', right: 8, background: 'none', border: 'none',
              cursor: 'default', padding: 2, display: 'flex', alignItems: 'center',
              justifyContent: 'center', borderRadius: 4,
            }}
          >
            <X size={14} color={TEXT_TER} />
          </button>
        )}
      </div>
    </div>
  )
}

function TextareaInput() {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const maxChars = 280

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 11, fontWeight: 500, color: TEXT_SEC }}>Description</label>
      <div style={{ position: 'relative' }}>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value.slice(0, maxChars))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Describe the component..."
          style={{
            padding: '8px 12px', fontSize: 13, fontFamily: FONT,
            borderRadius: 8, outline: 'none', width: '100%',
            border: `1px solid ${focused ? ACCENT : BORDER}`,
            backgroundColor: '#F9FAFB',
            color: TEXT,
            boxShadow: focused ? `0 0 0 2px rgba(232,89,12,0.12)` : 'none',
            minHeight: 80, resize: 'vertical',
            boxSizing: 'border-box',
            textWrap: 'pretty',
          } as React.CSSProperties}
        />
        <div style={{
          position: 'absolute', bottom: 8, right: 12,
          fontSize: 10, color: value.length > maxChars * 0.9 ? ACCENT : TEXT_TER,
          fontVariantNumeric: 'tabular-nums',
        }}>
          {value.length}/{maxChars}
        </div>
      </div>
    </div>
  )
}

function PasswordInput() {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const [visible, setVisible] = useState(false)
  const eyeRef = useRef<HTMLButtonElement>(null)
  const eyeSpring = useSpring(SPRING.snappy)

  const toggleVisibility = useCallback(() => {
    setVisible(v => !v)
    eyeSpring.state.value = 0.92
    eyeSpring.state.velocity = -2
    eyeSpring.set(1, (v) => {
      if (eyeRef.current) {
        eyeRef.current.style.transform = `scale(${v})`
      }
    })
  }, [eyeSpring])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 11, fontWeight: 500, color: TEXT_SEC }}>Password</label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Enter password..."
          style={{
            padding: '8px 36px 8px 12px', fontSize: 13, fontFamily: FONT,
            borderRadius: 8, outline: 'none', width: '100%',
            border: `1px solid ${focused ? ACCENT : BORDER}`,
            backgroundColor: '#F9FAFB',
            color: TEXT,
            boxShadow: focused ? `0 0 0 2px rgba(232,89,12,0.12)` : 'none',
          }}
        />
        <button
          ref={eyeRef}
          onClick={toggleVisibility}
          style={{
            position: 'absolute', right: 8, background: 'none', border: 'none',
            cursor: 'default', padding: 2, display: 'flex', alignItems: 'center',
            justifyContent: 'center', borderRadius: 4,
          }}
        >
          {visible ? <EyeOff size={14} color={TEXT_TER} /> : <Eye size={14} color={TEXT_TER} />}
        </button>
      </div>
    </div>
  )
}

export function ComponentInputs() {
  return (
    <div style={{ fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: 20, padding: 8, maxWidth: 360 }}>
      <div style={{
        fontSize: 13, fontWeight: 600, color: TEXT_TER,
        textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>
        Inputs & Fields
      </div>

      {/* Text input */}
      <div>
        <SectionLabel>Text input -- idle, focused, filled states</SectionLabel>
        <TextInput label="Component name" placeholder="e.g. TopBar" />
        <Note>Idle: border gray, bg subtle. Focused: border accent with ring shadow. All actually typeable.</Note>
      </div>

      {/* Search input */}
      <div>
        <SectionLabel>Search input -- with icon and clear button</SectionLabel>
        <SearchInput />
        <Note>Search icon on left, clear X on right when value present. Clear button has spring press feedback.</Note>
      </div>

      {/* Textarea */}
      <div>
        <SectionLabel>Textarea -- multiline with character count</SectionLabel>
        <TextareaInput />
        <Note>Same styling as input but taller, resize vertical. Character count in bottom-right turns accent near limit.</Note>
      </div>

      {/* Password */}
      <div>
        <SectionLabel>Password -- with visibility toggle</SectionLabel>
        <PasswordInput />
        <Note>Dots when hidden, plain text when revealed. Eye icon toggles with spring press animation.</Note>
      </div>
    </div>
  )
}

/* =================================================================
   Export 3: ComponentMenus
   ================================================================= */

function Dropdown() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState('Option A')
  const menuRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const spring = useSpring(SPRING.snappy)

  const options = ['Option A', 'Option B', 'Option C', 'Option D']

  const toggleOpen = useCallback(() => {
    const next = !open
    setOpen(next)
    spring.set(next ? 1 : 0, (v) => {
      if (menuRef.current) {
        menuRef.current.style.transform = `scaleY(${Math.max(0, v)})`
        menuRef.current.style.opacity = `${Math.max(0, v)}`
      }
    })
  }, [open, spring])

  const selectOption = useCallback((opt: string) => {
    setSelected(opt)
    setOpen(false)
    spring.set(0, (v) => {
      if (menuRef.current) {
        menuRef.current.style.transform = `scaleY(${Math.max(0, v)})`
        menuRef.current.style.opacity = `${Math.max(0, v)}`
      }
    })
  }, [spring])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        spring.set(0, (v) => {
          if (menuRef.current) {
            menuRef.current.style.transform = `scaleY(${Math.max(0, v)})`
            menuRef.current.style.opacity = `${Math.max(0, v)}`
          }
        })
      }
    }
    document.addEventListener('pointerdown', handleClick)
    return () => document.removeEventListener('pointerdown', handleClick)
  }, [open, spring])

  const triggerRef = useRef<HTMLButtonElement>(null)
  const triggerSpring = useSpring(SPRING.snappy)

  const handleTriggerPress = useCallback(() => {
    triggerSpring.state.value = 0.92
    triggerSpring.state.velocity = -2
    triggerSpring.set(1, (v) => {
      if (triggerRef.current) {
        triggerRef.current.style.transform = `scale(${v})`
      }
    })
    toggleOpen()
  }, [triggerSpring, toggleOpen])

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        ref={triggerRef}
        onPointerDown={handleTriggerPress}
        style={{
          padding: '8px 16px', fontSize: 13, fontWeight: 500, fontFamily: FONT,
          borderRadius: 8, border: `1px solid ${BORDER}`,
          backgroundColor: SURFACE, color: TEXT,
          display: 'flex', alignItems: 'center', gap: 8,
          cursor: 'default', outline: 'none',
        }}
      >
        {selected}
        <ChevronDown
          size={14} color={TEXT_TER}
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.15s ease',
          }}
        />
      </button>
      <div
        ref={menuRef}
        style={{
          position: 'absolute', top: '100%', left: 0, marginTop: 4,
          width: 180, backgroundColor: SURFACE, borderRadius: 8,
          border: `1px solid ${BORDER}`,
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          padding: 4, transformOrigin: 'top left',
          transform: 'scaleY(0)', opacity: 0,
          zIndex: 10,
        }}
      >
        {options.map(opt => (
          <DropdownOption
            key={opt}
            label={opt}
            selected={opt === selected}
            onClick={() => selectOption(opt)}
          />
        ))}
      </div>
    </div>
  )
}

function DropdownOption({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '6px 10px', borderRadius: 4, cursor: 'default',
        fontSize: 12, color: TEXT, fontFamily: FONT,
        backgroundColor: hovered ? '#F3F4F6' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}
    >
      {label}
      {selected && <Check size={13} color={ACCENT} strokeWidth={2.5} />}
    </div>
  )
}

function StatusPills() {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      <span style={{
        fontSize: 11, fontWeight: 500, color: '#C2410C',
        backgroundColor: '#FFF7ED', padding: '4px 12px', borderRadius: 12,
        display: 'inline-flex', alignItems: 'center', gap: 5,
      }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#EA580C' }} />
        Pending
      </span>
      <span style={{
        fontSize: 11, fontWeight: 500, color: '#059669',
        backgroundColor: '#F0FDF4', padding: '4px 12px', borderRadius: 12,
        display: 'inline-flex', alignItems: 'center', gap: 5,
      }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#10B981' }} />
        Resolved
      </span>
      <span style={{
        fontSize: 11, fontWeight: 500, color: TEXT_SEC,
        backgroundColor: '#F3F4F6', padding: '4px 12px', borderRadius: 12,
        display: 'inline-flex', alignItems: 'center', gap: 5,
      }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: TEXT_TER }} />
        Draft
      </span>
    </div>
  )
}

function CountBadges() {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      {[3, 12, 1].map((count, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            minWidth: 16, height: 16, borderRadius: 8, backgroundColor: ACCENT,
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 9, fontWeight: 600, padding: '0 4px',
          }}>
            {count}
          </div>
          <span style={{ fontSize: 11, color: TEXT_SEC }}>
            {i === 0 ? 'annotations' : i === 1 ? 'frames' : 'update'}
          </span>
        </div>
      ))}
    </div>
  )
}

function TooltipDemo() {
  const [hovered, setHovered] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const spring = useSpring(SPRING.soft)
  const btnRef = useRef<HTMLButtonElement>(null)
  const btnSpring = useSpring(SPRING.snappy)

  const showTooltip = useCallback(() => {
    setHovered(true)
    spring.set(1, (v) => {
      if (tooltipRef.current) {
        tooltipRef.current.style.transform = `scale(${0.9 + v * 0.1}) translateY(${(1 - v) * 4}px)`
        tooltipRef.current.style.opacity = `${Math.max(0, v)}`
      }
    })
  }, [spring])

  const hideTooltip = useCallback(() => {
    spring.set(0, (v) => {
      if (tooltipRef.current) {
        tooltipRef.current.style.transform = `scale(${0.9 + v * 0.1}) translateY(${(1 - v) * 4}px)`
        tooltipRef.current.style.opacity = `${Math.max(0, v)}`
      }
      if (Math.abs(v) < 0.01) setHovered(false)
    })
  }, [spring])

  const handlePress = useCallback(() => {
    btnSpring.state.value = 0.92
    btnSpring.state.velocity = -2
    btnSpring.set(1, (v) => {
      if (btnRef.current) {
        btnRef.current.style.transform = `scale(${v})`
      }
    })
  }, [btnSpring])

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        ref={btnRef}
        onPointerDown={handlePress}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        style={{
          padding: '8px 16px', fontSize: 13, fontWeight: 500, fontFamily: FONT,
          borderRadius: 8, border: `1px solid ${BORDER}`,
          backgroundColor: SURFACE, color: TEXT,
          cursor: 'default', outline: 'none',
        }}
      >
        Hover me
      </button>
      {hovered && (
        <div
          ref={tooltipRef}
          style={{
            position: 'absolute', bottom: '100%', left: '50%', marginLeft: -60,
            marginBottom: 8, padding: '6px 12px', borderRadius: 6,
            backgroundColor: TEXT, color: '#fff',
            fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap',
            transform: 'scale(0.9) translateY(4px)', opacity: 0,
            pointerEvents: 'none',
          }}
        >
          Spring tooltip with soft config
        </div>
      )}
    </div>
  )
}

export function ComponentMenus() {
  return (
    <div style={{ fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: 20, padding: 8 }}>
      <div style={{
        fontSize: 13, fontWeight: 600, color: TEXT_TER,
        textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>
        Menus & Indicators
      </div>

      {/* Dropdown */}
      <div>
        <SectionLabel>Dropdown select -- springs open with scaleY from top</SectionLabel>
        <Dropdown />
        <Note>Trigger has spring press. Menu springs open with snappy config. Click outside to close. Check icon marks selected option.</Note>
      </div>

      {/* Status pills */}
      <div>
        <SectionLabel>Status pills -- semantic color coding</SectionLabel>
        <StatusPills />
        <Note>Muted background with matching text color. Dot indicator reinforces status. Rounded pill shape for scannability.</Note>
      </div>

      {/* Count badges */}
      <div>
        <SectionLabel>Count badges -- compact numeric indicators</SectionLabel>
        <CountBadges />
        <Note>16px minimum height circle, accent background, white text. Pill-shaped to accommodate multi-digit numbers.</Note>
      </div>

      {/* Tooltip */}
      <div style={{ paddingBottom: 48 }}>
        <SectionLabel>Tooltip -- springs in with soft config on hover</SectionLabel>
        <TooltipDemo />
        <Note>Dark bg, white text, fontSize 11. Springs from scale 0.9 + translateY with SPRING.soft. No CSS transition -- pure physics.</Note>
      </div>
    </div>
  )
}
