type Variant = 'red' | 'amber' | 'green' | 'blue' | 'teal' | 'gray'

interface Props {
  children: React.ReactNode
  variant?: Variant
  className?: string
}

export function Badge({ children, variant = 'gray', className = '' }: Props) {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {children}
    </span>
  )
}
