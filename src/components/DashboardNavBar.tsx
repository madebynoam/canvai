import { useState, useRef, useEffect } from 'react'

/* ── Types ── */
interface Site {
  id: string
  name: string
  url: string
  favicon?: string
}

interface User {
  name: string
  email: string
  avatarUrl?: string
}

interface DashboardNavBarProps {
  sites: Site[]
  activeSiteId: string
  user: User
  onSiteChange?: (siteId: string) => void
  onMenuAction?: (action: string) => void
}

/* ── Styles ── */
const styles = {
  bar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    padding: '0 16px',
    background: '#fff',
    borderBottom: '1px solid #e0e0e0',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
    fontSize: 14,
    position: 'relative' as const,
    boxSizing: 'border-box' as const,
    width: '100%',
  },

  /* ── Site picker ── */
  sitePickerBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '6px 12px',
    border: '1px solid #e0e0e0',
    borderRadius: 8,
    background: '#fff',
    cursor: 'pointer',
    fontSize: 14,
    color: '#1e1e1e',
    minWidth: 0,
  },
  favicon: {
    width: 20,
    height: 20,
    borderRadius: 4,
    background: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 600 as const,
    color: '#666',
    flexShrink: 0,
    overflow: 'hidden' as const,
  },
  siteName: {
    overflow: 'hidden' as const,
    textOverflow: 'ellipsis' as const,
    whiteSpace: 'nowrap' as const,
    fontWeight: 500 as const,
  },
  chevron: {
    flexShrink: 0,
    marginLeft: 4,
    color: '#999',
    fontSize: 10,
  },

  /* ── Dropdown shared ── */
  dropdown: {
    position: 'absolute' as const,
    top: '100%',
    marginTop: 4,
    background: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: 10,
    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
    zIndex: 100,
    overflow: 'hidden' as const,
    minWidth: 220,
  },

  /* ── Site list ── */
  siteItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 14px',
    cursor: 'pointer',
    background: 'transparent',
    border: 'none',
    width: '100%',
    textAlign: 'left' as const,
    fontSize: 14,
    color: '#1e1e1e',
  },
  siteItemActive: {
    background: '#f5f5ff',
  },
  siteUrl: {
    fontSize: 12,
    color: '#888',
    marginTop: 1,
  },

  /* ── Profile ── */
  avatar: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    cursor: 'pointer',
    border: '2px solid transparent',
    overflow: 'hidden' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#3858e9',
    color: '#fff',
    fontWeight: 600 as const,
    fontSize: 14,
    flexShrink: 0,
  },
  avatarHover: {
    borderColor: '#3858e9',
  },

  /* ── Profile menu ── */
  profileHeader: {
    padding: '14px 14px 10px',
    borderBottom: '1px solid #f0f0f0',
  },
  profileName: {
    fontWeight: 600 as const,
    fontSize: 14,
    color: '#1e1e1e',
  },
  profileEmail: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 14px',
    cursor: 'pointer',
    background: 'transparent',
    border: 'none',
    width: '100%',
    textAlign: 'left' as const,
    fontSize: 14,
    color: '#1e1e1e',
  },
  menuItemDanger: {
    color: '#d63638',
  },
  menuDivider: {
    height: 1,
    background: '#f0f0f0',
    margin: '4px 0',
  },
  menuIcon: {
    width: 18,
    textAlign: 'center' as const,
    fontSize: 15,
    opacity: 0.7,
  },
} as const

/* ── Helpers ── */
function Chevron({ open }: { open: boolean }) {
  return (
    <span style={styles.chevron}>
      {open ? '▲' : '▼'}
    </span>
  )
}

function FaviconIcon({ site }: { site: Site }) {
  if (site.favicon) {
    return (
      <span style={styles.favicon}>
        <img
          src={site.favicon}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </span>
    )
  }
  return <span style={styles.favicon}>{site.name.charAt(0).toUpperCase()}</span>
}

function useClickOutside(ref: React.RefObject<HTMLElement | null>, onClose: () => void) {
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ref, onClose])
}

/* ── Component ── */
export function DashboardNavBar({
  sites,
  activeSiteId,
  user,
  onSiteChange,
  onMenuAction,
}: DashboardNavBarProps) {
  const [sitePickerOpen, setSitePickerOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  const sitePickerRef = useRef<HTMLDivElement>(null)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  useClickOutside(sitePickerRef, () => setSitePickerOpen(false))
  useClickOutside(profileMenuRef, () => setProfileMenuOpen(false))

  const activeSite = sites.find(s => s.id === activeSiteId) ?? sites[0]

  const menuItems = [
    { icon: '⚙', label: 'Account settings', action: 'settings' },
    { icon: '?', label: 'Help & support', action: 'help' },
    { divider: true },
    { icon: '↪', label: 'Log out', action: 'logout', danger: true },
  ] as const

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <nav style={styles.bar}>
      {/* ── Left: Site Picker ── */}
      <div ref={sitePickerRef} style={{ position: 'relative' }}>
        <button
          style={styles.sitePickerBtn}
          onClick={() => {
            setSitePickerOpen(prev => !prev)
            setProfileMenuOpen(false)
          }}
        >
          <FaviconIcon site={activeSite} />
          <span style={styles.siteName}>{activeSite.name}</span>
          <Chevron open={sitePickerOpen} />
        </button>

        {sitePickerOpen && (
          <div style={{ ...styles.dropdown, left: 0 }}>
            {sites.map(site => (
              <button
                key={site.id}
                style={{
                  ...styles.siteItem,
                  ...(site.id === activeSiteId ? styles.siteItemActive : {}),
                }}
                onMouseEnter={e =>
                  (e.currentTarget.style.background =
                    site.id === activeSiteId ? '#f5f5ff' : '#fafafa')
                }
                onMouseLeave={e =>
                  (e.currentTarget.style.background =
                    site.id === activeSiteId ? '#f5f5ff' : 'transparent')
                }
                onClick={() => {
                  onSiteChange?.(site.id)
                  setSitePickerOpen(false)
                }}
              >
                <FaviconIcon site={site} />
                <div>
                  <div style={{ fontWeight: 500 }}>{site.name}</div>
                  <div style={styles.siteUrl}>{site.url}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Right: Profile Avatar ── */}
      <div ref={profileMenuRef} style={{ position: 'relative' }}>
        <button
          style={{
            ...styles.avatar,
            ...(profileMenuOpen ? styles.avatarHover : {}),
            border: profileMenuOpen ? '2px solid #3858e9' : '2px solid transparent',
            padding: 0,
          }}
          onClick={() => {
            setProfileMenuOpen(prev => !prev)
            setSitePickerOpen(false)
          }}
        >
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
            />
          ) : (
            initials
          )}
        </button>

        {profileMenuOpen && (
          <div style={{ ...styles.dropdown, right: 0 }}>
            <div style={styles.profileHeader}>
              <div style={styles.profileName}>{user.name}</div>
              <div style={styles.profileEmail}>{user.email}</div>
            </div>
            {menuItems.map((item, i) =>
              'divider' in item ? (
                <div key={i} style={styles.menuDivider} />
              ) : (
                <button
                  key={item.action}
                  style={{
                    ...styles.menuItem,
                    ...('danger' in item && item.danger ? styles.menuItemDanger : {}),
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  onClick={() => {
                    onMenuAction?.(item.action)
                    setProfileMenuOpen(false)
                  }}
                >
                  <span style={styles.menuIcon}>{item.icon}</span>
                  {item.label}
                </button>
              ),
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
