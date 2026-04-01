import React from 'react';

const S = {
  section: { background:"#0B0E11", padding:"0 20px 60px", color:"#fff", fontFamily:"-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" },
  container: { maxWidth:1100, margin:"0 auto" },
  grid: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 },
  card: { background:"#0F1318", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:"24px 20px", textAlign:"center" },
  num: { fontSize:28, fontWeight:900, color:"#F0B90B", marginBottom:4 },
  label: { fontSize:12, color:"rgba(255,255,255,0.35)" },
};

export default function StatsSection() {
  return (
    <section style={S.section}>
      <div style={S.container}>
        <div style={S.grid}>
          {[
            { n:"5+", l:"Asset Listings" },
            { n:"3", l:"Countries" },
            { n:"24/7", l:"Blockchain Settlement" },
            { n:"Non-Custodial", l:"Direct Wallet Purchases" },
          ].map((s,i) => (
            <div key={i} style={S.card}>
              <div style={S.num}>{s.n}</div>
              <div style={S.label}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}