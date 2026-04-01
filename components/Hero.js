import Link from "next/link";

export default function Hero() {
  return (
    <section style={{background:"#0B0E11",height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"70px 0 20px",color:"#fff",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",position:"relative",overflow:"hidden",boxSizing:"border-box"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(240,185,11,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(240,185,11,0.03) 1px, transparent 1px)",backgroundSize:"60px 60px",opacity:0.6}} />
      <div style={{position:"absolute",top:"-20%",right:"-10%",width:700,height:700,borderRadius:"50%",background:"radial-gradient(circle, rgba(240,185,11,0.08) 0%, transparent 70%)"}} />
      <div style={{position:"absolute",left:0,top:"12%",width:4,height:"45%",background:"linear-gradient(to bottom, transparent, #F0B90B, transparent)",borderRadius:2}} />

      <div style={{width:"100%",position:"relative",zIndex:2,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 5vw"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,fontSize:11,fontWeight:700,color:"#F0B90B",letterSpacing:4,textTransform:"uppercase",marginBottom:"clamp(12px, 2vh, 28px)",padding:"7px 18px",border:"1px solid rgba(240,185,11,0.15)",borderRadius:28,background:"rgba(240,185,11,0.04)"}}>
          <span style={{width:6,height:6,borderRadius:"50%",background:"#F0B90B"}} />
          Non-custodial RWA marketplace
        </div>
        <h1 style={{fontSize:"clamp(36px, 5.5vw, 82px)",fontWeight:900,lineHeight:1.06,marginBottom:"clamp(10px, 1.5vh, 24px)",letterSpacing:"-2px",width:"100%"}}>
          Buy Tokenized<br/><span style={{color:"#F0B90B"}}>Real-World Assets</span><br/>Directly On-Chain.
        </h1>
        <p style={{fontSize:"clamp(14px, 1.3vw, 20px)",color:"rgba(255,255,255,0.45)",lineHeight:1.7,marginBottom:"clamp(16px, 2.5vh, 40px)",maxWidth:"70vw"}}>
          Nextoken Capital connects you directly with asset issuers. Buy fractional shares of real estate, bonds, and energy projects — your wallet, your keys, your assets. We never touch your money.
        </p>
        <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",marginBottom:"clamp(20px, 3vh, 50px)"}}>
          <Link href="/marketplace" style={{display:"inline-flex",alignItems:"center",gap:10,padding:"clamp(12px,1.5vh,18px) clamp(28px,3vw,52px)",background:"#F0B90B",color:"#0B0E11",borderRadius:12,fontWeight:800,fontSize:"clamp(14px,1.2vw,18px)",textDecoration:"none"}}>Browse Marketplace <span style={{fontSize:18}}>→</span></Link>
          <Link href="/tokenize" style={{display:"inline-flex",alignItems:"center",gap:10,padding:"clamp(12px,1.5vh,18px) clamp(28px,3vw,52px)",background:"transparent",color:"#F0B90B",borderRadius:12,fontWeight:700,fontSize:"clamp(14px,1.2vw,18px)",textDecoration:"none",border:"1px solid rgba(240,185,11,0.25)"}}>List Your Asset</Link>
        </div>
        <div style={{display:"flex",gap:0,justifyContent:"center",width:"100%",borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:"clamp(14px, 2vh, 32px)"}}>
          {[{n:"0.2%",l:"Marketplace fee"},{n:"EUR 100",l:"Min purchase"},{n:"ERC-3643",l:"Token standard"},{n:"Polygon",l:"Blockchain"}].map((s,i) => (
            <div key={i} style={{flex:1,textAlign:"center",borderRight:i<3?"1px solid rgba(255,255,255,0.06)":"none",padding:"0 clamp(10px, 2vw, 40px)"}}>
              <div style={{fontSize:"clamp(18px, 2vw, 30px)",fontWeight:900,color:"#F0B90B"}}>{s.n}</div>
              <div style={{fontSize:"clamp(10px, 0.8vw, 13px)",color:"rgba(255,255,255,0.3)",marginTop:4}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}