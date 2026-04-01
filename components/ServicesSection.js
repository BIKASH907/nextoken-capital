import React from 'react';

export default function ServicesSection() {
  const cats = [
    { icon:"🏢", t:"Real Estate", d:"Commercial and residential property tokens. Earn rental income. From EUR 100.", color:"#F0B90B" },
    { icon:"📊", t:"Bonds & Fixed Income", d:"Government and corporate bonds on Polygon. Fixed schedules, transparent pricing.", color:"#3B82F6" },
    { icon:"⚡", t:"Energy & Infrastructure", d:"Solar farms, wind energy. Green asset tokens with quarterly earnings.", color:"#0ECB81" },
    { icon:"🏭", t:"Commodities", d:"Tokenized exposure to gold, agriculture, and industrial resources.", color:"#8B5CF6" },
    { icon:"📈", t:"Equity & Shares", d:"Company equity as ERC-3643 tokens. Shareholder rights and distributions on-chain.", color:"#EF4444" },
    { icon:"🌱", t:"Agriculture", d:"Farmland tokens. Seasonal earnings from crop production and land value.", color:"#14B8A6" },
  ];

  const steps = [
    { n:"01", t:"Connect Wallet", d:"MetaMask or WalletConnect. Your keys, your control.", color:"#F0B90B" },
    { n:"02", t:"Complete KYC", d:"Verify via Sumsub. One-time, takes 2 minutes.", color:"#3B82F6" },
    { n:"03", t:"Browse & Buy", d:"Explore assets. Buy directly — funds go to issuer.", color:"#0ECB81" },
    { n:"04", t:"Earn & Hold", d:"Quarterly earnings to your wallet. Track on-chain.", color:"#8B5CF6" },
  ];

  return (
    <section style={{background:"#0B0E11",padding:"80px 20px",color:"#fff",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"}}>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <div style={{fontSize:12,fontWeight:700,color:"#F0B90B",letterSpacing:3,textTransform:"uppercase",marginBottom:12}}>Asset categories</div>
          <h2 style={{fontSize:36,fontWeight:900,marginBottom:12}}>What You Can Buy</h2>
          <p style={{fontSize:15,color:"rgba(255,255,255,0.4)",maxWidth:520,margin:"0 auto",lineHeight:1.7}}>Tokenized real-world assets across multiple categories. Verified, documented, and on-chain.</p>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18,marginBottom:80}}>
          {cats.map((c,i) => (
            <div key={i} style={{background:"#0F1318",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,padding:28,position:"relative",overflow:"hidden",transition:"border-color .2s"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:c.color,opacity:0.5}} />
              <div style={{fontSize:32,marginBottom:14}}>{c.icon}</div>
              <div style={{fontSize:16,fontWeight:800,marginBottom:8}}>{c.t}</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",lineHeight:1.7}}>{c.d}</div>
            </div>
          ))}
        </div>

        <div style={{textAlign:"center",marginBottom:48}}>
          <div style={{fontSize:12,fontWeight:700,color:"#F0B90B",letterSpacing:3,textTransform:"uppercase",marginBottom:12}}>How it works</div>
          <h2 style={{fontSize:32,fontWeight:900}}>4 Steps to Your First Asset</h2>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:18}}>
          {steps.map((s,i) => (
            <div key={i} style={{textAlign:"center",padding:28,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:14,position:"relative"}}>
              <div style={{width:48,height:48,borderRadius:"50%",background:s.color+"15",border:"2px solid "+s.color+"30",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:18,fontWeight:900,color:s.color}}>{s.n}</div>
              <div style={{fontSize:15,fontWeight:700,marginBottom:6}}>{s.t}</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.35)",lineHeight:1.6}}>{s.d}</div>
              {i < 3 && <div style={{position:"absolute",top:"50%",right:-12,fontSize:16,color:"rgba(255,255,255,0.1)"}}>→</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}