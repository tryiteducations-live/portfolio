import { useEffect, useRef } from 'react'
import React from 'react'

interface Props {
  className?: string
  style?: React.CSSProperties
}

export function AnimatedBeam({ className = '', style }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let animId: number
    let w = canvas.offsetWidth
    let h = canvas.offsetHeight
    canvas.width = w; canvas.height = h

    const pts = Array.from({ length: 80 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
    }))
    let mx = -999, my = -999

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mx = e.clientX - rect.left; my = e.clientY - rect.top
    }
    canvas.addEventListener('mousemove', onMove)

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(245,158,11,0.5)'; ctx.fill()
      })
      pts.forEach((a, i) => {
        pts.forEach((b, j) => {
          if (j <= i) return
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < 110) {
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(245,158,11,${0.18 * (1 - d / 110)})`
            ctx.lineWidth = 0.6; ctx.stroke()
          }
        })
        const dm = Math.hypot(a.x - mx, a.y - my)
        if (dm < 140) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mx, my)
          ctx.strokeStyle = `rgba(245,158,11,${0.4 * (1 - dm / 140)})`
          ctx.lineWidth = 0.9; ctx.stroke()
        }
      })
      animId = requestAnimationFrame(draw)
    }
    draw()

    const onResize = () => {
      w = canvas.offsetWidth; h = canvas.offsetHeight
      canvas.width = w; canvas.height = h
    }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(animId); canvas.removeEventListener('mousemove', onMove); window.removeEventListener('resize', onResize) }
  }, [])

  return <canvas ref={canvasRef} className={className} style={{ width: '100%', height: '100%', ...style }} />
}
