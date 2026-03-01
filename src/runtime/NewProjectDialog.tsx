import { useState, useRef, useEffect, useCallback } from 'react'
import { Overlay, DialogCard, DialogActions, ActionButton } from './Menu'
import { N, S, R, T } from './tokens'

interface NewProjectDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (payload: { name: string, description: string, prompt: string }) => void
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: N.canvas,
  color: N.txtPri,
  border: `1px solid ${N.border}`,
  borderRadius: R.ui, cornerShape: 'squircle',
  padding: S.md,
  fontSize: T.ui,
  lineHeight: 1.5,
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
}

export function NewProjectDialog({ open, onClose, onSubmit }: NewProjectDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [prompt, setPrompt] = useState('')
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && nameRef.current) {
      nameRef.current.focus()
    }
  }, [open])

  const handleSubmit = useCallback(() => {
    const trimmed = name.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')
    if (!trimmed) return
    onSubmit({ name: trimmed, description: description.trim(), prompt: prompt.trim() })
    setName('')
    setDescription('')
    setPrompt('')
    onClose()
  }, [name, description, prompt, onSubmit, onClose])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit()
    }
  }, [handleSubmit])

  return (
    <Overlay open={open} onClose={onClose}>
      <div onKeyDown={handleKeyDown}>
        <DialogCard title="New project" width={520}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S.md }}>
            <div>
              <label style={{ display: 'block', fontSize: T.ui, color: N.txtSec, marginBottom: S.xs, fontWeight: 500 }}>
                Project name
              </label>
              <input
                ref={nameRef}
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. settings-panel"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: T.ui, color: N.txtSec, marginBottom: S.xs, fontWeight: 500 }}>
                Description
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="What are you designing?"
                rows={2}
                style={{ ...inputStyle, minHeight: 56, resize: 'vertical' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: T.ui, color: N.txtSec, marginBottom: S.xs, fontWeight: 500 }}>
                First component
              </label>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Describe your first component or paste a sketch"
                rows={3}
                style={{ ...inputStyle, minHeight: 72, resize: 'vertical' }}
              />
            </div>
          </div>
          <DialogActions>
            <ActionButton variant="ghost" onClick={onClose}>Cancel</ActionButton>
            <ActionButton variant="primary" disabled={!name.trim()} onClick={handleSubmit}>Create</ActionButton>
          </DialogActions>
        </DialogCard>
      </div>
    </Overlay>
  )
}
