import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

export function useScrollReveal(selector: string, options = {}) {
  const containerRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(selector,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: selector, start: 'top 85%', toggleActions: 'play none none none' },
          ...options
        }
      )
    }, containerRef)
    return () => ctx.revert()
  }, [selector, options])
  return containerRef
}
