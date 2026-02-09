import { type CSSProperties } from 'react'

// ---------- Types ----------

type DirectoryStatus = 'not-applied' | 'pending' | 'approved' | 'rejected'
type AvailabilityStatus = 'available' | 'unavailable'

interface DirectoryEntry {
  name: string
  status: DirectoryStatus
  submittedAt?: string
}

interface ExpertiseListingProps {
  state: 'not-applied' | 'pending' | 'approved'
  availability?: AvailabilityStatus
  directories?: DirectoryEntry[]
  profileCompletion?: number
  agencyName?: string
}

// ---------- Styles ----------

const colors = {
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray900: '#111827',
  green50: '#f0fdf4',
  green100: '#dcfce7',
  green500: '#22c55e',
  green600: '#16a34a',
  green700: '#15803d',
  yellow50: '#fefce8',
  yellow100: '#fef9c3',
  yellow500: '#eab308',
  yellow600: '#ca8a04',
  blue50: '#eff6ff',
  blue500: '#3b82f6',
  blue600: '#2563eb',
  red50: '#fef2f2',
  red500: '#ef4444',
  white: '#ffffff',
}

const base: Record<string, CSSProperties> = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    maxWidth: 560,
    padding: 32,
    backgroundColor: colors.white,
    borderRadius: 12,
    color: colors.gray900,
    lineHeight: 1.5,
  },
  h1: {
    fontSize: 22,
    fontWeight: 600,
    margin: 0,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray500,
    margin: 0,
    marginBottom: 28,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: 600,
    color: colors.gray400,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    marginBottom: 12,
  },
  card: {
    border: `1px solid ${colors.gray200}`,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    backgroundColor: colors.white,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    fontSize: 12,
    fontWeight: 500,
    padding: '2px 10px',
    borderRadius: 99,
    display: 'inline-block',
  },
  button: {
    fontSize: 14,
    fontWeight: 500,
    padding: '8px 16px',
    borderRadius: 6,
    border: 'none',
    cursor: 'pointer',
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    border: 'none',
    cursor: 'pointer',
    position: 'relative' as const,
    transition: 'background-color 0.2s',
  },
  toggleDot: {
    width: 18,
    height: 18,
    borderRadius: '50%',
    backgroundColor: colors.white,
    position: 'absolute' as const,
    top: 3,
    transition: 'left 0.2s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.gray100,
    overflow: 'hidden' as const,
    marginTop: 8,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    transition: 'width 0.3s',
  },
  link: {
    fontSize: 13,
    color: colors.blue600,
    textDecoration: 'none',
    cursor: 'pointer',
  },
}

// ---------- Sub-components ----------

function StatusBadge({ status }: { status: DirectoryStatus }) {
  const config: Record<DirectoryStatus, { label: string; bg: string; color: string }> = {
    'not-applied': { label: 'Not applied', bg: colors.gray100, color: colors.gray600 },
    pending: { label: 'Under review', bg: colors.yellow50, color: colors.yellow600 },
    approved: { label: 'Live', bg: colors.green50, color: colors.green700 },
    rejected: { label: 'Not approved', bg: colors.red50, color: colors.red500 },
  }
  const c = config[status]
  return (
    <span style={{ ...base.badge, backgroundColor: c.bg, color: c.color }}>
      {c.label}
    </span>
  )
}

function DirectoryRow({ entry }: { entry: DirectoryEntry }) {
  return (
    <div style={{ ...base.row, padding: '10px 0', borderBottom: `1px solid ${colors.gray100}` }}>
      <span style={{ fontSize: 14, fontWeight: 500 }}>{entry.name}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <StatusBadge status={entry.status} />
        {entry.status === 'pending' && (
          <span style={{ fontSize: 12, color: colors.gray400 }}>
            Submitted {entry.submittedAt}
          </span>
        )}
      </div>
    </div>
  )
}

function AvailabilityToggle({ available }: { available: boolean }) {
  return (
    <div style={{ ...base.card, ...base.row }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 500 }}>
          {available ? 'Available for new clients' : 'Not taking new clients'}
        </div>
        <div style={{ fontSize: 13, color: colors.gray500, marginTop: 2 }}>
          {available
            ? 'Your listing is active — clients can contact you.'
            : 'Your listing is paused — you won\'t appear in search results.'}
        </div>
      </div>
      <button
        style={{
          ...base.toggle,
          backgroundColor: available ? colors.green500 : colors.gray300,
        }}
      >
        <div style={{ ...base.toggleDot, left: available ? 23 : 3 }} />
      </button>
    </div>
  )
}

