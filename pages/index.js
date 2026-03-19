import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  const navLinkStyle = { color: '#9ca3af', textDecoration: 'none', fontSize: '14px', fontWeight: '500' };
  const footerTitleStyle = { color: '#fff', fontSize: '13px', fontWeight: '800', letterSpacing: '1.2px', marginBottom: '24px', textTransform: 'uppercase' };
  const footerLinkStyle = { color: '#6e7686', textDecoration: 'none', fontSize: '14px', display: 'block', marginBottom: '14px' };

  return (
    <div style={{ backgroundColor: '#050816', color: '#ffffff', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Head>
        <title>Nextoken Capital | The Global Platform for Tokenized Capital Markets</title>
      </Head>

      {/* --- SINGLE NAVIGATION BAR (FIXED DOUBLE HEADER) --- */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 40px', maxWidth: '1400px', margin: '0 auto', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: '#f5c15a', fontSize: '26px', fontWeight: '900', letterSpacing: '-1px' }}>NXT</span>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1' }}>
            <span style={{ fontWeight: '800', fontSize: '14px', letterSpacing: '1.5px' }}>NEXTOKEN</span>
            <span style={{ fontSize: '10px', color: '#6e7686', letterSpacing: '1.5px', marginTop: '2px' }}>CAPITAL</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {['Markets', 'Exchange', 'Bonds', 'Equity & IPO', 'Tokenize'].map((item) => (
            <Link key={item} href={`/${item.toLowerCase().replace(/ & /g, '-')}`} style={navLinkStyle}>{item}</Link>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>Log In</button>
          <button style={{ background: '#f5c15a', color: '#000', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>Register</button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section style={{ padding: '100px 40px', textAlign: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Compliance Badge */}
        <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '100px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '40px' }}>
          <span style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1px', color: '#9ca3af' }}>
            ● MICA LICENSED • EU REGULATED • DLT PILOT REGIME
          </span>
        </div>

        <h1 style={{ fontSize: 'clamp(40px, 8vw, 72px)', fontWeight: '800', marginBottom: '24px', lineHeight: '1.1' }}>
          The Global Platform <br /> 
          <span style={{ color: '#f5c15a' }}>for Tokenized Capital Markets</span>
        </h1>
        
        <p style={{ fontSize: '20px', color: '#9ca3af', marginBottom: '48px', maxWidth: '800px', margin: '0 auto 48px' }}>
          Access institutional-grade private equity, venture capital, and tokenized bonds on a fully regulated European infrastructure.
        </p>

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <button style={{ background: '#f5c15a', color: '#000', padding: '18px 40px', borderRadius: '10px', fontSize: '16px', fontWeight: '800', border: 'none', cursor: 'pointer' }}>
            Start Investing
          </button>
          <button style={{ background: 'transparent', color: '#fff', padding: '18px 40px', borderRadius: '10px', fontSize: '16px', fontWeight: '700', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}>
            Tokenize Assets
          </button>
        </div>
      </section>

      {/* --- PROJECT HIGHLIGHTS (RWA DATA) --- */}
      <section style={{ padding: '80px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '30px', borderRadius: '16px' }}>
            <span style={{ color: '#f5c15a', fontSize: '12px', fontWeight: '800' }}>TOKENIZED BOND</span>
            <h3 style={{ margin: '15px 0 10px', fontSize: '20px' }}>Real Estate Debt Fund</h3>
            <p style={{ color: '#6e7686', fontSize: '14px' }}>Secured by prime commercial assets in Vilnius and Berlin.</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '30px', borderRadius: '16px' }}>
            <span style={{ color: '#f5c15a', fontSize: '12px', fontWeight: '800' }}>PRIVATE EQUITY</span>
            <h3 style={{ margin: '15px 0 10px', fontSize: '20px' }}>Fintech Scale-up Series B</h3>
            <p style={{ color: '#6e7686', fontSize: '14px' }}>Direct equity tokens in leading EU digital banking infrastructure.</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '30px', borderRadius: '16px' }}>
            <span style={{ color: '#f5c15a', fontSize: '12px', fontWeight: '800' }}>VENTURE CAPITAL</span>
            <h3 style={{ margin: '15px 0 10px', fontSize: '20px' }}>Sustainability Fund I</h3>
            <p style={{ color: '#6e7686', fontSize: '14px' }}>Fractional access to top-tier green energy venture portfolios.</p>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer style={{ backgroundColor: '#05060a', padding: '80px 40px 40px', borderTop: '1px solid #141721', marginTop: '100px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1fr', gap: '40px', marginBottom: '80px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <span style={{ color: '#f5c15a', fontSize: '24px', fontWeight: '900' }}>NXT</span>
                <span style={{ fontWeight: '800', fontSize: '13px', letterSpacing: '1.5px' }}>NEXTOKEN CAPITAL</span>
              </div>
              <p style={{ color: '#6e7686', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
                The regulated infrastructure for <br /> tokenized real-world assets.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid #1a1d26', padding: '12px 16px', borderRadius: '10px', width: 'fit-content' }}>
                <span style={{ color: '#fff', fontWeight: '700', fontSize: '12px' }}>LT</span>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '9px', color: '#6e7686' }}>MONITORED BY</span>
                  <span style={{ fontSize: '13px', color: '#fff', fontWeight: '600' }}>Bank of Lithuania</span>
                </div>
              </div>
            </div>
            {/* ... Other Footer Columns ... */}
          </div>
          <div style={{ borderTop: '1px solid #141721', paddingTop: '30px', color: '#404654', fontSize: '12px' }}>
            <p>© 2026 Nextoken Capital UAB. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ backgroundColor: '#050816', color: '#ffffff', minHeight: '100vh' }}>
      <Head>
        <title>Nextoken Capital | The Global Platform</title>
      </Head>

      {/* --- ONLY ONE NAV TAG HERE --- */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 40px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: '#f5c15a', fontSize: '26px', fontWeight: '900' }}>NXT</span>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1' }}>
            <span style={{ fontWeight: '800', fontSize: '14px', letterSpacing: '1.5px' }}>NEXTOKEN</span>
            <span style={{ fontSize: '10px', color: '#6e7686', letterSpacing: '1.5px' }}>CAPITAL</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '32px' }}>
          {['Markets', 'Exchange', 'Bonds', 'Equity & IPO', 'Tokenize'].map(item => (
            <Link key={item} href="/" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>{item}</Link>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ background: 'transparent', color: '#fff', border: '1px solid #333', padding: '10px 20px', borderRadius: '8px' }}>Log In</button>
          <button style={{ background: '#f5c15a', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '700' }}>Register</button>
        </div>
      </nav>

      {/* Hero Content Starts Here */}
      <main style={{ textAlign: 'center', padding: '100px 20px' }}>
         <h1 style={{ fontSize: '64px', fontWeight: '800' }}>The Global Platform</h1>
      </main>
    </div>
  );
}