import { SectionWrapper, SectionHeader, SceneCTA } from './SectionWrapper'
import { TierAccordion } from './TierAccordion'
import { LiveTable, ColumnDef } from './LiveTable'
import { FormulaBox } from './FormulaBox'
import { ToolChips } from './ToolChips'

const COLOR = '#14B8A6'

function computeStudentStage(row: Record<string, string>) {
  const ver = row.verified?.toLowerCase(), login = row.first_login
  const reg = new Date(row.reg_date || ''), today = new Date()
  const dsr = isNaN(reg.getTime()) ? 0 : Math.round((today.getTime() - reg.getTime()) / 86400000)
  if (!ver || ver === 'no' || ver === '') return { value: 'Verification Pending', variant: 'amber', mono: true }
  if (!login) return { value: dsr > 7 ? 'Never Logged In (12% recovery)' : 'Never Logged In — Contact NOW', variant: 'red', mono: true }
  const ld = new Date(login)
  const dsl = isNaN(ld.getTime()) ? 0 : Math.round((today.getTime() - ld.getTime()) / 86400000)
  if (dsl > 7) return { value: `Inactive ${dsl}+ Days`, variant: 'blue', mono: true }
  return { value: 'Active', variant: 'green', mono: true }
}

function computeQGate(row: Record<string, string>) {
  const r1 = row.r1?.toLowerCase(), r2 = row.r2?.toLowerCase(), amb = row.ambiguity?.toLowerCase()
  if (r1 === 'flag' && r2 === 'flag') return { value: 'Revise — Do Not Publish', variant: 'red', mono: true }
  if (amb === 'yes' && r1 !== r2) return { value: 'Hold — Senior Review', variant: 'red', mono: true }
  if (r1 !== r2) return { value: 'Escalate to Lead', variant: 'amber', mono: true }
  if (r1 === 'flag') return { value: 'Revise — Do Not Publish', variant: 'red', mono: true }
  return { value: 'Approved — Publish', variant: 'green', mono: true }
}

function computeInstStatus(row: Record<string, string>) {
  const stages = [row.d1, row.d5, row.d10, row.d14]
  const hasOverdue = stages.some(s => s?.toLowerCase().includes('overdue'))
  const allDone = stages.every(s => s?.toLowerCase() === 'done')
  if (allDone) return { value: 'Complete ✓', variant: 'green', mono: true }
  if (hasOverdue) return { value: 'At Risk — Escalate', variant: 'red', mono: true }
  return { value: 'On Track', variant: 'amber', mono: true }
}

function computeFunnelDrop(row: Record<string, string>, allRows: Record<string, string>[]) {
  const idx = allRows.indexOf(row)
  if (idx === 0) return { value: '—', mono: true }
  const prev = parseInt(allRows[idx - 1].count || '0')
  const curr = parseInt(row.count || '0')
  if (!prev) return { value: '—', mono: true }
  const drop = ((prev - curr) / prev * 100).toFixed(1) + '%'
  return { value: drop, mono: true }
}

function computeRevImpact(row: Record<string, string>, allRows: Record<string, string>[]) {
  const idx = allRows.indexOf(row)
  if (idx === 0) return { value: '—', mono: true }
  const prev = parseInt(allRows[idx - 1].count || '0')
  const curr = parseInt(row.count || '0')
  const impact = ((prev - curr) * 8000 / 100000).toFixed(1)
  return { value: parseFloat(impact) > 0 ? `₹${impact}L potential` : '—', mono: true }
}

const STU_COLS: ColumnDef[] = [
  { key: 'id', header: 'Student ID' },
  { key: 'reg_date', header: 'Reg Date' },
  { key: 'verified', header: 'Verified?', editable: true },
  { key: 'first_login', header: 'First Login', editable: true },
  { key: '_stage', header: 'Drop-Off Stage', computed: computeStudentStage },
]

const STU_DATA = [
  { id: 'STU-0441', reg_date: '2024-11-01', verified: 'Yes', first_login: '2024-11-02' },
  { id: 'STU-0442', reg_date: '2024-11-01', verified: 'Yes', first_login: '' },
  { id: 'STU-0443', reg_date: '2024-11-02', verified: '', first_login: '' },
  { id: 'STU-0444', reg_date: '2024-11-04', verified: 'Yes', first_login: '2024-11-05' },
  { id: 'STU-0445', reg_date: '2024-11-05', verified: 'Yes', first_login: '2024-11-06' },
]

