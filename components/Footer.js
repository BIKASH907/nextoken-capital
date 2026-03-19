// components/Footer.js
import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{background:'#0b0f14',borderTop:'1px solid #1f2937',padding:'60px 40px 30px',color:'#aaa',fontFamily:'sans-serif'}}>
      <div style={{maxWidth:'1080px',margin:'0 auto'}}>

        {/* Top grid */}
        <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:'40px',marginBottom:'48px'}}>

          {/* Brand */}
          <div>
            <div style={{fontWeight:800,fontSize:'1.1rem',color:'#fff',letterSpacing:'.1em',marginBottom:'12px'}}>
              NXT <span style={{color:'#38bd82'}}>NEXTOKEN</span>
            </div>
            <p style={{fontSize:'.85rem',color:'#6b7280',lineHeight:1.7,maxWidth:'260px'}}>
              The regulated infrastructure for tokenized real-world assets. Supervised by the Bank of Lithuania.
            </p>
            <div style={{marginTop:'16px',display:'flex',alignItems:'center',gap:'8px'}}>
              <span style={{fontSize:'1rem'}}>🇱🇹</span>
              <span style={{fontSize:'.75rem',color:'#6b7280'}}>Monitored by Bank of Lithuania</span>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 style={{fontFamily:'monospace',fontSize:'.68rem',letterSpacing:'.15em',color:'#4a5568',textTransform:'uppercase',marginBottom:'16px'}}>Company</h4>
            <Link href="/company" style={{display:'block',fontSize:'.85rem',color:'#9ca3af',textDecoration:'none',marginBottom:'10px'}}>About Us</Link>
            <Link href="/company" style={{display:'block',fontSize:'.85rem',color:'#9ca3af',textDecoration:'none',marginBottom:'10px'}}>Careers</Link>
            <Link href="/company" style={{display:'block',fontSize:'.85rem',color:'#9ca3af',textDecoration:'none',marginBottom:'10px'}}>Press</Link>
            <Link href="/company" style={{display:'block',fontSize:'.85rem',color:'#9ca3af',textDecoration:'none',marginBottom:'10px'}}>Blog</Link>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{fontFamily:'monospace',fontSize:'.68rem',letterSpacing:'.15em',color:'#4a5568',textTransform:'uppercase',marginBottom:'16px'}}>Legal</h4>
            <a href="/terms" style={{display:'block',fontSize:'.85rem',color:'#9ca3af',textDecoration:'none',marginBottom:'10px'}}>Terms of Service</a>
            <a href="#" style={{display:'block',fontSize:'.85rem',color:'#9ca3af',textDecoration:'none',marginBottom:'10px'}}>Privacy Policy</a>
            <a href="#" style={{display:'block',fontSize:'.85rem',color:'#9ca3af',textDecoration:'none',marginBottom:'10px'}}>Risk Disclosure</a>
            <a href="#" style={{display:'block',fontSize:'.85rem',color:'#9ca3af',textDecoration:'none',marginBottom:'10px'}}>AML Policy</a>
          </div>

          {/* Support */}
          <div>
            <h4 style={{fontFamily:'monospace',fontSize:'.68rem',letterSpacing:'.15em',color:'#4a5568',textTransform:'uppercase',marginBottom:'16px'}}>Support</h4>
            <a href="#" style={{display:'block',fontSize:'.85rem',color:'#9ca3af',textDecoration:'none',marginBottom:'10px'}}>Help Center</a>
            <a href="#" style={{display:'block',fontSize:'.85rem',color:'#9ca3af',textDecoration:'none',marginBottom:'10px'}}>Contact Us</a>
            <Link href="/company" style={{display:'block',fontSize:'.85rem',color:'#9ca3af',textDecoration:'none',marginBottom:'10px'}}>API Docs</Link>
            <a href="#" style={{display:'block',fontSize:'.85rem',color:'#9ca3af',textDecoration:'none',marginBottom:'10px'}}>Status</a>
          </div>

        </div>

        {/* Bottom bar */}
        <div style={{borderTop:'1px solid #1f2937',paddingTop:'24px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'12px'}}>
          <p style={{fontSize:'.75rem',color:'#4a5568',margin:0}}>
            © 2026 Nextoken Capital UAB. All rights reserved. Registered in Lithuania.
          </p>
          <p style={{fontSize:'.75rem',color:'#4a5568',margin:0}}>
            Risk warning: Investing in tokenized assets involves risk. Past performance is not indicative of future results.
          </p>
        </div>

      </div>
    </footer>
  )
}