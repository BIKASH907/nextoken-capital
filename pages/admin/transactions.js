import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminShell from "../../components/admin/AdminShell";
export default function Transactions() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [data, setData] = useState({ orders: [], stats: {} });
  const [filter, setFilter] = useState({ type: "", status: "" });
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = localStorage.getItem("adminToken"); if(!t) router.push("/admin/login"); setToken(t); }, []);
  useEffect(() => { if(token) load(); }, [token, filter]);
  const headers = { Authorization: "Bearer " + token };
  const load = () => {
    const q = new URLSearchParams(); if(filter.type) q.set("type",filter.type); if(filter.status) q.set("status",filter.status);
    fetch("/api/admin/transactions?" + q.toString(), { headers }).then(r=>r.json()).then(setData).finally(()=>setLoading(false));
  };
  const s = data.stats || {};
  const badge = (st) => { const c = { completed:"#22c55e", pending:"#f59e0b", failed:"#ef4444", processing:"#3b82f6", cancelled:"#6b7280" }; return <span style={{ fontSize:10, padding:"2px 8px", borderRadius:4, background:(c[st]||"#666")+"15", color:c[st]||"#666", fontWeight:700 }}>{st}</span>; };
  const card = (l,v,c) => <div style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:"16px 20px", flex:1, minWidth:130 }}><div style={{ fontSize:24, fontWeight:800, color:c }}>{v}</div><div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:4 }}>{l}</div></div>;
  return (
    <AdminShell title="Transactions" subtitle="All buy/sell orders, fees, and transaction history.">
      <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
        {card("Total Orders", s.totalOrders||0, "#3b82f6")}
        {card("Volume", "EUR "+(s.totalVolume||0).toLocaleString(), "#F0B90B")}
        {card("Completed", s.completed||0, "#22c55e")}
        {card("Pending", s.pending||0, "#f59e0b")}
        {card("Failed", s.failed||0, "#ef4444")}
        {card("Fees Collected", "EUR "+(s.totalFees||0).toLocaleString(), "#8b5cf6")}
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        <select value={filter.type} onChange={e=>setFilter({...filter,type:e.target.value})} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.1)", borderRadius:6, padding:"6px 10px", color:"#fff", fontSize:12, fontFamily:"inherit" }}><option value="">All Types</option><option value="buy">Buy</option><option value="sell">Sell</option></select>
        <select value={filter.status} onChange={e=>setFilter({...filter,status:e.target.value})} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.1)", borderRadius:6, padding:"6px 10px", color:"#fff", fontSize:12, fontFamily:"inherit" }}><option value="">All Status</option><option value="completed">Completed</option><option value="pending">Pending</option><option value="failed">Failed</option></select>
      </div>
      <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:"70px 150px 70px 100px 80px 100px 70px", padding:"10px 16px", background:"rgba(255,255,255,0.03)", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase" }}>
          <span>Type</span><span>Asset</span><span>Units</span><span>Amount</span><span>Fee</span><span>Date</span><span>Status</span>
        </div>
        {loading ? <div style={{ padding:30, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>Loading...</div>
        : (data.orders||[]).length === 0 ? <div style={{ padding:30, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>No transactions</div>
        : (data.orders||[]).map((o,i) => (
          <div key={i} style={{ display:"grid", gridTemplateColumns:"70px 150px 70px 100px 80px 100px 70px", padding:"12px 16px", borderBottom:"1px solid rgba(255,255,255,0.04)", fontSize:12, alignItems:"center" }}>
            <span style={{ fontSize:10, padding:"2px 6px", borderRadius:4, background:o.type==="buy"?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)", color:o.type==="buy"?"#22c55e":"#ef4444", fontWeight:700 }}>{o.type}</span>
            <span style={{ fontWeight:600 }}>{o.assetName}</span>
            <span>{o.units}</span>
            <span style={{ fontWeight:600 }}>EUR {(o.totalAmount||0).toLocaleString()}</span>
            <span style={{ color:"rgba(255,255,255,0.4)" }}>EUR {(o.fee||0).toFixed(2)}</span>
            <span style={{ fontSize:10, color:"rgba(255,255,255,0.4)" }}>{new Date(o.createdAt).toLocaleString()}</span>
            {badge(o.status)}
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
