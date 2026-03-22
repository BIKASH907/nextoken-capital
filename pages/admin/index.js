import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(r => r.json())
      .then(setStats)
      .catch(() => setStats({ users: 0, investments: 0, assets: 0 }));
  }, []);

  return (
    <>
      <Head><title>Admin — Nextoken Capital</title></Head>
      <style>{`
        .adm { min-height:100vh; background:#0B0E11; color:#fff; padding:40px 20px; font-family:'DM Sans',sans-serif; }
        .adm-inner { max-width:1100px; margin:0 auto; }
        .adm-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:36px; flex-wrap:wrap; gap:12px; }
        .adm-title { font-size:22px; font-weight:900; color:#fff; }
        .adm-back { padding:8px 18px; background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.12); border-radius:7px; color:rgba(255,255,255,0.7); font-size:13px; text-decoration:none; }
        .adm-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:32px; }
        .adm-card { background:#0F1318; border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:24px; }
        .adm-card-v { font-size:2rem; font-weight:900; color:#F0B90B; margin-bottom:5px; }
        .adm-card-l { font-size:12px; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:1px; }
        .adm-note { font-size:13px; color:rgba(255,255,255,0.3); line-height:1.7; padding:20px; background:#0F1318; border-radius:10px; border:1px solid rgba(255,255,255,0.07); }
        @media(max-width:600px){ .adm-grid{ grid-template-columns:1fr; } }
      `}</style>
      <div className="adm">
        <div className="adm-inner">
          <div className="adm-header">
            <div className="adm-title">Admin Dashboard</div>
            <Link href="/" className="adm-back">← Back to site</Link>
          </div>
          <div className="adm-grid">
            <div className="adm-card"><div className="adm-card-v">{stats?.users ?? "—"}</div><div className="adm-card-l">Total Users</div></div>
            <div className="adm-card"><div className="adm-card-v">{stats?.investments ?? "—"}</div><div className="adm-card-l">Investments</div></div>
            <div className="adm-card"><div className="adm-card-v">{stats?.assets ?? "—"}</div><div className="adm-card-l">Assets</div></div>
          </div>
          <div className="adm-note">
            ⚠️ This admin panel is a placeholder. Connect your MongoDB stats API at <code>/api/admin/stats</code> to see live data. Protect this route with authentication before going to production.
          </div>
        </div>
      </div>
    </>
  );
}