interface Props {
  tools: string[]
}

export function ToolChips({ tools }: Props) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 16 }}>
      {tools.map(t => (
        <span key={t} style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          fontSize: 11, fontWeight: 500, padding: '4px 10px',
          borderRadius: 3, background: 'var(--bg3)', border: '1px solid var(--border)',
          color: 'var(--text2)', transition: 'all 0.15s', cursor: 'default',
        }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLSpanElement; el.style.borderColor = 'var(--text3)'; el.style.color = 'var(--text)' }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLSpanElement; el.style.borderColor = 'var(--border)'; el.style.color = 'var(--text2)' }}
        >
          {t}
        </span>
      ))}
    </div>
  )
}
