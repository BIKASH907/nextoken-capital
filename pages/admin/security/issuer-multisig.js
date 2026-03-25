import { useEffect } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "../../../components/AdminSidebar";

export default function IssuerMultiSig() {
  const router = useRouter();
  useEffect(() => { if(!localStorage.getItem("adminToken")) router.push("/admin/login"); }, []);

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#0a0e14" }}>
      <AdminSidebar />
      <div style={{ marginLeft:240, padding:"28px 36px", flex:1, color:"#fff", maxWidth:1100 }}>
        <h1 style={{ fontSize:24, fontWeight:800, marginBottom:4 }}>🔐 Issuer Multi-Signatory Access</h1>
        <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13, marginBottom:28 }}>Require 2 of 3 authorized signatories for critical issuer actions.</p>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:28 }}>
          {[
            { l:"Required Signatures", v:"2 of 3", c:"#F0B90B" },
            { l:"Active Issuers", v:"0", c:"#3b82f6" },
            { l:"Pending Actions", v:"0", c:"#f59e0b" },
          ].map((s,i) => (
            <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"16px", textAlign:"center" }}>
              <div style={{ fontSize:28, fontWeight:800, color:s.c }}>{s.v}</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginTop:4 }}>{s.l}</div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize:14, fontWeight:700, color:"#F0B90B", marginBottom:12 }}>Actions Requiring Multi-Sig</h2>
        {[
          "Token issuance: Creating and deploying new security tokens",
          "Distribution changes: Modifying token distribution parameters",
          "Fund withdrawals: Any withdrawal from issuer escrow account",
          "Contract upgrades: Upgrading token smart contracts",
          "Fee changes: Modifying platform fees for the issuance",
          "Investor whitelist changes: Adding/removing from transfer whitelist",
        ].map((d,i) => (
          <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:8, padding:"12px 16px", marginBottom:6, fontSize:13, color:"rgba(255,255,255,0.6)" }}>
            <span style={{ color:"#f59e0b", marginRight:8 }}>⚡</span>{d}
          </div>
        ))}

        <h2 style={{ fontSize:14, fontWeight:700, color:"#F0B90B", marginTop:28, marginBottom:12 }}>Signatory Configuration</h2>
        {[
          "Mandatory hardware MFA: YubiKey/FIDO2 required for ALL issuer accounts",
          "Authorized representative list: Only pre-approved individuals can access issuer dashboard",
          "IP restriction: Issuer panel locked to corporate IP range",
          "Activity notifications: Email + SMS alerts for every action on the issuer account",
          "Session recording: All issuer admin sessions logged with full action replay",
          "Separation of duties: Same person cannot both initiate and approve an action",
        ].map((d,i) => (
          <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:8, padding:"12px 16px", marginBottom:6, fontSize:13, color:"rgba(255,255,255,0.6)" }}>
            <span style={{ color:"#22c55e", marginRight:8 }}>✓</span>{d}
          </div>
        ))}
      </div>
    </div>
  );
}
