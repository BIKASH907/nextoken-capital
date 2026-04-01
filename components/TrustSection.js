import React from 'react';

export default function TrustSection() {
  return (
    <section style={{background:"#080A0E",padding:"80px 20px",color:"#fff",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",position:"relative"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(rgba(240,185,11,0.03) 1px, transparent 1px)",backgroundSize:"30px 30px"}} />
      <div style={{maxWidth:1100,margin:"0 auto",position:"relative",zIndex:2}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <div style={{fontSize:12,fontWeight:700,color:"#F0B90B",letterSpacing:3,textTransform:"uppercase",marginBottom:12}}>Trust & verification</div>
          <h2 style={{fontSize:36,fontWeight:900,marginBottom:12}}>Every Asset Passes 5-Step Verification</h2>
          <p style={{fontSize:15,color:"rgba(255,255,255,0.4)",maxWidth:560,margin:"0 auto",lineHeight:1.7}}>We do not list assets blindly. Every listing goes through rigorous verification before reaching the marketplace.</p>
        </div>
        <div className="trust-pipeline" style={{marginBottom:64}}>
          {[
            { n:"1", t:"Issuer KYB", d:"Company + ownership screening", c:"#F0B90B" },
            { n:"2", t:"Due Diligence", d:"Financials + valuation review", c:"#3B82F6" },
            { n:"3", t:"Legal Review", d:"Token rights + structure check", c:"#0ECB81" },
            { n:"4", t:"Contract Audit", d:"ERC-3643 code security", c:"#8B5CF6" },
            { n:"5", t:"Approval", d:"Compliance team sign-off", c:"#EF4444" },
          ].map((s,i) => (
            <div key={i} style={{flex:1,minWidth:120,background:"#0F1318",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:"20px 16px",textAlign:"center",position:"relative"}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:s.c+"20",border:"2px solid "+s.c+"40",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px",fontSize:13,fontWeight:900,color:s.c}}>{s.n}</div>
              <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>{s.t}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>{s.d}</div>
            </div>
          ))}
        </div>
        <div className="trust-cards" style={{marginBottom:48}}>
          {[
            { icon:"🔗", t:"Non-Custodial", d:"Funds go directly from your wallet to the issuer via smart contract. Nextoken never holds your money.", bc:"rgba(240,185,11,0.1)" },
            { icon:"📜", t:"Token Rights", d:"Each ERC-3643 token represents legal economic rights to the underlying asset.", bc:"rgba(59,130,246,0.1)" },
            { icon:"🛡️", t:"Asset Ownership", d:"Issuers retain legal ownership. Token holders own fractional economic rights.", bc:"rgba(14,203,129,0.1)" },
            { icon:"🔐", t:"KYC via Sumsub", d:"Licensed global KYC provider. Document checks, facial recognition, AML screening.", bc:"rgba(139,92,246,0.1)" },
            { icon:"⛓️", t:"On-Chain Transparency", d:"Every transaction on Polygon blockchain. Publicly verifiable. No hidden ledgers.", bc:"rgba(239,68,68,0.1)" },
            { icon:"💶", t:"Payments via Monerium", d:"EUR payments through Monerium — EU-licensed EMI. Bank-grade payment rails.", bc:"rgba(20,184,166,0.1)" },
          ].map((c,i) => (
            <div key={i} style={{background:"#0F1318",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,padding:28}}>
              <div style={{width:44,height:44,borderRadius:10,background:c.bc,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginBottom:14}}>{c.icon}</div>
              <div style={{fontSize:15,fontWeight:800,marginBottom:8}}>{c.t}</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",lineHeight:1.7}}>{c.d}</div>
            </div>
          ))}
        </div>
        <div className="trust-bar">
          {[
            { n:"ERC-3643", l:"Security token standard" },
            { n:"Polygon", l:"Blockchain network" },
            { n:"Sumsub", l:"KYC/AML provider" },
            { n:"Monerium", l:"EU licensed EMI" },
          ].map((t,i) => (
            <div key={i} style={{textAlign:"center",padding:"18px 12px",background:"rgba(240,185,11,0.03)",border:"1px solid rgba(240,185,11,0.08)",borderRadius:10}}>
              <div style={{fontSize:18,fontWeight:900,color:"#F0B90B",marginBottom:2}}>{t.n}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.25)"}}>{t.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}