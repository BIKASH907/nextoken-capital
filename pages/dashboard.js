
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../lib/AuthContext'
import Navbar from '../components/Navbar'
import AuthModal from '../components/AuthModal'

export default function Dashboard() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [modal, setModal] = useState(null)
  const [panel, setPanel] = useState('overview')
  const [msg, setMsg] = useState('')
  const [form, setForm] = useState({})

  const gold='#F0B90B',dark='#0B0E11',dark2='#161A1E',dark3='#1E2329',dark4='#252930'
  const green='#0ECB81',red='#F6465D',border='rgba(255,255,255,0.06)',muted='rgba(255,255,255,0.4)'

  useEffect(() => { if (!loading && !user) setModal('login') }, [user, loading])

  const inp = { width: '100%', padding: '0.65rem 0.9rem', background: dark3, border: `1px solid ${border}`, borderRadius: 4, color: '#fff', fontSize: '0.85rem', fontFamily: 'Inter,sans-serif', outline: 'none', boxSizing: 'border-box', marginTop: 2 }
  const lbl = { display: 'block', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: muted, marginBottom: 2 }
  const fg = { marginBottom: '1rem' }

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: '▦' },
    { id: 'portfolio', label: 'Portfolio', icon: '◈' },
    { id: 'sep1', label: 'MARKETS', sep: true },
    { id: 'exchange', label: 'Exchange', icon: '↗', link: '/exchange' },
    { id: 'bonds-page', label: 'Bonds', icon: '≡', badge: '4', link: '/bonds' },
    { id: 'equity-page', label: 'Equity & IPO', icon: '◆', link: '/equity' },
    { id: 'sep2', label: 'ISSUER TOOLS', sep: true },
    { id: 'tokenize', label: 'Tokenize Asset', icon: '+' },
    { id: 'issue-bond', label: 'Issue Bond', icon: '≡' },
    { id: 'ipo', label: 'Launch IPO', icon: '↑' },
    { id: 'sep3', label: 'ACCOUNT', sep: true },
    { id: 'kyc', label: 'KYC Verification', icon: '👤' },
    { id: 'settings', label: 'Settings', icon: '⚙' },
  ]

  async function submitForm(type) {
    setMsg('')
    const msgs = {
      tokenize: `Asset "${form.asset_name || 'your asset'}" submitted for review. Our team will contact you within 24 hours.`,
      bond: `Bond "${form.bond_name || 'your bond'}" submitted. Compliance review takes 24–48 hours.`,
      ipo: 'IPO application submitted. Our team will review within 48 hours.',
      kyc: `KYC documents submitted. Verification takes 1–2 business days.`,
      settings: 'Settings saved successfully.'
    }
    setMsg(msgs[type] || 'Submitted successfully.')
  }

  const SbItem = ({ item }) => {
    if (item.sep) return <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', padding: '0.6rem 0.75rem 0.3rem' }}>{item.label}</div>
    const active = panel === item.id
    return (
      <div onClick={() => item.link ? router.push(item.link) : setPanel(item.id)}
        style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '0.55rem 0.75rem', borderRadius: 4, fontSize: '0.8rem', fontWeight: active ? 700 : 500, color: active ? gold : muted, background: active ? 'rgba(240,185,11,0.08)' : 'transparent', cursor: 'pointer', transition: 'all 0.15s' }}
        onMouseEnter={e => { if (!active) e.currentTarget.style.background = dark3 }}
        onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
      >
        <span style={{ fontSize: '0.75rem', width: 16, textAlign: 'center' }}>{item.icon}</span>
        <span style={{ flex: 1 }}>{item.label}</span>
        {item.badge && <span style={{ padding: '1px 6px', background: gold, borderRadius: 100, fontSize: '0.6rem', fontWeight: 800, color: 'black' }}>{item.badge}</span>}
      </div>
    )
  }

  return (
    <div style={{ background: dark, minHeight: '100vh', color: 'rgba(255,255,255,0.85)', fontFamily: 'Inter,sans-serif' }}>
   
      {modal && <AuthModal mode={modal} onClose={() => { setModal(null); if (!user) router.push('/') }} onSwitch={m => setModal(m)} />}

      <div style={{ paddingTop: 60, display: 'flex', minHeight: 'calc(100vh - 60px)' }}>
        <aside style={{ width: 220, background: dark2, borderRight: `1px solid ${border}`, padding: '1rem 0', flexShrink: 0, position: 'sticky', top: 60, height: 'calc(100vh - 60px)', overflowY: 'auto' }}>
          {navItems.map(item => <div key={item.id} style={{ padding: item.sep ? '0' : '0 0.75rem' }}><SbItem item={item} /></div>)}
        </aside>

        <main style={{ flex: 1, padding: '1.75rem', overflowX: 'hidden' }}>
          {panel === 'overview' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '-0.5px' }}>
                    Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}{user ? `, ${user.first_name}` : ''}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: muted }}>Your Nextoken Capital overview</div>
                </div>
                <button onClick={() => setPanel('tokenize')} style={{ padding: '0.45rem 1.1rem', background: gold, color: 'black', border: 'none', borderRadius: 4, fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>+ New Issuance</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: border, marginBottom: '1.5rem' }}>
                {[['Portfolio Value','€0.00','Start investing'],['Active Investments','0','Browse markets'],['Pending Returns','€0.00','No positions yet'],['Assets Issued','0','Issue first asset']].map(([l,v,c]) => (
                  <div key={l} style={{ background: dark2, padding: '1.25rem 1.5rem' }}>
                    <div style={{ fontSize: '0.72rem', color: muted, marginBottom: '0.35rem' }}>{l}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>{v}</div>
                    <div style={{ fontSize: '0.72rem', color: muted, marginTop: 4 }}>{c}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.25rem' }}>
                <div style={{ background: dark2, border: `1px solid ${border}`, borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Market Overview</span>
                    <span style={{ fontSize: '0.65rem', fontWeight: 600, color: green }}>● Live</span>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr>{['Asset','Price','24h Change','Volume'].map(h => <th key={h} style={{ padding: '0.6rem 1rem', textAlign: 'left', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: muted, background: dark3, borderBottom: `1px solid ${border}` }}>{h}</th>)}</tr></thead>
                    <tbody>
                      {[['NXT/EUR','€1.248','+3.42%',true,'€2.4M'],['EURO BOND 5Y','€98.40','+0.18%',true,'€14.2M'],['RE TOKEN LT','€245.00','-0.82%',false,'€890K'],['SME EQUITY A','€18.75','+1.20%',true,'€440K'],['GREEN BOND 7Y','€99.80','+0.22%',true,'€5.6M']].map(([n,p,c,up,v]) => (
                        <tr key={n} onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'} onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                          <td style={{ padding: '0.85rem 1rem', borderBottom: `1px solid ${border}`, fontWeight: 700 }}>{n}</td>
                          <td style={{ padding: '0.85rem 1rem', borderBottom: `1px solid ${border}` }}>{p}</td>
                          <td style={{ padding: '0.85rem 1rem', borderBottom: `1px solid ${border}` }}><span style={{ padding: '2px 7px', borderRadius: 2, fontSize: '0.68rem', fontWeight: 700, background: up?'rgba(14,203,129,0.1)':'rgba(246,70,93,0.08)', color: up?green:red }}>{c}</span></td>
                          <td style={{ padding: '0.85rem 1rem', borderBottom: `1px solid ${border}`, color: muted }}>{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ background: dark2, border: `1px solid ${border}`, borderRadius: 4 }}>
                  <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${border}` }}><span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Quick Actions</span></div>
                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {[['+ Tokenize an Asset','tokenize',gold,'black'],['+ Issue a Bond','issue-bond',dark4,'rgba(255,255,255,0.7)'],['+ Launch IPO','ipo',dark4,'rgba(255,255,255,0.7)'],['Open Exchange','/exchange',dark4,'rgba(255,255,255,0.7)'],['Complete KYC','kyc',dark4,'rgba(255,255,255,0.7)']].map(([label,target,bg,color]) => (
                      <button key={label} onClick={() => target.startsWith('/') ? router.push(target) : setPanel(target)}
                        style={{ width: '100%', background: bg, color, border: 'none', borderRadius: 4, fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter,sans-serif', textAlign: 'left', padding: '0.65rem 1rem' }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {panel === 'portfolio' && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}><div style={{ fontSize: '1.3rem', fontWeight: 900 }}>Portfolio</div><div style={{ fontSize: '0.78rem', color: muted }}>Your investments and holdings</div></div>
              <div style={{ padding: '1rem', background: 'rgba(240,185,11,0.08)', border: `1px solid rgba(240,185,11,0.15)`, borderRadius: 4, fontSize: '0.85rem', color: gold, marginBottom: '1.5rem' }}>
                Your portfolio is empty. Start investing in bonds, equity, or tokenized assets.
              </div>
              <button onClick={() => router.push('/bonds')} style={{ padding: '0.7rem 1.75rem', background: gold, color: 'black', border: 'none', borderRadius: 4, fontSize: '0.88rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>Browse Bonds →</button>
            </div>
          )}

          {panel === 'tokenize' && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}><div style={{ fontSize: '1.3rem', fontWeight: 900 }}>Tokenize an Asset</div><div style={{ fontSize: '0.78rem', color: muted }}>Convert your real-world asset into a regulated digital token in under 48 hours</div></div>
              {msg && <div style={{ padding: '0.75rem 1rem', background: 'rgba(14,203,129,0.1)', border: `1px solid rgba(14,203,129,0.2)`, borderRadius: 4, color: green, fontSize: '0.82rem', marginBottom: '1.25rem' }}>{msg}</div>}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.25rem' }}>
                <div style={{ background: dark2, border: `1px solid ${border}`, borderRadius: 4 }}>
                  <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${border}` }}><span style={{ fontWeight: 700 }}>Asset Details</span></div>
                  <div style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div style={fg}><label style={lbl}>Asset Name</label><input style={inp} placeholder="e.g. Vilnius Office Block A" onChange={e => setForm(f => ({...f, asset_name: e.target.value}))} /></div>
                      <div style={fg}><label style={lbl}>Asset Type</label><select style={{...inp,appearance:'none'}}><option>Commercial Real Estate</option><option>Residential Real Estate</option><option>Private Equity</option><option>Infrastructure</option><option>Commodity</option><option>Other</option></select></div>
                      <div style={fg}><label style={lbl}>Total Value (€)</label><input style={inp} type="number" placeholder="1,000,000" /></div>
                      <div style={fg}><label style={lbl}>Token Supply</label><input style={inp} type="number" placeholder="10,000" /></div>
                      <div style={fg}><label style={lbl}>Token Price (€)</label><input style={inp} type="number" placeholder="100" /></div>
                      <div style={fg}><label style={lbl}>Expected Return (%)</label><input style={inp} type="number" placeholder="8.5" /></div>
                    </div>
                    <div style={fg}><label style={lbl}>Asset Description</label><textarea style={{...inp, height: 100, resize: 'vertical'}} placeholder="Describe the asset, its location, and revenue potential..." /></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div style={fg}><label style={lbl}>Valuation Report</label><input style={inp} type="file" /></div>
                      <div style={fg}><label style={lbl}>Ownership Proof</label><input style={inp} type="file" /></div>
                    </div>
                    <button onClick={() => submitForm('tokenize')} style={{ padding: '0.75rem 2rem', background: gold, color: 'black', border: 'none', borderRadius: 4, fontSize: '0.88rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>Submit for Review</button>
                  </div>
                </div>
                <div style={{ background: dark2, border: `1px solid ${border}`, borderRadius: 4, padding: '1.25rem', height: 'fit-content' }}>
                  <div style={{ fontWeight: 700, marginBottom: '1rem' }}>Why Tokenize on Nextoken?</div>
                  {['Reach investors across 190+ countries','Automated dividend payments on-chain','24/7 secondary market liquidity','MiCA & MiFID II compliant','Issuance fee from 1% only'].map(t => (
                    <div key={t} style={{ display: 'flex', gap: 7, alignItems: 'flex-start', fontSize: '0.78rem', color: muted, marginBottom: '0.5rem' }}>
                      <span style={{ color: green, flexShrink: 0 }}>✓</span>{t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {panel === 'issue-bond' && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}><div style={{ fontSize: '1.3rem', fontWeight: 900 }}>Issue a Bond</div><div style={{ fontSize: '0.78rem', color: muted }}>Structure and launch your tokenized bond offering</div></div>
              {msg && <div style={{ padding: '0.75rem 1rem', background: 'rgba(14,203,129,0.1)', border: `1px solid rgba(14,203,129,0.2)`, borderRadius: 4, color: green, fontSize: '0.82rem', marginBottom: '1.25rem' }}>{msg}</div>}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div style={{ background: dark2, border: `1px solid ${border}`, borderRadius: 4 }}>
                  <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${border}` }}><span style={{ fontWeight: 700 }}>Bond Structure</span></div>
                  <div style={{ padding: '1.25rem' }}>
                    <div style={fg}><label style={lbl}>Bond Name</label><input style={inp} placeholder="e.g. Baltic Green Bond 2028" onChange={e => setForm(f => ({...f, bond_name: e.target.value}))} /></div>
                    <div style={fg}><label style={lbl}>Bond Type</label><select style={{...inp,appearance:'none'}}><option>Corporate Bond</option><option>Green Bond</option><option>Infrastructure Bond</option><option>Convertible Note</option></select></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div style={fg}><label style={lbl}>Total Issuance (€)</label><input style={inp} type="number" placeholder="5,000,000" /></div>
                      <div style={fg}><label style={lbl}>Coupon Rate (%)</label><input style={inp} type="number" placeholder="6.5" /></div>
                      <div style={fg}><label style={lbl}>Term (Years)</label><input style={inp} type="number" placeholder="3" /></div>
                      <div style={fg}><label style={lbl}>Coupon Frequency</label><select style={{...inp,appearance:'none'}}><option>Annual</option><option>Semi-Annual</option><option>Quarterly</option><option>Monthly</option></select></div>
                    </div>
                    <button onClick={() => submitForm('bond')} style={{ padding: '0.75rem 2rem', background: gold, color: 'black', border: 'none', borderRadius: 4, fontSize: '0.88rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>Submit for Review</button>
                  </div>
                </div>
                <div style={{ background: dark2, border: `1px solid ${border}`, borderRadius: 4 }}>
                  <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${border}` }}><span style={{ fontWeight: 700 }}>Issuer & Documents</span></div>
                  <div style={{ padding: '1.25rem' }}>
                    <div style={fg}><label style={lbl}>Company Name</label><input style={inp} placeholder="e.g. Baltic Energy UAB" /></div>
                    <div style={fg}><label style={lbl}>Registration Number</label><input style={inp} placeholder="e.g. 302845621" /></div>
                    <div style={fg}><label style={lbl}>Use of Proceeds</label><textarea style={{...inp,height:80,resize:'vertical'}} placeholder="How will you use the capital raised?" /></div>
                    <div style={fg}><label style={lbl}>Prospectus / Offering Memorandum</label><input style={inp} type="file" /></div>
                    <div style={fg}><label style={lbl}>Audited Financial Statements</label><input style={inp} type="file" /></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {panel === 'ipo' && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}><div style={{ fontSize: '1.3rem', fontWeight: 900 }}>Launch IPO / Equity</div><div style={{ fontSize: '0.78rem', color: muted }}>Take your company public on Nextoken Capital</div></div>
              {msg && <div style={{ padding: '0.75rem 1rem', background: 'rgba(14,203,129,0.1)', border: `1px solid rgba(14,203,129,0.2)`, borderRadius: 4, color: green, fontSize: '0.82rem', marginBottom: '1.25rem' }}>{msg}</div>}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div style={{ background: dark2, border: `1px solid ${border}`, borderRadius: 4 }}>
                  <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${border}` }}><span style={{ fontWeight: 700 }}>Company Details</span></div>
                  <div style={{ padding: '1.25rem' }}>
                    <div style={fg}><label style={lbl}>Company Name</label><input style={inp} placeholder="e.g. Vilnius FinTech UAB" /></div>
                    <div style={fg}><label style={lbl}>Sector</label><select style={{...inp,appearance:'none'}}><option>FinTech</option><option>PropTech</option><option>CleanTech</option><option>Healthcare</option><option>SaaS</option><option>Other</option></select></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div style={fg}><label style={lbl}>Pre-Money Valuation (€)</label><input style={inp} type="number" placeholder="10,000,000" /></div>
                      <div style={fg}><label style={lbl}>Equity Offered (%)</label><input style={inp} type="number" placeholder="15" /></div>
                    </div>
                    <div style={fg}><label style={lbl}>Raise Target (€)</label><input style={inp} type="number" placeholder="1,500,000" /></div>
                    <div style={fg}><label style={lbl}>Company Description</label><textarea style={{...inp,height:100,resize:'vertical'}} placeholder="Describe your business, traction, and growth story..." /></div>
                    <button onClick={() => submitForm('ipo')} style={{ padding: '0.75rem 2rem', background: gold, color: 'black', border: 'none', borderRadius: 4, fontSize: '0.88rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>Submit IPO Application</button>
                  </div>
                </div>
                <div style={{ background: dark2, border: `1px solid ${border}`, borderRadius: 4 }}>
                  <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${border}` }}><span style={{ fontWeight: 700 }}>Token Structure & Docs</span></div>
                  <div style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div style={fg}><label style={lbl}>Token Supply</label><input style={inp} type="number" placeholder="1,000,000" /></div>
                      <div style={fg}><label style={lbl}>Token Price (€)</label><input style={inp} type="number" placeholder="1.50" /></div>
                    </div>
                    <div style={fg}><label style={lbl}>Token Rights</label><select style={{...inp,appearance:'none'}}><option>Equity + Voting Rights</option><option>Equity Only</option><option>Revenue Share</option><option>Profit Participation</option></select></div>
                    <div style={fg}><label style={lbl}>Business Plan / Deck</label><input style={inp} type="file" /></div>
                    <div style={fg}><label style={lbl}>Financial Projections</label><input style={inp} type="file" /></div>
                    <div style={fg}><label style={lbl}>Articles of Association</label><input style={inp} type="file" /></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {panel === 'kyc' && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}><div style={{ fontSize: '1.3rem', fontWeight: 900 }}>KYC Verification</div><div style={{ fontSize: '0.78rem', color: muted }}>Verify your identity to unlock full platform access</div></div>
              <div style={{ padding: '0.85rem 1rem', background: 'rgba(240,185,11,0.08)', border: `1px solid rgba(240,185,11,0.15)`, borderRadius: 4, color: gold, fontSize: '0.82rem', marginBottom: '1.5rem' }}>⚠ KYC verification is required to trade, invest, and issue assets on Nextoken Capital.</div>
              {msg && <div style={{ padding: '0.75rem 1rem', background: 'rgba(14,203,129,0.1)', border: `1px solid rgba(14,203,129,0.2)`, borderRadius: 4, color: green, fontSize: '0.82rem', marginBottom: '1.25rem' }}>{msg}</div>}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div style={{ background: dark2, border: `1px solid ${border}`, borderRadius: 4 }}>
                  <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${border}` }}><span style={{ fontWeight: 700 }}>Identity Verification</span></div>
                  <div style={{ padding: '1.25rem' }}>
                    <div style={fg}><label style={lbl}>Full Legal Name</label><input style={inp} placeholder="As it appears on your ID" /></div>
                    <div style={fg}><label style={lbl}>Date of Birth</label><input style={inp} type="date" /></div>
                    <div style={fg}><label style={lbl}>Nationality</label><select style={{...inp,appearance:'none'}}><option>Lithuanian</option><option>Estonian</option><option>German</option><option>British</option><option>Other EU</option><option>Non-EU</option></select></div>
                    <div style={fg}><label style={lbl}>Tax ID Number</label><input style={inp} placeholder="Your national TIN" /></div>
                    <div style={fg}><label style={lbl}>Investor Type</label><select style={{...inp,appearance:'none'}}><option>Retail Investor</option><option>Accredited Investor</option><option>Institutional Investor</option></select></div>
                    <div style={fg}><label style={lbl}>Source of Funds</label><select style={{...inp,appearance:'none'}}><option>Employment / Salary</option><option>Business Income</option><option>Investment Returns</option><option>Inheritance</option><option>Other</option></select></div>
                  </div>
                </div>
                <div style={{ background: dark2, border: `1px solid ${border}`, borderRadius: 4 }}>
                  <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${border}` }}><span style={{ fontWeight: 700 }}>Document Upload</span></div>
                  <div style={{ padding: '1.25rem' }}>
                    <div style={fg}><label style={lbl}>Government ID (Passport or National ID)</label><input style={inp} type="file" /></div>
                    <div style={fg}><label style={lbl}>Proof of Address</label><input style={inp} type="file" /></div>
                    <div style={fg}><label style={lbl}>Selfie Holding ID</label><input style={inp} type="file" /></div>
                    <div style={{ padding: '0.75rem', background: 'rgba(14,203,129,0.06)', border: `1px solid rgba(14,203,129,0.15)`, borderRadius: 4, fontSize: '0.72rem', color: green, marginBottom: '1rem', lineHeight: 1.6 }}>
                      Your documents are encrypted and stored securely. We comply with GDPR and EU AML Directive 6.
                    </div>
                    <button onClick={() => submitForm('kyc')} style={{ padding: '0.75rem 2rem', background: gold, color: 'black', border: 'none', borderRadius: 4, fontSize: '0.88rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>Submit KYC Documents</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {panel === 'settings' && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}><div style={{ fontSize: '1.3rem', fontWeight: 900 }}>Account Settings</div><div style={{ fontSize: '0.78rem', color: muted }}>Manage your account preferences</div></div>
              {msg && <div style={{ padding: '0.75rem 1rem', background: 'rgba(14,203,129,0.1)', border: `1px solid rgba(14,203,129,0.2)`, borderRadius: 4, color: green, fontSize: '0.82rem', marginBottom: '1.25rem' }}>{msg}</div>}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div style={{ background: dark2, border: `1px solid ${border}`, borderRadius: 4 }}>
                  <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${border}` }}><span style={{ fontWeight: 700 }}>Profile</span></div>
                  <div style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div style={fg}><label style={lbl}>First Name</label><input style={inp} defaultValue={user?.first_name} /></div>
                      <div style={fg}><label style={lbl}>Last Name</label><input style={inp} defaultValue={user?.last_name} /></div>
                    </div>
                    <div style={fg}><label style={lbl}>Email</label><input style={inp} type="email" defaultValue={user?.email} /></div>
                    <div style={fg}><label style={lbl}>Company (Optional)</label><input style={inp} placeholder="Your company name" /></div>
                    <button onClick={() => submitForm('settings')} style={{ padding: '0.65rem 1.75rem', background: gold, color: 'black', border: 'none', borderRadius: 4, fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>Save Changes</button>
                  </div>
                </div>
                <div style={{ background: dark2, border: `1px solid ${border}`, borderRadius: 4 }}>
                  <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${border}` }}><span style={{ fontWeight: 700 }}>Security</span></div>
                  <div style={{ padding: '1.25rem' }}>
                    <div style={fg}><label style={lbl}>Current Password</label><input style={inp} type="password" placeholder="••••••••" /></div>
                    <div style={fg}><label style={lbl}>New Password</label><input style={inp} type="password" placeholder="••••••••" /></div>
                    <div style={fg}><label style={lbl}>Confirm New Password</label><input style={inp} type="password" placeholder="••••••••" /></div>
                    <button style={{ padding: '0.65rem 1.75rem', background: dark4, color: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: 4, fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>Update Password</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

