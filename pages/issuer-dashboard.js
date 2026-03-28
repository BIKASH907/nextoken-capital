import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import AutoLogout from "../components/AutoLogout";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const STATUS_COLORS = {
  draft:     { bg: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", label: "Draft" },
  review:    { bg: "rgba(59,130,246,0.1)",   color: "#3B82F6",               label: "Under Review" },
  approved:  { bg: "rgba(14,203,129,0.1)",   color: "#0ECB81",               label: "Approved" },
  live:      { bg: "rgba(14,203,129,0.12)",  color: "#0ECB81",               label: "Live" },
  closing:   { bg: "rgba(240,185,11,0.1)",   color: "#F0B90B",               label: "Closing Soon" },
  closed:    { bg: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", label: "Closed" },
  completed: { bg: "rgba(14,203,129,0.08)",  color: "#0ECB81",               label: "Completed" },
  cancelled: { bg: "rgba(255,77,77,0.08)",   color: "#ef4444",               label: "Cancelled" },
};

const TYPE_LABELS = {
  real_estate: "Real Estate", bond: "Bond", equity: "Equity", energy: "Energy",
  fund: "Fund", commodity: "Commodity", infrastructure: "Infrastructure", other: "Other",
};

function fmt(n) {
  if (n >= 1000000) return "\u20AC" + (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return "\u20AC" + (n / 1000).toFixed(0) + "K";
  return "\u20AC" + n;
}

export default function IssuerDashboardPage() {
  const router = useRouter();
  const [user, setUser]             = useState(null);
  const [stats, setStats]           = useState(null);
  const [assets, setAssets]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [tab, setTab]               = useState("overview");
  const [uploading, setUploading]   = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [createMsg, setCreateMsg]   = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const fileRef = useRef(null);

  const emptyForm = {
    name: "", ticker: "", description: "", assetType: "real_estate", category: "",
    location: "", country: "", targetRaise: "", minInvestment: "100", targetROI: "",
    term: "", tokenPrice: "", riskLevel: "medium", documents: [],
  };
  const [cf, setCf] = useState(emptyForm);
  const uf = (k, v) => setCf(f => ({ ...f, [k]: v }));

  const loadData = useCallback(async () => {
    try {
      const uRes = await fetch("/api/user/me");
      if (!uRes.ok) { router.push("/login?redirect=/issuer-dashboard"); return; }
      setUser(await uRes.json());

      const [sRes, aRes] = await Promise.all([fetch("/api/assets/stats"), fetch("/api/assets/my-listings")]);
      if (sRes.ok) { const d = await sRes.json(); setStats(d.stats); }
      if (aRes.ok) { const d = await aRes.json(); setAssets(d.assets || []); }
    } catch { router.push("/login"); }
    finally { setLoading(false); }
  }, [router]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload/document", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) uf("documents", [...cf.documents, { name: data.name, url: data.url, type: data.type }]);
    } catch (err) { console.error(err); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  };

  const removeDoc = (idx) => uf("documents", cf.documents.filter((_, i) => i !== idx));

  const handleCreate = async () => {
    setCreateMsg(""); setCreateLoading(true);
    try {
      const body = { ...cf, targetRaise: Number(cf.targetRaise), minInvestment: Number(cf.minInvestment) || 100, targetROI: Number(cf.targetROI) || undefined, term: Number(cf.term) || undefined, tokenPrice: Number(cf.tokenPrice) || undefined };
      const res = await fetch("/api/assets/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (data.success) { setCreateMsg("\u2705 Listing created!"); setShowCreate(false); setCf(emptyForm); loadData(); }
      else setCreateMsg("\u274C " + data.error);
    } catch { setCreateMsg("\u274C Network error"); }
    finally { setCreateLoading(false); }
  };

  const submitForReview = async (id) => {
    const res = await fetch("/api/assets/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ assetId: id }) });
    const data = await res.json();
    if (data.success) loadData(); else alert(data.error);
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0B0E11", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 32, height: 32, border: "3px solid rgba(240,185,11,0.2)", borderTopColor: "#F0B90B", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <>
      <Head><title>Asset Owner Dashboard \u2014 Nextoken Capital</title></Head>
      <AutoLogout timeoutMs={86400000} isAdmin={false} />
      <Navbar />
      <style>{`
        .id-page{min-height:100vh;background:#0B0E11;padding-top:64px}
        .id-head{background:#0F1318;border-bottom:1px solid rgba(255,255,255,0.07);padding:20px}
        .id-head-in{max-width:1280px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px}
        .id-body{max-width:1280px;margin:0 auto;padding:22px 20px 60px}
        .id-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px}
        .id-stat{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:18px}
        .id-stat-v{font-size:1.5rem;font-weight:900;color:#F0B90B;line-height:1;margin-bottom:5px}
        .id-stat-l{font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:.5px}
        .id-tabs{display:flex;border-bottom:1px solid rgba(255,255,255,0.07);margin-bottom:20px;overflow-x:auto}
        .id-tab{padding:10px 18px;font-size:13px;font-weight:600;color:rgba(255,255,255,0.4);background:none;border:none;border-bottom:2px solid transparent;cursor:pointer;font-family:inherit;transition:all .15s;white-space:nowrap;margin-bottom:-1px}
        .id-tab:hover{color:#fff}.id-tab.on{color:#F0B90B;border-bottom-color:#F0B90B}
        .id-card{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:13px;overflow:hidden;margin-bottom:16px}
        .id-card-head{padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:space-between}
        .id-card-title{font-size:13px;font-weight:700;color:#fff}
        .id-row{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.05);gap:12px;flex-wrap:wrap}
        .id-row:last-child{border-bottom:none}
        .id-empty{padding:28px;text-align:center;color:rgba(255,255,255,0.3);font-size:13px}
        .id-badge{padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700;display:inline-block}
        .id-prog{height:4px;background:rgba(255,255,255,0.06);border-radius:2px;overflow:hidden;width:120px}
        .id-prog-fill{height:100%;background:#F0B90B;border-radius:2px}
        .id-btn{padding:8px 18px;border-radius:7px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;border:none;transition:all .15s}
        .id-btn-gold{background:#F0B90B;color:#000}.id-btn-gold:hover{background:#FFD000}
        .id-btn-ghost{background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.6);border:1px solid rgba(255,255,255,0.1)}
        .id-btn-blue{background:rgba(59,130,246,0.1);color:#3B82F6;border:1px solid rgba(59,130,246,0.25)}
        .id-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:10000;display:flex;align-items:flex-start;justify-content:center;padding:20px;padding-top:80px;overflow-y:auto}
        .id-modal{background:#0F1318;border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:28px;width:100%;max-width:620px}
        .id-field{margin-bottom:14px}
        .id-label{display:block;font-size:11px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px}
        .id-input{width:100%;background:#161B22;color:#fff;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:11px 14px;font-size:13px;outline:none;font-family:inherit;transition:border-color .15s;box-sizing:border-box}
        .id-input:focus{border-color:rgba(240,185,11,0.5)}.id-input option{background:#161B22}
        .id-2col{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .id-3col{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
        .id-doc-list{display:flex;flex-direction:column;gap:6px;margin-top:8px}
        .id-doc-item{display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:8px;font-size:12px;color:rgba(255,255,255,0.6)}
        .id-doc-rm{background:none;border:none;color:#FF4D4D;cursor:pointer;font-size:14px;padding:2px 6px}
        .id-msg{padding:10px 14px;border-radius:8px;font-size:13px;margin:14px 0;line-height:1.5}
        .id-msg.ok{background:rgba(14,203,129,0.1);border:1px solid rgba(14,203,129,0.25);color:#0ECB81}
        .id-msg.err{background:rgba(255,77,77,0.08);border:1px solid rgba(255,77,77,0.2);color:#FF6B6B}
        @media(max-width:900px){.id-stats{grid-template-columns:repeat(2,1fr)}.id-2col,.id-3col{grid-template-columns:1fr}}
      `}</style>

      <div className="id-page">
        {/* HEADER */}
        <div className="id-head">
          <div className="id-head-in">
            <div>
              <div style={{ fontSize: "clamp(1rem,2.5vw,1.4rem)", fontWeight: 900, color: "#fff" }}>Asset Owner Dashboard</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{user?.email} \u00B7 {user?.country || "EU"}</div>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="id-btn id-btn-gold" onClick={() => setShowCreate(true)}>+ Create Listing</button>
              <Link href="/dashboard" className="id-btn id-btn-ghost" style={{ textDecoration: "none" }}>Investor View</Link>
            </div>
          </div>
        </div>

        <div className="id-body">
          {/* STATS */}
          <div className="id-stats">
            <div className="id-stat"><div className="id-stat-v">{stats ? fmt(stats.totalRaised) : "\u2014"}</div><div className="id-stat-l">Total Raised</div></div>
            <div className="id-stat"><div className="id-stat-v">{stats?.uniqueInvestors || 0}</div><div className="id-stat-l">Unique Investors</div></div>
            <div className="id-stat"><div className="id-stat-v">{stats?.totalListings || 0}</div><div className="id-stat-l">Total Listings</div></div>
            <div className="id-stat"><div className="id-stat-v">{stats?.liveListings || 0}</div><div className="id-stat-l">Live Listings</div></div>
          </div>

          {createMsg && <div className={`id-msg ${createMsg.startsWith("\u2705") ? "ok" : "err"}`}>{createMsg}</div>}

          {/* TABS */}
          <div className="id-tabs">
            {[["overview", "Overview"], ["listings", "My Listings"], ["analytics", "Analytics"]].map(([id, lbl]) => (
              <button key={id} className={`id-tab ${tab === id ? "on" : ""}`} onClick={() => setTab(id)}>{lbl}</button>
            ))}
          </div>

          {/* LISTINGS TABLE */}
          {(tab === "overview" || tab === "listings") && (
            <div className="id-card">
              <div className="id-card-head">
                <span className="id-card-title">My Listings ({assets.length})</span>
                <button className="id-btn id-btn-gold" style={{ fontSize: 12, padding: "6px 14px" }} onClick={() => setShowCreate(true)}>+ New</button>
              </div>
              {assets.length === 0 ? (
                <div className="id-empty">
                  No listings yet.{" "}
                  <button style={{ background: "none", border: "none", color: "#F0B90B", cursor: "pointer", fontFamily: "inherit" }} onClick={() => setShowCreate(true)}>
                    Create your first listing \u2192
                  </button>
                </div>
              ) : assets.map(a => {
                const st = STATUS_COLORS[a.status] || STATUS_COLORS.draft;
                return (
                  <div key={a._id} className="id-row">
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{a.name}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
                        {a.ticker} \u00B7 {TYPE_LABELS[a.assetType] || a.assetType} \u00B7 {a.location || "\u2014"}
                      </div>
                      {a.documents?.length > 0 && (
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 3 }}>
                          \uD83D\uDCCE {a.documents.length} document{a.documents.length > 1 ? "s" : ""} attached
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: "center", minWidth: 100 }}>
                      <span className="id-badge" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                    </div>
                    <div style={{ textAlign: "right", minWidth: 100 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#F0B90B" }}>{fmt(a.raisedAmount || 0)}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>of {fmt(a.targetRaise)}</div>
                      <div className="id-prog" style={{ marginTop: 4 }}>
                        <div className="id-prog-fill" style={{ width: (a.fundingPct || 0) + "%" }} />
                      </div>
                    </div>
                    <div style={{ textAlign: "right", minWidth: 70 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{a.investorCount || 0}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>investors</div>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {a.status === "draft" && (
                        <button className="id-btn id-btn-blue" style={{ fontSize: 11, padding: "5px 12px" }} onClick={() => submitForReview(a._id)}>
                          Submit for Review
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ANALYTICS */}
          {tab === "analytics" && (
            <div className="id-card">
              <div className="id-card-head"><span className="id-card-title">Analytics</span></div>
              <div style={{ padding: 20 }}>
                <div className="id-2col" style={{ marginBottom: 20 }}>
                  <div className="id-stat"><div className="id-stat-v">{stats?.fundingPct || 0}%</div><div className="id-stat-l">Overall Funding</div></div>
                  <div className="id-stat"><div className="id-stat-v">{stats ? fmt(stats.totalTarget) : "\u2014"}</div><div className="id-stat-l">Total Target</div></div>
                </div>
                <div className="id-2col">
                  <div className="id-stat"><div className="id-stat-v">{stats?.draftListings || 0}</div><div className="id-stat-l">Draft</div></div>
                  <div className="id-stat"><div className="id-stat-v">{stats?.reviewListings || 0}</div><div className="id-stat-l">Under Review</div></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
         CREATE LISTING MODAL
      ══════════════════════════════════════════════════════════════════════ */}
      {showCreate && (
        <div className="id-overlay" onClick={e => { if (e.target === e.currentTarget) setShowCreate(false); }}>
          <div className="id-modal">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>Create New Listing</div>
              <button onClick={() => setShowCreate(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 22, cursor: "pointer" }}>&times;</button>
            </div>

            {/* BASIC INFO */}
            <div className="id-2col">
              <div className="id-field">
                <label className="id-label">Asset Name *</label>
                <input className="id-input" value={cf.name} onChange={e => uf("name", e.target.value)} placeholder="e.g. Solar Farm Portfolio" />
              </div>
              <div className="id-field">
                <label className="id-label">Ticker Symbol *</label>
                <input className="id-input" value={cf.ticker} onChange={e => uf("ticker", e.target.value.toUpperCase())} placeholder="e.g. SOLAR-01" maxLength={12} />
              </div>
            </div>
            <div className="id-field">
              <label className="id-label">Description</label>
              <textarea className="id-input" rows={3} value={cf.description} onChange={e => uf("description", e.target.value)} placeholder="Describe the asset opportunity..." style={{ resize: "vertical" }} />
            </div>
            <div className="id-2col">
              <div className="id-field">
                <label className="id-label">Asset Type *</label>
                <select className="id-input" value={cf.assetType} onChange={e => uf("assetType", e.target.value)}>
                  {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div className="id-field">
                <label className="id-label">Category</label>
                <input className="id-input" value={cf.category} onChange={e => uf("category", e.target.value)} placeholder="e.g. Commercial, Green" />
              </div>
            </div>
            <div className="id-2col">
              <div className="id-field">
                <label className="id-label">Location</label>
                <input className="id-input" value={cf.location} onChange={e => uf("location", e.target.value)} placeholder="e.g. Berlin, Germany" />
              </div>
              <div className="id-field">
                <label className="id-label">Country</label>
                <input className="id-input" value={cf.country} onChange={e => uf("country", e.target.value)} placeholder="e.g. Germany" />
              </div>
            </div>

            {/* FINANCIALS */}
            <div style={{ fontSize: 12, fontWeight: 700, color: "#F0B90B", letterSpacing: 1, textTransform: "uppercase", margin: "20px 0 10px" }}>Financials</div>
            <div className="id-3col">
              <div className="id-field">
                <label className="id-label">Target Raise (EUR) *</label>
                <input className="id-input" type="number" value={cf.targetRaise} onChange={e => uf("targetRaise", e.target.value)} placeholder="5000000" />
              </div>
              <div className="id-field">
                <label className="id-label">Min Investment (EUR)</label>
                <input className="id-input" type="number" value={cf.minInvestment} onChange={e => uf("minInvestment", e.target.value)} placeholder="100" />
              </div>
              <div className="id-field">
                <label className="id-label">Token Price (EUR)</label>
                <input className="id-input" type="number" step="0.01" value={cf.tokenPrice} onChange={e => uf("tokenPrice", e.target.value)} placeholder="10.00" />
              </div>
            </div>
            <div className="id-3col">
              <div className="id-field">
                <label className="id-label">Target ROI (%)</label>
                <input className="id-input" type="number" step="0.1" value={cf.targetROI} onChange={e => uf("targetROI", e.target.value)} placeholder="18.2" />
              </div>
              <div className="id-field">
                <label className="id-label">Term (months)</label>
                <input className="id-input" type="number" value={cf.term} onChange={e => uf("term", e.target.value)} placeholder="36" />
              </div>
              <div className="id-field">
                <label className="id-label">Risk Level</label>
                <select className="id-input" value={cf.riskLevel} onChange={e => uf("riskLevel", e.target.value)}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* DOCUMENTS */}
            <div style={{ fontSize: 12, fontWeight: 700, color: "#F0B90B", letterSpacing: 1, textTransform: "uppercase", margin: "20px 0 10px" }}>
              Documents &amp; Financials
            </div>
            <div style={{ padding: 16, border: "2px dashed rgba(255,255,255,0.1)", borderRadius: 12, textAlign: "center", marginBottom: 8 }}>
              <input ref={fileRef} type="file" onChange={handleUpload} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx" style={{ display: "none" }} />
              <button onClick={() => fileRef.current?.click()} disabled={uploading} className="id-btn id-btn-ghost" style={{ fontSize: 12 }}>
                {uploading ? "\u23F3 Uploading..." : "\uD83D\uDCCE Upload Document"}
              </button>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 6 }}>
                PDF, JPG, PNG, DOC, DOCX, XLS, XLSX \u2014 max 20MB each
              </div>
            </div>
            {cf.documents.length > 0 && (
              <div className="id-doc-list">
                {cf.documents.map((doc, i) => (
                  <div key={i} className="id-doc-item">
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{ color: "#F0B90B", textDecoration: "none" }}>
                      \uD83D\uDCC4 {doc.name}
                    </a>
                    <button className="id-doc-rm" onClick={() => removeDoc(i)}>&times;</button>
                  </div>
                ))}
              </div>
            )}

            {/* SUBMIT */}
            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button className="id-btn id-btn-ghost" style={{ flex: 1 }} onClick={() => setShowCreate(false)}>Cancel</button>
              <button
                className="id-btn id-btn-gold" style={{ flex: 2 }}
                disabled={createLoading || !cf.name || !cf.ticker || !cf.targetRaise}
                onClick={handleCreate}
              >
                {createLoading ? "Creating..." : "Create Listing \u2192"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
