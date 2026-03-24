import AdminShell from "../../components/admin/AdminShell";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import AdminSidebar from "../../components/AdminSidebar";
export default function MarketPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState("");
  const [assets, setAssets] = useState([]);
  useEffect(() => {
    setMounted(true);
    const t = localStorage.getItem("adminToken");
    if (!t) { router.push("/admin/login"); return; }
    setToken(t);
  }, []);
  useEffect(() => {
    if (!token) return;
    fetch("/api/admin/assets", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { if (d.assets) setAssets(d.assets); });
  }, [token]);
  const liveAssets = assets.filter(a => a.status === "live");
  const totalRaise = assets.reduce((s, a) => s + (a.targetRaise || 0), 0);
  const totalRaised = assets.reduce((s, a) => s + (a.raisedAmount || 0), 0);
  const totalInvestors = assets.reduce((s, a) => s + (a.investorCount || 0), 0);
  if (!mounted) return <div style={{background:"#0B0E11",minHeight:"100vh"}} />;
  return (
    <>
      <Head><title>Market — Admin</title></Head>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{background:#0B0E11;color:#fff;font-family:'DM Sans',system-ui,sans-serif}.main{margin-left:220px;padding:32px;min-height:100vh}.stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:28px}.stat-card{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:24px}.stat-val{font-size:2rem;font-weight:900;color:#F0B90B}.stat-lbl{font-size:12px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:.5px;margin-top:4px}.card{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:24px;margin-bottom:20px}.asset-row{display:flex;align-items:center;gap:16px;padding:16px 0;border-bottom:1px solid rgba(255,255,255,0.05);cursor:pointer}.asset-row:last-child{border:none}.asset-row:hover{background:rgba(255,255,255,0.02)}.asset-img{width:48px;height:48px;border-radius:8px;object-fit:cover;background:#161B22;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}.progress-bar{height:6px;background:#161B22;border-radius:3px;overflow:hidden;margin-top:4px}.progress-fill{height:100%;background:#F0B90B;border-radius:3px;transition:width .3s}.badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700}.badge-green{background:rgba(14,203,129,0.12);color:#0ECB81}.badge-yellow{background:rgba(240,185,11,0.12);color:#F0B90B}.badge-gray{background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.5)}.empty{text-align:center;padding:60px;color:rgba(255,255,255,0.3)}`}</style>
      <AdminSidebar />
      <div className="main">
        <div style={{fontSize:22,fontWeight:900,marginBottom:4}}>Market Overview</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:24}}>Live asset performance and platform metrics</div>
        <div className="stat-grid">
          <div className="stat-card"><div className="stat-val">{assets.length}</div><div className="stat-lbl">Total Assets</div></div>
          <div className="stat-card"><div className="stat-val">{liveAssets.length}</div><div className="stat-lbl">Live Assets</div></div>
          <div className="stat-card"><div className="stat-val">EUR {(totalRaised/1000).toFixed(0)}K</div><div className="stat-lbl">Total Raised</div></div>
          <div className="stat-card"><div className="stat-val">{totalInvestors}</div><div className="stat-lbl">Total Investors</div></div>
        </div>
        <div className="card">
          <div style={{fontSize:15,fontWeight:700,marginBottom:16}}>All Assets Performance</div>
          {assets.length === 0 ? <div className="empty">No assets yet</div> : assets.map(a => {
            const pct = a.targetRaise ? Math.min(100, Math.round((a.raisedAmount||0)/a.targetRaise*100)) : 0;
            return (
              <div className="asset-row" key={a._id} onClick={() => router.push(`/admin/assets/${a._id}`)}>
                <div className="asset-img">{a.imageUrl ? <img src={a.imageUrl} style={{width:48,height:48,borderRadius:8,objectFit:"cover"}} alt="" /> : "🏢"}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}>
                    <div style={{fontWeight:700,fontSize:14}}>{a.name} <span style={{fontSize:11,color:"#F0B90B",letterSpacing:1}}>{a.ticker}</span></div>
                    <span className={`badge badge-${a.status==="live"?"green":a.status==="draft"?"yellow":"gray"}`}>{a.status}</span>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"rgba(255,255,255,0.4)",marginBottom:6}}>
                    <span>EUR {(a.raisedAmount||0).toLocaleString()} raised of EUR {(a.targetRaise||0).toLocaleString()}</span>
                    <span style={{color:"#0ECB81"}}>{pct}%</span>
                  </div>
                  <div className="progress-bar"><div className="progress-fill" style={{width:pct+"%"}} /></div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#0ECB81"}}>{a.targetROI ? a.targetROI+"%" : "—"}</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>ROI</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
