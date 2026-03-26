import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSession } from "next-auth/react";
import Navbar from "../components/Navbar";

const CATEGORIES = {
  photos: { label: "Asset Photos", icon: "📸", desc: "Visible to all visitors", visibility: "public", types: ["Property Exterior","Property Interior","Aerial View","Progress Photos","Other Photos"] },
  legal: { label: "Legal Documents", icon: "⚖️", desc: "Admin review required", visibility: "admin_only", types: ["Certificate of Incorporation","Articles of Association","Board Resolution","UBO Declaration","Legal Opinion","Other Legal"] },
  financial: { label: "Financial Documents", icon: "💰", desc: "Verified investors only", visibility: "investors_only", types: ["Audited Financial Statements","Bank Statements","Asset Valuation Report","P&L Statement","Cash Flow Statement","Other Financial"] },
  operational: { label: "Operational", icon: "🏗️", desc: "Admin review required", visibility: "admin_only", types: ["Title Deed","Appraisal Report","Insurance Certificate","Lease Agreement","Maintenance Records","Other Operational"] },
  compliance: { label: "Compliance & KYC", icon: "🔐", desc: "Admin only", visibility: "admin_only", types: ["Government-issued ID","Proof of Address","Sanctions Screening","AML Check","Tax ID Certificate","Other Compliance"] },
  technical: { label: "Technical", icon: "⛓️", desc: "Admin only", visibility: "admin_only", types: ["Smart Contract Details","Tokenomics Document","Offering Structure","Milestone Plan","Whitepaper","Other Technical"] },
};