function ProfileCompletion({ percent }: { percent: number }) {
  const isComplete = percent >= 100
  return (
    <div style={base.card}>
      <div style={base.row}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>
            {isComplete ? 'Profile complete' : 'Complete your public profile'}
          </div>
          <div style={{ fontSize: 13, color: colors.gray500, marginTop: 2 }}>
            {isComplete
              ? 'Clients can see your full profile in the directory.'
              : 'A complete profile helps clients decide if you\'re the right fit.'}
          </div>
        </div>
        {!isComplete && (
          <button style={{ ...base.button, backgroundColor: colors.gray900, color: colors.white }}>
            Edit profile
          </button>
        )}
        {isComplete && (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="10" fill={colors.green500} />
            <path d="M6 10l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      {!isComplete && (
        <>
          <div style={base.progressBar}>
            <div style={{ ...base.progressFill, width: `${percent}%`, backgroundColor: colors.blue500 }} />
          </div>
          <div style={{ fontSize: 12, color: colors.gray400 }}>{percent}% complete</div>
        </>
      )}
    </div>
  )
}

function ApplyPrompt() {
  return (
    <div style={{ ...base.card, textAlign: 'center' as const, padding: 32 }}>
      <div style={{ marginBottom: 12 }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect x="4" y="4" width="32" height="32" rx="8" fill={colors.blue50} />
          <path d="M14 20.5L18 24.5L26 16.5" stroke={colors.blue600} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="20" cy="20" r="11" stroke={colors.blue600} strokeWidth="2" />
        </svg>
      </div>
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
        Get listed where clients search
      </div>
      <div style={{ fontSize: 14, color: colors.gray500, marginBottom: 20, maxWidth: 360, margin: '0 auto 20px' }}>
        Apply to appear in the WordPress.com, WooCommerce, Pressable, and Jetpack partner directories. Qualified leads come to you.
      </div>
      <button style={{ ...base.button, backgroundColor: colors.gray900, color: colors.white, padding: '10px 24px' }}>
        Apply to directories
      </button>
    </div>
  )
}

function PendingExplainer() {
  return (
    <div style={{ ...base.card, backgroundColor: colors.yellow50, border: `1px solid ${colors.yellow100}` }}>
      <div style={{ display: 'flex', gap: 10 }}>
        <span style={{ fontSize: 18 }}>⏳</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>Your applications are under review</div>
          <div style={{ fontSize: 13, color: colors.gray600, marginTop: 4 }}>
            The A4A team reviews each application. This usually takes 2–3 business days.
            You'll get an email when there's an update.
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------- Defaults ----------

const defaultDirectories: DirectoryEntry[] = [
  { name: 'WordPress.com', status: 'not-applied' },
  { name: 'WooCommerce', status: 'not-applied' },
  { name: 'Pressable', status: 'not-applied' },
  { name: 'Jetpack', status: 'not-applied' },
]

const pendingDirectories: DirectoryEntry[] = [
  { name: 'WordPress.com', status: 'pending', submittedAt: 'Jan 15' },
  { name: 'WooCommerce', status: 'pending', submittedAt: 'Jan 15' },
  { name: 'Pressable', status: 'pending', submittedAt: 'Jan 15' },
  { name: 'Jetpack', status: 'pending', submittedAt: 'Jan 15' },
]

const approvedDirectories: DirectoryEntry[] = [
  { name: 'WordPress.com', status: 'approved' },
  { name: 'WooCommerce', status: 'approved' },
  { name: 'Pressable', status: 'pending', submittedAt: 'Jan 20' },
  { name: 'Jetpack', status: 'approved' },
]

// ---------- Main Component ----------

export function ExpertiseListing({
  state,
  availability = 'available',
  directories,
  profileCompletion = 40,
  agencyName = 'Developer Agency Co.',
}: ExpertiseListingProps) {
  const dirs = directories ?? (
    state === 'not-applied' ? defaultDirectories
    : state === 'pending' ? pendingDirectories
    : approvedDirectories
  )

  return (
    <div style={base.container}>
      {/* Header */}
      <h1 style={base.h1}>Get found by clients</h1>
      <p style={base.subtitle}>
        Show up where clients are already looking — across WordPress.com, Woo, and more.
      </p>

      {/* Not Applied State */}
      {state === 'not-applied' && (
        <div style={base.section}>
          <ApplyPrompt />
        </div>
      )}

      {/* Pending Explainer */}
      {state === 'pending' && (
        <div style={base.section}>
          <PendingExplainer />
        </div>
      )}

      {/* Availability Toggle — only when approved */}
      {state === 'approved' && (
        <div style={base.section}>
          <AvailabilityToggle available={availability === 'available'} />
        </div>
      )}

      {/* Directory Status — not shown in not-applied state */}
      {state !== 'not-applied' && (
        <div style={base.section}>
          <div style={base.sectionHeader}>Directory status</div>
          <div style={base.card}>
            {dirs.map((d, i) => (
              <DirectoryRow key={d.name} entry={d} />
            ))}
          </div>
        </div>
      )}

      {/* Profile Completion — shown in pending and approved */}
      {state !== 'not-applied' && (
        <div style={base.section}>
          <div style={base.sectionHeader}>Public profile</div>
          <ProfileCompletion percent={state === 'approved' ? 100 : profileCompletion} />
        </div>
      )}

      {/* Help links */}
      <div style={{ marginTop: 8 }}>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
          <a href="#" style={base.link}>How does the review process work?</a>
          <a href="#" style={base.link}>What makes a strong profile?</a>
        </div>
      </div>
    </div>
  )
}
