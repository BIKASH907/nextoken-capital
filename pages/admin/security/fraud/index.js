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
