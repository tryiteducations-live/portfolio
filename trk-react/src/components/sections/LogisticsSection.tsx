import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionWrapper, SectionHeader, SceneCTA } from './SectionWrapper'
import { TierAccordion } from './TierAccordion'
import { LiveTable, ColumnDef } from './LiveTable'
import { FormulaBox } from './FormulaBox'
import { ToolChips } from './ToolChips'

const COLOR = '#F59E0B'

function computeShipException(row: Record<string, string>, allRows: Record<string, string>[]) {
  const exp = row.expected || ''
  const act = row.actual || ''
  const qd = parseFloat(row.qty_dispatched) || 0
  const qr = parseFloat(row.qty_received) || 0
  let delay = 0
  if (act) {
    const a = new Date(act), e = new Date(exp)
    if (!isNaN(a.getTime()) && !isNaN(e.getTime())) delay = Math.max(0, Math.round((a.getTime() - e.getTime()) / 86400000))
  } else {
    const e = new Date(exp)
    if (!isNaN(e.getTime())) delay = Math.max(0, Math.round((Date.now() - e.getTime()) / 86400000))
  }
  if (qr && qd && qr < qd) return { value: `Qty Short ${qr - qd}KL`, variant: 'red', mono: true }
  if (!act && delay > 0) return { value: `Pending GR +${delay}d`, variant: 'amber', mono: true }
  if (act && delay > 0) return { value: `Late +${delay}d`, variant: 'red', mono: true }
  if (act && delay < 0) return { value: 'Early Delivery', variant: 'green', mono: true }
  return { value: 'On Time', variant: 'green', mono: true }
}

function computeDelay(row: Record<string, string>) {
  const exp = row.expected || '', act = row.actual || ''
  if (act) {
    const a = new Date(act), e = new Date(exp)
    if (!isNaN(a.getTime()) && !isNaN(e.getTime())) return { value: String(Math.max(0, Math.round((a.getTime() - e.getTime()) / 86400000))), mono: true }
  } else {
    const e = new Date(exp)
    if (!isNaN(e.getTime())) return { value: String(Math.max(0, Math.round((Date.now() - e.getTime()) / 86400000))), mono: true }
  }
  return { value: '0', mono: true }
}

function computeInvoiceFlag(row: Record<string, string>, allRows: Record<string, string>[]) {
  const agreed = parseFloat(row.agreed?.replace(/,/g, '') || '0')
  const invoiced = parseFloat(row.invoiced?.replace(/,/g, '') || '0')
  const v = invoiced - agreed
  const dups = allRows.filter(r2 => r2 !== row && r2.vendor === row.vendor && r2.route === row.route && r2.po === row.po)
  if (dups.length > 0) return { value: 'Duplicate Invoice', variant: 'red', mono: true }
  if (Math.abs(v) > 0) return { value: `Rate Mismatch +₹${Math.abs(v).toLocaleString()}`, variant: 'red', mono: true }
  return { value: 'Clean', variant: 'green', mono: true }
}

function computeVendorStatus(row: Record<string, string>) {
  const exp = new Date(row.expiry || '')
  if (isNaN(exp.getTime())) return { value: 'Unknown', variant: 'gray', mono: true }
  const days = Math.round((exp.getTime() - Date.now()) / 86400000)
  if (days < 0) return { value: 'EXPIRED — Stop Ops', variant: 'red', mono: true }
  if (days <= 7) return { value: `Expiring URGENT (${days}d)`, variant: 'red', mono: true }
  if (days <= 30) return { value: `Expiring Soon (${days}d)`, variant: 'amber', mono: true }
  return { value: `Valid (${days}d)`, variant: 'green', mono: true }
}

const SHIP_COLS: ColumnDef[] = [
  { key: 'id', header: 'Shipment' },
  { key: 'vendor', header: 'Vendor' },
  { key: 'expected', header: 'Expected' },
  { key: 'actual', header: 'Actual Delivery', editable: true },
  { key: 'qty_dispatched', header: 'Qty Dispatched (KL)', editable: true },
  { key: 'qty_received', header: 'Qty Received (KL)', editable: true },
  { key: '_delay', header: 'Delay (days)', computed: computeDelay },
  { key: '_exc', header: 'Exception', computed: computeShipException },
]

