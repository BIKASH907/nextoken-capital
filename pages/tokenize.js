import { useState } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import AuthModal from '../components/AuthModal'

export default function Tokenize() {
  const router = useRouter()
  const [modal, setModal] = useState(null)
  const [msg, setMsg] = useState('')
  const gold='#F0B90B',dark='#0B0E11',dark2='#161A1E',dark3='#1E2329',green='#0ECB81',border='rgba(255,255,255,0.06)',muted='rgba(255,255,255,0.4)'
  const inp = { width:'100%',padding:'0.65rem 0.9rem',background:dark3,border:`1px solid ${border}`,borderRadius:4,color:'#fff',fontSize:'0.85rem',fontFamily:'Inter,sans-serif',outline:'none',boxSizing:'border-box',marginTop:2 }
  const lbl = { display:'block',fontSize:'0.68rem',fontWeight:700,letterSpacing:'0.5px',textTransform:'uppercase',color:muted,marginBottom:2 }
  const fg = { marginBottom:'1rem' }

  return (
    <div style={{ background: dark, minHeight: '100vh', color: 'rgba(255,255,255,0.85)', fontFamily: 'Inter,sans-serif' }}>
      <Navbar onLogin={() => setModal('login')} onRegister={() => setModal('register')} />
      {modal && <AuthModal mode={modal} onClose={() => setModal(null)} onSwitch={m => setModal(m)} />}
      <div style={{ paddingTop: 60 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 5%' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: gold, marginBottom: '0.4rem' }}>Tokenize</div>
            <div style={{ fontSize: 'clamp(1.4rem,2.5vw,2rem)', fontWeight: 900, letterSpacing: '-1px' }}>Tokenize an Asset</div>
            <div style={{ fontSize: '0.85rem', color: muted, marginTop: '0.4rem' }}>Convert your real-world asset into a regulated digital token in under 48 hours</div>
          </div>
          {msg && <div style={{ padding: '0.75rem 1rem', background: 'rgba(14,203,129,0.1)', border: `1px solid rgba(14,203,129,0.2)`, borderRadius: 4, color: green, fontSize: '0.82rem', marginBottom: '1.25rem' }}>{msg}</div>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.25rem' }}>
            <div>
              <div style={{ background: dark2, border: `1px solid ${border}`, borderRadius: 4, marginBottom: '1.25rem' }}>
                <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${border}` }}><span style={{ fontWeight: 700 }}>Asset Details</span></div>
                <div style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div style={fg}><label style={lbl}>Asset Name</label><input style={inp} placeholder="e.g. Vilnius Office Block A" /></div>
                    <div style={fg}><label style={lbl}>Asset Type</label><select style={{...inp,appearance:'none'}}><option>Commercial Real Estate</option><option>Residential Real Estate</option><option>Private Equity</option><option>Infrastructure</option><option>Commodity</option><option>Other</option></select></div>
                    <div style={fg}><label style={lbl}>Total Value (€)</label><input style={inp} type="number" placeholder="1,000,000" /></div>
                    <div style={fg}><label style={lbl}>Token Supply</label><input style={inp} type="number" placeholder="10,000" /></div>
                    <div style={fg}><label style={lbl}>Token Price (€)</label><input style={inp} type="number" placeholder="100" /></div>
                    <div style={fg}><label style={lbl}>Expected Return (%)</label><input style={inp} type="number" placeholder="8.5" /></div>
                    <div style={fg}><label style={lbl}>Min. Investment (€)</label><input style={inp} type="number" placeholder="500" /></div>
                    <div style={fg}><label style={lbl}>Fundraising Deadline</label><input style={inp} type="date" /></div>
                  </div>
                  <div style={fg}><label style={lbl}>Asset Description</label><textarea style={{...inp,height:100,resize:'vertical'}} placeholder="Describe the asset, location, revenue model, and why investors should be interested..." /></div>
                </div>
              </div>
              <div style={{ background: dark2, border: `1px solid ${border}`, borderRadius: 4 }}>
                <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${border}` }}><span style={{ fontWeight: 700 }}>Required Documents</span></div>
                <div style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div style={fg}><label style={lbl}>Asset Valuation Report</label><input style={inp} type="file" /></div>
                    <div style={fg}><label style={lbl}>Legal Ownership Proof</label><input style={inp} type="file" /></div>
                    <div style={fg}><label style={lbl}>Financial Statements</label><input style={inp} type="file" /></div>
                    <div style={fg}><label style={lbl}>Insurance Documents</label><input style={inp} type="file" /></div>
                  </div>
                  <button onClick={() => { setMsg('Asset submitted for review. Our compliance team will contact you within 24 hours.') }} style={{ padding: '0.75rem 2rem', background: gold, color: 'black', border: 'none', borderRadius: 4, fontSize: '0.88rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>Submit for Review</button>
                </div>
              </div>
            </div>
            <div>
              <div style={{ background: dark2, border: `1px solid ${border}`, borderRadius: 4, marginBottom: '1rem' }}>
                <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${border}` }}><span style={{ fontWeight: 700 }}>Token Structure</span></div>
                <div style={{ padding: '1.25rem' }}>
                  <div style={fg}><label style={lbl}>Token Standard</label><select style={{...inp,appearance:'none'}}><option>ERC-3643 (Security Token)</option><option>ERC-1400</option></select></div>
                  <div style={fg}><label style={lbl}>Investor Eligibility</label><select style={{...inp,appearance:'none'}}><option>All EU Verified Investors</option><option>Accredited Investors Only</option><option>Institutional Only</option></select></div>
                </div>
              </div>
              <div style={{ background: dark2, border: `1px solid ${border}`, borderRadius: 4, padding: '1.25rem' }}>
                <div style={{ fontWeight: 700, marginBottom: '1rem' }}>Why Tokenize on Nextoken?</div>
                {['Reach investors across 190+ countries','Automated dividend payments on-chain','24/7 secondary market liquidity','MiCA & MiFID II compliant','Issuance fee from 1% only','Smart contract audit included'].map(t => (
                  <div key={t} style={{ display: 'flex', gap: 7, fontSize: '0.78rem', color: muted, marginBottom: '0.5rem' }}>
                    <span style={{ color: green, flexShrink: 0 }}>✓</span>{t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
