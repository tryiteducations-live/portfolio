import { type ReactNode, useRef, useState } from 'react'

interface Props {
  children: ReactNode
  className?: string
  glowColor?: string
  style?: React.CSSProperties
}

export function MagicCard({ children, className = '', glowColor = 'rgba(245,158,11,0.15)', style }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={style}
    >
      {hovered && (
        <div style={{
          position: 'absolute', left: pos.x - 150, top: pos.y - 150,
          width: 300, height: 300,
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          pointerEvents: 'none', zIndex: 1, transition: 'opacity 0.2s',
        }} />
      )}
      <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
    </div>
  )
}
