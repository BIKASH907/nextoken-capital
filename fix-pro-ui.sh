#!/bin/bash
# Professional UI: Approvals + Fraud
# Run: chmod +x fix-pro-ui.sh && ./fix-pro-ui.sh
set -e

echo "  Building professional UI..."

cat > pages/admin/security/approvals.js << 'APPEOF'
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "../../../components/AdminSidebar";

const STAGES = [
  { key:"pending_compliance", label:"Compliance", color:"#8b5cf6" },
  { key:"compliance_approved", label:"Finance", color:"#f59e0b" },
  { key:"finance_approved", label:"Final Approval", color:"#ef4444" },
  { key:"live", label:"Live", color:"#22c55e" },
  { key:"rejected", label:"Rejected", color:"#ef4444" },
];

export default function Approvals() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [employee, setEmployee] = useState(null);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [comment, setComment] = useState("");
  const [msg, setMsg] = useState("");
  const [pendingOnly, setPendingOnly] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    if (!t) { router.push("/admin/login"); return; }
    setToken(t);
    try { setEmployee(JSON.parse(localStorage.getItem("adminEmployee"))); } catch(e) {}
  }, []);

  useEffect(() => { if (token) load(); }, [token]);

  const headers = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
  const load = () => {
    setLoading(true);
    fetch("/api/admin/assets", { headers }).then(r => r.json()).then(d => setAssets(d.assets || [])).finally(() => setLoading(false));
  };

  const role = employee?.role || "support_admin";
  const getStage = (a) => a.approvalStatus || a.status || "draft";
  const getStageInfo = (s) => STAGES.find(st => st.key === s) || { label: s, color: "#6b7280" };

  let filtered = assets;
  if (pendingOnly) filtered = filtered.filter(a => !["live","draft"].includes(getStage(a)));
  if (stageFilter) filtered = filtered.filter(a => getStage(a) === stageFilter);
  if (search) filtered = filtered.filter(a => (a.name||"").toLowerCase().includes(search.toLowerCase()) || (a.issuerName||"").toLowerCase().includes(search.toLowerCase()) || (a._id||"").includes(search));

  const canApprove = (status) => {
    if (role === "super_admin" && status === "finance_approved") return true;
    if (role === "compliance_admin" && status === "pending_compliance") return true;
    if (role === "finance_admin" && status === "compliance_approved") return true;
    return false;
  };

  const doAction = async (assetId, action, reason) => {
    setMsg("");
    const res = await fetch("/api/admin/assets/approve", { method: "POST", headers, body: JSON.stringify({ assetId, action, reason }) });
    const d = await res.json();
    setMsg(res.ok ? "Done: " + d.message : "Error: " + d.error);
    load();
    if (res.ok) setSelected(null);
  };

  const counts = {};
  assets.forEach(a => { const s = getStage(a); counts[s] = (counts[s]||0)+1; });
  const sel = { background:"#0a0e14", border:"1px solid rgba(255,255,255,0.1)", borderRadius:6, padding:"7px 10px", color:"#fff", fontSize:12, outline:"none", fontFamily:"inherit", cursor:"pointer" };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#0a0e14" }}>
      <AdminSidebar />
      <div style={{ marginLeft:240, padding:"28px 36px", flex:1, color:"#fff" }}>
        <h1 style={{ fontSize:24, fontWeight:800, marginBottom:4 }}>Approval Pipeline</h1>
        <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13, marginBottom:20 }}>Review assets: Compliance, Finance, Final Approval.</p>

        <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search asset, issuer, ID..." style={{ ...sel, flex:1, minWidth:200, cursor:"text" }} />
          <select value={stageFilter} onChange={e => setStageFilter(e.target.value)} style={sel}>
            <option value="">All Stages</option>
            {STAGES.map(s => <option key={s.key} value={s.key}>{s.label} ({counts[s.key]||0})</option>)}
          </select>
          <button onClick={() => setPendingOnly(!pendingOnly)} style={{ ...sel, background: pendingOnly ? "#F0B90B15" : "#0a0e14", color: pendingOnly ? "#F0B90B" : "rgba(255,255,255,0.4)", border: pendingOnly ? "1px solid #F0B90B30" : "1px solid rgba(255,255,255,0.1)" }}>
            {pendingOnly ? "Pending Only" : "All Assets"}
          </button>
          <button onClick={load} style={{ ...sel, background:"#F0B90B", color:"#000", border:"none", fontWeight:700 }}>Refresh</button>
        </div>

        {msg && <div style={{ background:"rgba(240,185,11,0.08)", border:"1px solid rgba(240,185,11,0.2)", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#F0B90B", marginBottom:16 }}>{msg}</div>}

        <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
          <div style={{ display:"grid", gridTemplateColumns:"160px 140px 130px 90px 100px 100px 100px", padding:"10px 16px", background:"rgba(255,255,255,0.03)", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:.5 }}>
            <span>Asset</span><span>Issuer</span><span>Stage</span><span>Status</span><span>Submitted</span><span>Last Action</span><span>Actions</span>
          </div>
          {loading ? <div style={{ padding:40, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>Loading...</div>
          : filtered.length === 0 ? <div style={{ padding:40, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>No assets in queue</div>
          : filtered.map(a => {
            const stage = getStage(a);
            const si = getStageInfo(stage);
            const lastAction = a.approvalHistory?.slice(-1)[0];
            return (
              <div key={a._id} style={{ display:"grid", gridTemplateColumns:"160px 140px 130px 90px 100px 100px 100px", padding:"12px 16px", borderBottom:"1px solid rgba(255,255,255,0.03)", fontSize:12, alignItems:"center" }}>
                <div style={{ fontWeight:600 }}>{a.name || "Unnamed"}</div>
                <span style={{ color:"rgba(255,255,255,0.4)" }}>{a.issuerName || "n/a"}</span>
                <span style={{ fontSize:10, padding:"3px 8px", borderRadius:4, background:si.color+"15", color:si.color, fontWeight:700 }}>{si.label}</span>
                <span style={{ fontSize:10, color: stage.includes("rejected") ? "#ef4444" : "#f59e0b" }}>{stage.includes("rejected") ? "Rejected" : "Pending"}</span>
                <span style={{ fontSize:10, color:"rgba(255,255,255,0.3)" }}>{a.createdAt ? new Date(a.createdAt).toLocaleDateString() : "n/a"}</span>
                <span style={{ fontSize:10, color:"rgba(255,255,255,0.3)" }}>{lastAction ? lastAction.byRole : "n/a"}</span>
                <div>
                  <button onClick={() => { setSelected(a); setComment(""); }} style={{ padding:"4px 12px", borderRadius:5, background: canApprove(stage) ? "rgba(240,185,11,0.1)" : "rgba(255,255,255,0.04)", border: canApprove(stage) ? "1px solid rgba(240,185,11,0.2)" : "1px solid rgba(255,255,255,0.08)", color: canApprove(stage) ? "#F0B90B" : "rgba(255,255,255,0.3)", fontSize:10, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                    {canApprove(stage) ? "Review" : "View"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {selected && (
          <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999, padding:20 }} onClick={() => setSelected(null)}>
            <div onClick={e => e.stopPropagation()} style={{ width:"100%", maxWidth:900, background:"#0F1318", border:"1px solid rgba(255,255,255,0.1)", borderRadius:16, overflow:"hidden", maxHeight:"85vh", display:"flex", flexDirection:"column" }}>
              <div style={{ padding:"16px 24px", background:"#161b22", borderBottom:"1px solid rgba(255,255,255,0.07)", display:"flex", justifyContent:"space-between" }}>
                <div>
                  <div style={{ fontSize:18, fontWeight:800 }}>{selected.name}</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>{selected.issuerName} - {selected._id?.slice(-8)}</div>
                </div>
                <button onClick={() => setSelected(null)} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.4)", fontSize:22, cursor:"pointer" }}>x</button>
              </div>
              <div style={{ display:"flex", flex:1, overflow:"auto" }}>
                <div style={{ flex:1, padding:20, borderRight:"1px solid rgba(255,255,255,0.07)" }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#F0B90B", marginBottom:12 }}>Documents</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginBottom:12 }}>
                    {role === "compliance_admin" ? "Showing: KYC Documents" : role === "finance_admin" ? "Showing: Financial Documents" : "Showing: All Documents"}
                  </div>
                  <div style={{ background:"#0a0e14", borderRadius:8, padding:14, border:"1px solid rgba(255,255,255,0.06)", marginBottom:20 }}>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginBottom:8 }}>Documents uploaded via Issuer Documents page.</div>
                    <button onClick={() => router.push("/admin/issuer-documents")} style={{ padding:"5px 12px", borderRadius:5, background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.2)", color:"#3b82f6", fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>View Documents</button>
                  </div>
                  <div style={{ fontSize:13, fontWeight:700, color:"#F0B90B", marginBottom:8 }}>Approval History</div>
                  {(selected.approvalHistory || []).length === 0 ? (
                    <div style={{ fontSize:12, color:"rgba(255,255,255,0.3)" }}>No history yet</div>
                  ) : selected.approvalHistory.map((h,i) => {
                    const ac = h.action === "approved" ? "#22c55e" : h.action === "rejected" ? "#ef4444" : "#3b82f6";
                    return (
                      <div key={i} style={{ padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,0.04)", fontSize:12 }}>
                        <span style={{ color:ac, fontWeight:700 }}>{h.action}</span>
                        <span style={{ color:"rgba(255,255,255,0.4)" }}> by {h.byName} ({h.byRole})</span>
                        <div style={{ fontSize:10, color:"rgba(255,255,255,0.25)", marginTop:2 }}>{(h.from||"").replace(/_/g," ")} to {(h.to||"").replace(/_/g," ")} - {new Date(h.at).toLocaleString()}</div>
                        {h.reason && <div style={{ fontSize:11, color:"#ef4444", marginTop:2 }}>Reason: {h.reason}</div>}
                      </div>
                    );
                  })}
                </div>
                <div style={{ width:320, padding:20 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#F0B90B", marginBottom:12 }}>Actions</div>
                  <div style={{ background:"#161b22", borderRadius:8, padding:"10px 14px", marginBottom:16, border:"1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)" }}>CURRENT STATUS</div>
                    <div style={{ fontSize:14, fontWeight:700, color:getStageInfo(getStage(selected)).color, marginTop:4 }}>{getStageInfo(getStage(selected)).label}</div>
                  </div>
                  {selected.rejectionReason && (
                    <div style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.15)", borderRadius:8, padding:"10px 14px", marginBottom:16, fontSize:12, color:"#ef4444" }}>Rejected: {selected.rejectionReason}</div>
                  )}
                  <div style={{ marginBottom:16 }}>
                    <label style={{ display:"block", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>ADD COMMENT</label>
                    <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} placeholder="Review notes..." style={{ width:"100%", background:"#0a0e14", border:"1px solid rgba(255,255,255,0.1)", borderRadius:6, padding:"9px 12px", color:"#fff", fontSize:12, outline:"none", fontFamily:"inherit", boxSizing:"border-box", resize:"vertical" }} />
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {canApprove(getStage(selected)) && (
                      <button onClick={() => doAction(selected._id, "approve", comment)} style={{ padding:"10px", borderRadius:7, background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.25)", color:"#22c55e", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Approve</button>
                    )}
                    {canApprove(getStage(selected)) && (
                      <button onClick={() => {
                        if (!comment.trim()) { setMsg("Error: Rejection requires a comment"); return; }
                        doAction(selected._id, "reject", comment);
                      }} style={{ padding:"10px", borderRadius:7, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.25)", color:"#ef4444", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Reject (comment required)</button>
                    )}
                    {getStage(selected) === "rejected" && (role === "compliance_admin" || role === "super_admin") && (
                      <button onClick={() => doAction(selected._id, "resubmit")} style={{ padding:"10px", borderRadius:7, background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.25)", color:"#3b82f6", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Request Changes</button>
                    )}
                  </div>
                  <div style={{ marginTop:16, background:"rgba(240,185,11,0.06)", border:"1px solid rgba(240,185,11,0.15)", borderRadius:8, padding:"10px 12px", fontSize:11, color:"rgba(255,255,255,0.4)", lineHeight:1.6 }}>
                    Approve only at your stage. Reject requires comment. Super Admin sees only after both approvals.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
APPEOF

echo "  Done: Approvals with review panel"

cat > pages/admin/security/fraud/index.js << 'FRAUDEOF'
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "../../../../components/AdminSidebar";

const RISK_COLOR = { high:"#ef4444", medium:"#f59e0b", low:"#22c55e" };
const MOCK_ALERTS = [
  { id:1, user:"John D.", action:"Withdrawal", risk:"high", amount:"E10,000", country:"India", status:"blocked", time:"10:30", factors:["New device","New country","High amount"] },
  { id:2, user:"Anna K.", action:"Login", risk:"medium", amount:"n/a", country:"UK", status:"flagged", time:"11:00", factors:["New IP","VPN detected"] },
  { id:3, user:"Mike R.", action:"Transfer", risk:"high", amount:"E25,000", country:"Nigeria", status:"blocked", time:"11:45", factors:["Sanctioned country","Velocity exceeded"] },
  { id:4, user:"Lisa M.", action:"Login", risk:"low", amount:"n/a", country:"Lithuania", status:"cleared", time:"12:00", factors:["Known device"] },
  { id:5, user:"Alex P.", action:"Withdrawal", risk:"medium", amount:"E5,000", country:"Germany", status:"flagged", time:"13:15", factors:["First withdrawal","New bank account"] },
];

export default function FraudDashboard() {
  const router = useRouter();
  const [selected, setSelected] = useState(null);
  const [riskFilter, setRiskFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => { if(!localStorage.getItem("adminToken")) router.push("/admin/login"); }, []);

  let filtered = MOCK_ALERTS;
  if (riskFilter) filtered = filtered.filter(a => a.risk === riskFilter);
  if (statusFilter) filtered = filtered.filter(a => a.status === statusFilter);
  if (search) filtered = filtered.filter(a => a.user.toLowerCase().includes(search.toLowerCase()) || a.action.toLowerCase().includes(search.toLowerCase()));

  const sel = { background:"#0a0e14", border:"1px solid rgba(255,255,255,0.1)", borderRadius:6, padding:"7px 10px", color:"#fff", fontSize:12, outline:"none", fontFamily:"inherit", cursor:"pointer" };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#0a0e14" }}>
      <AdminSidebar />
      <div style={{ marginLeft:240, padding:"28px 36px", flex:1, color:"#fff" }}>
        <h1 style={{ fontSize:24, fontWeight:800, marginBottom:4 }}>Fraud Detection Dashboard</h1>
        <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13, marginBottom:24 }}>Real-time fraud monitoring, suspicious activity, risk management.</p>

        <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap" }}>
          {[
            { l:"Suspicious Activities", v:MOCK_ALERTS.filter(a=>a.status==="flagged").length, c:"#f59e0b", i:"Warning" },
            { l:"Blocked Transactions", v:MOCK_ALERTS.filter(a=>a.status==="blocked").length, c:"#ef4444", i:"Blocked" },
            { l:"High-Risk Logins", v:MOCK_ALERTS.filter(a=>a.risk==="high"&&a.action==="Login").length, c:"#ef4444", i:"Risk" },
            { l:"Large Transactions", v:MOCK_ALERTS.filter(a=>a.amount!=="n/a").length, c:"#f59e0b", i:"Large" },
          ].map((s,i) => (
            <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:"18px 22px", flex:1, minWidth:160 }}>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginBottom:4 }}>{s.i}</div>
              <div style={{ fontSize:28, fontWeight:800, color:s.c }}>{s.v}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:2 }}>{s.l}</div>
            </div>
          ))}
        </div>

        <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search user, action..." style={{ ...sel, flex:1, minWidth:200, cursor:"text" }} />
          <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)} style={sel}>
            <option value="">All Risk Levels</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={sel}>
            <option value="">All Status</option>
            <option value="blocked">Blocked</option>
            <option value="flagged">Flagged</option>
            <option value="cleared">Cleared</option>
          </select>
        </div>

        <div style={{ display:"flex", gap:8, marginBottom:20 }}>
          {[
            { h:"/admin/security/fraud/suspicious-activity", l:"Suspicious Activity" },
            { h:"/admin/security/fraud/blocked-transactions", l:"Blocked Transactions" },
            { h:"/admin/security/fraud/withdrawal-protection", l:"Withdrawal Protection" },
          ].map((n,i) => (
            <button key={i} onClick={() => router.push(n.h)} style={{ padding:"6px 14px", borderRadius:6, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.5)", fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>{n.l}</button>
          ))}
        </div>

        <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
          <div style={{ display:"grid", gridTemplateColumns:"120px 100px 80px 100px 80px 80px 70px", padding:"10px 16px", background:"rgba(255,255,255,0.03)", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:.5 }}>
            <span>User</span><span>Action</span><span>Risk</span><span>Amount</span><span>Country</span><span>Status</span><span>Time</span>
          </div>
          {filtered.map(a => (
            <div key={a.id} onClick={() => setSelected(a)} style={{ display:"grid", gridTemplateColumns:"120px 100px 80px 100px 80px 80px 70px", padding:"12px 16px", borderBottom:"1px solid rgba(255,255,255,0.03)", fontSize:12, alignItems:"center", cursor:"pointer", transition:"background .1s" }}
              onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.02)"} onMouseLeave={e => e.currentTarget.style.background="transparent"}>
              <span style={{ fontWeight:600 }}>{a.user}</span>
              <span style={{ color:"rgba(255,255,255,0.5)" }}>{a.action}</span>
              <span style={{ fontSize:10, padding:"2px 8px", borderRadius:4, background:(RISK_COLOR[a.risk])+"15", color:RISK_COLOR[a.risk], fontWeight:700 }}>{a.risk}</span>
              <span style={{ fontWeight:600 }}>{a.amount}</span>
              <span style={{ color:"rgba(255,255,255,0.4)" }}>{a.country}</span>
              <span style={{ fontSize:10, padding:"2px 8px", borderRadius:4, background: a.status==="blocked" ? "rgba(239,68,68,0.1)" : a.status==="flagged" ? "rgba(245,158,11,0.1)" : "rgba(34,197,94,0.1)", color: a.status==="blocked" ? "#ef4444" : a.status==="flagged" ? "#f59e0b" : "#22c55e", fontWeight:700 }}>{a.status}</span>
              <span style={{ color:"rgba(255,255,255,0.3)" }}>{a.time}</span>
            </div>
          ))}
        </div>

        {selected && (
          <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999 }} onClick={() => setSelected(null)}>
            <div onClick={e => e.stopPropagation()} style={{ width:"100%", maxWidth:480, background:"#0F1318", border:"1px solid rgba(255,255,255,0.1)", borderRadius:16, padding:28 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
                <h2 style={{ fontSize:18, fontWeight:800 }}>Fraud Alert Details</h2>
                <button onClick={() => setSelected(null)} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.4)", fontSize:20, cursor:"pointer" }}>x</button>
              </div>
              {[
                { l:"User", v:selected.user },
                { l:"Action", v:selected.action },
                { l:"Amount", v:selected.amount },
                { l:"Risk Level", v:selected.risk, c:RISK_COLOR[selected.risk] },
                { l:"Country", v:selected.country },
                { l:"Status", v:selected.status },
                { l:"Time", v:selected.time },
              ].map((r,i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>{r.l}</span>
                  <span style={{ fontSize:12, color:r.c||"#fff", fontWeight:600 }}>{r.v}</span>
                </div>
              ))}
              <div style={{ marginTop:16 }}>
                <div style={{ fontSize:12, fontWeight:700, color:"#ef4444", marginBottom:8 }}>Risk Factors:</div>
                {selected.factors.map((f,i) => (
                  <div key={i} style={{ fontSize:12, color:"rgba(255,255,255,0.5)", padding:"3px 0" }}>- {f}</div>
                ))}
              </div>
              <div style={{ display:"flex", gap:8, marginTop:20 }}>
                <button style={{ flex:1, padding:10, borderRadius:7, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", color:"#ef4444", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Block User</button>
                <button style={{ flex:1, padding:10, borderRadius:7, background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.2)", color:"#22c55e", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Allow</button>
                <button style={{ flex:1, padding:10, borderRadius:7, background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.2)", color:"#f59e0b", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Flag</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
FRAUDEOF

echo "  Done: Fraud dashboard with stats, filters, detail modal"
echo ""
echo "  All done! Run:"
echo "  git add -A && git commit -m 'feat: pro UI' && git push && npx vercel --prod"
