import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSession } from "next-auth/react";
import Navbar from "../components/Navbar";

const CATEGORIES = {
  photos: { label: "Asset Photos", icon: "📸", desc: "Property images, equipment photos — visible to all visitors", visibility: "public",
    types: ["Property Exterior","Property Interior","Location/Neighborhood","Equipment/Machinery","Site Plan","Aerial View","Progress Photos","Other Photos"] },
  legal: { label: "Legal Documents", icon: "⚖️", desc: "Corporate and legal documents — admin review required", visibility: "admin_only",
    types: ["Certificate of Incorporation","Articles of Association","Board Resolution","Beneficial Owner Declaration (UBO)","Legal Opinion","Power of Attorney","License/Permit","Other Legal"] },
  financial: { label: "Financial Documents", icon: "💰", desc: "Financial statements — visible to verified investors only", visibility: "investors_only",
    types: ["Audited Financial Statements","Bank Statements","Asset Valuation Report","Debt Obligations","Profit & Loss Statement","Cash Flow Statement","Tax Returns","Other Financial"] },
  operational: { label: "Operational Documents", icon: "🏗️", desc: "Asset ownership and operational documents", visibility: "admin_only",
    types: ["Title Deed / Ownership Proof","Appraisal Report","Insurance Certificate","Lease Agreement","Maintenance Records","Environmental Assessment","Building Permits","Other Operational"] },
  compliance: { label: "Compliance & KYC", icon: "🔐", desc: "Identity and compliance documents", visibility: "admin_only",
    types: ["Government-issued ID","Proof of Address","Sanctions Screening Result","AML Check Result","Tax ID Certificate","Other Compliance"] },
  technical: { label: "Technical / Blockchain", icon: "⛓️", desc: "Smart contract and tokenization details", visibility: "admin_only",
    types: ["Smart Contract Details","Tokenomics Document","Offering Structure","Milestone Plan","Escrow Instructions","Whitepaper","Other Technical"] },
};

