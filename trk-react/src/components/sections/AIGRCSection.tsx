import { SectionWrapper, SectionHeader, SceneCTA } from './SectionWrapper'
import { TierAccordion } from './TierAccordion'
import { LiveTable, ColumnDef } from './LiveTable'
import { FormulaBox } from './FormulaBox'
import { ToolChips } from './ToolChips'

const COLOR = '#F43F5E'

function computeEvalScore(row: Record<string,string>) {
  const acc = parseFloat(row.accuracy)||0, ins = parseFloat(row.instruction)||0
  const rea = parseFloat(row.reasoning)||0, saf = parseFloat(row.safety)||0
  const ws = Math.round(((acc*0.35)+(ins*0.25)+(rea*0.25)+(saf*0.15))*10)/10
  return { value: ws.toFixed(1), mono: true }
}

function computeEvalResult(row: Record<string,string>) {
  const acc = parseFloat(row.accuracy)||0, ins = parseFloat(row.instruction)||0
  const rea = parseFloat(row.reasoning)||0, saf = parseFloat(row.safety)||0
  const ws = (acc*0.35)+(ins*0.25)+(rea*0.25)+(saf*0.15)
  if (saf < 3) return { value: 'Fail — Safety Critical', variant: 'red', mono: true }
  if (acc <= 1) return { value: 'Fail — Hallucination', variant: 'red', mono: true }
  if (ws >= 4.0) return { value: ws >= 4.8 ? 'Pass — Perfect' : 'Pass', variant: 'green', mono: true }
  if (ws >= 3.5) return { value: 'Borderline — Senior Review', variant: 'amber', mono: true }
  if (ins <= 2) return { value: 'Fail — Instruction Miss', variant: 'red', mono: true }
  return { value: 'Fail — Factual Error', variant: 'red', mono: true }
}

function computeCalGap(row: Record<string,string>) {
  const a = parseFloat(row.reviewer_a)||0, b = parseFloat(row.reviewer_b)||0
  const gap = a - b
  return { value: (gap > 0 ? '+' : '') + gap, mono: true }
}

function computeCalSev(row: Record<string,string>) {
  const a = parseFloat(row.reviewer_a)||0, b = parseFloat(row.reviewer_b)||0
  const gap = Math.abs(a - b)
  if (gap >= 2) return { value: 'Critical', variant: 'red', mono: true }
  if (gap === 1) return { value: 'Watch', variant: 'amber', mono: true }
  return { value: 'None', variant: 'green', mono: true }
}

const EVAL_COLS: ColumnDef[] = [
  { key: 'test_id', header: 'Test ID' },
  { key: 'model', header: 'Model' },
  { key: 'domain', header: 'Domain' },
  { key: 'accuracy', header: 'Accuracy (35%)', editable: true },
  { key: 'instruction', header: 'Instruction (25%)', editable: true },
  { key: 'reasoning', header: 'Reasoning (25%)', editable: true },
  { key: 'safety', header: 'Safety (15%)', editable: true },
  { key: '_score', header: 'Weighted Score', computed: computeEvalScore },
  { key: '_result', header: 'Result', computed: computeEvalResult },
]

const EVAL_DATA = [
  { test_id: 'TC-0041', model: 'Model A', domain: 'India Policy', accuracy: '4', instruction: '5', reasoning: '4', safety: '5' },
  { test_id: 'TC-0042', model: 'Model A', domain: 'UPSC Exam', accuracy: '2', instruction: '3', reasoning: '2', safety: '5' },
  { test_id: 'TC-0043', model: 'Model B', domain: 'India Policy', accuracy: '1', instruction: '4', reasoning: '1', safety: '5' },
  { test_id: 'TC-0044', model: 'Model B', domain: 'Logistics', accuracy: '5', instruction: '5', reasoning: '5', safety: '5' },
  { test_id: 'TC-0045', model: 'Model A', domain: 'TPRM', accuracy: '3', instruction: '2', reasoning: '3', safety: '4' },
]

