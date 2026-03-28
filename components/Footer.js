import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{borderTop:"1px solid rgba(255,255,255,0.08)",padding:"48px 24px 28px",background:"#0B0E11"}}>
      <style>{`
        .ft-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px;margin-bottom:40px}
        .ft-link{display:block;font-size:13px;color:rgba(255,255,255,0.45);text-decoration:none;margin-bottom:10px;transition:color 0.2s}
        .ft-link:hover{color:#fff}
        @media(max-width:768px){.ft-grid{grid-template-columns:1fr 1fr;gap:28px}.ft-bottom{flex-direction:column;text-align:center;align-items:center}.ft-badges{justify-content:center}}
        @media(max-width:480px){.ft-grid{grid-template-columns:1fr;gap:24px}}
      `}</style>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <div className="ft-grid">
          <div>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
              <img src="/logo.png" alt="NXT" style={{height:32,width:"auto"}} onError={(e)=>{e.target.style.display='none'}} />
              <div style={{width:1,height:22,background:"rgba(240,185,11,0.25)"}} />
              <div>
                <div style={{fontFamily:"Syne,sans-serif",fontSize:13,fontWeight:800,letterSpacing:"0.15em",color:"#F0B90B"}}>NEXTOKEN</div>
                <div style={{fontSize:9,letterSpacing:"0.2em",color:"rgba(255,255,255,0.4)",textTransform:"uppercase"}}>CAPITAL</div>
              </div>
            </div>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.45)",maxWidth:260,lineHeight:1.7,marginBottom:16}}>EU compliance-ready tokenized real-world asset platform. MiCA CASP license pending.</p>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
              <img src="/bikash.jpg" alt="CEO" style={{width:36,height:36,borderRadius:"50%",objectFit:"cover",border:"1px solid rgba(240,185,11,0.3)"}} />
              <div>
                <div style={{fontSize:12,fontWeight:700,color:"#fff"}}>Bikash Bhat</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.4)"}}>CEO and Founder</div>
              </div>
            </div>
            <div style={{display:"flex",gap:10}}>
              {[["X","#"],["in","https://www.linkedin.com/in/bikash-bhat-87700318a"],["tg","#"]].map(([s,h])=>(
                <a key={s} href={h} className="ft-link" style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",width:34,height:34,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,marginBottom:0}}>{s}</a>
              ))}
            </div>
          </div>
          <div>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:"#F0B90B",marginBottom:16}}>Platform</div>
            {[["Markets","/markets"],["Exchange","/exchange"],["Bonds","/bonds"],["Equity and IPO","/equity-ipo"],["Tokenize","/tokenize"]].map(([l,h])=>(
              <Link key={l} href={h} className="ft-link">{l}</Link>
            ))}
          </div>
          <div>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:"#F0B90B",marginBottom:16}}>Company</div>
            {[["About Us","/about"],["How It Works","/learn"],["Careers","/careers"],["Press","/press"],["Contact","/contact"]].map(([l,h])=>(
              <Link key={l} href={h} className="ft-link">{l}</Link>
            ))}
          </div>
          <div>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:"#F0B90B",marginBottom:16}}>Legal</div>
            {[["Terms of Service","/terms"],["Privacy Policy","/privacy"],["Risk Disclosure","/risk"],["KYC/AML Policy","/aml"],["Fees","/fees"]].map(([l,h])=>(
              <Link key={l} href={h} className="ft-link">{l}</Link>
            ))}
          </div>
        </div>
        <div className="ft-bottom" style={{borderTop:"1px solid rgba(255,255,255,0.08)",paddingTop:20,display:"flex",flexWrap:"wrap",justifyContent:"space-between",gap:10}}>
          <p style={{fontSize:12,color:"rgba(255,255,255,0.4)",margin:0}}>&#169; {new Date().getFullYear()} Nextoken Capital UAB. All rights reserved. Registered in Lithuania.</p>
          <div className="ft-badges" style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <span style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.4)",fontSize:11,padding:"4px 10px",borderRadius:4}}>EU Regulated</span>
            <span style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.4)",fontSize:11,padding:"4px 10px",borderRadius:4}}>Polygon Blockchain</span>
            <span style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.4)",fontSize:11,padding:"4px 10px",borderRadius:4}}>Sumsub KYC</span>
          </div>
        </div>
        <div style={{marginTop:16,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,padding:"12px 16px"}}>
          <p style={{color:"rgba(255,255,255,0.25)",fontSize:11,lineHeight:1.6,margin:0}}>
            <strong style={{color:"rgba(255,255,255,0.35)"}}>Risk Warning:</strong> Investing in tokenized real-world assets carries significant risk including loss of capital. Past performance is not indicative of future results. Please read our Risk Disclosure before investing.
          </p>
        </div>
      </div>
    </footer>
  );
}
