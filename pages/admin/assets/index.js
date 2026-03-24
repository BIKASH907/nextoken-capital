import AdminShell from "../../../components/admin/AdminShell";
import AdminShell from "../../../components/admin/AdminShell";
import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import AdminLayout from "../../../components/AdminLayout";
const emptyForm = { name:"", ticker:"", assetType:"real_estate", description:"", targetRaise:"", minInvestment:"", targetROI:"", term:"", tokenSupply:"", tokenPrice:"", currency:"EUR", status:"draft", riskLevel:"medium", location:"", country:"", issuerName:"", yieldFrequency:"quarterly" };
function F({ label, children }) { return <div className="field"><label className="label">{label}</label>{children}</div>; }
export default function AssetsPage() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [assetForm, setAssetForm] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const fileRef = useRef();
  const getToken = () => typeof window !== "undefined" ? localStorage.getItem("adminToken") : "";
  useEffect(() => { fetchAssets(); }, []);
  const fetchAssets = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/assets", { headers: { Authorization: `Bearer ${getToken()}` } });
      const d = await r.json();
      if (d.assets) setAssets(d.assets);
    } catch(e) {}
    setLoading(false);
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
        const r = await fetch("/api/admin/upload", { method: "POST", headers: { Authorization: `Bearer ${getToken()}` }, body: fd });
        const d = await r.json();
        if (d.url) setImages(prev => prev.map(img => img.tempId === tempId ? { ...img, url: d.url, uploading: false } : img));
        else setImages(prev => prev.filter(img => img.tempId !== tempId));
      } catch(err) { setImages(prev => prev.filter(img => img.tempId !== tempId)); }
    }
    setUploading(false);
    e.target.value = "";
  };
  const createAsset = async (e) => {
    e.preventDefault(); setLoading(true); setMsg("");
    try {
      const payload = { ...assetForm, imageUrl: images.find(i => i.url)?.url };
      ["targetRaise","minInvestment","targetROI","tokenSupply","tokenPrice","term"].forEach(k => { if (payload[k]) payload[k] = Number(payload[k]); });
      const r = await fetch("/api/admin/assets", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }, body: JSON.stringify(payload) });
      const d = await r.json();
      if (r.ok) { setMsg("Asset created!"); setAssetForm(emptyForm); setImages([]); setShowForm(false); fetchAssets(); }
      else setMsg(d.error || "Failed");
    } catch(err) { setMsg("Network error"); }
    setLoading(false);
  };
  const deleteAsset = async (id) => {
    if (!confirm("Delete this asset?")) return;
    await fetch(`/api/admin/assets/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
    fetchAssets();
  };
  return (
    <AdminLayout>
      <Head><title>Assets — Admin</title></Head>
      <style>{`.asset-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px}.asset-card{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;overflow:hidden;transition:border-color .15s}.asset-card:hover{border-color:rgba(240,185,11,0.2)}.asset-img{width:100%;height:160px;object-fit:cover}.asset-placeholder{width:100%;height:160px;background:#161B22;display:flex;align-items:center;justify-content:center;font-size:32px}.asset-body{padding:16px}.asset-name{font-size:15px;font-weight:700;margin-bottom:2px}.asset-ticker{font-size:11px;color:#F0B90B;font-weight:700;letter-spacing:1px;margin-bottom:10px}.asset-row{display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px}.asset-row span:first-child{color:rgba(255,255,255,0.4)}.asset-footer{display:flex;justify-content:space-between;align-items:center;margin-top:12px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.06)}.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.field{display:flex;flex-direction:column;gap:6px}.sec{font-size:12px;font-weight:700;color:#F0B90B;text-transform:uppercase;letter-spacing:1px;margin:20px 0 12px;padding-bottom:8px;border-bottom:1px solid rgba(240,185,11,0.1)}.img-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:8px;margin-bottom:10px}.img-item{position:relative;border-radius:8px;overflow:hidden;aspect-ratio:4/3}.img-item img{width:100%;height:100%;object-fit:cover}.img-remove{position:absolute;top:4px;right:4px;width:20px;height:20px;background:rgba(0,0,0,0.7);border:none;border-radius:50%;color:#fff;font-size:12px;cursor:pointer}.upload-zone{border:2px dashed rgba(255,255,255,0.1);border-radius:8px;padding:16px;text-align:center;cursor:pointer}.upload-zone:hover{border-color:rgba(240,185,11,0.3)}.success-msg{color:#0ECB81;font-size:13px;margin-top:10px}.error-msg{color:#ff6b6b;font-size:13px;margin-top:10px}`}</style>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28}}>
        <div><div className="page-title">Assets</div><div className="page-sub">{assets.length} investment listings</div></div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "+ New Asset"}</button>
      </div>
      {msg && <div className={msg.includes("!") ? "success-msg" : "error-msg"} style={{marginBottom:16}}>{msg}</div>}
      {showForm && (
        <div className="card" style={{marginBottom:28}}>
          <div style={{fontSize:16,fontWeight:700,marginBottom:4}}>Create New Asset</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:20}}>Fill in the details to list a new investment</div>
          <form onSubmit={createAsset}>
            <div className="sec">Basic Info</div>
            <div className="form-grid">
              <F label="Asset Name *"><input className="input" value={assetForm.name} onChange={e=>setAssetForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Vilnius Office Tower" required /></F>
              <F label="Ticker *"><input className="input" value={assetForm.ticker} onChange={e=>setAssetForm(f=>({...f,ticker:e.target.value.toUpperCase()}))} placeholder="e.g. VPOP" maxLength={8} required /></F>
              <F label="Asset Type *"><select className="select" style={{width:"100%"}} value={assetForm.assetType} onChange={e=>setAssetForm(f=>({...f,assetType:e.target.value}))}><option value="real_estate">Real Estate</option><option value="bond">Bond</option><option value="equity">Equity</option><option value="energy">Energy</option><option value="fund">Fund</option><option value="infrastructure">Infrastructure</option><option value="commodity">Commodity</option><option value="other">Other</option></select></F>
              <F label="Issuer Name"><input className="input" value={assetForm.issuerName} onChange={e=>setAssetForm(f=>({...f,issuerName:e.target.value}))} placeholder="Company name" /></F>
              <F label="Location"><input className="input" value={assetForm.location} onChange={e=>setAssetForm(f=>({...f,location:e.target.value}))} placeholder="Vilnius, Lithuania" /></F>
              <F label="Country"><input className="input" value={assetForm.country} onChange={e=>setAssetForm(f=>({...f,country:e.target.value}))} placeholder="Lithuania" /></F>
            </div>
            <div className="field" style={{marginTop:16}}><label className="label">Description</label><textarea className="input" style={{resize:"vertical",minHeight:80}} value={assetForm.description} onChange={e=>setAssetForm(f=>({...f,description:e.target.value}))} placeholder="Describe the investment opportunity..." /></div>
            <div className="sec">Financials</div>
            <div className="form-grid">
              <F label="Target Raise (EUR) *"><input className="input" type="number" value={assetForm.targetRaise} onChange={e=>setAssetForm(f=>({...f,targetRaise:e.target.value}))} placeholder="1000000" required /></F>
              <F label="Min Investment (EUR)"><input className="input" type="number" value={assetForm.minInvestment} onChange={e=>setAssetForm(f=>({...f,minInvestment:e.target.value}))} placeholder="500" /></F>
              <F label="Target ROI (%)"><input className="input" type="number" step="0.1" value={assetForm.targetROI} onChange={e=>setAssetForm(f=>({...f,targetROI:e.target.value}))} placeholder="8.5" /></F>
              <F label="Term (months)"><input className="input" type="number" value={assetForm.term} onChange={e=>setAssetForm(f=>({...f,term:e.target.value}))} placeholder="36" /></F>
              <F label="Yield Frequency"><select className="select" style={{width:"100%"}} value={assetForm.yieldFrequency} onChange={e=>setAssetForm(f=>({...f,yieldFrequency:e.target.value}))}><option value="monthly">Monthly</option><option value="quarterly">Quarterly</option><option value="annual">Annual</option><option value="at_maturity">At Maturity</option></select></F>
              <F label="Currency"><select className="select" style={{width:"100%"}} value={assetForm.currency} onChange={e=>setAssetForm(f=>({...f,currency:e.target.value}))}><option value="EUR">EUR</option><option value="USD">USD</option><option value="GBP">GBP</option></select></F>
            </div>
            <div className="sec">Token Details</div>
            <div className="form-grid">
              <F label="Token Supply"><input className="input" type="number" value={assetForm.tokenSupply} onChange={e=>setAssetForm(f=>({...f,tokenSupply:e.target.value}))} placeholder="10000" /></F>
              <F label="Token Price (EUR)"><input className="input" type="number" step="0.01" value={assetForm.tokenPrice} onChange={e=>setAssetForm(f=>({...f,tokenPrice:e.target.value}))} placeholder="100" /></F>
            </div>
            <div className="sec">Status and Risk</div>
            <div className="form-grid">
              <F label="Status"><select className="select" style={{width:"100%"}} value={assetForm.status} onChange={e=>setAssetForm(f=>({...f,status:e.target.value}))}><option value="draft">Draft</option><option value="review">Under Review</option><option value="approved">Approved</option><option value="live">Live</option><option value="closing">Closing</option><option value="closed">Closed</option></select></F>
              <F label="Risk Level"><select className="select" style={{width:"100%"}} value={assetForm.riskLevel} onChange={e=>setAssetForm(f=>({...f,riskLevel:e.target.value}))}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></F>
            </div>
            <div className="sec">Photos ({images.length})</div>
            {images.length > 0 && <div className="img-grid">{images.map(img => <div className="img-item" key={img.tempId}><img src={img.preview} alt="" />{img.uploading && <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11}}>...</div>}<button type="button" className="img-remove" onClick={() => setImages(p => p.filter(i => i.tempId !== img.tempId))}>x</button></div>)}</div>}
            <input type="file" accept="image/*" multiple ref={fileRef} style={{display:"none"}} onChange={handleImagePick} />
            <div className="upload-zone" onClick={() => fileRef.current.click()}><div style={{fontSize:20,marginBottom:4}}>+</div><div style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>{uploading ? "Uploading..." : "Click to add photos"}</div></div>
            <div style={{marginTop:16}}><button className="btn btn-primary" type="submit" disabled={loading||uploading}>{loading ? "Creating..." : "Create Asset"}</button></div>
            {msg && <div className={msg.includes("!") ? "success-msg" : "error-msg"}>{msg}</div>}
          </form>
        </div>
      )}
      {loading && !showForm ? <div className="card"><div className="empty">Loading...</div></div> : (
        assets.length === 0 ? <div className="card"><div className="empty">No assets yet — click New Asset to create one</div></div> : (
          <div className="asset-cards">{assets.map(a => (
            <div className="asset-card" key={a._id}>
              {a.imageUrl ? <img className="asset-img" src={a.imageUrl} alt={a.name} /> : <div className="asset-placeholder">🏢</div>}
              <div className="asset-body">
                <div className="asset-name">{a.name}</div>
                <div className="asset-ticker">{a.ticker}</div>
                <div className="asset-row"><span>Target Raise</span><span>EUR {a.targetRaise?.toLocaleString()}</span></div>
                <div className="asset-row"><span>Min. Investment</span><span>EUR {a.minInvestment?.toLocaleString()}</span></div>
                <div className="asset-row"><span>ROI</span><span style={{color:"#0ECB81"}}>{a.targetROI ? a.targetROI+"%" : "N/A"}</span></div>
                <div className="asset-footer">
                  <span className={`badge badge-${a.status==="live"?"green":a.status==="draft"||a.status==="review"?"yellow":a.status==="cancelled"?"red":"gray"}`}>{a.status}</span>
                  <div style={{display:"flex",gap:8}}>
                    <Link href={`/admin/assets/${a._id}`} className="btn btn-ghost btn-sm">Details</Link>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteAsset(a._id)}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}</div>
        )
      )}
    </AdminLayout>
  );
}