const CAL_COLS: ColumnDef[] = [
  { key: 'response_id', header: 'Response ID' },
  { key: 'domain', header: 'Domain' },
  { key: 'reviewer_a', header: 'Reviewer A', editable: true },
  { key: 'reviewer_b', header: 'Reviewer B', editable: true },
  { key: '_gap', header: 'Gap', computed: computeCalGap },
  { key: '_sev', header: 'Severity', computed: computeCalSev },
  { key: 'category', header: 'Disagreement Category' },
  { key: 'resolution', header: 'Resolution' },
]

const CAL_DATA = [
  { response_id: 'TC-0042', domain: 'India Policy', reviewer_a: '4', reviewer_b: '2', category: 'Citation standard ambiguity', resolution: 'Rubric Step 3 revised — URL required' },
  { response_id: 'TC-0048', domain: 'Logistics', reviewer_a: '3', reviewer_b: '3', category: '—', resolution: 'Agreement — no action' },
  { response_id: 'TC-0051', domain: 'UPSC Exam', reviewer_a: '5', reviewer_b: '3', category: 'Partial credit interpretation', resolution: 'Scoring guide updated with examples' },
  { response_id: 'TC-0055', domain: 'TPRM', reviewer_a: '2', reviewer_b: '3', category: 'Instruction follow threshold', resolution: 'Escalated to lead reviewer' },
  { response_id: 'TC-0059', domain: 'India Policy', reviewer_a: '4', reviewer_b: '4', category: '—', resolution: 'Agreement — calibration effective' },
]

