import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { signOut } from "next-auth/react";
import AutoLogout from "../components/AutoLogout";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MoneriumConnect from "../components/MoneriumConnect";

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

const DOC_CATEGORIES = [
  { id: "photos", label: "Photos", icon: "\uD83D\uDCF8", color: "#F0B90B", desc: "Public \u2014 visible to all visitors after approval", types: ["Property Exterior", "Interior", "Aerial View", "Progress Photos", "Other"], accept: ".jpg,.jpeg,.png,.webp" },
  { id: "legal", label: "Legal", icon: "\u2696\uFE0F", color: "#3B82F6", desc: "Admin only \u2014 reviewed by compliance team", types: ["Certificate of Incorporation", "Articles of Association", "Board Resolution", "UBO Declaration", "Legal Opinion", "Other"], accept: ".pdf,.doc,.docx" },
  { id: "financial", label: "Financial", icon: "\uD83D\uDCB0", color: "#0ECB81", desc: "Investors only \u2014 visible to verified investors with active holdings", types: ["Audited Financial Statements", "Bank Statements", "Asset Valuation Report", "P&L Statement", "Cash Flow", "Other"], accept: ".pdf,.xls,.xlsx,.doc,.docx" },
  { id: "operational", label: "Operational", icon: "\uD83C\uDFD7\uFE0F", color: "#f59e0b", desc: "Admin only \u2014 property and operational documents", types: ["Title Deed", "Appraisal Report", "Insurance Certificate", "Lease Agreement", "Maintenance Records", "Other"], accept: ".pdf,.doc,.docx" },
  { id: "compliance", label: "Compliance & KYC", icon: "\uD83D\uDD10", color: "#8b5cf6", desc: "Admin only \u2014 identity and regulatory documents", types: ["Government-issued ID", "Proof of Address", "Sanctions Screening", "AML Check", "Tax ID Certificate", "Other"], accept: ".pdf,.jpg,.jpeg,.png" },
  { id: "technical", label: "Technical / Blockchain", icon: "\u26D3\uFE0F", color: "#06b6d4", desc: "Admin only \u2014 smart contract and tokenomics documents", types: ["Smart Contract Details", "Tokenomics Document", "Offering Structure", "Milestone Plan", "Whitepaper", "Other"], accept: ".pdf,.doc,.docx" },
];

