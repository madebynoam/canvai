import { useState, useCallback } from 'react'
import { ArrowUp, Copy, Check } from 'lucide-react'
import { Overlay, DialogCard, DialogActions, ActionButton } from './Menu'
import { N, D, S, R, T, ICON, FONT } from './tokens'
import { setDismissedVersion } from './versionCheck'

interface UpdateDialogProps {
  open: boolean
  onClose: () => void
  currentVersion: string
  latestVersion: string
}

export function UpdateDialog({ open, onClose, currentVersion, latestVersion }: UpdateDialogProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText('/bryllen-update')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  const handleDismiss = useCallback(() => {
    setDismissedVersion(latestVersion)
    onClose()
  }, [latestVersion, onClose])

  return (
    <Overlay open={open} onClose={onClose}>
      <DialogCard width={360}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: S.sm,
          marginBottom: S.lg,
        }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: R.ui,
            background: 'oklch(0.55 0.14 250)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: D.text,
          }}>
            <ArrowUp size={ICON.lg} strokeWidth={2} />
          </div>
          <div>
            <div style={{
              fontSize: T.ui,
              fontWeight: 600,
              color: N.txtPri,
              fontFamily: FONT,
            }}>
              Update available
            </div>
            <div style={{
              fontSize: 12,
              color: N.txtSec,
              fontFamily: FONT,
            }}>
              {currentVersion} → {latestVersion}
            </div>
          </div>
        </div>

        {/* Command box */}
        <div style={{
          background: 'oklch(0.18 0.005 250)',
          borderRadius: R.ui,
          padding: S.md,
          marginBottom: S.md,
        }}>
          <div style={{
            fontSize: 11,
            color: 'oklch(0.6 0 0)',
            fontFamily: FONT,
            marginBottom: S.xs,
          }}>
            In Claude Code, run:
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: S.sm,
          }}>
            <code style={{
              fontSize: 13,
              color: D.text,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            }}>
              /bryllen-update
            </code>
            <button
              onClick={handleCopy}
              style={{
                width: 28,
                height: 28,
                border: 'none',
                borderRadius: R.ui,
                background: copied ? 'oklch(0.55 0.14 155)' : 'oklch(0.28 0.005 250)',
                color: D.text,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'default',
                transition: 'background 0.15s ease-out',
              }}
            >
              {copied ? <Check size={14} strokeWidth={2} /> : <Copy size={14} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div style={{
          fontSize: 12,
          color: N.txtSec,
          fontFamily: FONT,
          lineHeight: 1.5,
          textWrap: 'pretty',
        }}>
          Then restart Claude Code and run <code style={{
            background: 'oklch(0.95 0.003 250)',
            padding: '1px 4px',
            borderRadius: 3,
            fontSize: 11,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          }}>/bryllen-design</code>
        </div>

        {/* Actions */}
        <DialogActions>
          <ActionButton variant="ghost" onClick={handleDismiss}>Dismiss</ActionButton>
          <ActionButton variant="primary" onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy command'}
          </ActionButton>
        </DialogActions>
      </DialogCard>
    </Overlay>
  )
}
