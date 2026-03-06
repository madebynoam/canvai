import { useState, useEffect, useRef } from 'react'
import { Check, Copy, ExternalLink, Github, Loader2, RefreshCw, X } from 'lucide-react'
import { S, R, T, V, FONT, ICON } from './tokens'

export type ShareStatus = 'checking' | 'needs-auth' | 'idle' | 'sharing' | 'shared'

interface SharePopoverProps {
  status: ShareStatus
  shareUrl?: string
  authUser?: { login: string; avatarUrl: string } | null
  onLogin: () => void
  onShare: () => void
  onClose: () => void
}

export function SharePopover({
  status,
  shareUrl,
  authUser,
  onLogin,
  onShare,
  onClose,
}: SharePopoverProps) {
  const [copied, setCopied] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleCopy = async () => {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for browsers that don't support clipboard API
      const input = document.createElement('input')
      input.value = shareUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div
      ref={popoverRef}
      style={{
        position: 'absolute',
        top: '100%',
        right: 0,
        marginTop: S.xs,
        width: 280,
        backgroundColor: V.card,
        border: `1px solid ${V.border}`,
        borderRadius: R.ui,
        boxShadow: '0 4px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
        fontFamily: FONT,
        zIndex: 10000,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${S.sm}px ${S.md}px`,
          borderBottom: `1px solid ${V.border}`,
        }}
      >
        <span style={{ fontSize: T.ui, fontWeight: 600, color: V.txtPri }}>
          Share
        </span>
        <button
          onClick={onClose}
          style={{
            width: 20,
            height: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            borderRadius: R.ui,
            cursor: 'default',
          }}
        >
          <X size={ICON.md} strokeWidth={1.5} style={{ color: V.txtSec }} />
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: S.md }}>
        {status === 'checking' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: S.sm, color: V.txtSec }}>
            <Loader2 size={ICON.md} strokeWidth={1.5} style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: T.ui }}>Checking authentication...</span>
          </div>
        )}

        {status === 'needs-auth' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: S.md }}>
            <p style={{ fontSize: T.ui, color: V.txtSec, margin: 0, lineHeight: 1.5 }}>
              Sign in with GitHub to deploy your project to GitHub Pages.
            </p>
            <button
              onClick={onLogin}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: S.sm,
                padding: `${S.sm}px ${S.md}px`,
                backgroundColor: V.txtPri,
                color: V.card,
                border: 'none',
                borderRadius: R.ui,
                fontSize: T.ui,
                fontWeight: 500,
                cursor: 'default',
              }}
            >
              <Github size={ICON.md} strokeWidth={1.5} />
              Login with GitHub
            </button>
          </div>
        )}

        {status === 'idle' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: S.md }}>
            {authUser && (
              <div style={{ display: 'flex', alignItems: 'center', gap: S.sm }}>
                <img
                  src={authUser.avatarUrl}
                  alt={authUser.login}
                  style={{ width: 20, height: 20, borderRadius: R.pill }}
                />
                <span style={{ fontSize: T.ui, color: V.txtSec }}>{authUser.login}</span>
              </div>
            )}
            <p style={{ fontSize: T.ui, color: V.txtSec, margin: 0, lineHeight: 1.5 }}>
              Deploy this project to GitHub Pages and get a shareable link.
            </p>
            <button
              onClick={onShare}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: S.sm,
                padding: `${S.sm}px ${S.md}px`,
                backgroundColor: V.txtPri,
                color: V.card,
                border: 'none',
                borderRadius: R.ui,
                fontSize: T.ui,
                fontWeight: 500,
                cursor: 'default',
              }}
            >
              Deploy to GitHub Pages
            </button>
          </div>
        )}

        {status === 'sharing' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: S.sm, color: V.txtSec }}>
            <Loader2 size={ICON.md} strokeWidth={1.5} style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: T.ui }}>Deploying...</span>
          </div>
        )}

        {status === 'shared' && shareUrl && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: S.md }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: S.sm,
                padding: S.sm,
                backgroundColor: V.chrome,
                borderRadius: R.ui,
                border: `1px solid ${V.border}`,
              }}
            >
              <input
                type="text"
                value={shareUrl}
                readOnly
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  fontSize: T.ui,
                  color: V.txtPri,
                  outline: 'none',
                  fontFamily: 'monospace',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: S.sm }}>
              <button
                onClick={handleCopy}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: S.xs,
                  padding: `${S.sm}px ${S.md}px`,
                  backgroundColor: copied ? 'oklch(0.55 0.14 155)' : V.txtPri,
                  color: V.card,
                  border: 'none',
                  borderRadius: R.ui,
                  fontSize: T.ui,
                  fontWeight: 500,
                  cursor: 'default',
                  transition: 'background-color 150ms ease-out',
                }}
              >
                {copied ? <Check size={ICON.md} strokeWidth={1.5} /> : <Copy size={ICON.md} strokeWidth={1.5} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={() => window.open(shareUrl, '_blank')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: `${S.sm}px ${S.md}px`,
                  backgroundColor: V.chrome,
                  color: V.txtPri,
                  border: `1px solid ${V.border}`,
                  borderRadius: R.ui,
                  fontSize: T.ui,
                  fontWeight: 500,
                  cursor: 'default',
                }}
              >
                <ExternalLink size={ICON.md} strokeWidth={1.5} />
              </button>
            </div>
            <button
              onClick={onShare}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: S.sm,
                padding: `${S.sm}px ${S.md}px`,
                backgroundColor: 'transparent',
                color: V.txtSec,
                border: `1px solid ${V.border}`,
                borderRadius: R.ui,
                fontSize: T.ui,
                fontWeight: 500,
                cursor: 'default',
              }}
            >
              <RefreshCw size={ICON.md} strokeWidth={1.5} />
              Re-deploy
            </button>
          </div>
        )}
      </div>

      {/* CSS for spin animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
