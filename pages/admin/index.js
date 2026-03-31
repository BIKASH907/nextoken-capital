import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import AdminShell from "../../components/admin/AdminShell";

export default function AdminDashboard() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [users, setUsers] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("dashboard");

  // Asset form
  const emptyForm = { name:"", ticker:"", assetType:"real_estate", description:"", targetRaise:"", minInvestment:"", targetROI:"", term:"", tokenSupply:"", tokenPrice:"", currency:"EUR", status:"draft", riskLevel:"medium", location:"", country:"", issuerName:"", yieldFrequency:"quarterly" };
  const [assetForm, setAssetForm] = useState(emptyForm);
  const [assetMsg, setAssetMsg] = useState("");
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [docUploading, setDocUploading] = useState(false);
  const docRef = useRef();
  const fileRef = useRef();

  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    if (!t) { router.push("/admin/login"); return; }
    setToken(t);
  }, [router]);

  useEffect(() => {
    if (!token) return;
    fetchUsers(); fetchAssets();
  }, [token]);

  const fetchUsers = async () => {
    try {
      const r = await fetch("/api/admin/users", { headers: { Authorization: `Bearer ${token}` } });
      const d = await r.json();
      if (d.users) setUsers(d.users);
    } catch {}
  };

  const fetchAssets = async () => {
    try {
      const r = await fetch("/api/admin/assets", { headers: { Authorization: `Bearer ${token}` } });
      const d = await r.json();
      if (d.assets) setAssets(d.assets);
    } catch {}
  };

  const handleImagePick = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    for (const file of files) {
      const preview = URL.createObjectURL(file);
      const tempId = Date.now() + Math.random();
      setImages(prev => [...prev, { tempId, preview, url: null, uploading: true }]);
      try {
        const fd = new FormData();
        fd.append("file", file);
        const r = await fetch("/api/admin/upload", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
        const d = await r.json();
        if (d.url) setImages(prev => prev.map(img => img.tempId === tempId ? { ...img, url: d.url, uploading: false } : img));
        else { setImages(prev => prev.filter(img => img.tempId !== tempId)); setAssetMsg("Upload failed: " + (d.error || "unknown")); }
      } catch { setImages(prev => prev.filter(img => img.tempId !== tempId)); setAssetMsg("Upload error"); }
    }
    setUploading(false);
    e.target.value = "";
  };

  const handleDocUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setDocUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch("/api/admin/upload", { method: "POST", headers: { Authorization: "Bearer " + token }, body: fd });
      const d = await r.json();
      if (d.url) {
        const ext = file.name.split(".").pop().toLowerCase();
        const docType = ext === "pdf" ? "PDF" : ["doc","docx"].includes(ext) ? "Word" : ["xls","xlsx"].includes(ext) ? "Excel" : "File";
        setDocuments(prev => [...prev, { name: file.name, url: d.url, type: docType }]);
      }
    } catch(err) { console.error("Doc upload error:", err); }
    setDocUploading(false);
    e.target.value = "";
  };
  const removeImage = (tempId) => setImages(prev => prev.filter(img => img.tempId !== tempId));

  const createAsset = async (e) => {
    e.preventDefault();
    setLoading(true); setAssetMsg("");
    try {
      const payload = { ...assetForm, imageUrl: images.find(i => i.url)?.url || undefined, documents };
      if (assetForm.targetRaise) payload.targetRaise = Number(assetForm.targetRaise);
      if (assetForm.minInvestment) payload.minInvestment = Number(assetForm.minInvestment);
      if (assetForm.targetROI) payload.targetROI = Number(assetForm.targetROI);
      if (assetForm.tokenSupply) payload.tokenSupply = Number(assetForm.tokenSupply);
      if (assetForm.tokenPrice) payload.tokenPrice = Number(assetForm.tokenPrice);
      if (assetForm.term) payload.term = Number(assetForm.term);
      const r = await fetch("/api/admin/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const d = await r.json();
      if (r.ok) { setAssetMsg("Asset created successfully!"); setAssetForm(emptyForm); setImages([]); setDocuments([]); fetchAssets(); }
      else setAssetMsg(d.error || "Failed to create asset");
    } catch { setAssetMsg("Network error"); }
    setLoading(false);
  };

  const deleteAsset = async (id) => {
    if (!confirm("Delete this asset?")) return;
    await fetch(`/api/admin/assets/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    fetchAssets();
  };

  const kycPending = users.filter(u => u.kycStatus === "pending").length;
  const reviewAssets = assets.filter(a => a.status === "review").length;
  const totalRaised = assets.reduce((s, a) => s + (a.raisedAmount || 0), 0);

  function F({ label, children }) { return (<div className="field"><label>{label}</label>{children}</div>); }

  const tabs = [
    { id:"dashboard", label:"📊 Overview" },
    { id:"assets", label:`🏢 Assets (${assets.length})` },
    { id:"users", label:`👥 Users (${users.length})` },
    { id:"add-asset", label:"+ Add Asset" },
  ];

  return (
    <>
      <Head><title>Admin — Nextoken Capital</title></Head>
      <AdminShell title="Admin Dashboard" subtitle={`Welcome back · ${users.length} users · ${assets.length} assets · ${kycPending} KYC pending`}>
        <style>{`
          .ad-tabs{display:flex;gap:4px;margin-bottom:20px;border-bottom:1px solid rgba(255,255,255,0.07)}
          .ad-tab{padding:10px 18px;font-size:13px;font-weight:600;color:rgba(255,255,255,0.4);background:none;border:none;border-bottom:2px solid transparent;cursor:pointer;font-family:inherit;transition:all .15s;white-space:nowrap}
          .ad-tab:hover{color:#fff}
          .ad-tab.on{color:#F0B90B;border-bottom-color:#F0B90B}
          .stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px}
          .stat-card{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:20px}
          .stat-val{font-size:1.8rem;font-weight:900;color:#F0B90B}
          .stat-lbl{font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:.5px;margin-top:4px}
          .card{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:24px;margin-bottom:20px}
          table{width:100%;border-collapse:collapse}
          th{text-align:left;font-size:11px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:.5px;padding:0 0 12px;font-weight:700}
          td{padding:12px 0;font-size:13px;border-bottom:1px solid rgba(255,255,255,0.05);vertical-align:middle}
          tr:last-child td{border:none}
          .badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700}
          .badge-green{background:rgba(14,203,129,0.12);color:#0ECB81}
          .badge-yellow{background:rgba(240,185,11,0.12);color:#F0B90B}
          .badge-red{background:rgba(255,77,77,0.12);color:#ff6b6b}
          .badge-gray{background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.5)}
          .badge-blue{background:rgba(88,101,242,0.12);color:#818cf8}
          .del-btn{padding:4px 12px;background:rgba(255,77,77,0.08);border:1px solid rgba(255,77,77,0.15);border-radius:6px;color:#ff6b6b;font-size:12px;cursor:pointer;font-family:inherit}
          .empty{text-align:center;padding:40px;color:rgba(255,255,255,0.3);font-size:13px}
          .asset-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}
          .asset-card{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;overflow:hidden}
          .asset-card-img{width:100%;height:150px;object-fit:cover}
          .asset-card-placeholder{width:100%;height:150px;background:#161B22;display:flex;align-items:center;justify-content:center;font-size:32px}
          .asset-card-body{padding:16px}
          .asset-card-name{font-size:15px;font-weight:700;margin-bottom:2px}
          .asset-card-ticker{font-size:11px;color:#F0B90B;font-weight:700;letter-spacing:1px;margin-bottom:8px}
          .asset-card-row{display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px}
          .asset-card-row span:first-child{color:rgba(255,255,255,0.4)}
          .asset-card-footer{display:flex;justify-content:space-between;align-items:center;margin-top:12px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.06)}
          .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
          .form-grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px}
          .field{display:flex;flex-direction:column;gap:6px}
          .field label{font-size:11px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:.5px}
          .field input,.field select,.field textarea{background:#161B22;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px 12px;font-size:13px;color:#fff;outline:none;font-family:inherit}
          .field input:focus,.field select:focus,.field textarea:focus{border-color:rgba(240,185,11,0.4)}
          .field textarea{resize:vertical;min-height:80px}
          .field select option{background:#161B22}
          .section-title{font-size:12px;font-weight:700;color:#F0B90B;text-transform:uppercase;letter-spacing:1px;margin:20px 0 12px;padding-bottom:8px;border-bottom:1px solid rgba(240,185,11,0.15)}
          .submit-btn{padding:12px 28px;background:#F0B90B;color:#000;border:none;border-radius:8px;font-size:14px;font-weight:800;cursor:pointer;font-family:inherit;margin-top:8px}
          .submit-btn:disabled{opacity:.5;cursor:not-allowed}
          .success-msg{background:rgba(14,203,129,0.1);border:1px solid rgba(14,203,129,0.2);border-radius:8px;padding:10px 14px;font-size:13px;color:#0ECB81;margin-top:12px}
          .error-msg{background:rgba(255,77,77,0.1);border:1px solid rgba(255,77,77,0.2);border-radius:8px;padding:10px 14px;font-size:13px;color:#ff6b6b;margin-top:12px}
          .upload-zone{border:2px dashed rgba(255,255,255,0.1);border-radius:8px;padding:20px;text-align:center;cursor:pointer;transition:border-color .15s;margin-top:8px}
          .upload-zone:hover{border-color:rgba(240,185,11,0.4)}
          .img-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:10px;margin-bottom:12px}
          .img-item{position:relative;border-radius:8px;overflow:hidden;aspect-ratio:4/3}
          .img-item img{width:100%;height:100%;object-fit:cover}
          .img-uploading{position:absolute;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;font-size:11px}
          .img-remove{position:absolute;top:4px;right:4px;width:20px;height:20px;background:rgba(0,0,0,0.75);border:none;border-radius:50%;color:#fff;font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center}
          .req{color:#F0B90B}
          @media(max-width:900px){.stat-grid{grid-template-columns:repeat(2,1fr)}.form-grid,.form-grid-3{grid-template-columns:1fr}}
        `}</style>

        {/* Stats */}
        <div className="stat-grid">
          <div className="stat-card"><div className="stat-val">{users.length}</div><div className="stat-lbl">Total Users</div></div>
          <div className="stat-card"><div className="stat-val">{assets.length}</div><div className="stat-lbl">Assets Listed</div></div>
          <div className="stat-card"><div className="stat-val" style={{color:kycPending>0?"#F0B90B":"#0ECB81"}}>{kycPending}</div><div className="stat-lbl">KYC Pending</div></div>
          <div className="stat-card"><div className="stat-val">€{totalRaised.toLocaleString()}</div><div className="stat-lbl">Total Raised</div></div>
        </div>

        {/* Tabs */}
        <div className="ad-tabs">
          {tabs.map(t => <button key={t.id} className={`ad-tab ${tab===t.id?"on":""}`} onClick={()=>setTab(t.id)}>{t.label}</button>)}
        </div>

        {/* DASHBOARD */}
        {tab === "dashboard" && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div className="card">
              <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Recent Users</div>
              {users.length === 0 ? <div className="empty">No users yet</div> : (
                <table><thead><tr><th>Name</th><th>Email</th><th>KYC</th><th>Joined</th></tr></thead>
                <tbody>{users.slice(0,8).map(u => <tr key={u._id}><td style={{fontWeight:600}}>{u.firstName} {u.lastName}</td><td style={{color:"rgba(255,255,255,0.5)"}}>{u.email}</td><td><span className={`badge badge-${u.kycStatus==="approved"?"green":u.kycStatus==="pending"?"yellow":"gray"}`}>{u.kycStatus||"none"}</span></td><td style={{color:"rgba(255,255,255,0.4)"}}>{new Date(u.createdAt).toLocaleDateString()}</td></tr>)}</tbody>
                </table>
              )}
            </div>
            <div className="card">
              <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Recent Assets</div>
              {assets.length === 0 ? <div className="empty">No assets yet</div> : (
                <table><thead><tr><th>Name</th><th>Type</th><th>Status</th><th>Target</th></tr></thead>
                <tbody>{assets.slice(0,8).map(a => <tr key={a._id}><td style={{fontWeight:600}}>{a.name} <span style={{color:"#F0B90B",fontSize:11}}>({a.ticker})</span></td><td style={{color:"rgba(255,255,255,0.5)"}}>{a.assetType?.replace("_"," ")}</td><td><span className={`badge badge-${a.status==="live"?"green":a.status==="review"?"yellow":a.status==="draft"?"gray":"blue"}`}>{a.status}</span></td><td>€{(a.targetRaise||0).toLocaleString()}</td></tr>)}</tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* USERS */}
        {tab === "users" && (
          <div className="card">
            {users.length === 0 ? <div className="empty">No users</div> : (
              <table><thead><tr><th>Name</th><th>Email</th><th>Country</th><th>KYC</th><th>Type</th><th>Role</th><th>Joined</th></tr></thead>
              <tbody>{users.map(u => <tr key={u._id}><td style={{fontWeight:600}}>{u.firstName} {u.lastName}</td><td style={{color:"rgba(255,255,255,0.5)"}}>{u.email}</td><td style={{color:"rgba(255,255,255,0.4)"}}>{u.country||"N/A"}</td><td><span className={`badge badge-${u.kycStatus==="approved"?"green":u.kycStatus==="pending"?"yellow":u.kycStatus==="rejected"?"red":"gray"}`}>{u.kycStatus||"none"}</span></td><td><span className="badge badge-blue">{u.accountType||"investor"}</span></td><td><span className="badge badge-gray">{u.role}</span></td><td style={{color:"rgba(255,255,255,0.4)"}}>{new Date(u.createdAt).toLocaleDateString()}</td></tr>)}</tbody>
              </table>
            )}
          </div>
        )}

        {/* ASSETS */}
        {tab === "assets" && (
          <>
            {assets.length === 0 ? <div className="card"><div className="empty">No assets</div></div> : (
              <div className="asset-cards">{assets.map(a => (
                <div className="asset-card" key={a._id}>
                  {a.imageUrl ? <img className="asset-card-img" src={a.imageUrl} alt={a.name} /> : <div className="asset-card-placeholder">🏢</div>}
                  <div className="asset-card-body">
                    <div className="asset-card-name">{a.name}</div>
                    <div className="asset-card-ticker">{a.ticker}</div>
                    <div className="asset-card-row"><span>Target</span><span>EUR {a.targetRaise?.toLocaleString()}</span></div>
                    <div className="asset-card-row"><span>Min.</span><span>EUR {a.minInvestment?.toLocaleString()}</span></div>
                    <div className="asset-card-row"><span>ROI</span><span style={{color:"#0ECB81"}}>{a.targetROI ? a.targetROI+"%" : "—"}</span></div>
                    <div className="asset-card-footer">
                      <span className={`badge badge-${a.status==="live"?"green":a.status==="draft"?"yellow":a.status==="cancelled"?"red":"gray"}`}>{a.status}</span>
                      <button className="del-btn" onClick={() => deleteAsset(a._id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}</div>
            )}
          </>
        )}

        {/* ADD ASSET */}
        {tab === "add-asset" && (
          <div className="card">
            <form onSubmit={createAsset}>
              <div className="section-title">Basic Info <span className="req">*</span></div>
              <div className="form-grid">
                <F label="Asset Name *"><input value={assetForm.name} onChange={e=>setAssetForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Solar Farm" required /></F>
                <F label="Ticker *"><input value={assetForm.ticker} onChange={e=>setAssetForm(f=>({...f,ticker:e.target.value.toUpperCase()}))} placeholder="e.g. SOLAR-01" required /></F>
                <F label="Type *"><select value={assetForm.assetType} onChange={e=>setAssetForm(f=>({...f,assetType:e.target.value}))}><option value="real_estate">Real Estate</option><option value="bond">Bond</option><option value="equity">Equity</option><option value="energy">Energy</option><option value="fund">Fund</option><option value="commodity">Commodity</option><option value="infrastructure">Infrastructure</option><option value="other">Other</option></select></F>
                <F label="Issuer"><input value={assetForm.issuerName} onChange={e=>setAssetForm(f=>({...f,issuerName:e.target.value}))} placeholder="Company name" /></F>
                <F label="Location"><input value={assetForm.location} onChange={e=>setAssetForm(f=>({...f,location:e.target.value}))} placeholder="e.g. Berlin" /></F>
                <F label="Country"><input value={assetForm.country} onChange={e=>setAssetForm(f=>({...f,country:e.target.value}))} placeholder="e.g. Germany" /></F>
              </div>
              <div className="field" style={{marginTop:14}}><label>Description</label><textarea value={assetForm.description} onChange={e=>setAssetForm(f=>({...f,description:e.target.value}))} placeholder="Describe the asset..." /></div>
              <div className="section-title">Financials</div>
              <div className="form-grid-3">
                <F label="Target Raise (EUR) *"><input type="number" value={assetForm.targetRaise} onChange={e=>setAssetForm(f=>({...f,targetRaise:e.target.value}))} required /></F>
                <F label="Min Investment"><input type="number" value={assetForm.minInvestment} onChange={e=>setAssetForm(f=>({...f,minInvestment:e.target.value}))} /></F>
                <F label="Target ROI (%)"><input type="number" step="0.1" value={assetForm.targetROI} onChange={e=>setAssetForm(f=>({...f,targetROI:e.target.value}))} /></F>
                <F label="Term (months)"><input type="number" value={assetForm.term} onChange={e=>setAssetForm(f=>({...f,term:e.target.value}))} /></F>
                <F label="Token Supply"><input type="number" value={assetForm.tokenSupply} onChange={e=>setAssetForm(f=>({...f,tokenSupply:e.target.value}))} /></F>
                <F label="Token Price"><input type="number" step="0.01" value={assetForm.tokenPrice} onChange={e=>setAssetForm(f=>({...f,tokenPrice:e.target.value}))} /></F>
              </div>
              <div className="section-title">Status</div>
              <div className="form-grid">
                <F label="Status"><select value={assetForm.status} onChange={e=>setAssetForm(f=>({...f,status:e.target.value}))}><option value="draft">Draft</option><option value="review">Review</option><option value="approved">Approved</option><option value="live">Live</option><option value="closing">Closing</option><option value="closed">Closed</option></select></F>
                <F label="Risk"><select value={assetForm.riskLevel} onChange={e=>setAssetForm(f=>({...f,riskLevel:e.target.value}))}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></F>
              </div>
              <div className="section-title">Photos</div>
              {images.length > 0 && <div className="img-grid">{images.map(img => (
                <div className="img-item" key={img.tempId}><img src={img.preview} alt="" />{img.uploading && <div className="img-uploading">...</div>}<button type="button" className="img-remove" onClick={()=>removeImage(img.tempId)}>x</button></div>
              ))}</div>}
              <input type="file" accept="image/*" multiple ref={fileRef} style={{display:"none"}} onChange={handleImagePick} />
              <div className="upload-zone" onClick={()=>fileRef.current.click()}><div style={{fontSize:20}}>+</div><div style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>{uploading?"Uploading...":"Click to add photos"}</div></div>
              <div className="section-title">Documents (Legal, Financial)</div>
              {documents.length > 0 && <div style={{marginBottom:12}}>{documents.map((doc, i) => (
                <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 12px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,marginBottom:6}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span>{doc.type === "PDF" ? "\uD83D\uDCC4" : "\uD83D\uDCC1"}</span>
                    <span style={{fontSize:13,fontWeight:500}}>{doc.name}</span>
                    <span style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>{doc.type}</span>
                  </div>
                  <button type="button" onClick={()=>setDocuments(prev=>prev.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:"#ff6b6b",cursor:"pointer",fontSize:14}}>x</button>
                </div>
              ))}</div>}
              <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" ref={docRef} style={{display:"none"}} onChange={handleDocUpload} />
              <div className="upload-zone" onClick={()=>docRef.current.click()} style={{marginBottom:16}}><div style={{fontSize:16}}>\uD83D\uDCC4</div><div style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>{docUploading ? "Uploading..." : "Click to add documents (PDF, Word, Excel)"}</div></div>
              <button className="submit-btn" type="submit" disabled={loading||uploading}>{loading?"Creating...":"Create Asset"}</button>
              {assetMsg && <div className={assetMsg.includes("success")?"success-msg":"error-msg"}>{assetMsg}</div>}
            </form>
          </div>
        )}
      </AdminShell>
    </>
  );
}
