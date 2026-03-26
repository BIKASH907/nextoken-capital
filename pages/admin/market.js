import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminShell from "../../components/admin/AdminShell";
export default function Market() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [data, setData] = useState({ assets: [] });
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = localStorage.getItem("adminToken"); if(!t) router.push("/admin/login"); setToken(t); }, []);
  useEffect(() => { if(token) fetch("/api/admin/market-data", { headers:{ Authorization:"Bearer "+token } }).then(r=>r.json()).then(setData).finally(()=>setLoading(false)); }, [token]);
  const card = (l,v,c) => <div style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:"16px 20px", flex:1 }}><div style={{ fontSize:22, fontWeight:800, color:c }}>{v}</div><div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:4 }}>{l}</div></div>;
  return (
    <AdminShell title="Market Data" subtitle="Real-time asset prices, volume, order book depth.">
      <div style={{ display:"flex", gap:12, marginBottom:20 }}>
        {card("Total Assets", data.totalAssets||0, "#8b5cf6")}
        {card("Total Volume", "EUR "+(data.totalVolume||0).toLocaleString(), "#F0B90B")}
        {card("Open Orders", data.openOrders||0, "#3b82f6")}
      </div>
      <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:"160px 80px 90px 100px 80px 80px 80px 80px", padding:"10px 16px", background:"rgba(255,255,255,0.03)", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase" }}>
          <span>Asset</span><span>Type</span><span>Last Price</span><span>24h Volume</span><span>Trades</span><span>Bids</span><span>Asks</span><span>Status</span>
        </div>
        {loading ? <div style={{ padding:30, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>Loading...</div>
        : (data.assets||[]).length === 0 ? <div style={{ padding:30, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>No assets listed</div>
        : (data.assets||[]).map((a,i) => (
          <div key={i} style={{ display:"grid", gridTemplateColumns:"160px 80px 90px 100px 80px 80px 80px 80px", padding:"12px 16px", borderBottom:"1px solid rgba(255,255,255,0.04)", fontSize:12, alignItems:"center" }}>
            <span style={{ fontWeight:600 }}>{a.name}</span>
            <span style={{ color:"rgba(255,255,255,0.4)" }}>{a.type}</span>
            <span style={{ fontWeight:700, color:"#F0B90B" }}>EUR {a.price}</span>
            <span>EUR {a.volume24h.toLocaleString()}</span>
            <span>{a.trades}</span>
            <span style={{ color:"#22c55e" }}>{a.bids}</span>
            <span style={{ color:"#ef4444" }}>{a.asks}</span>
            <span style={{ fontSize:10, padding:"2px 6px", borderRadius:4, background:a.status==="live"?"rgba(34,197,94,0.1)":"rgba(255,255,255,0.05)", color:a.status==="live"?"#22c55e":"rgba(255,255,255,0.4)", fontWeight:700 }}>{a.status}</span>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
