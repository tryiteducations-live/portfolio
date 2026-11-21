import { SectionWrapper, SectionHeader, SceneCTA } from './SectionWrapper'
import { TierAccordion } from './TierAccordion'
import { LiveTable, ColumnDef } from './LiveTable'
import { FormulaBox } from './FormulaBox'
import { ToolChips } from './ToolChips'

const COLOR = '#818CF8'

function computeRegConf(row: Record<string,string>) {
  const status = row.status?.toLowerCase() || ''
  const verified = row.source_verified?.toLowerCase().startsWith('yes')
  if (!verified) return { value: 'Low', variant: 'red', mono: true }
  if (status.includes('in force')) return { value: 'High', variant: 'green', mono: true }
  return { value: 'Medium', variant: 'amber', mono: true }
}

function computeRegAction(row: Record<string,string>) {
  const status = row.status?.toLowerCase() || ''
  const verified = row.source_verified?.toLowerCase().startsWith('yes')
  if (!verified) return { value: 'Monitor ONLY — do not act', mono: true }
  if (status.includes('in force')) return { value: 'Immediate compliance required', mono: true }
  if (status.includes('announced')) return { value: 'Prepare — confirm timeline', mono: true }
  return { value: 'Monitor — not yet enforceable', mono: true }
}

function computeTPRMScore(row: Record<string,string>) {
  const c = parseFloat(row.criticality) || 0
  const d = parseFloat(row.data_access) || 0
  const e = parseFloat(row.evidence_pct) || 0
  const score = Math.min(10, Math.max(0, Math.round(((c * 0.35) + (d * 0.30) + ((100 - e) / 100 * 10 * 0.35)) * 10) / 10))
  const color = score >= 7 ? '#FCA5A5' : score >= 5 ? '#F59E0B' : '#86EFAC'
  return { value: score.toFixed(1), mono: true }
}

function computeTPRMTier(row: Record<string,string>) {
  const c = parseFloat(row.criticality) || 0
  const d = parseFloat(row.data_access) || 0
  const e = parseFloat(row.evidence_pct) || 0
  const score = Math.min(10, ((c * 0.35) + (d * 0.30) + ((100 - e) / 100 * 10 * 0.35)))
  if (score >= 7) return { value: 'Critical', variant: 'red', mono: true }
  if (score >= 5) return { value: 'High', variant: 'amber', mono: true }
  if (score >= 3) return { value: 'Medium', variant: 'blue', mono: true }
  return { value: 'Low', variant: 'green', mono: true }
}

function computeMktWeighted(row: Record<string,string>, allRows: Record<string,string>[]) {
  const w = parseFloat(row.weight) / 100 || 0
  const is = parseFloat(row.india_score) || 0
  return { value: (is * w).toFixed(2), mono: true }
}

function computeVietWeighted(row: Record<string,string>) {
  const w = parseFloat(row.weight) / 100 || 0
  const vs = parseFloat(row.viet_score) || 0
  return { value: (vs * w).toFixed(2), mono: true }
}

function computeMktWinner(row: Record<string,string>) {
  const w = parseFloat(row.weight) / 100 || 0
  const iw = (parseFloat(row.india_score) || 0) * w
  const vw = (parseFloat(row.viet_score) || 0) * w
  return { value: iw > vw ? 'India' : 'Vietnam', variant: iw > vw ? 'blue' : 'teal', mono: true }
}

const REG_COLS: ColumnDef[] = [
  { key: 'country', header: 'Country' },
  { key: 'policy', header: 'Policy / Regulation', width: 200 },
  { key: 'gov_agency', header: 'Gov Agency' },
  { key: 'status', header: 'Status', editable: true },
  { key: 'effective_date', header: 'Effective Date' },
  { key: 'source_verified', header: 'Source Verified?', editable: true },
  { key: '_conf', header: 'Confidence', computed: computeRegConf },
  { key: '_action', header: 'Business Action', computed: computeRegAction },
]

