import { useState, useEffect, useRef } from 'react'
import { Loader2, X, Check } from 'lucide-react'
import { F, R, S, T, V, D, FONT, ICON } from './tokens'

const SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)'
const GENTLE = 'cubic-bezier(0.25, 0.1, 0.25, 1)'
const PANEL_WIDTH = 236

interface ProgressFrame {
  id: string
  title: string
}

type Status = 'pending' | 'processing' | 'done'

interface ProgressPanelProps {
  annotationId: string
  endpoint: string
  /** Project slug — used to fetch /frames for titles */
  project?: string
  /** Project UUID — used for annotation SSE filter */
  projectId?: string
  onDismiss: () => void
}

export function ProgressPanel({ annotationId, endpoint, project, projectId, onDismiss }: ProgressPanelProps) {
  const [messages, setMessages] = useState<string[]>([])
  const [frames, setFrames] = useState<ProgressFrame[]>([])
  const [status, setStatus] = useState<Status>('pending')
  const [visible, setVisible] = useState(false)
  const [comment, setComment] = useState('')

  const knownFrameIdsRef = useRef<Set<string>>(new Set())
  const onDismissRef = useRef(onDismiss)
  onDismissRef.current = onDismiss

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Slide in on mount
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 16)
    return () => clearTimeout(timer)
  }, [])

  // Fetch annotation comment for display
  useEffect(() => {
    const params = projectId ? `?projectId=${encodeURIComponent(projectId)}` : ''
    fetch(`${endpoint}/annotations${params}`)
      .then(r => r.json())
      .then((annotations: Array<{ id: string; comment: string; type?: string }>) => {
        const ann = annotations.find(a => String(a.id) === annotationId)
        if (ann) {
          // Truncate long comments
          const text = ann.comment || ''
          setComment(text.length > 60 ? text.slice(0, 57) + '…' : text)
        }
      })
      .catch(() => {})
  }, [endpoint, projectId, annotationId])

  // Auto-scroll messages log
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // SSE subscription — global stream, filter by annotationId
  useEffect(() => {
    const params = projectId ? `?projectId=${encodeURIComponent(projectId)}` : ''
    const source = new EventSource(`${endpoint}/annotations/events${params}`)

    source.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)

        if (data.type === 'progress' && String(data.id) === annotationId && data.message) {
          setStatus('processing')
          setMessages(prev => [...prev, data.message])
        }

        if (data.type === 'frame-created' && project) {
          // Fetch updated frames list and find newly added frames
          fetch(`${endpoint}/frames?project=${encodeURIComponent(project)}`)
            .then(r => r.json())
            .then((dbFrames: Array<{ id: string; title: string }>) => {
              const newOnes = dbFrames.filter(f => !knownFrameIdsRef.current.has(f.id))
              if (newOnes.length > 0) {
                newOnes.forEach(f => knownFrameIdsRef.current.add(f.id))
                setFrames(prev => [...prev, ...newOnes.map(f => ({ id: f.id, title: f.title }))])
              }
            })
            .catch(() => {})
        }

        if (data.type === 'resolved' && String(data.id) === annotationId) {
          setStatus('done')
          setTimeout(() => {
            setVisible(false)
            setTimeout(() => onDismissRef.current(), 320)
          }, 2000)
        }
      } catch { /* ignore */ }
    }

    return () => source.close()
  }, [endpoint, projectId, annotationId, project])

  const handleClose = () => {
    setVisible(false)
    setTimeout(() => onDismissRef.current(), 320)
  }

  return (
    <>
      <style>{`
        @keyframes bryllen-panel-spin { to { transform: rotate(360deg) } }
        @keyframes bryllen-panel-pulse {
          0%, 80%, 100% { transform: scale(0.5); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes bryllen-panel-fadein {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        style={{
          position: 'fixed',
          top: 56,
          right: 0,
          bottom: 56,
          width: PANEL_WIDTH,
          zIndex: 200,
          pointerEvents: visible ? 'auto' : 'none',
          transform: visible ? 'translateX(0)' : `translateX(${PANEL_WIDTH + 16}px)`,
          transition: `transform 380ms ${visible ? SPRING : GENTLE}`,
        }}
      >
        <div
          style={{
            height: '100%',
            margin: `${S.md}px ${S.md}px ${S.md}px 0`,
            background: V.card,
            border: `1px solid ${V.border}`,
            borderRadius: R.ui,
            boxShadow: V.shadow,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: FONT,
          }}
        >
          {/* ── Header ── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: S.sm,
              padding: `${S.sm}px ${S.sm}px ${S.sm}px ${S.md}px`,
              borderBottom: `1px solid ${V.border}`,
              flexShrink: 0,
            }}
          >
            {/* Status indicator */}
            {status === 'done' ? (
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: F.success,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: D.text,
                  flexShrink: 0,
                }}
              >
                <Check size={ICON.sm} strokeWidth={2.5} />
              </div>
            ) : (
              <div
                style={{
                  width: 18,
                  height: 18,
                  color: F.marker,
                  animation: 'bryllen-panel-spin 1s linear infinite',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Loader2 size={ICON.md} strokeWidth={2} />
              </div>
            )}

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: T.ui, fontWeight: 600, color: V.txtPri }}>
                {status === 'done' ? 'Done' : 'Claude is working'}
              </div>
              {comment && (
                <div
                  style={{
                    fontSize: T.ui,
                    color: V.txtSec,
                    marginTop: 2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {comment}
                </div>
              )}
            </div>

            <button
              onClick={handleClose}
              style={{
                width: 20,
                height: 20,
                border: 'none',
                background: 'transparent',
                borderRadius: R.ui,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'default',
                color: V.txtMuted,
                flexShrink: 0,
              }}
            >
              <X size={ICON.sm} strokeWidth={2} />
            </button>
          </div>

          {/* ── Activity log ── */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: S.xs,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {messages.length === 0 && status === 'pending' && (
              <div
                style={{
                  fontSize: T.ui,
                  color: V.txtMuted,
                  padding: `${S.sm}px ${S.sm}px`,
                  textWrap: 'pretty',
                } as React.CSSProperties}
              >
                Waiting for Claude…
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  fontSize: T.ui,
                  color: V.txtSec,
                  padding: `${S.xs}px ${S.sm}px`,
                  borderRadius: R.ui,
                  lineHeight: 1.5,
                  animation: 'bryllen-panel-fadein 200ms ease-out both',
                }}
              >
                {msg}
              </div>
            ))}

            {/* Frames added */}
            {frames.length > 0 && (
              <div style={{ marginTop: S.xs }}>
                <div
                  style={{
                    fontSize: T.ui,
                    fontWeight: 500,
                    color: V.txtMuted,
                    padding: `${S.xs}px ${S.sm}px`,
                    letterSpacing: 0.3,
                  }}
                >
                  Frames added
                </div>
                {frames.map(frame => (
                  <div
                    key={frame.id}
                    style={{
                      fontSize: T.ui,
                      color: V.txtPri,
                      padding: `${S.xs}px ${S.sm}px`,
                      borderRadius: R.ui,
                      display: 'flex',
                      alignItems: 'center',
                      gap: S.xs,
                      animation: 'bryllen-panel-fadein 200ms ease-out both',
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: F.success,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {frame.title}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Pulsing dots while active */}
            {status !== 'done' && (
              <div
                style={{
                  display: 'flex',
                  gap: 4,
                  padding: `${S.sm}px ${S.sm}px`,
                  marginTop: S.xs,
                }}
              >
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      background: F.marker,
                      animation: `bryllen-panel-pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </>
  )
}