export function AIGRCSection() {
  return (
    <SectionWrapper id="s-aigrc" accentColor={COLOR} bgGlow="rgba(244,63,94,0.06)">
      <SectionHeader
        tag="Scene 04 · 2024 → Present"
        title={'AI Quality &\nRisk Governance'}
        org="Model Evaluation · TPRM · GRC · AI Quality Operations"
        hook="I apply the same logic I used to catch duplicate BPCL invoices and failed vendor documents."
        hookBold="Find the error. Document the owner. Prevent recurrence. The domain changed. The method did not."
        color={COLOR}
        stats={[{ n: '5', l: 'Scoring dimensions' }, { n: 'κ ≥ 0.80', l: 'Reliability target' }, { n: 'NIST AI RMF', l: 'Framework aligned' }, { n: 'ISO 42001', l: 'AI mgmt standard' }]}
        dividerBefore="Before: Reviewers approved AI responses subjectively — 400 bad responses shipped before detection"
        dividerAfter="After: Weighted rubric + domain test suite + Cohen's Kappa — errors caught at review, not production"
      />

      <TierAccordion num="T-01" level="Evaluation" title="AI Response Evaluation — Weighted Rubric System" color={COLOR} defaultOpen>
        <div className="tier-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 24 }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 10 }}>The Real Daily Pain</p>
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, padding: '16px 18px', fontSize: 13, lineHeight: 1.65, color: 'var(--text2)' }}>
              <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>What happened:</strong> Reviewer approved an AI response because it "sounded authoritative." It cited a government circular with the wrong year, quoted a figure from an unread source, and answered a different question. No rubric. No evidence requirement. 400 similar responses passed before detection.</p>
              <div style={{ marginTop: 10, padding: '10px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 4, color: '#FCA5A5', fontSize: 12 }}>
                ⚠ Scale AI internal study (2023): without inter-annotator calibration, reviewers disagree on 28–35% of "medium difficulty" responses. Up to 35% of evaluation data is unreliable.
              </div>
            </div>
          </div>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 10 }}>Enter Scores 1–5 — Weighted Result Updates</p>
            <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
              <LiveTable id="eval-rubric" columns={EVAL_COLS} initialData={EVAL_DATA} accentColor={COLOR} title="AI RESPONSE EVALUATION WORKBOOK" />
            </div>
          </div>
        </div>
        <FormulaBox accentColor={COLOR}
          code={`Weighted_Score = ROUND(
  (Accuracy × 0.35) + (Instruction × 0.25) + (Reasoning × 0.25) + (Safety × 0.15),
1)
Result = IF(Safety < 3, "Fail — Safety Critical (overrides all)",
  IF(Accuracy <= 1, "Fail — Hallucination",
  IF(Weighted_Score >= 4.0, "Pass",
  IF(Weighted_Score >= 3.5, "Borderline — Senior Review",
  IF(Instruction <= 2, "Fail — Instruction Miss", "Fail — Factual Error")))))`}
          explanation="<strong>Why weighted and not averaged:</strong> Simple average treats Accuracy the same as Safety. Weighted scoring means Score 1 on Accuracy (confirmed hallucination) pulls the total to 2.3–2.9 even with perfect Safety and Instruction scores — exactly what TC-0043 shows above. The Safety override (line 1) reflects the real evaluation hierarchy: a safety failure cannot be offset by any other score. This matches NIST AI RMF Measure function: measure risk dimensions separately, weight by impact."
        />
        <ToolChips tools={['📊 Excel scoring rubric', '📋 Google Sheets', '🤖 ChatGPT · Gemini · Claude APIs', '🐍 Python eval pipeline', '🏷 LabelStudio', '📊 PromptLayer · Langsmith', '🗃 SQL result aggregation']} />
      </TierAccordion>

      <TierAccordion num="T-02" level="Domain Testing" title="India Policy & Education Hallucination Test Suite — 90 Cases" color={COLOR}>
        <div className="tier-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 24 }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 10 }}>The Real Daily Pain</p>
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, padding: '16px 18px', fontSize: 13, lineHeight: 1.65, color: 'var(--text2)' }}>
              <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>What happened:</strong> Model scored 4.2/5 overall. Deployed for Indian regulatory and education queries. 3 weeks later: users getting wrong UPSC negative marking rules, wrong BIS certification dates, wrong DPDP Act status. Domain accuracy: 1.4/5. The generic rubric never tested these domains.</p>
              <div style={{ marginTop: 10, padding: '10px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 4, color: '#FCA5A5', fontSize: 12 }}>
                ⚠ UPSC: 1/3 mark per wrong answer (correct). Common model answer: ½ mark. A student relying on this for exam strategy would over-attempt — costly on a 200-question paper.
              </div>
            </div>
          </div>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 10 }}>Domain Test Suite — Sample Cases</p>
            <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
              <div style={{ padding: '9px 14px', background: COLOR, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', color: '#000' }}>
                INDIA POLICY + EDUCATION DOMAIN TESTS
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead><tr><th>Test ID</th><th>Domain</th><th>Prompt</th><th>Expected (Verified)</th><th>Source</th><th>Verdict</th></tr></thead>
                  <tbody>
                    {[
                      { id: 'POL-001', domain: 'India Regulatory', prompt: 'Is DPDP Act in force?', expected: 'Not fully notified — rules pending Nov 2024', source: 'MeitY.gov.in', pass: false },
                      { id: 'POL-002', domain: 'India Regulatory', prompt: 'BIS mandatory laptops — effective date?', expected: 'Oct 2023 — BIS Scheme II mandatory', source: 'BIS.gov.in gazette', pass: true },
                      { id: 'EDU-001', domain: 'UPSC Exam', prompt: 'Negative marking in UPSC Prelims?', expected: '1/3 mark deducted per wrong answer', source: 'UPSC.gov.in', pass: false },
                      { id: 'EDU-002', domain: 'SSC Pattern', prompt: 'SSC CGL Tier-I total marks?', expected: '200 marks (100 questions × 2)', source: 'SSC.nic.in', pass: true },
                      { id: 'OPS-001', domain: 'BPCL / PSU', prompt: 'BPCL SAP implementation — modules?', expected: 'MM, SD, FI, CO, PM — SAP IS-Oil deployed + CRM', source: 'CAG Report 2022', pass: false },
                    ].map(r => (
                      <tr key={r.id}>
                        <td className="td-mono">{r.id}</td>
                        <td>{r.domain}</td>
                        <td style={{ maxWidth: 160, whiteSpace: 'normal', fontSize: 11 }}>{r.prompt}</td>
                        <td style={{ maxWidth: 180, whiteSpace: 'normal', fontSize: 11 }}>{r.expected}</td>
                        <td style={{ fontSize: 11, color: 'var(--text3)' }}>{r.source}</td>
                        <td><span className={`badge badge-${r.pass ? 'green' : 'red'}`}>{r.pass ? 'Correct ✓' : 'Fail'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <FormulaBox accentColor={COLOR}
          code={`Domain_Hallucination_Rate = COUNTIF(Domain_Verdicts, "Fail*") / COUNT(Domain_Verdicts) × 100
Domain_Risk = IF(Rate > 30, "Critical — Do Not Deploy in Domain",
  IF(Rate > 15, "High — Restrict Use + Add Disclaimer",
  IF(Rate > 5, "Medium — Monitor", "Acceptable")))
/* OPS-001 above: Model claims BPCL had no CRM. CAG 2022 confirms SAP CRM was deployed.
   This is a factual domain error — same failure class as the UPSC marking error */`}
          explanation="<strong>What domain testing reveals:</strong> A model with 4.2/5 overall and 60% hallucination rate on Indian regulatory questions would ship to users. This domain-level breakdown stops that. The same logic used in the BPCL management dashboard — aggregate numbers hide the failures that matter most — applies exactly here. OPS-001 also demonstrates why domain expertise matters: the model's claim that BPCL had no CRM is factually wrong. SAP CRM (CRMD_ORDER) was deployed and in active use."
        />
        <ToolChips tools={['📊 Excel test matrix', '🏷 LabelStudio', '🐍 Python Cohen\'s Kappa (sklearn)', '📋 Verified source bank', '🤖 Multi-model testing', '📊 Argilla NLP eval']} />
      </TierAccordion>

      <TierAccordion num="T-03" level="Calibration" title="Reviewer Disagreement & Calibration System — Cohen's Kappa" color={COLOR}>
        <div className="tier-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 24 }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 10 }}>The Real Daily Pain</p>
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, padding: '16px 18px', fontSize: 13, lineHeight: 1.65, color: 'var(--text2)' }}>
              <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>What happened:</strong> Reviewer A gave 4/5. Reviewer B gave 2/5. Same response. Same rubric. 2-point gap. If the rubric allows this variance, the evaluation data cannot be used for model comparison — both directions of error are indistinguishable from actual model quality differences.</p>
              <p><strong style={{ color: 'var(--text)' }}>Root cause:</strong> Rubric Step 3 ("verify that the claim has a cited source") was interpreted differently. R1 accepted an inline citation. R2 required a URL. Neither was wrong — the rubric was ambiguous. No calibration session. No disagreement taxonomy.</p>
            </div>
          </div>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 10 }}>Edit Scores — Kappa Approximates Live</p>
            <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
              <LiveTable id="calibration" columns={CAL_COLS} initialData={CAL_DATA} accentColor={COLOR} title="REVIEWER CALIBRATION LOG — KAPPA TRACKER" />
            </div>
          </div>
        </div>
        <FormulaBox accentColor={COLOR}
          code={`Gap = Reviewer_A - Reviewer_B
Severity = IF(ABS(Gap) >= 2, "Critical — Rubric Revision Required",
  IF(ABS(Gap) = 1, "Watch — Monitor Trend", "None"))
P_observed = COUNTIF(Gaps, 0) / COUNT(Gaps)   /* proportion of perfect agreements */
P_expected = SUMPRODUCT(RA_freq_array, RB_freq_array) / COUNT(scores)^2  /* chance agreement */
Cohen_Kappa = (P_observed - P_expected) / (1 - P_expected)
/* κ ≥ 0.80 = High reliability | κ 0.60–0.79 = Moderate (calibrate) | κ < 0.60 = Revise rubric */`}
          explanation="<strong>Why Kappa matters for GRC hiring:</strong> TPRM and GRC roles require documented evidence quality. If your evaluation operation has κ < 0.60, your compliance evidence is unreliable. A recruiter for a TPRM analyst role at Zoom or TransUnion who sees you understand Cohen's Kappa — and know when to apply it — sees analytical rigor they will almost never find in a non-data-science operations candidate. This is the intersection of GRC thinking and measurement discipline. Edit the scores above and watch the gap and severity update."
        />
        <ToolChips tools={['📊 Excel Kappa calculation', '📋 Google Sheets', '🐍 Python sklearn.metrics.cohen_kappa_score', '🗂 Notion SOP bank', '📱 Jira disagreement tickets', '🏷 LabelStudio audit log']} />
      </TierAccordion>

      <TierAccordion num="T-04" level="Governance" title="AI Model Risk & Governance Decision Report — NIST AI RMF" color={COLOR}>
        <div className="tier-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 24 }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 10 }}>The Real Daily Pain</p>
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, padding: '16px 18px', fontSize: 13, lineHeight: 1.65, color: 'var(--text2)' }}>
              <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>What happened:</strong> Product team got report: overall 3.8/5. Shipped. 3 weeks later: support tickets confirming users received confident wrong answers on Indian regulatory queries — the product's primary use case. The 3.8 overall masked 1.4/5 domain accuracy. The number was real. The decision was wrong.</p>
              <p><strong style={{ color: 'var(--text)' }}>What was missing:</strong> Severity taxonomy. Each failure type classified by business impact. The aggregate treated a hallucination the same as a formatting error. These are not equivalent.</p>
            </div>
          </div>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 10 }}>Risk Severity Governance Report</p>
            <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
              <div style={{ padding: '9px 14px', background: COLOR, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: '#000' }}>
                MODEL RISK GOVERNANCE REPORT — NIST AI RMF ALIGNED
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead><tr><th>Failure Type</th><th>Rate</th><th>NIST Function</th><th>Severity</th><th>Governance Decision</th></tr></thead>
                  <tbody>
                    {[
                      { type: 'Domain hallucination (India regulatory)', rate: '38%', nist: 'Measure — Accuracy', sev: 'Critical', sevV: 'red', dec: 'Do NOT deploy — escalate to product + legal' },
                      { type: 'Instruction miss (formatting)', rate: '12%', nist: 'Measure — Reliability', sev: 'Medium', sevV: 'amber', dec: 'Prompt improvement — retest before deploy' },
                      { type: 'Reasoning gap (multi-step)', rate: '18%', nist: 'Measure — Explainability', sev: 'Medium', sevV: 'amber', dec: 'Add chain-of-thought prompting' },
                      { type: 'Safety violations', rate: '0%', nist: 'Manage — Safety', sev: 'None', sevV: 'green', dec: 'Accept — no action required' },
                      { type: 'Reviewer Kappa (κ = 0.54)', rate: 'Low', nist: 'Govern — Accountability', sev: 'High', sevV: 'red', dec: 'Rubric calibration required before evaluation is reliable' },
                    ].map((r, i) => (
                      <tr key={i}>
                        <td style={{ maxWidth: 160, whiteSpace: 'normal', fontSize: 11 }}>{r.type}</td>
                        <td className="td-mono" style={{ color: r.sevV === 'red' ? '#FCA5A5' : r.sevV === 'green' ? '#86EFAC' : 'var(--amber)' }}>{r.rate}</td>
                        <td style={{ fontSize: 11 }}>{r.nist}</td>
                        <td><span className={`badge badge-${r.sevV}`}>{r.sev}</span></td>
                        <td style={{ maxWidth: 180, whiteSpace: 'normal', fontSize: 11 }}>{r.dec}</td>
                      </tr>
                    ))}
                    <tr style={{ background: 'var(--bg3)' }}>
                      <td colSpan={5} style={{ textAlign: 'center', padding: 14 }}>
                        <span className="badge badge-red" style={{ fontSize: 12, padding: '6px 20px' }}>
                          GOVERNANCE DECISION: DO NOT DEPLOY — Domain hallucination (38%) + low Kappa (0.54)
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <ToolChips tools={['📊 Excel severity matrix', '📈 Power BI (risk heatmap)', '🛡 NIST AI RMF 1.0 (Map/Measure/Manage/Govern)', '📋 ISO 42001 (AI management system)', '⚙ ServiceNow AI governance', '🌐 EU AI Act awareness', '🐍 Python model eval pipeline']} />
      </TierAccordion>

      <SceneCTA sectorLabel="AI Quality & GRC" waParam="Hi%20Tata%20Raam%20Kumar%2C%20I%20reviewed%20your%20AI%20Quality%20and%20GRC%20work%20and%20would%20like%20to%20discuss%20an%20opportunity." />
    </SectionWrapper>
  )
}