const SHIP_DATA = [
  { id: 'SH-1041', vendor: 'Ravi Transport', expected: '2024-11-10', actual: '2024-11-10', qty_dispatched: '500', qty_received: '500' },
  { id: 'SH-1042', vendor: 'Sri Krishna', expected: '2024-11-08', actual: '2024-11-14', qty_dispatched: '480', qty_received: '480' },
  { id: 'SH-1043', vendor: 'Murugan Carriers', expected: '2024-11-11', actual: '', qty_dispatched: '600', qty_received: '' },
  { id: 'SH-1044', vendor: 'Ravi Transport', expected: '2024-11-12', actual: '2024-11-12', qty_dispatched: '520', qty_received: '490' },
  { id: 'SH-1045', vendor: 'VK Road Lines', expected: '2024-11-14', actual: '2024-11-13', qty_dispatched: '550', qty_received: '550' },
]

const INV_COLS: ColumnDef[] = [
  { key: 'inv', header: 'Invoice #' },
  { key: 'vendor', header: 'Vendor' },
  { key: 'route', header: 'Route' },
  { key: 'po', header: 'PO Ref' },
  { key: 'agreed', header: 'Agreed ₹', editable: true },
  { key: 'invoiced', header: 'Invoiced ₹', editable: true },
  { key: '_flag', header: 'Flag', computed: computeInvoiceFlag },
]

const INV_DATA = [
  { inv: 'INV-2841', vendor: 'Ravi Transport', route: 'CHN→TRY', po: 'PO-4411', agreed: '12400', invoiced: '12400' },
  { inv: 'INV-2842', vendor: 'Sri Krishna', route: 'CBE→SLM', po: 'PO-4412', agreed: '9800', invoiced: '11200' },
  { inv: 'INV-2843', vendor: 'Murugan', route: 'MDU→KRR', po: 'PO-4413', agreed: '7600', invoiced: '7600' },
  { inv: 'INV-2844', vendor: 'Sri Krishna', route: 'CBE→SLM', po: 'PO-4412', agreed: '9800', invoiced: '9800' },
  { inv: 'INV-2845', vendor: 'VK Road Lines', route: 'CHN→TRY', po: 'PO-4414', agreed: '15600', invoiced: '15600' },
]

const VEND_COLS: ColumnDef[] = [
  { key: 'vendor', header: 'Vendor' },
  { key: 'doc', header: 'Document' },
  { key: 'sap_num', header: 'SAP Vendor #' },
  { key: 'expiry', header: 'Expiry Date', editable: true },
  { key: 'crm_tickets', header: 'CRM Tickets Open', editable: true },
  { key: '_status', header: 'Status', computed: computeVendorStatus },
]

const VEND_DATA = [
  { vendor: 'Sri Krishna', doc: 'Motor Insurance', sap_num: 'V-10042', expiry: '2024-12-12', crm_tickets: '0' },
  { vendor: 'Murugan Carriers', doc: 'Vehicle Fitness (RC)', sap_num: 'V-10044', expiry: '2024-11-03', crm_tickets: '3' },
  { vendor: 'VK Road Lines', doc: 'GST Registration', sap_num: 'V-10048', expiry: '2025-03-31', crm_tickets: '1' },
  { vendor: 'Ravi Transport', doc: 'Driver Licence', sap_num: 'V-10041', expiry: '2024-11-18', crm_tickets: '2' },
]

function computeKPIStatus(row: Record<string, string>) {
  const curr = parseFloat(row.current?.replace(/[^0-9.-]/g, '') || '0')
  const target = parseFloat(row.target?.replace(/[^0-9.-]/g, '') || '0')
  const isHigher = row.target?.startsWith('>')
  const onTrack = isHigher ? curr >= target : curr <= target
  if (onTrack) return { value: 'On Track', variant: 'green', mono: true }
  const prev = parseFloat(row.prior?.replace(/[^0-9.-]/g, '') || '0')
  const worsening = isHigher ? curr < prev : curr > prev
  return { value: worsening ? 'Escalate' : 'Watch', variant: worsening ? 'red' : 'amber', mono: true }
}

