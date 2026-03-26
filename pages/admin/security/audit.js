import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "../../../components/AdminSidebar";

const SEVERITY_COLOR = { low:"#22c55e", medium:"#f59e0b", high:"#ef4444", critical:"#dc2626" };
const ACTION_COLOR = { approved:"#22c55e", rejected:"#ef4444", commented:"#3b82f6", login:"#8b5cf6", created:"#22c55e", updated:"#f59e0b", deleted:"#ef4444" };

export default function AuditTrail() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [data, setData] = useState({ logs: [], total: 0, pages: 1, filters: {} });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ role: "", action: "", severity: "", country: "", from: "", to: "" });
  const [page, setPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    if (!t) { router.push("/admin/login"); return; }
    setToken(t);
  }, []);

  useEffect(() => { if (token) load(); }, [token, page, filters]);

  const headers = { Authorization: "Bearer " + token };

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 30 });
    if (search) params.set("search", search);
    if (filters.role) params.set("role", filters.role);
    if (filters.action) params.set("action", filters.action);
    if (filters.severity) params.set("severity", filters.severity);
    if (filters.country) params.set("country", filters.country);
    if (filters.from) params.set("from", filters.from);
    if (filters.to) params.set("to", filters.to);
    fetch("/api/admin/security/audit-logs?" + params.toString(), { headers })
      .then(r => r.json()).then(setData).finally(() => setLoading(false));
  };

  const exportCSV = () => {
    const params = new URLSearchParams({ export: "csv" });
    if (search) params.set("search", search);
    if (filters.role) params.set("role", filters.role);
    if (filters.action) params.set("action", filters.action);
    window.open("/api/admin/security/audit-logs?" + params.toString() + "&token=" + token);
  };

  const verifyIntegrity = async () => {
    const res = await fetch("/api/admin/security/audit-logs", { method: "POST", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify({ action: "verify_integrity" }) });
    const d = await res.json();
    alert(d.verified ? "✅ Integrity verified! " + d.checked + " logs checked. No tampering detected." : "⚠️ INTEGRITY BROKEN! " + d.broken.length + " logs have been tampered with.");
  };

  const getActionColor = (action) => {
    for (const [key, color] of Object.entries(ACTION_COLOR)) {
      if (action?.toLowerCase().includes(key)) return color;
    }
    return "#6b7280";
  };

  const sel = { background:"#0a0e14", border:"1px solid rgba(255,255,255,0.1)", borderRadius:6, padding:"7px 10px", color:"#fff", fontSize:12, outline:"none", fontFamily:"inherit", cursor:"pointer" };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#0a0e14" }}>
      <AdminSidebar />
      <div style={{ marginLeft:240, padding:"28px 36px", flex:1, color:"#fff" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div>
            <h1 style={{ fontSize:24, fontWeight:800, marginBottom:4 }}>📋 Audit Trail</h1>
            <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13 }}>Immutable log · SHA-256 hash chain · {data.total} total entries</p>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={verifyIntegrity} style={{ padding:"8px 16px", borderRadius:7, background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.2)", color:"#22c55e", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>🔐 Verify Integrity</button>
            <button onClick={exportCSV} style={{ padding:"8px 16px", borderRadius:7, background:"rgba(240,185,11,0.08)", border:"1px solid rgba(240,185,11,0.2)", color:"#F0B90B", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>📤 Export CSV</button>
          </div>
        </div>

        {/* Search + Filters */}
        <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && load()} placeholder="🔍 Search name, email, action, IP..." style={{ ...sel, flex:1, minWidth:200, cursor:"text" }} />
          <select value={filters.role} onChange={e => setFilters({...filters, role: e.target.value})} style={sel}>
            <option value="">All Roles</option>
            {(data.filters?.roles || []).map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select value={filters.action} onChange={e => setFilters({...filters, action: e.target.value})} style={sel}>
            <option value="">All Actions</option>
            {(data.filters?.actions || []).slice(0,20).map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <select value={filters.severity} onChange={e => setFilters({...filters, severity: e.target.value})} style={sel}>
            <option value="">All Severity</option>
            {["low","medium","high","critical"].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filters.country} onChange={e => setFilters({...filters, country: e.target.value})} style={sel}>
            <option value="">All Countries</option>
            {(data.filters?.countries || []).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="date" value={filters.from} onChange={e => setFilters({...filters, from: e.target.value})} style={sel} />
          <input type="date" value={filters.to} onChange={e => setFilters({...filters, to: e.target.value})} style={sel} />
          <button onClick={load} style={{ padding:"7px 14px", borderRadius:6, background:"#F0B90B", color:"#000", border:"none", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Search</button>
        </div>

        {/* Table */}
        <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
          <div style={{ display:"grid", gridTemplateColumns:"130px 90px 140px 120px 80px 130px 90px 80px 70px", padding:"10px 16px", background:"rgba(255,255,255,0.03)", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:.5, gap:4 }}>
            <span>User</span><span>Role</span><span>Action</span><span>Target</span><span>Status</span><span>Date</span><span>IP</span><span>Location</span><span>Device</span>
          </div>

          {loading ? <div style={{ padding:40, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>Loading...</div>
          : (data.logs || []).length === 0 ? (
            <div style={{ padding:40, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>No audit logs found</div>
          ) : (data.logs || []).map(log => (
            <div key={log._id} onClick={() => setSelectedLog(log)} style={{ display:"grid", gridTemplateColumns:"130px 90px 140px 120px 80px 130px 90px 80px 70px", padding:"10px 16px", borderBottom:"1px solid rgba(255,255,255,0.03)", fontSize:12, alignItems:"center", cursor:"pointer", transition:"background .1s", gap:4 }}
              onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.02)"} onMouseLeave={e => e.currentTarget.style.background="transparent"}>
              <div>
                <div style={{ fontWeight:600, fontSize:12 }}>{log.adminName}</div>
                <div style={{ fontSize:9, color:"rgba(255,255,255,0.25)" }}>{log.adminEmail}</div>
              </div>
              <span style={{ fontSize:10, padding:"2px 6px", borderRadius:3, background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.5)" }}>{log.adminRole}</span>
              <span style={{ fontSize:11, color:getActionColor(log.action), fontWeight:600 }}>{log.action}</span>
              <span style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>{log.targetType} {log.targetId?.slice(-6)}</span>
              <span style={{ fontSize:9, padding:"2px 6px", borderRadius:3, background:(SEVERITY_COLOR[log.severity]||"#666")+"15", color:SEVERITY_COLOR[log.severity]||"#666", fontWeight:700 }}>{log.severity}</span>
              <span style={{ fontSize:10, color:"rgba(255,255,255,0.35)" }}>{new Date(log.createdAt).toLocaleString()}</span>
              <span style={{ fontSize:10, color:"rgba(255,255,255,0.3)", fontFamily:"monospace" }}>{log.ip?.slice(0,15)}</span>
              <span style={{ fontSize:10 }}>{log.country === "Unknown" ? "—" : (log.city || "") + " " + (log.countryCode || "")}</span>
              <span style={{ fontSize:9, color:"rgba(255,255,255,0.25)" }}>{log.device || "—"}</span>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {data.pages > 1 && (
          <div style={{ display:"flex", justifyContent:"center", gap:6, marginTop:16 }}>
            <button disabled={page <= 1} onClick={() => setPage(p => p-1)} style={{ padding:"6px 12px", borderRadius:5, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.4)", fontSize:11, cursor: page <= 1 ? "not-allowed" : "pointer", fontFamily:"inherit" }}>← Prev</button>
            <span style={{ padding:"6px 12px", fontSize:12, color:"rgba(255,255,255,0.4)" }}>Page {page} of {data.pages}</span>
            <button disabled={page >= data.pages} onClick={() => setPage(p => p+1)} style={{ padding:"6px 12px", borderRadius:5, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.4)", fontSize:11, cursor: page >= data.pages ? "not-allowed" : "pointer", fontFamily:"inherit" }}>Next →</button>
          </div>
        )}

        {/* Detail Modal */}
        {selectedLog && (
          <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999 }} onClick={() => setSelectedLog(null)}>
            <div onClick={e => e.stopPropagation()} style={{ width:"100%", maxWidth:560, background:"#0F1318", border:"1px solid rgba(255,255,255,0.1)", borderRadius:16, padding:28, maxHeight:"80vh", overflowY:"auto" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
                <h2 style={{ fontSize:18, fontWeight:800 }}>Audit Details</h2>
                <button onClick={() => setSelectedLog(null)} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.4)", fontSize:20, cursor:"pointer" }}>×</button>
              </div>

              {[
                { l:"User", v:selectedLog.adminName + " (" + selectedLog.adminEmail + ")" },
                { l:"User ID", v:selectedLog.adminId },
                { l:"Role", v:selectedLog.adminRole },
                { l:"Action", v:selectedLog.action, c:getActionColor(selectedLog.action) },
                { l:"Target", v:(selectedLog.targetType || "—") + " " + (selectedLog.targetId || "") },
                { l:"Status Before", v:selectedLog.statusBefore || "—" },
                { l:"Status After", v:selectedLog.statusAfter || "—" },
                { l:"Comment", v:selectedLog.comment || "—" },
                { l:"Severity", v:selectedLog.severity, c:SEVERITY_COLOR[selectedLog.severity] },
                { l:"Result", v:selectedLog.result },
                { l:"Date & Time", v:new Date(selectedLog.createdAt).toLocaleString() },
                { l:"IP Address", v:selectedLog.ip },
                { l:"Country", v:selectedLog.country },
                { l:"City", v:selectedLog.city },
                { l:"Device", v:selectedLog.device || "—" },
                { l:"Browser", v:selectedLog.browser || "—" },
                { l:"OS", v:selectedLog.os || "—" },
                { l:"Hash", v:selectedLog.hash?.slice(0,20) + "..." },
              ].map((r,i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>{r.l}</span>
                  <span style={{ fontSize:12, color:r.c || "#fff", fontWeight:600, maxWidth:300, textAlign:"right", wordBreak:"break-all" }}>{r.v}</span>
                </div>
              ))}

              {selectedLog.details && (
                <div style={{ marginTop:12 }}>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginBottom:6 }}>RAW DETAILS</div>
                  <pre style={{ background:"#0a0e14", borderRadius:6, padding:10, fontSize:10, color:"rgba(255,255,255,0.4)", overflow:"auto", maxHeight:150 }}>{JSON.stringify(selectedLog.details, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
