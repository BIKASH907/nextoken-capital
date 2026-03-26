import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminShell from "../../components/admin/AdminShell";
export default function ListingsMod() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = localStorage.getItem("adminToken"); if(!t) router.push("/admin/login"); setToken(t); }, []);
  useEffect(() => { if(token) load(); }, [token]);
  const headers = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
  const load = () => fetch("/api/admin/assets", { headers }).then(r=>r.json()).then(d=>setAssets(d.assets||[])).finally(()=>setLoading(false));
  const approve = async (id, action) => {
    await fetch("/api/admin/assets/approve", { method: "POST", headers, body: JSON.stringify({ assetId: id, action }) });
    load();
  };
  const badge = (s) => { const c = { live:"#22c55e", draft:"#6b7280", pending_compliance:"#f59e0b", compliance_approved:"#3b82f6", pending_finance:"#f59e0b", finance_approved:"#3b82f6", pending_final:"#8b5cf6", rejected:"#ef4444" }; return <span style={{ fontSize:10, padding:"2px 8px", borderRadius:4, background:(c[s]||"#666")+"15", color:c[s]||"#666", fontWeight:700 }}>{(s||"draft").replace(/_/g," ")}</span>; };
  return (
    <AdminShell title="Listings Moderation" subtitle="Review and approve asset listings.">
      <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
        {loading ? <div style={{ padding:30, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>Loading...</div>
        : assets.length === 0 ? <div style={{ padding:30, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>No listings</div>
        : assets.map((a,i) => (
          <div key={i} style={{ padding:"14px 20px", borderBottom:"1px solid rgba(255,255,255,0.04)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div><div style={{ fontSize:14, fontWeight:600 }}>{a.name}</div><div style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>{a.assetType} · EUR {(a.targetRaise||0).toLocaleString()}</div></div>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              {badge(a.approvalStatus || a.status)}
              {a.approvalStatus !== "live" && <button onClick={()=>approve(a._id,"approve")} style={{ padding:"4px 12px", borderRadius:4, background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.2)", color:"#22c55e", fontSize:10, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Approve</button>}
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
