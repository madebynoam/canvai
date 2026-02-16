import { useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { Avatar } from './Avatar'
import { Badge } from './Badge'

export function MemberRow({ name, email, role, avatarBg, online }: {
  name: string
  email: string
  role: 'Owner' | 'Admin' | 'Member'
  avatarBg?: string
  online?: boolean
}) {
  const [hovered, setHovered] = useState(false)

  const roleBadge: Record<string, 'accent' | 'success' | 'default'> = {
    Owner: 'accent',
    Admin: 'success',
    Member: 'default',
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '8px 12px', borderRadius: 'var(--radius-md)',
        backgroundColor: hovered ? 'rgba(0,0,0,0.02)' : 'transparent',
      }}
    >
      <div style={{ position: 'relative' }}>
        <Avatar letter={name[0]} size={32} bg={avatarBg} />
        {online && (
          <div style={{
            position: 'absolute', bottom: -1, right: -1,
            width: 10, height: 10, borderRadius: '50%',
            backgroundColor: 'var(--success)',
            border: '2px solid var(--surface)',
          }} />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{name}</div>
        <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{email}</div>
      </div>
      <Badge variant={roleBadge[role]}>{role}</Badge>
      <button style={{
        width: 28, height: 28, borderRadius: 'var(--radius-sm)',
        border: 'none', backgroundColor: 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-faint)', cursor: 'default',
        opacity: hovered ? 1 : 0,
      }}>
        <MoreHorizontal size={14} strokeWidth={1.5} />
      </button>
    </div>
  )
}
