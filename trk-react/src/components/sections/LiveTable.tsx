import { useState, useCallback } from 'react'
import { Badge } from '@/components/ui/Badge'

export type ColumnDef = {
  key: string
  header: string
  editable?: boolean
  computed?: (row: Record<string, string>, allRows: Record<string, string>[]) => { value: string; variant?: string; mono?: boolean } | string
  mono?: boolean
  width?: number
}

interface Props {
  id: string
  columns: ColumnDef[]
  initialData: Record<string, string>[]
  accentColor?: string
  title?: string
  hint?: string
  onDownload?: (data: Record<string, string>[]) => void
  summaryFn?: (data: Record<string, string>[]) => string
}

export function LiveTable({ id, columns, initialData, accentColor = '#F59E0B', title, hint, summaryFn }: Props) {
  const [data, setData] = useState<Record<string, string>[]>(initialData.map(r => ({ ...r })))

  const handleEdit = useCallback((rowIdx: number, key: string, value: string) => {
    setData(prev => {
      const next = prev.map((r, i) => i === rowIdx ? { ...r, [key]: value } : { ...r })
      return next
    })
  }, [])

  const downloadCSV = () => {
    const headers = columns.map(c => c.header).join(',')
    const rows = data.map(row =>
      columns.map(col => {
        if (col.computed) {
          const result = col.computed(row, data)
          const val = typeof result === 'string' ? result : result.value
          return `"${val.replace(/"/g, '""')}"`
        }
        return `"${(row[col.key] || '').replace(/"/g, '""')}"`
      }).join(',')
    )
    const csv = [headers, ...rows].join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = `${id}.csv`
    a.click()
  }

  const summary = summaryFn ? summaryFn(data) : null

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '9px 14px', background: accentColor, color: accentColor === '#F59E0B' ? '#000' : '#fff',
        fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
      }}>
        <span>{title}</span>
        <span style={{ opacity: 0.7, fontWeight: 400 }}>{hint || 'EDIT YELLOW CELLS — LIVE RECALC'}</span>
      </div>
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table className="data-table" id={id}>
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key} style={col.width ? { minWidth: col.width } : {}}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, ri) => (
              <tr key={ri}>
                {columns.map(col => {
                  if (col.computed) {
                    const result = col.computed(row, data)
                    if (typeof result === 'string') {
                      return <td key={col.key} className={col.mono ? 'td-mono' : ''}>{result}</td>
                    }
                    const badgeVariants = ['red', 'amber', 'green', 'blue', 'teal', 'gray'] as const
                    const isValidVariant = (v: string | undefined): v is typeof badgeVariants[number] =>
                      !!v && (badgeVariants as readonly string[]).includes(v)
                    return (
                      <td key={col.key} className={result.mono ? 'td-mono' : ''}>
                        {result.variant && isValidVariant(result.variant)
                          ? <Badge variant={result.variant}>{result.value}</Badge>
                          : <span style={result.mono ? { fontFamily: "'JetBrains Mono', monospace", fontSize: 11 } : {}}>{result.value}</span>
                        }
                      </td>
                    )
                  }
                  if (col.editable) {
                    return (
                      <td
                        key={col.key}
                        className="td-edit"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={e => handleEdit(ri, col.key, e.currentTarget.textContent || '')}
                      >
                        {row[col.key]}
                      </td>
                    )
                  }
                  return <td key={col.key} className={col.mono ? 'td-mono' : ''}>{row[col.key]}</td>
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {summary && (
        <div style={{
          padding: '8px 12px', background: 'var(--bg3)',
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text3)',
        }}>
          {summary}
        </div>
      )}
      <div style={{ padding: '10px 14px', background: 'var(--bg2)' }}>
        <button
          onClick={downloadCSV}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600,
            padding: '7px 14px', border: '1px solid var(--border2)', borderRadius: 4,
            color: 'var(--text2)', background: 'var(--bg3)', cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = accentColor; el.style.color = accentColor }}
          onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = 'var(--border2)'; el.style.color = 'var(--text2)' }}
        >
          ⬇ Download CSV
        </button>
      </div>
    </div>
  )
}
