import { useEffect, useState } from "react";
import Head from "next/head";
import AdminShell from "../../components/admin/AdminShell";

const STATUS_COLORS = {
  draft:    { bg:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.5)" },
  review:   { bg:"rgba(240,185,11,0.1)",   color:"#F0B90B" },
  approved: { bg:"rgba(59,130,246,0.1)",   color:"#3B82F6" },
  live:     { bg:"rgba(14,203,129,0.1)",   color:"#0ECB81" },
  closing:  { bg:"rgba(240,185,11,0.1)",   color:"#F0B90B" },
  closed:   { bg:"rgba(99,102,241,0.1)",   color:"#818CF8" },
  cancelled:{ bg:"rgba(255,77,77,0.08)",   color:"#FF4D4D" },
};

export default function ListingsModPage() {
  const [assets, setAssets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("review");
  const [comment, setComment] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    if (!t) return;
    fetch("/api/admin/assets", { headers: { Authorization: `Bearer ${t}` } })
      .then(r => r.json()).then(d => { if (d.assets) setAssets(d.assets); });
  }, []);

  const updateStatus = async (id, status) => {
    const t = localStorage.getItem("adminToken");
    const r = await fetch(`/api/admin/assets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${t}` },
      body: JSON.stringify({ status, adminComment: comment }),
    });
    if (r.ok) {
      setMsg(`Status updated to ${status}`);
      setAssets(prev => prev.map(a => a._id === id ? {...a, status} : a));
      setSelected(prev => prev ? {...prev, status} : null);
      setComment("");
    } else setMsg("Update failed");
  };

  const filtered = filter === "all" ? assets : assets.filter(a => a.status === filter);

  return (
    <>
      <Head><title>Listing Moderation — Admin</title></Head>
      <AdminShell title="Listing Moderation Pipeline" subtitle="Maker-Checker workflow — one admin proposes, a second approves">
        <style>{`
          .lm-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
          .lm-card{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:20px;margin-bottom:12px}
          .lm-filters{display:flex;gap:6px;margin-bottom:16px;flex-wrap:wrap}
          .lm-fbtn{padding:5px 14px;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid rgba(255,255,255,0.08);background:none;color:rgba(255,255,255,0.45);font-family:inherit}
          .lm-fbtn.on{background:rgba(240,185,11,0.1);color:#F0B90B;border-color:rgba(240,185,11,0.3)}
          .lm-row{display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.04);cursor:pointer}
          .lm-row:last-child{border:none}
          .lm-row:hover{opacity:.8}
          .lm-badge{padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700}
          .lm-detail{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04);font-size:13px}
          .lm-lbl{color:rgba(255,255,255,0.4)}
          .lm-val{font-weight:600;color:#fff}
          .lm-textarea{width:100%;background:#161B22;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px 12px;font-size:13px;color:#fff;outline:none;font-family:inherit;resize:vertical;min-height:60px;margin:10px 0}
          .lm-btn{padding:8px 16px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;border:none;font-family:inherit;margin-right:6px}
          .lm-btn-green{background:rgba(14,203,129,0.15);color:#0ECB81;border:1px solid rgba(14,203,129,0.3)}
          .lm-btn-red{background:rgba(255,77,77,0.1);color:#ff6b6b;border:1px solid rgba(255,77,77,0.2)}
          .lm-btn-blue{background:rgba(59,130,246,0.1);color:#3B82F6;border:1px solid rgba(59,130,246,0.25)}
          .lm-msg{padding:10px;border-radius:8px;font-size:12px;margin-top:10px;background:rgba(14,203,129,0.1);border:1px solid rgba(14,203,129,0.2);color:#0ECB81}
          .lm-workflow{display:flex;gap:8px;margin-bottom:20px;padding:14px;background:rgba(240,185,11,0.04);border:1px solid rgba(240,185,11,0.12);border-radius:10px}
          .lm-step{flex:1;text-align:center;padding:8px;border-radius:8px;font-size:11px;font-weight:700;color:rgba(255,255,255,0.3)}
          .lm-step.active{background:rgba(240,185,11,0.1);color:#F0B90B;border:1px solid rgba(240,185,11,0.25)}
          .lm-step.done{background:rgba(14,203,129,0.08);color:#0ECB81}
          .lm-arrow{color:rgba(255,255,255,0.15);display:flex;align-items:center;font-size:16px}
        `}</style>

        {/* Workflow visualization */}
        <div className="lm-workflow">
          {["Draft","Review","Approved","Live"].map((s,i) => (
            <><div key={s} className={`lm-step ${selected ? (["draft","review","approved","live"].indexOf(selected.status) >= i ? (["draft","review","approved","live"].indexOf(selected.status) > i ? "done" : "active") : "") : ""}`}>{s}</div>{i<3 && <div className="lm-arrow">→</div>}</>
          ))}
        </div>

        <div className="lm-grid">
          <div>
            <div className="lm-filters">
              {["all","review","approved","live","draft","closed"].map(f => (
                <button key={f} className={`lm-fbtn ${filter===f?"on":""}`} onClick={()=>setFilter(f)}>
                  {f.charAt(0).toUpperCase()+f.slice(1)} ({f==="all"?assets.length:assets.filter(a=>a.status===f).length})
                </button>
              ))}
            </div>
            <div className="lm-card">
              {filtered.length === 0 ? <div style={{textAlign:"center",padding:40,color:"rgba(255,255,255,0.25)",fontSize:13}}>No {filter} listings</div> :
                filtered.map(a => {
                  const sc = STATUS_COLORS[a.status] || STATUS_COLORS.draft;
                  return (
                    <div key={a._id} className="lm-row" onClick={()=>{setSelected(a);setMsg("");}}>
                      <div>
                        <div style={{fontSize:13,fontWeight:700,color:"#fff"}}>{a.name}</div>
                        <div style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>{a.ticker} · {a.assetType?.replace("_"," ")} · {a.issuerName||"Admin"}</div>
                      </div>
                      <span className="lm-badge" style={{background:sc.bg,color:sc.color}}>{a.status}</span>
                    </div>
                  );
                })
              }
            </div>
          </div>
          <div>
            {!selected ? <div className="lm-card" style={{textAlign:"center",padding:60,color:"rgba(255,255,255,0.25)"}}>Select a listing to review</div> : (
              <div className="lm-card">
                <div style={{fontSize:16,fontWeight:800,color:"#fff",marginBottom:4}}>{selected.name}</div>
                <div style={{fontSize:12,color:"#F0B90B",fontWeight:700,marginBottom:16}}>{selected.ticker}</div>
                {[
                  ["Type", selected.assetType?.replace("_"," ")],
                  ["Issuer", selected.issuerName || "Admin"],
                  ["Location", selected.location || "—"],
                  ["Target Raise", "EUR " + (selected.targetRaise?.toLocaleString() || "—")],
                  ["Min Investment", "EUR " + (selected.minInvestment || "—")],
                  ["Target ROI", selected.targetROI ? selected.targetROI + "%" : "—"],
                  ["Term", selected.term ? selected.term + " months" : "—"],
                  ["Risk", selected.riskLevel || "—"],
                  ["Token Standard", selected.tokenStandard || "ERC-3643"],
                  ["Created", new Date(selected.createdAt).toLocaleString()],
                ].map(([l,v]) => <div key={l} className="lm-detail"><span className="lm-lbl">{l}</span><span className="lm-val">{v}</span></div>)}

                <div style={{margin:"16px 0 6px",fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.3)",textTransform:"uppercase"}}>Checker Decision</div>
                <textarea className="lm-textarea" value={comment} onChange={e=>setComment(e.target.value)} placeholder="Compliance note..." />
                <div>
                  <button className="lm-btn lm-btn-green" onClick={()=>updateStatus(selected._id,"approved")}>✅ Approve (Checker)</button>
                  <button className="lm-btn lm-btn-blue" onClick={()=>updateStatus(selected._id,"live")}>🚀 Go Live</button>
                  <button className="lm-btn lm-btn-red" onClick={()=>updateStatus(selected._id,"cancelled")}>❌ Reject</button>
                </div>
                {msg && <div className="lm-msg">{msg}</div>}
              </div>
            )}
          </div>
        </div>
      </AdminShell>
    </>
  );
}
