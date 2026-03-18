import { useState } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import AuthModal from '../components/AuthModal'

const EQUITY = [
  { company: 'Vilnius FinTech UAB', sector: 'FinTech', stage: 'Series A', valuation: '€12M', target: '€2,000,000', price: '€18.75', pct: 68, raised: '€1.36M', min: '€100' },
  { company: 'Baltic Solar OÜ', sector: 'CleanTech', stage: 'Seed', valuation: '€3M', target: '€500,000', price: '€3.00', pct: 40, raised: '€200K', min: '€50' },
  { company: 'Warsaw PropTech S.A.', sector: 'PropTech', stage: 'IPO', valuation: '€25M', target: '€5,000,000', price: '€2.50', pct: 22, raised: '€1.1M', min: '€250' },
]

export default function Equity() {
  const router = useRouter()
  const [modal, setModal] = useState(null)
  const gold='#F0B90B',dark='#0B0E11',dark2='#161A1E',dark3='#1E2329',green='#0ECB81',border='rgba(255,255,255,0.06)',muted='rgba(255,255,255,0.4)'

  return (
    <div style={{ background: dark, minHeight: '100vh', color: 'rgba(255,255,255,0.85)', fontFamily: 'Inter,sans-serif' }}>
      <Navbar onLogin={() => setModal('login')} onRegister={() => setModal('register')} />
      {modal && <AuthModal mode={modal} onClose={() => setModal(null)} onSwitch={m => setModal(m)} />}
      <div style={{ paddingTop: 60 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 5%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: gold, marginBottom: '0.4rem' }}>Equity & IPO</div>
              <div style={{ fontSize: 'clamp(1.4rem,2.5vw,2rem)', fontWeight: 900, letterSpacing: '-1px' }}>Live Equity Offerings</div>
            </div>
            <button onClick={() => router.push('/dashboard')} style={{ padding: '0.5rem 1.25rem', background: gold, color: 'black', border: 'none', borderRadius: 4, fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>+ Launch IPO</button>
          </div>
          <div style={{ background: dark2, border: `1px solid ${border}`, borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700 }}>Active Equity Offerings</span>
              <span style={{ padding: '2px 8px', background: 'rgba(24,144,255,0.1)', borderRadius: 2, fontSize: '0.65rem', fontWeight: 700, color: '#1890FF' }}>3 Live</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>{['Company','Sector','Stage','Raise Target','Valuation','Token Price','Progress','Min. Invest',''].map(h => <th key={h} style={{ padding: '0.6rem 1rem', textAlign: 'left', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: muted, background: dark3, borderBottom: `1px solid ${border}` }}>{h}</th>)}</tr></thead>
              <tbody>
                {EQUITY.map(e => (
                  <tr key={e.company} onMouseEnter={el => el.currentTarget.style.background='rgba(255,255,255,0.02)'} onMouseLeave={el => el.currentTarget.style.background='transparent'}>
                    <td style={{ padding: '0.9rem 1rem', borderBottom: `1px solid ${border}` }}><div style={{ fontWeight: 700 }}>{e.company}</div></td>
                    <td style={{ padding: '0.9rem 1rem', borderBottom: `1px solid ${border}` }}><span style={{ padding: '2px 7px', borderRadius: 2, fontSize: '0.68rem', fontWeight: 700, background: 'rgba(240,185,11,0.1)', color: gold }}>{e.sector}</span></td>
                    <td style={{ padding: '0.9rem 1rem', borderBottom: `1px solid ${border}` }}><span style={{ padding: '2px 7px', borderRadius: 2, fontSize: '0.68rem', fontWeight: 700, background: 'rgba(14,203,129,0.1)', color: green }}>{e.stage}</span></td>
                    <td style={{ padding: '0.9rem 1rem', borderBottom: `1px solid ${border}`, color: muted }}>{e.target}</td>
                    <td style={{ padding: '0.9rem 1rem', borderBottom: `1px solid ${border}`, color: muted }}>{e.valuation}</td>
                    <td style={{ padding: '0.9rem 1rem', borderBottom: `1px solid ${border}`, fontWeight: 700 }}>{e.price}</td>
                    <td style={{ padding: '0.9rem 1rem', borderBottom: `1px solid ${border}` }}>
                      <div style={{ width: 120, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: `${e.pct}%`, height: '100%', background: gold }} />
                      </div>
                      <div style={{ fontSize: '0.62rem', color: muted, marginTop: 3 }}>{e.pct}% · {e.raised}</div>
                    </td>
                    <td style={{ padding: '0.9rem 1rem', borderBottom: `1px solid ${border}`, color: muted }}>{e.min}</td>
                    <td style={{ padding: '0.9rem 1rem', borderBottom: `1px solid ${border}` }}>
                      <button onClick={() => setModal('register')} style={{ padding: '0.35rem 0.9rem', background: gold, color: 'black', border: 'none', borderRadius: 3, fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>Invest</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
