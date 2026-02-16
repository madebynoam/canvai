import { Button, Avatar, Label, Toggle, Checkbox, HoverButton } from '../components'

/** V3 Components showcase — every building block rendered live */
export function Components() {
  return (
    <div style={{ padding: 32, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif' }}>
      <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 24 }}>
        V3 Components
      </h2>

      <Label sub="Primary, outline, ghost variants">Button</Label>
      <div style={{ display: 'flex', gap: 12, marginTop: 8, marginBottom: 24 }}>
        <Button variant="primary">Primary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </div>

      <Label sub="Letter fallback">Avatar</Label>
      <div style={{ display: 'flex', gap: 12, marginTop: 8, marginBottom: 24, alignItems: 'center' }}>
        <Avatar letter="A" />
        <Avatar letter="B" />
        <Avatar letter="C" />
      </div>

      <Label sub="Pill switch with spring slide">Toggle</Label>
      <div style={{ display: 'flex', gap: 16, marginTop: 8, marginBottom: 24, alignItems: 'center' }}>
        <Toggle defaultOn />
        <Toggle />
      </div>

      <Label sub="Spring scale bounce">Checkbox</Label>
      <div style={{ display: 'flex', gap: 16, marginTop: 8, marginBottom: 24, alignItems: 'center' }}>
        <Checkbox defaultChecked label="Enabled" />
        <Checkbox label="Disabled" />
      </div>

      <Label sub="Icon button with subtle hover">HoverButton</Label>
      <div style={{ display: 'flex', gap: 8, marginTop: 8, marginBottom: 24 }}>
        <HoverButton title="Settings">S</HoverButton>
        <HoverButton title="Search">Q</HoverButton>
        <HoverButton title="Menu" active>M</HoverButton>
      </div>

      <Label sub="Section headers with optional subtitle">Label</Label>
      <div style={{ marginTop: 8, padding: 16, backgroundColor: 'var(--chrome)', borderRadius: 8, border: '1px solid var(--border)' }}>
        <Label sub="With a subtitle underneath">Example Section</Label>
      </div>
    </div>
  )
}
