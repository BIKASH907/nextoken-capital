import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminShell from "../../components/admin/AdminShell";

const STAGES = [
  { key:"pending", label:"Pending Compliance", color:"#8b5cf6", icon:"🪪" },
  { key:"compliance_approved", label:"Pending Finance", color:"#f59e0b", icon:"💰" },
  { key:"finance_approved", label:"Pending Final", color:"#ef4444", icon:"👑" },
  { key:"approved", label:"Approved (Live)", color:"#22c55e", icon:"✅" },
];

const STATUS_INFO = {
  pending: { label:"Pending Compliance", color:"#8b5cf6" },
  compliance_approved: { label:"Pending Finance", color:"#f59e0b" },
  finance_approved: { label:"Pending Final Approval", color:"#ef4444" },
  approved: { label:"Approved", color:"#22c55e" },
  rejected_compliance: { label:"Rejected (Compliance)", color:"#ef4444" },
};

const CATEGORIES = [
  { key:"kyc", label:"KYC", icon:"🪪", color:"#8b5cf6" },
  { key:"financial", label:"Financial", icon:"💰", color:"#f59e0b" },
  { key:"technical", label:"Technical", icon:"🔧", color:"#3b82f6" },
  { key:"legal", label:"Legal", icon:"⚖️", color:"#8b5cf6" },
  { key:"valuation", label:"Valuation", icon:"📊", color:"#f59e0b" },
  { key:"other", label:"Other", icon:"📁", color:"#6b7280" },
];

