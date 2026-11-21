interface Props {
  code: string
  explanation: string
  accentColor?: string
}

export function FormulaBox({ code, explanation, accentColor = '#F59E0B' }: Props) {
  const highlighted = code
    .replace(/\b(IF|AND|OR|NOT|COUNTIFS|SUMPRODUCT|SUMIFS|VLOOKUP|DATEDIF|TODAY|MAX|MIN|ROUND|ABS|INDEX|MATCH|IFERROR|COUNTA)\b/g,
      '<span style="color:#818CF8">$1</span>')
    .replace(/"([^"]*)"/g, '<span style="color:#F59E0B">"$1"</span>')
    .replace(/\/\*([^*]*)\*\//g, '<span style="color:var(--text3)">/*$1*/</span>')

  return (
    <div style={{
      marginTop: 16, border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden',
    }}>
      <div style={{
        padding: '8px 14px', background: 'var(--bg3)',
        fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600,
        letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)',
        borderBottom: '1px solid var(--border)',
      }}>
        Formula Logic
      </div>
      <div
        style={{
          padding: 14, fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
          color: '#94A3B8', lineHeight: 1.6, background: 'var(--bg)',
          borderLeft: `3px solid ${accentColor}`,
        }}
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
      <div style={{
        padding: '12px 14px', fontSize: 12, lineHeight: 1.65, color: 'var(--text2)',
        background: 'var(--bg2)', borderTop: '1px solid var(--border)',
      }}
        dangerouslySetInnerHTML={{ __html: explanation }}
      />
    </div>
  )
}