export default function IssuerDocuments() {
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

  useEffect(() => {
    if (!session) return;
    fetch("/api/assets/my-listings").then(r => r.json()).then(d => {
      setAssets(d.assets || []);
      if (d.assets?.[0]) setSelectedAsset(d.assets[0]._id);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [session]);

  useEffect(() => { if (selectedAsset) loadDocs(); }, [selectedAsset, cat]);

  const loadDocs = () => {
    fetch("/api/assets/documents?assetId=" + selectedAsset + "&category=" + cat)
      .then(r => r.json()).then(d => setDocs(d.documents || [])).catch(() => {});
  };

  const upload = async () => {
    if (!uploadForm.docType || !uploadForm.file) { setMsg("Select document type and file"); return; }
    setUploading(true); setMsg("");

    try {
      // Upload file first
      const fd = new FormData();
      fd.append("file", uploadForm.file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed");

      // Save document metadata
      const res = await fetch("/api/assets/documents", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId: selectedAsset, category: cat, docType: uploadForm.docType,
          fileName: uploadForm.file.name, fileUrl: uploadData.url || uploadData.fileUrl || "",
          fileSize: uploadForm.file.size, mimeType: uploadForm.file.type,
          visibility: CATEGORIES[cat].visibility,
        }),
      });
      const data = await res.json();
      setMsg(res.ok ? "Uploaded: " + uploadForm.file.name : "Error: " + data.error);
      setUploadForm({ docType: "", file: null });
      loadDocs();
    } catch (e) { setMsg("Error: " + e.message); }
    finally { setUploading(false); }
  };

  const deleteDoc = async (id) => {
    if (!confirm("Delete this document?")) return;
    await fetch("/api/assets/documents", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ docId: id }) });
    loadDocs();
  };

  const badge = (s) => { const c = { pending: "#f59e0b", approved: "#22c55e", rejected: "#ef4444" }; return <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: (c[s] || "#666") + "15", color: c[s] || "#666", fontWeight: 700 }}>{s}</span>; };
  const visBadge = (v) => { const c = { public: "#22c55e", investors_only: "#3b82f6", admin_only: "#f59e0b" }; const l = { public: "Public", investors_only: "Investors", admin_only: "Admin" }; return <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 3, background: (c[v] || "#666") + "15", color: c[v] || "#666", fontWeight: 600 }}>{l[v] || v}</span>; };
  const inp = { background: "#0a0e14", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "8px 12px", color: "#fff", fontSize: 13, outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box" };

  if (typeof window === "undefined") return null; if (!session) { router.push("/login"); return null; }

  return (
    <>
      <Head><title>Asset Documents — Nextoken Capital</title></Head>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "#0B0E11", color: "#fff", paddingTop: 70 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800 }}>Asset Documents</h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Upload legal, financial, and operational documents for your assets</p>
            </div>
            <button onClick={() => router.push("/issuer-dashboard")} style={{ padding: "8px 16px", borderRadius: 7, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Back to Dashboard</button>
          </div>

          {msg && <div style={{ background: msg.startsWith("Error") ? "rgba(255,77,77,0.1)" : "rgba(34,197,94,0.1)", border: "1px solid " + (msg.startsWith("Error") ? "rgba(255,77,77,0.2)" : "rgba(34,197,94,0.2)"), borderRadius: 8, padding: "10px 14px", fontSize: 13, color: msg.startsWith("Error") ? "#ff6b6b" : "#22c55e", marginBottom: 16 }}>{msg}</div>}

          {/* Asset selector */}
          <div style={{ marginBottom: 20 }}>
            <select value={selectedAsset} onChange={e => setSelectedAsset(e.target.value)} style={{ ...inp, maxWidth: 400, cursor: "pointer" }}>
              <option value="">Select an asset</option>
              {assets.map(a => <option key={a._id} value={a._id}>{a.name} ({a.assetType})</option>)}
            </select>
          </div>

          {selectedAsset && (
            <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20 }}>
              {/* Left: Category tabs */}
              <div>
                {Object.entries(CATEGORIES).map(([key, cat_info]) => (
                  <div key={key} onClick={() => setCat(key)} style={{ padding: "12px 16px", borderRadius: 8, marginBottom: 4, cursor: "pointer", background: cat === key ? "#F0B90B15" : "rgba(255,255,255,0.03)", border: cat === key ? "1px solid #F0B90B30" : "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: cat === key ? "#F0B90B" : "rgba(255,255,255,0.6)" }}>{cat_info.icon} {cat_info.label}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{cat_info.desc.split("—")[0]}</div>
                  </div>
                ))}
              </div>

              {/* Right: Documents + Upload */}
              <div>
                {/* Category header */}
                <div style={{ background: "#161b22", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", padding: 20, marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 700 }}>{CATEGORIES[cat].icon} {CATEGORIES[cat].label}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{CATEGORIES[cat].desc}</div>
                    </div>
                    {visBadge(CATEGORIES[cat].visibility)}
                  </div>

                  {/* Upload form */}
                  <div style={{ background: "#0a0e14", borderRadius: 8, padding: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#F0B90B", marginBottom: 8 }}>UPLOAD DOCUMENT</div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <select value={uploadForm.docType} onChange={e => setUploadForm({ ...uploadForm, docType: e.target.value })} style={{ ...inp, width: 250, cursor: "pointer" }}>
                        <option value="">Select document type</option>
                        {CATEGORIES[cat].types.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <input type="file" onChange={e => setUploadForm({ ...uploadForm, file: e.target.files[0] })} accept={cat === "photos" ? "image/*" : ".pdf,.doc,.docx,.jpg,.jpeg,.png"} style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }} />
                      <button onClick={upload} disabled={uploading} style={{ padding: "8px 20px", borderRadius: 6, background: "#F0B90B", color: "#000", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", opacity: uploading ? 0.5 : 1 }}>
                        {uploading ? "Uploading..." : "Upload"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Document list */}
                <div style={{ background: "#161b22", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "200px 150px 80px 80px 80px 60px", padding: "10px 16px", background: "rgba(255,255,255,0.03)", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>
                    <span>File</span><span>Type</span><span>Visibility</span><span>Status</span><span>Date</span><span></span>
                  </div>
                  {docs.length === 0 ? (
                    <div style={{ padding: 30, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
                      No {CATEGORIES[cat].label.toLowerCase()} uploaded yet
                    </div>
                  ) : docs.map((d, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "200px 150px 80px 80px 80px 60px", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 12, alignItems: "center" }}>
                      <div>
                        <a href={d.fileUrl} target="_blank" rel="noopener" style={{ color: "#F0B90B", textDecoration: "none", fontWeight: 600 }}>{d.fileName?.slice(0, 25)}{d.fileName?.length > 25 ? "..." : ""}</a>
                        {d.fileSize && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>{(d.fileSize / 1024).toFixed(0)} KB</div>}
                      </div>
                      <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>{d.docType}</span>
                      {visBadge(d.visibility)}
                      {badge(d.status)}
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{new Date(d.createdAt).toLocaleDateString()}</span>
                      <button onClick={() => deleteDoc(d._id)} style={{ padding: "3px 8px", borderRadius: 4, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", fontSize: 9, cursor: "pointer", fontFamily: "inherit" }}>Del</button>
                    </div>
                  ))}
                </div>

                {/* Required documents checklist */}
                <div style={{ background: "#161b22", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", padding: 16, marginTop: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>REQUIRED DOCUMENTS</div>
                  {CATEGORIES[cat].types.map((t, i) => {
                    const uploaded = docs.some(d => d.docType === t);
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", fontSize: 12 }}>
                        <span style={{ color: uploaded ? "#22c55e" : "rgba(255,255,255,0.2)" }}>{uploaded ? "✓" : "○"}</span>
                        <span style={{ color: uploaded ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)" }}>{t}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {!selectedAsset && !loading && (
            <div style={{ background: "#161b22", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", padding: 40, textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📂</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>No Assets Yet</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>Create an asset first, then upload documents.</div>
              <button onClick={() => router.push("/issuer-dashboard")} style={{ padding: "10px 24px", background: "#F0B90B", color: "#000", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Go to Dashboard</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