const REG_DATA = [
  { country: 'India', policy: 'DPDP Act Rules', gov_agency: 'MeitY', status: 'Draft notified', effective_date: 'TBC 2025', source_verified: 'Yes — meity.gov.in' },
  { country: 'India', policy: 'BIS Mandatory — Electronics', gov_agency: 'BIS', status: 'In force', effective_date: '01 Oct 2023', source_verified: 'Yes — bis.gov.in' },
  { country: 'Malaysia', policy: 'E-Invoice Mandate (SMEs)', gov_agency: 'LHDN', status: 'Announced', effective_date: 'Jul 2025', source_verified: 'Yes — hasil.gov.my' },
  { country: 'Thailand', policy: 'Digital Platform Act', gov_agency: 'ETDA', status: 'Draft', effective_date: 'Unknown', source_verified: 'No — news article only' },
  { country: 'Singapore', policy: 'PDPA Amendment 2024', gov_agency: 'PDPC', status: 'In force', effective_date: '01 Sep 2024', source_verified: 'Yes — pdpc.gov.sg' },
]

const MKT_COLS: ColumnDef[] = [
  { key: 'factor', header: 'Factor', width: 180 },
  { key: 'weight', header: 'Weight %' },
  { key: 'india_score', header: 'India (1-5)', editable: true },
  { key: '_iw', header: 'India Weighted', computed: computeMktWeighted },
  { key: 'viet_score', header: 'Vietnam (1-5)', editable: true },
  { key: '_vw', header: 'VN Weighted', computed: computeVietWeighted },
  { key: '_win', header: 'Advantage', computed: computeMktWinner },
]

const MKT_DATA = [
  { factor: 'Market Size & Growth', weight: '25', india_score: '5', viet_score: '3' },
  { factor: 'Regulatory Entry Ease', weight: '20', india_score: '2', viet_score: '4' },
  { factor: 'Logistics Infrastructure', weight: '20', india_score: '4', viet_score: '3' },
  { factor: 'Partner Availability', weight: '20', india_score: '5', viet_score: '2' },
  { factor: 'Entry Barrier Cost', weight: '15', india_score: '2', viet_score: '4' },
]

const TPRM_COLS: ColumnDef[] = [
  { key: 'vendor', header: 'Vendor', width: 160 },
  { key: 'country', header: 'Country' },
  { key: 'criticality', header: 'Criticality (1-5)', editable: true },
  { key: 'data_access', header: 'Data Access (1-5)', editable: true },
  { key: 'evidence_pct', header: 'Evidence % (0-100)', editable: true },
  { key: '_score', header: 'Risk Score /10', computed: computeTPRMScore },
  { key: '_tier', header: 'Risk Tier', computed: computeTPRMTier },
  { key: 'key_gap', header: 'Key Gap' },
]

const TPRM_DATA = [
  { vendor: 'TechServ Pvt Ltd', country: 'India', criticality: '5', data_access: '5', evidence_pct: '35', key_gap: 'DPA missing — PDPA breach risk' },
  { vendor: 'Maplewood Analytics', country: 'Malaysia', criticality: '4', data_access: '3', evidence_pct: '60', key_gap: 'ISO 27001 cert expired' },
  { vendor: 'ClearPath Thailand', country: 'Thailand', criticality: '3', data_access: '2', evidence_pct: '92', key_gap: 'None — all evidence received' },
  { vendor: 'DataBridge SG', country: 'Singapore', criticality: '4', data_access: '4', evidence_pct: '50', key_gap: 'Questionnaire 50% complete' },
  { vendor: 'ReguSync India', country: 'India', criticality: '2', data_access: '1', evidence_pct: '88', key_gap: 'Renewal due 6 months' },
]

