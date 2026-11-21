import { useState, useEffect, useRef } from 'react'

export function useTypewriter(phrases: string[], speed = 70, deleteSpeed = 40, pause = 2200) {
  const [text, setText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const phraseIndex = useRef(0)
  const charIndex = useRef(0)

  useEffect(() => {
    const tick = () => {
      const current = phrases[phraseIndex.current]
      if (!isDeleting) {
        setText(current.substring(0, charIndex.current + 1))
        charIndex.current++
        if (charIndex.current === current.length) {
          setTimeout(() => setIsDeleting(true), pause)
          return
        }
      } else {
        setText(current.substring(0, charIndex.current - 1))
        charIndex.current--
        if (charIndex.current === 0) {
          setIsDeleting(false)
          phraseIndex.current = (phraseIndex.current + 1) % phrases.length
        }
      }
    }
    const timer = setTimeout(tick, isDeleting ? deleteSpeed : speed)
    return () => clearTimeout(timer)
  }, [text, isDeleting, phrases, speed, deleteSpeed, pause])

  return text
}
