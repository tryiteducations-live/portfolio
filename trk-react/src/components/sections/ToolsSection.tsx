import { TOOLS_PIPELINE } from '@/lib/data'
import { motion } from 'framer-motion'

const SECTOR_COLORS: Record<string, string> = {
  logistics: '#F59E0B', education: '#14B8A6',
  intelligence: '#818CF8', aigrc: '#F43F5E',
}

export function ToolsSection() {
  return (
    <section id="s-tools" style={{ background:'var(--bg)', padding:'100px 48px' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ marginBottom:40 }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:600, letterSpacing:'0.12em', color:'var(--text3)', textTransform:'uppercase' as const, marginBottom:12 }}>Tools & Pipeline</div>
          <h2 style={{ fontFamily:"'Instrument Serif',serif", fontSize:'clamp(32px,4vw,48px)', color:'var(--text)', letterSpacing:'-1px', marginBottom:12 }}>One Tool. Many Workflows.</h2>
          <p style={{ fontSize:14, color:'var(--text2)', maxWidth:560, lineHeight:1.65 }}>Every tool across all four sectors, mapped to the stage in the pipeline where it operates. Colour-coded by sector.</p>
        </div>

        <div style={{ border:'1px solid var(--border)', borderRadius:8, overflow:'hidden' }}>
          {TOOLS_PIPELINE.map((stage, si) => (
            <motion.div key={stage.stage}
              initial={{ opacity:0, x:-20 }}
              whileInView={{ opacity:1, x:0 }}
              viewport={{ once:true }}
              transition={{ duration:0.5, delay:si*0.1 }}
              style={{ display:'grid', gridTemplateColumns:'160px 1fr', borderBottom: si < TOOLS_PIPELINE.length-1 ? '1px solid var(--border)' : 'none' }}
            >
              <div style={{ padding:'24px 20px', borderRight:'1px solid var(--border)', fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase' as const, display:'flex', flexDirection:'column' as const, gap:4, justifyContent:'center' as const }}>
                <span style={{ fontFamily:"'Instrument Serif',serif", fontSize:28, lineHeight:1, opacity:0.12, color:'var(--text)' }}>{stage.stage}</span>
                <span style={{ color:'var(--text3)' }}>{stage.label}</span>
              </div>
              <div style={{ padding:'16px 24px', display:'flex', flexWrap:'wrap' as const, gap:8, alignItems:'center' as const }}>
                {stage.tools.map((tool: { name: string; sector: string }) => (
                  <span key={tool.name}
                    style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'7px 12px', border:'1px solid var(--border2)', borderRadius:4, background:'var(--bg2)', fontSize:12, fontWeight:500, color:'var(--text2)', transition:'all 0.2s', cursor:'default' }}
                    onMouseEnter={e => { const el=e.currentTarget as HTMLSpanElement; el.style.borderColor=SECTOR_COLORS[tool.sector]||'var(--text3)'; el.style.color=SECTOR_COLORS[tool.sector]||'var(--text)'; el.style.transform='translateY(-1px)' }}
                    onMouseLeave={e => { const el=e.currentTarget as HTMLSpanElement; el.style.borderColor='var(--border2)'; el.style.color='var(--text2)'; el.style.transform='translateY(0)' }}
                  >
                    <span style={{ width:6, height:6, borderRadius:'50%', background:SECTOR_COLORS[tool.sector]||'var(--text3)', flexShrink:0 }}/>
                    {tool.name}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{ display:'flex', gap:20, marginTop:20, flexWrap:'wrap' as const }}>
          {Object.entries(SECTOR_COLORS).map(([k,c]) => (
            <div key={k} style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:'var(--text3)' }}>
              <span style={{ width:8, height:8, borderRadius:'50%', background:c }}/>
              {k.charAt(0).toUpperCase()+k.slice(1)}
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:600px){#s-tools{padding:60px 20px!important}}`}</style>
    </section>
  )
}
