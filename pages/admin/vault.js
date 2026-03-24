import { useEffect, useState } from "react";
import Head from "next/head";
import AdminShell from "../../components/admin/AdminShell";

export default function VaultPage() {
  const [assets, setAssets] = useState([]);
  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    if (!t) return;
    fetch("/api/admin/assets", { headers: { Authorization: `Bearer ${t}` } })
      .then(r => r.json()).then(d => { if (d.assets) setAssets(d.assets); });
  }, []);

  const allDocs = assets.flatMap(a => (a.documents || []).map(d => ({ ...d, assetName: a.name, assetTicker: a.ticker })));

  return (
    <>
      <Head><title>Document Vault — Admin</title></Head>
      <AdminShell title="Document Authenticity Vault" subtitle="Secure view of deeds, bond certificates, and MiCA-compliant whitepapers">
        <style>{`
          .dv-card{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;overflow:hidden}
          .dv-table{width:100%;border-collapse:collapse}
          .dv-table th{text-align:left;font-size:10px;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:.5px;padding:12px 14px;font-weight:700;border-bottom:1px solid rgba(255,255,255,0.06);background:#161B22}
          .dv-table td{padding:12px 14px;font-size:12px;border-bottom:1px solid rgba(255,255,255,0.04);color:rgba(255,255,255,0.7)}
          .dv-stat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px}
          .dv-stat{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:16px}
          .dv-stat-v{font-size:1.4rem;font-weight:900;margin-bottom:3px;color:#F0B90B}
          .dv-stat-l{font-size:10px;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:.5px}
        `}</style>

        <div className="dv-stat-grid">
          <div className="dv-stat"><div className="dv-stat-v">{allDocs.length}</div><div className="dv-stat-l">Total Documents</div></div>
          <div className="dv-stat"><div className="dv-stat-v">{assets.length}</div><div className="dv-stat-l">Assets with Docs</div></div>
          <div className="dv-stat"><div className="dv-stat-v" style={{color:"#0ECB81"}}>Cloudinary</div><div className="dv-stat-l">Storage Provider</div></div>
        </div>

        <div className="dv-card">
          {allDocs.length === 0 ? (
            <div style={{padding:40,textAlign:"center",color:"rgba(255,255,255,0.25)",fontSize:13}}>No documents uploaded yet</div>
          ) : (
            <table className="dv-table">
              <thead><tr><th>Document</th><th>Type</th><th>Asset</th><th>Ticker</th><th>Action</th></tr></thead>
              <tbody>
                {allDocs.map((d,i) => (
                  <tr key={i}>
                    <td style={{fontWeight:600,color:"#fff"}}>{d.name || `Document ${i+1}`}</td>
                    <td>{d.type || "Unknown"}</td>
                    <td>{d.assetName}</td>
                    <td style={{color:"#F0B90B",fontWeight:600}}>{d.assetTicker}</td>
                    <td><a href={d.url} target="_blank" rel="noreferrer" style={{color:"#F0B90B",textDecoration:"none",fontSize:12,fontWeight:600}}>View →</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </AdminShell>
    </>
  );
}
