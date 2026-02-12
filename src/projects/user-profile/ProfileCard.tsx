import { type CSSProperties } from 'react'

interface ProfileCardProps {
  variant: 'complete' | 'minimal' | 'empty'
}

const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'

const users = {
  complete: {
    name: 'Elena Rodriguez',
    handle: '@elena.dev',
    bio: 'Design engineer building tools for creative teams. Previously at Figma and Stripe.',
    avatar: 'ER',
    avatarColor: '#7C3AED',
    stats: { projects: 24, followers: 1280, following: 340 },
    tags: ['Design Systems', 'React', 'TypeScript', 'Figma'],
    isFollowing: false,
  },
  minimal: {
    name: 'Alex Chen',
    handle: '@alexc',
    bio: 'Frontend developer.',
    avatar: 'AC',
    avatarColor: '#0891B2',
    stats: { projects: 3, followers: 42, following: 18 },
    tags: ['JavaScript'],
    isFollowing: true,
  },
  empty: {
    name: 'New User',
    handle: '@newuser',
    bio: '',
    avatar: '?',
    avatarColor: '#D1D5DB',
    stats: { projects: 0, followers: 0, following: 0 },
    tags: [],
    isFollowing: false,
  },
}

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`
  return String(n)
}

export function ProfileCard({ variant }: ProfileCardProps) {
  const u = users[variant]

  const card: CSSProperties = {
    fontFamily: FONT,
    width: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    border: '1px solid #E5E7EB',
    overflow: 'hidden',
  }

  return (
    <div style={card}>
      {/* Header band */}
      <div style={{
        height: 72,
        background: `linear-gradient(135deg, ${u.avatarColor}22 0%, ${u.avatarColor}08 100%)`,
        borderBottom: '1px solid #F3F4F6',
      }} />

      {/* Avatar + info */}
      <div style={{ padding: '0 24px 24px' }}>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          backgroundColor: u.avatarColor,
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          fontWeight: 600,
          marginTop: -28,
          border: '3px solid #FFFFFF',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}>
          {u.avatar}
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 17, fontWeight: 600, color: '#1F2937' }}>{u.name}</div>
          <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>{u.handle}</div>
        </div>

        {u.bio && (
          <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5, marginTop: 12 }}>
            {u.bio}
          </div>
        )}

        {!u.bio && variant === 'empty' && (
          <div style={{
            fontSize: 13,
            color: '#D1D5DB',
            lineHeight: 1.5,
            marginTop: 12,
            fontStyle: 'italic',
          }}>
            No bio yet
          </div>
        )}

        {/* Tags */}
        {u.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
            {u.tags.map(tag => (
              <span key={tag} style={{
                fontSize: 11,
                fontWeight: 500,
                color: '#6B7280',
                backgroundColor: '#F3F4F6',
                padding: '3px 10px',
                borderRadius: 99,
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div style={{
          display: 'flex',
          gap: 24,
          marginTop: 20,
          paddingTop: 16,
          borderTop: '1px solid #F3F4F6',
        }}>
          {[
            { label: 'Projects', value: u.stats.projects },
            { label: 'Followers', value: u.stats.followers },
            { label: 'Following', value: u.stats.following },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#1F2937' }}>
                {formatNumber(s.value)}
              </div>
              <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button style={{
            flex: 1,
            padding: '8px 0',
            fontSize: 13,
            fontWeight: 500,
            fontFamily: FONT,
            borderRadius: 8,
            cursor: 'pointer',
            border: u.isFollowing ? '1px solid #E5E7EB' : 'none',
            backgroundColor: u.isFollowing ? '#FFFFFF' : '#1F2937',
            color: u.isFollowing ? '#1F2937' : '#FFFFFF',
          }}>
            {u.isFollowing ? 'Following' : 'Follow'}
          </button>
          <button style={{
            padding: '8px 14px',
            fontSize: 13,
            fontWeight: 500,
            fontFamily: FONT,
            borderRadius: 8,
            cursor: 'pointer',
            border: '1px solid #E5E7EB',
            backgroundColor: '#FFFFFF',
            color: '#1F2937',
          }}>
            Message
          </button>
        </div>
      </div>
    </div>
  )
}