const Q_COLS: ColumnDef[] = [
  { key: 'id', header: 'Q ID' },
  { key: 'subject', header: 'Subject' },
  { key: 'difficulty', header: 'Difficulty' },
  { key: 'r1', header: 'Reviewer 1', editable: true },
  { key: 'r2', header: 'Reviewer 2', editable: true },
  { key: 'ambiguity', header: 'Ambiguity?', editable: true },
  { key: '_gate', header: 'Gate Decision', computed: computeQGate },
]

const Q_DATA = [
  { id: 'Q-1101', subject: 'Reasoning', difficulty: 'Medium', r1: 'Pass', r2: 'Pass', ambiguity: 'No' },
  { id: 'Q-1102', subject: 'GK', difficulty: 'Easy', r1: 'Flag', r2: 'Flag', ambiguity: 'Yes' },
  { id: 'Q-1103', subject: 'Maths', difficulty: 'Hard', r1: 'Pass', r2: 'Flag', ambiguity: 'No' },
  { id: 'Q-1104', subject: 'English', difficulty: 'Medium', r1: 'Pass', r2: 'Pass', ambiguity: 'No' },
  { id: 'Q-1105', subject: 'Science', difficulty: 'Hard', r1: 'Flag', r2: 'Pass', ambiguity: 'Yes' },
]

const INST_COLS: ColumnDef[] = [
  { key: 'client', header: 'Institution', width: 160 },
  { key: 'd1', header: 'D1: Access', editable: true },
  { key: 'd5', header: 'D5: Training', editable: true },
  { key: 'd10', header: 'D10: Content', editable: true },
  { key: 'd14', header: 'D14: Live', editable: true },
  { key: '_status', header: 'Overall', computed: computeInstStatus },
]

const INST_DATA = [
  { client: 'Govt School Salem', d1: 'Done', d5: 'Done', d10: 'In Progress', d14: '' },
  { client: 'Lotus Academy Erode', d1: 'Done', d5: 'Overdue', d10: '', d14: '' },
  { client: 'SSN Coaching CBE', d1: 'Done', d5: 'Done', d10: 'Done', d14: 'Done' },
]

const FUNNEL_COLS: ColumnDef[] = [
  { key: 'stage', header: 'Funnel Stage', width: 180 },
  { key: 'count', header: 'Count', editable: true },
  { key: '_drop', header: 'Drop-Off %', computed: computeFunnelDrop },
  { key: '_rev', header: '₹ Impact (@ ₹8k)', computed: computeRevImpact },
  { key: 'controllable', header: 'Controllable?' },
]

const FUNNEL_DATA = [
  { stage: 'Registered', count: '400', controllable: '—' },
  { stage: 'Verified & Activated', count: '310', controllable: 'Yes — SOP' },
  { stage: 'First Lesson Complete', count: '220', controllable: 'Yes — UX' },
  { stage: 'First Assessment Done', count: '160', controllable: 'Partial' },
  { stage: 'Active at 30 Days', count: '110', controllable: 'Partial' },
  { stage: 'Renewed', count: '70', controllable: 'Unclear' },
]

