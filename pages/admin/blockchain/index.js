import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminShell from "../../../components/admin/AdminShell";

export default function BlockchainDashboard() {
  const router = useRouter();
  const [token, setToken] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    if (!t) { router.push("/admin/login"); return; }
    setToken(t);
  }, []);

  const card = (v, l, c) => (
    <div style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"16px 20px", textAlign:"center", flex:1, minWidth:140 }}>
      <div style={{ fontSize:28, fontWeight:800, color:c }}>{v}</div>
      <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:4 }}>{l}</div>
    </div>
  );

  return (
    <AdminShell title="⛓️ Blockchain & Web3 Dashboard" subtitle="Wallet security, escrow management, multi-sig, and on-chain monitoring.">
      <div style={{ display:"flex", gap:12, marginBottom:28, flexWrap:"wrap" }}>
        {card("Polygon", "Network", "#8b5cf6")}
        {card("0", "Active Escrows", "#3b82f6")}
        {card("0", "Monitored Wallets", "#f59e0b")}
        {card("0", "Flagged Txns", "#ef4444")}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:28 }}>
        {[
          { h:"/admin/blockchain/wallet", i:"👛", l:"Wallet Security", d:"WalletConnect v2, clear signing, ownership verification, contract allowlist" },
          { h:"/admin/blockchain/escrow", i:"🏦", l:"Escrow Management", d:"Locked funds, milestone-based release, dual-approval, audit trail" },
          { h:"/admin/blockchain/multisig", i:"🔐", l:"Multi-Signature Access", d:"2 of 3 signatory for issuers, separation of duties, hardware MFA" },
          { h:"/admin/blockchain/onchain", i:"📡", l:"On-Chain Monitoring", d:"Real-time tracking, address screening, MEV protection, anomaly detection" },
        ].map((n,i) => (
          <button key={i} onClick={() => router.push(n.h)} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"20px 22px", cursor:"pointer", textAlign:"left", fontFamily:"inherit", color:"#fff", transition:"border-color .15s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor="#8b5cf640"} onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"}>
            <div style={{ fontSize:16, fontWeight:700, marginBottom:6 }}>{n.i} {n.l}</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", lineHeight:1.6 }}>{n.d}</div>
          </button>
        ))}
      </div>

      <h2 style={{ fontSize:14, fontWeight:700, color:"#F0B90B", marginBottom:12 }}>Platform Blockchain Config</h2>
      <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
        {[
          { l:"Network", v:"Polygon (Chain ID: 137)", d:"MATIC mainnet" },
          { l:"Factory Contract", v:process.env.NEXT_PUBLIC_FACTORY_ADDRESS || "Not configured", d:"Token deployment factory" },
          { l:"Yield Distributor", v:process.env.NEXT_PUBLIC_YIELD_DISTRIBUTOR || "Not configured", d:"Dividend/yield distribution" },
          { l:"Token Standard", v:"ERC-3643", d:"Compliant security token" },
          { l:"Multi-Sig Treasury", v:"3 of 5 signatures", d:"All fund movements" },
          { l:"Hot Wallet Limit", v:"EUR 50,000", d:"Auto-sweep to cold storage above this" },
          { l:"Cold Storage", v:"95%+ of assets", d:"Hardware wallets / HSM" },
          { l:"Contract Upgrade Timelock", v:"48 hours", d:"Delay before execution" },
        ].map((item, i) => (
          <div key={i} style={{ padding:"12px 20px", borderBottom:"1px solid rgba(255,255,255,0.04)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontSize:13, fontWeight:600 }}>{item.l}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:1 }}>{item.d}</div>
            </div>
            <div style={{ fontSize:13, fontWeight:600, color:"#8b5cf6", fontFamily:"monospace", maxWidth:300, textAlign:"right", wordBreak:"break-all" }}>{item.v}</div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
