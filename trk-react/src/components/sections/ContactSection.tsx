import { motion } from 'framer-motion'

const WA_SVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

export function ContactSection() {
  return (
    <section id="s-contact" style={{ background:'var(--bg2)', padding:'80px 48px', borderTop:'1px solid var(--border)' }}>
      <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr auto', gap:48, alignItems:'start' }}
        className="contact-grid">
        <div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:600, letterSpacing:'0.12em', color:'var(--text3)', textTransform:'uppercase', marginBottom:12 }}>
            Get in Touch
          </div>
          <h2 style={{ fontFamily:"'Instrument Serif',serif", fontSize:'clamp(28px,4vw,44px)', color:'var(--text)', letterSpacing:'-1px', marginBottom:12 }}>
            Let's work together.
          </h2>
          <p style={{ fontSize:14, color:'var(--text2)', lineHeight:1.65, maxWidth:480, marginBottom:24 }}>
            Open to remote roles and project contracts across any UTC timezone. Night shifts welcome.
            Available immediately. India Standard Time — flexible for international teams in
            Singapore, Dubai, London or New York.
          </p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {[
              { label:'💳 Stripe', href:'https://wa.me/919566698821' },
              { label:'🅿 PayPal', href:'https://wa.me/919566698821' },
              { label:'🏦 Bank Transfer', href:'https://wa.me/919566698821' },
              { label:'📱 UPI', href:'https://wa.me/919566698821' },
            ].map(p => (
              <a key={p.label} href={p.href} target="_blank" rel="noopener"
                style={{
                  display:'inline-flex', alignItems:'center', gap:6,
                  fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:600,
                  padding:'5px 12px', border:'1px solid var(--border2)', borderRadius:3,
                  color:'var(--text2)', textDecoration:'none', letterSpacing:'0.03em',
                  transition:'all 0.15s',
                }}
                onMouseEnter={e=>{ const el=e.currentTarget as HTMLAnchorElement; el.style.borderColor='var(--amber)'; el.style.color='var(--amber)' }}
                onMouseLeave={e=>{ const el=e.currentTarget as HTMLAnchorElement; el.style.borderColor='var(--border2)'; el.style.color='var(--text2)' }}
              >
                {p.label}
              </a>
            ))}
          </div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:10, minWidth:200 }}>
          <motion.a
            href="https://wa.me/919566698821?text=Hi%20Tata%20Raam%20Kumar%2C%20I%20found%20your%20portfolio%20and%20would%20like%20to%20discuss%20an%20opportunity."
            target="_blank" rel="noopener"
            whileHover={{ y:-2, boxShadow:'0 8px 32px rgba(37,211,102,0.3)' }}
            style={{
              display:'inline-flex', alignItems:'center', gap:10,
              padding:'13px 20px', background:'#25D366', color:'#000',
              borderRadius:6, fontSize:13, fontWeight:700, textDecoration:'none',
              boxShadow:'0 4px 20px rgba(37,211,102,0.2)', transition:'all 0.2s', whiteSpace:'nowrap',
            }}
          >
            <WA_SVG /> WhatsApp Me Now
          </motion.a>
          <motion.a
            href="https://wa.me/919566698821?text=Hi%2C%20I%20would%20like%20to%20schedule%20a%20call.%20Please%20suggest%20available%20times."
            target="_blank" rel="noopener"
            whileHover={{ y:-2 }}
            style={{
              display:'inline-flex', alignItems:'center', gap:10,
              padding:'13px 20px', background:'var(--bg3)', color:'var(--text)',
              border:'1px solid var(--border2)', borderRadius:6, fontSize:13, fontWeight:600,
              textDecoration:'none', transition:'all 0.2s', whiteSpace:'nowrap',
            }}
          >
            📅 Schedule a Call
          </motion.a>
        </div>
      </div>
      <style>{`
        @media(max-width:768px){
          .contact-grid{grid-template-columns:1fr!important}
          #s-contact{padding:60px 20px!important}
        }
      `}</style>
    </section>
  )
}
