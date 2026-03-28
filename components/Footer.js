export default function Footer() {
  return (
    <footer style={{
      background: '#0B0E11',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '48px 24px 28px',
      marginTop: '60px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Top row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '40px' }}>
          
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ background: '#F0B90B', borderRadius: '6px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: '#000', fontSize: '13px' }}>NXT</div>
              <span style={{ fontWeight: '700', fontSize: '15px', color: '#fff', letterSpacing: '0.5px' }}>NEXTOKEN CAPITAL</span>
            </div>
            <p style={{ color: '#555', fontSize: '13px', lineHeight: '1.7', maxWidth: '260px' }}>
              EU-regulated tokenized real-world asset platform. MiCA CASP licensed. Bringing institutional-grade assets to every investor.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              {['𝕏', 'in', 'tg'].map(s => (
                <a key={s} href="#" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', color: '#888', width: '34px', height: '34px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', textDecoration: 'none', fontWeight: '700', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#F0B90B'; e.currentTarget.style.color = '#F0B90B'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#888'; }}>
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <div style={{ color: '#F0B90B', fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '16px' }}>Platform</div>
            {['Markets', 'Exchange', 'Bonds', 'Equity & IPO', 'Tokenize Assets'].map(l => (
              <a key={l} href={`/${l.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                style={{ display: 'block', color: '#666', fontSize: '13px', textDecoration: 'none', marginBottom: '10px', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#ccc'}
                onMouseLeave={e => e.currentTarget.style.color = '#666'}>
                {l}
              </a>
            ))}
          </div>

          {/* Company */}
          <div>
            <div style={{ color: '#F0B90B', fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '16px' }}>Company</div>
            {['About Us', 'How It Works', 'Careers', 'Press', 'Contact'].map(l => (
              <a key={l} href="#"
                style={{ display: 'block', color: '#666', fontSize: '13px', textDecoration: 'none', marginBottom: '10px', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#ccc'}
                onMouseLeave={e => e.currentTarget.style.color = '#666'}>
                {l}
              </a>
            ))}
          </div>

          {/* Legal */}
          <div>
            <div style={{ color: '#F0B90B', fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '16px' }}>Legal</div>
            {['Terms of Service', 'Privacy Policy', 'Risk Disclosure', 'KYC/AML Policy', 'Cookie Policy'].map(l => (
              <a key={l} href="#"
                style={{ display: 'block', color: '#666', fontSize: '13px', textDecoration: 'none', marginBottom: '10px', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#ccc'}
                onMouseLeave={e => e.currentTarget.style.color = '#666'}>
                {l}
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ color: '#444', fontSize: '12px' }}>
            © {new Date().getFullYear()} Nextoken Capital UAB. All rights reserved. Registered in Lithuania. MiCA CASP License pending.
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', color: '#555', fontSize: '11px', padding: '4px 10px', borderRadius: '4px' }}>🇪🇺 EU Regulated</span>
            <span style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', color: '#555', fontSize: '11px', padding: '4px 10px', borderRadius: '4px' }}>🔒 Polygon Blockchain</span>
            <span style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', color: '#555', fontSize: '11px', padding: '4px 10px', borderRadius: '4px' }}>✓ Sumsub KYC</span>
          </div>
        </div>

        {/* Risk warning */}
        <div style={{ marginTop: '16px', background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '12px 16px' }}>
          <p style={{ color: '#3a3a3a', fontSize: '11px', lineHeight: '1.6', margin: 0 }}>
            <strong style={{ color: '#444' }}>Risk Warning:</strong> Investing in tokenized real-world assets carries significant risk including loss of capital. Past performance is not indicative of future results. This platform is for professional and sophisticated investors only. Please read our Risk Disclosure before investing.
          </p>
        </div>
      </div>
    </footer>
  );
}
