#!/bin/bash
# Creates separate KYC and KYB pages
# Run: chmod +x fix-kyc.sh && ./fix-kyc.sh
set -e

echo "  Creating KYC & KYB pages..."

# ── KYC Page (Individual Investor Verification) ──
cat > pages/admin/kyc.js << 'KYCEOF'
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminShell from "../../components/admin/AdminShell";

export default function KYCQueue() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    if (!t) { router.push("/admin/login"); return; }
    setToken(t);
  }, []);

  useEffect(() => {
    if (!token) return;
    fetch("/api/admin/users", { headers: { Authorization: "Bearer " + token } })
      .then(r => r.json())
      .then(d => { if (d.users) setUsers(d.users); })
      .finally(() => setLoading(false));
  }, [token]);

  const kycUsers = users.filter(u => {
    if (filter === "all") return true;
    if (filter === "pending") return u.kycStatus === "pending" || !u.kycStatus;
    if (filter === "approved") return u.kycStatus === "approved";
    if (filter === "rejected") return u.kycStatus === "rejected";
    if (filter === "review") return u.kycStatus === "in_review";
    return true;
  });

  const counts = {
    all: users.length,
    pending: users.filter(u => u.kycStatus === "pending" || !u.kycStatus).length,
    review: users.filter(u => u.kycStatus === "in_review").length,
    approved: users.filter(u => u.kycStatus === "approved").length,
    rejected: users.filter(u => u.kycStatus === "rejected").length,
  };

  const statusColor = (s) => {
    if (s === "approved") return "#22c55e";
    if (s === "rejected") return "#ef4444";
    if (s === "in_review") return "#f59e0b";
    return "#6b7280";
  };

  return (
    <AdminShell title="🪪 KYC — Individual Investor Verification" subtitle="Know Your Customer: Identity verification for individual investors">

      {/* Stats */}
      <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap" }}>
        {[
          { l:"Total Investors", v:counts.all, c:"#3b82f6" },
          { l:"Pending Review", v:counts.pending, c:"#f59e0b" },
          { l:"In Review", v:counts.review, c:"#8b5cf6" },
          { l:"Approved", v:counts.approved, c:"#22c55e" },
          { l:"Rejected", v:counts.rejected, c:"#ef4444" },
        ].map((s,i) => (
          <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"14px 20px", minWidth:130 }}>
            <div style={{ fontSize:26, fontWeight:800, color:s.c }}>{s.v}</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:2 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div style={{ display:"flex", gap:6, marginBottom:20 }}>
        {["all","pending","review","approved","rejected"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding:"6px 16px", borderRadius:6, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit", textTransform:"capitalize",
            background: filter===f ? "#F0B90B15" : "rgba(255,255,255,0.04)",
            color: filter===f ? "#F0B90B" : "rgba(255,255,255,0.4)",
            border: filter===f ? "1px solid #F0B90B30" : "1px solid rgba(255,255,255,0.06)",
          }}>{f} ({counts[f] || 0})</button>
        ))}
      </div>

      {/* Navigate to KYB */}
      <div style={{ display:"flex", gap:12, marginBottom:20 }}>
        <button onClick={() => router.push("/admin/kyb")} style={{ background:"rgba(139,92,246,0.08)", border:"1px solid rgba(139,92,246,0.2)", borderRadius:8, padding:"10px 18px", color:"#8b5cf6", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
          🏛️ Switch to KYB (Business Verification) →
        </button>
      </div>

      {/* User Table */}
      <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:"180px 220px 100px 100px 140px", padding:"10px 20px", background:"rgba(255,255,255,0.03)", fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:.5 }}>
          <span>Name</span><span>Email</span><span>KYC Status</span><span>Risk Level</span><span>Submitted</span>
        </div>
        {loading ? (
          <div style={{ padding:30, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>Loading investors...</div>
        ) : kycUsers.length === 0 ? (
          <div style={{ padding:30, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>No investors in this filter</div>
        ) : kycUsers.slice(0,50).map((u,i) => (
          <div key={u._id || i} style={{ display:"grid", gridTemplateColumns:"180px 220px 100px 100px 140px", padding:"12px 20px", borderBottom:"1px solid rgba(255,255,255,0.04)", fontSize:13, alignItems:"center" }}>
            <span style={{ fontWeight:600 }}>{u.firstName || u.name || "—"} {u.lastName || ""}</span>
            <span style={{ color:"rgba(255,255,255,0.5)", fontSize:12 }}>{u.email}</span>
            <span style={{ fontSize:11, fontWeight:700, color:statusColor(u.kycStatus), textTransform:"capitalize" }}>
              ● {u.kycStatus || "pending"}
            </span>
            <span style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>{u.riskLevel || "standard"}</span>
            <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)" }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}</span>
          </div>
        ))}
      </div>

      {/* KYC Requirements */}
      <div style={{ marginTop:28 }}>
        <h3 style={{ fontSize:14, fontWeight:700, color:"#F0B90B", marginBottom:12 }}>KYC Requirements (Individual Investors)</h3>
        {[
          "Government-issued ID (passport, national ID, or driving license)",
          "Proof of address (utility bill or bank statement, less than 3 months old)",
          "Selfie/liveness check for identity confirmation",
          "Source of funds declaration for investments above EUR 15,000",
          "PEP (Politically Exposed Person) screening — automated",
          "Sanctions screening (EU, UN, OFAC) — automated on every transaction",
          "Ongoing monitoring: Re-verification triggered by risk events",
          "Enhanced Due Diligence for high-risk investors (PEPs, high-risk jurisdictions)",
        ].map((d,i) => (
          <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:8, padding:"10px 16px", marginBottom:5, fontSize:13, color:"rgba(255,255,255,0.6)" }}>
            <span style={{ color:"#22c55e", marginRight:8 }}>✓</span>{d}
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
KYCEOF

echo "  ✓ KYC page created"

# ── KYB Page (Business Verification) ──
cat > pages/admin/kyb.js << 'KYBEOF'
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminShell from "../../components/admin/AdminShell";

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
KYBEOF

echo "  ✓ KYB page created"

# ── Update RBAC nav to include KYB ──
sed -i 's|{ href:"/admin/kyc", label:"KYC/KYB Queue", icon:"🪪" }|{ href:"/admin/kyc", label:"KYC (Individual)", icon:"🪪" },\n      { href:"/admin/kyb", label:"KYB (Business)", icon:"🏛️" }|g' lib/rbac.js

echo "  ✓ Sidebar updated with KYC + KYB links"
echo ""
echo "  ✅ Done! Run:"
echo "     git add -A && git commit -m 'feat: separate KYC and KYB pages' && git push"
echo "     npx vercel --prod"
