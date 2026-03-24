import { useEffect, useState } from "react";
import Head from "next/head";
import AdminShell from "../../components/admin/AdminShell";

export default function TreasuryPage() {
  const [tab, setTab] = useState("fees");
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    if (!t) return;
    fetch("/api/admin/assets", { headers: { Authorization: `Bearer ${t}` } })
      .then(r => r.json()).then(d => { if (d.assets) setAssets(d.assets); });
  }, []);

  const totalRaise = assets.reduce((s,a) => s + (a.targetRaise || 0), 0);
  const totalRaised = assets.reduce((s,a) => s + (a.raisedAmount || 0), 0);

  const tabs = [
    { id:"fees", label:"Fee Treasury" },
    { id:"aum", label:"AUM Analytics" },
    { id:"yield", label:"Yield Distribution" },
    { id:"reserves", label:"Proof of Reserve" },
  ];

  return (
    <>
      <Head><title>Treasury — Admin</title></Head>
      <AdminShell title="Financial Control & Revenue" subtitle="Fee treasury, AUM analytics, yield distribution, and reserve verification">
        <style>{`
          .ft-tabs{display:flex;gap:4px;margin-bottom:20px;border-bottom:1px solid rgba(255,255,255,0.07)}
          .ft-tab{padding:10px 18px;font-size:13px;font-weight:600;color:rgba(255,255,255,0.4);background:none;border:none;border-bottom:2px solid transparent;cursor:pointer;font-family:inherit}
          .ft-tab.on{color:#F0B90B;border-bottom-color:#F0B90B}
          .ft-card{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:20px;margin-bottom:16px}
          .ft-stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}
          .ft-stat{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:16px}
          .ft-stat-v{font-size:1.4rem;font-weight:900;margin-bottom:3px}
          .ft-stat-l{font-size:10px;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:.5px}
          .ft-table{width:100%;border-collapse:collapse}
          .ft-table th{text-align:left;font-size:10px;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:.5px;padding:10px 14px;font-weight:700;border-bottom:1px solid rgba(255,255,255,0.06)}
          .ft-table td{padding:10px 14px;font-size:13px;border-bottom:1px solid rgba(255,255,255,0.04)}
          .ft-bar{height:6px;background:rgba(255,255,255,0.06);border-radius:3px;overflow:hidden;width:100px}
          .ft-bar-fill{height:100%;background:#F0B90B;border-radius:3px}
        `}</style>

        <div className="ft-tabs">{tabs.map(t => <button key={t.id} className={`ft-tab ${tab===t.id?"on":""}`} onClick={()=>setTab(t.id)}>{t.label}</button>)}</div>

        {tab === "fees" && <>
        <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
          {["All Fees","0.80% Issuance","0.25% Trading"].map(f => <button key={f} style={{padding:"5px 12px",borderRadius:20,fontSize:11,fontWeight:600,cursor:"pointer",border:"1px solid rgba(240,185,11,0.25)",background:"rgba(240,185,11,0.06)",color:"#F0B90B",fontFamily:"inherit"}}>{f}</button>)}
        </div>
          <div className="ft-stat-grid">
            <div className="ft-stat"><div className="ft-stat-v" style={{color:"#F0B90B"}}>€{(totalRaised*0.008).toFixed(0)}</div><div className="ft-stat-l">Issuance Fees (0.80%)</div></div>
            <div className="ft-stat"><div className="ft-stat-v" style={{color:"#F0B90B"}}>€{(totalRaised*0.0025).toFixed(0)}</div><div className="ft-stat-l">Trading Fees (0.25%)</div></div>
            <div className="ft-stat"><div className="ft-stat-v" style={{color:"#0ECB81"}}>€{((totalRaised*0.008)+(totalRaised*0.0025)).toFixed(0)}</div><div className="ft-stat-l">Total Revenue</div></div>
            <div className="ft-stat"><div className="ft-stat-v" style={{color:"#fff"}}>{assets.length}</div><div className="ft-stat-l">Fee-Generating Assets</div></div>
          </div>
          <div className="ft-card">
            <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Fee Breakdown by Asset</div>
            <table className="ft-table">
              <thead><tr><th>Asset</th><th>Raised</th><th>Issuance Fee</th><th>Trading Fee (est)</th><th>Total</th></tr></thead>
              <tbody>
                {assets.map(a => (
                  <tr key={a._id}>
                    <td style={{fontWeight:600,color:"#fff"}}>{a.name} <span style={{color:"#F0B90B",fontSize:11}}>({a.ticker})</span></td>
                    <td>€{(a.raisedAmount||0).toLocaleString()}</td>
                    <td style={{color:"#F0B90B"}}>€{((a.raisedAmount||0)*0.008).toFixed(0)}</td>
                    <td style={{color:"#F0B90B"}}>€{((a.raisedAmount||0)*0.0025).toFixed(0)}</td>
                    <td style={{fontWeight:700,color:"#0ECB81"}}>€{(((a.raisedAmount||0)*0.008)+((a.raisedAmount||0)*0.0025)).toFixed(0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>}

        {tab === "aum" && <>
          <div className="ft-stat-grid">
            <div className="ft-stat"><div className="ft-stat-v" style={{color:"#F0B90B"}}>€{totalRaise.toLocaleString()}</div><div className="ft-stat-l">Total AUM (Target)</div></div>
            <div className="ft-stat"><div className="ft-stat-v" style={{color:"#0ECB81"}}>€{totalRaised.toLocaleString()}</div><div className="ft-stat-l">AUM (Raised)</div></div>
            <div className="ft-stat"><div className="ft-stat-v" style={{color:"#fff"}}>{assets.filter(a=>a.assetType==="real_estate").length}</div><div className="ft-stat-l">Real Estate</div></div>
            <div className="ft-stat"><div className="ft-stat-v" style={{color:"#fff"}}>{assets.filter(a=>a.assetType==="bond").length}</div><div className="ft-stat-l">Bonds</div></div>
          </div>
          <div className="ft-card">
            <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>AUM by Asset</div>
            <table className="ft-table">
              <thead><tr><th>Asset</th><th>Type</th><th>Target</th><th>Raised</th><th>Progress</th></tr></thead>
              <tbody>
                {assets.map(a => {
                  const pct = a.targetRaise > 0 ? Math.round((a.raisedAmount||0)/a.targetRaise*100) : 0;
                  return (
                    <tr key={a._id}>
                      <td style={{fontWeight:600,color:"#fff"}}>{a.name}</td>
                      <td>{a.assetType?.replace("_"," ")}</td>
                      <td>€{(a.targetRaise||0).toLocaleString()}</td>
                      <td style={{color:"#0ECB81"}}>€{(a.raisedAmount||0).toLocaleString()}</td>
                      <td><div style={{display:"flex",alignItems:"center",gap:8}}><div className="ft-bar"><div className="ft-bar-fill" style={{width:pct+"%"}} /></div><span style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>{pct}%</span></div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>}

        {tab === "yield" && <div className="ft-card"><div style={{textAlign:"center",padding:40,color:"rgba(255,255,255,0.3)"}}>Yield distribution engine — triggers dividend/interest payouts. Connect payment rails to activate.</div></div>}
        {tab === "reserves" && <div className="ft-card"><div style={{textAlign:"center",padding:40,color:"rgba(255,255,255,0.3)"}}>Proof of Reserve — oracle-backed monitor comparing on-chain supply with off-chain balances. Requires oracle integration.</div></div>}
      </AdminShell>
    </>
  );
}
