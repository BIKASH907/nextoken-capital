import Link from "next/link";

export default function Hero() {
  return (
    <section style={{background:"#0B0E11",minHeight:"92vh",display:"flex",alignItems:"center",padding:"100px 20px 60px",color:"#fff",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(240,185,11,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(240,185,11,0.03) 1px, transparent 1px)",backgroundSize:"60px 60px",opacity:0.6}} />
      <div style={{position:"absolute",top:"-20%",right:"-10%",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle, rgba(240,185,11,0.08) 0%, transparent 70%)"}} />
      <div style={{position:"absolute",left:0,top:"15%",width:4,height:"40%",background:"linear-gradient(to bottom, transparent, #F0B90B, transparent)",borderRadius:2}} />

      <div className="hero-grid" style={{padding:"0 20px"}}>
        <div>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,fontSize:11,fontWeight:700,color:"#F0B90B",letterSpacing:3,textTransform:"uppercase",marginBottom:24,padding:"8px 16px",border:"1px solid rgba(240,185,11,0.15)",borderRadius:24,background:"rgba(240,185,11,0.04)"}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:"#F0B90B"}} />
            Non-custodial RWA marketplace
          </div>
          <h1 style={{fontSize:54,fontWeight:900,lineHeight:1.08,marginBottom:24,letterSpacing:"-1px"}}>
            Buy Tokenized<br/><span style={{color:"#F0B90B"}}>Real-World Assets</span><br/>Directly On-Chain.
          </h1>
          <p style={{fontSize:17,color:"rgba(255,255,255,0.45)",lineHeight:1.8,marginBottom:36,maxWidth:540}}>
            Nextoken Capital connects you directly with asset issuers. Buy fractional shares of real estate, bonds, and energy projects — your wallet, your keys, your assets. We never touch your money.
          </p>
          <div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:48}}>
            <Link href="/marketplace" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"15px 36px",background:"#F0B90B",color:"#0B0E11",borderRadius:12,fontWeight:800,fontSize:15,textDecoration:"none",letterSpacing:"0.3px"}}>Browse Marketplace <span style={{fontSize:18}}>→</span></Link>
            <Link href="/tokenize" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"15px 36px",background:"transparent",color:"#F0B90B",borderRadius:12,fontWeight:700,fontSize:15,textDecoration:"none",border:"1px solid rgba(240,185,11,0.25)"}}>List Your Asset</Link>
          </div>
          <div className="hero-stats">
            {[{n:"0.2%",l:"Marketplace fee"},{n:"EUR 100",l:"Min purchase"},{n:"ERC-3643",l:"Token standard"},{n:"Polygon",l:"Blockchain"}].map((s,i) => (
              <div key={i}>
                <div style={{fontSize:20,fontWeight:900,color:"#F0B90B"}}>{s.n}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginTop:2}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-card">
          <div style={{position:"absolute",top:-1,left:24,right:24,height:3,background:"linear-gradient(90deg, #F0B90B, transparent)",borderRadius:"0 0 2px 2px"}} />
          <div style={{fontSize:10,fontWeight:700,color:"#F0B90B",letterSpacing:2,textTransform:"uppercase",marginBottom:16}}>Featured asset</div>
          <div style={{width:"100%",height:140,background:"linear-gradient(135deg, rgba(240,185,11,0.08), rgba(240,185,11,0.02))",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16,border:"1px solid rgba(240,185,11,0.08)"}}>
            <span style={{fontSize:48,opacity:0.4}}>🏢</span>
          </div>
          <div style={{fontSize:18,fontWeight:800,marginBottom:4}}>Vilnius Office Complex</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginBottom:16}}>Commercial Real Estate · Lithuania</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
            <div style={{background:"rgba(255,255,255,0.03)",borderRadius:8,padding:"10px 12px"}}>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>Token price</div>
              <div style={{fontSize:16,fontWeight:800,color:"#F0B90B"}}>EUR 10.00</div>
            </div>
            <div style={{background:"rgba(255,255,255,0.03)",borderRadius:8,padding:"10px 12px"}}>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>Est. return</div>
              <div style={{fontSize:16,fontWeight:800,color:"#0ECB81"}}>12.4%</div>
            </div>
          </div>
          <div style={{height:6,background:"rgba(255,255,255,0.04)",borderRadius:3,overflow:"hidden",marginBottom:8}}>
            <div style={{height:"100%",width:"34%",background:"#F0B90B",borderRadius:3}} />
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"rgba(255,255,255,0.3)"}}>
            <span>34% funded</span><span>EUR 340K / EUR 1M</span>
          </div>
          <Link href="/marketplace" style={{display:"block",textAlign:"center",padding:"12px 0",background:"rgba(240,185,11,0.08)",border:"1px solid rgba(240,185,11,0.15)",borderRadius:10,color:"#F0B90B",fontWeight:700,fontSize:13,textDecoration:"none",marginTop:16}}>View Details →</Link>
        </div>
      </div>
    </section>
  );
}