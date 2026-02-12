import { type CSSProperties } from 'react'

interface PricingCardProps {
  tier: 'free' | 'pro' | 'enterprise'
  highlighted?: boolean
}

const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'

const tiers = {
  free: {
    name: 'Starter',
    price: '$0',
    period: 'forever',
    description: 'For personal projects and experiments.',
    features: ['1 project', '500 MB storage', 'Community support', 'Basic analytics'],
    cta: 'Get started',
    accent: '#6B7280',
    accentBg: '#F3F4F6',
  },
  pro: {
    name: 'Pro',
    price: '$19',
    period: '/month',
    description: 'For professionals who need more power.',
    features: ['Unlimited projects', '50 GB storage', 'Priority support', 'Advanced analytics', 'Custom domains', 'Team collaboration'],
    cta: 'Start free trial',
    accent: '#E8590C',
    accentBg: '#FFF7ED',
  },
  enterprise: {
    name: 'Enterprise',
    price: '$79',
    period: '/month',
    description: 'For teams that need control and scale.',
    features: ['Everything in Pro', 'Unlimited storage', 'Dedicated support', 'SSO & SAML', 'Audit logs', 'SLA guarantee', 'Custom integrations'],
    cta: 'Contact sales',
    accent: '#1F2937',
    accentBg: '#F9FAFB',
  },
}

export function PricingCard({ tier, highlighted = false }: PricingCardProps) {
  const t = tiers[tier]

  const card: CSSProperties = {
    fontFamily: FONT,
    width: 300,
    padding: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    border: highlighted ? `2px solid ${t.accent}` : '1px solid #E5E7EB',
    position: 'relative',
    overflow: 'hidden',
  }

  return (
    <div style={card}>
      {highlighted && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          backgroundColor: t.accent,
        }} />
      )}

      {highlighted && (
        <span style={{
          display: 'inline-block',
          fontSize: 10,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: t.accent,
          backgroundColor: t.accentBg,
          padding: '3px 10px',
          borderRadius: 99,
          marginBottom: 16,
        }}>
          Most popular
        </span>
      )}

      <div style={{ fontSize: 15, fontWeight: 600, color: '#1F2937', marginBottom: 4 }}>
        {t.name}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
        <span style={{ fontSize: 36, fontWeight: 700, color: '#1F2937', letterSpacing: '-0.02em' }}>
          {t.price}
        </span>
        <span style={{ fontSize: 14, color: '#9CA3AF' }}>{t.period}</span>
      </div>

      <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5, marginBottom: 24 }}>
        {t.description}
      </div>

      <button style={{
        width: '100%',
        padding: '10px 0',
        fontSize: 14,
        fontWeight: 500,
        fontFamily: FONT,
        border: highlighted ? 'none' : '1px solid #E5E7EB',
        borderRadius: 10,
        cursor: 'pointer',
        backgroundColor: highlighted ? t.accent : '#FFFFFF',
        color: highlighted ? '#FFFFFF' : '#1F2937',
        marginBottom: 24,
      }}>
        {t.cta}
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {t.features.map(f => (
          <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <path d="M4 8l3 3 5-5" stroke={t.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: 13, color: '#374151' }}>{f}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
