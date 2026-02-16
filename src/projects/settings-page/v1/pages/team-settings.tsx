import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { Button, Input, Avatar, Toggle, MemberRow, SectionCard } from '../components'

export function TeamSettings() {
  const [teamName, setTeamName] = useState('Acme Inc')
  const [slug, setSlug] = useState('acme-inc')

  return (
    <div style={{
      padding: 32,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
      maxWidth: 640,
      display: 'flex', flexDirection: 'column', gap: 24,
    }}>
      <div>
        <h1 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
          Team Settings
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-tertiary)', margin: '4px 0 0', textWrap: 'pretty' } as React.CSSProperties}>
          Manage your team profile, members, and permissions.
        </p>
      </div>

      {/* Team Info */}
      <SectionCard title="Team Info" description="Your team's public profile visible to all members.">
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <Avatar letter="A" size={56} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Input label="Team name" value={teamName} onChange={setTeamName} />
            <Input label="URL slug" value={slug} onChange={setSlug} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
          <Button variant="ghost">Cancel</Button>
          <Button variant="primary">Save changes</Button>
        </div>
      </SectionCard>

      {/* Members */}
      <SectionCard title="Members" description="People who have access to this team.">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>5 members</span>
          <Button variant="outline" size="sm">
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <UserPlus size={12} strokeWidth={1.5} />
              Invite
            </span>
          </Button>
        </div>
        <div style={{ margin: '0 -12px' }}>
          <MemberRow name="Alice Chen" email="alice@acme.com" role="Owner" online />
          <MemberRow name="Bob Park" email="bob@acme.com" role="Admin" avatarBg="oklch(0.55 0.14 155)" online />
          <MemberRow name="Carol Wu" email="carol@acme.com" role="Member" avatarBg="oklch(0.62 0.12 235)" />
          <MemberRow name="Dan Lee" email="dan@acme.com" role="Member" avatarBg="oklch(0.58 0.10 50)" />
          <MemberRow name="Eve Kim" email="eve@acme.com" role="Member" avatarBg="oklch(0.50 0.15 310)" />
        </div>
      </SectionCard>

      {/* Permissions */}
      <SectionCard title="Permissions" description="Control what members can do in this team.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>Allow members to invite</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Members can invite new people to the team</div>
            </div>
            <Toggle defaultOn />
          </div>
          <div style={{ height: 1, backgroundColor: 'var(--border-soft)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>Require 2FA</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>All members must enable two-factor authentication</div>
            </div>
            <Toggle />
          </div>
          <div style={{ height: 1, backgroundColor: 'var(--border-soft)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>Public team profile</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Anyone can see your team name and avatar</div>
            </div>
            <Toggle defaultOn />
          </div>
        </div>
      </SectionCard>

      {/* Danger zone */}
      <SectionCard title="Danger Zone" description="Irreversible actions for this team.">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>Delete team</div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Permanently delete this team and all its data</div>
          </div>
          <Button variant="danger" size="sm">Delete team</Button>
        </div>
      </SectionCard>
    </div>
  )
}
