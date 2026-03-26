import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminShell from "../../components/admin/AdminShell";

const STATUSES = [
  { key: "draft", label: "Draft", color: "#6b7280", icon: "📝" },
  { key: "pending_compliance", label: "Pending Compliance", color: "#8b5cf6", icon: "🪪" },
  { key: "compliance_approved", label: "Compliance Approved", color: "#8b5cf6", icon: "✅" },
  { key: "pending_finance", label: "Pending Finance", color: "#f59e0b", icon: "💰" },
  { key: "finance_approved", label: "Finance Approved", color: "#f59e0b", icon: "✅" },
  { key: "pending_final", label: "Pending Final Approval", color: "#ef4444", icon: "👑" },
  { key: "live", label: "Live", color: "#22c55e", icon: "🟢" },
  { key: "rejected", label: "Rejected", color: "#ef4444", icon: "❌" },
];

export default function AssetPipeline() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [employee, setEmployee] = useState(null);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    if (!t) { router.push("/admin/login"); return; }
    setToken(t);
    try { setEmployee(JSON.parse(localStorage.getItem("adminEmployee"))); } catch(e) {}
  }, []);

  useEffect(() => { if (token) load(); }, [token]);

  const headers = { Authorization: "Bearer " + token, "Content-Type": "application/json" };

  const load = () => {
    fetch("/api/admin/assets", { headers }).then(r => r.json()).then(d => {
      if (d.assets) setAssets(d.assets);
    }).finally(() => setLoading(false));
  };

  const doAction = async (assetId, action, reason) => {
    setMsg("");
    const res = await fetch("/api/admin/assets/approve", { method: "POST", headers, body: JSON.stringify({ assetId, action, reason }) });
    const data = await res.json();
    if (!res.ok) { setMsg("❌ " + data.error); return; }
    setMsg("✅ " + data.message);
    load();
  };

  const role = employee?.role || "support_admin";
  const filtered = filter === "all" ? assets : assets.filter(a => (a.approvalStatus || a.status || "draft") === filter);

  const getStatus = (a) => a.approvalStatus || a.status || "draft";
  const getStatusInfo = (s) => STATUSES.find(st => st.key === s) || STATUSES[0];

  const canApprove = (status) => {
    if (role === "super_admin") return true;
    if (status === "pending_compliance" && role === "compliance_admin") return true;
    if (status === "pending_finance" && role === "finance_admin") return true;
    return false;
  };

  const canReject = (status) => {
    if (status === "pending_compliance" && (role === "compliance_admin" || role === "super_admin")) return true;
    if (status === "pending_finance" && (role === "finance_admin" || role === "super_admin")) return true;
    if (status === "pending_final" && role === "super_admin") return true;
    return false;
  };

  // Count per status
  const counts = {};
  assets.forEach(a => { const s = getStatus(a); counts[s] = (counts[s] || 0) + 1; });

  return (
    <AdminShell title="📋 Asset Approval Pipeline" subtitle="Multi-stage review: Draft → Compliance → Finance → Final → Live">

      {/* Pipeline Visual */}
      <div style={{ display:"flex", gap:4, marginBottom:24, overflowX:"auto", paddingBottom:8 }}>
        {STATUSES.filter(s => s.key !== "compliance_approved" && s.key !== "finance_approved").map((s, i) => (
          <div key={s.key} style={{ display:"flex", alignItems:"center" }}>
            <div onClick={() => setFilter(s.key)} style={{
              padding:"8px 14px", borderRadius:8, cursor:"pointer", textAlign:"center", minWidth:90, transition:"all .15s",
              background: filter === s.key ? s.color + "20" : "#161b22",
              border: "1px solid " + (filter === s.key ? s.color + "40" : "rgba(255,255,255,0.06)"),
            }}>
              <div style={{ fontSize:18 }}>{s.icon}</div>
              <div style={{ fontSize:10, fontWeight:700, color: s.color, marginTop:2 }}>{s.label}</div>
              <div style={{ fontSize:16, fontWeight:800, color:"#fff", marginTop:2 }}>{counts[s.key] || 0}</div>
            </div>
            {i < 5 && <div style={{ color:"rgba(255,255,255,0.15)", fontSize:18, margin:"0 2px" }}>→</div>}
          </div>
        ))}
        <div style={{ marginLeft:"auto" }}>
          <button onClick={() => setFilter("all")} style={{ padding:"8px 16px", borderRadius:8, background: filter==="all" ? "#F0B90B15" : "#161b22", border: filter==="all" ? "1px solid #F0B90B40" : "1px solid rgba(255,255,255,0.06)", color: filter==="all" ? "#F0B90B" : "rgba(255,255,255,0.4)", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>All ({assets.length})</button>
        </div>
      </div>

      {msg && <div style={{ background: msg.startsWith("✅") ? "rgba(34,197,94,0.1)" : "rgba(255,77,77,0.1)", border: "1px solid " + (msg.startsWith("✅") ? "rgba(34,197,94,0.2)" : "rgba(255,77,77,0.2)"), borderRadius:8, padding:"10px 14px", fontSize:13, color: msg.startsWith("✅") ? "#22c55e" : "#ff6b6b", marginBottom:16 }}>{msg}</div>}

      {/* Rejection Flow Info */}
      <div style={{ background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.15)", borderRadius:10, padding:"12px 18px", marginBottom:20, fontSize:12, color:"rgba(255,255,255,0.45)", lineHeight:1.7 }}>
        <strong style={{ color:"#ef4444" }}>Rejection Flow:</strong> Compliance rejects → Issuer fixes and resubmits · Finance rejects → Back to Compliance · Super Admin rejects → Back to Compliance · Every rejection requires a reason and is logged.
      </div>

      {/* Asset List */}
      {loading ? <div style={{ textAlign:"center", color:"rgba(255,255,255,0.3)", padding:40 }}>Loading assets...</div>
      : filtered.length === 0 ? (
        <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", padding:40, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>No assets in this stage</div>
      ) : filtered.map(asset => {
        const status = getStatus(asset);
        const si = getStatusInfo(status);
        return (
          <div key={asset._id} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:20, marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <div>
                <div style={{ fontSize:16, fontWeight:700 }}>{asset.name || "Unnamed Asset"}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>
                  {asset.assetType} · {asset.issuerName || "—"} · Created {asset.createdAt ? new Date(asset.createdAt).toLocaleDateString() : "—"}
                </div>
              </div>
              <span style={{ fontSize:11, padding:"4px 12px", borderRadius:6, background:si.color+"15", color:si.color, fontWeight:700, border:"1px solid "+si.color+"25" }}>
                {si.icon} {si.label}
              </span>
            </div>

            {/* Rejection reason if rejected */}
            {(status === "rejected" || asset.rejectionReason) && (
              <div style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.15)", borderRadius:8, padding:"10px 14px", marginBottom:12, fontSize:12 }}>
                <strong style={{ color:"#ef4444" }}>Rejection Reason:</strong> <span style={{ color:"rgba(255,255,255,0.6)" }}>{asset.rejectionReason || "No reason given"}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {/* Approve */}
              {canApprove(status) && status !== "live" && status !== "rejected" && (
                <button onClick={() => doAction(asset._id, "approve")} style={{ padding:"6px 16px", borderRadius:6, background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.2)", color:"#22c55e", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                  ✅ Approve
                </button>
              )}

              {/* Reject */}
              {canReject(status) && (
                <button onClick={() => {
                  const r = prompt("Enter rejection reason (required):");
                  if (r && r.trim()) doAction(asset._id, "reject", r.trim());
                }} style={{ padding:"6px 16px", borderRadius:6, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", color:"#ef4444", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                  ❌ Reject
                </button>
              )}

              {/* Resubmit (from rejected) */}
              {status === "rejected" && (role === "compliance_admin" || role === "super_admin") && (
                <button onClick={() => doAction(asset._id, "resubmit")} style={{ padding:"6px 16px", borderRadius:6, background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.2)", color:"#3b82f6", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                  🔄 Resubmit for Review
                </button>
              )}

              {/* Submit draft */}
              {status === "draft" && (
                <button onClick={() => doAction(asset._id, "approve")} style={{ padding:"6px 16px", borderRadius:6, background:"rgba(240,185,11,0.1)", border:"1px solid rgba(240,185,11,0.2)", color:"#F0B90B", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                  📤 Submit for Compliance Review
                </button>
              )}
            </div>

            {/* Approval History */}
            {asset.approvalHistory && asset.approvalHistory.length > 0 && (
              <div style={{ marginTop:12, borderTop:"1px solid rgba(255,255,255,0.04)", paddingTop:10 }}>
                <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.25)", marginBottom:6 }}>APPROVAL HISTORY</div>
                {asset.approvalHistory.slice(-5).reverse().map((h, i) => {
                  const actionColor = h.action === "approved" ? "#22c55e" : h.action === "rejected" ? "#ef4444" : h.action === "resubmitted" ? "#3b82f6" : "#6b7280";
                  return (
                    <div key={i} style={{ fontSize:11, color:"rgba(255,255,255,0.35)", padding:"3px 0" }}>
                      <span style={{ color: actionColor, fontWeight:700 }}>{h.action}</span> by {h.byName} ({h.byRole}) · {h.from.replace(/_/g," ")} → {h.to.replace(/_/g," ")} · {new Date(h.at).toLocaleString()}
                      {h.reason && <span style={{ color:"#ef4444" }}> — {h.reason}</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </AdminShell>
  );
}
