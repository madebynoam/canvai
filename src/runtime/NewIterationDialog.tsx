import { useState, useRef, useEffect, useCallback } from 'react'
import { Overlay, DialogCard, DialogActions, ActionButton } from './Menu'
import { N, S, R, T } from './tokens'

interface NewIterationDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (prompt: string) => void
}

export function NewIterationDialog({ open, onClose, onSubmit }: NewIterationDialogProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (open && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [open])

  const handleSubmit = useCallback(() => {
    if (!value.trim()) return
    onSubmit(value.trim())
    setValue('')
    onClose()
  }, [value, onSubmit, onClose])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit()
    }
  }, [handleSubmit])

  return (
    <Overlay open={open} onClose={onClose}>
      <div onKeyDown={handleKeyDown}>
        <DialogCard title="New iteration" width={480}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="What do you want to change?"
            rows={3}
            style={{
              width: '100%',
              minHeight: 72,
              background: N.canvas,
              color: N.txtPri,
              border: `1px solid ${N.border}`,
              borderRadius: R.card,
              padding: S.md,
              fontSize: T.title,
              lineHeight: 1.5,
              resize: 'vertical',
              outline: 'none',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          />
          <DialogActions>
            <ActionButton variant="ghost" onClick={onClose}>Cancel</ActionButton>
            <ActionButton variant="primary" disabled={!value.trim()} onClick={handleSubmit}>Create</ActionButton>
          </DialogActions>
        </DialogCard>
      </div>
    </Overlay>
  )
}
