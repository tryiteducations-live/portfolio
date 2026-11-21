export const PHOTO_URL = '/photo.jpg'

export const SECTORS = [
  { id: 'logistics', label: 'Logistics', year: '2016', color: '#F59E0B', colorDark: '#B45309', bg: 'rgba(245,158,11,0.06)', org: 'BPCL — Bharat Petroleum Corporation Limited', icon: '🏭' },
  { id: 'education', label: 'Education', year: '2020', color: '#14B8A6', colorDark: '#0D6E6E', bg: 'rgba(20,184,166,0.06)', org: 'Mahendras · Tryit Education B2B', icon: '🎓' },
  { id: 'intelligence', label: 'Intelligence', year: '2023', color: '#818CF8', colorDark: '#3730A3', bg: 'rgba(129,140,248,0.06)', org: 'Voxia Global — Head of Research', icon: '🌐' },
  { id: 'aigrc', label: 'AI · GRC', year: '2024', color: '#F43F5E', colorDark: '#9F1239', bg: 'rgba(244,63,94,0.06)', org: 'AI Quality · Risk Governance · TPRM', icon: '🤖' },
]

export const STATS = [
  { number: '8+', label: 'Years Active' },
  { number: '2,200+', label: 'Learners Trained' },
  { number: '30+', label: 'Vendor Assessments' },
  { number: '24+', label: 'Intelligence Briefs' },
]

export const TYPE_PHRASES = [
  'SAP ERP · CRM · Operations Control',
  'Freight Invoice Leakage Detection',
  'Student Onboarding Drop-Off Prevention',
  'Cross-Border Regulatory Intelligence',
  'TPRM Vendor Due Diligence · 30+ Assessments',
  'AI Response Evaluation · NIST AI RMF',
  'Cohen\'s Kappa · Reviewer Calibration',
  'Market Entry Decision Support · India & ASEAN',
]

export const TOOLS_PIPELINE = [
  {
    stage: '01', label: 'Data Collection', tools: [
      { name: 'SAP ERP (MIRO/VL02N/ME23N)', sector: 'logistics' },
      { name: 'SAP CRM (CRMD_ORDER)', sector: 'logistics' },
      { name: 'SAP PM — Plant Maintenance', sector: 'logistics' },
      { name: 'Zoho CRM (Lead/Deal stages)', sector: 'education' },
      { name: 'Moodle LMS (login/activity)', sector: 'education' },
      { name: 'WhatsApp Business API', sector: 'education' },
      { name: 'Google Alerts + RSS feeds', sector: 'intelligence' },
      { name: 'Gazette of India / PIB / BIS.gov.in', sector: 'intelligence' },
      { name: 'Zauba Corp / MCA21 / DGFT EXIM', sector: 'intelligence' },
      { name: 'LLM APIs (OpenAI/Google/Anthropic)', sector: 'aigrc' },
      { name: 'LabelStudio / Argilla', sector: 'aigrc' },
    ]
  },
  {
    stage: '02', label: 'Processing & Structuring', tools: [
      { name: 'Python (pandas / openpyxl)', sector: 'education' },
      { name: 'Python (Scrapy / BeautifulSoup)', sector: 'intelligence' },
      { name: 'SQL (dedup / aggregation)', sector: 'logistics' },
      { name: 'Excel (Power Query / XLOOKUP)', sector: 'logistics' },
      { name: 'Tally ERP (vendor ledger)', sector: 'logistics' },
      { name: 'Airtable (research pipeline)', sector: 'intelligence' },
      { name: 'Python (sklearn / Cohen\'s Kappa)', sector: 'aigrc' },
      { name: 'PromptLayer / Langsmith', sector: 'aigrc' },
    ]
  },
  {
    stage: '03', label: 'Analysis & Modelling', tools: [
      { name: 'Excel (SUMPRODUCT / COUNTIFS weighted)', sector: 'logistics' },
      { name: 'Excel (TPRM risk scoring 3-factor)', sector: 'intelligence' },
      { name: 'Google Sheets (regulatory tracker)', sector: 'intelligence' },
      { name: 'Excel (evaluation weighted rubric)', sector: 'aigrc' },
      { name: 'Google Sheets (funnel analysis)', sector: 'education' },
      { name: 'Freshdesk (support ticket analysis)', sector: 'education' },
    ]
  },
  {
    stage: '04', label: 'Tracking & Workflow', tools: [
      { name: 'SAP workflow notifications', sector: 'logistics' },
      { name: 'Jira (milestone / issue tracking)', sector: 'education' },
      { name: 'Notion (SOP / research PM)', sector: 'intelligence' },
      { name: 'SharePoint (DMS / evidence)', sector: 'intelligence' },
      { name: 'Vanta · Drata · Sprinto', sector: 'intelligence' },
      { name: 'ServiceNow GRC', sector: 'aigrc' },
    ]
  },
  {
    stage: '05', label: 'Output & Decision', tools: [
      { name: 'Power BI (SAP connector / KPI)', sector: 'logistics' },
      { name: 'Looker Studio / Google Data Studio', sector: 'education' },
      { name: 'PowerPoint decision briefs', sector: 'intelligence' },
      { name: 'NIST AI RMF 1.0 (Map/Measure/Manage/Govern)', sector: 'aigrc' },
      { name: 'ISO 42001 (AI management system)', sector: 'aigrc' },
      { name: 'ISO 27001 Annex A.15 (TPRM)', sector: 'intelligence' },
      { name: 'SOC 2 Type II evidence collection', sector: 'intelligence' },
      { name: 'EU AI Act awareness', sector: 'aigrc' },
    ]
  },
]

export const STATIC_CERTS = [
  { issuer: 'HCL · GUVI', name: 'Full Stack Web Development', cert_number: 'Add your cert # here', issued_date: '2024', sector: 'Web Development', border: '#22C55E' },
  { issuer: 'ISACA / PECB / IRM', name: 'GRC · Risk Management · TPRM', cert_number: 'In progress — add cert # on completion', issued_date: '2024 →', sector: 'Risk · Compliance · GRC', border: '#818CF8' },
  { issuer: 'AI Quality Platforms', name: 'AI Evaluation & Quality Operations', cert_number: 'In progress — add cert # on completion', issued_date: '2024 →', sector: 'AI · Evaluation · Governance', border: '#F43F5E' },
]
