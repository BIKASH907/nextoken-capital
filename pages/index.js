import { useState } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import AuthModal from '../components/AuthModal'

const MARKETS = [
  { name: 'NXT/EUR', price: '€1.248', change: '+3.42%', up: true },
  { name: 'EURO BOND 5Y', price: '€98.40', change: '+0.18%', up: true },
  { name: 'RE TOKEN LT', price: '€245.00', change: '-0.82%', up: false },
  { name: 'INFRA BOND 3Y', price: '€101.20', change: '+0.54%', up: true },
  { name: 'SME EQUITY A', price: '€18.75', change: '+1.20%', up: true },
  { name: 'GREEN BOND 7Y', price: '€99.80', change: '+0.22%', up: true },
]

const BONDS = [
  { name: 'Baltic Green Bond 2027', symbol: 'BALT-GREEN-27', type: 'Green', yield: '6.4%', term: '3Y', pct: 72, raised: '€3.6M', total: '€5M', min: '€500' },
  { name: 'EU Infrastructure Bond', symbol: 'EU-INFRA-29', type: 'Corporate', yield: '5.1%', term: '5Y', pct: 45, raised: '€9M', total: '€20M', min: '€1,000' },
  { name: 'SME Convertible Note I', symbol: 'SME-CNV-26', type: 'Convertible', yield: '8.2%', term: '2Y', pct: 94, raised: '€940K', total: '€1M', min: '€250' },
]

