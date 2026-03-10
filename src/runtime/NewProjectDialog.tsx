import { useState, useRef, useEffect, useCallback } from 'react'
import { X } from 'lucide-react'
import { Overlay, DialogCard, DialogActions, ActionButton } from './Menu'
import { D, S, R, T, V, FONT } from './tokens'

interface PastedImage {
  id: string
  dataUrl: string
  filename: string
}

interface NewProjectDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (payload: { name: string; description: string; prompt: string; images?: PastedImage[] }) => void
  /** When provided, hide name field and use this value */
  defaultName?: string
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: V.canvas,
  color: V.txtPri,
  border: `1px solid ${V.border}`,
  borderRadius: R.ui, cornerShape: 'squircle',
  padding: S.md,
  fontSize: T.ui,
  lineHeight: 1.5,
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
} as React.CSSProperties

function ImageThumb({ image, onRemove }: { image: PastedImage; onRemove: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{
        position: 'relative',
        width: 64,
        height: 64,
        borderRadius: R.ui, cornerShape: 'squircle',
        overflow: 'hidden',
        flexShrink: 0,
      } as React.CSSProperties}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={image.dataUrl}
        alt=""
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      {hovered && (
        <button
          onClick={onRemove}
          style={{
            position: 'absolute',
            top: 4,
            right: 4,
            width: 20,
            height: 20,
            borderRadius: '50%',
            border: 'none',
            background: 'oklch(0.22 0.005 240 / 0.9)',
            color: D.text,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'default',
            backdropFilter: 'blur(8px)',
          }}
        >
          <X size={12} strokeWidth={2} />
        </button>
      )}
    </div>
  )
}

export function NewProjectDialog({ open, onClose, onSubmit, defaultName }: NewProjectDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<PastedImage[]>([])
  const nameRef = useRef<HTMLInputElement>(null)
  const descRef = useRef<HTMLTextAreaElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      // If defaultName provided, focus description; otherwise focus name
      if (defaultName && descRef.current) {
        descRef.current.focus()
      } else if (nameRef.current) {
        nameRef.current.focus()
      }
    } else {
      // Reset state when dialog closes
      setImages([])
    }
  }, [open, defaultName])

  // Handle paste anywhere in dialog
  useEffect(() => {
    if (!open) return

    function handlePaste(e: ClipboardEvent) {
      if (!e.clipboardData) return

      for (const item of e.clipboardData.items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault()
          e.stopImmediatePropagation() // Prevent Canvas from also handling this paste
          const blob = item.getAsFile()
          if (!blob) continue

          const reader = new FileReader()
          reader.onload = () => {
            const dataUrl = reader.result as string
            const ext = item.type.split('/')[1] || 'png'
            const filename = `inspiration-${Date.now()}.${ext}`
            setImages(prev => [...prev, { id: crypto.randomUUID(), dataUrl, filename }])
          }
          reader.readAsDataURL(blob)
          return
        }
      }
    }

    window.addEventListener('paste', handlePaste, { capture: true })
    return () => window.removeEventListener('paste', handlePaste, { capture: true })
  }, [open])

  const handleSubmit = useCallback(() => {
    const effectiveName = defaultName || name.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')
    if (!effectiveName) return
    onSubmit({
      name: effectiveName,
      description: description.trim(),
      prompt: description.trim(), // Use description as prompt for backwards compat
      images: images.length > 0 ? images : undefined,
    })
    setName('')
    setDescription('')
    setImages([])
    onClose()
  }, [name, description, images, onSubmit, onClose, defaultName])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit()
    }
  }, [handleSubmit])

  const removeImage = useCallback((id: string) => {
    setImages(prev => prev.filter(img => img.id !== id))
  }, [])

  // When defaultName is provided, this is a "prompt-only" dialog
  const isPromptOnly = !!defaultName
  const dialogTitle = isPromptOnly ? 'What would you like to design?' : 'New project'
  const canSubmit = isPromptOnly ? !!description.trim() : !!name.trim()

  return (
    <Overlay open={open} onClose={onClose}>
      <div ref={dialogRef} onKeyDown={handleKeyDown}>
        <DialogCard title={dialogTitle} width={480}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S.lg }}>
            {/* Name field - hide when defaultName provided */}
            {!isPromptOnly && (
              <div>
                <label style={{ display: 'block', fontSize: T.ui, color: V.txtSec, marginBottom: S.xs, fontWeight: 500 }}>
                  Name
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

            {/* Description field */}
            <div>
              <label style={{ display: 'block', fontSize: T.ui, color: V.txtSec, marginBottom: S.xs, fontWeight: 500 }}>
                What are you designing?
              </label>
              <textarea
                ref={descRef}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe what you're building — a dashboard, settings page, onboarding flow..."
                rows={4}
                style={{ ...inputStyle, minHeight: 96, resize: 'vertical' }}
              />
            </div>

            {/* Inspiration images */}
            <div>
              <label style={{ display: 'block', fontSize: T.ui, color: V.txtSec, marginBottom: S.xs, fontWeight: 500 }}>
                Inspiration
                <span style={{ fontWeight: 400, marginLeft: S.xs, color: V.txtTer }}>
                  (paste images)
                </span>
              </label>
              {images.length > 0 ? (
                <div style={{ display: 'flex', gap: S.sm, flexWrap: 'wrap' }}>
                  {images.map(img => (
                    <ImageThumb key={img.id} image={img} onRemove={() => removeImage(img.id)} />
                  ))}
                </div>
              ) : (
                <div style={{
                  border: `1px dashed ${V.border}`,
                  borderRadius: R.ui, cornerShape: 'squircle',
                  padding: S.lg,
                  textAlign: 'center',
                  color: V.txtTer,
                  fontSize: T.ui,
                  fontFamily: FONT,
                } as React.CSSProperties}>
                  Cmd+V to paste screenshots or mockups
                </div>
              )}
            </div>
          </div>

          <DialogActions>
            <ActionButton variant="ghost" onClick={onClose}>Cancel</ActionButton>
            <ActionButton variant="primary" disabled={!canSubmit} onClick={handleSubmit}>
              {isPromptOnly ? 'Start' : 'Create'}
            </ActionButton>
          </DialogActions>
        </DialogCard>
      </div>
    </Overlay>
  )
}