function fmt(n) {
  if (n >= 1000000) return "\u20AC" + (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return "\u20AC" + (n / 1000).toFixed(0) + "K";
  return "\u20AC" + n;
}

export default function IssuerDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");
  const [uploading, setUploading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [createMsg, setCreateMsg] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [ibanData, setIbanData] = useState(null);
  const [docCategory, setDocCategory] = useState("photos");
  const [docSubType, setDocSubType] = useState("");
  const [docTab, setDocTab] = useState("photos");
  const [selectedAssetForDocs, setSelectedAssetForDocs] = useState("");
  // Password change
  const [showPwModal, setShowPwModal] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  // User menu
  const [showUserMenu, setShowUserMenu] = useState(false);
  const fileRef = useRef(null);

  const emptyForm = {
    name: "", ticker: "", description: "", assetType: "real_estate", category: "",
    location: "", country: "", targetRaise: "", minInvestment: "100", targetROI: "",
    term: "", tokenPrice: "", riskLevel: "medium",
    documents: { photos: [], legal: [], financial: [], operational: [], compliance: [], technical: [] },
  };
  const [cf, setCf] = useState(emptyForm);
  const uf = (k, v) => setCf(f => ({ ...f, [k]: v }));

  const loadData = useCallback(async () => {
    try {
      const uRes = await fetch("/api/user/me");
      if (!uRes.ok) { router.push("/login?redirect=/issuer-dashboard"); return; }
      const uData = await uRes.json();
setUser(uData.user || uData);
      const [sRes, aRes] = await Promise.all([fetch("/api/assets/stats"), fetch("/api/assets/my-listings")]);
      if (sRes.ok) { const d = await sRes.json(); setStats(d.stats); }
      if (aRes.ok) { const d = await aRes.json(); setAssets(d.assets || []); }
    } catch { router.push("/login"); }
    finally { setLoading(false); }
  }, [router]);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then(a => { if (a[0]) setWalletAddress(a[0]); }).catch(() => {});
    }
  }, []);

  // Close user menu on click outside
  useEffect(() => {
    const handler = () => setShowUserMenu(false);
    if (showUserMenu) document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [showUserMenu]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  const handlePasswordChange = async () => {
    setPwMsg(""); setPwLoading(true);
    if (pwForm.newPw !== pwForm.confirm) { setPwMsg("Passwords do not match"); setPwLoading(false); return; }
    if (pwForm.newPw.length < 8) { setPwMsg("Password must be at least 8 characters"); setPwLoading(false); return; }
    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.newPw }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPwMsg("\u2705 Password changed successfully");
        setPwForm({ current: "", newPw: "", confirm: "" });
        setTimeout(() => setShowPwModal(false), 1500);
      } else {
        setPwMsg(data.error || "Failed to change password");
      }
    } catch { setPwMsg("Network error"); }
    finally { setPwLoading(false); }
  };

  const handleCategoryUpload = async (e, catId, subType) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("category", catId);
      fd.append("subType", subType || "");
      const res = await fetch("/api/upload/document", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success || data.url) {
        const newDoc = { name: data.name || file.name, url: data.url, type: data.type || file.type, category: catId, subType: subType || "", uploadedAt: new Date().toISOString() };
        const updated = { ...cf.documents };
        updated[catId] = [...(updated[catId] || []), newDoc];
        uf("documents", updated);
      }
    } catch (err) { console.error(err); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  };

  const handleAssetDocUpload = async (e, catId, subType) => {
    const file = e.target.files?.[0];
    if (!file || !selectedAssetForDocs) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("category", catId);
      fd.append("subType", subType || "");
      fd.append("assetId", selectedAssetForDocs);
      const res = await fetch("/api/upload/document", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success || data.url) { loadData(); }
    } catch (err) { console.error(err); }
    finally { setUploading(false); }
  };

  const removeDoc = (catId, idx) => {
    const updated = { ...cf.documents };
    updated[catId] = updated[catId].filter((_, i) => i !== idx);
    uf("documents", updated);
  };

  const handleCreate = async () => {
    setCreateMsg(""); setCreateLoading(true);
    try {
      const allDocs = [];
      Object.entries(cf.documents).forEach(([cat, docs]) => { docs.forEach(d => allDocs.push({ ...d, category: cat })); });
      const body = { ...cf, documents: allDocs, targetRaise: Number(cf.targetRaise), minInvestment: Number(cf.minInvestment) || 100, targetROI: Number(cf.targetROI) || undefined, term: Number(cf.term) || undefined, tokenPrice: Number(cf.tokenPrice) || undefined };
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

  const totalDocsCount = Object.values(cf.documents).reduce((s, arr) => s + arr.length, 0);
  const displayName = user?.firstName || user?.name || user?.email?.split("@")[0] || "User";

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0B0E11", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 32, height: 32, border: "3px solid rgba(240,185,11,0.2)", borderTopColor: "#F0B90B", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <>
      <Head><title>Asset Owner Dashboard &mdash; Nextoken Capital</title></Head>
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
        .id-btn-red{background:rgba(239,68,68,0.1);color:#ef4444;border:1px solid rgba(239,68,68,0.25)}
        .id-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:10000;display:flex;align-items:flex-start;justify-content:center;padding:20px;padding-top:60px;overflow-y:auto}
        .id-modal{background:#0F1318;border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:28px;width:100%;max-width:720px}
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
        .id-doc-cats{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:14px}
        .id-doc-cat{padding:6px 12px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.03);color:rgba(255,255,255,0.4);transition:all .15s;display:flex;align-items:center;gap:5px}
        .id-doc-cat:hover{background:rgba(255,255,255,0.06);color:#fff}
        .id-doc-cat.on{border-color:rgba(240,185,11,0.4);background:rgba(240,185,11,0.08);color:#F0B90B}
        .id-photo-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px;margin-top:10px}
        .id-photo-thumb{position:relative;aspect-ratio:1;border-radius:8px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);background:#161B22}
        .id-photo-thumb img{width:100%;height:100%;object-fit:cover}
        .id-photo-rm{position:absolute;top:4px;right:4px;width:20px;height:20px;border-radius:50%;background:rgba(0,0,0,0.7);color:#FF4D4D;border:none;cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center}
        .id-user-menu{position:absolute;top:100%;right:0;margin-top:6px;background:#161B22;border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:6px 0;min-width:180px;z-index:100;box-shadow:0 8px 30px rgba(0,0,0,0.4)}
        .id-user-item{padding:10px 16px;font-size:13px;color:rgba(255,255,255,0.6);cursor:pointer;display:flex;align-items:center;gap:8px;transition:background .1s}
        .id-user-item:hover{background:rgba(255,255,255,0.05);color:#fff}
        .id-user-divider{height:1px;background:rgba(255,255,255,0.06);margin:4px 0}
        @media(max-width:900px){.id-stats{grid-template-columns:repeat(2,1fr)}.id-2col,.id-3col{grid-template-columns:1fr}}
      `}</style>

      <div className="id-page">
        {/* HEADER */}
        <div className="id-head">
          <div className="id-head-in">
            <div>
              <div style={{ fontSize: "clamp(1rem,2.5vw,1.4rem)", fontWeight: 900, color: "#fff" }}>
                Welcome, {displayName}
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>
                Asset Owner Dashboard &middot; {user?.email} &middot; {user?.country || "EU"}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <button className="id-btn id-btn-gold" onClick={() => setShowCreate(true)}>+ Create Listing</button>
              <Link href="/dashboard" className="id-btn id-btn-ghost" style={{ textDecoration: "none" }}>Investor View</Link>

              {/* User Menu */}
              <div style={{ position: "relative" }}>
                <button
                  className="id-btn id-btn-ghost"
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px" }}
                  onClick={(e) => { e.stopPropagation(); setShowUserMenu(!showUserMenu); }}
                >
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(240,185,11,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#F0B90B" }}>
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: 13 }}>{displayName}</span>
                  <span style={{ fontSize: 10, opacity: 0.4 }}>{showUserMenu ? "\u25B2" : "\u25BC"}</span>
                </button>

                {showUserMenu && (
                  <div className="id-user-menu" onClick={e => e.stopPropagation()}>
                    <div style={{ padding: "10px 16px", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
                      {user?.email}
                    </div>
                    <div className="id-user-divider" />
                    <div className="id-user-item" onClick={() => { setShowUserMenu(false); setShowPwModal(true); }}>
                      \uD83D\uDD12 Change Password
                    </div>
                    <div className="id-user-item" onClick={() => { setShowUserMenu(false); router.push("/dashboard"); }}>
                      \uD83D\uDCCA Investor Dashboard
                    </div>
                    <div className="id-user-divider" />
                    <div className="id-user-item" style={{ color: "#ef4444" }} onClick={handleLogout}>
                      \uD83D\uDEAA Sign Out
                    </div>
                  </div>
                )}
              </div>
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
            {[["overview", "Overview"], ["listings", "My Listings"], ["documents", "Documents"], ["bank", "Bank & Wallet"], ["analytics", "Analytics"]].map(([id, lbl]) => (
              <button key={id} className={`id-tab ${tab === id ? "on" : ""}`} onClick={() => setTab(id)}>{lbl}</button>
            ))}
          </div>

          {/* ═══════ LISTINGS TABLE ═══════ */}
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
                    Create your first listing &rarr;
                  </button>
                </div>
              ) : assets.map(a => {
                const st = STATUS_COLORS[a.status] || STATUS_COLORS.draft;
                return (
                  <div key={a._id} className="id-row">
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{a.name}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
                        {a.ticker} &middot; {TYPE_LABELS[a.assetType] || a.assetType} &middot; {a.location || "\u2014"}
                      </div>
                      {a.documents?.length > 0 && (
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 3 }}>
                          &#128206; {a.documents.length} document{a.documents.length > 1 ? "s" : ""} attached
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

          {/* ═══════ DOCUMENTS TAB ═══════ */}
          {tab === "documents" && (
            <div>
              <div className="id-card">
                <div className="id-card-head"><span className="id-card-title">Upload Documents for Asset</span></div>
                <div style={{ padding: 18 }}>
                  {assets.length === 0 ? (
                    <div className="id-empty">Create a listing first to upload documents.</div>
                  ) : (
                    <>
                      <label className="id-label">Select Asset</label>
                      <select className="id-input" value={selectedAssetForDocs} onChange={e => setSelectedAssetForDocs(e.target.value)} style={{ marginBottom: 16 }}>
                        <option value="">Choose an asset...</option>
                        {assets.map(a => <option key={a._id} value={a._id}>{a.name} ({a.ticker})</option>)}
                      </select>
                      {selectedAssetForDocs && (
                        <>
                          <div className="id-doc-cats">
                            {DOC_CATEGORIES.map(cat => (
                              <button key={cat.id} className={`id-doc-cat ${docTab === cat.id ? "on" : ""}`} onClick={() => setDocTab(cat.id)}>
                                <span>{cat.icon}</span> {cat.label}
                              </button>
                            ))}
                          </div>
                          {DOC_CATEGORIES.filter(c => c.id === docTab).map(cat => (
                            <div key={cat.id}>
                              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 12, fontStyle: "italic" }}>{cat.desc}</div>
                              <div className="id-2col" style={{ marginBottom: 12 }}>
                                <div>
                                  <label className="id-label">Document Type</label>
                                  <select className="id-input" value={docSubType} onChange={e => setDocSubType(e.target.value)}>
                                    <option value="">Select type...</option>
                                    {cat.types.map(t => <option key={t} value={t}>{t}</option>)}
                                  </select>
                                </div>
                                <div style={{ display: "flex", alignItems: "flex-end" }}>
                                  <div>
                                    <input type="file" ref={fileRef} accept={cat.accept} onChange={e => handleAssetDocUpload(e, cat.id, docSubType)} style={{ display: "none" }} />
                                    <button onClick={() => fileRef.current?.click()} disabled={uploading || !docSubType} className="id-btn id-btn-gold" style={{ fontSize: 12, opacity: !docSubType ? 0.4 : 1 }}>
                                      {uploading ? "Uploading..." : `Upload ${cat.label}`}
                                    </button>
                                  </div>
                                </div>
                              </div>
                              {(() => {
                                const asset = assets.find(a => a._id === selectedAssetForDocs);
                                const catDocs = (asset?.documents || []).filter(d => d.category === cat.id);
                                if (catDocs.length === 0) return <div style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", padding: "12px 0" }}>No {cat.label.toLowerCase()} documents uploaded yet.</div>;
                                if (cat.id === "photos") {
                                  return (
                                    <div className="id-photo-grid">
                                      {catDocs.map((d, i) => (
                                        <div key={i} className="id-photo-thumb">
                                          <img src={d.url} alt={d.subType || d.name} />
                                          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "4px 6px", background: "rgba(0,0,0,0.7)", fontSize: 9, color: "rgba(255,255,255,0.6)" }}>{d.subType || d.name}</div>
                                        </div>
                                      ))}
                                    </div>
                                  );
                                }
                                return (
                                  <div className="id-doc-list">
                                    {catDocs.map((d, i) => (
                                      <div key={i} className="id-doc-item">
                                        <div>
                                          <span style={{ color: cat.color, marginRight: 6 }}>{cat.icon}</span>
                                          <a href={d.url} target="_blank" rel="noopener noreferrer" style={{ color: "#F0B90B", textDecoration: "none" }}>{d.name}</a>
                                          {d.subType && <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginLeft: 8 }}>{d.subType}</span>}
                                        </div>
                                        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>{d.uploadedAt ? new Date(d.uploadedAt).toLocaleDateString() : ""}</span>
                                      </div>
                                    ))}
                                  </div>
                                );
                              })()}
                            </div>
                          ))}
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
              {/* Owner / Company Documents */}
              <div className="id-card">
                <div className="id-card-head"><span className="id-card-title">Owner / Company Documents</span></div>
                <div style={{ padding: 18 }}>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 14, lineHeight: 1.6 }}>
                    These documents apply to your company, not a specific asset. Required for KYB verification and compliance.
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
                    {[
                      { label: "Certificate of Incorporation", icon: "\uD83C\uDFDB\uFE0F" },
                      { label: "Proof of Address", icon: "\uD83C\uDFE0" },
                      { label: "Director ID / Passport", icon: "\uD83E\uDEAA" },
                      { label: "UBO Declaration", icon: "\uD83D\uDC64" },
                      { label: "Tax Registration", icon: "\uD83D\uDCCB" },
                      { label: "Bank Statement", icon: "\uD83C\uDFE6" },
                    ].map((doc, i) => (
                      <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                          <span style={{ fontSize: 18 }}>{doc.icon}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{doc.label}</span>
                        </div>
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => handleAssetDocUpload(e, "compliance", doc.label)} style={{ display: "none" }} id={`owner-doc-${i}`} />
                        <label htmlFor={`owner-doc-${i}`} className="id-btn id-btn-ghost" style={{ fontSize: 11, padding: "5px 12px", cursor: "pointer", display: "inline-block" }}>
                          {uploading ? "..." : "Upload"}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════ BANK & WALLET ═══════ */}
          {tab === "bank" && (
            <div>
              <MoneriumConnect walletAddress={walletAddress} onIBANReceived={setIbanData} />
              <div className="id-card">
                <div className="id-card-head"><span className="id-card-title">Polygon Wallet</span></div>
                <div style={{ padding: 18 }}>
                  {walletAddress ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#0ECB81" }} />
                      <div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Connected</div>
                        <div style={{ fontSize: 14, fontFamily: "monospace", color: "#F0B90B", fontWeight: 700 }}>{walletAddress}</div>
                      </div>
                    </div>
                  ) : (
                    <button className="id-btn id-btn-gold" onClick={async () => {
                      if (!window.ethereum) return alert("Install MetaMask");
                      try { const a = await window.ethereum.request({ method: "eth_requestAccounts" }); setWalletAddress(a[0] || ""); } catch(e) { console.error(e); }
                    }}>Connect MetaMask</button>
                  )}
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 12, lineHeight: 1.6 }}>
                    Investment funds from the escrow contract are sent to this wallet. 0.25% commission is auto-deducted.
                  </div>
                </div>
              </div>
              <div className="id-card">
                <div className="id-card-head"><span className="id-card-title">How Payments Work</span></div>
                <div style={{ padding: 18, fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.8 }}>
                  <strong style={{ color: "#F0B90B" }}>Crypto path:</strong> Investor sends POL &rarr; Escrow contract auto-splits &rarr; 99.75% to your wallet + 0.25% to Nextoken treasury.<br/>
                  <strong style={{ color: "#F0B90B" }}>Bank path:</strong> Investor sends EUR via SEPA &rarr; Monerium converts to EURe on Polygon &rarr; appears in your wallet. Send EURe back to withdraw to any bank account.
                </div>
              </div>
            </div>
          )}

          {/* ═══════ ANALYTICS ═══════ */}
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

      {/* ═══════ CREATE LISTING MODAL ═══════ */}
      {showCreate && (
        <div className="id-overlay" onClick={e => { if (e.target === e.currentTarget) setShowCreate(false); }}>
          <div className="id-modal">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>Create New Listing</div>
              <button onClick={() => setShowCreate(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 22, cursor: "pointer" }}>&times;</button>
            </div>
            <div className="id-2col">
              <div className="id-field"><label className="id-label">Asset Name *</label><input className="id-input" value={cf.name} onChange={e => uf("name", e.target.value)} placeholder="e.g. Solar Farm Portfolio" /></div>
              <div className="id-field"><label className="id-label">Ticker Symbol *</label><input className="id-input" value={cf.ticker} onChange={e => uf("ticker", e.target.value.toUpperCase())} placeholder="e.g. SOLAR-01" maxLength={12} /></div>
            </div>
            <div className="id-field"><label className="id-label">Description</label><textarea className="id-input" rows={3} value={cf.description} onChange={e => uf("description", e.target.value)} placeholder="Describe the asset opportunity..." style={{ resize: "vertical" }} /></div>
            <div className="id-2col">
              <div className="id-field"><label className="id-label">Asset Type *</label><select className="id-input" value={cf.assetType} onChange={e => uf("assetType", e.target.value)}>{Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
              <div className="id-field"><label className="id-label">Category</label><input className="id-input" value={cf.category} onChange={e => uf("category", e.target.value)} placeholder="e.g. Commercial, Green" /></div>
            </div>
            <div className="id-2col">
              <div className="id-field"><label className="id-label">Location</label><input className="id-input" value={cf.location} onChange={e => uf("location", e.target.value)} placeholder="e.g. Berlin, Germany" /></div>
              <div className="id-field"><label className="id-label">Country</label><input className="id-input" value={cf.country} onChange={e => uf("country", e.target.value)} placeholder="e.g. Germany" /></div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#F0B90B", letterSpacing: 1, textTransform: "uppercase", margin: "20px 0 10px" }}>Financials</div>
            <div className="id-3col">
              <div className="id-field"><label className="id-label">Target Raise (EUR) *</label><input className="id-input" type="number" value={cf.targetRaise} onChange={e => uf("targetRaise", e.target.value)} placeholder="5000000" /></div>
              <div className="id-field"><label className="id-label">Min Investment (EUR)</label><input className="id-input" type="number" value={cf.minInvestment} onChange={e => uf("minInvestment", e.target.value)} placeholder="100" /></div>
              <div className="id-field"><label className="id-label">Token Price (EUR)</label><input className="id-input" type="number" step="0.01" value={cf.tokenPrice} onChange={e => uf("tokenPrice", e.target.value)} placeholder="10.00" /></div>
            </div>
            <div className="id-3col">
              <div className="id-field"><label className="id-label">Target ROI (%)</label><input className="id-input" type="number" step="0.1" value={cf.targetROI} onChange={e => uf("targetROI", e.target.value)} placeholder="18.2" /></div>
              <div className="id-field"><label className="id-label">Term (months)</label><input className="id-input" type="number" value={cf.term} onChange={e => uf("term", e.target.value)} placeholder="36" /></div>
              <div className="id-field"><label className="id-label">Risk Level</label><select className="id-input" value={cf.riskLevel} onChange={e => uf("riskLevel", e.target.value)}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#F0B90B", letterSpacing: 1, textTransform: "uppercase", margin: "20px 0 10px" }}>Documents &amp; Photos ({totalDocsCount} uploaded)</div>
            <div className="id-doc-cats">
              {DOC_CATEGORIES.map(cat => {
                const count = (cf.documents[cat.id] || []).length;
                return (
                  <button key={cat.id} className={`id-doc-cat ${docCategory === cat.id ? "on" : ""}`} onClick={() => setDocCategory(cat.id)}>
                    <span>{cat.icon}</span> {cat.label} {count > 0 && <span style={{ background: "rgba(240,185,11,0.2)", borderRadius: 10, padding: "1px 6px", fontSize: 10, color: "#F0B90B" }}>{count}</span>}
                  </button>
                );
              })}
            </div>
            {DOC_CATEGORIES.filter(c => c.id === docCategory).map(cat => (
              <div key={cat.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 10, fontStyle: "italic" }}>{cat.desc}</div>
                <div className="id-2col" style={{ marginBottom: 10 }}>
                  <div><label className="id-label">Type</label><select className="id-input" value={docSubType} onChange={e => setDocSubType(e.target.value)} style={{ fontSize: 12 }}><option value="">Select...</option>{cat.types.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                  <div style={{ display: "flex", alignItems: "flex-end" }}><div><input type="file" ref={fileRef} accept={cat.accept} onChange={e => handleCategoryUpload(e, cat.id, docSubType)} style={{ display: "none" }} /><button onClick={() => fileRef.current?.click()} disabled={uploading} className="id-btn id-btn-gold" style={{ fontSize: 12 }}>{uploading ? "Uploading..." : `Upload ${cat.label}`}</button></div></div>
                </div>
                {cat.id === "photos" && (cf.documents.photos || []).length > 0 && (
                  <div className="id-photo-grid">
                    {cf.documents.photos.map((d, i) => (
                      <div key={i} className="id-photo-thumb">
                        <img src={d.url} alt={d.subType || d.name} />
                        <button className="id-photo-rm" onClick={() => removeDoc("photos", i)}>&times;</button>
                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "3px 6px", background: "rgba(0,0,0,0.7)", fontSize: 9, color: "rgba(255,255,255,0.6)" }}>{d.subType || d.name}</div>
                      </div>
                    ))}
                  </div>
                )}
                {cat.id !== "photos" && (cf.documents[cat.id] || []).length > 0 && (
                  <div className="id-doc-list">
                    {cf.documents[cat.id].map((d, i) => (
                      <div key={i} className="id-doc-item">
                        <div><span style={{ color: cat.color, marginRight: 6 }}>{cat.icon}</span><a href={d.url} target="_blank" rel="noopener noreferrer" style={{ color: "#F0B90B", textDecoration: "none" }}>{d.name}</a>{d.subType && <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginLeft: 8 }}>&middot; {d.subType}</span>}</div>
                        <button className="id-doc-rm" onClick={() => removeDoc(cat.id, i)}>&times;</button>
                      </div>
                    ))}
                  </div>
                )}
                {(cf.documents[cat.id] || []).length === 0 && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", textAlign: "center", padding: "8px 0" }}>No {cat.label.toLowerCase()} uploaded yet</div>}
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button className="id-btn id-btn-ghost" style={{ flex: 1 }} onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="id-btn id-btn-gold" style={{ flex: 2 }} disabled={createLoading || !cf.name || !cf.ticker || !cf.targetRaise} onClick={handleCreate}>
                {createLoading ? "Creating..." : "Create Listing \u2192"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ PASSWORD CHANGE MODAL ═══════ */}
      {showPwModal && (
        <div className="id-overlay" onClick={e => { if (e.target === e.currentTarget) setShowPwModal(false); }}>
          <div className="id-modal" style={{ maxWidth: 420 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>Change Password</div>
              <button onClick={() => { setShowPwModal(false); setPwMsg(""); }} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 22, cursor: "pointer" }}>&times;</button>
            </div>
            <div className="id-field">
              <label className="id-label">Current Password</label>
              <input className="id-input" type="password" value={pwForm.current} onChange={e => setPwForm({ ...pwForm, current: e.target.value })} placeholder="Enter current password" />
            </div>
            <div className="id-field">
              <label className="id-label">New Password</label>
              <input className="id-input" type="password" value={pwForm.newPw} onChange={e => setPwForm({ ...pwForm, newPw: e.target.value })} placeholder="Min 8 characters" />
            </div>
            <div className="id-field">
              <label className="id-label">Confirm New Password</label>
              <input className="id-input" type="password" value={pwForm.confirm} onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })} placeholder="Repeat new password" />
            </div>
            {pwMsg && (
              <div className={`id-msg ${pwMsg.startsWith("\u2705") ? "ok" : "err"}`}>{pwMsg}</div>
            )}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button className="id-btn id-btn-ghost" style={{ flex: 1 }} onClick={() => { setShowPwModal(false); setPwMsg(""); }}>Cancel</button>
              <button className="id-btn id-btn-gold" style={{ flex: 2 }} disabled={pwLoading || !pwForm.current || !pwForm.newPw || !pwForm.confirm} onClick={handlePasswordChange}>
                {pwLoading ? "Changing..." : "Update Password"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}