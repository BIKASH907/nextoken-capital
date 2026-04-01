import Link from "next/link";

export default function Hero() {
  return (
    <section style={{background:"#0B0E11",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"80px 40px 40px",color:"#fff",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(240,185,11,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(240,185,11,0.03) 1px, transparent 1px)",backgroundSize:"60px 60px",opacity:0.6}} />
      <div style={{position:"absolute",top:"-20%",right:"-10%",width:700,height:700,borderRadius:"50%",background:"radial-gradient(circle, rgba(240,185,11,0.08) 0%, transparent 70%)"}} />
      <div style={{position:"absolute",left:0,top:"12%",width:4,height:"45%",background:"linear-gradient(to bottom, transparent, #F0B90B, transparent)",borderRadius:2}} />

      <div style={{maxWidth:1200,margin:"0 auto",width:"100%",position:"relative",zIndex:2,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"calc(100vh - 120px)"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,fontSize:12,fontWeight:700,color:"#F0B90B",letterSpacing:4,textTransform:"uppercase",marginBottom:32,padding:"10px 22px",border:"1px solid rgba(240,185,11,0.15)",borderRadius:28,background:"rgba(240,185,11,0.04)"}}>
          <span style={{width:7,height:7,borderRadius:"50%",background:"#F0B90B"}} />
          Non-custodial RWA marketplace
        </div>
        <h1 style={{fontSize:"clamp(42px, 5.5vw, 76px)",fontWeight:900,lineHeight:1.06,marginBottom:28,letterSpacing:"-2px",maxWidth:1000}}>
          Buy Tokenized<br/><span style={{color:"#F0B90B"}}>Real-World Assets</span><br/>Directly On-Chain.
        </h1>
        <p style={{fontSize:"clamp(16px, 1.3vw, 20px)",color:"rgba(255,255,255,0.45)",lineHeight:1.8,marginBottom:48,maxWidth:700}}>
          Nextoken Capital connects you directly with asset issuers. Buy fractional shares of real estate, bonds, and energy projects — your wallet, your keys, your assets. We never touch your money.
        </p>
        <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap",marginBottom:64}}>
          <Link href="/marketplace" style={{display:"inline-flex",alignItems:"center",gap:10,padding:"18px 48px",background:"#F0B90B",color:"#0B0E11",borderRadius:14,fontWeight:800,fontSize:17,textDecoration:"none",letterSpacing:"0.3px"}}>Browse Marketplace <span style={{fontSize:20}}>→</span></Link>
          <Link href="/tokenize" style={{display:"inline-flex",alignItems:"center",gap:10,padding:"18px 48px",background:"transparent",color:"#F0B90B",borderRadius:14,fontWeight:700,fontSize:17,textDecoration:"none",border:"1px solid rgba(240,185,11,0.25)"}}>List Your Asset</Link>
        </div>
        <div style={{display:"flex",gap:0,justifyContent:"center",width:"100%",maxWidth:900,borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:36}}>
          {[{n:"0.2%",l:"Marketplace fee"},{n:"EUR 100",l:"Min purchase"},{n:"ERC-3643",l:"Token standard"},{n:"Polygon",l:"Blockchain"}].map((s,i) => (
            <div key={i} style={{flex:1,textAlign:"center",borderRight:i<3?"1px solid rgba(255,255,255,0.06)":"none",padding:"0 20px"}}>
              <div style={{fontSize:"clamp(20px, 2vw, 28px)",fontWeight:900,color:"#F0B90B"}}>{s.n}</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.3)",marginTop:6}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}