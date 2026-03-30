import { useEffect, useState } from "react";
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

  const sc = { draft:"#6B7280",review:"#3B82F6",approved:"#0ECB81",live:"#0ECB81",rejected:"#ff6b6b",closed:"#6B7280" };
  if (loading) return <div style={{minHeight:"100vh",background:"#0D1117",color:"rgba(255,255,255,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"system-ui"}}>Loading...</div>;
  if (error || !asset) return <div style={{minHeight:"100vh",background:"#0D1117",color:"#ff6b6b",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"system-ui"}}>{error || "Not found"}</div>;

  const Row = ({l,v}) => <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",fontSize:13}}><span style={{color:"rgba(255,255,255,0.4)"}}>{l}</span><span style={{fontWeight:500}}>{v}</span></div>;
  const Card = ({title,children}) => <div style={{background:"#161B22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:20,marginBottom:20}}><div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:.5,marginBottom:12}}>{title}</div>{children}</div>;
  const Btn = ({onClick,bg,color,children}) => <button onClick={onClick} style={{padding:"8px 20px",borderRadius:8,fontSize:13,fontWeight:600,border:"none",cursor:"pointer",background:bg,color,marginRight:8,marginTop:8}}>{children}</button>;

  return (
    <>
      <Head><title>{asset.name} | Admin</title></Head>
      <div style={{minHeight:"100vh",background:"#0D1117",color:"#fff",fontFamily:"-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif"}}>
        <div style={{padding:"20px 32px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",gap:16}}>
          <Link href="/admin/assets" style={{background:"none",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"6px 14px",color:"rgba(255,255,255,0.5)",fontSize:13,textDecoration:"none"}}>Back to Assets</Link>
          <div style={{flex:1}} />
          <span style={{padding:"3px 10px",borderRadius:6,fontSize:11,fontWeight:600,background:(sc[asset.status]||"#6B7280")+"15",color:sc[asset.status]||"#6B7280"}}>{asset.status}</span>
        </div>
        <div style={{padding:32,maxWidth:1000}}>
          {actionMsg && <div style={{background:actionMsg.includes("updated")?"rgba(14,203,129,0.1)":"rgba(255,77,77,0.1)",border:"1px solid "+(actionMsg.includes("updated")?"rgba(14,203,129,0.2)":"rgba(255,77,77,0.2)"),borderRadius:8,padding:"10px 14px",fontSize:13,color:actionMsg.includes("updated")?"#0ECB81":"#ff6b6b",marginBottom:16}}>{actionMsg}</div>}
          <div style={{fontSize:26,fontWeight:900,marginBottom:4}}>{asset.name}</div>
          <div style={{fontSize:14,color:"#F0B90B",fontWeight:700,marginBottom:20}}>{asset.ticker} - {asset.assetType||"N/A"}</div>
          {asset.description && <p style={{fontSize:14,color:"rgba(255,255,255,0.6)",lineHeight:1.7,marginBottom:24}}>{asset.description}</p>}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24}}>
            <Card title="Financial Details">
              <Row l="Target Raise" v={"EUR "+Number(asset.targetRaise||0).toLocaleString()} />
              <Row l="Min Investment" v={"EUR "+Number(asset.minInvestment||0).toLocaleString()} />
              <Row l="Token Price" v={"EUR "+Number(asset.tokenPrice||0).toLocaleString()} />
              <Row l="Token Supply" v={Number(asset.tokenSupply||0).toLocaleString()} />
              <Row l="Target ROI" v={(asset.targetROI||asset.roi||"N/A")+"%"} />
              <Row l="Term" v={asset.term||"N/A"} />
              <Row l="Yield Frequency" v={asset.yieldFrequency||"N/A"} />
            </Card>
            <Card title="Asset Info">
              <Row l="Location" v={asset.location||"N/A"} />
              <Row l="Country" v={asset.country||"N/A"} />
              <Row l="Issuer" v={asset.issuerName||"N/A"} />
              <Row l="Risk Level" v={asset.riskLevel||"N/A"} />
              <Row l="Created" v={asset.createdAt?new Date(asset.createdAt).toLocaleDateString():"N/A"} />
            </Card>
          </div>
          {asset.images && asset.images.length > 0 && <Card title={"Images ("+asset.images.length+")"}><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12}}>{asset.images.map((img,i)=><img key={i} src={img.url||img} alt="" style={{width:"100%",height:200,objectFit:"cover",borderRadius:10}} />)}</div></Card>}
          <Card title="Admin Actions">
            <Btn onClick={()=>updateStatus("approved")} bg="rgba(14,203,129,0.15)" color="#0ECB81">Approve</Btn>
            <Btn onClick={()=>updateStatus("live")} bg="rgba(14,203,129,0.12)" color="#0ECB81">Set Live</Btn>
            <Btn onClick={()=>updateStatus("review")} bg="rgba(59,130,246,0.12)" color="#3B82F6">Under Review</Btn>
            <Btn onClick={()=>updateStatus("rejected")} bg="rgba(255,77,77,0.12)" color="#ff6b6b">Reject</Btn>
            <Btn onClick={()=>updateStatus("draft")} bg="rgba(255,255,255,0.06)" color="rgba(255,255,255,0.4)">Reset Draft</Btn>
          </Card>
        </div>
      </div>
    </>
  );
}