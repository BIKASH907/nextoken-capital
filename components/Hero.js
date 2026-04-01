import Link from "next/link";

export default function Hero() {
  return (
    <section style={{background:"#0B0E11",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"80px 20px 40px",color:"#fff",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(240,185,11,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(240,185,11,0.03) 1px, transparent 1px)",backgroundSize:"60px 60px",opacity:0.6}} />
      <div style={{position:"absolute",top:"-20%",right:"-10%",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle, rgba(240,185,11,0.08) 0%, transparent 70%)"}} />
      <div style={{position:"absolute",left:0,top:"15%",width:4,height:"40%",background:"linear-gradient(to bottom, transparent, #F0B90B, transparent)",borderRadius:2}} />

      <div style={{maxWidth:900,margin:"0 auto",width:"100%",position:"relative",zIndex:2,textAlign:"center"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,fontSize:11,fontWeight:700,color:"#F0B90B",letterSpacing:3,textTransform:"uppercase",marginBottom:28,padding:"8px 18px",border:"1px solid rgba(240,185,11,0.15)",borderRadius:24,background:"rgba(240,185,11,0.04)"}}>
          <span style={{width:6,height:6,borderRadius:"50%",background:"#F0B90B"}} />
          Non-custodial RWA marketplace
        </div>
        <h1 style={{fontSize:58,fontWeight:900,lineHeight:1.08,marginBottom:24,letterSpacing:"-1.5px"}}>
          Buy Tokenized<br/><span style={{color:"#F0B90B"}}>Real-World Assets</span><br/>Directly On-Chain.
        </h1>
        <p style={{fontSize:18,color:"rgba(255,255,255,0.45)",lineHeight:1.8,marginBottom:40,maxWidth:620,margin:"0 auto 40px"}}>
          Nextoken Capital connects you directly with asset issuers. Buy fractional shares of real estate, bonds, and energy projects — your wallet, your keys, your assets. We never touch your money.
        </p>
        <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",marginBottom:56}}>
          <Link href="/marketplace" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"16px 40px",background:"#F0B90B",color:"#0B0E11",borderRadius:12,fontWeight:800,fontSize:16,textDecoration:"none",letterSpacing:"0.3px"}}>Browse Marketplace <span style={{fontSize:18}}>→</span></Link>
          <Link href="/tokenize" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"16px 40px",background:"transparent",color:"#F0B90B",borderRadius:12,fontWeight:700,fontSize:16,textDecoration:"none",border:"1px solid rgba(240,185,11,0.25)"}}>List Your Asset</Link>
        </div>
        <div className="hero-stats" style={{justifyContent:"center",gap:48}}>
          {[{n:"0.2%",l:"Marketplace fee"},{n:"EUR 100",l:"Min purchase"},{n:"ERC-3643",l:"Token standard"},{n:"Polygon",l:"Blockchain"}].map((s,i) => (
            <div key={i} style={{textAlign:"center"}}>
              <div style={{fontSize:22,fontWeight:900,color:"#F0B90B"}}>{s.n}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginTop:4}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}