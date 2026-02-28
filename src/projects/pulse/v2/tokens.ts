export const tokens = {
  colors: {
    // Backgrounds
    bg: '#F8F7F6',
    bgSubtle: '#F3F2F0',
    surface: '#FEFDFB',
    surfaceHover: '#FAF9F7',
    surfaceActive: '#F5F4F2',

    // Sidebar
    sidebar: '#1C1B1A',
    sidebarHover: 'rgba(255, 255, 255, 0.06)',
    sidebarActive: 'rgba(255, 255, 255, 0.10)',
    sidebarText: 'rgba(255, 255, 255, 0.55)',
    sidebarTextActive: 'rgba(255, 255, 255, 0.95)',
    sidebarBorder: 'rgba(255, 255, 255, 0.08)',

    // Text
    text: '#1C1B1A',
    textSecondary: '#6E6D6B',
    textTertiary: '#9C9B99',
    textInverse: '#FEFDFB',

    // Accent
    accent: '#6366F1',
    accentHover: '#5558E8',
    accentMuted: 'rgba(99, 102, 241, 0.10)',
    accentSubtle: 'rgba(99, 102, 241, 0.06)',

    // Semantic
    success: '#10B981',
    successMuted: 'rgba(16, 185, 129, 0.10)',
    warning: '#F59E0B',
    warningMuted: 'rgba(245, 158, 11, 0.10)',
    danger: '#EF4444',
    dangerMuted: 'rgba(239, 68, 68, 0.08)',
    info: '#3B82F6',
    infoMuted: 'rgba(59, 130, 246, 0.10)',

    // Borders
    border: '#E8E7E5',
    borderSubtle: '#F0EFED',
    borderStrong: '#D4D3D1',

    // Chart palette
    chart: ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'],
    chartSecondary: ['rgba(99,102,241,0.20)', 'rgba(139,92,246,0.20)', 'rgba(236,72,153,0.20)', 'rgba(245,158,11,0.20)', 'rgba(16,185,129,0.20)'],
  },

  font: {
    family: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif",
    mono: "'SF Mono', 'Fira Code', 'Fira Mono', Menlo, monospace",
  },

  fontSize: {
    xs: 11,
    sm: 12,
    base: 13,
    md: 14,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  radius: {
    sm: 4,
    md: 6,
    lg: 8,
    xl: 12,
    pill: 100,
  },

  spacing: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
    16: 64,
  },

  shadow: {
    sm: '0 1px 2px rgba(28, 27, 26, 0.04)',
    md: '0 2px 8px rgba(28, 27, 26, 0.06)',
    lg: '0 4px 16px rgba(28, 27, 26, 0.08)',
    card: '0 1px 3px rgba(28, 27, 26, 0.04), 0 0 0 1px rgba(28, 27, 26, 0.03)',
  },

  spring: {
    cubic: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    ease: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  },
} as const
