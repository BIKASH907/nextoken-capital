import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminShell from "../../components/admin/AdminShell";
export default function TravelRule() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = localStorage.getItem("adminToken"); if(!t) router.push("/admin/login"); setToken(t); }, []);
  useEffect(() => { if(token) fetch("/api/admin/transactions", { headers:{ Authorization:"Bearer "+token } }).then(r=>r.json()).then(d=>setOrders((d.orders||[]).filter(o=>o.totalAmount>=1000))).finally(()=>setLoading(false)); }, [token]);
  return (
    <AdminShell title="Travel Rule Compliance" subtitle="Transactions over EUR 1,000 requiring originator/beneficiary data (EU Transfer of Funds Regulation).">
      <div style={{ background:"rgba(240,185,11,0.06)", border:"1px solid rgba(240,185,11,0.15)", borderRadius:8, padding:"12px 16px", fontSize:12, color:"rgba(255,255,255,0.5)", marginBottom:20, lineHeight:1.7 }}>
        Under EU TFR and FATF Travel Rule, transfers over EUR 1,000 require originator and beneficiary identification. All transactions below are flagged for compliance review.
      </div>
      <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:"80px 160px 100px 100px 120px 80px", padding:"10px 16px", background:"rgba(255,255,255,0.03)", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase" }}>
          <span>Type</span><span>Asset</span><span>Amount</span><span>Fee</span><span>Date</span><span>Status</span>
        </div>
        {loading ? <div style={{ padding:30, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>Loading...</div>
        : orders.length === 0 ? <div style={{ padding:30, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>No travel rule transactions</div>
        : orders.map((o,i) => (
          <div key={i} style={{ display:"grid", gridTemplateColumns:"80px 160px 100px 100px 120px 80px", padding:"12px 16px", borderBottom:"1px solid rgba(255,255,255,0.04)", fontSize:12, alignItems:"center" }}>
            <span style={{ fontSize:10, padding:"2px 6px", borderRadius:4, background:o.type==="buy"?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)", color:o.type==="buy"?"#22c55e":"#ef4444", fontWeight:700 }}>{o.type}</span>
            <span style={{ fontWeight:600 }}>{o.assetName}</span>
            <span style={{ fontWeight:700, color:"#F0B90B" }}>EUR {o.totalAmount?.toLocaleString()}</span>
            <span style={{ color:"rgba(255,255,255,0.4)" }}>EUR {(o.fee||0).toFixed(2)}</span>
            <span style={{ fontSize:10, color:"rgba(255,255,255,0.4)" }}>{new Date(o.createdAt).toLocaleString()}</span>
            <span style={{ fontSize:10, padding:"2px 6px", borderRadius:4, background:"rgba(240,185,11,0.1)", color:"#F0B90B", fontWeight:700 }}>review</span>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
