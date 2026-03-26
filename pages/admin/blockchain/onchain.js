import { useEffect } from "react";
import { useRouter } from "next/router";
import AdminShell from "../../../components/admin/AdminShell";

export default function OnChainMonitoring() {
  const router = useRouter();
  useEffect(() => { if(!localStorage.getItem("adminToken")) router.push("/admin/login"); }, []);

  return (
    <AdminShell title="📡 On-Chain Monitoring" subtitle="Real-time blockchain tracking, address screening, MEV protection.">
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:28 }}>
        {[
          { l:"Network", v:"Polygon", c:"#8b5cf6" },
          { l:"Monitored Wallets", v:"0", c:"#3b82f6" },
          { l:"Flagged Txns", v:"0", c:"#ef4444" },
        ].map((s,i) => (
          <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"16px", textAlign:"center" }}>
            <div style={{ fontSize:24, fontWeight:800, color:s.c }}>{s.v}</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginTop:4 }}>{s.l}</div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize:14, fontWeight:700, color:"#F0B90B", marginBottom:12 }}>Monitoring Features</h2>
      {[
        "Real-time tracking of all platform wallet activity on Polygon",
        "Multi-sig treasury: 3 of 5 signatures for fund movements",
        "Cold storage: 95%+ of crypto in hardware wallets/HSM",
        "Hot wallet limit: EUR 50,000 max — auto-sweep to cold",
        "Address screening: EU/UN/OFAC sanctions check on every txn",
        "Chainalysis/Elliptic integration for risk scoring",
        "MEV protection via Flashbots Protect private mempool",
        "Anomaly detection: Unusual transfer patterns flagged",
        "Contract interaction monitoring: Unauthorized calls alerted",
        "Gas price monitoring: Protection against manipulation",
      ].map((d,i) => (
        <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:8, padding:"12px 16px", marginBottom:6, fontSize:13, color:"rgba(255,255,255,0.6)" }}>
          <span style={{ color:"#22c55e", marginRight:8 }}>✓</span>{d}
        </div>
      ))}

      <h2 style={{ fontSize:14, fontWeight:700, color:"#ef4444", marginTop:28, marginBottom:12 }}>Alert Triggers</h2>
      {[
        "Large transfer above configured threshold",
        "First-time interaction with platform contracts",
        "Any interaction with sanctioned wallet address",
        "Unexpected function calls to token contracts",
        "Multi-hop: Funds through multiple wallets rapidly",
        "Spike in failed transactions (possible attack)",
      ].map((d,i) => (
        <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:8, padding:"12px 16px", marginBottom:6, fontSize:13, color:"rgba(255,255,255,0.6)" }}>
          <span style={{ color:"#ef4444", marginRight:8 }}>●</span>{d}
        </div>
      ))}
    </AdminShell>
  );
}
