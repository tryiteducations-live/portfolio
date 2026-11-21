import { useState, useEffect, type FormEvent } from 'react'
import { supabase, type Certification } from '@/lib/supabase'
import { motion } from 'framer-motion'

function useAdminAuth() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const ADMIN_PW = import.meta.env.VITE_ADMIN_PASSWORD || 'tatulabs2024'
  const check = () => { if (pw === ADMIN_PW) setAuthed(true) }
  return { authed, pw, setPw, check }
}

function CertForm({ onSaved }: { onSaved: () => void }) {
  const [form, setForm] = useState({ issuer:'', name:'', cert_number:'', issued_date:'', expiry_date:'', skill_domain:'', sector:'', verify_url:'', badge_url:'', pdf_url:'' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setSaving(true)
    const { error } = await supabase.from('certifications').insert([form])
    setSaving(false)
    if (error) setMsg('Error: ' + error.message)
    else { setMsg('✓ Saved!'); setForm({ issuer:'',name:'',cert_number:'',issued_date:'',expiry_date:'',skill_domain:'',sector:'',verify_url:'',badge_url:'',pdf_url:'' }); onSaved() }
  }

  const fields = [
    { key:'issuer', label:'Issuer', required:true }, { key:'name', label:'Certification Name', required:true },
    { key:'cert_number', label:'Certificate Number' }, { key:'issued_date', label:'Issued Date', required:true },
    { key:'expiry_date', label:'Expiry Date (optional)' }, { key:'skill_domain', label:'Skill Domain', required:true },
    { key:'sector', label:'Sector (logistics/education/intelligence/aigrc)', required:true },
    { key:'verify_url', label:'Verification URL' }, { key:'badge_url', label:'Badge Image URL' }, { key:'pdf_url', label:'PDF URL' },
  ]

  return (
    <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <h3 style={{ fontFamily:"'Instrument Serif',serif", fontSize:20, color:'var(--text)', marginBottom:8 }}>Add Certification</h3>
      {fields.map(f => (
        <div key={f.key}>
          <label style={{ fontSize:11, fontWeight:600, color:'var(--text3)', letterSpacing:'0.05em', textTransform:'uppercase' as const, display:'block', marginBottom:5 }}>
            {f.label}{f.required && <span style={{ color:'var(--rose)' }}> *</span>}
          </label>
          <input value={(form as Record<string,string>)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} required={f.required}
            style={{ width:'100%', padding:'9px 12px', border:'1px solid var(--border2)', borderRadius:4, background:'var(--bg3)', color:'var(--text)', fontSize:13, fontFamily:"'Inter',sans-serif", outline:'none' }}/>
        </div>
      ))}
      {msg && <div style={{ padding:'10px 14px', background: msg.startsWith('✓')?'rgba(34,197,94,0.1)':'rgba(239,68,68,0.1)', borderRadius:4, fontSize:13, color: msg.startsWith('✓')?'#86EFAC':'#FCA5A5' }}>{msg}</div>}
      <button type="submit" disabled={saving} style={{ padding:'11px 20px', background:'var(--amber)', border:'none', borderRadius:4, color:'#000', fontSize:14, fontWeight:700, cursor:'pointer', opacity:saving?0.7:1 }}>
        {saving ? 'Saving...' : 'Save Certification'}
      </button>
    </form>
  )
}

function CertsList({ refresh }: { refresh: number }) {
  const [certs, setCerts] = useState<Certification[]>([])
  useEffect(() => {
    if (!import.meta.env.VITE_SUPABASE_URL) return
    supabase.from('certifications').select('*').order('issued_date', { ascending: false })
      .then(({ data }) => { if (data) setCerts(data as Certification[]) })
  }, [refresh])

  const deleteCert = async (id: string) => {
    if (!confirm('Delete this certification?')) return
    await supabase.from('certifications').delete().eq('id', id)
    setCerts(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div>
      <h3 style={{ fontFamily:"'Instrument Serif',serif", fontSize:20, color:'var(--text)', marginBottom:16 }}>Saved ({certs.length})</h3>
      {certs.length === 0 && <p style={{ color:'var(--text3)', fontSize:13 }}>No certifications yet.</p>}
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {certs.map(c => (
          <div key={c.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:6 }}>
            <div>
              <div style={{ fontSize:13, color:'var(--text)', fontWeight:600 }}>{c.name}</div>
              <div style={{ fontSize:11, color:'var(--text3)', marginTop:2 }}>{c.issuer} · {c.cert_number || 'No cert #'} · {c.issued_date}</div>
            </div>
            <button onClick={() => deleteCert(c.id)} style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:4, color:'#FCA5A5', padding:'4px 10px', fontSize:11, cursor:'pointer', fontWeight:600 }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}

function GalleryForm({ onSaved }: { onSaved: () => void }) {
  const [form, setForm] = useState({ title:'', description:'', image_url:'', sector:'', item_type:'screenshot' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setSaving(true)
    const { error } = await supabase.from('gallery').insert([form])
    setSaving(false)
    if (error) setMsg('Error: ' + error.message)
    else { setMsg('✓ Saved!'); setForm({ title:'',description:'',image_url:'',sector:'',item_type:'screenshot' }); onSaved() }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <h3 style={{ fontFamily:"'Instrument Serif',serif", fontSize:20, color:'var(--text)', marginBottom:8 }}>Add Gallery Item</h3>
      {[{ key:'title', label:'Title', required:true }, { key:'image_url', label:'Image URL', required:true }, { key:'description', label:'Description' }, { key:'sector', label:'Sector' }].map(f => (
        <div key={f.key}>
          <label style={{ fontSize:11, fontWeight:600, color:'var(--text3)', textTransform:'uppercase' as const, display:'block', marginBottom:5 }}>
            {f.label}{f.required && <span style={{ color:'var(--rose)' }}> *</span>}
          </label>
          <input value={(form as Record<string,string>)[f.key]} onChange={e => setForm(p=>({...p,[f.key]:e.target.value}))} required={f.required}
            style={{ width:'100%', padding:'9px 12px', border:'1px solid var(--border2)', borderRadius:4, background:'var(--bg3)', color:'var(--text)', fontSize:13, fontFamily:"'Inter',sans-serif", outline:'none' }}/>
        </div>
      ))}
      <div>
        <label style={{ fontSize:11, fontWeight:600, color:'var(--text3)', textTransform:'uppercase' as const, display:'block', marginBottom:5 }}>Item Type</label>
        <select value={form.item_type} onChange={e=>setForm(p=>({...p,item_type:e.target.value}))}
          style={{ width:'100%', padding:'9px 12px', border:'1px solid var(--border2)', borderRadius:4, background:'var(--bg3)', color:'var(--text)', fontSize:13, outline:'none' }}>
          {['screenshot','dashboard','certificate','output','chart'].map(t=><option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      {msg && <div style={{ padding:'10px 14px', background: msg.startsWith('✓')?'rgba(34,197,94,0.1)':'rgba(239,68,68,0.1)', borderRadius:4, fontSize:13, color: msg.startsWith('✓')?'#86EFAC':'#FCA5A5' }}>{msg}</div>}
      <button type="submit" disabled={saving} style={{ padding:'11px 20px', background:'var(--teal)', border:'none', borderRadius:4, color:'#000', fontSize:14, fontWeight:700, cursor:'pointer', opacity:saving?0.7:1 }}>
        {saving?'Saving...':'Save Gallery Item'}
      </button>
    </form>
  )
}

type Tab = 'certs' | 'gallery' | 'status'

export function AdminPage() {
  const { authed, pw, setPw, check } = useAdminAuth()
  const [tab, setTab] = useState<Tab>('certs')
  const [refresh, setRefresh] = useState(0)
  const hasSupabase = !!import.meta.env.VITE_SUPABASE_URL

  if (!authed) {
    return (
      <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
        <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
          style={{ background:'var(--bg2)', border:'1px solid var(--border2)', borderRadius:12, padding:40, width:'100%', maxWidth:400 }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:'var(--amber)', marginBottom:8, letterSpacing:'0.06em' }}>ADMIN ACCESS</div>
          <h2 style={{ fontFamily:"'Instrument Serif',serif", fontSize:28, color:'var(--text)', marginBottom:24 }}>tatulabs.in</h2>
          <input type="password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key==='Enter' && check()}
            placeholder="Enter admin password"
            style={{ width:'100%', padding:'11px 14px', border:'1px solid var(--border2)', borderRadius:4, background:'var(--bg3)', color:'var(--text)', fontSize:14, fontFamily:"'JetBrains Mono',monospace", outline:'none', marginBottom:12, textAlign:'center' as const }}/>
          <button onClick={check} style={{ width:'100%', padding:11, background:'var(--amber)', border:'none', borderRadius:4, color:'#000', fontSize:14, fontWeight:700, cursor:'pointer' }}>Enter</button>
        </motion.div>
      </div>
    )
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', paddingTop:52 }}>
      <div style={{ maxWidth:900, margin:'0 auto', padding:'40px 32px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:32 }}>
          <div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:'var(--amber)', marginBottom:4 }}>ADMIN PANEL</div>
            <h1 style={{ fontFamily:"'Instrument Serif',serif", fontSize:36, color:'var(--text)', letterSpacing:'-1px' }}>tatulabs.in</h1>
          </div>
          <a href="/" style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:'var(--text3)', textDecoration:'none', padding:'6px 12px', border:'1px solid var(--border)', borderRadius:4 }}>← Back to site</a>
        </div>

        {!hasSupabase && (
          <div style={{ padding:'16px 20px', background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:6, marginBottom:24, fontSize:13, color:'var(--amber)' }}>
            ⚠ Supabase not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.
          </div>
        )}

        <div style={{ display:'flex', gap:4, marginBottom:32, borderBottom:'1px solid var(--border)' }}>
          {(['certs','gallery','status'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:600, padding:'10px 16px',
              background:'none', border:'none', cursor:'pointer', color: tab===t?'var(--amber)':'var(--text3)',
              borderBottom: tab===t?'2px solid var(--amber)':'2px solid transparent',
              textTransform:'uppercase' as const, letterSpacing:'0.05em', transition:'all 0.15s',
            }}>{t}</button>
          ))}
        </div>

        {tab === 'certs' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:40 }}>
            <CertForm onSaved={() => setRefresh(r=>r+1)} />
            <CertsList refresh={refresh} />
          </div>
        )}
        {tab === 'gallery' && <GalleryForm onSaved={() => setRefresh(r=>r+1)} />}
        {tab === 'status' && (
          <div>
            <h3 style={{ fontFamily:"'Instrument Serif',serif", fontSize:20, color:'var(--text)', marginBottom:16 }}>Portfolio Status</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {[
                { label:'Profile photo embedded', done:true },
                { label:'BPCL SAP scene + 4 live tables', done:true },
                { label:'Education classroom + 4 live tables', done:true },
                { label:'Intelligence control room + TPRM', done:true },
                { label:'AI·GRC evaluation + Cohen\'s Kappa', done:true },
                { label:'Tools pipeline — 5 stages', done:true },
                { label:'Substack live RSS', done:true },
                { label:'Supabase admin panel', done:true },
                { label:'HCL Guvi cert number — add in Certs tab', done:false },
                { label:'GRC cert — add when complete', done:false },
                { label:'Gallery images — add via Gallery tab', done:false },
              ].map((item,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 16px', background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:6, fontSize:13 }}>
                  <span style={{ color:'var(--text2)' }}>{item.label}</span>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:3, background: item.done?'rgba(34,197,94,0.12)':'rgba(245,158,11,0.12)', color: item.done?'#86EFAC':'var(--amber)', border:`1px solid ${item.done?'rgba(34,197,94,0.2)':'rgba(245,158,11,0.2)'}` }}>
                    {item.done ? '✓ Done' : '⏳ Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
