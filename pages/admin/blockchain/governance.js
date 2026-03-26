import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminShell from "../../../components/admin/AdminShell";

export default function Governance() {
  const router = useRouter();
  useEffect(() => { if(!localStorage.getItem("adminToken")) router.push("/admin/login"); }, []);

  const features = [
    { t:"Proxy Pattern (UUPS)", d:"All token contracts use upgradeable proxy. Upgrade logic without redeploying.", s:"Active", c:"#22c55e" },
    { t:"Emergency Pause", d:"Circuit breaker: pause all token transfers instantly. Requires Super Admin.", s:"Ready", c:"#22c55e" },
    { t:"Timelock Controller", d:"48-hour delay between proposing and executing contract upgrades.", s:"Enforced", c:"#22c55e" },
    { t:"Multi-Sig Upgrades", d:"Contract upgrades require 2-of-3 admin signatures.", s:"Enforced", c:"#22c55e" },
  ];

  const governance = [
    { t:"Upgrade Proposal", d:"Any admin can propose. Enters 48-hour timelock. Requires 2-of-3 to execute.", st:"0 pending" },
    { t:"Parameter Changes", d:"Fee rates, limits, whitelist rules. Dual-approval + timelock.", st:"0 pending" },
    { t:"Emergency Actions", d:"Pause, freeze accounts, blacklist addresses. Super Admin only, instant.", st:"0 active" },
  ];

  return (
    <AdminShell title="Governance Layer" subtitle="Smart contract upgrade control, emergency pause, parameter management.">
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:28 }}>
        {features.map((f,i) => (
          <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"18px 20px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ fontSize:15, fontWeight:700 }}>{f.t}</span>
              <span style={{ fontSize:10, padding:"3px 10px", borderRadius:4, background:f.c+"15", color:f.c, fontWeight:700 }}>{f.s}</span>
            </div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", lineHeight:1.7 }}>{f.d}</div>
          </div>
        ))}
      </div>
      <h2 style={{ fontSize:14, fontWeight:700, color:"#F0B90B", marginBottom:12 }}>Governance Actions</h2>
      {governance.map((g,i) => (
        <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:8, padding:"14px 20px", marginBottom:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div><div style={{ fontSize:14, fontWeight:600 }}>{g.t}</div><div style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>{g.d}</div></div>
          <span style={{ fontSize:12, color:"rgba(255,255,255,0.5)", fontWeight:600 }}>{g.st}</span>
        </div>
      ))}
    </AdminShell>
  );
}
