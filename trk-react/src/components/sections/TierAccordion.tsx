import { useState, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MagicCard } from '../ui/MagicCard'

interface TierProps {
  num: string
  level: string
  title: string
  color: string
  children: ReactNode
  defaultOpen?: boolean
}

export function TierAccordion({ num, level, title, color, children, defaultOpen = false }: TierProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <MagicCard
      glowColor={`${color}22`}
      style={{
        border: `1px solid var(--border)`,
        borderTop: `2px solid ${color}`,
        borderRadius: 8,
        background: 'var(--bg2)',
        marginBottom: 8,
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', padding: '18px 20px', background: 'none', border: 'none',
          cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg3)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600,
            padding: '3px 8px', borderRadius: 3, border: `1px solid ${color}`,
            color, opacity: 0.9,
          }}>
            {num}
          </span>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 2 }}>
              {level}
            </div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 19, color: 'var(--text)', lineHeight: 1.2 }}>
              {title}
            </div>
          </div>
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          style={{ fontSize: 16, color: 'var(--text3)', flexShrink: 0 }}
        >
          ▾
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden', borderTop: '1px solid var(--border)' }}
          >
            <div style={{ padding: 24 }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MagicCard>
  )
}
