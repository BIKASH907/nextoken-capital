import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminShell from "../../components/admin/AdminShell";
export default function Contracts() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = localStorage.getItem("adminToken"); if(!t) router.push("/admin/login"); setToken(t); }, []);
  useEffect(() => { if(token) fetch("/api/admin/assets", { headers:{ Authorization:"Bearer "+token } }).then(r=>r.json()).then(d=>setAssets(d.assets||[])).finally(()=>setLoading(false)); }, [token]);
  return (
    <AdminShell title="Smart Contracts" subtitle="Deployed token contracts and blockchain status.">
      <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:"180px 100px 200px 100px 100px", padding:"10px 16px", background:"rgba(255,255,255,0.03)", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase" }}>
          <span>Asset</span><span>Type</span><span>Contract Address</span><span>Network</span><span>Status</span>
        </div>
        {loading ? <div style={{ padding:30, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>Loading...</div>
        : assets.length === 0 ? <div style={{ padding:30, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>No contracts deployed</div>
        : assets.map((a,i) => (
          <div key={i} style={{ display:"grid", gridTemplateColumns:"180px 100px 200px 100px 100px", padding:"12px 16px", borderBottom:"1px solid rgba(255,255,255,0.04)", fontSize:12, alignItems:"center" }}>
            <span style={{ fontWeight:600 }}>{a.name}</span>
            <span style={{ color:"rgba(255,255,255,0.4)" }}>{a.assetType}</span>
            <span style={{ fontFamily:"monospace", fontSize:10, color:"#8b5cf6" }}>{a.contractAddress || "Not deployed"}</span>
            <span>{a.contractAddress ? "Polygon" : "—"}</span>
            <span style={{ fontSize:10, padding:"2px 6px", borderRadius:4, background:a.contractAddress?"rgba(34,197,94,0.1)":"rgba(255,255,255,0.05)", color:a.contractAddress?"#22c55e":"rgba(255,255,255,0.4)", fontWeight:700 }}>{a.contractAddress ? "Deployed" : "Pending"}</span>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
