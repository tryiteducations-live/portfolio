import { ReactNode, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface Props {
  id: string
  children: ReactNode
  accentColor?: string
  bgGlow?: string
}

export function SectionWrapper({ id, children, accentColor = '#F59E0B', bgGlow }: Props) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })

  return (
    <section
      id={id}
      ref={ref}
      className="grid-bg"
      style={{
        padding: '100px 48px',
        position: 'relative',
        overflow: 'hidden',
        background: bgGlow
          ? `radial-gradient(ellipse 80% 60% at 50% 100%, ${bgGlow} 0%, transparent 70%)`
          : undefined,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 2 }}
      >
        {children}
      </motion.div>
      <style>{`
        @media (max-width: 900px) {
          #${id} { padding: 60px 20px !important; }
          .tier-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

interface SectionHeaderProps {
  tag: string
  title: string
  org: string
  hook: string
  hookBold: string
  color: string
  stats: { n: string; l: string }[]
  dividerBefore: string
  dividerAfter: string
}

export function SectionHeader({ tag, title, org, hook, hookBold, color, stats, dividerBefore, dividerAfter }: SectionHeaderProps) {
  return (
    <>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600,
        letterSpacing: '0.12em', textTransform: 'uppercase', color,
        marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ display: 'inline-block', width: 24, height: 1, background: color, opacity: 0.6 }} />
        {tag}
      </div>

      <h2 style={{
        fontFamily: "'Instrument Serif', serif",
        fontSize: 'clamp(36px, 5vw, 60px)',
        lineHeight: 1.05, letterSpacing: '-1.5px', color,
        marginBottom: 10,
      }}>
        {title}
      </h2>

      <p style={{ fontSize: 13, color: 'var(--text3)', fontWeight: 400, marginBottom: 20 }}>{org}</p>

      <div style={{
        fontSize: 16, lineHeight: 1.7, color: 'var(--text2)', maxWidth: 580,
        borderLeft: '2px solid var(--border2)', paddingLeft: 20, marginBottom: 32,
      }}>
        {hook} <strong style={{ color: 'var(--text)', fontWeight: 600 }}>{hookBold}</strong>
      </div>

      {/* Before/After divider */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 24px', border: '1px solid var(--border)', borderRadius: 8,
        background: 'var(--bg2)', marginBottom: 32, flexWrap: 'wrap', gap: 10,
      }}>
        <span style={{ fontSize: 13, color: 'var(--text3)' }}>{dividerBefore}</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, color: 'var(--border2)' }}>→</span>
        <span style={{ fontSize: 13, color: 'var(--green)', fontWeight: 500 }}>{dividerAfter}</span>
      </div>

      {/* Stats row */}
      <div style={{
        display: 'flex', gap: 0, marginBottom: 48,
        border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', flexWrap: 'wrap',
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            flex: 1, minWidth: 120, padding: '20px 24px',
            borderRight: i < stats.length - 1 ? '1px solid var(--border)' : 'none',
            display: 'flex', flexDirection: 'column', gap: 4,
          }}>
            <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, lineHeight: 1, color }}>
              {s.n}
            </span>
            <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 500, letterSpacing: '0.04em' }}>
              {s.l}
            </span>
          </div>
        ))}
      </div>
    </>
  )
}

export function SceneCTA({ sectorLabel, waParam }: { sectorLabel: string; waParam: string }) {
  return (
    <div style={{ textAlign: 'center', paddingTop: 32 }}>
      <motion.a
        href={`https://wa.me/919566698821?text=${waParam}`}
        target="_blank" rel="noopener"
        whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(37,211,102,0.35)' }}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '14px 28px', background: '#25D366', color: '#000',
          borderRadius: 6, fontSize: 14, fontWeight: 700, textDecoration: 'none',
          boxShadow: '0 4px 20px rgba(37,211,102,0.2)', transition: 'all 0.2s',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#000">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Discuss {sectorLabel} Work
      </motion.a>
    </div>
  )
}
