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
      const res = await fetch("/api/admin/assets/" + id, {
        headers: { Authorization: "Bearer " + token },
      });
      if (!res.ok) throw new Error("Failed to load asset");
      const data = await res.json();
      setAsset(data.asset || data);
    } catch (err) {
      setError(err.message);
    }
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
      if (res.ok) {
        setActionMsg("Status updated to " + status);
        fetchAsset();
      } else {
        const d = await res.json();
        setActionMsg(d.error || "Failed");
      }
    } catch { setActionMsg("Network error"); }
    setTimeout(() => setActionMsg(""), 4000);
  }

  const s = {
    page: { minHeight:"100vh",background:"#0D1117",color:"#fff",fontFamily:"-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" },
    header: { padding:"20px 32px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",gap:16 },
    back: { background:"none",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"6px 14px",color:"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:13,textDecoration:"none" },
    main: { padding:32,maxWidth:1000 },
    title: { fontSize:26,fontWeight:900,marginBottom:4 },
    ticker: { fontSize:14,color:"#F0B90B",fontWeight:700,marginBottom:20 },
    grid: { display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24 },
    card: { background:"#161B22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:20 },
    cardTitle: { fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:.5,marginBottom:12 },
    row: { display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",fontSize:13 },
    label: { color:"rgba(255,255,255,0.4)" },
    val: { fontWeight:500 },
    badge: (color) => ({ display:"inline-block",padding:"3px 10px",borderRadius:6,fontSize:11,fontWeight:600,background:color+"15",color:color }),
    btn: (bg,fg) => ({ padding:"8px 20px",borderRadius:8,fontSize:13,fontWeight:600,border:"none",cursor:"pointer",background:bg,color:fg,marginRight:8,marginTop:8 }),
    img: { width:"100%",height:200,objectFit:"cover",borderRadius:10,marginBottom:8 },
    imgGrid: { display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12 },
    docLink: { display:"inline-block",background:"rgba(240,185,11,0.06)",border:"1px solid rgba(240,185,11,0.15)",borderRadius:8,padding:"8px 14px",fontSize:12,color:"#F0B90B",textDecoration:"none",marginRight:8,marginBottom:8 },
    msg: (ok) => ({ background:ok?"rgba(14,203,129,0.1)":"rgba(255,77,77,0.1)",border:"1px solid "+(ok?"rgba(14,203,129,0.2)":"rgba(255,77,77,0.2)"),borderRadius:8,padding:"10px 14px",fontSize:13,color:ok?"#0ECB81":"#ff6b6b",marginBottom:16 }),
  };

  const statusColor = { draft:"#6B7280",review:"#3B82F6",approved:"#0ECB81",live:"#0ECB81",rejected:"#ff6b6b",closed:"#6B7280",cancelled:"#ff6b6b" };

  if (loading) return <div style={{...s.page,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{color:"rgba(255,255,255,0.3)"}}>Loading...</div></div>;
  if (error) return <div style={{...s.page,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{color:"#ff6b6b"}}>{error}</div></div>;
  if (!asset) return null;

  return (
    <>
      <Head><title>{asset.name} | Nextoken Admin</title></Head>
      <div style={s.page}>
        <div style={s.header}>
          <Link href="/admin/assets" style={s.back}>← Back to Assets</Link>
          <div style={{flex:1}} />
          <span style={s.badge(statusColor[asset.status] || "#6B7280")}>{asset.status}</span>
        </div>

        <div style={s.main}>
          {actionMsg && <div style={s.msg(actionMsg.includes("updated"))}>{actionMsg}</div>}

          <div style={s.title}>{asset.name}</div>
          <div style={s.ticker}>{asset.ticker} — {asset.assetType || "N/A"}</div>

          {asset.description && <p style={{fontSize:14,color:"rgba(255,255,255,0.6)",lineHeight:1.7,marginBottom:24}}>{asset.description}</p>}

          <div style={s.grid}>
            <div style={s.card}>
              <div style={s.cardTitle}>Financial Details</div>
              <div style={s.row}><span style={s.label}>Target Raise</span><span style={s.val}>EUR {Number(asset.targetRaise||0).toLocaleString()}</span></div>
              <div style={s.row}><span style={s.label}>Min Investment</span><span style={s.val}>EUR {Number(asset.minInvestment||0).toLocaleString()}</span></div>
              <div style={s.row}><span style={s.label}>Token Price</span><span style={s.val}>EUR {Number(asset.tokenPrice||0).toLocaleString()}</span></div>
              <div style={s.row}><span style={s.label}>Token Supply</span><span style={s.val}>{Number(asset.tokenSupply||0).toLocaleString()}</span></div>
              <div style={s.row}><span style={s.label}>Target ROI</span><span style={{...s.val,color:"#0ECB81"}}>{asset.targetROI || asset.roi || "N/A"}%</span></div>
              <div style={s.row}><span style={s.label}>Term</span><span style={s.val}>{asset.term || "N/A"}</span></div>
              <div style={s.row}><span style={s.label}>Currency</span><span style={s.val}>{asset.currency || "EUR"}</span></div>
              <div style={s.row}><span style={s.label}>Yield Frequency</span><span style={s.val}>{asset.yieldFrequency || "N/A"}</span></div>
            </div>

            <div style={s.card}>
              <div style={s.cardTitle}>Asset Information</div>
              <div style={s.row}><span style={s.label}>Location</span><span style={s.val}>{asset.location || "N/A"}</span></div>
              <div style={s.row}><span style={s.label}>Country</span><span style={s.val}>{asset.country || "N/A"}</span></div>
              <div style={s.row}><span style={s.label}>Issuer</span><span style={s.val}>{asset.issuerName || "N/A"}</span></div>
              <div style={s.row}><span style={s.label}>Risk Level</span><span style={s.val}>{asset.riskLevel || "N/A"}</span></div>
              <div style={s.row}><span style={s.label}>Status</span><span style={s.badge(statusColor[asset.status]||"#6B7280")}>{asset.status}</span></div>
              <div style={s.row}><span style={s.label}>Created</span><span style={s.val}>{asset.createdAt ? new Date(asset.createdAt).toLocaleDateString() : "N/A"}</span></div>
              <div style={s.row}><span style={s.label}>Asset ID</span><span style={{fontSize:11,fontFamily:"monospace",color:"rgba(255,255,255,0.4)"}}>{asset._id}</span></div>
            </div>
          </div>

          {/* Images */}
          {asset.images && asset.images.length > 0 && (
            <div style={{...s.card,marginBottom:24}}>
              <div style={s.cardTitle}>Images ({asset.images.length})</div>
              <div style={s.imgGrid}>
                {asset.images.map((img,i) => <img key={i} src={img.url||img} alt={asset.name} style={s.img} />)}
              </div>
            </div>
          )}

          {/* Documents */}
          {asset.documents && asset.documents.length > 0 && (
            <div style={{...s.card,marginBottom:24}}>
              <div style={s.cardTitle}>Documents ({asset.documents.length})</div>
              {asset.documents.map((doc,i) => (
                <a key={i} href={doc.url||doc.path||doc} target="_blank" rel="noreferrer" style={s.docLink}>
                  {doc.type||doc.name||("Document "+(i+1))}
                </a>
              ))}
            </div>
          )}

          {/* Admin Actions */}
          <div style={{...s.card,marginBottom:24}}>
            <div style={s.cardTitle}>Admin Actions</div>
            <div style={{display:"flex",flexWrap:"wrap"}}>
              <button onClick={()=>updateStatus("approved")} style={s.btn("rgba(14,203,129,0.15)","#0ECB81")}>Approve</button>
              <button onClick={()=>updateStatus("live")} style={s.btn("rgba(14,203,129,0.12)","#0ECB81")}>Set Live</button>
              <button onClick={()=>updateStatus("review")} style={s.btn("rgba(59,130,246,0.12)","#3B82F6")}>Under Review</button>
              <button onClick={()=>updateStatus("rejected")} style={s.btn("rgba(255,77,77,0.12)","#ff6b6b")}>Reject</button>
              <button onClick={()=>updateStatus("closed")} style={s.btn("rgba(255,255,255,0.06)","rgba(255,255,255,0.5)")}>Close</button>
              <button onClick={()=>updateStatus("draft")} style={s.btn("rgba(255,255,255,0.06)","rgba(255,255,255,0.4)")}>Reset Draft</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}