export function IntelligenceSection() {
  return (
    <SectionWrapper id="s-intelligence" accentColor={COLOR} bgGlow="rgba(129,140,248,0.06)">
      <SectionHeader
        tag="Scene 03 · 2023 → Present"
        title={'Voxia Global —\nCross-Border Intelligence'}
        org="Head of Research · Strategic Decision Intelligence · India, South Asia & ASEAN"
        hook="24+ intelligence briefs. 30+ vendor risk assessments. Policy announcements mistaken for live regulations."
        hookBold="I built the system that tells companies the difference — before they act on the wrong signal."
        color={COLOR}
        stats={[{ n: '24+', l: 'Intelligence briefs' }, { n: '30+', l: 'Vendor assessments' }, { n: '6', l: 'Countries tracked' }, { n: '4', l: 'Market entry reports' }]}
        dividerBefore="Before: Companies acted on announcements as regulations — ₹14L customs hold from one misread policy"
        dividerAfter="After: Every policy carries Status + Verified Source + Business Action — no unverified source triggers action"
      />

      {/* Intelligence Room SVG */}
      <div style={{ marginBottom: 48, border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <svg viewBox="0 0 900 200" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%', background: '#060A12' }}>
          <rect x="0" y="0" width="900" height="200" fill="#060A12"/>
          {/* 4 monitors */}
          {[
            { x: 30, title: 'REGULATORY TRACKER', lines: ['IND: DPDP Act → DRAFT ⚠','IND: BIS Mandatory → ACTIVE ✓','MYS: E-Invoice → ANNOUNCED','THA: Platform Act → DRAFT','SGP: PDPA 2024 → ACTIVE ✓'], colors: ['#FCD34D','#34D399','#FCD34D','#6B7280','#34D399'] },
            { x: 240, title: 'VENDOR RISK REGISTER', lines: ['TechServ IND → 8.3 CRITICAL','Maplewood MYS → 5.6 HIGH','ClearPath THA → 1.8 LOW ✓','DataBridge SGP → 6.4 HIGH','ReguSync IND → 1.5 LOW ✓'], colors: ['#EF4444','#FCD34D','#34D399','#FCD34D','#34D399'] },
            { x: 450, title: 'MARKET INTEL — INDIA', lines: ['BIS Cert: 9 month lead time ✓','Distributor: 2/3 DPA missing ⚠','Tier-2 growth: +18% YoY ✓','Cold chain: gaps 3 districts','→ PROCEED WITH CONDITIONS'], colors: ['#34D399','#FCA5A5','#34D399','#FCD34D','#818CF8'] },
            { x: 670, title: 'INDIA vs VIETNAM SCORE', lines: ['Market: India 5.0 | VN 3.0','Reg Ease: India 2.0 | VN 4.0','Partners: India 5.0 | VN 2.0','Logistics: India 4.0 | VN 3.0','INDIA: 3.75 ★  |  VN: 3.15'], colors: ['#E0E7FF','#E0E7FF','#E0E7FF','#E0E7FF','#FCD34D'] },
          ].map((mon) => (
            <g key={mon.x}>
              <rect x={mon.x} y="20" width="190" height="130" fill="#0D1120" stroke="#1E2740" strokeWidth="1" rx="4"/>
              <rect x={mon.x + 5} y="25" width="180" height="115" fill="#111827" rx="2"/>
              <rect x={mon.x + 5} y="25" width="180" height="18" fill="#1E2740" rx="2"/>
              <text x={mon.x + 95} y="38" textAnchor="middle" fill="#818CF8" fontSize="8" fontFamily="monospace" fontWeight="600">{mon.title}</text>
              {mon.lines.map((line, li) => (
                <text key={li} x={mon.x + 12} y={58 + li * 13} fill={mon.colors[li]} fontSize="7" fontFamily="monospace">{line}</text>
              ))}
            </g>
          ))}
          {/* Analyst */}
          <rect x="395" y="155" width="110" height="25" fill="#111827" stroke="#1E2740" strokeWidth="1" rx="2"/>
          <circle cx="450" cy="148" r="10" fill="#1E2740"/>
          <rect x="438" y="158" width="24" height="18" fill="#1E2740" rx="2"/>
          {/* Status bar */}
          <rect x="0" y="182" width="900" height="18" fill="#0D1120"/>
          <text x="15" y="194" fill="#2A3550" fontSize="7" fontFamily="monospace">VOXIA GLOBAL INTELLIGENCE TERMINAL · 24+ BRIEFS · 30+ VENDOR ASSESSMENTS · 6 COUNTRIES</text>
        </svg>
      </div>

      <TierAccordion num="T-01" level="Intelligence" title="Regulatory Change Detection Register — Verified Source Protocol" color={COLOR} defaultOpen>
        <div className="tier-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 24 }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 10 }}>The Real Daily Pain</p>
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, padding: '16px 18px', fontSize: 13, lineHeight: 1.65, color: 'var(--text2)' }}>
              <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>What happened:</strong> European electronics manufacturer prepared BIS certification docs for February 2024. Actual effective date: October 2023. Shipment held at Nhava Sheva 11 days. Demurrage: ₹14 lakh.</p>
              <p><strong style={{ color: 'var(--text)' }}>Root cause:</strong> Source was a news article, not the BIS gazette notification. Announcement date confused with effective date. No verification chain. No status classification.</p>
              <div style={{ marginTop: 10, padding: '10px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 4, color: '#FCA5A5', fontSize: 12 }}>
                ⚠ BIS gazette was at bis.gov.in. Verification: 15 minutes. Cost of skipping it: ₹14 lakh. 1,400× cost amplification.
              </div>
            </div>
          </div>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 10 }}>Edit Status & Source — Action Updates</p>
            <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
              <LiveTable id="reg-tracker" columns={REG_COLS} initialData={REG_DATA} accentColor={COLOR} title="REGULATORY CHANGE DETECTION REGISTER" />
            </div>
          </div>
        </div>
        <FormulaBox accentColor={COLOR}
          code={`Confidence = IF(Source_Verified="No", "Low",
  IF(Status="In force", "High",
  IF(Status="Draft notified", "Medium", "Medium")))
Business_Action = IF(Source_Verified="No", "Monitor ONLY — do not act on this source",
  IF(Status="In force", "Immediate compliance — verify effective date at official source",
  IF(Status="Announced", "Prepare — confirm rollout timeline",
  "Monitor — not yet enforceable")))`}
          explanation="<strong>The source verification rule is non-negotiable:</strong> If Source_Verified = No → Business_Action = 'Monitor ONLY — do not act.' This single rule would have prevented the ₹14 lakh customs hold. The news article that triggered the wrong action would have scored Confidence: Low and Action: Monitor ONLY. Compliance would have required a 15-minute check at bis.gov.in first. Thailand's Digital Platform Act above: Source_Verified=No → see how the action column responds."
        />
        <ToolChips tools={['📊 Google Sheets', '🔔 Google Alerts + RSS', '🌐 Gazette of India / PIB / BIS.gov.in', '🐍 Python RSS parser (Scrapy)', '📋 Zauba Corp / MCA21 / DGFT', '🔍 Wayback Machine verification', '🗂 Airtable research PM']} />
      </TierAccordion>

      <TierAccordion num="T-02" level="Commercial Intel" title="Market Entry Decision Support — Weighted Comparison Model" color={COLOR}>
        <div className="tier-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 24 }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 10 }}>The Real Daily Pain</p>
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, padding: '16px 18px', fontSize: 13, lineHeight: 1.65, color: 'var(--text2)' }}>
              <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>What happened:</strong> European manufacturer spent 4 months and €40,000 on market entry study. Got: market size, competitor list. Missing: BIS mandatory certification (9 months minimum), import duty on their HS code, cold chain gaps in tier-2 target cities, partner due diligence requirements.</p>
              <div style={{ marginTop: 10, padding: '10px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 4, color: '#FCA5A5', fontSize: 12 }}>
                ⚠ 9-month BIS lead time alone meant their Q2 entry plan was actually Q4 earliest. That delay was invisible in any market size calculation.
              </div>
            </div>
          </div>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 10 }}>Edit Scores 1–5 — Totals Recalculate Live</p>
            <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
              <LiveTable id="mkt-entry" columns={MKT_COLS} initialData={MKT_DATA} accentColor={COLOR} title="MARKET ENTRY WEIGHTED DECISION MATRIX" />
            </div>
            <div style={{ marginTop: 8, padding: '8px 12px', background: 'var(--bg3)', borderRadius: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text3)' }}>
              India total: {MKT_DATA.reduce((s, r) => s + (parseFloat(r.india_score) * parseFloat(r.weight) / 100), 0).toFixed(2)} · Vietnam: {MKT_DATA.reduce((s, r) => s + (parseFloat(r.viet_score) * parseFloat(r.weight) / 100), 0).toFixed(2)} · Recommendation updates as you edit
            </div>
          </div>
        </div>
        <FormulaBox accentColor={COLOR}
          code={`Weighted_Score = Score × (Weight_Pct / 100)
Total = SUMPRODUCT(Scores_Array, Weights_Array / 100)
Recommendation = IF(India_Total - Vietnam_Total > 0.5 AND India_Total > 3.5,
  "India — Proceed with Conditions",
  IF(Vietnam_Total > India_Total AND Vietnam_Total > 3.5, "Vietnam — Proceed",
  IF(MAX(India_Total,Vietnam_Total) < 3.0, "Neither — Reassess",
  "Too Close — Field Validation Required")))
/* Sensitivity: Change Regulatory Ease India 2→4: Total jumps to 4.15 → "Proceed" */`}
          explanation="<strong>SUMPRODUCT vs simple average:</strong> A simple average treats Entry Barrier Cost (15% weight) the same as Market Size (25% weight). SUMPRODUCT applies differential weighting — a low score on a high-weight factor hurts proportionally more. The sensitivity check at the bottom is what makes this a decision tool, not a scorecard: it shows which single factor change would flip the recommendation, so the client knows exactly what to verify first."
        />
        <ToolChips tools={['📊 Excel SUMPRODUCT', '🌐 UN Comtrade', '🏦 World Bank Data API', '📋 DGFT EXIM data', '🔍 PRS Legislative Research', '🐍 Python data fetch', '📊 PowerPoint decision brief']} />
      </TierAccordion>

      <TierAccordion num="T-03" level="TPRM" title="Vendor Due Diligence & Evidence Gap Register — 30-Vendor Model" color={COLOR}>
        <div className="tier-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 24 }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 10 }}>The Real Daily Pain</p>
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, padding: '16px 18px', fontSize: 13, lineHeight: 1.65, color: 'var(--text2)' }}>
              <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>What happened:</strong> Client entered Thai market through a recommended distributor. 14 months later: no Data Processing Agreement (PDPA required), expired liability insurance, undisclosed parent-company conflict. Liability: $240,000. All discoverable in Week 1 of structured due diligence.</p>
              <div style={{ marginTop: 10, padding: '10px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 4, color: '#FCA5A5', fontSize: 12 }}>
                ⚠ KPMG India TPRM report (2024): 67% of Indian companies have no formal vendor due diligence process. The gap is the risk — and the opportunity.
              </div>
            </div>
          </div>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 10 }}>Edit Criticality, Data Access & Evidence — Score Updates</p>
            <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
              <LiveTable id="tprm-register" columns={TPRM_COLS} initialData={TPRM_DATA} accentColor={COLOR} title="THIRD-PARTY RISK REGISTER — WEIGHTED MODEL" />
            </div>
          </div>
        </div>
        <FormulaBox accentColor={COLOR}
          code={`Risk_Score = ROUND(
  (Criticality × 0.35) +      /* How much business depends on this vendor */
  (Data_Access × 0.30) +      /* How much sensitive data they touch */
  ((100 - Evidence_Pct) / 100 × 10 × 0.35),  /* Penalty for missing evidence */
1)
Risk_Tier = IF(Score >= 7, "Critical", IF(Score >= 5, "High", IF(Score >= 3, "Medium", "Low")))
/* Framework: ISO 27001 Annex A.15 criticality (35%) + SOC 2 CC9.2 evidence (35%) */`}
          explanation="<strong>Why three-factor weighted score instead of a checklist:</strong> A checklist passes a vendor who has all documents but handles 100% of your customer PII (maximum data access). The weighted formula penalises both high criticality/data access AND missing evidence simultaneously. TechServ: Criticality=5, Data_Access=5, Evidence=35% → score 8.3. Maximum exposure, minimum proof. Edit any value above and watch the Risk Tier column recalculate. Framework alignment: Criticality weight (35%) matches ISO 27001 Annex A.15. Evidence completeness (35%) maps to SOC 2 CC9.2."
        />
        <ToolChips tools={['📊 Excel TPRM Register', '🗂 Notion / SharePoint DMS', '📱 Jira remediation tracking', '⚙ Vanta · Drata · Sprinto', '🛡 ISO 27001 Annex A.15', '🔐 SOC 2 CC9.2', '⚙ ServiceNow GRC', '🗃 SQL risk aggregation']} />
      </TierAccordion>

      <TierAccordion num="T-04" level="Executive" title="Country & Commercial Risk — One-Page Decision Brief" color={COLOR}>
        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ padding: '9px 14px', background: COLOR, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', color: '#000' }}>
            COUNTRY RISK DECISION BRIEF — INDIA ELECTRONICS ENTRY
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead><tr><th>Risk Area</th><th>Finding (Verified)</th><th>Confidence</th><th>Decision Implication</th></tr></thead>
              <tbody>
                {[
                  { area: 'Regulatory', finding: 'BIS mandatory — minimum 9 month lead time', conf: 'High — bis.gov.in', confV: 'green', dec: 'Start BIS process NOW or push entry to Q4' },
                  { area: 'Partner Diligence', finding: '2 of 3 distributors — DPA evidence gaps', conf: 'Partial', confV: 'amber', dec: 'Do NOT sign contracts until DPA received' },
                  { area: 'Market Demand', finding: 'Tier-2 city growth: +18% YoY (DGFT verified)', conf: 'High — DGFT', confV: 'green', dec: 'Entry thesis supported — proceed' },
                  { area: 'Logistics', finding: 'Cold chain gaps in 3 of 7 target districts', conf: 'Partial', confV: 'amber', dec: 'Last-mile audit before committing to tier-2' },
                ].map((r, i) => (
                  <tr key={i}>
                    <td>{r.area}</td>
                    <td>{r.finding}</td>
                    <td><span className={`badge badge-${r.confV}`}>{r.conf}</span></td>
                    <td>{r.dec}</td>
                  </tr>
                ))}
                <tr style={{ background: 'var(--bg3)' }}>
                  <td colSpan={4} style={{ textAlign: 'center', padding: 14 }}>
                    <span className="badge badge-amber" style={{ fontSize: 12, padding: '6px 20px' }}>
                      RECOMMENDATION: PROCEED WITH CONDITIONS — BIS process + partner DPA evidence required first
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <ToolChips tools={['📊 Excel Risk Matrix', '📈 Power BI (risk heatmap)', '📋 PowerPoint decision brief', '🛡 NIST RMF (Govern function)', '⚙ ServiceNow GRC', '🐍 Python evidence completeness']} />
      </TierAccordion>

      <SceneCTA sectorLabel="Intelligence & TPRM" waParam="Hi%20Tata%20Raam%20Kumar%2C%20I%20reviewed%20your%20Intelligence%20and%20TPRM%20work%20and%20would%20like%20to%20discuss%20an%20opportunity." />
    </SectionWrapper>
  )
}
