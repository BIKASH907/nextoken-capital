import { useEffect, useState } from "react";
import Head from "next/head";
import AdminShell from "../../components/admin/AdminShell";

const SAVED_VIEWS = [
  { name:"Morning Queue", desc:"Pending review + drafts", filters:{status:"review"} },
  { name:"High Value", desc:"Target raise > €5M", filters:{minValue:5000000} },
  { name:"Live Listings", desc:"Currently accepting", filters:{status:"live"} },
];

const SC = {
  draft:{bg:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.5)"},
  review:{bg:"rgba(240,185,11,0.1)",color:"#F0B90B"},
  approved:{bg:"rgba(59,130,246,0.1)",color:"#3B82F6"},
  live:{bg:"rgba(14,203,129,0.1)",color:"#0ECB81"},
  closing:{bg:"rgba(240,185,11,0.1)",color:"#F0B90B"},
  closed:{bg:"rgba(99,102,241,0.1)",color:"#818CF8"},
  cancelled:{bg:"rgba(255,77,77,0.08)",color:"#FF4D4D"},
};

export default function ListingsModPage() {
  const [assets, setAssets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [comment, setComment] = useState("");
  const [msg, setMsg] = useState("");
  const [fStatus, setFStatus] = useState("all");
  const [fType, setFType] = useState("all");
  const [fRisk, setFRisk] = useState("all");
  const [fMinValue, setFMinValue] = useState("");
  const [fMaxValue, setFMaxValue] = useState("");
  const [fYield, setFYield] = useState("all");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    if (!t) return;
    fetch("/api/admin/assets", { headers: { Authorization: `Bearer ${t}` } })
      .then(r => r.json()).then(d => { if (d.assets) setAssets(d.assets); });
  }, []);

  const applyView = (v) => {
    if (v.filters.status) setFStatus(v.filters.status);
    if (v.filters.minValue) setFMinValue(String(v.filters.minValue));
  };

  const clearFilters = () => { setFStatus("all"); setFType("all"); setFRisk("all"); setFMinValue(""); setFMaxValue(""); setFYield("all"); setSearch(""); };

  const updateStatus = async (id, status) => {
    const t = localStorage.getItem("adminToken");
    const r = await fetch(`/api/admin/assets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${t}` },
      body: JSON.stringify({ status, adminComment: comment }),
    });
    if (r.ok) {
      setMsg(`Status → ${status}`);
      setAssets(prev => prev.map(a => a._id === id ? {...a, status} : a));
      setSelected(prev => prev ? {...prev, status} : null);
      setComment("");
    }
  };

  const filtered = assets.filter(a => {
    if (search && !`${a.name} ${a.ticker} ${a.issuerName}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (fStatus !== "all" && a.status !== fStatus) return false;
    if (fType !== "all" && a.assetType !== fType) return false;
    if (fRisk !== "all" && a.riskLevel !== fRisk) return false;
    if (fMinValue && (a.targetRaise||0) < Number(fMinValue)) return false;
    if (fMaxValue && (a.targetRaise||0) > Number(fMaxValue)) return false;
    if (fYield === "high" && (a.targetROI||0) < 15) return false;
    if (fYield === "medium" && ((a.targetROI||0) < 8 || (a.targetROI||0) >= 15)) return false;
    if (fYield === "low" && (a.targetROI||0) >= 8) return false;
    return true;
  });

  return (
    <>
      <Head><title>Listing Moderation — Admin</title></Head>
      <AdminShell title="Listing Moderation Pipeline" subtitle={`${assets.length} total · ${filtered.length} shown · Maker-Checker workflow`}>
        <style>{`
          .lf-views{display:flex;gap:8px;margin-bottom:14px}
          .lf-view{padding:7px 14px;border-radius:8px;font-size:11px;font-weight:600;cursor:pointer;border:1px solid rgba(255,255,255,0.07);background:#0F1318;color:rgba(255,255,255,0.5);font-family:inherit}
          .lf-view:hover{border-color:rgba(240,185,11,0.3);color:#F0B90B}
          .lf-bar{display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap}
          .lf-search{flex:1;min-width:200px;background:#161B22;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:9px 14px;font-size:13px;color:#fff;outline:none;font-family:inherit}
          .lf-toggle{padding:7px 14px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;border:1px solid rgba(240,185,11,0.25);background:rgba(240,185,11,0.06);color:#F0B90B;font-family:inherit}
          .lf-clear{padding:7px 14px;border-radius:8px;font-size:12px;cursor:pointer;border:1px solid rgba(255,255,255,0.1);background:none;color:rgba(255,255,255,0.4);font-family:inherit}
          .lf-panel{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:16px;margin-bottom:14px}
          .lf-row{display:flex;gap:20px;flex-wrap:wrap;margin-bottom:10px}
          .lf-group{display:flex;flex-direction:column;gap:5px}
          .lf-label{font-size:10px;font-weight:700;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:.5px}
          .lf-chips{display:flex;gap:4px;flex-wrap:wrap}
          .lf-chip{padding:4px 11px;border-radius:20px;font-size:11px;font-weight:600;cursor:pointer;border:1px solid rgba(255,255,255,0.08);background:none;color:rgba(255,255,255,0.4);font-family:inherit}
          .lf-chip.on{background:rgba(240,185,11,0.1);color:#F0B90B;border-color:rgba(240,185,11,0.3)}
          .lf-input{background:#161B22;border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:6px 10px;font-size:12px;color:#fff;outline:none;font-family:inherit;width:100px}
          .lf-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
          .lf-card{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:18px}
          .lf-row-item{display:flex;justify-content:space-between;align-items:center;padding:11px 0;border-bottom:1px solid rgba(255,255,255,0.04);cursor:pointer}
          .lf-row-item:last-child{border:none}
          .lf-row-item:hover{opacity:.8}
          .lf-badge{padding:3px 10px;border-radius:20px;font-size:10px;font-weight:700}
          .lf-detail{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid rgba(255,255,255,0.04);font-size:13px}
          .lf-lbl{color:rgba(255,255,255,0.4)}
          .lf-val{font-weight:600;color:#fff}
          .lf-textarea{width:100%;background:#161B22;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px;font-size:13px;color:#fff;outline:none;font-family:inherit;resize:vertical;min-height:50px;margin:8px 0}
          .lf-btn{padding:7px 14px;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;border:none;font-family:inherit;margin-right:6px}
          .lf-btn-g{background:rgba(14,203,129,0.15);color:#0ECB81;border:1px solid rgba(14,203,129,0.3)}
          .lf-btn-b{background:rgba(59,130,246,0.1);color:#3B82F6;border:1px solid rgba(59,130,246,0.25)}
          .lf-btn-r{background:rgba(255,77,77,0.1);color:#ff6b6b;border:1px solid rgba(255,77,77,0.2)}
          .lf-msg{padding:8px 12px;border-radius:8px;font-size:12px;margin-top:8px;background:rgba(14,203,129,0.1);border:1px solid rgba(14,203,129,0.2);color:#0ECB81}
          .lf-workflow{display:flex;gap:6px;margin-bottom:16px;padding:12px;background:rgba(240,185,11,0.03);border:1px solid rgba(240,185,11,0.1);border-radius:10px}
          .lf-step{flex:1;text-align:center;padding:6px;border-radius:6px;font-size:10px;font-weight:700;color:rgba(255,255,255,0.25)}
          .lf-step.active{background:rgba(240,185,11,0.1);color:#F0B90B;border:1px solid rgba(240,185,11,0.2)}
          .lf-step.done{background:rgba(14,203,129,0.06);color:#0ECB81}
        `}</style>

        {/* Saved Views */}
        <div className="lf-views">
          <span style={{fontSize:10,color:"rgba(255,255,255,0.2)",alignSelf:"center"}}>Smart Folders:</span>
          {SAVED_VIEWS.map(v => (
            <button key={v.name} className="lf-view" onClick={()=>applyView(v)}>{v.name}</button>
          ))}
        </div>

        {/* Search + Filters Toggle */}
        <div className="lf-bar">
          <input className="lf-search" placeholder="Search name, ticker, issuer..." value={search} onChange={e=>setSearch(e.target.value)} />
          <button className="lf-toggle" onClick={()=>setShowFilters(!showFilters)}>🔍 Filters</button>
          <button className="lf-clear" onClick={clearFilters}>✕ Clear</button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="lf-panel">
            <div className="lf-row">
              <div className="lf-group">
                <div className="lf-label">Approval Stage</div>
                <div className="lf-chips">
                  {["all","draft","review","approved","live","closing","closed","cancelled"].map(v => (
                    <button key={v} className={`lf-chip ${fStatus===v?"on":""}`} onClick={()=>setFStatus(v)}>{v==="all"?"All":v.charAt(0).toUpperCase()+v.slice(1)}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="lf-row">
              <div className="lf-group">
                <div className="lf-label">Asset Category</div>
                <div className="lf-chips">
                  {[["all","All"],["real_estate","Real Estate"],["bond","Bonds"],["equity","Equity"],["energy","Energy"],["commodity","Commodity"],["infrastructure","Infrastructure"]].map(([v,l]) => (
                    <button key={v} className={`lf-chip ${fType===v?"on":""}`} onClick={()=>setFType(v)}>{l}</button>
                  ))}
                </div>
              </div>
              <div className="lf-group">
                <div className="lf-label">Risk Level</div>
                <div className="lf-chips">
                  {[["all","All"],["low","Low"],["medium","Medium"],["high","High"]].map(([v,l]) => (
                    <button key={v} className={`lf-chip ${fRisk===v?"on":""}`} onClick={()=>setFRisk(v)}>{l}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="lf-row">
              <div className="lf-group">
                <div className="lf-label">Total Value Range (EUR)</div>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <input className="lf-input" type="number" placeholder="Min" value={fMinValue} onChange={e=>setFMinValue(e.target.value)} />
                  <span style={{color:"rgba(255,255,255,0.2)"}}>—</span>
                  <input className="lf-input" type="number" placeholder="Max" value={fMaxValue} onChange={e=>setFMaxValue(e.target.value)} />
                </div>
              </div>
              <div className="lf-group">
                <div className="lf-label">Expected Yield (APY)</div>
                <div className="lf-chips">
                  {[["all","All"],["low","< 8%"],["medium","8–15%"],["high","> 15%"]].map(([v,l]) => (
                    <button key={v} className={`lf-chip ${fYield===v?"on":""}`} onClick={()=>setFYield(v)}>{l}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Workflow */}
        <div className="lf-workflow">
          {["Draft","Review","Approved","Live"].map((s,i) => (
            <div key={s} className={`lf-step ${selected ? (["draft","review","approved","live"].indexOf(selected.status)>=i?(["draft","review","approved","live"].indexOf(selected.status)>i?"done":"active"):"") : ""}`}>{s}</div>
          ))}
        </div>

        {/* Grid */}
        <div className="lf-grid">
          <div className="lf-card">
            <div style={{fontSize:12,color:"rgba(255,255,255,0.3)",marginBottom:10}}>Showing {filtered.length} of {assets.length}</div>
            {filtered.length === 0 ? <div style={{textAlign:"center",padding:32,color:"rgba(255,255,255,0.2)",fontSize:13}}>No listings match</div> :
              filtered.map(a => {
                const s = SC[a.status]||SC.draft;
                return (
                  <div key={a._id} className="lf-row-item" onClick={()=>{setSelected(a);setMsg("");}}>
                    <div>
                      <div style={{fontSize:13,fontWeight:700,color:"#fff"}}>{a.name}</div>
                      <div style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>{a.ticker} · {a.assetType?.replace("_"," ")} · €{(a.targetRaise||0).toLocaleString()}</div>
                    </div>
                    <span className="lf-badge" style={{background:s.bg,color:s.color}}>{a.status}</span>
                  </div>
                );
              })
            }
          </div>
          <div className="lf-card">
            {!selected ? <div style={{textAlign:"center",padding:50,color:"rgba(255,255,255,0.2)"}}>Select listing</div> : (
              <>
                <div style={{fontSize:16,fontWeight:800,color:"#fff",marginBottom:4}}>{selected.name}</div>
                <div style={{fontSize:12,color:"#F0B90B",marginBottom:14}}>{selected.ticker}</div>
                {[["Type",selected.assetType?.replace("_"," ")],["Issuer",selected.issuerName||"Admin"],["Target","EUR "+(selected.targetRaise?.toLocaleString()||"—")],["ROI",selected.targetROI?selected.targetROI+"%":"—"],["Risk",selected.riskLevel],["Status",selected.status]].map(([l,v]) => <div key={l} className="lf-detail"><span className="lf-lbl">{l}</span><span className="lf-val">{v}</span></div>)}
                <textarea className="lf-textarea" value={comment} onChange={e=>setComment(e.target.value)} placeholder="Admin note..." />
                <div>
                  <button className="lf-btn lf-btn-g" onClick={()=>updateStatus(selected._id,"approved")}>✅ Approve</button>
                  <button className="lf-btn lf-btn-b" onClick={()=>updateStatus(selected._id,"live")}>🚀 Live</button>
                  <button className="lf-btn lf-btn-r" onClick={()=>updateStatus(selected._id,"cancelled")}>❌ Reject</button>
                </div>
                {msg && <div className="lf-msg">{msg}</div>}
              </>
            )}
          </div>
        </div>
      </AdminShell>
    </>
  );
}
