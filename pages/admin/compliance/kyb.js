import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminShell from "../../../../components/admin/AdminShell";

export default function KYBQueue() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [tab, setTab] = useState("pending");

  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    if (!t) { router.push("/admin/login"); return; }
    setToken(t);
  }, []);

  const stages = [
    { id:"pending", label:"Pending", count:0, color:"#f59e0b" },
    { id:"review", label:"In Review", count:0, color:"#8b5cf6" },
    { id:"approved", label:"Approved", count:0, color:"#22c55e" },
    { id:"rejected", label:"Rejected", count:0, color:"#ef4444" },
  ];

  return (
    <AdminShell title="🏛️ KYB — Business Entity Verification" subtitle="Know Your Business: Corporate verification for issuers and institutional investors">

      {/* Stats */}
      <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap" }}>
        {stages.map((s,i) => (
          <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"14px 20px", minWidth:140 }}>
            <div style={{ fontSize:26, fontWeight:800, color:s.color }}>{s.count}</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Navigate to KYC */}
      <div style={{ display:"flex", gap:12, marginBottom:20 }}>
        <button onClick={() => router.push("/admin/kyc")} style={{ background:"rgba(59,130,246,0.08)", border:"1px solid rgba(59,130,246,0.2)", borderRadius:8, padding:"10px 18px", color:"#3b82f6", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
          🪪 Switch to KYC (Individual Verification) →
        </button>
      </div>

      {/* Tab Filter */}
      <div style={{ display:"flex", gap:6, marginBottom:20 }}>
        {stages.map(s => (
          <button key={s.id} onClick={() => setTab(s.id)} style={{
            padding:"6px 16px", borderRadius:6, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit",
            background: tab===s.id ? s.color+"15" : "rgba(255,255,255,0.04)",
            color: tab===s.id ? s.color : "rgba(255,255,255,0.4)",
            border: tab===s.id ? "1px solid "+s.color+"30" : "1px solid rgba(255,255,255,0.06)",
          }}>{s.label}</button>
        ))}
      </div>

      {/* Empty State */}
      <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", padding:40, textAlign:"center", color:"rgba(255,255,255,0.3)", marginBottom:28 }}>
        No business entities in {tab} stage yet
      </div>

      {/* KYB Checklist */}
      <h3 style={{ fontSize:14, fontWeight:700, color:"#F0B90B", marginBottom:12 }}>KYB Verification Checklist</h3>

      {[
        { section:"Corporate Identity", items:[
          "Certificate of incorporation / company registration",
          "Articles of association / memorandum",
          "Registered office address verification",
          "Business license (if applicable)",
          "Company structure / org chart",
        ]},
        { section:"Ultimate Beneficial Owners (UBOs)", items:[
          "Identify all UBOs with 25%+ ownership",
          "KYC on each UBO (ID, proof of address, selfie)",
          "PEP screening on all UBOs",
          "Sanctions screening on all UBOs",
          "Source of wealth documentation for UBOs",
        ]},
        { section:"Directors & Authorized Signatories", items:[
          "KYC on all directors with signing authority",
          "Board resolution authorizing the account",
          "Power of attorney (if applicable)",
          "PEP and sanctions screening on all directors",
        ]},
        { section:"Financial Verification", items:[
          "Audited financial statements (last 3 years)",
          "Bank reference letter",
          "Source of funds documentation",
          "Tax identification number (TIN)",
          "VAT registration (if EU-based)",
        ]},
        { section:"Compliance & Legal", items:[
          "Anti-money laundering policy review",
          "Sanctions compliance declaration",
          "Data processing agreement (GDPR)",
          "MiCA compliance assessment (if issuer)",
          "Legal opinion on tokenization (if issuing tokens)",
        ]},
      ].map((sec,i) => (
        <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"16px 20px", marginBottom:12 }}>
          <div style={{ fontSize:14, fontWeight:700, color:"#8b5cf6", marginBottom:10 }}>{sec.section}</div>
          {sec.items.map((item,j) => (
            <div key={j} style={{ fontSize:13, color:"rgba(255,255,255,0.5)", padding:"5px 0", display:"flex", gap:8 }}>
              <span style={{ color:"rgba(255,255,255,0.2)" }}>☐</span>{item}
            </div>
          ))}
        </div>
      ))}

      {/* Risk Classification */}
      <h3 style={{ fontSize:14, fontWeight:700, color:"#F0B90B", marginTop:28, marginBottom:12 }}>Risk Classification</h3>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
        {[
          { level:"Low Risk", desc:"EU-registered, regulated entity, clean ownership, audited financials", color:"#22c55e" },
          { level:"Medium Risk", desc:"Non-EU but cooperative jurisdiction, complex ownership, limited financials", color:"#f59e0b" },
          { level:"High Risk", desc:"High-risk jurisdiction, PEP involvement, layered ownership, no audited financials", color:"#ef4444" },
        ].map((r,i) => (
          <div key={i} style={{ background:"#161b22", border:"1px solid "+r.color+"20", borderRadius:10, padding:"14px 18px" }}>
            <div style={{ fontSize:14, fontWeight:700, color:r.color, marginBottom:6 }}>{r.level}</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", lineHeight:1.6 }}>{r.desc}</div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
