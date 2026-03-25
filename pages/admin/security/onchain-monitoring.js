import { useEffect } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "../../../components/AdminSidebar";

export default function OnChainMonitoring() {
  const router = useRouter();
  useEffect(() => { if(!localStorage.getItem("adminToken")) router.push("/admin/login"); }, []);

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#0a0e14" }}>
      <AdminSidebar />
      <div style={{ marginLeft:240, padding:"28px 36px", flex:1, color:"#fff", maxWidth:1100 }}>
        <h1 style={{ fontSize:24, fontWeight:800, marginBottom:4 }}>⛓️ On-Chain Monitoring</h1>
        <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13, marginBottom:28 }}>Real-time blockchain monitoring, address screening, and MEV protection.</p>

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
          "Multi-sig treasury wallet: 3 of 5 signatures for fund movements",
          "Cold storage: 95%+ of crypto in hardware wallets/HSM",
          "Hot wallet limit: Maximum EUR 50,000 — auto-sweep to cold storage",
          "Address screening against EU/UN/OFAC sanctions lists before every transaction",
          "Chainalysis/Elliptic integration for transaction risk scoring",
          "MEV protection via Flashbots Protect private mempool",
          "Anomaly detection: Unusual token transfer patterns flagged automatically",
          "Contract interaction monitoring: Alert on unauthorized contract calls",
          "Gas price monitoring: Protection against gas manipulation attacks",
        ].map((d,i) => (
          <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:8, padding:"12px 16px", marginBottom:6, fontSize:13, color:"rgba(255,255,255,0.6)" }}>
            <span style={{ color:"#22c55e", marginRight:8 }}>✓</span>{d}
          </div>
        ))}

        <h2 style={{ fontSize:14, fontWeight:700, color:"#F0B90B", marginTop:28, marginBottom:12 }}>Alert Triggers</h2>
        {[
          "Large transfer: Token transfer above configured threshold",
          "New address: First-time interaction with platform contracts",
          "Sanctioned address: Any interaction with flagged wallet",
          "Contract anomaly: Unexpected function calls to token contracts",
          "Multi-hop: Funds moving through multiple wallets rapidly (layering)",
          "Failed transactions: Spike in failed txns (possible attack indicator)",
        ].map((d,i) => (
          <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:8, padding:"12px 16px", marginBottom:6, fontSize:13, color:"rgba(255,255,255,0.6)" }}>
            <span style={{ color:"#ef4444", marginRight:8 }}>●</span>{d}
          </div>
        ))}
      </div>
    </div>
  );
}
