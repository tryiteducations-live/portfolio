import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { AnimatedBeam } from '@/components/ui/AnimatedBeam'
import { GlowBorder } from '@/components/ui/GlowBorder'
import { useTypewriter } from '@/hooks/useTypewriter'
import { STATS, TYPE_PHRASES } from '@/lib/data'
import gsap from 'gsap'

const LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/tata-raam-kumar/', icon: 'li' },
  { label: 'Substack', href: 'https://substack.com/@tataraamkumar', icon: 'ss' },
  { label: 'GitHub', href: 'https://github.com/TATARAAMKUMAR33', icon: 'gh' },
  { label: 'Email', href: 'mailto:tatu.ind@hotmail.com', icon: 'em' },
  { label: 'WhatsApp', href: 'https://wa.me/919566698821', icon: 'wa' },
]

function IconSVG({ type }: { type: string }) {
  const style = { width: 14, height: 14, fill: 'currentColor' }
  if (type === 'li') return <svg {...style} viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
  if (type === 'ss') return <svg {...style} viewBox="0 0 24 24"><path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/></svg>
  if (type === 'gh') return <svg {...style} viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
  if (type === 'em') return <svg {...style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
  return <svg {...style} viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
}

export function Hero() {
  const typedText = useTypewriter(TYPE_PHRASES)
  const statsRef = useRef<HTMLDivElement>(null)
  const [counters, setCounters] = useState([0, 0, 0, 0])
  const targets = [8, 2200, 30, 24]
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!statsRef.current) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true
        targets.forEach((target, i) => {
          const start = Date.now()
          const dur = 1800
          const tick = () => {
            const elapsed = Date.now() - start
            const progress = Math.min(elapsed / dur, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCounters(prev => { const next = [...prev]; next[i] = Math.floor(eased * target); return next })
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        })
      }
    }, { threshold: 0.3 })
    observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="s-hero"
      className="grid-bg"
      style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        padding: '100px 48px 80px', position: 'relative', overflow: 'hidden',
      }}
    >
      <AnimatedBeam style={{ position: 'absolute', inset: 0, opacity: 0.6 }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 64, alignItems: 'center' }}
          className="hero-grid">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500,
              letterSpacing: '0.12em', color: 'var(--text3)', marginBottom: 20,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ display: 'inline-block', width: 32, height: 1, background: 'var(--amber)', opacity: 0.5 }} />
              Operations · Risk · Intelligence · Tamil Nadu, India
            </div>

            <h1 style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 'clamp(48px, 6vw, 80px)',
              lineHeight: 1.0, letterSpacing: '-2px', color: 'var(--text)',
              marginBottom: 28,
            }}>
              The detective<br />who finds<br />the{' '}
              <em style={{ color: 'var(--amber)', fontStyle: 'italic' }}>error.</em>
            </h1>

            <div style={{
              borderLeft: '2px solid var(--border2)', paddingLeft: 20, marginBottom: 16,
              fontSize: 17, lineHeight: 1.7, color: 'var(--text2)', maxWidth: 520,
            }}>
              Every company has a problem nobody owns.<br />
              <strong style={{ color: 'var(--text)', fontWeight: 600 }}>
                I build the control that catches it — before it costs money.
              </strong>
            </div>

            <div style={{
              paddingLeft: 20, marginBottom: 36, minHeight: 24,
              fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: 'var(--teal)',
            }}>
              {typedText}<span className="cursor" style={{ display: 'inline-block', width: 2, height: 14, background: 'var(--teal)', marginLeft: 2, verticalAlign: 'middle' }}>|</span>
            </div>

            {/* Stats */}
            <div ref={statsRef} style={{ display: 'flex', gap: 36, paddingLeft: 20, marginBottom: 40, flexWrap: 'wrap' }}>
              {STATS.map((s, i) => (
                <div key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontSize: 36, lineHeight: 1, color: 'var(--text)', letterSpacing: '-1px',
                  }}>
                    {i === 0 ? counters[i] : i === 1 ? counters[i].toLocaleString() : counters[i]}
                    <span style={{ color: 'var(--amber)' }}>+</span>
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Links */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingLeft: 20 }}>
              {LINKS.map(l => (
                <motion.a
                  key={l.label}
                  href={l.href}
                  target={l.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener"
                  whileHover={{ y: -2, borderColor: 'var(--text3)' }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 7,
                    fontSize: 12, fontWeight: 500, color: 'var(--text2)',
                    textDecoration: 'none', padding: '8px 14px',
                    border: '1px solid var(--border2)', borderRadius: 4,
                    background: 'var(--bg2)', transition: 'all 0.2s',
                  }}
                >
                  <IconSVG type={l.icon} />
                  {l.label}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Right - Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}
          >
            <GlowBorder color="#F59E0B" borderRadius="14px">
              <img
                src="/photo.jpg"
                alt="Tata Raam Kumar"
                style={{
                  width: 200, height: 200, objectFit: 'cover', objectPosition: 'center top',
                  display: 'block', borderRadius: 12,
                }}
                onError={e => {
                  const img = e.currentTarget
                  img.style.background = 'var(--bg3)'
                  img.style.width = '200px'
                  img.style.height = '200px'
                }}
              />
            </GlowBorder>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 18, color: 'var(--text)', marginBottom: 4 }}>
                Tata Raam Kumar
              </div>
              <div style={{ fontSize: 12, color: 'var(--text3)' }}>Karur, Tamil Nadu · India</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
              {[
                { label: 'OPEN TO EMPLOYMENT — REMOTE', color: 'var(--teal)', borderColor: 'rgba(20,184,166,0.3)' },
                { label: 'OPEN TO CONTRACTS — ANY UTC', color: 'var(--amber)', borderColor: 'rgba(245,158,11,0.3)' },
              ].map(a => (
                <div key={a.label} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px',
                  border: `1px solid ${a.borderColor}`, borderRadius: 4,
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600,
                  letterSpacing: '0.05em', color: a.color,
                }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%', background: a.color,
                    boxShadow: `0 0 6px ${a.color}`, animation: 'pulse-dot 2s ease-in-out infinite', flexShrink: 0,
                  }} />
                  {a.label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', bottom: -60, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text3)', letterSpacing: '0.1em',
          }}
        >
          SCROLL
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, var(--text3), transparent)' }} />
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
        @keyframes glow-rotate { to { transform: rotate(360deg); } }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
      `}</style>
    </section>
  )
}
