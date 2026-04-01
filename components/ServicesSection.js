import React from 'react';

const S = {
  section: { background:"#0B0E11", padding:"80px 20px", color:"#fff", fontFamily:"-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" },
  container: { maxWidth:1100, margin:"0 auto" },
  label: { fontSize:12, fontWeight:700, color:"#F0B90B", letterSpacing:3, textTransform:"uppercase", marginBottom:12, textAlign:"center" },
  title: { fontSize:36, fontWeight:900, textAlign:"center", marginBottom:12, lineHeight:1.2 },
  sub: { fontSize:15, color:"rgba(255,255,255,0.45)", textAlign:"center", maxWidth:600, margin:"0 auto 48px", lineHeight:1.7 },
  grid: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20, marginBottom:64 },
  card: { background:"#0F1318", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, padding:28, transition:"border-color .2s" },
  icon: { fontSize:32, marginBottom:14 },
  cardTitle: { fontSize:16, fontWeight:800, marginBottom:8 },
  cardDesc: { fontSize:13, color:"rgba(255,255,255,0.45)", lineHeight:1.7 },
  howTitle: { fontSize:28, fontWeight:900, textAlign:"center", marginBottom:40 },
  steps: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20 },
  step: { textAlign:"center", padding:24, background:"rgba(240,185,11,0.03)", border:"1px solid rgba(240,185,11,0.1)", borderRadius:14 },
  stepNum: { fontSize:32, fontWeight:900, color:"#F0B90B", marginBottom:8 },
  stepTitle: { fontSize:14, fontWeight:700, marginBottom:6 },
  stepDesc: { fontSize:12, color:"rgba(255,255,255,0.35)", lineHeight:1.6 },
};

export default function ServicesSection() {
  return (
    <section style={S.section}>
      <div style={S.container}>
        <div style={S.label}>Asset Categories</div>
        <h2 style={S.title}>What You Can Buy</h2>
        <p style={S.sub}>Tokenized real-world assets across multiple categories. Each asset is verified, documented, and tradeable on-chain.</p>

        <div style={S.grid}>
          {[
            { icon:"🏢", t:"Real Estate", d:"Commercial and residential property tokens. Earn rental income distributions. Fractional ownership from EUR 100." },
            { icon:"📊", t:"Bonds & Fixed Income", d:"Government and corporate bonds tokenized on Polygon. Fixed earnings schedules, transparent pricing, on-chain settlement." },
            { icon:"⚡", t:"Energy & Infrastructure", d:"Solar farms, wind energy, and infrastructure projects. Green asset tokens with quarterly earnings distributions." },
            { icon:"🏭", t:"Commodities", d:"Tokenized exposure to physical commodities. Gold, agriculture, and industrial resources on blockchain." },
            { icon:"📈", t:"Equity & Shares", d:"Company equity tokenized as ERC-3643 security tokens. Shareholder rights, voting, and distributions on-chain." },
            { icon:"🌱", t:"Agriculture", d:"Farmland and agribusiness tokens. Seasonal earnings from crop production and land appreciation." },
          ].map((c,i) => (
            <div key={i} style={S.card}>
              <div style={S.icon}>{c.icon}</div>
              <div style={S.cardTitle}>{c.t}</div>
              <div style={S.cardDesc}>{c.d}</div>
            </div>
          ))}
        </div>

        <h3 style={S.howTitle}>How It Works</h3>
        <div style={S.steps}>
          {[
            { n:"01", t:"Connect Wallet", d:"Connect MetaMask or any Web3 wallet via WalletConnect. Your keys, your control." },
            { n:"02", t:"Complete KYC", d:"Verify your identity through Sumsub. One-time process, takes 2 minutes." },
            { n:"03", t:"Browse & Buy", d:"Explore verified assets. Click Buy Now, confirm in your wallet. Funds go directly to the issuer." },
            { n:"04", t:"Earn & Hold", d:"Receive quarterly earnings to your wallet. Track your assets on-chain anytime." },
          ].map((s,i) => (
            <div key={i} style={S.step}>
              <div style={S.stepNum}>{s.n}</div>
              <div style={S.stepTitle}>{s.t}</div>
              <div style={S.stepDesc}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}