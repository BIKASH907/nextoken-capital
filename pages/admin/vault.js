import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminShell from "../../components/admin/AdminShell";
export default function Vault() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = localStorage.getItem("adminToken"); if(!t) router.push("/admin/login"); setToken(t); }, []);
  useEffect(() => { if(token) fetch("/api/admin/issuer-documents", { headers:{ Authorization:"Bearer "+token } }).then(r=>r.json()).then(d=>setDocs(d.documents||[])).finally(()=>setLoading(false)); }, [token]);
  const badge = (s) => { const c = { approved:"#22c55e", pending:"#f59e0b", rejected:"#ef4444" }; return <span style={{ fontSize:10, padding:"2px 8px", borderRadius:4, background:(c[s]||"#666")+"15", color:c[s]||"#666", fontWeight:700 }}>{s}</span>; };
  return (
    <AdminShell title="Document Vault" subtitle="All issuer documents with version control.">
      <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:"200px 120px 100px 80px 100px", padding:"10px 16px", background:"rgba(255,255,255,0.03)", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase" }}>
          <span>Document</span><span>Type</span><span>Issuer</span><span>Version</span><span>Status</span>
        </div>
        {loading ? <div style={{ padding:30, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>Loading...</div>
        : docs.length === 0 ? <div style={{ padding:30, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>No documents</div>
        : docs.map((d,i) => (
          <div key={i} style={{ display:"grid", gridTemplateColumns:"200px 120px 100px 80px 100px", padding:"12px 16px", borderBottom:"1px solid rgba(255,255,255,0.04)", fontSize:12, alignItems:"center" }}>
            <span style={{ fontWeight:600 }}>{d.fileName || d.name}</span>
            <span style={{ color:"rgba(255,255,255,0.4)" }}>{d.docType || d.type}</span>
            <span style={{ fontSize:10 }}>{d.issuerName || "—"}</span>
            <span>v{d.version || 1}{d.isVersionLocked ? " 🔒" : ""}</span>
            {badge(d.status)}
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
