import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

export default function AssetDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState("");
  const [uploading, setUploading] = useState("");
  const [viewImg, setViewImg] = useState(null);
  const imgRef = useRef();
  const docRef = useRef();

  useEffect(() => {
    if (!id) return;
    const stored = localStorage.getItem("adminEmployee");
    if (!stored) { router.push("/admin/login"); return; }
    fetchAsset();
  }, [id]);

  async function fetchAsset() {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("/api/admin/assets/" + id, { headers: { Authorization: "Bearer " + token } });
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setAsset(data.asset || data);
    } catch (err) { setError(err.message); }
    setLoading(false);
  }

  async function updateStatus(status) {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("/api/admin/assets/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ status }),
      });
      if (res.ok) { setActionMsg("Status updated to " + status); fetchAsset(); }
      else { const d = await res.json(); setActionMsg(d.error || "Failed"); }
    } catch { setActionMsg("Network error"); }
    setTimeout(() => setActionMsg(""), 4000);
  }

  async function uploadFile(file, type) {
    setUploading(type);
    try {
      const token = localStorage.getItem("adminToken");
      const fd = new FormData();
      fd.append("file", file);
      const upRes = await fetch("/api/admin/upload", { method: "POST", headers: { Authorization: "Bearer " + token }, body: fd });
      if (!upRes.ok) throw new Error("Upload failed");
      const { url } = await upRes.json();

      let update = {};
      if (type === "image") {
        update = { imageUrl: url };
      } else {
        const existing = asset.documents || [];
        const name = file.name || "Document";
        const ext = name.split(".").pop().toLowerCase();
        const docType = ext === "pdf" ? "PDF" : ext.match(/jpe?g|png|gif|webp/) ? "Image" : "File";
        update = { documents: [...existing, { name, url, type: docType }] };
      }

      const saveRes = await fetch("/api/admin/assets/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify(update),
      });
      if (saveRes.ok) { setActionMsg(type === "image" ? "Image updated" : "Document added"); fetchAsset(); }
      else { setActionMsg("Save failed"); }
    } catch (err) { setActionMsg(err.message); }
    setUploading("");
    setTimeout(() => setActionMsg(""), 4000);
  }

  async function removeDoc(index) {
    try {
      const token = localStorage.getItem("adminToken");
      const docs = [...(asset.documents || [])];
      docs.splice(index, 1);
      const res = await fetch("/api/admin/assets/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ documents: docs }),
      });
      if (res.ok) { setActionMsg("Document removed"); fetchAsset(); }
    } catch { setActionMsg("Failed to remove"); }
    setTimeout(() => setActionMsg(""), 4000);
  }

  const sc = { draft:"#6B7280",review:"#3B82F6",approved:"#0ECB81",live:"#0ECB81",rejected:"#ff6b6b",closed:"#6B7280" };
  if (loading) return <div style={{minHeight:"100vh",background:"#0D1117",color:"rgba(255,255,255,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"system-ui"}}>Loading...</div>;
  if (error || !asset) return <div style={{minHeight:"100vh",background:"#0D1117",color:"#ff6b6b",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"system-ui"}}>{error || "Not found"}</div>;

  const Row = ({l,v}) => <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",fontSize:13}}><span style={{color:"rgba(255,255,255,0.4)"}}>{l}</span><span style={{fontWeight:500}}>{v}</span></div>;
  const Card = ({title,children,action}) => <div style={{background:"#161B22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:20,marginBottom:20}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:.5}}>{title}</div>{action||null}</div>{children}</div>;
  const Btn = ({onClick,bg,color,children,disabled}) => <button onClick={onClick} disabled={disabled} style={{padding:"8px 20px",borderRadius:8,fontSize:13,fontWeight:600,border:"none",cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.5:1,background:bg,color,marginRight:8,marginTop:8}}>{children}</button>;
  const UpBtn = ({onClick,label,isLoading}) => <button onClick={onClick} disabled={isLoading} style={{padding:"6px 16px",borderRadius:8,fontSize:12,fontWeight:600,border:"1px solid rgba(240,185,11,0.3)",background:"rgba(240,185,11,0.06)",color:"#F0B90B",cursor:isLoading?"wait":"pointer"}}>{isLoading ? "Uploading..." : label}</button>;

  return (
    <>
      <Head><title>{asset.name} | Admin</title></Head>
      <input ref={imgRef} type="file" accept="image/*" hidden onChange={e => { if (e.target.files[0]) uploadFile(e.target.files[0], "image"); }} />
      <input ref={docRef} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif" hidden onChange={e => { if (e.target.files[0]) uploadFile(e.target.files[0], "document"); }} />

      {viewImg && <div onClick={() => setViewImg(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",backdropFilter:"blur(4px)"}}><img src={viewImg} alt="" style={{maxWidth:"90vw",maxHeight:"90vh",borderRadius:12,objectFit:"contain"}} /></div>}

      <div style={{minHeight:"100vh",background:"#0D1117",color:"#fff",fontFamily:"-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif"}}>
        <div style={{padding:"20px 32px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",gap:16}}>
          <Link href="/admin/assets" style={{background:"none",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"6px 14px",color:"rgba(255,255,255,0.5)",fontSize:13,textDecoration:"none"}}>Back to Assets</Link>
          <div style={{flex:1}} />
          <span style={{padding:"3px 10px",borderRadius:6,fontSize:11,fontWeight:600,background:(sc[asset.status]||"#6B7280")+"15",color:sc[asset.status]||"#6B7280"}}>{asset.status}</span>
        </div>
        <div style={{padding:32,maxWidth:1000}}>
          {actionMsg && <div style={{background:actionMsg.includes("updated")||actionMsg.includes("added")||actionMsg.includes("removed")||actionMsg.includes("Image")?"rgba(14,203,129,0.1)":"rgba(255,77,77,0.1)",border:"1px solid "+(actionMsg.includes("updated")||actionMsg.includes("added")||actionMsg.includes("removed")||actionMsg.includes("Image")?"rgba(14,203,129,0.2)":"rgba(255,77,77,0.2)"),borderRadius:8,padding:"10px 14px",fontSize:13,color:actionMsg.includes("updated")||actionMsg.includes("added")||actionMsg.includes("removed")||actionMsg.includes("Image")?"#0ECB81":"#ff6b6b",marginBottom:16}}>{actionMsg}</div>}

          <div style={{fontSize:26,fontWeight:900,marginBottom:4}}>{asset.name}</div>
          <div style={{fontSize:14,color:"#F0B90B",fontWeight:700,marginBottom:20}}>{asset.ticker} - {asset.assetType||"N/A"}</div>
          {asset.description && <p style={{fontSize:14,color:"rgba(255,255,255,0.6)",lineHeight:1.7,marginBottom:24}}>{asset.description}</p>}

          {/* Asset Image */}
          <Card title="Asset Image" action={<UpBtn onClick={() => imgRef.current.click()} label={asset.imageUrl ? "Replace Image" : "Upload Image"} isLoading={uploading==="image"} />}>
            {asset.imageUrl ? (
              <div style={{cursor:"pointer"}} onClick={() => setViewImg(asset.imageUrl)}>
                <img src={asset.imageUrl} alt={asset.name} style={{width:"100%",maxHeight:400,objectFit:"cover",borderRadius:10}} />
                <div style={{fontSize:11,color:"rgba(255,255,255,0.25)",marginTop:6}}>Click to view full size</div>
              </div>
            ) : (
              <div style={{textAlign:"center",padding:40,color:"rgba(255,255,255,0.2)",border:"2px dashed rgba(255,255,255,0.08)",borderRadius:10,cursor:"pointer"}} onClick={() => imgRef.current.click()}>
                <div style={{fontSize:36,marginBottom:8}}>+</div>
                <div style={{fontSize:13}}>No image uploaded. Click to add.</div>
              </div>
            )}
          </Card>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:0}}>
            <Card title="Financial Details">
              <Row l="Target Raise" v={"EUR "+Number(asset.targetRaise||0).toLocaleString()} />
              <Row l="Min Investment" v={"EUR "+Number(asset.minInvestment||0).toLocaleString()} />
              <Row l="Token Price" v={"EUR "+Number(asset.tokenPrice||0).toLocaleString()} />
              <Row l="Token Supply" v={Number(asset.tokenSupply||0).toLocaleString()} />
              <Row l="Target ROI" v={(asset.targetROI||asset.roi||"N/A")+"%"} />
              <Row l="Term" v={asset.term||"N/A"} />
              <Row l="Currency" v={asset.currency||"EUR"} />
              <Row l="Yield Frequency" v={asset.yieldFrequency||"N/A"} />
            </Card>
            <Card title="Asset Info">
              <Row l="Location" v={asset.location||"N/A"} />
              <Row l="Country" v={asset.country||"N/A"} />
              <Row l="Issuer" v={asset.issuerName||"N/A"} />
              <Row l="Risk Level" v={asset.riskLevel||"N/A"} />
              <Row l="Status" v={asset.status} />
              <Row l="Created" v={asset.createdAt?new Date(asset.createdAt).toLocaleDateString():"N/A"} />
              <Row l="Asset ID" v={asset._id} />
            </Card>
          </div>

          {/* Documents */}
          <Card title={"Documents ("+(asset.documents?.length||0)+")"} action={<UpBtn onClick={() => docRef.current.click()} label="+ Add Document" isLoading={uploading==="document"} />}>
            {asset.documents && asset.documents.length > 0 ? (
              <div>{asset.documents.map((doc,i) => (
                <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,marginBottom:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:18}}>{(doc.type||"").toLowerCase()==="pdf"?"\uD83D\uDCC4":"\uD83D\uDCC1"}</span>
                    <div>
                      <div style={{fontSize:13,fontWeight:600}}>{doc.name||("Document "+(i+1))}</div>
                      <div style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>{doc.type||"File"}</div>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    <a href={doc.url} target="_blank" rel="noreferrer" style={{padding:"5px 12px",borderRadius:6,fontSize:11,fontWeight:600,background:"rgba(59,130,246,0.12)",color:"#3B82F6",textDecoration:"none",border:"none",cursor:"pointer"}}>View</a>
                    <button onClick={() => removeDoc(i)} style={{padding:"5px 12px",borderRadius:6,fontSize:11,fontWeight:600,background:"rgba(255,77,77,0.1)",color:"#ff6b6b",border:"none",cursor:"pointer"}}>Remove</button>
                  </div>
                </div>
              ))}</div>
            ) : (
              <div style={{textAlign:"center",padding:30,color:"rgba(255,255,255,0.2)",border:"2px dashed rgba(255,255,255,0.08)",borderRadius:10,cursor:"pointer"}} onClick={() => docRef.current.click()}>
                <div style={{fontSize:13}}>No documents yet. Click to upload.</div>
              </div>
            )}
          </Card>

          {/* Admin Actions */}
          <Card title="Admin Actions">
            <Btn onClick={()=>updateStatus("approved")} bg="rgba(14,203,129,0.15)" color="#0ECB81">Approve</Btn>
            <Btn onClick={()=>updateStatus("live")} bg="rgba(14,203,129,0.12)" color="#0ECB81">Set Live</Btn>
            <Btn onClick={()=>updateStatus("review")} bg="rgba(59,130,246,0.12)" color="#3B82F6">Under Review</Btn>
            <Btn onClick={()=>updateStatus("rejected")} bg="rgba(255,77,77,0.12)" color="#ff6b6b">Reject</Btn>
            <Btn onClick={()=>updateStatus("closed")} bg="rgba(255,255,255,0.06)" color="rgba(255,255,255,0.5)">Close</Btn>
            <Btn onClick={()=>updateStatus("draft")} bg="rgba(255,255,255,0.06)" color="rgba(255,255,255,0.4)">Reset Draft</Btn>
          </Card>
        </div>
      </div>
    </>
  );
}