export function EducationSection() {
  return (
    <SectionWrapper id="s-education" accentColor={COLOR} bgGlow="rgba(20,184,166,0.06)">
      <SectionHeader
        tag="Scene 02 · 2020 → Present"
        title={'Mahendras · Tryit\nEducation Operations'}
        org="Mentor → Senior Mentor → Academic Coordinator → Administration"
        hook="2,200+ students. 18 institutional B2B clients. Assessment errors reached thousands before detection."
        hookBold="Nobody owned the stage between registration and activation."
        color={COLOR}
        stats={[{ n: '2,200+', l: 'Students trained' }, { n: '14', l: 'Batches' }, { n: '18', l: 'B2B clients' }, { n: '6', l: 'Exam categories' }]}
        dividerBefore="Before: Dropout discovered in monthly review — 6 weeks after campaign, 12% recovery"
        dividerAfter="After: 48-hour stage visibility — 68% recovery rate when contacted in time"
      />

      {/* Classroom SVG */}
      <div style={{ marginBottom: 48, border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <svg viewBox="0 0 900 220" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%', background: '#080F1A' }}>
          <rect x="0" y="0" width="900" height="220" fill="#080F1A"/>
          <rect x="300" y="20" width="300" height="130" fill="#064E3B" stroke="#059669" strokeWidth="1" rx="2"/>
          <text x="450" y="50" textAnchor="middle" fill="#34D399" fontSize="11" fontFamily="monospace" fontWeight="600">EXAM: SSC CGL — Tier I</text>
          <line x1="320" y1="60" x2="580" y2="60" stroke="#065F46" strokeWidth="1"/>
          <text x="450" y="77" textAnchor="middle" fill="#6EE7B7" fontSize="9" fontFamily="monospace">Q14: If 15% of A = 25% of B, then A:B = ?</text>
          <text x="450" y="93" textAnchor="middle" fill="#34D399" fontSize="9" fontFamily="monospace">(a) 5:3  (b) 3:5  (c) 2:5  (d) 5:2</text>
          <rect x="380" y="103" width="140" height="18" fill="rgba(239,68,68,0.15)" stroke="#EF4444" strokeWidth="1" rx="2"/>
          <text x="450" y="115" textAnchor="middle" fill="#FCA5A5" fontSize="8" fontFamily="monospace" fontWeight="600">⚠ AMBIGUITY FLAG — REVIEW</text>
          <text x="450" y="143" textAnchor="middle" fill="#065F46" fontSize="8" fontFamily="monospace">Reviewer 1: Pass ✓  |  Reviewer 2: FLAG ✗</text>
          <rect x="380" y="175" width="140" height="30" fill="#1F2937" stroke="#374151" strokeWidth="1" rx="2"/>
          <circle cx="450" cy="162" r="10" fill="#374151"/>
          <rect x="438" y="172" width="24" height="20" fill="#374151" rx="2"/>
          {/* Student rows */}
          {[180, 155, 135].map((y, ri) => (
            Array.from({ length: 6 }).map((_, i) => {
              const x = 40 + i * 40
              const size = 7 - ri
              const opacity = [0.7, 0.5, 0.35][ri]
              const isAlert = ri === 0 && i === 1
              return (
                <g key={`${ri}-${i}`} opacity={opacity}>
                  <circle cx={x} cy={y} r={size} fill={isAlert ? '#DC2626' : '#1D4ED8'}/>
                  {isAlert && <text x={x} y={y + 4} textAnchor="middle" fill="white" fontSize="8" fontFamily="monospace" fontWeight="700">!</text>}
                  <rect x={x - size} y={y + size} width={size * 2} height={size + 2} fill={isAlert ? '#DC2626' : '#1D4ED8'} rx="1"/>
                </g>
              )
            })
          ))}
          {[660, 700, 740, 780, 820, 860].map(x => (
            <g key={x} opacity={0.65}>
              <circle cx={x} cy={180} r={7} fill="#1D4ED8"/>
              <rect x={x - 7} y={187} width={14} height={9} fill="#1D4ED8" rx="1"/>
            </g>
          ))}
          {/* Dropout label */}
          <rect x="18" y="162" width="88" height="14" fill="rgba(220,38,38,0.15)" stroke="#DC2626" strokeWidth="0.5" rx="2"/>
          <text x="62" y="172" textAnchor="middle" fill="#FCA5A5" fontSize="7" fontFamily="monospace">Drop-off: Never logged in</text>
          <rect x="380" y="202" width="140" height="16" fill="rgba(20,184,166,0.1)" stroke="rgba(20,184,166,0.3)" rx="3"/>
          <text x="450" y="213" textAnchor="middle" fill="#2DD4BF" fontSize="7" fontFamily="monospace" fontWeight="600">2,200+ students · 14 batches</text>
        </svg>
      </div>

      <TierAccordion num="T-01" level="Foundation" title="Student Onboarding Drop-Off Prevention" color={COLOR} defaultOpen>
        <div className="tier-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 24 }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 10 }}>The Real Daily Pain</p>
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, padding: '16px 18px', fontSize: 13, lineHeight: 1.65, color: 'var(--text2)' }}>
              <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>What happened:</strong> 400 students registered. Week 3: 180 not verified, 60 never logged in. Zoho CRM showed all 400 as "Registered" — no stage differentiation.</p>
              <div style={{ marginTop: 10, padding: '10px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 4, color: '#FCA5A5', fontSize: 12 }}>
                ⚠ 48-hour contact: 68% activation. After 7 days: 12%. On 60 students at ₹8,000 — early follow-up recovers ₹2.88L per campaign.
              </div>
            </div>
          </div>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 10 }}>Live Tracker — Edit Verified & Login</p>
            <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
              <LiveTable id="stu-onboarding" columns={STU_COLS} initialData={STU_DATA} accentColor={COLOR} title="STUDENT ONBOARDING REGISTER (ZOHO CRM + MOODLE)" />
            </div>
          </div>
        </div>
        <FormulaBox accentColor={COLOR}
          code={`Days_Since_Reg = DATEDIF(Reg_Date, TODAY(), "D")
Drop_Off_Stage = IF(Verified="", "Verification Pending",
  IF(First_Login="",
    IF(Days_Since_Reg > 7, "Never Logged In (12% recovery)", "Never Logged In — Contact NOW"),
  IF(DATEDIF(First_Login,TODAY(),"D") > 7, "Inactive 7+ Days", "Active")))
Recovery_Priority = IF(Stage="Never Logged In — Contact NOW", "HIGH — 68% if contacted in 48h",
  IF(Stage="Never Logged In (12% recovery)", "MEDIUM — diminishing return", "LOW")`}
          explanation="<strong>The 48-hour window is documented data:</strong> Zoho CRM call logs from Mahendras showed 68% activation for contacts made within 48 hours. Same students after 7 days: 12%. This formula makes the window visible as a live flag, not a report. Named owner. 24-hour action required. This single formula change — adding Days_Since_Reg to the stage logic — was the operational change that recovered the most revenue per implementation effort."
        />
        <ToolChips tools={['📊 Zoho CRM (Lead Stages)', '🎓 Moodle LMS', '📋 Google Sheets', '📱 WhatsApp Business API', '🐍 Python automation', '📧 SMS Gateway']} />
      </TierAccordion>

      <TierAccordion num="T-02" level="Quality Control" title="Assessment Error Prevention — Dual Reviewer Gate" color={COLOR}>
        <div className="tier-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 24 }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 10 }}>The Real Daily Pain</p>
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, padding: '16px 18px', fontSize: 13, lineHeight: 1.65, color: 'var(--text2)' }}>
              <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>What happened:</strong> Gujarat Board recovered ₹50 lakh from 3,334 teachers for evaluation errors (2023). At Mahendras, an ambiguous Reasoning question reached 10,000 students before detection. Re-evaluation: 2 weeks, trust damage, partial refunds.</p>
              <p><strong style={{ color: 'var(--text)' }}>Root cause:</strong> Questions reviewed once — by the person who wrote them. No second reviewer. No ambiguity classification. No pre-publication gate.</p>
            </div>
          </div>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 10 }}>Try Pass/Flag in Reviewer Cells</p>
            <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
              <LiveTable id="q-quality" columns={Q_COLS} initialData={Q_DATA} accentColor={COLOR} title="QUESTION QUALITY CONTROL — PRE-PUBLICATION GATE" />
            </div>
          </div>
        </div>
        <FormulaBox accentColor={COLOR}
          code={`Agreement = IF(R1=R2, IF(R1="Flag","✗ Both Flag","✓ Agree"), "✗ Disagree")
Gate_Decision = IF(Ambiguity="Yes" AND Agreement<>"✓ Agree", "Hold — Senior Review",
  IF(Agreement="✗ Both Flag", "Revise — Do Not Publish",
  IF(Agreement="✗ Disagree", "Escalate to Lead",
  IF(R1="Flag", "Revise — Do Not Publish", "Approved — Publish"))))`}
          explanation="<strong>Four distinct gate states:</strong> (1) Approved — both pass. (2) Revise — both flag. (3) Escalate — disagreement. (4) Hold — ambiguous AND disagreement (strictest). The Gujarat Board's ₹50 lakh recovery happened because only one state existed: published. This system adds three intervention points. No question reaches 10,000 students until two independent reviewers agree it should."
        />
        <ToolChips tools={['📋 Google Sheets QA matrix', '📊 Google Forms (reviewer)', '🗂 Notion QA board', '📱 Jira issue tracking', '🎓 Moodle question bank', '🐍 Python question parser']} />
      </TierAccordion>

      <TierAccordion num="T-03" level="B2B Delivery" title="Institution Onboarding Control Tower — 14-Day Milestone" color={COLOR}>
        <div className="tier-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 24 }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 10 }}>The Real Daily Pain</p>
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, padding: '16px 18px', fontSize: 13, lineHeight: 1.65, color: 'var(--text2)' }}>
              <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>What happened:</strong> School signed Day 1. Day 3 — no teacher logins. Day 8 — training not done. Day 21 — principal called to cancel. ₹1.2 lakh lost. 4 people involved, nobody owned a milestone.</p>
              <div style={{ marginTop: 10, padding: '10px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 4, color: '#FCA5A5', fontSize: 12 }}>
                ⚠ At Tryit: 4 institutional churns in one quarter from delivery failures (not product). ₹4.8L lost. All preventable with milestone tracking.
              </div>
            </div>
          </div>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 10 }}>Edit Milestone Status — Try "Overdue"</p>
            <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
              <LiveTable id="inst-onboarding" columns={INST_COLS} initialData={INST_DATA} accentColor={COLOR} title="14-DAY INSTITUTION ONBOARDING TOWER" />
            </div>
          </div>
        </div>
        <FormulaBox accentColor={COLOR}
          code={`At_Risk_Trigger = COUNTIF(D1:D4, "Overdue") > 0
Overall = IF(COUNTA(D1:D4)=4, "Complete ✓",
  IF(At_Risk_Trigger, "At Risk — Escalate",
  IF(Elapsed_Days > 12 AND D14="", "Critical — Overdue", "On Track")))`}
          explanation="<strong>COUNTA(D1:D4)=4 is the only condition for Complete:</strong> Partial completion is never success. An at-risk institution caught at Day 8 (like Lotus Academy above) can be recovered with one phone call. The same institution at Day 21 has already decided to cancel. This formula makes the difference between those two states visible — and forces ownership before Day 8, not after Day 21."
        />
        <ToolChips tools={['📊 Zoho CRM (Deal Stages)', '📱 Jira milestones', '🗂 Notion tracker', '🎓 Moodle setup', '📧 WhatsApp Business', '🐍 Python webhook']} />
      </TierAccordion>

      <TierAccordion num="T-04" level="Management" title="Learning Funnel & Institutional ROI Dashboard" color={COLOR}>
        <div className="tier-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 24 }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 10 }}>The Real Daily Pain</p>
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, padding: '16px 18px', fontSize: 13, lineHeight: 1.65, color: 'var(--text2)' }}>
              <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>What happened:</strong> Enrollment +22%. Revenue +18%. Renewal rate dropped 64% → 41%. Three dashboards (Zoho, Moodle, Freshdesk) contradicted each other. Nobody could answer: at which stage are we losing students?</p>
            </div>
          </div>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 10 }}>Edit Stage Counts — Revenue Impact Updates</p>
            <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
              <LiveTable id="funnel-analysis" columns={FUNNEL_COLS} initialData={FUNNEL_DATA} accentColor={COLOR} title="LEARNER CONVERSION FUNNEL" />
            </div>
          </div>
        </div>
        <FormulaBox accentColor={COLOR}
          code={`Drop_Off_Pct = IFERROR(ROUND((Prev_Count - This_Count) / Prev_Count * 100, 1), "—")
Revenue_Impact = (Prev_Count - This_Count) * Revenue_Per_Student  /* ₹8,000 */
Highest_ROI_Fix = IF(Drop_Off_Pct > 25 AND Controllable="Yes", "Fix this first", "Monitor")`}
          explanation="<strong>The highest-ROI fix is always Stage 1:</strong> Verification drop (22.5%, fully controllable via follow-up SOP) loses 90 students at ₹8,000 = ₹7.2L per campaign cycle. Fixing Stage 1 with a 48hr follow-up protocol recovers more revenue than any product change. The funnel makes this visible in one number. Change the counts above to model any batch scenario and watch the revenue impact column update live."
        />
        <ToolChips tools={['📊 Zoho CRM Analytics', '🎓 Moodle Reports', '📋 Freshdesk tickets', '📈 Looker Studio', '🗃 SQL funnel query', '🐍 Python cohort analysis']} />
      </TierAccordion>

      <SceneCTA sectorLabel="Education" waParam="Hi%20Tata%20Raam%20Kumar%2C%20I%20reviewed%20your%20Education%20operations%20work%20and%20would%20like%20to%20discuss%20an%20opportunity." />
    </SectionWrapper>
  )
}
