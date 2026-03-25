import { useEffect } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "../../../components/AdminSidebar";

export default function EscrowManagement() {
  const router = useRouter();
  useEffect(() => { if(!localStorage.getItem("adminToken")) router.push("/admin/login"); }, []);

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#0a0e14" }}>
      <AdminSidebar />
      <div style={{ marginLeft:240, padding:"28px 36px", flex:1, color:"#fff", maxWidth:1100 }}>
        <h1 style={{ fontSize:24, fontWeight:800, marginBottom:4 }}>🏦 Escrow and Fund Management</h1>
        <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13, marginBottom:28 }}>Escrow integration, milestone-based release, segregated accounts.</p>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:12, marginBottom:28 }}>
          {[
            { l:"Active Escrows", v:"0", c:"#3b82f6" },
            { l:"Total Held", v:"€0", c:"#F0B90B" },
            { l:"Released", v:"€0", c:"#22c55e" },
            { l:"Pending Release", v:"0", c:"#f59e0b" },
          ].map((s,i) => (
            <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"14px", textAlign:"center" }}>
              <div style={{ fontSize:24, fontWeight:800, color:s.c }}>{s.v}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:4 }}>{s.l}</div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize:14, fontWeight:700, color:"#F0B90B", marginBottom:12 }}>Escrow Flow</h2>
        {[
          "1. Issuer creates token offering with funding threshold and milestones",
          "2. Investor funds deposited into segregated escrow account (per-issuance)",
          "3. Funds held until minimum funding threshold is met",
          "4. If threshold not met by deadline: Full automatic refund to all investors",
          "5. If threshold met: Funds locked, tokens distributed to investors",
          "6. Milestone-based release: Issuer submits milestone completion evidence",
          "7. Platform compliance reviews milestone, triggers dual-approval",
          "8. Approved funds released to issuer; rejected funds remain in escrow",
        ].map((d,i) => (
          <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:8, padding:"12px 16px", marginBottom:6, fontSize:13, color:"rgba(255,255,255,0.6)", lineHeight:1.7 }}>
            <span style={{ color:"#3b82f6", marginRight:8 }}>→</span>{d}
          </div>
        ))}

        <h2 style={{ fontSize:14, fontWeight:700, color:"#F0B90B", marginTop:28, marginBottom:12 }}>Security Controls</h2>
        {[
          "Segregated accounts: Each issuance uses a separate bank/wallet account",
          "Dual-approval: Withdrawal requires issuer + platform compliance sign-off",
          "Real-time treasury dashboard: Live view of funds raised, disbursed, remaining",
          "Automated reporting: Tamper-proof financial records for regulators",
          "Asset valuation updates: Independent valuation required at defined intervals",
          "Investor transparency: Investors can see exactly where their funds are",
        ].map((d,i) => (
          <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:8, padding:"12px 16px", marginBottom:6, fontSize:13, color:"rgba(255,255,255,0.6)" }}>
            <span style={{ color:"#22c55e", marginRight:8 }}>✓</span>{d}
          </div>
        ))}
      </div>
    </div>
  );
}
