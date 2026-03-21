import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/AuthContext';
import Navbar from '../components/Navbar';
import AuthModal from '../components/AuthModal';

export default function Dashboard() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [modal, setModal] = useState(null);
  const [panel, setPanel] = useState('overview');
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({});

  // Brand Colors
  const gold = '#F0B90B', dark = '#05060a', dark2 = '#111111', dark3 = '#1a1a1a', dark4 = '#252930';
  const green = '#0ECB81', red = '#F6465D', border = 'rgba(255,255,255,0.08)', muted = 'rgba(255,255,255,0.4)';

  // Secure Redirect: If not loading and no user exists, send to login
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const inp = { width: '100%', padding: '0.75rem 1rem', background: dark3, border: `1px solid ${border}`, borderRadius: 12, color: '#fff', fontSize: '0.9rem', outline: 'none', marginTop: 8 };
  const lbl = { display: 'block', fontSize: '0.75rem', fontWeight: 600, color: muted, textTransform: 'uppercase' };
  const fg = { marginBottom: '1.25rem' };

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
    { id: 'logout', label: 'Logout', icon: ' logout', action: 'logout' },
  ];

  async function submitForm(type) {
    setMsg('');
    const msgs = {
      tokenize: `Asset "${form.asset_name || 'Asset'}" submitted. Our compliance team will review.`,
      bond: `Bond issuance for "${form.bond_name}" initiated.`,
      ipo: 'IPO request received.',
      kyc: 'KYC documents received. Status: Pending.',
      settings: 'Profile updated successfully.'
    };
    setMsg(msgs[type] || 'Submitted successfully.');
  }

  const SbItem = ({ item }) => {
    if (item.sep) return <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'rgba(255,255,255,0.2)', padding: '1.2rem 1rem 0.5rem', letterSpacing: '1px' }}>{item.label}</div>;
    const active = panel === item.id;
    
    const handleClick = () => {
      if (item.action === 'logout') {
        logout();
      } else if (item.link) {
        router.push(item.link);
      } else {
        setPanel(item.id);
      }
    };

    return (
      <div onClick={handleClick}
        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.75rem 1rem', borderRadius: 12, fontSize: '0.9rem', fontWeight: active ? 700 : 500, color: active ? gold : '#fff', background: active ? 'rgba(240,185,11,0.1)' : 'transparent', cursor: 'pointer', transition: '0.2s' }}
      >
        <span style={{ opacity: active ? 1 : 0.6 }}>{item.icon}</span>
        <span style={{ flex: 1 }}>{item.label}</span>
        {item.badge && <span style={{ padding: '2px 8px', background: gold, borderRadius: 20, fontSize: '0.65rem', color: '#000', fontWeight: 800 }}>{item.badge}</span>}
      </div>
    );
  };

  if (loading) return <div style={{ background: dark, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: gold }}>Loading Nextoken Dashboard...</div>;

  return (
    <div style={{ background: dark, minHeight: '100vh', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
      <Navbar />
      
      <div style={{ display: 'flex', paddingTop: '70px' }}>
        {/* Sidebar */}
        <aside style={{ width: 260, background: dark2, borderRight: `1px solid ${border}`, padding: '1.5rem 0.75rem', height: 'calc(100vh - 70px)', position: 'sticky', top: 70 }}>
          {navItems.map(item => <SbItem key={item.id} item={item} />)}
        </aside>

        {/* Content Area */}
        <main style={{ flex: 1, padding: '2.5rem' }}>
          {panel === 'overview' && (
            <div>
              <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                <div>
                  <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800 }}>Welcome, {user?.name || 'Investor'}</h1>
                  <p style={{ color: muted, marginTop: 4 }}>Institutional Asset Management Dashboard</p>
                </div>
                <button onClick={() => setPanel('tokenize')} style={{ background: gold, border: 'none', padding: '12px 24px', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}>+ New Issuance</button>
              </header>

              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {[['Total Balance', '€0.00'], ['Investments', '0'], ['Tokenized Assets', '0'], ['KYC Status', user?.kycStatus || 'Pending']].map(([label, val]) => (
                  <div key={label} style={{ background: dark2, padding: '1.5rem', borderRadius: 20, border: `1px solid ${border}` }}>
                    <div style={{ fontSize: '0.8rem', color: muted, marginBottom: 8 }}>{label}</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{val}</div>
                  </div>
                ))}
              </div>

              {/* Market Table */}
              <div style={{ background: dark2, borderRadius: 24, border: `1px solid ${border}`, overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: `1px solid ${border}`, fontWeight: 700 }}>Live Markets</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: dark3 }}>
                    <tr>
                      {['Asset', 'Price', '24h Change', 'Volume'].map(h => <th key={h} style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.75rem', color: muted }}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {[['NXT / EUR', '€1.25', '+2.4%', green], ['EURO BOND', '€100.2', '+0.1%', green], ['RE TOKEN', '€245.0', '-0.5%', red]].map(([n, p, c, clr]) => (
                      <tr key={n} style={{ borderBottom: `1px solid ${border}` }}>
                        <td style={{ padding: '1.25rem 1.5rem', fontWeight: 600 }}>{n}</td>
                        <td style={{ padding: '1.25rem 1.5rem' }}>{p}</td>
                        <td style={{ padding: '1.25rem 1.5rem', color: clr, fontWeight: 700 }}>{c}</td>
                        <td style={{ padding: '1.25rem 1.5rem', color: muted }}>€1.2M</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tokenize Asset Panel */}
          {panel === 'tokenize' && (
            <div style={{ maxWidth: '800px' }}>
              <h2 style={{ fontSize: '24px', marginBottom: 8 }}>Tokenize Asset</h2>
              <p style={{ color: muted, marginBottom: 32 }}>Submit property, equity, or commodities for tokenization.</p>
              
              {msg && <div style={{ background: 'rgba(14,203,129,0.1)', color: green, padding: '1rem', borderRadius: 12, marginBottom: 20 }}>{msg}</div>}

              <div style={{ background: dark2, padding: '2rem', borderRadius: 24, border: `1px solid ${border}` }}>
                <div style={fg}><label style={lbl}>Asset Name</label><input style={inp} name="asset_name" onChange={handleInputChange} placeholder="e.g. Vilnius Commercial Plaza" /></div>
                <div style={fg}><label style={lbl}>Total Valuation (€)</label><input style={inp} name="total_value" type="number" placeholder="5,000,000" /></div>
                <button onClick={() => submitForm('tokenize')} style={{ background: gold, border: 'none', width: '100%', padding: '16px', borderRadius: 12, fontWeight: 700, marginTop: 20, cursor: 'pointer' }}>Submit Issuance Request</button>
              </div>
            </div>
          )}

          {/* Fallback for other panels */}
          {!['overview', 'tokenize'].includes(panel) && (
            <div style={{ textAlign: 'center', marginTop: '100px' }}>
              <h3 style={{ fontSize: '20px' }}>{panel.toUpperCase()}</h3>
              <p style={{ color: muted }}>This module is being integrated into the Nextoken mainnet.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}