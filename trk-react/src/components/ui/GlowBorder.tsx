import { type ReactNode } from 'react'

interface Props {
  children: ReactNode
  color?: string
  className?: string
  borderRadius?: string
}

export function GlowBorder({ children, color = '#F59E0B', className = '', borderRadius = '12px' }: Props) {
  return (
    <div className={`relative ${className}`} style={{ borderRadius }}>
      <div style={{
        position: 'absolute', inset: '-2px', borderRadius,
        background: `conic-gradient(${color}, ${color}44, ${color}22, ${color}44, ${color})`,
        animation: 'glow-rotate 4s linear infinite', zIndex: 0,
      }} />
      <div style={{ position: 'absolute', inset: '1px', borderRadius: `calc(${borderRadius} - 2px)`, background: 'var(--bg)', zIndex: 1 }} />
      <div style={{ position: 'relative', zIndex: 2, borderRadius: `calc(${borderRadius} - 2px)`, overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  )
}
