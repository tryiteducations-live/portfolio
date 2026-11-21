import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Post {
  title: string
  link: string
  pubDate: string
  description: string
}

export function WritingSection() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filtered, setFiltered] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')

  useEffect(() => {
    const api = 'https://api.rss2json.com/v1/api.json?rss_url=' +
      encodeURIComponent('https://tataraamkumar.substack.com/feed') + '&count=50'
    fetch(api)
      .then(r => r.json())
      .then(d => {
        if (d.items?.length) { setPosts(d.items); setFiltered(d.items) }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let f = posts.filter(p =>
      !search || p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(search.toLowerCase())
    )
    if (sort === 'oldest') f = [...f].sort((a,b) => new Date(a.pubDate).getTime() - new Date(b.pubDate).getTime())
    else if (sort === 'az') f = [...f].sort((a,b) => a.title.localeCompare(b.title))
    else f = [...f].sort((a,b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    setFiltered(f)
  }, [search, sort, posts])

  return (
    <section id="s-writing" style={{ background:'var(--bg2)', padding:'100px 48px' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ marginBottom:32 }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:600, letterSpacing:'0.12em', color:'var(--text3)', textTransform:'uppercase', marginBottom:12 }}>
            Writing & Research
          </div>
          <h2 style={{ fontFamily:"'Instrument Serif',serif", fontSize:'clamp(32px,4vw,48px)', color:'var(--text)', letterSpacing:'-1px', marginBottom:10 }}>
            Investigative Analysis
          </h2>
          <p style={{ fontSize:14, color:'var(--text2)', maxWidth:560, lineHeight:1.65, marginBottom:24 }}>
            Indian policy, education and healthcare systems — written for decision makers, researchers
            and international organisations entering South Asian markets.
          </p>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search articles..."
              style={{
                flex:1, minWidth:200, padding:'9px 14px',
                border:'1px solid var(--border2)', borderRadius:4,
                background:'var(--bg3)', color:'var(--text)',
                fontSize:13, fontFamily:"'Inter',sans-serif", outline:'none',
              }}
            />
            <select value={sort} onChange={e => setSort(e.target.value)} style={{
              padding:'9px 14px', border:'1px solid var(--border2)', borderRadius:4,
              background:'var(--bg3)', color:'var(--text2)', fontSize:13,
              fontFamily:"'Inter',sans-serif", outline:'none', cursor:'pointer',
            }}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="az">Title A–Z</option>
            </select>
          </div>
        </div>

        {loading && (
          <div style={{ textAlign:'center', padding:40, color:'var(--text3)', fontFamily:"'JetBrains Mono',monospace", fontSize:13 }}>
            Loading articles from Substack...
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:40 }}>
            <p style={{ color:'var(--text3)', fontSize:13 }}>No articles found.</p>
            <a href="https://substack.com/@tataraamkumar" target="_blank" rel="noopener"
              style={{ color:'var(--amber)', fontSize:13, textDecoration:'none' }}>
              View on Substack →
            </a>
          </div>
        )}

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:16 }}>
          {filtered.map((p, i) => (
            <motion.div
              key={p.link}
              initial={{ opacity:0, y:20 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay:i*0.05, duration:0.4 }}
              style={{
                background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:8,
                padding:22, cursor:'pointer', transition:'all 0.2s',
              }}
              whileHover={{ y:-3, borderColor:'var(--border2)', boxShadow:'0 8px 32px rgba(0,0,0,0.3)' }}
              onClick={() => window.open(p.link,'_blank')}
            >
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:'var(--text3)', marginBottom:8, letterSpacing:'0.04em' }}>
                {new Date(p.pubDate).toLocaleDateString('en-IN',{year:'numeric',month:'short',day:'numeric'})}
              </div>
              <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:18, color:'var(--text)', lineHeight:1.3, marginBottom:10 }}>
                {p.title}
              </div>
              <div style={{ fontSize:12, color:'var(--text2)', lineHeight:1.6, marginBottom:14 }}>
                {(p.description||'').replace(/<[^>]+>/g,'').substring(0,150)}...
              </div>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:600, color:'var(--amber)', letterSpacing:'0.03em' }}>
                Read article →
              </span>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:600px){#s-writing{padding:60px 20px!important}}`}</style>
    </section>
  )
}
