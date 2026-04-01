import React from 'react';

const S = {
  section: { background:"#0B0E11", padding:"80px 20px", color:"#fff", fontFamily:"-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" },
  container: { maxWidth:1100, margin:"0 auto" },
  label: { fontSize:12, fontWeight:700, color:"#F0B90B", letterSpacing:3, textTransform:"uppercase", marginBottom:12, textAlign:"center" },
  title: { fontSize:36, fontWeight:900, textAlign:"center", marginBottom:12, lineHeight:1.2 },
  sub: { fontSize:15, color:"rgba(255,255,255,0.45)", textAlign:"center", maxWidth:600, margin:"0 auto 48px", lineHeight:1.7 },
  grid: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20, marginBottom:64 },
  card: { background:"#0F1318", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, padding:28 },
  cardIcon: { fontSize:28, marginBottom:12 },
  cardTitle: { fontSize:16, fontWeight:800, marginBottom:8 },
  cardDesc: { fontSize:13, color:"rgba(255,255,255,0.45)", lineHeight:1.7 },
  pipeline: { display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, marginBottom:48, flexWrap:"wrap" },
  step: { flex:1, minWidth:140, textAlign:"center", position:"relative" },
  stepNum: { width:36, height:36, borderRadius:"50%", background:"rgba(240,185,11,0.15)", border:"1px solid rgba(240,185,11,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:800, color:"#F0B90B", margin:"0 auto 10px" },
  stepTitle: { fontSize:13, fontWeight:700, marginBottom:4 },
  stepDesc: { fontSize:11, color:"rgba(255,255,255,0.35)", lineHeight:1.5 },
  trustBar: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginTop:48 },
  trustItem: { textAlign:"center", padding:"20px 12px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:10 },
  trustNum: { fontSize:24, fontWeight:900, color:"#F0B90B", marginBottom:4 },
  trustLabel: { fontSize:11, color:"rgba(255,255,255,0.35)" },
};

export default function TrustSection() {
  return (
    <section style={S.section}>
      <div style={S.container}>
        <div style={S.label}>Why Nextoken Capital</div>
        <h2 style={S.title}>Every Asset Passes a 5-Step Verification</h2>
        <p style={S.sub}>We do not list assets blindly. Every tokenized asset goes through a rigorous verification pipeline before reaching the marketplace.</p>

        <div style={S.pipeline}>
          {[
            { n:"1", t:"Issuer KYB", d:"Company registration, beneficial ownership, and AML screening via Sumsub" },
            { n:"2", t:"Asset Due Diligence", d:"Financial statements, valuation reports, and legal documentation review" },
            { n:"3", t:"Legal Structure", d:"Token rights, ownership structure, and smart contract terms verified" },
            { n:"4", t:"Smart Contract Audit", d:"ERC-3643 token code reviewed for security and compliance logic" },
            { n:"5", t:"Compliance Approval", d:"Final review by compliance team before marketplace listing" },
          ].map((s,i) => (
            <div key={i} style={S.step}>
              <div style={S.stepNum}>{s.n}</div>
              <div style={S.stepTitle}>{s.t}</div>
              <div style={S.stepDesc}>{s.d}</div>
            </div>
          ))}
        </div>

        <div style={S.grid}>
          <div style={S.card}>
            <div style={S.cardIcon}>🔗</div>
            <div style={S.cardTitle}>Non-Custodial Architecture</div>
            <div style={S.cardDesc}>Your funds go directly from your wallet to the asset issuer via smart contract. Nextoken never holds, touches, or controls your money. Commission is split automatically on-chain.</div>
          </div>
          <div style={S.card}>
            <div style={S.cardIcon}>📜</div>
            <div style={S.cardTitle}>Token Rights & Ownership</div>
            <div style={S.cardDesc}>Each ERC-3643 token represents a legal claim on the underlying asset. Token holders receive proportional earnings distributions. All rights are defined in the token terms document attached to each listing.</div>
          </div>
          <div style={S.card}>
            <div style={S.cardIcon}>🛡️</div>
            <div style={S.cardTitle}>Who Owns the Assets?</div>
            <div style={S.cardDesc}>The asset issuer (company or SPV) retains legal ownership. Token holders own fractional economic rights. Issuer identity, registration, and ownership structure are verified through KYB and displayed on each asset page.</div>
          </div>
        </div>

        <div style={S.grid}>
          <div style={S.card}>
            <div style={S.cardIcon}>🔐</div>
            <div style={S.cardTitle}>KYC via Sumsub</div>
            <div style={S.cardDesc}>Identity verification powered by Sumsub — a globally licensed KYC provider. Document checks, facial recognition, and AML screening before any purchase.</div>
          </div>
          <div style={S.card}>
            <div style={S.cardIcon}>⛓️</div>
            <div style={S.cardTitle}>On-Chain Transparency</div>
            <div style={S.cardDesc}>Every transaction is recorded on Polygon blockchain. Token balances, transfers, and distributions are publicly verifiable. No hidden ledgers.</div>
          </div>
          <div style={S.card}>
            <div style={S.cardIcon}>💶</div>
            <div style={S.cardTitle}>Payments via Monerium</div>
            <div style={S.cardDesc}>EUR payments processed through Monerium — an EU-licensed Electronic Money Institution. Bank-grade payment rails with full regulatory compliance.</div>
          </div>
        </div>

        <div style={S.trustBar}>
          {[
            { n:"ERC-3643", l:"Security token standard" },
            { n:"Polygon", l:"Blockchain network" },
            { n:"Sumsub", l:"KYC/AML provider" },
            { n:"Monerium", l:"EU licensed EMI" },
          ].map((t,i) => (
            <div key={i} style={S.trustItem}>
              <div style={S.trustNum}>{t.n}</div>
              <div style={S.trustLabel}>{t.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}