export default function Home() {
  const router = useRouter()
  const [modal, setModal] = useState(null)

  const gold = '#F0B90B'
  const dark = '#0B0E11'
  const dark2 = '#161A1E'
  const dark3 = '#1E2329'
  const green = '#0ECB81'
  const red = '#F6465D'
  const border = 'rgba(255,255,255,0.06)'
  const muted = 'rgba(255,255,255,0.4)'

  return (
    <div style={{ background: dark, minHeight: '100vh', color: 'rgba(255,255,255,0.85)', fontFamily: 'Inter,sans-serif' }}>
      <Navbar onLogin={() => setModal('login')} onRegister={() => setModal('register')} />

      {modal && <AuthModal mode={modal} onClose={() => setModal(null)} onSwitch={m => setModal(m)} />}

      {/* HERO */}
      <section style={{ paddingTop: '5rem', paddingBottom: '3rem', background: dark, position: 'relative', overflow: 'hidden' }}>
        {/* Grid bg */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(240,185,11,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(240,185,11,0.04) 1px,transparent 1px)', backgroundSize: '44px 44px', maskImage: 'radial-gradient(ellipse at 60% 50%,black 20%,transparent 70%)' }} />
        {/* Glow */}
        <div style={{ position: 'absolute', right: '-5%', top: '-10%', width: 600, height: 500, background: 'radial-gradient(circle,rgba(240,185,11,0.06),transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '4rem 5%', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 680 }}>
            {/* Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '4px 14px', border: `1px solid rgba(240,185,11,0.22)`, borderRadius: 100, fontSize: '0.68rem', fontWeight: 600, color: gold, letterSpacing: '0.5px', marginBottom: '1.5rem' }}>
              <span style={{ width: 5, height: 5, background: green, borderRadius: '50%', animation: 'pulse 2s infinite' }} />
              MiCA Licensed · EU Regulated · DLT Pilot Regime
            </div>

            <h1 style={{ fontSize: 'clamp(2.4rem,4vw,3.6rem)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-2px', color: '#fff', marginBottom: '1.25rem' }}>
              The Global Platform for<br />
              <span style={{ color: gold }}>Tokenized Capital Markets</span>
            </h1>

            <p style={{ fontSize: '1rem', color: muted, lineHeight: 1.8, maxWidth: 520, marginBottom: '2.5rem' }}>
              Issue bonds, tokenize real-world assets, launch equity offerings, and trade on a regulated 24/7 secondary market — all on one compliant platform.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
              <button onClick={() => setModal('register')} style={{ padding: '0.85rem 2.2rem', background: gold, color: 'black', border: 'none', borderRadius: 4, fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>
                Get Started
              </button>
              <button onClick={() => router.push('/exchange')} style={{ padding: '0.85rem 2.2rem', background: dark3, color: 'rgba(255,255,255,0.7)', border: `1px solid rgba(240,185,11,0.2)`, borderRadius: 4, fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>
                Open Exchange
              </button>
            </div>

            {/* KPIs */}
            <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
              {[['$300T+','Global Asset Market'],['190+','Countries'],['<48h','Time to Issue'],['0.2%','Trading Fee']].map(([n,l]) => (
                <div key={l}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}><span style={{ color: gold }}>{n}</span></div>
                  <div style={{ fontSize: '0.65rem', color: muted, letterSpacing: '1px', textTransform: 'uppercase', marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div style={{ background: dark2, borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}`, padding: '0.75rem 5%', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: '3rem', alignItems: 'center', overflowX: 'auto', scrollbarWidth: 'none' }}>
          <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', whiteSpace: 'nowrap', flexShrink: 0 }}>Live</span>
          {MARKETS.map(m => (
            <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: muted }}>{m.name}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{m.price}</span>
              <span style={{ fontSize: '0.68rem', fontWeight: 600, padding: '1px 6px', borderRadius: 2, background: m.up ? 'rgba(14,203,129,0.1)' : 'rgba(246,70,93,0.08)', color: m.up ? green : red }}>{m.change}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <section style={{ padding: '4rem 5%', background: dark }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: gold, marginBottom: '0.65rem' }}>Platform</div>
          <div style={{ fontSize: 'clamp(1.6rem,2.5vw,2.2rem)', fontWeight: 900, letterSpacing: '-1px', marginBottom: '2.5rem' }}>
            Everything to <span style={{ color: gold }}>Access Capital Markets</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 1, background: border }}>
            {[
              { tag: 'Tokenization', title: 'Tokenize Any Asset', desc: 'Convert real estate, infrastructure, and equity into compliant digital tokens. Unlock liquidity in under 48 hours.', link: '/tokenize' },
              { tag: 'Bonds', title: 'Issue Tokenized Bonds', desc: 'Create compliant tokenized bonds up to €1B per offering. Corporate, green, and convertible bonds structured in hours.', link: '/bonds' },
              { tag: 'IPO', title: 'Go Public in 48h', desc: 'Issue equity tokens, manage cap table on-chain, and raise capital from investors across 27 EU countries.', link: '/equity' },
              { tag: 'Exchange', title: 'Trade 24/7', desc: 'DLT MTF regulated secondary marketplace. Order-book + AMM hybrid. Atomic settlement. 0.2% fee only.', link: '/exchange' },
            ].map(f => (
              <div key={f.tag}
                onClick={() => router.push(f.link)}
                style={{ background: dark2, padding: '2rem', cursor: 'pointer', transition: 'background 0.15s', borderTop: `2px solid transparent` }}
                onMouseEnter={e => { e.currentTarget.style.background = dark3; e.currentTarget.style.borderTopColor = gold }}
                onMouseLeave={e => { e.currentTarget.style.background = dark2; e.currentTarget.style.borderTopColor = 'transparent' }}
              >
                <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: gold, marginBottom: '0.4rem' }}>{f.tag}</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.6rem' }}>{f.title}</div>
                <div style={{ fontSize: '0.8rem', color: muted, lineHeight: 1.8 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '4rem 5%', background: dark2 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: gold, marginBottom: '0.65rem' }}>How It Works</div>
          <div style={{ fontSize: 'clamp(1.6rem,2.5vw,2.2rem)', fontWeight: 900, letterSpacing: '-1px', marginBottom: '2.5rem' }}>
            From Asset to Global Market <span style={{ color: gold }}>in 3 Steps</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 1, background: border }}>
            {[
              { n: '01', title: 'Submit Your Asset', desc: 'Upload documentation and financials. Our compliance engine structures the token offering within 24 hours.', eta: '24 hours' },
              { n: '02', title: 'Issue & Raise Capital', desc: 'Smart contracts deployed. Your offering goes live to verified investors across 190+ countries in real time.', eta: '24–48 hours' },
              { n: '03', title: 'Trade on Exchange', desc: 'Tokens list automatically on NXT Exchange. Investors gain 24/7 liquidity and you get ongoing capital access.', eta: 'Live at launch' },
            ].map(s => (
              <div key={s.n} style={{ background: dark3, padding: '2rem', position: 'relative', borderTop: `2px solid ${gold}` }}>
                <div style={{ position: 'absolute', top: '1rem', right: '1.5rem', fontSize: '3rem', fontWeight: 900, color: 'rgba(240,185,11,0.06)' }}>{s.n}</div>
                <div style={{ width: 30, height: 30, border: `1.5px solid rgba(240,185,11,0.3)`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 800, color: gold, marginBottom: '1rem' }}>{s.n.replace('0','')}</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.5rem' }}>{s.title}</div>
                <div style={{ fontSize: '0.8rem', color: muted, lineHeight: 1.8, marginBottom: '0.75rem' }}>{s.desc}</div>
                <div style={{ fontSize: '0.62rem', fontWeight: 700, color: gold, letterSpacing: '1px', textTransform: 'uppercase' }}>→ {s.eta}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BONDS PREVIEW */}
      <section style={{ padding: '4rem 5%', background: dark }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: gold, marginBottom: '0.4rem' }}>Bond Market</div>
              <div style={{ fontSize: 'clamp(1.4rem,2vw,2rem)', fontWeight: 900, letterSpacing: '-1px' }}><span style={{ color: gold }}>Live</span> Bond Offerings</div>
            </div>
            <button onClick={() => router.push('/bonds')} style={{ padding: '0.5rem 1.25rem', background: dark3, border: `1px solid ${border}`, color: 'rgba(255,255,255,0.6)', borderRadius: 4, fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>View All →</button>
          </div>
          <div style={{ background: dark2, border: `1px solid ${border}`, borderRadius: 4, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Bond Name','Type','Yield','Term','Progress','Min. Invest',''].map(h => (
                    <th key={h} style={{ padding: '0.6rem 1rem', textAlign: 'left', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: muted, background: dark3, borderBottom: `1px solid ${border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BONDS.map(b => (
                  <tr key={b.symbol} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '0.9rem 1rem', borderBottom: `1px solid ${border}` }}>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.85rem' }}>{b.name}</div>
                      <div style={{ fontSize: '0.68rem', color: muted }}>{b.symbol}</div>
                    </td>
                    <td style={{ padding: '0.9rem 1rem', borderBottom: `1px solid ${border}` }}>
                      <span style={{ padding: '2px 7px', borderRadius: 2, fontSize: '0.68rem', fontWeight: 700, background: b.type === 'Green' ? 'rgba(14,203,129,0.1)' : b.type === 'Convertible' ? 'rgba(24,144,255,0.1)' : 'rgba(240,185,11,0.1)', color: b.type === 'Green' ? green : b.type === 'Convertible' ? '#1890FF' : gold }}>{b.type}</span>
                    </td>
                    <td style={{ padding: '0.9rem 1rem', borderBottom: `1px solid ${border}`, fontWeight: 800, color: green, fontSize: '0.92rem' }}>{b.yield}</td>
                    <td style={{ padding: '0.9rem 1rem', borderBottom: `1px solid ${border}`, color: muted, fontSize: '0.82rem' }}>{b.term}</td>
                    <td style={{ padding: '0.9rem 1rem', borderBottom: `1px solid ${border}` }}>
                      <div style={{ width: 100, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: `${b.pct}%`, height: '100%', background: gold, borderRadius: 2 }} />
                      </div>
                      <div style={{ fontSize: '0.65rem', color: muted, marginTop: 3 }}>{b.pct}% · {b.raised}/{b.total}</div>
                    </td>
                    <td style={{ padding: '0.9rem 1rem', borderBottom: `1px solid ${border}`, color: muted, fontSize: '0.82rem' }}>{b.min}</td>
                    <td style={{ padding: '0.9rem 1rem', borderBottom: `1px solid ${border}` }}>
                      <button onClick={() => setModal('register')} style={{ padding: '0.35rem 0.9rem', background: gold, color: 'black', border: 'none', borderRadius: 3, fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>Invest</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section style={{ padding: '4rem 5%', background: dark2 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: gold, marginBottom: '0.65rem' }}>Why Nextoken</div>
          <div style={{ fontSize: 'clamp(1.6rem,2.5vw,2.2rem)', fontWeight: 900, letterSpacing: '-1px', marginBottom: '2.5rem' }}>Built Different. <span style={{ color: gold }}>Built to Last.</span></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 1, background: border }}>
            {[
              ['01','Regulatory-First','MiCA CASP, MiFID II, and DLT MTF licensed by the Bank of Lithuania. Compliance built into every smart contract.'],
              ['02','True Global Reach','EU MiCA passporting covers all 27 countries. FinCEN MSB for US investors. 190+ countries from day one.'],
              ['03','Radically Cheaper','Traditional bond: €500k+. Traditional IPO: €5M+. Nextoken: from €5,000. Same result in 48 hours.'],
              ['04','Institutional Custody','Licensed EU custodians. Smart contracts audited. Multi-sig governance with 72-hour timelocks.'],
              ['05','Full Transparency','Every transfer and payment recorded on-chain. Immutable audit trails replace expensive reconciliation.'],
              ['06','24/7 Liquidity','Bond and equity markets never close. Capital never sleeps. Trade any asset, any time, anywhere.'],
            ].map(([n,t,d]) => (
              <div key={n} style={{ background: dark3, padding: '1.75rem' }}>
                <div style={{ fontSize: '0.62rem', fontWeight: 700, color: gold, letterSpacing: '2px', marginBottom: '0.65rem' }}>{n}</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, marginBottom: '0.4rem' }}>{t}</div>
                <div style={{ fontSize: '0.78rem', color: muted, lineHeight: 1.8 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPLIANCE */}
      <section style={{ padding: '4rem 5%', background: dark }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: gold, marginBottom: '0.65rem' }}>Compliance</div>
          <div style={{ fontSize: 'clamp(1.6rem,2.5vw,2.2rem)', fontWeight: 900, letterSpacing: '-1px', marginBottom: '2.5rem' }}>Licensed. Regulated. <span style={{ color: gold }}>Institutional-Grade.</span></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 1, background: border }}>
            {[
              ['MiCA CASP','EU Crypto-Assets Regulation. Class 2 covering exchange, custody, and token issuance across 27 EU states.'],
              ['MiFID II','Investment Firm license enabling bond and equity issuance and brokerage across the EU.'],
              ['DLT Pilot','DLT MTF authorization for tokenized securities trading and settlement on blockchain.'],
              ['FinCEN MSB','US Money Services Business registration enabling US investor access to the platform.'],
            ].map(([name,desc]) => (
              <div key={name} style={{ background: dark2, padding: '1.75rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: '#fff', marginBottom: '0.4rem' }}>{name}</div>
                <div style={{ fontSize: '0.72rem', color: muted, lineHeight: 1.7, marginBottom: '0.6rem' }}>{desc}</div>
                <span style={{ padding: '2px 9px', background: 'rgba(14,203,129,0.1)', borderRadius: 2, fontSize: '0.62rem', fontWeight: 700, color: green }}>Licensed</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: gold, padding: '4rem 5%', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%,rgba(255,255,255,0.12),transparent 50%)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 900, color: 'black', letterSpacing: '-1px', marginBottom: '0.75rem' }}>Start on Nextoken Capital Today</div>
          <p style={{ fontSize: '0.9rem', color: 'rgba(0,0,0,0.55)', margin: '0 auto 2rem', maxWidth: 420, lineHeight: 1.7 }}>Join the companies already tokenizing assets and accessing global capital markets.</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setModal('register')} style={{ padding: '0.85rem 2.2rem', background: 'black', color: 'white', border: 'none', borderRadius: 4, fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>Create Account</button>
            <button onClick={() => router.push('/exchange')} style={{ padding: '0.85rem 2.2rem', background: 'transparent', color: 'rgba(0,0,0,0.7)', border: '1.5px solid rgba(0,0,0,0.2)', borderRadius: 4, fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>Open Exchange</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: dark2, padding: '3rem 5% 1.5rem', borderTop: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontFamily: 'Arial Black,sans-serif', fontSize: 20, fontWeight: 900, color: gold, letterSpacing: -1 }}>NXT</span>
                <div style={{ width: 1, height: 22, background: 'rgba(240,185,11,0.2)', margin: '0 10px' }} />
                <div><div style={{ fontFamily: 'Arial Black,sans-serif', fontSize: 12, fontWeight: 900, color: '#fff' }}>NEXTOKEN</div><div style={{ fontSize: 7, color: gold, letterSpacing: 4 }}>CAPITAL</div></div>
              </div>
              <div style={{ fontSize: '0.78rem', color: muted, lineHeight: 1.8, maxWidth: 240 }}>The global platform for tokenized capital markets. Issue bonds, equity, and real-world assets. Trade 24/7.</div>
            </div>
            {[
              ['Platform', ['Exchange','Bonds','Equity & IPO','Tokenize Asset']],
              ['Company', ['About','Team','Careers','Blog']],
              ['Legal', ['Terms of Service','Privacy Policy','Risk Disclosure','AML Policy']],
            ].map(([title, links]) => (
              <div key={title}>
                <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: '0.85rem' }}>{title}</div>
                {links.map(l => <div key={l} style={{ fontSize: '0.78rem', color: muted, marginBottom: '0.45rem', cursor: 'pointer' }}>{l}</div>)}
              </div>
            ))}
          </div>
          <div style={{ paddingTop: '1.5rem', borderTop: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.2)' }}>© 2025 Nextoken Capital UAB. Registered in Lithuania. Regulated by the Bank of Lithuania.</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['MiCA','MiFID II','DLT Pilot','FinCEN'].map(t => (
                <span key={t} style={{ padding: '2px 8px', background: 'rgba(240,185,11,0.05)', borderRadius: 2, fontSize: '0.62rem', fontWeight: 700, color: 'rgba(240,185,11,0.35)' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style>{`@keyframes pulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.3;transform:scale(1.5);}}`}</style>
    </div>
  )
}
