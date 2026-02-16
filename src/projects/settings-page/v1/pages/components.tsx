import { Button, Input, Avatar, Badge, Toggle, MemberRow, SectionCard } from '../components'

export function Components() {
  return (
    <div style={{
      padding: 32,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
      display: 'flex', flexDirection: 'column', gap: 32,
    }}>
      <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
        V1 Components
      </h2>

      {/* Buttons */}
      <div>
        <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Button</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button variant="primary">Save changes</Button>
          <Button variant="outline">Cancel</Button>
          <Button variant="ghost">Reset</Button>
          <Button variant="danger">Remove member</Button>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="outline" size="sm">Small</Button>
        </div>
      </div>

      {/* Inputs */}
      <div>
        <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Input</div>
        <div style={{ display: 'flex', gap: 16, maxWidth: 400 }}>
          <Input label="Team name" placeholder="Acme Inc" value="Acme Inc" />
          <Input label="Slug" placeholder="acme-inc" value="acme-inc" />
        </div>
      </div>

      {/* Avatars */}
      <div>
        <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Avatar</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Avatar letter="A" size={40} />
          <Avatar letter="N" size={32} bg="oklch(0.55 0.14 155)" />
          <Avatar letter="S" size={24} bg="oklch(0.52 0.20 28)" />
        </div>
      </div>

      {/* Badges */}
      <div>
        <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Badge</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Badge>Member</Badge>
          <Badge variant="accent">Owner</Badge>
          <Badge variant="success">Admin</Badge>
          <Badge variant="danger">Removed</Badge>
        </div>
      </div>

      {/* Toggle */}
      <div>
        <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Toggle</div>
        <div style={{ display: 'flex', gap: 16 }}>
          <Toggle defaultOn />
          <Toggle />
        </div>
      </div>

      {/* MemberRow */}
      <div>
        <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>MemberRow</div>
        <div style={{ maxWidth: 480, border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <MemberRow name="Alice Chen" email="alice@acme.com" role="Owner" online />
          <MemberRow name="Bob Park" email="bob@acme.com" role="Admin" avatarBg="oklch(0.55 0.14 155)" />
          <MemberRow name="Carol Wu" email="carol@acme.com" role="Member" avatarBg="oklch(0.62 0.12 235)" />
        </div>
      </div>

      {/* SectionCard */}
      <div>
        <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>SectionCard</div>
        <div style={{ maxWidth: 400 }}>
          <SectionCard title="Team Info" description="Basic information about your team.">
            <Input label="Team name" value="Acme Inc" />
          </SectionCard>
        </div>
      </div>
    </div>
  )
}
