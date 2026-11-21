import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase, Certification } from '@/lib/supabase'
import { STATIC_CERTS, TOOLS_PIPELINE } from '@/lib/data'

export function CertsSection() {
  const [dbCerts, setDbCerts] = useState<Certification[]>([])

  useEffect(() => {
    if (!import.meta.env.VITE_SUPABASE_URL) return
    supabase.from('certifications').select('*').order('issued_date', { ascending: false })
      .then(({ data }) => { if (data) setDbCerts(data) })
  }, [])

  const allTools = TOOLS_PIPELINE.flatMap(s => s.tools.map(t => t.name))
  const uniqueTools = [...new Set(allTools)]

  return (
    <section id="s-certs" style={{ background:'var(--bg)', padding:'100px 48px' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ marginBottom:32 }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:600, letterSpacing:'0.12em', color:'var(--text3)', textTransform:'uppercase', marginBottom:12 }}>
            Certifications & Stack
          </div>
          <h2 style={{ fontFamily:"'Instrument Serif',serif", fontSize:'clamp(32px,4vw,48px)', color:'var(--text)', letterSpacing:'-1px', marginBottom:10 }}>
            Credentials
          </h2>
          <p style={{ fontSize:14, color:'var(--text2)', maxWidth:560 }}>
            Verified credentials — growing continuously. Full technical stack across all four sectors.
          </p>
        </div>

        {/* Tools strip */}
        <div style={{ marginBottom:48, paddingBottom:48, borderBottom:'1px solid var(--border)' }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--text3)', marginBottom:14 }}>
            Technical Stack
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
            {uniqueTools.map((t,i) => (
              <motion.span key={t}
                initial={{ opacity:0, scale:0.9 }}
                whileInView={{ opacity:1, scale:1 }}
                viewport={{ once:true }}
                transition={{ delay:i*0.02 }}
                style={{
                  display:'inline-flex', alignItems:'center', gap:5,
                  fontSize:11, fontWeight:500, padding:'5px 10px',
                  borderRadius:3, background:'var(--bg2)', border:'1px solid var(--border)',
                  color:'var(--text2)', cursor:'default', transition:'all 0.15s',
                }}
                whileHover={{ borderColor:'var(--text3)', color:'var(--text)', y:-1 }}
              >
                {t}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Cert cards */}
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--text3)', marginBottom:14 }}>
          Certifications
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:12 }}>
          {/* Static certs */}
          {STATIC_CERTS.map((c,i) => (
            <motion.div key={i}
              initial={{ opacity:0, y:20 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }}
              transition={{ delay:i*0.1 }}
              style={{
                background:'var(--bg2)', border:'1px solid var(--border)',
                borderTop:`2px solid ${c.border}`, borderRadius:8, padding:22, transition:'all 0.2s',
              }}
              whileHover={{ y:-2, borderColor:'var(--border2)' }}
            >
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--text3)', marginBottom:8 }}>
                {c.issuer}
              </div>
              <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:17, color:'var(--text)', lineHeight:1.3, marginBottom:8 }}>
                {c.name}
              </div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:'var(--text3)', marginBottom:10 }}>
                {c.cert_number}
              </div>
              <div style={{ display:'flex', gap:12, fontSize:11, color:'var(--text3)' }}>
                <span>{c.issued_date}</span>
                <span>·</span>
                <span>{c.sector}</span>
              </div>
            </motion.div>
          ))}

          {/* DB certs from Supabase */}
          {dbCerts.map((c,i) => (
            <motion.div key={c.id}
              initial={{ opacity:0, y:20 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }}
              transition={{ delay:(STATIC_CERTS.length+i)*0.1 }}
              style={{
                background:'var(--bg2)', border:'1px solid var(--border)',
                borderTop:'2px solid var(--amber)', borderRadius:8, padding:22, transition:'all 0.2s',
              }}
              whileHover={{ y:-2 }}
            >
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--text3)', marginBottom:8 }}>
                {c.issuer}
              </div>
              <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:17, color:'var(--text)', lineHeight:1.3, marginBottom:8 }}>
                {c.name}
              </div>
              {c.cert_number && (
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:'var(--text3)', marginBottom:10 }}>
                  {c.cert_number}
                </div>
              )}
              <div style={{ display:'flex', gap:10, flexWrap:'wrap', fontSize:11, color:'var(--text3)', marginBottom:10 }}>
                <span>{c.issued_date}</span>
                {c.expiry_date && <span>· Expires {c.expiry_date}</span>}
                <span>· {c.skill_domain}</span>
              </div>
              {c.verify_url && (
                <a href={c.verify_url} target="_blank" rel="noopener"
                  style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:'var(--amber)', textDecoration:'none', fontWeight:600 }}>
                  Verify ↗
                </a>
              )}
            </motion.div>
          ))}

          {/* Add slot */}
          <div style={{
            border:'1px dashed var(--border2)', borderRadius:8, padding:22,
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            gap:8, minHeight:120, color:'var(--text3)', cursor:'default',
          }}>
            <span style={{ fontSize:24 }}>+</span>
            <span style={{ fontSize:12 }}>New certs via Admin panel</span>
            <span style={{ fontSize:11, color:'var(--text3)', opacity:0.6, textAlign:'center' }}>Supabase connected — add instantly</span>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:600px){#s-certs{padding:60px 20px!important}}`}</style>
    </section>
  )
}
