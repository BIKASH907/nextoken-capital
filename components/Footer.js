import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer style={{background:"#0B0E11",borderTop:"1px solid rgba(255,255,255,0.06)",padding:"60px 20px 30px",color:"#fff",fontFamily:"-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif"}}>
      <div style={{maxWidth:1200,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:40,marginBottom:40}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
            <span style={{fontSize:22,fontWeight:900,color:"#F0B90B"}}>NXT</span>
            <span style={{fontSize:13,color:"rgba(255,255,255,0.4)"}}>NEXTOKEN CAPITAL</span>
          </div>
          <p style={{fontSize:13,color:"rgba(255,255,255,0.4)",lineHeight:1.7,marginBottom:16}}>EU-regulated tokenized real-world asset investment platform. Bringing institutional-grade investments to everyone.</p>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.25)"}}>Nextoken Capital UAB<br/>Vilnius, Lithuania</div>
        </div>
        <div>
          <h3 style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.6)",textTransform:"uppercase",letterSpacing:1,marginBottom:16}}>Company</h3>
          <ul style={{listStyle:"none",padding:0,margin:0}}>
            {[{label:"About",href:"/about"},{label:"Careers",href:"/careers"},{label:"Contact",href:"/contact"},{label:"Press",href:"/press"}].map(l=>(
              <li key={l.href} style={{marginBottom:10}}><Link href={l.href} style={{color:"rgba(255,255,255,0.45)",textDecoration:"none",fontSize:14,transition:"color .15s"}}>{l.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.6)",textTransform:"uppercase",letterSpacing:1,marginBottom:16}}>Resources</h3>
          <ul style={{listStyle:"none",padding:0,margin:0}}>
            {[{label:"Documentation",href:"/learn"},{label:"Blog",href:"/blog"},{label:"Fees",href:"/fees"},{label:"Status",href:"/status"},{label:"Support",href:"/support"}].map(l=>(
              <li key={l.href} style={{marginBottom:10}}><Link href={l.href} style={{color:"rgba(255,255,255,0.45)",textDecoration:"none",fontSize:14}}>{l.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.6)",textTransform:"uppercase",letterSpacing:1,marginBottom:16}}>Legal</h3>
          <ul style={{listStyle:"none",padding:0,margin:0}}>
            {[{label:"Privacy Policy",href:"/privacy"},{label:"Terms of Service",href:"/terms"},{label:"Risk Disclosure",href:"/risk"},{label:"Compliance",href:"/compliance"}].map(l=>(
              <li key={l.href} style={{marginBottom:10}}><Link href={l.href} style={{color:"rgba(255,255,255,0.45)",textDecoration:"none",fontSize:14}}>{l.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div style={{maxWidth:1200,margin:"0 auto",borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:20,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.25)",margin:0}}>© {new Date().getFullYear()} Nextoken Capital UAB. All rights reserved.</p>
        <div style={{display:"flex",gap:20}}>
          <span style={{fontSize:11,color:"rgba(255,255,255,0.2)"}}>MiCA Compliant</span>
          <span style={{fontSize:11,color:"rgba(255,255,255,0.2)"}}>Bank of Lithuania Regulated</span>
          <span style={{fontSize:11,color:"rgba(255,255,255,0.2)"}}>ERC-3643</span>
        </div>
      </div>
    </footer>
  );
};
export default Footer;