const KPI_COLS: ColumnDef[] = [
  { key: 'kpi', header: 'KPI', width: 220 },
  { key: 'current', header: 'Current Value', editable: true },
  { key: 'prior', header: 'Prior Month' },
  { key: 'target', header: 'Target' },
  { key: '_status', header: 'Status', computed: computeKPIStatus },
]

const KPI_DATA = [
  { kpi: 'On-Time Delivery Rate', current: '78%', prior: '84%', target: '>90%' },
  { kpi: 'Invoice Error Rate (MIRO)', current: '4.2%', prior: '2.1%', target: '<2%' },
  { kpi: 'Vendor Compliance Rate', current: '73%', prior: '88%', target: '>95%' },
  { kpi: 'Avg Delay Days (VL02N)', current: '3.2', prior: '1.8', target: '<1' },
  { kpi: 'CRM Open Tickets', current: '7', prior: '3', target: '0' },
]

// SAP Modal
function SAPModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(0,0,0,0.9)', overflowY: 'auto', padding: '40px 20px',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 40 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{
          maxWidth: 900, margin: '0 auto',
          background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 12, overflow: 'hidden',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 24px', background: 'var(--bg3)', borderBottom: '1px solid var(--border)',
        }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: COLOR, letterSpacing: '0.06em' }}>
            SAP ERP · CONTROL ROOM · BPCL OPERATIONS
          </span>
          <button onClick={onClose} style={{
            background: 'none', border: '1px solid var(--border2)', borderRadius: 4,
            color: 'var(--text2)', padding: '4px 12px', cursor: 'pointer',
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
          }}>✕ CLOSE</button>
        </div>
        <div style={{ padding: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
            {[
              { l: 'ACTIVE SHIPMENTS', v: '47', c: COLOR },
              { l: 'EXCEPTIONS (MRBR)', v: '3', c: '#EF4444' },
              { l: 'INVOICES TODAY', v: '68', c: '#22C55E' },
              { l: 'ACTIVE VENDORS', v: '15', c: '#818CF8' },
            ].map(s => (
              <div key={s.l} style={{
                background: 'var(--bg3)', border: '1px solid var(--border)',
                borderTop: `2px solid ${s.c}`, borderRadius: 6, padding: '14px',
              }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text3)', marginBottom: 4 }}>{s.l}</div>
                <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, color: s.c }}>{s.v}</div>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 12, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text3)', letterSpacing: '0.06em' }}>
            SAP TRANSACTION CODES IN USE AT BPCL
          </div>
          <div style={{
            padding: '12px 14px', background: 'var(--bg)', border: '1px solid var(--border)',
            borderLeft: `3px solid ${COLOR}`, borderRadius: 4, fontSize: 12, color: 'var(--text2)', lineHeight: 1.7,
          }}>
            <strong style={{ color: 'var(--text)' }}>MIRO</strong> — Invoice Verification & Posting (MM-FI) ·{' '}
            <strong style={{ color: 'var(--text)' }}>VL02N</strong> — Outbound Delivery Change ·{' '}
            <strong style={{ color: 'var(--text)' }}>ME23N</strong> — Purchase Order Display ·{' '}
            <strong style={{ color: 'var(--text)' }}>MRBR</strong> — Release Blocked Invoices ·{' '}
            <strong style={{ color: 'var(--text)' }}>FBL1N</strong> — Vendor Line Items ·{' '}
            <strong style={{ color: 'var(--text)' }}>CRMD_ORDER</strong> — SAP CRM Service Tickets ·{' '}
            <strong style={{ color: 'var(--text)' }}>MB51</strong> — Material Document List ·{' '}
            <strong style={{ color: 'var(--text)' }}>MIGO</strong> — Goods Receipt
          </div>
          <p style={{ marginTop: 12, fontSize: 12, color: 'var(--text3)' }}>
            SAP ERP (MM, SD, FI, CO, PM modules) and SAP CRM were fully operational at BPCL throughout this tenure.
            The CAG 2022 audit finding was specifically about management-level manual override of ERP outputs — not an absence of the software.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function LogisticsSection() {
  const [sapOpen, setSapOpen] = useState(false)

  return (
    <>
      <SectionWrapper id="s-logistics" accentColor={COLOR} bgGlow="rgba(245,158,11,0.06)">
        <SectionHeader
          tag="Scene 01 · 2016 → Present"
          title={'BPCL Petroleum\nOperations'}
          org="Operations & Logistics Control · Bharat Petroleum Corporation Limited"
          hook="SAP ERP was running. CRM was logging vendor tickets. Tankers were moving."
          hookBold="And money was still leaking — because nobody owned the exception."
          color={COLOR}
          stats={[
            { n: '60–80', l: 'Invoices weekly' },
            { n: '15', l: 'Active vendors' },
            { n: '12+', l: 'Discrepancies caught yr 1' },
            { n: '3', l: 'Depot routes tracked' },
          ]}
          dividerBefore="Before: Invoice errors found in monthly SAP batch run — 4–6 weeks after payment"
          dividerAfter="After: Exception flagged at MIRO posting — same day, before payment releases"
        />

        {/* BPCL Depot SVG Scene */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          style={{
            marginBottom: 48, border: '1px solid var(--border)', borderRadius: 12,
            overflow: 'hidden', background: 'var(--bg2)', cursor: 'pointer',
          }}
          onClick={() => setSapOpen(true)}
        >
          <svg viewBox="0 0 900 260" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%', background: '#070B14' }}>
            <defs>
              <radialGradient id="lg1" cx="20%" cy="0%" r="60%"><stop offset="0%" stopColor="#F59E0B" stopOpacity="0.12"/><stop offset="100%" stopColor="#F59E0B" stopOpacity="0"/></radialGradient>
              <linearGradient id="tankG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#374151"/><stop offset="100%" stopColor="#1F2937"/></linearGradient>
              <linearGradient id="truckG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#D97706"/><stop offset="100%" stopColor="#B45309"/></linearGradient>
            </defs>
            <rect x="0" y="0" width="900" height="260" fill="url(#lg1)"/>
            <rect x="0" y="210" width="900" height="50" fill="#111827"/>
            <rect x="0" y="208" width="900" height="3" fill="#1E2740"/>
            {[100,220,340,460,580,700].map(x => <rect key={x} x={x} y="224" width="60" height="3" fill="#2A3550" rx="1"/>)}
            {/* Storage tanks */}
            <ellipse cx="720" cy="168" rx="52" ry="10" fill="#374151"/>
            <rect x="668" y="90" width="104" height="80" fill="url(#tankG)" rx="3"/>
            <ellipse cx="720" cy="90" rx="52" ry="10" fill="#4B5563"/>
            <text x="720" y="135" textAnchor="middle" fill="#6B7280" fontSize="10" fontFamily="monospace" fontWeight="600">BPCL</text>
            <text x="720" y="150" textAnchor="middle" fill="#4B5563" fontSize="8" fontFamily="monospace">HSD-01</text>
            <ellipse cx="800" cy="178" rx="42" ry="8" fill="#374151"/>
            <rect x="758" y="108" width="84" height="72" fill="url(#tankG)" rx="3"/>
            <ellipse cx="800" cy="108" rx="42" ry="8" fill="#4B5563"/>
            <ellipse cx="650" cy="175" rx="38" ry="8" fill="#374151"/>
            <rect x="612" y="110" width="76" height="66" fill="url(#tankG)" rx="3"/>
            <ellipse cx="650" cy="110" rx="38" ry="8" fill="#4B5563"/>
            {/* Floodlights */}
            <rect x="150" y="80" width="4" height="130" fill="#374151"/>
            <ellipse cx="152" cy="78" rx="12" ry="4" fill="#F59E0B" opacity="0.9"/>
            <rect x="550" y="80" width="4" height="130" fill="#374151"/>
            <ellipse cx="552" cy="78" rx="12" ry="4" fill="#F59E0B" opacity="0.9"/>
            {/* Truck */}
            <rect x="260" y="168" width="220" height="58" fill="url(#truckG)" rx="4"/>
            <rect x="310" y="183" width="120" height="28" fill="#B45309" rx="2"/>
            <text x="370" y="200" textAnchor="middle" fill="#FCD34D" fontSize="11" fontFamily="monospace" fontWeight="700">BPCL</text>
            {[300,380,460].map(x => <line key={x} x1={x} y1="168" x2={x} y2="226" stroke="#92400E" strokeWidth="1.5"/>)}
            <rect x="200" y="175" width="68" height="51" fill="#1D4ED8" rx="4"/>
            <rect x="206" y="181" width="40" height="22" fill="#93C5FD" rx="2" opacity="0.7"/>
            {[232,308,420,460].map(cx => (
              <g key={cx}><circle cx={cx} cy="230" r="16" fill="#111827" stroke="#374151" strokeWidth="2"/><circle cx={cx} cy="230" r="8" fill="#1F2937"/><circle cx={cx} cy="230" r="3" fill="#374151"/></g>
            ))}
            {/* Click hint */}
            <rect x="200" y="140" width="160" height="22" fill="rgba(245,158,11,0.15)" rx="4" stroke="rgba(245,158,11,0.4)" strokeWidth="1"/>
            <text x="280" y="155" textAnchor="middle" fill="#F59E0B" fontSize="9" fontFamily="monospace" fontWeight="600">▶ CLICK — OPEN SAP CONTROL ROOM</text>
            {/* Office */}
            <rect x="40" y="140" width="90" height="70" fill="#1E2740" stroke="#2A3550" strokeWidth="1" rx="2"/>
            <rect x="55" y="185" width="60" height="20" fill="#064E3B" rx="1" opacity="0.8"/>
            <text x="85" y="197" textAnchor="middle" fill="#34D399" fontSize="6" fontFamily="monospace">SAP ✓</text>
            <text x="85" y="203" textAnchor="middle" fill="#EF4444" fontSize="6" fontFamily="monospace">ALERT: 3</text>
            {/* Stars */}
            {[[500,20],[560,40],[600,15],[750,30],[830,20],[880,50]].map(([x,y]) => (
              <circle key={`${x}${y}`} cx={x} cy={y} r="1" fill="white" opacity="0.4"/>
            ))}
          </svg>
        </motion.div>

        <TierAccordion num="T-01" level="Foundation" title="Shipment Exception Early-Warning System" color={COLOR} defaultOpen>
          <div className="tier-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 24 }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 10 }}>The Real Daily Pain</p>
              <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, padding: '16px 18px', fontSize: 13, lineHeight: 1.65, color: 'var(--text2)' }}>
                <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>What happened:</strong> Tanker left Monday. SAP VL02N showed "in transit." Thursday — no MIGO posted, invoice already raised. Payment queued.</p>
                <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>Root cause:</strong> SAP showed dispatch. Nothing showed arrival. The VL02N → MIGO gap had no alert, no owner.</p>
                <div style={{ marginTop: 10, padding: '10px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 4, color: '#FCA5A5', fontSize: 12 }}>
                  ⚠ At 60–80 invoices/week, 3% error rate = ₹18,000–25,000 monthly unrecovered without early detection.
                </div>
              </div>
            </div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 10 }}>Live Demo — Edit Yellow Cells</p>
              <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
                <LiveTable id="ship-register" columns={SHIP_COLS} initialData={SHIP_DATA} accentColor={COLOR} title="SHIPMENT EXCEPTION REGISTER" />
              </div>
            </div>
          </div>
          <FormulaBox
            accentColor={COLOR}
            code={`Delay_Days = IF(Actual_GR="", MAX(0,TODAY()-Expected), MAX(0,Actual_GR-Expected))
Qty_Variance = IF(Qty_Received="", "Pending", Qty_Received - Qty_Dispatched)
Exception = IF(Qty_Variance<0, "Qty Short " & Qty_Variance & "KL",
  IF(Actual_GR="", "Pending GR +" & Delay_Days & "d",
  IF(Delay_Days>0, "Late +" & Delay_Days & "d", "On Time")))`}
            explanation="<strong>Why SAP alone was not enough:</strong> SAP posted VL02N (dispatch) correctly. But MIGO (Goods Receipt) entry depended on a manual clerk posting within 24 hours. When delayed — which happened 20–30% of the time — invoices cleared MIRO without any matching GR. This register bridges the SAP gap independently, with quantity verification at physical receipt. At 60–80 invoices weekly with 3% error rate, early detection vs monthly reconciliation recovers an estimated ₹18,000–25,000 monthly."
          />
          <ToolChips tools={['⚙ SAP ERP (MIRO/VL02N/ME23N)', '⚙ SAP CRM (CRMD_ORDER)', '📊 Excel XLOOKUP/COUNTIFS', '🗃 SQL GR-IR reconciliation', '🐍 Python pandas', '📧 SAP workflow notifications']} />
        </TierAccordion>

        <TierAccordion num="T-02" level="Commercial" title="Freight Invoice Leakage Detection — Duplicate + Rate Mismatch" color={COLOR}>
          <div className="tier-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 24 }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 10 }}>The Real Daily Pain</p>
              <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, padding: '16px 18px', fontSize: 13, lineHeight: 1.65, color: 'var(--text2)' }}>
                <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>What happened:</strong> Same vendor, same route, same week — INV-2842 and INV-2844 passed MIRO. Same PO reference. ₹9,800 paid twice. Found in FBL1N during monthly close — 6 weeks later.</p>
                <p><strong style={{ color: 'var(--text)' }}>Root cause:</strong> SAP's duplicate check only flags exact document number matches. Same invoice with different reference numbers — both pass. Rate agreement was in a separate Excel the MIRO clerk never opened.</p>
                <div style={{ marginTop: 10, padding: '10px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 4, color: '#FCA5A5', fontSize: 12 }}>
                  ⚠ Freight billing errors: 2–5% of total freight spend. On ₹8–12L monthly freight, that is ₹16,000–60,000 annually undetected.
                </div>
              </div>
            </div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 10 }}>20 Invoices · 2 Planted Errors</p>
              <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
                <LiveTable id="inv-audit" columns={INV_COLS} initialData={INV_DATA} accentColor={COLOR} title="FREIGHT INVOICE RECONCILIATION ENGINE" />
              </div>
            </div>
          </div>
          <FormulaBox
            accentColor={COLOR}
            code={`Rate_Variance = Invoiced_Amount - VLOOKUP(Vendor&Route, Rate_Master, 3, 0)
Duplicate_Flag = IF(COUNTIFS(Vendor_Col,[@Vendor], Route_Col,[@Route], PO_Col,[@PO]) > 1, "⚠ DUPLICATE", "Unique")
Final_Flag = IF(Duplicate_Flag="⚠ DUPLICATE", "Duplicate Invoice",
  IF(ABS(Rate_Variance) > 0, "Rate Mismatch +₹" & Rate_Variance, "Clean"))`}
            explanation="<strong>Why COUNTIFS beats SAP native duplicate check:</strong> SAP checks the Reference Document Number field — a string vendors control. Changing one digit bypasses SAP. COUNTIFS matches on three independent fields simultaneously (Vendor + Route + PO Reference) — a combination a vendor cannot accidentally replicate on a legitimate second invoice. INV-2842 has ₹1,400 rate mismatch. INV-2844 is an exact duplicate of INV-2842's route and PO. Both caught instantly."
          />
          <ToolChips tools={['⚙ SAP MIRO/FBL1N', '📊 Excel COUNTIFS', '🔗 VLOOKUP Rate Master', '🐍 Python openpyxl', '🗃 SQL dedup query', '📋 Tally ERP cross-check']} />
        </TierAccordion>

        <TierAccordion num="T-03" level="Compliance" title="Vendor Document Expiry & SAP CRM Ticket Control" color={COLOR}>
          <div className="tier-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 24 }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 10 }}>The Real Daily Pain</p>
              <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, padding: '16px 18px', fontSize: 13, lineHeight: 1.65, color: 'var(--text2)' }}>
                <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>What happened:</strong> A contractor's insurance expired March. SAP PM work order raised April. Liability claim August. Insurance invalid. BPCL bore full exposure.</p>
                <p><strong style={{ color: 'var(--text)' }}>SAP CRM role:</strong> Vendor complaints logged in CRMD_ORDER but not linked to document expiry. CRM showed 3 open tickets — nobody connected them to the compliance gap.</p>
                <div style={{ marginTop: 10, padding: '10px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 4, color: '#FCA5A5', fontSize: 12 }}>
                  ⚠ Insurance renewal: ₹12,000. Liability exposure: ₹18 lakh. 150× cost amplification from one missed alert.
                </div>
              </div>
            </div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 10 }}>Edit Expiry Dates — Status Auto-Updates</p>
              <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
                <LiveTable id="vend-compliance" columns={VEND_COLS} initialData={VEND_DATA} accentColor={COLOR} title="VENDOR COMPLIANCE + CRM REGISTER" />
              </div>
            </div>
          </div>
          <FormulaBox
            accentColor={COLOR}
            code={`Days_Left = DATEDIF(TODAY(), Expiry_Date, "D")
Status = IF(Days_Left < 0, "EXPIRED — Stop Operations",
  IF(Days_Left <= 7, "Expiring URGENT",
  IF(Days_Left <= 30, "Expiring Soon", "Valid")))
CRM_Combined_Risk = IF(CRM_Tickets_Open > 2 AND Status <> "Valid",
  "ESCALATE: CRM tickets + compliance gap", "Review per standard SOP")`}
            explanation="<strong>The CRM-compliance link:</strong> SAP CRM tickets are independent of MM document checks. This register cross-references open CRM tickets (vendor complaints) with document compliance status. A vendor with 3 open CRM tickets AND an expiring document is a compound risk — escalate before assigning any new SAP PM work order. Murugan Carriers: expired RC + 3 open CRM tickets = do not assign until both resolved."
          />
          <ToolChips tools={['⚙ SAP CRM (CRMD_ORDER)', '⚙ SAP MM Vendor Master', '⚙ SAP PM Work Orders', '📊 Excel DATEDIF', '📧 SAP workflow alerts', '🗂 DMS filing system', '📋 Tally vendor ledger']} />
        </TierAccordion>

        <TierAccordion num="T-04" level="Management" title="Supply Chain KPI Dashboard — Executive Decision View" color={COLOR}>
          <div className="tier-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 24 }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 10 }}>The Real Daily Pain</p>
              <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, padding: '16px 18px', fontSize: 13, lineHeight: 1.65, color: 'var(--text2)' }}>
                <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>What happened:</strong> Depot manager received three separate SAP reports monthly: MB51 (stock movements), FBL1N (vendor line items), manual Excel from compliance. All three contradicted each other. Nobody could answer: who is our biggest risk today?</p>
                <p><strong style={{ color: 'var(--text)' }}>Root cause:</strong> SAP standard reports are module-specific. No cross-module KPI view existed. Management saw cost totals, not risk concentration.</p>
              </div>
            </div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 10 }}>Edit Current Value — Status Recalculates</p>
              <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
                <LiveTable id="kpi-dashboard" columns={KPI_COLS} initialData={KPI_DATA} accentColor={COLOR} title="INTEGRATED KPI DASHBOARD" />
              </div>
            </div>
          </div>
          <FormulaBox
            accentColor={COLOR}
            code={`Status = IF(KPI_type="higher_better",
  IF(Current >= Target, "On Track",
    IF(Current < Prior, "Escalate", "Watch")),
  IF(Current <= Target, "On Track",
    IF(Current > Prior, "Escalate", "Watch")))`}
            explanation="<strong>What management gets:</strong> Five KPIs from three SAP modules consolidated into one decision view. Invoice Error Rate at 4.2% vs 2% target while trending up = escalate to Finance today, not next month's review. The trend direction combined with threshold breach is the only signal management needs. Everything else is data."
          />
          <ToolChips tools={['⚙ SAP MB51/FBL1N', '📈 Power BI (SAP connector)', '🗃 SQL aggregation', '📊 Excel SUMPRODUCT', '🐍 Python matplotlib']} />
        </TierAccordion>

        <SceneCTA sectorLabel="Logistics" waParam="Hi%20Tata%20Raam%20Kumar%2C%20I%20reviewed%20your%20Logistics%20work%20and%20would%20like%20to%20discuss%20an%20opportunity." />
      </SectionWrapper>

      <AnimatePresence>
        {sapOpen && <SAPModal onClose={() => setSapOpen(false)} />}
      </AnimatePresence>
    </>
  )
}
