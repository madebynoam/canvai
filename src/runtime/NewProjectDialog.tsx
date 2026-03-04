import { useState, useRef, useEffect, useCallback } from 'react'
import { Overlay, DialogCard, DialogActions, ActionButton } from './Menu'
import { N, S, R, T } from './tokens'

interface NewProjectDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (payload: { name: string, description: string, prompt: string }) => void
  /** When provided, hide name field and use this value */
  defaultName?: string
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

export function NewProjectDialog({ open, onClose, onSubmit, defaultName }: NewProjectDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [prompt, setPrompt] = useState('')
  const nameRef = useRef<HTMLInputElement>(null)
  const promptRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (open) {
      // If defaultName provided, focus prompt; otherwise focus name
      if (defaultName && promptRef.current) {
        promptRef.current.focus()
      } else if (nameRef.current) {
        nameRef.current.focus()
      }
    }
  }, [open, defaultName])

  const handleSubmit = useCallback(() => {
    const effectiveName = defaultName || name.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')
    if (!effectiveName) return
    onSubmit({ name: effectiveName, description: description.trim(), prompt: prompt.trim() })
    setName('')
    setDescription('')
    setPrompt('')
    onClose()
  }, [name, description, prompt, onSubmit, onClose, defaultName])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit()
    }
  }, [handleSubmit])

  // When defaultName is provided, this is a "prompt-only" dialog
  const isPromptOnly = !!defaultName
  const dialogTitle = isPromptOnly ? `What would you like to design?` : 'New project'
  const canSubmit = isPromptOnly ? !!prompt.trim() : !!name.trim()

  return (
    <Overlay open={open} onClose={onClose}>
      <div onKeyDown={handleKeyDown}>
        <DialogCard title={dialogTitle} width={520}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S.md }}>
            {/* Hide name field when defaultName is provided */}
            {!isPromptOnly && (
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
            )}
            {!isPromptOnly && (
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
            )}
            <div>
              <label style={{ display: 'block', fontSize: T.ui, color: N.txtSec, marginBottom: S.xs, fontWeight: 500 }}>
                {isPromptOnly ? 'Describe your design' : 'First component'}
              </label>
              <textarea
                ref={promptRef}
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder={isPromptOnly ? 'A dashboard with user stats, activity graph, and recent notifications...' : 'Describe your first component or paste a sketch'}
                rows={isPromptOnly ? 4 : 3}
                style={{ ...inputStyle, minHeight: isPromptOnly ? 96 : 72, resize: 'vertical' }}
              />
            </div>
          </div>
          <DialogActions>
            <ActionButton variant="ghost" onClick={onClose}>Cancel</ActionButton>
            <ActionButton variant="primary" disabled={!canSubmit} onClick={handleSubmit}>
              {isPromptOnly ? 'Start designing' : 'Create'}
            </ActionButton>
          </DialogActions>
        </DialogCard>
      </div>
    </Overlay>
  )
}
