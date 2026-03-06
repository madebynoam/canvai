import { useState, useEffect, createContext, useContext, useCallback, type ReactNode } from 'react'
import { lightTheme, darkTheme } from './tokens'

export type ThemeMode = 'system' | 'light' | 'dark'
export type ResolvedTheme = 'light' | 'dark'

interface ThemeContextValue {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  resolved: ResolvedTheme
  cssVars: Record<string, string>
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'system',
  setMode: () => {},
  resolved: 'light',
  cssVars: lightTheme,
})

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext)
}

interface ThemeProviderProps {
  children: ReactNode
  project: string
  endpoint?: string
}

export function ThemeProvider({ children, project, endpoint = 'http://localhost:4748' }: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>('system')
  const [loaded, setLoaded] = useState(false)

  // Detect system preference
  const [systemPref, setSystemPref] = useState<ResolvedTheme>(() => {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  // Listen for system preference changes
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => setSystemPref(e.matches ? 'dark' : 'light')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Load theme preference from server
  useEffect(() => {
    if (!project) return
    fetch(`${endpoint}/preferences/theme:${project}`)
      .then(r => r.json())
      .then(d => {
        if (d.value && ['system', 'light', 'dark'].includes(d.value)) {
          setModeState(d.value as ThemeMode)
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [project, endpoint])

  // Save theme preference to server
  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode)
    if (!project) return
    fetch(`${endpoint}/preferences/theme:${project}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: newMode }),
    }).catch(() => {})
  }, [project, endpoint])

  const resolved: ResolvedTheme = mode === 'system' ? systemPref : mode
  const cssVars = resolved === 'dark' ? darkTheme : lightTheme

  return (
    <ThemeContext.Provider value={{ mode, setMode, resolved, cssVars }}>
      {children}
    </ThemeContext.Provider>
  )
}
