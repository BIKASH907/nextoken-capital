import { useState } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import AuthModal from '../components/AuthModal'

const BONDS = [
  { name: 'Baltic Green Bond 2027', symbol: 'BALT-GREEN-27', type: 'Green', issuer: 'Baltic Energy UAB', yield: '6.4%', term: '3Y', maturity: 'Dec 2027', coupon: 'Annual', pct: 72, raised: '€3.6M', total: '€5M', min: '€500' },
  { name: 'EU Infrastructure Bond', symbol: 'EU-INFRA-29', type: 'Corporate', issuer: 'EuroInfra SA', yield: '5.1%', term: '5Y', maturity: 'Jun 2029', coupon: 'Semi-Annual', pct: 45, raised: '€9M', total: '€20M', min: '€1,000' },
  { name: 'SME Convertible Note I', symbol: 'SME-CNV-26', type: 'Convertible', issuer: 'Vilnius Tech UAB', yield: '8.2%', term: '2Y', maturity: 'Mar 2026', coupon: 'Quarterly', pct: 94, raised: '€940K', total: '€1M', min: '€250' },
  { name: 'Renewable Energy Bond 2030', symbol: 'RE-ENERGY-30', type: 'Green', issuer: 'CleanPower OÜ', yield: '4.8%', term: '7Y', maturity: 'Jan 2030', coupon: 'Annual', pct: 28, raised: '€5.6M', total: '€20M', min: '€2,000' },
]

export default function Bonds() {
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
              <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: gold, marginBottom: '0.4rem' }}>Bond Market</div>
              <div style={{ fontSize: 'clamp(1.4rem,2.5vw,2rem)', fontWeight: 900, letterSpacing: '-1px' }}>Tokenized Bond Offerings</div>
            </div>
            <button onClick={() => setModal('register')} style={{ padding: '0.5rem 1.25rem', background: gold, color: 'black', border: 'none', borderRadius: 4, fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>+ Issue Bond</button>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: border, marginBottom: '1.5rem' }}>
            {[['€46.5M','Total Bond Market Cap'],['6.1% avg','Average Yield APY'],['4 Active','Live Fundraising']].map(([v,l]) => (
              <div key={l} style={{ background: dark2, padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: gold, letterSpacing: '-0.5px' }}>{v}</div>
                <div style={{ fontSize: '0.65rem', color: muted, letterSpacing: '1px', textTransform: 'uppercase', marginTop: 3 }}>{l}</div>
              </div>
            ))}
          </div>

          <div style={{ background: dark2, border: `1px solid ${border}`, borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Active Bond Offerings</span>
              <span style={{ padding: '2px 8px', background: 'rgba(14,203,129,0.1)', borderRadius: 2, fontSize: '0.65rem', fontWeight: 700, color: green }}>4 Live</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>{['Bond Name','Type','Yield','Term','Maturity','Coupon','Progress','Min. Invest',''].map(h => <th key={h} style={{ padding: '0.6rem 1rem', textAlign: 'left', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: muted, background: dark3, borderBottom: `1px solid ${border}` }}>{h}</th>)}</tr></thead>
              <tbody>
                {BONDS.map(b => (
                  <tr key={b.symbol} onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'} onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                    <td style={{ padding: '0.9rem 1rem', borderBottom: `1px solid ${border}` }}>
                      <div style={{ fontWeight: 700, color: '#fff' }}>{b.name}</div>
                      <div style={{ fontSize: '0.65rem', color: muted }}>{b.symbol} · {b.issuer}</div>
                    </td>
                    <td style={{ padding: '0.9rem 1rem', borderBottom: `1px solid ${border}` }}>
                      <span style={{ padding: '2px 7px', borderRadius: 2, fontSize: '0.68rem', fontWeight: 700, background: b.type==='Green'?'rgba(14,203,129,0.1)':b.type==='Convertible'?'rgba(24,144,255,0.1)':'rgba(240,185,11,0.1)', color: b.type==='Green'?green:b.type==='Convertible'?'#1890FF':gold }}>{b.type}</span>
                    </td>
                    <td style={{ padding: '0.9rem 1rem', borderBottom: `1px solid ${border}`, fontWeight: 800, color: green, fontSize: '0.92rem' }}>{b.yield}</td>
                    <td style={{ padding: '0.9rem 1rem', borderBottom: `1px solid ${border}`, color: muted }}>{b.term}</td>
                    <td style={{ padding: '0.9rem 1rem', borderBottom: `1px solid ${border}`, color: muted, fontSize: '0.8rem' }}>{b.maturity}</td>
                    <td style={{ padding: '0.9rem 1rem', borderBottom: `1px solid ${border}`, color: muted, fontSize: '0.8rem' }}>{b.coupon}</td>
                    <td style={{ padding: '0.9rem 1rem', borderBottom: `1px solid ${border}` }}>
                      <div style={{ width: 120, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: `${b.pct}%`, height: '100%', background: gold, borderRadius: 2 }} />
                      </div>
                      <div style={{ fontSize: '0.62rem', color: muted, marginTop: 3 }}>{b.pct}% · {b.raised}/{b.total}</div>
                    </td>
                    <td style={{ padding: '0.9rem 1rem', borderBottom: `1px solid ${border}`, color: muted }}>{b.min}</td>
                    <td style={{ padding: '0.9rem 1rem', borderBottom: `1px solid ${border}` }}>
                      <button onClick={() => setModal('register')} style={{ padding: '0.35rem 0.9rem', background: gold, color: 'black', border: 'none', borderRadius: 3, fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>Invest Now</button>
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
