import Link from "next/link";

const S = {
  hero: { background:"#0B0E11", minHeight:"85vh", display:"flex", alignItems:"center", padding:"120px 20px 80px", color:"#fff", fontFamily:"-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif", position:"relative", overflow:"hidden" },
  container: { maxWidth:800, margin:"0 auto", position:"relative", zIndex:2 },
  label: { display:"inline-block", fontSize:11, fontWeight:700, color:"#F0B90B", letterSpacing:3, textTransform:"uppercase", marginBottom:20, padding:"6px 14px", border:"1px solid rgba(240,185,11,0.2)", borderRadius:20, background:"rgba(240,185,11,0.06)" },
  title: { fontSize:52, fontWeight:900, lineHeight:1.1, marginBottom:20 },
  gold: { color:"#F0B90B" },
  desc: { fontSize:17, color:"rgba(255,255,255,0.5)", lineHeight:1.8, marginBottom:32, maxWidth:620 },
  btns: { display:"flex", gap:12, flexWrap:"wrap" },
  primary: { display:"inline-block", padding:"14px 36px", background:"#F0B90B", color:"#0B0E11", borderRadius:10, fontWeight:800, fontSize:15, textDecoration:"none" },
  secondary: { display:"inline-block", padding:"14px 36px", background:"transparent", color:"#F0B90B", borderRadius:10, fontWeight:700, fontSize:15, textDecoration:"none", border:"1px solid rgba(240,185,11,0.3)" },
  stats: { display:"flex", gap:40, marginTop:48, paddingTop:32, borderTop:"1px solid rgba(255,255,255,0.06)" },
  stat: { },
  statNum: { fontSize:24, fontWeight:900, color:"#F0B90B" },
  statLabel: { fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:2 },
};

export default function Hero() {
  return (
    <section style={S.hero}>
      <div style={S.container}>
        <div style={S.label}>Non-Custodial RWA Marketplace</div>
        <h1 style={S.title}>
          Buy Tokenized<br/><span style={S.gold}>Real-World Assets</span><br/>Directly On-Chain.
        </h1>
        <p style={S.desc}>
          Nextoken Capital connects you directly with asset issuers. Buy fractional shares of real estate, bonds, and energy projects — your wallet, your keys, your assets. We never touch your money.
        </p>
        <div style={S.btns}>
          <Link href="/marketplace" style={S.primary}>Browse Marketplace</Link>
          <Link href="/tokenize" style={S.secondary}>List Your Asset</Link>
        </div>
        <div style={S.stats}>
          <div style={S.stat}><div style={S.statNum}>0.2%</div><div style={S.statLabel}>Marketplace fee</div></div>
          <div style={S.stat}><div style={S.statNum}>EUR 100</div><div style={S.statLabel}>Minimum purchase</div></div>
          <div style={S.stat}><div style={S.statNum}>ERC-3643</div><div style={S.statLabel}>Security token standard</div></div>
          <div style={S.stat}><div style={S.statNum}>Polygon</div><div style={S.statLabel}>Blockchain network</div></div>
        </div>
      </div>
    </section>
  );
}