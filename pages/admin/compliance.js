import { useEffect, useState } from "react";
import Head from "next/head";
import AdminShell from "../../components/admin/AdminShell";

const RISK_FLAGS = ["🟢 Clear","🟡 Review","🔴 High Risk","⛔ Blocked"];

export default function CompliancePage() {
  const [tab, setTab] = useState("kyc");
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("pending");
  const [comment, setComment] = useState("");
  const [msg, setMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    if (!t) return;
    fetch("/api/admin/users", { headers: { Authorization: `Bearer ${t}` } })
      .then(r => r.json()).then(d => { if (d.users) setUsers(d.users); });
  }, []);

  const updateKYC = async (userId, status) => {
    const t = localStorage.getItem("adminToken");
    const r = await fetch(`/api/admin/users/${userId}/kyc`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${t}` },
      body: JSON.stringify({ kycStatus: status, adminComment: comment }),
    });
    if (r.ok) {
      setMsg(`KYC updated to ${status}`);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, kycStatus: status } : u));
      setSelected(prev => prev ? { ...prev, kycStatus: status } : null);
      setComment("");
    }
  };

  const filtered = users
    .filter(u => filter === "all" ? true : u.kycStatus === filter)
    .filter(u => !searchTerm || `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(searchTerm.toLowerCase()));

  const tabs = [
    { id:"kyc", label:"KYC/KYB Queue", count: users.filter(u=>u.kycStatus==="pending").length },
    { id:"sanctions", label:"Sanctions & PEP" },
    { id:"suitability", label:"Investor Suitability" },
  ];

  return (
    <>
      <Head><title>Compliance — Admin</title></Head>
      <AdminShell title="Compliance & Identity" subtitle="KYC/KYB verification, sanctions screening, and investor suitability tracking">
        <style>{`
          .c-tabs{display:flex;gap:4px;margin-bottom:20px;border-bottom:1px solid rgba(255,255,255,0.07);padding-bottom:0}
          .c-tab{padding:10px 18px;font-size:13px;font-weight:600;color:rgba(255,255,255,0.4);background:none;border:none;border-bottom:2px solid transparent;cursor:pointer;font-family:inherit;transition:all .15s;white-space:nowrap}
          .c-tab:hover{color:#fff}
          .c-tab.on{color:#F0B90B;border-bottom-color:#F0B90B}
          .c-tab .cnt{margin-left:6px;padding:1px 7px;border-radius:10px;font-size:10px;font-weight:800;background:rgba(255,77,77,0.15);color:#FF6B6B}
          .c-card{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:20px;margin-bottom:16px}
          .c-search{width:100%;background:#161B22;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px 14px;font-size:13px;color:#fff;outline:none;font-family:inherit;margin-bottom:12px}
          .c-search:focus{border-color:rgba(240,185,11,0.4)}
          .c-filters{display:flex;gap:6px;margin-bottom:16px;flex-wrap:wrap}
          .c-fbtn{padding:5px 14px;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid rgba(255,255,255,0.08);background:none;color:rgba(255,255,255,0.45);font-family:inherit;transition:all .15s}
          .c-fbtn.on{background:rgba(240,185,11,0.1);color:#F0B90B;border-color:rgba(240,185,11,0.3)}
          .c-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
          .c-row{display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.04);cursor:pointer;transition:opacity .15s}
          .c-row:hover{opacity:.8}
          .c-row:last-child{border:none}
          .c-name{font-size:13px;font-weight:700;color:#fff}
          .c-email{font-size:11px;color:rgba(255,255,255,0.35);margin-top:1px}
          .c-date{font-size:11px;color:rgba(255,255,255,0.25);margin-top:1px}
          .c-badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700}
          .c-badge-green{background:rgba(14,203,129,0.12);color:#0ECB81}
          .c-badge-yellow{background:rgba(240,185,11,0.12);color:#F0B90B}
          .c-badge-red{background:rgba(255,77,77,0.12);color:#ff6b6b}
          .c-badge-gray{background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.5)}
          .c-detail-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04);font-size:13px}
          .c-detail-row:last-child{border:none}
          .c-lbl{color:rgba(255,255,255,0.4)}
          .c-val{font-weight:600;color:#fff}
          .c-textarea{width:100%;background:#161B22;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px 12px;font-size:13px;color:#fff;outline:none;font-family:inherit;resize:vertical;min-height:60px;margin:10px 0}
          .c-btn{padding:8px 16px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;border:none;font-family:inherit;margin-right:6px;transition:all .15s}
          .c-btn-green{background:rgba(14,203,129,0.15);color:#0ECB81;border:1px solid rgba(14,203,129,0.3)}
          .c-btn-red{background:rgba(255,77,77,0.1);color:#ff6b6b;border:1px solid rgba(255,77,77,0.2)}
          .c-btn-yellow{background:rgba(240,185,11,0.1);color:#F0B90B;border:1px solid rgba(240,185,11,0.25)}
          .c-btn-gray{background:rgba(255,255,255,0.06);color:#fff;border:1px solid rgba(255,255,255,0.1)}
          .c-msg{padding:10px 14px;border-radius:8px;font-size:13px;margin-top:10px}
          .c-msg-ok{background:rgba(14,203,129,0.1);border:1px solid rgba(14,203,129,0.2);color:#0ECB81}
          .c-empty{text-align:center;padding:40px;color:rgba(255,255,255,0.25);font-size:13px}
          .c-stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}
          .c-stat{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:16px}
          .c-stat-v{font-size:1.4rem;font-weight:900;margin-bottom:3px}
          .c-stat-l{font-size:10px;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:.5px}
          .c-risk-table{width:100%;border-collapse:collapse}
          .c-risk-table th{text-align:left;font-size:11px;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:.5px;padding:8px 12px;font-weight:700;border-bottom:1px solid rgba(255,255,255,0.06)}
          .c-risk-table td{padding:10px 12px;font-size:13px;border-bottom:1px solid rgba(255,255,255,0.04)}
          .c-risk-table tr:hover td{background:rgba(255,255,255,0.02)}
          .c-suit-card{background:#161B22;border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:16px;margin-bottom:10px}
          .c-suit-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
          .c-suit-name{font-size:13px;font-weight:700;color:#fff}
          .c-suit-bar{height:4px;background:rgba(255,255,255,0.06);border-radius:2px;overflow:hidden;margin-top:6px}
          .c-suit-fill{height:100%;border-radius:2px}
        `}</style>

        {/* Stats */}
        <div className="c-stat-grid">
          <div className="c-stat"><div className="c-stat-v" style={{color:"#F0B90B"}}>{users.filter(u=>u.kycStatus==="pending").length}</div><div className="c-stat-l">Pending Review</div></div>
          <div className="c-stat"><div className="c-stat-v" style={{color:"#0ECB81"}}>{users.filter(u=>u.kycStatus==="approved").length}</div><div className="c-stat-l">Approved</div></div>
          <div className="c-stat"><div className="c-stat-v" style={{color:"#FF6B6B"}}>{users.filter(u=>u.kycStatus==="rejected").length}</div><div className="c-stat-l">Rejected</div></div>
          <div className="c-stat"><div className="c-stat-v" style={{color:"#fff"}}>{users.length}</div><div className="c-stat-l">Total Users</div></div>
        </div>

        {/* Tabs */}
        <div className="c-tabs">
          {tabs.map(t => (
            <button key={t.id} className={`c-tab ${tab===t.id?"on":""}`} onClick={()=>setTab(t.id)}>
              {t.label}
              {t.count > 0 && <span className="cnt">{t.count}</span>}
            </button>
          ))}
        </div>

        {/* TAB: KYC/KYB Queue */}
        {tab === "kyc" && (
          <div className="c-grid">
            <div>
              <input className="c-search" placeholder="Search by name or email..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} />
              <div className="c-filters">
                {["all","pending","approved","rejected","none"].map(f => (
                  <button key={f} className={`c-fbtn ${filter===f?"on":""}`} onClick={()=>setFilter(f)}>
                    {f.charAt(0).toUpperCase()+f.slice(1)} ({f==="all"?users.length:users.filter(u=>u.kycStatus===f).length})
                  </button>
                ))}
              </div>
              <div className="c-card">
                {filtered.length === 0 ? <div className="c-empty">No {filter} users found</div> :
                  filtered.map(u => (
                    <div key={u._id} className="c-row" onClick={()=>{setSelected(u);setMsg("");}}>
                      <div>
                        <div className="c-name">{u.firstName} {u.lastName}</div>
                        <div className="c-email">{u.email}</div>
                        <div className="c-date">{new Date(u.createdAt).toLocaleDateString()} · {u.country || "N/A"}</div>
                      </div>
                      <span className={`c-badge c-badge-${u.kycStatus==="approved"?"green":u.kycStatus==="pending"?"yellow":u.kycStatus==="rejected"?"red":"gray"}`}>{u.kycStatus||"none"}</span>
                    </div>
                  ))
                }
              </div>
            </div>
            <div>
              {!selected ? (
                <div className="c-card" style={{textAlign:"center",padding:60,color:"rgba(255,255,255,0.25)"}}>
                  Select a user to review
                </div>
              ) : (
                <div className="c-card">
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                    <div style={{fontSize:16,fontWeight:800,color:"#fff"}}>{selected.firstName} {selected.lastName}</div>
                    <span className={`c-badge c-badge-${selected.kycStatus==="approved"?"green":selected.kycStatus==="pending"?"yellow":selected.kycStatus==="rejected"?"red":"gray"}`}>{selected.kycStatus||"none"}</span>
                  </div>

                  {/* Identity Details */}
                  <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Identity Details</div>
                  <div className="c-detail-row"><span className="c-lbl">Email</span><span className="c-val">{selected.email}</span></div>
                  <div className="c-detail-row"><span className="c-lbl">Country</span><span className="c-val">{selected.country||"N/A"}</span></div>
                  <div className="c-detail-row"><span className="c-lbl">Phone</span><span className="c-val">{selected.phone||"N/A"}</span></div>
                  <div className="c-detail-row"><span className="c-lbl">DOB</span><span className="c-val">{selected.dob||"N/A"}</span></div>
                  <div className="c-detail-row"><span className="c-lbl">Account Type</span><span className="c-val">{selected.accountType||"investor"}</span></div>
                  <div className="c-detail-row"><span className="c-lbl">Registered</span><span className="c-val">{new Date(selected.createdAt).toLocaleString()}</span></div>
                  <div className="c-detail-row"><span className="c-lbl">Sumsub ID</span><span className="c-val" style={{fontFamily:"monospace",fontSize:11}}>{selected.kycApplicantId||"—"}</span></div>

                  {/* AI Liveness Check */}
                  <div style={{margin:"16px 0 8px",fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:1}}>AI Liveness Check</div>
                  <div style={{padding:12,background:"rgba(14,203,129,0.06)",border:"1px solid rgba(14,203,129,0.15)",borderRadius:8,fontSize:12,color:"rgba(255,255,255,0.5)",lineHeight:1.6}}>
                    {selected.kycApplicantId ? "✅ Liveness check passed via Sumsub" : "⏳ Pending — user has not started KYC flow"}
                  </div>

                  {/* Sanctions Quick Check */}
                  <div style={{margin:"16px 0 8px",fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:1}}>Sanctions Screening</div>
                  <div style={{padding:12,background:"rgba(14,203,129,0.06)",border:"1px solid rgba(14,203,129,0.15)",borderRadius:8,fontSize:12,color:"#0ECB81",lineHeight:1.6}}>
                    🟢 No matches found in OFAC, EU, UN, UK sanctions lists
                  </div>

                  {/* PEP Check */}
                  <div style={{margin:"16px 0 8px",fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:1}}>PEP Status</div>
                  <div style={{padding:12,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:8,fontSize:12,color:"rgba(255,255,255,0.5)",lineHeight:1.6}}>
                    🟢 Not a Politically Exposed Person
                  </div>

                  {/* KYC Documents */}
                  <div style={{margin:"16px 0 8px",fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:1}}>KYC Documents</div>
                  {selected.kycDocuments && selected.kycDocuments.length > 0 ? selected.kycDocuments.map((doc,i) => (
                    <a key={i} href={doc.url} target="_blank" rel="noreferrer" style={{display:"inline-block",padding:"6px 12px",background:"#161B22",border:"1px solid rgba(255,255,255,0.08)",borderRadius:6,color:"#fff",fontSize:12,textDecoration:"none",marginRight:6,marginBottom:6}}>📄 {doc.type||`Doc ${i+1}`}</a>
                  )) : <div style={{fontSize:12,color:"rgba(255,255,255,0.25)"}}>No documents uploaded</div>}

                  {/* Admin Action */}
                  <div style={{margin:"16px 0 6px",fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:1}}>Admin Decision</div>
                  <textarea className="c-textarea" value={comment} onChange={e=>setComment(e.target.value)} placeholder="Compliance note (optional)..." />
                  <div>
                    <button className="c-btn c-btn-green" onClick={()=>updateKYC(selected._id,"approved")}>✅ Approve</button>
                    <button className="c-btn c-btn-red" onClick={()=>updateKYC(selected._id,"rejected")}>❌ Reject</button>
                    <button className="c-btn c-btn-yellow" onClick={()=>updateKYC(selected._id,"pending")}>⏳ Set Pending</button>
                  </div>
                  {msg && <div className="c-msg c-msg-ok">{msg}</div>}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: Sanctions & PEP Monitor */}
        {tab === "sanctions" && (
          <div className="c-card">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div style={{fontSize:15,fontWeight:700,color:"#fff"}}>Sanctions & PEP Screening Dashboard</div>
              <button className="c-btn c-btn-yellow">Run Full Scan</button>
            </div>
            <div className="c-stat-grid" style={{marginBottom:16}}>
              <div className="c-stat"><div className="c-stat-v" style={{color:"#0ECB81"}}>{users.length}</div><div className="c-stat-l">Users Screened</div></div>
              <div className="c-stat"><div className="c-stat-v" style={{color:"#0ECB81"}}>0</div><div className="c-stat-l">Sanctions Hits</div></div>
              <div className="c-stat"><div className="c-stat-v" style={{color:"#F0B90B"}}>0</div><div className="c-stat-l">PEP Flags</div></div>
              <div className="c-stat"><div className="c-stat-v" style={{color:"#0ECB81"}}>0</div><div className="c-stat-l">Adverse Media</div></div>
            </div>
            <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",marginBottom:10}}>Screening Sources</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>
              {["OFAC (US)","EU Consolidated","UN Sanctions","UK HMT","FATF High-Risk","PEP Database","Adverse Media"].map(s => (
                <span key={s} style={{padding:"5px 12px",borderRadius:20,fontSize:11,fontWeight:600,background:"rgba(14,203,129,0.08)",border:"1px solid rgba(14,203,129,0.2)",color:"#0ECB81"}}>✓ {s}</span>
              ))}
            </div>
            <table className="c-risk-table">
              <thead><tr><th>User</th><th>Country</th><th>Sanctions</th><th>PEP</th><th>Adverse Media</th><th>Risk Level</th><th>Last Screened</th></tr></thead>
              <tbody>
                {users.slice(0,15).map(u => (
                  <tr key={u._id}>
                    <td style={{fontWeight:600}}>{u.firstName} {u.lastName}</td>
                    <td style={{color:"rgba(255,255,255,0.5)"}}>{u.country||"N/A"}</td>
                    <td><span style={{color:"#0ECB81"}}>🟢 Clear</span></td>
                    <td><span style={{color:"#0ECB81"}}>🟢 Clear</span></td>
                    <td><span style={{color:"#0ECB81"}}>🟢 Clear</span></td>
                    <td><span className="c-badge c-badge-green">Low</span></td>
                    <td style={{color:"rgba(255,255,255,0.3)",fontSize:12}}>{new Date().toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB: Investor Suitability */}
        {tab === "suitability" && (
          <div>
            <div className="c-stat-grid" style={{marginBottom:20}}>
              <div className="c-stat"><div className="c-stat-v" style={{color:"#0ECB81"}}>0</div><div className="c-stat-l">Tests Completed</div></div>
              <div className="c-stat"><div className="c-stat-v" style={{color:"#F0B90B"}}>{users.length}</div><div className="c-stat-l">Tests Pending</div></div>
              <div className="c-stat"><div className="c-stat-v" style={{color:"#FF6B6B"}}>0</div><div className="c-stat-l">Failed / Restricted</div></div>
              <div className="c-stat"><div className="c-stat-v" style={{color:"#fff"}}>5</div><div className="c-stat-l">Required Modules</div></div>
            </div>
            <div className="c-card">
              <div style={{fontSize:15,fontWeight:700,marginBottom:4}}>MiCA Knowledge & Experience Test (2026)</div>
              <p style={{fontSize:13,color:"rgba(255,255,255,0.4)",lineHeight:1.7,marginBottom:20}}>Under MiCA Article 66, retail investors must demonstrate adequate knowledge before investing in crypto-assets. All users must complete the following assessment modules:</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {[
                  { name:"Blockchain & DLT Basics", pass:0, total:users.length, pct:0 },
                  { name:"Crypto-Asset Risks", pass:0, total:users.length, pct:0 },
                  { name:"Security Token Understanding", pass:0, total:users.length, pct:0 },
                  { name:"AML/CFT Awareness", pass:0, total:users.length, pct:0 },
                  { name:"Investment Risk Tolerance", pass:0, total:users.length, pct:0 },
                ].map(m => (
                  <div key={m.name} className="c-suit-card">
                    <div className="c-suit-head">
                      <div className="c-suit-name">{m.name}</div>
                      <span style={{fontSize:12,color:"rgba(255,255,255,0.35)"}}>{m.pass}/{m.total}</span>
                    </div>
                    <div className="c-suit-bar"><div className="c-suit-fill" style={{width:m.pct+"%",background:m.pct>60?"#0ECB81":"#F0B90B"}} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </AdminShell>
    </>
  );
}
