import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
export default function AdminDashboard() {
  const router = useRouter();
  const [employee, setEmployee] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState("dashboard");
  const [token, setToken] = useState("");
  const [users, setUsers] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const emptyForm = { name:"", ticker:"", assetType:"real_estate", description:"", targetRaise:"", minInvestment:"", targetROI:"", term:"", tokenSupply:"", tokenPrice:"", currency:"EUR", status:"draft", riskLevel:"medium", location:"", country:"", issuerName:"", yieldFrequency:"quarterly" };
  const [assetForm, setAssetForm] = useState(emptyForm);
  const [assetMsg, setAssetMsg] = useState("");
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();
  useEffect(() => {
    setMounted(true);
    const t = localStorage.getItem("adminToken");
    const emp = localStorage.getItem("adminEmployee");
    if (!t) { router.push("/admin/login"); return; }
    setToken(t);
    try { setEmployee(JSON.parse(emp)); } catch(e) { router.push("/admin/login"); }
  }, []);
  useEffect(() => {
    if (!token) return;
    if (tab === "dashboard" || tab === "users") fetchUsers();
    if (tab === "dashboard" || tab === "assets") fetchAssets();
  }, [tab, token]);
  const fetchUsers = async () => {
    try {
      const r = await fetch("/api/admin/users", { headers: { Authorization: `Bearer ${token}` } });
      const d = await r.json();
      if (d.users) setUsers(d.users);
    } catch(e) {}
  };
  const fetchAssets = async () => {
    try {
      const r = await fetch("/api/admin/assets", { headers: { Authorization: `Bearer ${token}` } });
      const d = await r.json();
      if (d.assets) setAssets(d.assets);
    } catch(e) {}
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
      } catch(err) { setImages(prev => prev.filter(img => img.tempId !== tempId)); setAssetMsg("Upload error"); }
    }
    setUploading(false);
    e.target.value = "";
  };
  const removeImage = (tempId) => setImages(prev => prev.filter(img => img.tempId !== tempId));
  const createAsset = async (e) => {
    e.preventDefault();
    setLoading(true); setAssetMsg("");
    try {
      const payload = { ...assetForm, imageUrl: images.find(i => i.url)?.url || undefined };
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
      if (r.ok) { setAssetMsg("Asset created successfully!"); setAssetForm(emptyForm); setImages([]); fetchAssets(); }
      else setAssetMsg(d.error || "Failed to create asset");
    } catch(err) { setAssetMsg("Network error"); }
    setLoading(false);
  };
  const deleteAsset = async (id) => {
    if (!confirm("Delete this asset?")) return;
    await fetch(`/api/admin/assets/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    fetchAssets();
  };
  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmployee");
    router.push("/admin/login");
  };
  const F = ({ label, children }) => <div className="field"><label>{label}</label>{children}</div>;
  if (!mounted) return <div style={{background:"#0B0E11",minHeight:"100vh"}} />;
  if (!employee) return <div style={{background:"#0B0E11",minHeight:"100vh"}} />;
  const tabs = [{ id:"dashboard", label:"Dashboard" },{ id:"assets", label:"Assets" },{ id:"users", label:"Users" },{ id:"add-asset", label:"+ Add Asset" }];
  return (
    <>
      <Head><title>Admin — Nextoken Capital</title></Head>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{background:#0B0E11;color:#fff;font-family:'DM Sans',system-ui,sans-serif}.sidebar{position:fixed;top:0;left:0;width:220px;height:100vh;background:#0F1318;border-right:1px solid rgba(255,255,255,0.07);display:flex;flex-direction:column;padding:24px 16px;z-index:100}.logo{font-size:20px;font-weight:900;color:#F0B90B;margin-bottom:4px}.logo-sub{font-size:10px;color:rgba(255,255,255,0.3);letter-spacing:2px;margin-bottom:32px}.nav-item{display:flex;align-items:center;padding:10px 14px;border-radius:8px;font-size:13px;font-weight:600;color:rgba(255,255,255,0.5);cursor:pointer;margin-bottom:4px;transition:all .15s;border:none;background:none;width:100%;text-align:left}.nav-item:hover{color:#fff;background:rgba(255,255,255,0.05)}.nav-item.active{color:#F0B90B;background:rgba(240,185,11,0.1)}.nav-bottom{margin-top:auto}.user-info{padding:12px 14px;border-radius:8px;background:rgba(255,255,255,0.04);margin-bottom:8px}.user-name{font-size:13px;font-weight:700}.user-role{font-size:11px;color:#F0B90B;margin-top:2px}.logout-btn{width:100%;padding:10px 14px;border-radius:8px;background:rgba(255,77,77,0.08);border:1px solid rgba(255,77,77,0.15);color:#ff6b6b;font-size:13px;font-weight:600;cursor:pointer;text-align:left}.main{margin-left:220px;padding:32px;min-height:100vh}.page-title{font-size:22px;font-weight:900;margin-bottom:4px}.page-sub{font-size:13px;color:rgba(255,255,255,0.4);margin-bottom:28px}.stat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:28px}.stat-card{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:24px}.stat-val{font-size:2.2rem;font-weight:900;color:#F0B90B}.stat-lbl{font-size:12px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:.5px;margin-top:4px}.card{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:24px;margin-bottom:20px}.section-title{font-size:13px;font-weight:700;color:#F0B90B;text-transform:uppercase;letter-spacing:1px;margin:24px 0 14px;padding-bottom:8px;border-bottom:1px solid rgba(240,185,11,0.15)}table{width:100%;border-collapse:collapse}th{text-align:left;font-size:11px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:.5px;padding:0 0 12px;font-weight:700}td{padding:12px 0;font-size:13px;border-bottom:1px solid rgba(255,255,255,0.05);vertical-align:middle}tr:last-child td{border:none}.badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700}.badge-green{background:rgba(14,203,129,0.12);color:#0ECB81}.badge-yellow{background:rgba(240,185,11,0.12);color:#F0B90B}.badge-red{background:rgba(255,77,77,0.12);color:#ff6b6b}.badge-gray{background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.5)}.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.form-grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px}.field{display:flex;flex-direction:column;gap:6px}.field label{font-size:11px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:.5px}.field input,.field select,.field textarea{background:#161B22;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px 12px;font-size:13px;color:#fff;outline:none;font-family:inherit;transition:border-color .15s}.field input:focus,.field select:focus,.field textarea:focus{border-color:rgba(240,185,11,0.4)}.field textarea{resize:vertical;min-height:80px}.field select option{background:#161B22}.submit-btn{padding:12px 28px;background:#F0B90B;color:#000;border:none;border-radius:8px;font-size:14px;font-weight:800;cursor:pointer;font-family:inherit;margin-top:8px;transition:background .15s}.submit-btn:disabled{opacity:.5;cursor:not-allowed}.success-msg{background:rgba(14,203,129,0.1);border:1px solid rgba(14,203,129,0.2);border-radius:8px;padding:10px 14px;font-size:13px;color:#0ECB81;margin-top:12px}.error-msg{background:rgba(255,77,77,0.1);border:1px solid rgba(255,77,77,0.2);border-radius:8px;padding:10px 14px;font-size:13px;color:#ff6b6b;margin-top:12px}.del-btn{padding:4px 12px;background:rgba(255,77,77,0.08);border:1px solid rgba(255,77,77,0.15);border-radius:6px;color:#ff6b6b;font-size:12px;cursor:pointer;font-family:inherit}.empty{text-align:center;padding:40px;color:rgba(255,255,255,0.3);font-size:13px}.asset-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px}.asset-card{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;overflow:hidden}.asset-card-img{width:100%;height:160px;object-fit:cover;display:block}.asset-card-placeholder{width:100%;height:160px;background:#161B22;display:flex;align-items:center;justify-content:center;font-size:32px}.asset-card-body{padding:16px}.asset-card-name{font-size:15px;font-weight:700;margin-bottom:2px}.asset-card-ticker{font-size:11px;color:#F0B90B;font-weight:700;letter-spacing:1px;margin-bottom:8px}.asset-card-row{display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px}.asset-card-row span:first-child{color:rgba(255,255,255,0.4)}.asset-card-footer{display:flex;justify-content:space-between;align-items:center;margin-top:12px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.06)}.upload-zone{border:2px dashed rgba(255,255,255,0.1);border-radius:8px;padding:20px;text-align:center;cursor:pointer;transition:border-color .15s;margin-top:8px}.upload-zone:hover{border-color:rgba(240,185,11,0.4)}.img-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:10px;margin-bottom:12px}.img-item{position:relative;border-radius:8px;overflow:hidden;aspect-ratio:4/3}.img-item img{width:100%;height:100%;object-fit:cover;display:block}.img-uploading{position:absolute;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;font-size:11px}.img-remove{position:absolute;top:4px;right:4px;width:22px;height:22px;background:rgba(0,0,0,0.75);border:none;border-radius:50%;color:#fff;font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center}.req{color:#F0B90B}`}</style>
      <div className="sidebar">
        <div className="logo">NXT</div>
        <div className="logo-sub">ADMIN PORTAL</div>
        {tabs.map(t => <button key={t.id} className={`nav-item${tab===t.id?" active":""}`} onClick={() => setTab(t.id)}>{t.label}</button>)}
        <div className="nav-bottom">
          <div className="user-info"><div className="user-name">{employee.firstName} {employee.lastName}</div><div className="user-role">{employee.role}</div></div>
          <button className="logout-btn" onClick={logout}>Sign Out</button>
        </div>
      </div>
      <div className="main">
        {tab === "dashboard" && (<>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">Welcome back, {employee.firstName}</div>
          <div className="stat-grid">
            <div className="stat-card"><div className="stat-val">{users.length}</div><div className="stat-lbl">Total Users</div></div>
            <div className="stat-card"><div className="stat-val">{assets.length}</div><div className="stat-lbl">Assets Listed</div></div>
            <div className="stat-card"><div className="stat-val">EUR 0</div><div className="stat-lbl">Total Volume</div></div>
          </div>
          <div className="card">
            <div className="card-title" style={{fontSize:15,fontWeight:700,marginBottom:16}}>Recent Users</div>
            {users.length === 0 ? <div className="empty">No users yet</div> : (
              <table><thead><tr><th>Name</th><th>Email</th><th>KYC</th><th>Joined</th></tr></thead>
              <tbody>{users.slice(0,5).map(u => <tr key={u._id}><td>{u.firstName} {u.lastName}</td><td style={{color:"rgba(255,255,255,0.6)"}}>{u.email}</td><td><span className={`badge badge-${u.kycStatus==="approved"?"green":u.kycStatus==="pending"?"yellow":"gray"}`}>{u.kycStatus}</span></td><td style={{color:"rgba(255,255,255,0.4)"}}>{new Date(u.createdAt).toLocaleDateString()}</td></tr>)}</tbody>
              </table>)}
          </div>
        </>)}
        {tab === "users" && (<>
          <div className="page-title">Users</div>
          <div className="page-sub">{users.length} registered investors</div>
          <div className="card">
            {users.length === 0 ? <div className="empty">No users registered yet</div> : (
              <table><thead><tr><th>Name</th><th>Email</th><th>Country</th><th>KYC</th><th>Role</th><th>Joined</th></tr></thead>
              <tbody>{users.map(u => <tr key={u._id}><td style={{fontWeight:600}}>{u.firstName} {u.lastName}</td><td style={{color:"rgba(255,255,255,0.6)"}}>{u.email}</td><td style={{color:"rgba(255,255,255,0.5)"}}>{u.country||"N/A"}</td><td><span className={`badge badge-${u.kycStatus==="approved"?"green":u.kycStatus==="pending"?"yellow":u.kycStatus==="rejected"?"red":"gray"}`}>{u.kycStatus}</span></td><td><span className="badge badge-gray">{u.role}</span></td><td style={{color:"rgba(255,255,255,0.4)"}}>{new Date(u.createdAt).toLocaleDateString()}</td></tr>)}</tbody>
              </table>)}
          </div>
        </>)}
        {tab === "assets" && (<>
          <div className="page-title">Assets</div>
          <div className="page-sub">{assets.length} investment assets</div>
          {assets.length === 0 ? <div className="card"><div className="empty">No assets yet</div></div> : (
            <div className="asset-cards">{assets.map(a => (
              <div className="asset-card" key={a._id}>
                {a.imageUrl ? <img className="asset-card-img" src={a.imageUrl} alt={a.name} /> : <div className="asset-card-placeholder">🏢</div>}
                <div className="asset-card-body">
                  <div className="asset-card-name">{a.name}</div>
                  <div className="asset-card-ticker">{a.ticker}</div>
                  <div className="asset-card-row"><span>Target Raise</span><span>EUR {a.targetRaise?.toLocaleString()}</span></div>
                  <div className="asset-card-row"><span>Min. Investment</span><span>EUR {a.minInvestment?.toLocaleString()}</span></div>
                  <div className="asset-card-row"><span>ROI</span><span style={{color:"#0ECB81"}}>{a.targetROI ? a.targetROI+"%" : "N/A"}</span></div>
                  <div className="asset-card-footer">
                    <span className={`badge badge-${a.status==="live"?"green":a.status==="draft"?"yellow":a.status==="cancelled"?"red":"gray"}`}>{a.status}</span>
                    <button className="del-btn" onClick={() => deleteAsset(a._id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}</div>)}
        </>)}
        {tab === "add-asset" && (<>
          <div className="page-title">Add New Asset</div>
          <div className="page-sub">Create a new investment listing</div>
          <div className="card">
            <form onSubmit={createAsset}>
              <div className="section-title">Basic Info <span className="req">* required</span></div>
              <div className="form-grid">
                <F label="Asset Name *"><input value={assetForm.name} onChange={e=>setAssetForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Vilnius Office Tower" required /></F>
                <F label="Ticker Symbol *"><input value={assetForm.ticker} onChange={e=>setAssetForm(f=>({...f,ticker:e.target.value.toUpperCase()}))} placeholder="e.g. VPOP" maxLength={8} required /></F>
                <F label="Asset Type *">
                  <select value={assetForm.assetType} onChange={e=>setAssetForm(f=>({...f,assetType:e.target.value}))}>
                    <option value="real_estate">Real Estate</option>
                    <option value="bond">Bond</option>
                    <option value="equity">Equity</option>
                    <option value="energy">Energy</option>
                    <option value="fund">Fund</option>
                    <option value="commodity">Commodity</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="other">Other</option>
                  </select>
                </F>
                <F label="Issuer Name"><input value={assetForm.issuerName} onChange={e=>setAssetForm(f=>({...f,issuerName:e.target.value}))} placeholder="Company or entity name" /></F>
                <F label="Location"><input value={assetForm.location} onChange={e=>setAssetForm(f=>({...f,location:e.target.value}))} placeholder="e.g. Vilnius, Lithuania" /></F>
                <F label="Country"><input value={assetForm.country} onChange={e=>setAssetForm(f=>({...f,country:e.target.value}))} placeholder="e.g. Lithuania" /></F>
              </div>
              <div className="field" style={{marginTop:16}}><label>Description</label><textarea value={assetForm.description} onChange={e=>setAssetForm(f=>({...f,description:e.target.value}))} placeholder="Describe the investment opportunity..." /></div>
              <div className="section-title">Financials</div>
              <div className="form-grid">
                <F label="Target Raise (EUR) *"><input type="number" value={assetForm.targetRaise} onChange={e=>setAssetForm(f=>({...f,targetRaise:e.target.value}))} placeholder="1000000" required /></F>
                <F label="Min. Investment (EUR)"><input type="number" value={assetForm.minInvestment} onChange={e=>setAssetForm(f=>({...f,minInvestment:e.target.value}))} placeholder="500" /></F>
                <F label="Target ROI (%)"><input type="number" step="0.1" value={assetForm.targetROI} onChange={e=>setAssetForm(f=>({...f,targetROI:e.target.value}))} placeholder="8.5" /></F>
                <F label="Term (months)"><input type="number" value={assetForm.term} onChange={e=>setAssetForm(f=>({...f,term:e.target.value}))} placeholder="36" /></F>
                <F label="Yield Frequency">
                  <select value={assetForm.yieldFrequency} onChange={e=>setAssetForm(f=>({...f,yieldFrequency:e.target.value}))}>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annual">Annual</option>
                    <option value="at_maturity">At Maturity</option>
                  </select>
                </F>
                <F label="Currency">
                  <select value={assetForm.currency} onChange={e=>setAssetForm(f=>({...f,currency:e.target.value}))}>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                  </select>
                </F>
              </div>
              <div className="section-title">Token Details</div>
              <div className="form-grid">
                <F label="Token Supply"><input type="number" value={assetForm.tokenSupply} onChange={e=>setAssetForm(f=>({...f,tokenSupply:e.target.value}))} placeholder="10000" /></F>
                <F label="Token Price (EUR)"><input type="number" step="0.01" value={assetForm.tokenPrice} onChange={e=>setAssetForm(f=>({...f,tokenPrice:e.target.value}))} placeholder="100" /></F>
              </div>
              <div className="section-title">Status and Risk</div>
              <div className="form-grid">
                <F label="Status">
                  <select value={assetForm.status} onChange={e=>setAssetForm(f=>({...f,status:e.target.value}))}>
                    <option value="draft">Draft</option>
                    <option value="review">Review</option>
                    <option value="approved">Approved</option>
                    <option value="live">Live</option>
                    <option value="closing">Closing</option>
                    <option value="closed">Closed</option>
                  </select>
                </F>
                <F label="Risk Level">
                  <select value={assetForm.riskLevel} onChange={e=>setAssetForm(f=>({...f,riskLevel:e.target.value}))}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </F>
              </div>
              <div className="section-title">Photos ({images.length} added)</div>
              {images.length > 0 && (
                <div className="img-grid">{images.map(img => (
                  <div className="img-item" key={img.tempId}>
                    <img src={img.preview} alt="preview" />
                    {img.uploading && <div className="img-uploading">Uploading...</div>}
                    <button type="button" className="img-remove" onClick={() => removeImage(img.tempId)}>x</button>
                  </div>
                ))}</div>
              )}
              <input type="file" accept="image/*" multiple ref={fileRef} style={{display:"none"}} onChange={handleImagePick} />
              <div className="upload-zone" onClick={() => fileRef.current.click()}>
                <div style={{fontSize:22,marginBottom:4}}>+</div>
                <div style={{fontSize:13,color:"rgba(255,255,255,0.4)"}}>{uploading ? "Uploading..." : "Click to add photos (select multiple)"}</div>
              </div>
              <button className="submit-btn" type="submit" disabled={loading||uploading}>{loading ? "Creating..." : "Create Asset"}</button>
              {assetMsg && <div className={assetMsg.includes("successfully") ? "success-msg" : "error-msg"}>{assetMsg}</div>}
            </form>
          </div>
        </>)}
      </div>
    </>
  );
}
