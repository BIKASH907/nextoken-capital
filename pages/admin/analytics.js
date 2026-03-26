import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminShell from "../../components/admin/AdminShell";

export default function AnalyticsDashboard() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [data, setData] = useState({ stats:{}, dailyVolume:[], topAssets:[] });
  const [loading, setLoading] = useState(true);

  useEffect(() => { const t = localStorage.getItem("adminToken"); if(!t) router.push("/admin/login"); setToken(t); }, []);
  useEffect(() => { if(token) fetch("/api/analytics").then(r=>r.json()).then(setData).finally(()=>setLoading(false)); }, [token]);

  const s = data.stats || {};
  const card = (l,v,c) => (
    <div style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:"18px 22px", flex:1, minWidth:140 }}>
      <div style={{ fontSize:26, fontWeight:800, color:c }}>{v}</div>
      <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:4 }}>{l}</div>
    </div>
  );

  return (
    <AdminShell title="Real-Time Analytics" subtitle="Live trading volume, asset performance, investor activity.">
      {loading ? <div style={{ textAlign:"center", padding:40, color:"rgba(255,255,255,0.3)" }}>Loading...</div> : (
        <>
          <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap" }}>
            {card("Total Users", s.users||0, "#3b82f6")}
            {card("Total Assets", s.assets||0, "#8b5cf6")}
            {card("Total Orders", s.totalOrders||0, "#f59e0b")}
            {card("Total Volume", "EUR "+(s.totalVolume||0).toLocaleString(), "#F0B90B")}
            {card("Today Volume", "EUR "+(s.todayVolume||0).toLocaleString(), "#22c55e")}
            {card("Today Orders", s.todayOrders||0, "#22c55e")}
          </div>

          <h3 style={{ fontSize:14, fontWeight:700, color:"#F0B90B", marginBottom:12 }}>Daily Volume (30 days)</h3>
          <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", padding:20, marginBottom:24, display:"flex", alignItems:"flex-end", gap:2, height:200 }}>
            {(data.dailyVolume||[]).map((d,i) => {
              const maxVol = Math.max(...(data.dailyVolume||[]).map(x=>x.volume), 1);
              const h = Math.max((d.volume/maxVol)*160, 2);
              return <div key={i} title={d.date+": EUR "+d.volume.toLocaleString()} style={{ flex:1, background:d.volume>0?"#F0B90B":"rgba(255,255,255,0.06)", height:h, borderRadius:"2px 2px 0 0", cursor:"pointer" }} />;
            })}
          </div>

          <h3 style={{ fontSize:14, fontWeight:700, color:"#F0B90B", marginBottom:12 }}>Top Assets by Volume</h3>
          <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
            {(data.topAssets||[]).length === 0 ? <div style={{ padding:20, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>No trading data yet</div>
            : (data.topAssets||[]).map((a,i) => (
              <div key={i} style={{ padding:"12px 20px", borderBottom:"1px solid rgba(255,255,255,0.04)", display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontWeight:600 }}>{a.name}</span>
                <span style={{ color:"#F0B90B", fontWeight:700 }}>EUR {a.volume.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </AdminShell>
  );
}