export default function IssuerDocuments() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [docs, setDocs] = useState([]);
  const [cat, setCat] = useState("photos");
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const [uploadForm, setUploadForm] = useState({ docType: "", file: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { if (mounted && session) fetch("/api/assets/my-listings").then(r => r.json()).then(d => { setAssets(d.assets || []); if (d.assets?.[0]) setSelectedAsset(d.assets[0]._id); setLoading(false); }).catch(() => setLoading(false)); }, [mounted, session]);
  useEffect(() => { if (selectedAsset) loadDocs(); }, [selectedAsset, cat]);

  const loadDocs = () => fetch("/api/assets/documents?assetId=" + selectedAsset + "&category=" + cat).then(r => r.json()).then(d => setDocs(d.documents || [])).catch(() => {});

  const upload = async () => {
    if (!uploadForm.docType || !uploadForm.file) { setMsg("Select type and file"); return; }
    setUploading(true); setMsg("");
    try {
      const fd = new FormData(); fd.append("file", uploadForm.file);
      const ur = await fetch("/api/upload", { method: "POST", body: fd });
      const ud = await ur.json();
      if (!ur.ok) throw new Error(ud.error || "Upload failed");
      const res = await fetch("/api/assets/documents", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ assetId: selectedAsset, category: cat, docType: uploadForm.docType, fileName: uploadForm.file.name, fileUrl: ud.url || ud.fileUrl || "", fileSize: uploadForm.file.size, mimeType: uploadForm.file.type, visibility: CATEGORIES[cat].visibility }) });
      const data = await res.json();
      setMsg(res.ok ? "Uploaded: " + uploadForm.file.name : "Error: " + data.error);
      setUploadForm({ docType: "", file: null }); loadDocs();
    } catch (e) { setMsg("Error: " + e.message); } finally { setUploading(false); }
  };

  const deleteDoc = async (id) => { if (!confirm("Delete?")) return; await fetch("/api/assets/documents", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ docId: id }) }); loadDocs(); };

  const badge = (s) => { const c = { pending: "#f59e0b", approved: "#22c55e", rejected: "#ef4444" }; return <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: (c[s]||"#666") + "15", color: c[s]||"#666", fontWeight: 700 }}>{s}</span>; };
  const visBadge = (v) => { const c = { public: "#22c55e", investors_only: "#3b82f6", admin_only: "#f59e0b" }; const l = { public: "Public", investors_only: "Investors", admin_only: "Admin" }; return <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 3, background: (c[v]||"#666") + "15", color: c[v]||"#666", fontWeight: 600 }}>{l[v]||v}</span>; };
  const inp = { background: "#0a0e14", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "8px 12px", color: "#fff", fontSize: 13, outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box" };

  if (!mounted) return null;
  if (!session) return <div style={{ minHeight: "100vh", background: "#0B0E11", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><div style={{ textAlign: "center" }}><p>Please login first</p><button onClick={() => router.push("/login")} style={{ padding: "10px 24px", background: "#F0B90B", color: "#000", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 10 }}>Login</button></div></div>;

  return (
    <><Head><title>Asset Documents — Nextoken</title></Head><Navbar />
    <div style={{ minHeight: "100vh", background: "#0B0E11", color: "#fff", paddingTop: 70 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div><h1 style={{ fontSize: 24, fontWeight: 800 }}>Asset Documents</h1><p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Upload legal, financial, and operational documents</p></div>
          <button onClick={() => router.push("/issuer-dashboard")} style={{ padding: "8px 16px", borderRadius: 7, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Back</button>
        </div>
        {msg && <div style={{ background: msg.startsWith("Error") ? "rgba(255,77,77,0.1)" : "rgba(34,197,94,0.1)", border: "1px solid " + (msg.startsWith("Error") ? "rgba(255,77,77,0.2)" : "rgba(34,197,94,0.2)"), borderRadius: 8, padding: "10px 14px", fontSize: 13, color: msg.startsWith("Error") ? "#ff6b6b" : "#22c55e", marginBottom: 16 }}>{msg}</div>}
        <div style={{ marginBottom: 20 }}><select value={selectedAsset} onChange={e => setSelectedAsset(e.target.value)} style={{ ...inp, maxWidth: 400, cursor: "pointer" }}><option value="">Select asset</option>{assets.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}</select></div>
        {selectedAsset && <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20 }}>
          <div>{Object.entries(CATEGORIES).map(([k, ci]) => <div key={k} onClick={() => setCat(k)} style={{ padding: "12px 16px", borderRadius: 8, marginBottom: 4, cursor: "pointer", background: cat === k ? "#F0B90B15" : "rgba(255,255,255,0.03)", border: cat === k ? "1px solid #F0B90B30" : "1px solid rgba(255,255,255,0.05)" }}><div style={{ fontSize: 13, fontWeight: 600, color: cat === k ? "#F0B90B" : "rgba(255,255,255,0.6)" }}>{ci.icon} {ci.label}</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{ci.desc}</div></div>)}</div>
          <div>
            <div style={{ background: "#161b22", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", padding: 20, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><div><div style={{ fontSize: 18, fontWeight: 700 }}>{CATEGORIES[cat].icon} {CATEGORIES[cat].label}</div><div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{CATEGORIES[cat].desc}</div></div>{visBadge(CATEGORIES[cat].visibility)}</div>
              <div style={{ background: "#0a0e14", borderRadius: 8, padding: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#F0B90B", marginBottom: 8 }}>UPLOAD</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <select value={uploadForm.docType} onChange={e => setUploadForm({ ...uploadForm, docType: e.target.value })} style={{ ...inp, width: 250, cursor: "pointer" }}><option value="">Select type</option>{CATEGORIES[cat].types.map(t => <option key={t} value={t}>{t}</option>)}</select>
                  <input type="file" onChange={e => setUploadForm({ ...uploadForm, file: e.target.files[0] })} accept={cat === "photos" ? "image/*" : ".pdf,.doc,.docx,.jpg,.png"} style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }} />
                  <button onClick={upload} disabled={uploading} style={{ padding: "8px 20px", borderRadius: 6, background: "#F0B90B", color: "#000", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{uploading ? "Uploading..." : "Upload"}</button>
                </div>
              </div>
            </div>
            <div style={{ background: "#161b22", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
              {docs.length === 0 ? <div style={{ padding: 30, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>No documents uploaded</div> : docs.map((d, i) => (
                <div key={i} style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div><a href={d.fileUrl} target="_blank" rel="noopener" style={{ color: "#F0B90B", textDecoration: "none", fontWeight: 600 }}>{d.fileName}</a><div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{d.docType}</div></div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>{visBadge(d.visibility)}{badge(d.status)}<button onClick={() => deleteDoc(d._id)} style={{ padding: "3px 8px", borderRadius: 4, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", fontSize: 9, cursor: "pointer", fontFamily: "inherit" }}>Del</button></div>
                </div>
              ))}
            </div>
            <div style={{ background: "#161b22", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", padding: 16, marginTop: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>REQUIRED</div>
              {CATEGORIES[cat].types.map((t, i) => { const up = docs.some(d => d.docType === t); return <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", fontSize: 12 }}><span style={{ color: up ? "#22c55e" : "rgba(255,255,255,0.2)" }}>{up ? "✓" : "○"}</span><span style={{ color: up ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)" }}>{t}</span></div>; })}
            </div>
          </div>
        </div>}
      </div>
    </div></>
  );
}
