import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useLenis } from '@/hooks/useLenis'
import { Nav } from '@/components/layout/Nav'
import { WaFloat } from '@/components/layout/WaFloat'
import { Hero } from '@/components/sections/Hero'
import { LogisticsSection } from '@/components/sections/LogisticsSection'
import { EducationSection } from '@/components/sections/EducationSection'
import { IntelligenceSection } from '@/components/sections/IntelligenceSection'
import { AIGRCSection } from '@/components/sections/AIGRCSection'
import { ToolsSection } from '@/components/sections/ToolsSection'
import { WritingSection } from '@/components/sections/WritingSection'
import { CertsSection } from '@/components/sections/CertsSection'
import { ContactSection } from '@/components/sections/ContactSection'
import { AdminPage } from '@/pages/AdminPage'

function Portfolio() {
  useLenis()
  return (
    <>
      <Nav />
      <WaFloat />
      <main>
        <Hero />
        <LogisticsSection />
        <EducationSection />
        <IntelligenceSection />
        <AIGRCSection />
        <ToolsSection />
        <WritingSection />
        <CertsSection />
        <ContactSection />
      </main>
      <footer style={{
        background: 'var(--bg)',
        borderTop: '1px solid var(--border)',
        padding: '36px 48px',
        textAlign: 'center',
      }}>
        <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:20, color:'var(--text)', marginBottom:6 }}>
          Tata Raam Kumar
        </div>
        <div style={{ fontSize:12, color:'var(--text3)', marginBottom:18 }}>
          Operations · Risk · Intelligence · Tamil Nadu, India · All UTC · Night shifts welcome · Available immediately
        </div>
        <div style={{ display:'flex', justifyContent:'center', gap:20, flexWrap:'wrap', marginBottom:16 }}>
          {[
            { label:'LinkedIn', href:'https://www.linkedin.com/in/tata-raam-kumar/' },
            { label:'Substack', href:'https://substack.com/@tataraamkumar' },
            { label:'GitHub', href:'https://github.com/TATARAAMKUMAR33' },
            { label:'tatu.ind@hotmail.com', href:'mailto:tatu.ind@hotmail.com' },
            { label:'+91 95666 98821', href:'https://wa.me/919566698821' },
          ].map(l => (
            <a key={l.label} href={l.href}
              target={l.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener"
              style={{ fontSize:12, color:'var(--text3)', textDecoration:'none', transition:'color 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text3)' }}
            >
              {l.label}
            </a>
          ))}
        </div>
        <div style={{ fontSize:11, color:'var(--text3)', opacity:0.4 }}>
          tatulabs.in · Built with purpose · 2024
        </div>
      </footer>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/admin" element={
          <>
            <Nav />
            <AdminPage />
          </>
        } />
      </Routes>
    </BrowserRouter>
  )
}
