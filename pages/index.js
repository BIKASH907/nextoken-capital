import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  // Shared Styles to ensure consistency
  const navLinkStyle = { color: '#9ca3af', textDecoration: 'none', fontSize: '14px', fontWeight: '500' };
  const footerTitleStyle = { color: '#fff', fontSize: '13px', fontWeight: '800', letterSpacing: '1.2px', marginBottom: '24px', textTransform: 'uppercase' };
  const footerLinkStyle = { color: '#6e7686', textDecoration: 'none', fontSize: '14px', display: 'block', marginBottom: '14px' };

  return (
    <div style={{ backgroundColor: '#050816', color: '#ffffff', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Head>
        <title>Nextoken Capital | Ready to tokenize the world?</title>
        <meta name="description" content="The regulated infrastructure for tokenized real-world assets." />
      </Head>

      {/* --- HEADER / NAVIGATION --- */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 40px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: '#f5c15a', fontSize: '26px', fontWeight: '900', letterSpacing: '-1px' }}>NXT</span>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1' }}>
            <span style={{ fontWeight: '800', fontSize: '14px', letterSpacing: '1.5px' }}>NEXTOKEN</span>
            <span style={{ fontSize: '10px', color: '#6e7686', letterSpacing: '1.5px', marginTop: '2px' }}>CAPITAL</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <Link href="/markets" style={navLinkStyle}>Markets</Link>
          <Link href="/exchange" style={navLinkStyle}>Exchange</Link>
          <Link href="/bonds" style={navLinkStyle}>Bonds</Link>
          <Link href="/equity-ipo" style={navLinkStyle}>Equity & IPO</Link>
          <Link href="/tokenize" style={navLinkStyle}>Tokenize</Link>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>Log In</button>
          <button style={{ background: '#f5c15a', color: '#000', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>Register</button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section style={{ padding: '140px 40px 100px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ maxWidth: '800px' }}>
          <h1 style={{ fontSize: 'clamp(48px, 7vw, 76px)', fontWeight: '800', marginBottom: '24px', lineHeight: '1.05', letterSpacing: '-2px' }}>
            Ready to tokenize <br /> the world?
          </h1>
          <p style={{ fontSize: '22px', color: '#9ca3af', marginBottom: '48px', fontWeight: '400' }}>
            Join 12,400+ investors and issuers on the platform.
          </p>
          
          <button style={{ 
            background: '#f5c15a', 
            color: '#000', 
            padding: '22px 48px', 
            borderRadius: '12px', 
            fontSize: '20px', 
            fontWeight: '800', 
            border: 'none',
            boxShadow: '0 10px 40px rgba(245, 193, 90, 0.25)',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}>
            Create Free Account
          </button>
        </div>
      </section>

      {/* --- FOOTER (Exact match to screenshot) --- */}
      <footer style={{ backgroundColor: '#05060a', padding: '80px 40px 40px', borderTop: '1px solid #141721', marginTop: '100px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1fr', gap: '40px', marginBottom: '80px' }}>
            
            {/* Column 1: Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <span style={{ color: '#f5c15a', fontSize: '24px', fontWeight: '900' }}>NXT</span>
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1' }}>
                  <span style={{ fontWeight: '800', fontSize: '13px', letterSpacing: '1.5px' }}>NEXTOKEN</span>
                  <span style={{ fontSize: '9px', color: '#6e7686', letterSpacing: '1.5px', marginTop: '2px' }}>CAPITAL</span>
                </div>
              </div>
              <p style={{ color: '#6e7686', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
                The regulated infrastructure for <br /> tokenized real-world assets.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid #1a1d26', padding: '12px 16px', borderRadius: '10px', width: 'fit-content' }}>
                <span style={{ color: '#fff', fontWeight: '700', fontSize: '12px' }}>LT</span>
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                  <span style={{ fontSize: '9px', color: '#6e7686', fontWeight: '600' }}>MONITORED BY</span>
                  <span style={{ fontSize: '13px', color: '#fff', fontWeight: '600' }}>Bank of Lithuania</span>
                </div>
              </div>
            </div>

            {/* Column 2: Products */}
            <div>
              <h4 style={footerTitleStyle}>Products</h4>
              <Link href="/markets" style={footerLinkStyle}>Markets</Link>
              <Link href="/exchange" style={footerLinkStyle}>Exchange</Link>
              <Link href="/bonds" style={footerLinkStyle}>Bonds</Link>
              <Link href="/equity-ipo" style={footerLinkStyle}>Equity & IPO</Link>
              <Link href="/tokenize" style={footerLinkStyle}>Tokenize</Link>
            </div>

            {/* Column 3: Company */}
            <div>
              <h4 style={footerTitleStyle}>Company</h4>
              <Link href="/about" style={footerLinkStyle}>About Us</Link>
              <Link href="/careers" style={footerLinkStyle}>Careers</Link>
              <Link href="/press" style={footerLinkStyle}>Press</Link>
              <Link href="/blog" style={footerLinkStyle}>Blog</Link>
            </div>

            {/* Column 4: Legal */}
            <div>
              <h4 style={footerTitleStyle}>Legal</h4>
              <Link href="/terms" style={footerLinkStyle}>Terms of Service</Link>
              <Link href="/privacy" style={footerLinkStyle}>Privacy Policy</Link>
              <Link href="/risk" style={footerLinkStyle}>Risk Disclosure</Link>
              <Link href="/aml" style={footerLinkStyle}>AML Policy</Link>
            </div>

            {/* Column 5: Support */}
            <div>
              <h4 style={footerTitleStyle}>Support</h4>
              <Link href="/help" style={footerLinkStyle}>Help Center</Link>
              <Link href="/contact" style={footerLinkStyle}>Contact Us</Link>
              <Link href="/api" style={footerLinkStyle}>API Docs</Link>
              <Link href="/status" style={footerLinkStyle}>Status</Link>
            </div>
          </div>

          {/* Bottom Legal Bar */}
          <div style={{ borderTop: '1px solid #141721', paddingTop: '30px', color: '#404654', fontSize: '12px', lineHeight: '1.6' }}>
            <p style={{ marginBottom: '6px' }}>© 2026 Nextoken Capital UAB. All rights reserved. Registered in Lithuania.</p>
            <p>Risk warning: Investing in tokenized assets involves risk. Past performance is not indicative of future results.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}