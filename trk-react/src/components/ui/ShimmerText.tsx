import { type ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
}

export function ShimmerText({ children, className = '' }: Props) {
  return (
    <span className={`shimmer-text ${className}`} style={{ display: 'inline-block' }}>
      {children}
    </span>
  )
}
