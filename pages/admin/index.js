import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    fetch("/api/admin/stats").then(r=>r.json()).then(setStats).catch(()=>setStats({users:0,investments:0,assets:0}));
  }, []);
  return (
    <>
      <Head><title>Admin — Nextoken Capital</title></Head>
      <style>{`.adm{min-height:100vh;background:#0B0E11;color:#fff;padding:40px 20px;font-family:sans-serif}.adm-inner{max-width:900px;margin:0 auto}.adm-title{font-size:22px;font-weight:900;margin-bottom:28px}.adm-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px}.adm-card{background:#0F1318;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:24px}.adm-v{font-size:2rem;font-weight:900;color:#F0B90B;margin-bottom:4px}.adm-l{font-size:12px;color:rgba(255,255,255,0.4);text-transform:uppercase}.adm-note{font-size:13px;color:rgba(255,255,255,0.3);padding:16px;background:#0F1318;border-radius:10px;border:1px solid rgba(255,255,255,0.07)}@media(max-width:600px){.adm-grid{grid-template-columns:1fr}}`}</style>
      <div className="adm"><div className="adm-inner">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28,flexWrap:"wrap",gap:12}}>
          <div className="adm-title">Admin Dashboard</div>
          <Link href="/" style={{padding:"8px 16px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:7,color:"rgba(255,255,255,0.7)",fontSize:13,textDecoration:"none"}}>Back to site</Link>
        </div>
        <div className="adm-grid">
          <div className="adm-card"><div className="adm-v">{stats?.users??0}</div><div className="adm-l">Total Users</div></div>
          <div className="adm-card"><div className="adm-v">{stats?.investments??0}</div><div className="adm-l">Investments</div></div>
          <div className="adm-card"><div className="adm-v">{stats?.assets??0}</div><div className="adm-l">Assets</div></div>
        </div>
        <div className="adm-note">Connect /api/admin/stats to show live data. Add authentication before production.</div>
      </div></div>
    </>
  );
}
