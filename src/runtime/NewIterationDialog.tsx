import { useState, useRef, useEffect, useCallback } from 'react'
import { X } from 'lucide-react'
import { Overlay, DialogCard, DialogActions, ActionButton } from './Menu'
import { D, S, R, T, V, FONT } from './tokens'

interface PastedImage {
  id: string
  dataUrl: string
  filename: string
}

interface NewIterationDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (prompt: string, images?: PastedImage[]) => void
}

function ImageThumb({ image, onRemove }: { image: PastedImage; onRemove: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{
        position: 'relative',
        width: 64,
        height: 64,
        borderRadius: R.ui,
        overflow: 'hidden',
        flexShrink: 0,
      }}
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

export function NewIterationDialog({ open, onClose, onSubmit }: NewIterationDialogProps) {
  const [value, setValue] = useState('')
  const [images, setImages] = useState<PastedImage[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (open && textareaRef.current) {
      textareaRef.current.focus()
    } else if (!open) {
      setImages([])
    }
  }, [open])

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

    window.addEventListener('paste', handlePaste)
    return () => window.removeEventListener('paste', handlePaste)
  }, [open])

  const handleSubmit = useCallback(() => {
    if (!value.trim()) return
    onSubmit(value.trim(), images.length > 0 ? images : undefined)
    setValue('')
    setImages([])
    onClose()
  }, [value, images, onSubmit, onClose])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit()
    }
  }, [handleSubmit])

  const removeImage = useCallback((id: string) => {
    setImages(prev => prev.filter(img => img.id !== id))
  }, [])

  return (
    <Overlay open={open} onClose={onClose}>
      <div onKeyDown={handleKeyDown}>
        <DialogCard title="New iteration" width={480}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S.lg }}>
            <div>
              <label style={{ display: 'block', fontSize: T.ui, color: V.txtSec, marginBottom: S.xs, fontWeight: 500 }}>
                What do you want to explore?
              </label>
              <textarea
                ref={textareaRef}
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder="Describe the direction — try a different layout, new color palette, simplify the UI..."
                rows={3}
                style={{
                  width: '100%',
                  minHeight: 72,
                  background: V.canvas,
                  color: V.txtPri,
                  border: `1px solid ${V.border}`,
                  borderRadius: R.ui,
                  padding: S.md,
                  fontSize: T.ui,
                  lineHeight: 1.5,
                  resize: 'vertical',
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
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
                  borderRadius: R.ui,
                  padding: S.md,
                  textAlign: 'center',
                  color: V.txtTer,
                  fontSize: T.ui,
                  fontFamily: FONT,
                }}>
                  Cmd+V to paste screenshots or mockups
                </div>
              )}
            </div>
          </div>

          <DialogActions>
            <ActionButton variant="ghost" onClick={onClose}>Cancel</ActionButton>
            <ActionButton variant="primary" disabled={!value.trim()} onClick={handleSubmit}>Create</ActionButton>
          </DialogActions>
        </DialogCard>
      </div>
    </Overlay>
  )
}
