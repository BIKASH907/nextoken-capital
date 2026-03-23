import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import AdminSidebar from "../../components/AdminSidebar";
export default function KYCPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState("");
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("pending");
  const [comment, setComment] = useState("");
  const [msg, setMsg] = useState("");
  useEffect(() => {
    setMounted(true);
    const t = localStorage.getItem("adminToken");
    if (!t) { router.push("/admin/login"); return; }
    setToken(t);
  }, []);
  useEffect(() => {
    if (!token) return;
    fetch("/api/admin/users", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { if (d.users) setUsers(d.users); });
  }, [token]);
  const updateKYC = async (userId, status) => {
    const r = await fetch(`/api/admin/users/${userId}/kyc`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ kycStatus: status, adminComment: comment }),
    });
    const d = await r.json();
    if (r.ok) {
      setMsg(`KYC marked as ${status}`);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, kycStatus: status } : u));
      setSelected(prev => prev ? { ...prev, kycStatus: status } : null);
      setComment("");
    } else setMsg(d.error || "Failed");
  };
  const filtered = users.filter(u => filter === "all" ? true : u.kycStatus === filter);
  if (!mounted) return <div style={{background:"#0B0E11",minHeight:"100vh"}} />;
  return (
    <>
      <Head><title>KYC Review — Admin</title></Head>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{background:#0B0E11;color:#fff;font-family:'DM Sans',system-ui,sans-serif}.main{margin-left:220px;padding:32px;min-height:100vh}.badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700}.badge-green{background:rgba(14,203,129,0.12);color:#0ECB81}.badge-yellow{background:rgba(240,185,11,0.12);color:#F0B90B}.badge-red{background:rgba(255,77,77,0.12);color:#ff6b6b}.badge-gray{background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.5)}.card{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:24px;margin-bottom:16px}.filter-bar{display:flex;gap:8px;margin-bottom:20px}.fb{padding:6px 16px;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid rgba(255,255,255,0.1);background:none;color:rgba(255,255,255,0.5)}.fb.active{background:rgba(240,185,11,0.1);color:#F0B90B;border-color:rgba(240,185,11,0.3)}.urow{display:flex;justify-content:space-between;align-items:center;padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.05);cursor:pointer}.urow:last-child{border:none}.urow:hover{opacity:.8}.btn{padding:8px 16px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;border:none;font-family:inherit;margin-right:8px}.btn-green{background:rgba(14,203,129,0.15);color:#0ECB81;border:1px solid rgba(14,203,129,0.3)}.btn-red{background:rgba(255,77,77,0.1);color:#ff6b6b;border:1px solid rgba(255,77,77,0.2)}.btn-gray{background:rgba(255,255,255,0.07);color:#fff;border:1px solid rgba(255,255,255,0.1)}.drow{display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.05);font-size:13px}.drow:last-child{border:none}.lbl{color:rgba(255,255,255,0.4)}.textarea{width:100%;background:#161B22;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px 12px;font-size:13px;color:#fff;outline:none;font-family:inherit;resize:vertical;min-height:70px;margin:10px 0}.smsg{background:rgba(14,203,129,0.1);border:1px solid rgba(14,203,129,0.2);border-radius:8px;padding:10px 14px;font-size:13px;color:#0ECB81;margin-top:10px}.emsg{background:rgba(255,77,77,0.1);border:1px solid rgba(255,77,77,0.2);border-radius:8px;padding:10px 14px;font-size:13px;color:#ff6b6b;margin-top:10px}`}</style>
      <AdminSidebar />
      <div className="main">
        <div style={{fontSize:22,fontWeight:900,marginBottom:4}}>KYC Review</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:24}}>Review and approve investor identity verification</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
          <div>
            <div className="filter-bar">
              {["all","pending","approved","rejected"].map(f => (
                <button key={f} className={`fb${filter===f?" active":""}`} onClick={() => setFilter(f)}>{f.charAt(0).toUpperCase()+f.slice(1)} ({f==="all"?users.length:users.filter(u=>u.kycStatus===f).length})</button>
              ))}
            </div>
            <div className="card">
              {filtered.length === 0 ? <div style={{textAlign:"center",padding:32,color:"rgba(255,255,255,0.3)"}}>No {filter} submissions</div> : filtered.map(u => (
                <div className="urow" key={u._id} onClick={() => { setSelected(u); setMsg(""); }}>
                  <div>
                    <div style={{fontWeight:600,fontSize:14}}>{u.firstName} {u.lastName}</div>
                    <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginTop:2}}>{u.email}</div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginTop:2}}>{new Date(u.createdAt).toLocaleDateString()}</div>
                  </div>
                  <span className={`badge badge-${u.kycStatus==="approved"?"green":u.kycStatus==="pending"?"yellow":u.kycStatus==="rejected"?"red":"gray"}`}>{u.kycStatus||"none"}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            {!selected ? <div className="card" style={{textAlign:"center",padding:60,color:"rgba(255,255,255,0.3)"}}>Select a user to review</div> : (
              <div className="card">
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                  <div style={{fontSize:16,fontWeight:700}}>{selected.firstName} {selected.lastName}</div>
                  <span className={`badge badge-${selected.kycStatus==="approved"?"green":selected.kycStatus==="pending"?"yellow":selected.kycStatus==="rejected"?"red":"gray"}`}>{selected.kycStatus||"none"}</span>
                </div>
                <div className="drow"><span className="lbl">Email</span><span>{selected.email}</span></div>
                <div className="drow"><span className="lbl">Country</span><span>{selected.country||"N/A"}</span></div>
                <div className="drow"><span className="lbl">Phone</span><span>{selected.phone||"N/A"}</span></div>
                <div className="drow"><span className="lbl">Joined</span><span>{new Date(selected.createdAt).toLocaleDateString()}</span></div>
                <div style={{margin:"16px 0 6px",fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase"}}>KYC Documents</div>
                {selected.kycDocuments && selected.kycDocuments.length > 0 ? selected.kycDocuments.map((doc,i) => (
                  <a key={i} href={doc.url} target="_blank" rel="noreferrer" style={{display:"inline-block",padding:"6px 14px",background:"#161B22",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,color:"#fff",fontSize:12,textDecoration:"none",marginRight:6,marginBottom:6}}>📄 {doc.type||`Document ${i+1}`}</a>
                )) : <div style={{fontSize:13,color:"rgba(255,255,255,0.3)",marginBottom:12}}>No documents uploaded</div>}
                <div style={{marginTop:12,fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase"}}>Admin Comment</div>
                <textarea className="textarea" value={comment} onChange={e => setComment(e.target.value)} placeholder="Add note (optional)..." />
                <div>
                  <button className="btn btn-green" onClick={() => updateKYC(selected._id,"approved")}>Approve</button>
                  <button className="btn btn-red" onClick={() => updateKYC(selected._id,"rejected")}>Reject</button>
                  <button className="btn btn-gray" onClick={() => updateKYC(selected._id,"pending")}>Set Pending</button>
                </div>
                {msg && <div className={msg.includes("marked")?"smsg":"emsg"}>{msg}</div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
