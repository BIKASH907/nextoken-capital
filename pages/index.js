import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  const navLinkStyle = { color: '#9ca3af', textDecoration: 'none', fontSize: '14px', fontWeight: '500' };

  return (
    <div style={{ backgroundColor: '#050816', color: '#ffffff', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Head>
        <title>Nextoken Capital | The Global Platform for Tokenized Capital Markets</title>
      </Head>

      {/* --- NAVIGATION BAR --- */}
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

      {/* --- PROJECT HIGHLIGHTS --- */}
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
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
           <p style={{ color: '#404654', fontSize: '12px' }}>© 2026 Nextoken Capital UAB. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}