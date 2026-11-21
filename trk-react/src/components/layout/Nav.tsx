import { useEffect, useState } from 'react'
import { SECTORS } from '@/lib/data'

const sections = [
  { id: 's-logistics', label: 'Logistics' },
  { id: 's-education', label: 'Education' },
  { id: 's-intelligence', label: 'Intelligence' },
  { id: 's-aigrc', label: 'AI · GRC' },
  { id: 's-tools', label: 'Tools' },
  { id: 's-writing', label: 'Writing' },
  { id: 's-certs', label: 'Certs' },
]

const sectorColors: Record<string, string> = {
  Logistics: '#F59E0B', Education: '#14B8A6',
  Intelligence: '#818CF8', 'AI · GRC': '#F43F5E',
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setMobileOpen(false)
  }

  return (
    <>
      <nav
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          height: 52,
          background: scrolled ? 'rgba(6,8,12,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : 'none',
          transition: 'background 0.3s, backdrop-filter 0.3s, border-color 0.3s',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px',
        }}
      >
        <a
          href="#"
          onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600,
            color: '#F59E0B', letterSpacing: '0.04em', textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          <span style={{ color: 'var(--text3)' }}>&gt;</span> TRK
        </a>

        {/* Desktop nav */}
        <ul style={{ display: 'flex', gap: 2, listStyle: 'none', margin: 0, padding: 0 }}
          className="hidden-mobile">
          {sections.map(s => (
            <li key={s.id}>
              <button
                onClick={() => scrollTo(s.id)}
                style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500,
                  color: 'var(--text2)', background: 'none', border: 'none', cursor: 'pointer',
                  padding: '5px 10px', borderRadius: 4, letterSpacing: '0.03em',
                  transition: 'color 0.15s, background 0.15s',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.color = sectorColors[s.label] || 'var(--text)'
                  el.style.background = 'var(--bg3)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.color = 'var(--text2)'
                  el.style.background = 'none'
                }}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <a
            href="https://wa.me/919566698821?text=Hi%20Tata%20Raam%20Kumar%2C%20I%20found%20your%20portfolio%20and%20would%20like%20to%20discuss%20an%20opportunity."
            target="_blank" rel="noopener"
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '7px 16px', background: '#F59E0B', color: '#000',
              borderRadius: 4, fontSize: 12, fontWeight: 700,
              textDecoration: 'none', transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#FCD34D' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#F59E0B' }}
          >
            Chat Now →
          </a>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'none' }}
            className="show-mobile"
            aria-label="Menu"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{ display: 'block', width: 20, height: 1.5, background: 'var(--text2)', borderRadius: 1, transition: 'all 0.3s' }} />
              ))}
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: 52, left: 0, right: 0, zIndex: 999,
          background: 'rgba(6,8,12,0.98)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)', padding: 16,
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {sections.map(s => (
            <button key={s.id} onClick={() => scrollTo(s.id)}
              style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
                color: 'var(--text2)', background: 'none', border: 'none', cursor: 'pointer',
                padding: '10px 12px', borderRadius: 4, textAlign: 'left',
                transition: 'all 0.15s',
              }}>
              ↳ {s.label}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </>
  )
}
