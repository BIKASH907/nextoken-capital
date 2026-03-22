import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [stats, setStats] = useState({ users: 0, investments: 0, assets: 0 });
  useEffect(() => {
    fetch("/api/admin/stats").then(r => r.json()).then(setStats).catch(() => {});
  }, []);
  return (
    <>
      <Head><title>Admin — Nextoken Capital</title></Head>
      <style>{`.a{min-height:100vh;background:#0B0E11;color:#fff;padding:40px 20px;font-family:sans-serif}.ai{max-width:900px;margin:0 auto}.ag{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px}.ac{background:#0F1318;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:24px}.av{font-size:2rem;font-weight:900;color:#F0B90B;margin-bottom:4px}.al{font-size:12px;color:rgba(255,255,255,0.4);text-transform:uppercase}@media(max-width:600px){.ag{grid-template-columns:1fr}}`}</style>
      <div className="a"><div className="ai">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28}}>
          <h1 style={{fontSize:22,fontWeight:900,margin:0}}>Admin Dashboard</h1>
          <Link href="/" style={{padding:"8px 16px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:7,color:"rgba(255,255,255,0.7)",fontSize:13,textDecoration:"none"}}>Back to site</Link>
        </div>
        <div className="ag">
          <div className="ac"><div className="av">{stats.users}</div><div className="al">Users</div></div>
          <div className="ac"><div className="av">{stats.investments}</div><div className="al">Investments</div></div>
          <div className="ac"><div className="av">{stats.assets}</div><div className="al">Assets</div></div>
        </div>
        <p style={{fontSize:13,color:"rgba(255,255,255,0.3)"}}>Connect /api/admin/stats for live data.</p>
      </div></div>
    </>
  );
}
