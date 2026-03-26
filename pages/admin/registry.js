import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminShell from "../../components/admin/AdminShell";
export default function Registry() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [data, setData] = useState({ registry: [] });
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = localStorage.getItem("adminToken"); if(!t) router.push("/admin/login"); setToken(t); }, []);
  useEffect(() => { if(token) fetch("/api/admin/registry", { headers:{ Authorization:"Bearer "+token } }).then(r=>r.json()).then(setData).finally(()=>setLoading(false)); }, [token]);
  return (
    <AdminShell title="Shareholder Registry" subtitle="All token holders across all assets.">
      <div style={{ display:"flex", gap:12, marginBottom:20 }}>
        <div style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:"16px 20px", flex:1 }}><div style={{ fontSize:22, fontWeight:800, color:"#3b82f6" }}>{data.totalInvestors||0}</div><div style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>Unique Investors</div></div>
        <div style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:"16px 20px", flex:1 }}><div style={{ fontSize:22, fontWeight:800, color:"#22c55e" }}>{data.totalInvestments||0}</div><div style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>Active Holdings</div></div>
      </div>
      <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:"150px 150px 140px 80px 100px", padding:"10px 16px", background:"rgba(255,255,255,0.03)", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase" }}>
          <span>Investor</span><span>Asset</span><span>Email</span><span>Units</span><span>Invested</span>
        </div>
        {loading ? <div style={{ padding:30, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>Loading...</div>
        : (data.registry||[]).length === 0 ? <div style={{ padding:30, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>No shareholders</div>
        : (data.registry||[]).map((r,i) => (
          <div key={i} style={{ display:"grid", gridTemplateColumns:"150px 150px 140px 80px 100px", padding:"12px 16px", borderBottom:"1px solid rgba(255,255,255,0.04)", fontSize:12, alignItems:"center" }}>
            <span style={{ fontWeight:600 }}>{r.investor?.firstName} {r.investor?.lastName}</span>
            <span>{r.assetName}</span>
            <span style={{ fontSize:10, color:"rgba(255,255,255,0.4)" }}>{r.investor?.email}</span>
            <span>{r.units}</span>
            <span style={{ fontWeight:600, color:"#F0B90B" }}>EUR {(r.totalInvested||0).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