export default function IssuerDocuments() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [employee, setEmployee] = useState(null);
  const [data, setData] = useState({ documents: [], stats: {} });
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [form, setForm] = useState({ issuerName:"", assetName:"", fileName:"", fileUrl:"", category:"kyc" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    if (!t) { router.push("/admin/login"); return; }
    setToken(t);
    try { setEmployee(JSON.parse(localStorage.getItem("adminEmployee"))); } catch(e) {}
  }, []);

  useEffect(() => { if (token) load(); }, [token]);

  const headers = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
  const load = () => { fetch("/api/admin/issuer-documents", { headers }).then(r => r.json()).then(setData).finally(() => setLoading(false)); };

  const doAction = async (action, documentId, extra) => {
    setMsg("");
    const res = await fetch("/api/admin/issuer-documents", { method: "POST", headers, body: JSON.stringify({ action, documentId, ...extra }) });
    const d = await res.json();
    setMsg(res.ok ? "✅ " + d.message : "❌ " + d.error);
    load();
  };

  const upload = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/admin/issuer-documents", { method: "POST", headers, body: JSON.stringify({ action: "upload", ...form }) });
    const d = await res.json();
    if (res.ok) { setMsg("✅ " + d.message); setShowUpload(false); load(); } else { setMsg("❌ " + d.error); }
  };

  const s = data.stats || {};
  const role = employee?.role || "support_admin";
  const inp = { width:"100%", background:"#0a0e14", border:"1px solid rgba(255,255,255,0.1)", borderRadius:6, padding:"9px 12px", color:"#fff", fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:"inherit" };

  // What can this role do?
  const canApprove = (status) => {
    if (role === "compliance_admin" && status === "pending") return true;
    if (role === "finance_admin" && status === "compliance_approved") return true;
    if (role === "super_admin" && status === "finance_approved") return true;
    return false;
  };
  const canReject = canApprove; // same stages
  const canComment = () => role !== "audit";

  return (
    <AdminShell title="📄 Issuer Document Pipeline" subtitle="Strict review: Compliance → Finance → Super Admin Final Approval. Cannot skip stages.">

      {/* Pipeline Visual */}
      <div style={{ display:"flex", gap:4, marginBottom:24 }}>
        {STAGES.map((st, i) => (
          <div key={st.key} style={{ display:"flex", alignItems:"center" }}>
            <div style={{ padding:"10px 16px", borderRadius:8, background:st.color+"15", border:"1px solid "+st.color+"30", textAlign:"center", minWidth:120 }}>
              <div style={{ fontSize:16 }}>{st.icon}</div>
              <div style={{ fontSize:10, fontWeight:700, color:st.color, marginTop:2 }}>{st.label}</div>
              <div style={{ fontSize:18, fontWeight:800, color:"#fff", marginTop:2 }}>{s[st.key === "pending" ? "pending" : st.key === "compliance_approved" ? "complianceApproved" : st.key === "finance_approved" ? "financeApproved" : "approved"] || 0}</div>
            </div>
            {i < 3 && <div style={{ color:"rgba(255,255,255,0.15)", fontSize:18, margin:"0 4px" }}>→</div>}
          </div>
        ))}
      </div>

      {/* Rules */}
      <div style={{ background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.15)", borderRadius:10, padding:"12px 18px", marginBottom:20, fontSize:12, color:"rgba(255,255,255,0.5)", lineHeight:1.7 }}>
        <strong style={{ color:"#ef4444" }}>Pipeline Rules:</strong> Compliance approves/rejects first → Finance approves/rejects second → Super Admin gives FINAL approval. <strong style={{ color:"#fff" }}>Cannot skip stages.</strong> Rejections go back to previous stage.
      </div>

      {msg && <div style={{ background:msg.startsWith("✅")?"rgba(34,197,94,0.1)":"rgba(255,77,77,0.1)", border:"1px solid "+(msg.startsWith("✅")?"rgba(34,197,94,0.2)":"rgba(255,77,77,0.2)"), borderRadius:8, padding:"10px 14px", fontSize:13, color:msg.startsWith("✅")?"#22c55e":"#ff6b6b", marginBottom:16 }}>{msg}</div>}

      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
        <div style={{ fontSize:14, fontWeight:700 }}>Documents ({(data.documents||[]).length})</div>
        {(role === "super_admin" || role === "compliance_admin") && (
          <button onClick={() => setShowUpload(!showUpload)} style={{ background:"#F0B90B", color:"#000", border:"none", padding:"8px 18px", borderRadius:7, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>+ Upload</button>
        )}
      </div>

      {/* Upload Form */}
      {showUpload && (
        <div style={{ background:"#161b22", border:"1px solid rgba(240,185,11,0.2)", borderRadius:12, padding:20, marginBottom:16 }}>
          <form onSubmit={upload} style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <div><label style={{ display:"block", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>ISSUER NAME</label><input value={form.issuerName} onChange={e => setForm({...form, issuerName:e.target.value})} required style={inp} /></div>
            <div><label style={{ display:"block", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>ASSET NAME</label><input value={form.assetName} onChange={e => setForm({...form, assetName:e.target.value})} style={inp} /></div>
            <div><label style={{ display:"block", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>CATEGORY</label><select value={form.category} onChange={e => setForm({...form, category:e.target.value})} style={{...inp, cursor:"pointer"}}>{CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.icon} {c.label}</option>)}</select></div>
            <div><label style={{ display:"block", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>FILE NAME</label><input value={form.fileName} onChange={e => setForm({...form, fileName:e.target.value})} required style={inp} /></div>
            <div style={{ gridColumn:"span 2" }}><label style={{ display:"block", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>FILE URL</label><input value={form.fileUrl} onChange={e => setForm({...form, fileUrl:e.target.value})} required style={inp} placeholder="https://res.cloudinary.com/..." /></div>
            <div style={{ gridColumn:"span 2", display:"flex", gap:8 }}>
              <button type="submit" style={{ padding:"8px 20px", background:"#F0B90B", color:"#000", border:"none", borderRadius:6, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Upload</button>
              <button type="button" onClick={() => setShowUpload(false)} style={{ padding:"8px 20px", background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.5)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:6, fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Document List */}
      {loading ? <div style={{ textAlign:"center", color:"rgba(255,255,255,0.3)", padding:40 }}>Loading...</div>
      : (data.documents||[]).length === 0 ? (
        <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", padding:40, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>No documents in your queue</div>
      ) : (data.documents||[]).map(doc => {
        const si = STATUS_INFO[doc.status] || { label: doc.status, color: "#6b7280" };
        const cat = CATEGORIES.find(c => c.key === doc.category) || {};
        return (
          <div key={doc._id} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"16px 20px", marginBottom:8 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <div>
                <div style={{ fontSize:14, fontWeight:700 }}>{doc.fileName} <span style={{ fontSize:10, color:"rgba(255,255,255,0.25)" }}>v{doc.version || 1}</span></div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>{doc.issuerName || "—"} · {doc.assetName || "—"} · {cat.icon} {cat.label}</div>
              </div>
              <span style={{ fontSize:10, padding:"4px 10px", borderRadius:5, background:si.color+"15", color:si.color, fontWeight:700 }}>{si.label}</span>
            </div>

            {/* Stage Progress */}
            <div style={{ display:"flex", gap:4, marginBottom:10 }}>
              {[
                { done: !!doc.complianceApprovedAt, label:"Compliance", who: doc.complianceApprovedByName, c:"#8b5cf6" },
                { done: !!doc.financeApprovedAt, label:"Finance", who: doc.financeApprovedByName, c:"#f59e0b" },
                { done: !!doc.finalApprovedAt, label:"Final", who: doc.finalApprovedByName, c:"#22c55e" },
              ].map((st, i) => (
                <div key={i} style={{ flex:1, padding:"6px 10px", borderRadius:6, background: st.done ? st.c+"12" : "#0a0e14", border: "1px solid " + (st.done ? st.c+"30" : "rgba(255,255,255,0.04)") }}>
                  <div style={{ fontSize:9, fontWeight:700, color: st.done ? st.c : "rgba(255,255,255,0.2)" }}>{st.done ? "✓" : "○"} {st.label}</div>
                  {st.who && <div style={{ fontSize:9, color:"rgba(255,255,255,0.3)" }}>by {st.who}</div>}
                </div>
              ))}
            </div>

            {/* Rejection info */}
            {doc.rejectionReason && <div style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.15)", borderRadius:6, padding:"8px 12px", marginBottom:10, fontSize:11, color:"#ef4444" }}>Rejected: {doc.rejectionReason}</div>}

            {/* Actions */}
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {canApprove(doc.status) && (
                <button onClick={() => doAction("approve", doc._id, { notes: prompt("Approval notes (optional):") || "" })} style={{ padding:"5px 14px", borderRadius:5, background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.2)", color:"#22c55e", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>✅ Approve</button>
              )}
              {canReject(doc.status) && (
                <button onClick={() => { const r = prompt("Rejection reason (required):"); if(r) doAction("reject", doc._id, { reason: r }); }} style={{ padding:"5px 14px", borderRadius:5, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", color:"#ef4444", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>❌ Reject</button>
              )}
              {canComment() && (
                <button onClick={() => { const c = prompt("Add comment:"); if(c) doAction("comment", doc._id, { comment: c }); }} style={{ padding:"5px 14px", borderRadius:5, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.4)", fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>💬 Comment</button>
              )}
              {doc.status === "rejected_compliance" && (role === "super_admin" || role === "compliance_admin") && (
                <button onClick={() => doAction("resubmit", doc._id)} style={{ padding:"5px 14px", borderRadius:5, background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.2)", color:"#3b82f6", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>🔄 Resubmit</button>
              )}
              {doc.fileUrl && <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" style={{ padding:"5px 14px", borderRadius:5, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.4)", fontSize:11, textDecoration:"none" }}>📎 View File</a>}
            </div>

            {/* Audit Log */}
            {doc.auditLog && doc.auditLog.length > 0 && (
              <div style={{ marginTop:10, borderTop:"1px solid rgba(255,255,255,0.04)", paddingTop:8 }}>
                {doc.auditLog.slice(-3).reverse().map((log, i) => (
                  <div key={i} style={{ fontSize:10, color:"rgba(255,255,255,0.3)", padding:"2px 0" }}>
                    <span style={{ color:"#F0B90B" }}>{log.action}</span> by {log.by} ({log.byRole}) · {new Date(log.at).toLocaleString()}
                    {log.notes && <span> — {log.notes}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </AdminShell>
  );
}
