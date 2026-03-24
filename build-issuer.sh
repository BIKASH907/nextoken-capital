#!/bin/bash
# ============================================================================
#  Nextoken Capital — Asset Owner Full Feature Build
#
#  Creates:
#    1. /api/upload.js          — Cloudinary file upload endpoint
#    2. /api/assets/create.js   — Create asset listing with docs
#    3. /api/assets/my-listings.js — Get issuer's own assets
#    4. /api/assets/[id]/update.js — Update asset
#    5. /pages/issuer-dashboard.js — Full issuer dashboard
#    6. /pages/api/assets/stats.js — Dashboard stats
#
#  Usage:
#    cd "D:/New folder/nextoken-capital"
#    chmod +x build-issuer.sh
#    ./build-issuer.sh
# ============================================================================
set -euo pipefail
GREEN='\033[0;32m'; CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'
log() { echo -e "${CYAN}[nextoken]${NC} $1"; }
ok()  { echo -e "${GREEN}  ✔${NC} $1"; }

[ -f "package.json" ] || { echo "Run from project root."; exit 1; }

log "Building Asset Owner features..."

# ============================================================================
#  1. API: Cloudinary Upload
# ============================================================================
mkdir -p pages/api

cat > pages/api/upload.js << 'ENDOFFILE'
import { IncomingForm } from "formidable";
import cloudinary from "cloudinary";
import { getUserFromRequest } from "../../lib/auth";
import connectDB from "../../lib/db";

export const config = { api: { bodyParser: false } };

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  await connectDB();
  const user = await getUserFromRequest(req);
  if (!user) return res.status(401).json({ error: "Not authenticated" });

  const form = new IncomingForm({ keepExtensions: true, maxFileSize: 20 * 1024 * 1024 });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).json({ error: "File parse error: " + err.message });

    const file = files.file?.[0] || files.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    try {
      const result = await cloudinary.v2.uploader.upload(file.filepath || file.path, {
        folder: "nextoken/assets",
        resource_type: "auto",
        allowed_formats: ["pdf","jpg","jpeg","png","webp","doc","docx"],
      });

      return res.status(200).json({
        success: true,
        url:      result.secure_url,
        publicId: result.public_id,
        name:     file.originalFilename || file.newFilename,
        type:     result.resource_type,
        format:   result.format,
        size:     result.bytes,
      });
    } catch (e) {
      return res.status(500).json({ error: "Upload failed: " + e.message });
    }
  });
}
ENDOFFILE
ok "pages/api/upload.js"

# ============================================================================
#  2. API: Create Asset Listing
# ============================================================================
mkdir -p pages/api/assets

cat > pages/api/assets/create.js << 'ENDOFFILE'
import connectDB from "../../../lib/db";
import { getUserFromRequest } from "../../../lib/auth";
import User from "../../../lib/models/User";
import Asset from "../../../lib/models/Asset";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  await connectDB();
  const session = await getUserFromRequest(req);
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  const user = await User.findById(session.userId || session.id);
  if (!user) return res.status(401).json({ error: "User not found" });

  // Allow both issuers and investors to list (they become issuers)
  if (user.accountType !== "issuer") {
    user.accountType = "issuer";
    await user.save();
  }

  const {
    name, ticker, description, assetType, category,
    location, country, targetRaise, minInvestment, maxInvestment,
    targetROI, term, yieldFrequency, tokenPrice, tokenSupply,
    riskLevel, documents, imageUrl, eligibility,
  } = req.body;

  if (!name || !ticker || !assetType || !targetRaise) {
    return res.status(400).json({ error: "Name, ticker, asset type, and target raise are required." });
  }

  try {
    const asset = await Asset.create({
      name,
      ticker: ticker.toUpperCase(),
      description,
      assetType,
      category,
      location,
      country,
      targetRaise: Number(targetRaise),
      minInvestment: Number(minInvestment) || 100,
      maxInvestment: maxInvestment ? Number(maxInvestment) : undefined,
      targetROI: targetROI ? Number(targetROI) : undefined,
      term: term ? Number(term) : undefined,
      yieldFrequency,
      tokenPrice: tokenPrice ? Number(tokenPrice) : undefined,
      tokenSupply: tokenSupply ? Number(tokenSupply) : undefined,
      riskLevel: riskLevel || "medium",
      documents: documents || [],
      imageUrl,
      eligibility: eligibility || "eu_verified",
      issuerId: user._id,
      issuerName: `${user.firstName} ${user.lastName}`,
      createdBy: user._id,
      status: "review",
    });

    return res.status(201).json({ success: true, asset, message: "Asset submitted for review." });
  } catch (e) {
    return res.status(500).json({ error: "Failed to create asset: " + e.message });
  }
}
ENDOFFILE
ok "pages/api/assets/create.js"

# ============================================================================
#  3. API: Get Issuer's Own Listings
# ============================================================================
cat > pages/api/assets/my-listings.js << 'ENDOFFILE'
import connectDB from "../../../lib/db";
import { getUserFromRequest } from "../../../lib/auth";
import Asset from "../../../lib/models/Asset";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  await connectDB();
  const session = await getUserFromRequest(req);
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  try {
    const assets = await Asset.find({ issuerId: session.userId || session.id })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ success: true, assets });
  } catch (e) {
    return res.status(500).json({ error: "Failed to fetch listings: " + e.message });
  }
}
ENDOFFILE
ok "pages/api/assets/my-listings.js"

# ============================================================================
#  4. API: Dashboard Stats for Issuer
# ============================================================================
cat > pages/api/assets/stats.js << 'ENDOFFILE'
import connectDB from "../../../lib/db";
import { getUserFromRequest } from "../../../lib/auth";
import Asset from "../../../lib/models/Asset";
import Investment from "../../../lib/models/Investment";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  await connectDB();
  const session = await getUserFromRequest(req);
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  const userId = session.userId || session.id;

  try {
    const assets = await Asset.find({ issuerId: userId }).lean();
    const assetIds = assets.map(a => a._id.toString());

    // Get investments for issuer's assets
    let totalInvestmentReceived = 0;
    let totalInvestors = 0;
    let investments = [];

    if (assetIds.length > 0) {
      investments = await Investment.find({ assetId: { $in: assetIds } }).lean();
      totalInvestmentReceived = investments.reduce((s, i) => s + (i.amount || 0), 0);
      const uniqueInvestors = new Set(investments.map(i => i.userId?.toString()));
      totalInvestors = uniqueInvestors.size;
    }

    const totalListings = assets.length;
    const liveListings = assets.filter(a => ["live","closing"].includes(a.status)).length;
    const pendingListings = assets.filter(a => ["draft","review"].includes(a.status)).length;
    const totalRaised = assets.reduce((s, a) => s + (a.raisedAmount || 0), 0);
    const totalTarget = assets.reduce((s, a) => s + (a.targetRaise || 0), 0);

    return res.status(200).json({
      success: true,
      stats: {
        totalListings,
        liveListings,
        pendingListings,
        totalRaised,
        totalTarget,
        totalInvestmentReceived,
        totalInvestors,
        fundingProgress: totalTarget > 0 ? Math.round((totalRaised / totalTarget) * 100) : 0,
      },
      assets,
      recentInvestments: investments.slice(0, 10),
    });
  } catch (e) {
    return res.status(500).json({ error: "Failed to load stats: " + e.message });
  }
}
ENDOFFILE
ok "pages/api/assets/stats.js"

# ============================================================================
#  5. API: Update Asset
# ============================================================================
mkdir -p "pages/api/assets/[id]"

cat > 'pages/api/assets/[id]/update.js' << 'ENDOFFILE'
import connectDB from "../../../../lib/db";
import { getUserFromRequest } from "../../../../lib/auth";
import Asset from "../../../../lib/models/Asset";

export default async function handler(req, res) {
  if (req.method !== "PUT") return res.status(405).json({ error: "Method not allowed" });

  await connectDB();
  const session = await getUserFromRequest(req);
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  const { id } = req.query;
  const userId = session.userId || session.id;

  try {
    const asset = await Asset.findById(id);
    if (!asset) return res.status(404).json({ error: "Asset not found" });
    if (asset.issuerId.toString() !== userId) return res.status(403).json({ error: "Not authorized" });

    const updates = req.body;
    // Only allow updating certain fields
    const allowed = ["name","description","category","location","country","targetROI",
      "term","minInvestment","maxInvestment","yieldFrequency","riskLevel",
      "documents","imageUrl","eligibility"];

    for (const key of allowed) {
      if (updates[key] !== undefined) asset[key] = updates[key];
    }
    asset.updatedAt = new Date();
    await asset.save();

    return res.status(200).json({ success: true, asset });
  } catch (e) {
    return res.status(500).json({ error: "Update failed: " + e.message });
  }
}
ENDOFFILE
ok "pages/api/assets/[id]/update.js"

# ============================================================================
#  6. ISSUER DASHBOARD PAGE
# ============================================================================
log "Building issuer dashboard page..."

cat > pages/issuer-dashboard.js << 'ENDOFFILE'
import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const STATUS_COLORS = {
  draft:     { bg:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.5)", label:"Draft" },
  review:    { bg:"rgba(240,185,11,0.1)",   color:"#F0B90B",              label:"Under Review" },
  approved:  { bg:"rgba(59,130,246,0.1)",   color:"#3B82F6",              label:"Approved" },
  live:      { bg:"rgba(14,203,129,0.1)",   color:"#0ECB81",              label:"Live" },
  closing:   { bg:"rgba(240,185,11,0.1)",   color:"#F0B90B",              label:"Closing Soon" },
  closed:    { bg:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.5)", label:"Closed" },
  completed: { bg:"rgba(14,203,129,0.06)",  color:"#0ECB81",              label:"Completed" },
  cancelled: { bg:"rgba(255,77,77,0.1)",    color:"#FF4D4D",              label:"Cancelled" },
};

export default function IssuerDashboard() {
  const router = useRouter();
  const [user, setUser]       = useState(null);
  const [stats, setStats]     = useState(null);
  const [assets, setAssets]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState("overview");
  const [showCreate, setShowCreate] = useState(false);

  // Create form state
  const [form, setForm] = useState({
    name:"", ticker:"", description:"", assetType:"real_estate", category:"",
    location:"", country:"", targetRaise:"", minInvestment:"100",
    targetROI:"", term:"", riskLevel:"medium", yieldFrequency:"quarterly",
  });
  const [docs, setDocs]             = useState([]);
  const [uploading, setUploading]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg]               = useState("");

  const loadData = useCallback(async () => {
    try {
      const userRes = await fetch("/api/user/me");
      if (!userRes.ok) { router.push("/login?redirect=/issuer-dashboard"); return; }
      const userData = await userRes.json();
      setUser(userData);

      const statsRes = await fetch("/api/assets/stats");
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
        setAssets(statsData.assets || []);
      }
    } catch { router.push("/login"); }
    finally { setLoading(false); }
  }, [router]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleForm = e => setForm({ ...form, [e.target.name]: e.target.value });

  const uploadFile = async (file) => {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setDocs(prev => [...prev, { name: data.name, url: data.url, type: data.format }]);
      } else { setMsg("❌ Upload failed: " + data.error); }
    } catch { setMsg("❌ Upload error"); }
    setUploading(false);
  };

  const removeDoc = (idx) => setDocs(prev => prev.filter((_, i) => i !== idx));

  const submitAsset = async () => {
    if (!form.name || !form.ticker || !form.targetRaise) {
      setMsg("❌ Name, ticker, and target raise are required."); return;
    }
    setSubmitting(true); setMsg("");
    try {
      const res = await fetch("/api/assets/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, documents: docs }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg("✅ " + data.message);
        setShowCreate(false);
        setForm({ name:"",ticker:"",description:"",assetType:"real_estate",category:"",location:"",country:"",targetRaise:"",minInvestment:"100",targetROI:"",term:"",riskLevel:"medium",yieldFrequency:"quarterly" });
        setDocs([]);
        loadData();
      } else { setMsg("❌ " + data.error); }
    } catch { setMsg("❌ Network error"); }
    setSubmitting(false);
  };

  const fmt = n => n >= 1000000 ? "€" + (n/1000000).toFixed(1) + "M" : n >= 1000 ? "€" + (n/1000).toFixed(0) + "K" : "€" + n;

  if (loading) return (
    <div style={{minHeight:"100vh",background:"#0B0E11",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{width:32,height:32,border:"3px solid rgba(240,185,11,0.2)",borderTopColor:"#F0B90B",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!user) return null;

  return (
    <>
      <Head><title>Asset Owner Dashboard — Nextoken Capital</title></Head>
      <Navbar />
      <style>{`
        .id{min-height:100vh;background:#0B0E11;padding-top:64px}
        .id-head{background:#0F1318;border-bottom:1px solid rgba(255,255,255,0.07);padding:20px}
        .id-head-in{max-width:1280px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px}
        .id-welcome{font-size:clamp(1rem,2.5vw,1.4rem);font-weight:900;color:#fff}
        .id-welcome-sub{font-size:13px;color:rgba(255,255,255,0.35);margin-top:2px}
        .id-body{max-width:1280px;margin:0 auto;padding:22px 20px 60px}
        .id-tabs{display:flex;border-bottom:1px solid rgba(255,255,255,0.07);margin-bottom:20px;overflow-x:auto}
        .id-tab{padding:10px 18px;font-size:13px;font-weight:600;color:rgba(255,255,255,0.4);background:none;border:none;border-bottom:2px solid transparent;cursor:pointer;font-family:inherit;transition:all .15s;white-space:nowrap;margin-bottom:-1px}
        .id-tab:hover{color:#fff}
        .id-tab.on{color:#F0B90B;border-bottom-color:#F0B90B}
        .id-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px}
        .id-stat{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:18px}
        .id-stat-v{font-size:1.5rem;font-weight:900;line-height:1;margin-bottom:5px}
        .id-stat-l{font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:.5px}
        .id-card{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:13px;overflow:hidden;margin-bottom:16px}
        .id-card-head{padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:space-between}
        .id-card-title{font-size:13px;font-weight:700;color:#fff}
        .id-row{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.05);gap:12px}
        .id-row:last-child{border-bottom:none}
        .id-badge{padding:3px 10px;border-radius:999px;font-size:10px;font-weight:700}
        .id-empty{padding:28px 18px;font-size:13px;color:rgba(255,255,255,0.3);text-align:center}
        .id-prog{height:4px;background:rgba(255,255,255,0.06);border-radius:2px;overflow:hidden;margin-top:6px}
        .id-prog-fill{height:100%;background:#F0B90B;border-radius:2px}
        .id-btn{padding:9px 20px;background:#F0B90B;color:#000;border:none;border-radius:7px;font-size:13px;font-weight:800;cursor:pointer;font-family:inherit;transition:background .15s}
        .id-btn:hover{background:#FFD000}
        .id-btn:disabled{opacity:.4;cursor:not-allowed}
        .id-btn-ghost{background:transparent;color:rgba(255,255,255,0.6);border:1px solid rgba(255,255,255,0.12)}
        .id-btn-ghost:hover{color:#fff;border-color:rgba(255,255,255,0.3)}
        /* Modal */
        .id-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:10000;display:flex;align-items:flex-start;justify-content:center;padding:80px 20px;overflow-y:auto}
        .id-modal{background:#0F1318;border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:28px;width:100%;max-width:640px}
        .id-modal-title{font-size:18px;font-weight:900;color:#fff;margin-bottom:4px}
        .id-modal-sub{font-size:13px;color:rgba(255,255,255,0.4);margin-bottom:22px;line-height:1.6}
        .id-field{margin-bottom:14px}
        .id-label{display:block;font-size:11px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px}
        .id-input{width:100%;background:#161B22;color:#fff;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:11px 14px;font-size:13px;outline:none;font-family:inherit;transition:border-color .15s;box-sizing:border-box}
        .id-input:focus{border-color:rgba(240,185,11,0.5)}
        .id-input option{background:#161B22}
        .id-row2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .id-row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
        .id-docs{margin-top:8px}
        .id-doc{display:flex;align-items:center;gap:10px;padding:8px 12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:8px;margin-bottom:6px;font-size:12px;color:rgba(255,255,255,0.6)}
        .id-doc-rm{background:none;border:none;color:#FF4D4D;cursor:pointer;font-size:14px;margin-left:auto}
        .id-upload-zone{border:2px dashed rgba(255,255,255,0.12);border-radius:10px;padding:20px;text-align:center;cursor:pointer;transition:border-color .2s}
        .id-upload-zone:hover{border-color:rgba(240,185,11,0.4)}
        .id-msg{padding:10px 14px;border-radius:8px;font-size:13px;font-weight:600;margin:14px 0;line-height:1.5}
        .id-msg.ok{background:rgba(14,203,129,0.1);border:1px solid rgba(14,203,129,0.25);color:#0ECB81}
        .id-msg.err{background:rgba(255,77,77,0.08);border:1px solid rgba(255,77,77,0.2);color:#FF6B6B}
        @media(max-width:900px){.id-stats{grid-template-columns:repeat(2,1fr)}.id-row2,.id-row3{grid-template-columns:1fr}}
      `}</style>

      <div className="id">
        <div className="id-head">
          <div className="id-head-in">
            <div>
              <div className="id-welcome">Asset Owner Dashboard 🏢</div>
              <div className="id-welcome-sub">{user.firstName} {user.lastName} · {user.email}</div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button className="id-btn" onClick={() => setShowCreate(true)}>+ New Listing</button>
              <Link href="/dashboard" className="id-btn id-btn-ghost" style={{textDecoration:"none"}}>Investor View</Link>
            </div>
          </div>
        </div>

        <div className="id-body">
          {msg && <div className={`id-msg ${msg.startsWith("✅")?"ok":"err"}`}>{msg}</div>}

          <div className="id-tabs">
            {[["overview","Overview"],["listings","My Listings"],["investments","Received Investments"]].map(([id,lbl]) => (
              <button key={id} className={`id-tab ${tab===id?"on":""}`} onClick={()=>setTab(id)}>{lbl}</button>
            ))}
          </div>

          {/* STATS */}
          <div className="id-stats">
            <div className="id-stat">
              <div className="id-stat-v" style={{color:"#F0B90B"}}>{stats?.totalListings || 0}</div>
              <div className="id-stat-l">Total Listings</div>
            </div>
            <div className="id-stat">
              <div className="id-stat-v" style={{color:"#0ECB81"}}>{stats?.liveListings || 0}</div>
              <div className="id-stat-l">Live Listings</div>
            </div>
            <div className="id-stat">
              <div className="id-stat-v" style={{color:"#fff"}}>{fmt(stats?.totalRaised || 0)}</div>
              <div className="id-stat-l">Total Raised</div>
            </div>
            <div className="id-stat">
              <div className="id-stat-v" style={{color:"#3B82F6"}}>{stats?.totalInvestors || 0}</div>
              <div className="id-stat-l">Total Investors</div>
            </div>
          </div>

          {/* OVERVIEW TAB */}
          {tab === "overview" && (
            <>
              <div className="id-card">
                <div className="id-card-head">
                  <div className="id-card-title">Funding Progress</div>
                  <span style={{fontSize:12,color:"rgba(255,255,255,0.35)"}}>{stats?.fundingProgress || 0}% overall</span>
                </div>
                <div style={{padding:18}}>
                  <div className="id-prog" style={{height:8}}>
                    <div className="id-prog-fill" style={{width:(stats?.fundingProgress||0)+"%"}}/>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",marginTop:8,fontSize:12,color:"rgba(255,255,255,0.4)"}}>
                    <span>Raised: {fmt(stats?.totalRaised||0)}</span>
                    <span>Target: {fmt(stats?.totalTarget||0)}</span>
                  </div>
                </div>
              </div>

              <div className="id-card">
                <div className="id-card-head">
                  <div className="id-card-title">Recent Listings</div>
                  <button style={{background:"none",border:"none",color:"#F0B90B",fontSize:12,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setTab("listings")}>View all →</button>
                </div>
                {assets.length === 0 ? (
                  <div className="id-empty">No listings yet. <button style={{background:"none",border:"none",color:"#F0B90B",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setShowCreate(true)}>Create your first listing →</button></div>
                ) : assets.slice(0,5).map(a => {
                  const s = STATUS_COLORS[a.status] || STATUS_COLORS.draft;
                  const pct = a.targetRaise > 0 ? Math.round((a.raisedAmount||0)/a.targetRaise*100) : 0;
                  return (
                    <div key={a._id} className="id-row" style={{flexDirection:"column",alignItems:"stretch",gap:8}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div>
                          <div style={{fontSize:14,fontWeight:700,color:"#fff"}}>{a.name}</div>
                          <div style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>{a.ticker} · {a.assetType} · {a.location}</div>
                        </div>
                        <span className="id-badge" style={{background:s.bg,color:s.color}}>{s.label}</span>
                      </div>
                      <div className="id-prog"><div className="id-prog-fill" style={{width:pct+"%"}}/></div>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"rgba(255,255,255,0.35)"}}>
                        <span>{fmt(a.raisedAmount||0)} raised of {fmt(a.targetRaise)}</span>
                        <span>{pct}% funded · {a.investorCount||0} investors</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* LISTINGS TAB */}
          {tab === "listings" && (
            <div className="id-card">
              <div className="id-card-head">
                <div className="id-card-title">All Listings ({assets.length})</div>
                <button className="id-btn" style={{padding:"6px 14px",fontSize:12}} onClick={()=>setShowCreate(true)}>+ New</button>
              </div>
              {assets.length === 0 ? (
                <div className="id-empty">No listings yet.</div>
              ) : assets.map(a => {
                const s = STATUS_COLORS[a.status] || STATUS_COLORS.draft;
                const pct = a.targetRaise > 0 ? Math.round((a.raisedAmount||0)/a.targetRaise*100) : 0;
                return (
                  <div key={a._id} className="id-row" style={{flexDirection:"column",alignItems:"stretch",gap:8}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div>
                        <div style={{fontSize:14,fontWeight:700,color:"#fff"}}>{a.name}</div>
                        <div style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>
                          {a.ticker} · {a.assetType} · {a.location || "—"} · Min {a.currency||"EUR"} {a.minInvestment}
                          {a.targetROI ? ` · ${a.targetROI}% ROI` : ""} {a.term ? ` · ${a.term}mo` : ""}
                        </div>
                      </div>
                      <span className="id-badge" style={{background:s.bg,color:s.color}}>{s.label}</span>
                    </div>
                    <div className="id-prog"><div className="id-prog-fill" style={{width:pct+"%"}}/></div>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"rgba(255,255,255,0.35)"}}>
                      <span>{fmt(a.raisedAmount||0)} / {fmt(a.targetRaise)} ({pct}%)</span>
                      <span>{a.investorCount||0} investors · {a.documents?.length||0} docs</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* RECEIVED INVESTMENTS TAB */}
          {tab === "investments" && (
            <div className="id-card">
              <div className="id-card-head">
                <div className="id-card-title">Received Investments</div>
                <span style={{fontSize:12,color:"#F0B90B",fontWeight:700}}>Total: {fmt(stats?.totalInvestmentReceived||0)}</span>
              </div>
              <div className="id-empty">Investment details will appear here as investors fund your listings.</div>
            </div>
          )}
        </div>
      </div>

      {/* ── CREATE LISTING MODAL ── */}
      {showCreate && (
        <div className="id-overlay" onClick={e=>{if(e.target===e.currentTarget)setShowCreate(false)}}>
          <div className="id-modal">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
              <div className="id-modal-title">Create New Listing</div>
              <button onClick={()=>setShowCreate(false)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",fontSize:22,cursor:"pointer"}}>×</button>
            </div>
            <p className="id-modal-sub">Submit your asset for review. Our compliance team will review within 2 business days.</p>

            {msg && <div className={`id-msg ${msg.startsWith("✅")?"ok":"err"}`}>{msg}</div>}

            <div className="id-row2">
              <div className="id-field">
                <label className="id-label">Asset Name *</label>
                <input className="id-input" name="name" value={form.name} onChange={handleForm} placeholder="e.g. Solar Farm Portfolio" />
              </div>
              <div className="id-field">
                <label className="id-label">Ticker Symbol *</label>
                <input className="id-input" name="ticker" value={form.ticker} onChange={handleForm} placeholder="e.g. SOLAR-01" style={{textTransform:"uppercase"}} />
              </div>
            </div>

            <div className="id-field">
              <label className="id-label">Description</label>
              <textarea className="id-input" name="description" value={form.description} onChange={handleForm} rows={3} placeholder="Describe your asset opportunity..." style={{resize:"vertical"}} />
            </div>

            <div className="id-row3">
              <div className="id-field">
                <label className="id-label">Asset Type *</label>
                <select className="id-input" name="assetType" value={form.assetType} onChange={handleForm}>
                  <option value="real_estate">Real Estate</option>
                  <option value="bond">Bond</option>
                  <option value="equity">Equity</option>
                  <option value="energy">Energy</option>
                  <option value="fund">Fund</option>
                  <option value="commodity">Commodity</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="id-field">
                <label className="id-label">Category</label>
                <input className="id-input" name="category" value={form.category} onChange={handleForm} placeholder="e.g. Commercial" />
              </div>
              <div className="id-field">
                <label className="id-label">Risk Level</label>
                <select className="id-input" name="riskLevel" value={form.riskLevel} onChange={handleForm}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="id-row2">
              <div className="id-field">
                <label className="id-label">Location</label>
                <input className="id-input" name="location" value={form.location} onChange={handleForm} placeholder="e.g. Berlin, Germany" />
              </div>
              <div className="id-field">
                <label className="id-label">Country</label>
                <input className="id-input" name="country" value={form.country} onChange={handleForm} placeholder="e.g. Germany" />
              </div>
            </div>

            <div className="id-row3">
              <div className="id-field">
                <label className="id-label">Target Raise (EUR) *</label>
                <input className="id-input" name="targetRaise" type="number" value={form.targetRaise} onChange={handleForm} placeholder="e.g. 5000000" />
              </div>
              <div className="id-field">
                <label className="id-label">Min Investment (EUR)</label>
                <input className="id-input" name="minInvestment" type="number" value={form.minInvestment} onChange={handleForm} placeholder="100" />
              </div>
              <div className="id-field">
                <label className="id-label">Target ROI (%)</label>
                <input className="id-input" name="targetROI" type="number" value={form.targetROI} onChange={handleForm} placeholder="e.g. 16.5" />
              </div>
            </div>

            <div className="id-row2">
              <div className="id-field">
                <label className="id-label">Term (months)</label>
                <input className="id-input" name="term" type="number" value={form.term} onChange={handleForm} placeholder="e.g. 36" />
              </div>
              <div className="id-field">
                <label className="id-label">Yield Frequency</label>
                <select className="id-input" name="yieldFrequency" value={form.yieldFrequency} onChange={handleForm}>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annual">Annual</option>
                  <option value="at_maturity">At Maturity</option>
                </select>
              </div>
            </div>

            {/* DOCUMENT UPLOAD */}
            <div className="id-field">
              <label className="id-label">Documents & Photos</label>
              <div className="id-upload-zone" onClick={() => document.getElementById("doc-upload").click()}>
                <input id="doc-upload" type="file" hidden accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={e => { if(e.target.files[0]) uploadFile(e.target.files[0]); e.target.value=""; }} />
                {uploading ? (
                  <div style={{color:"#F0B90B",fontSize:13}}>Uploading...</div>
                ) : (
                  <>
                    <div style={{fontSize:28,marginBottom:6}}>📁</div>
                    <div style={{fontSize:13,color:"rgba(255,255,255,0.5)"}}>Click to upload PDF, JPG, PNG, or DOC</div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.25)",marginTop:4}}>Max 20MB per file · Financial docs, photos, legal papers</div>
                  </>
                )}
              </div>
              {docs.length > 0 && (
                <div className="id-docs">
                  {docs.map((d, i) => (
                    <div key={i} className="id-doc">
                      <span>📄</span>
                      <a href={d.url} target="_blank" rel="noopener noreferrer" style={{color:"#F0B90B",textDecoration:"none",flex:1}}>{d.name}</a>
                      <span style={{color:"rgba(255,255,255,0.25)"}}>{d.type}</span>
                      <button className="id-doc-rm" onClick={()=>removeDoc(i)}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1.5fr",gap:10,marginTop:18}}>
              <button className="id-btn id-btn-ghost" onClick={()=>setShowCreate(false)}>Cancel</button>
              <button className="id-btn" disabled={submitting||!form.name||!form.ticker||!form.targetRaise} onClick={submitAsset}>
                {submitting ? "Submitting..." : "Submit for Review →"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
ENDOFFILE
ok "pages/issuer-dashboard.js"

# ============================================================================
#  7. Add Issuer Dashboard link to Navbar
# ============================================================================
log "Adding issuer-dashboard to Navbar links..."
# Add the link if not already present
if ! grep -q "issuer-dashboard" components/Navbar.js; then
  sed -i 's|{ href: "/tokenize",   label: "Tokenize" },|{ href: "/tokenize",   label: "Tokenize" },\n    { href: "/issuer-dashboard", label: "List Asset" },|' components/Navbar.js
  ok "Added 'List Asset' link to Navbar"
else
  ok "Navbar already has issuer-dashboard link"
fi

# ============================================================================
#  GIT + DEPLOY
# ============================================================================
log "Committing and deploying..."

git add -A
git commit -m "feat: full asset owner system

New features:
  - /api/upload.js — Cloudinary file upload (PDF, JPG, PNG, DOC)
  - /api/assets/create.js — Create asset listing with documents
  - /api/assets/my-listings.js — Get issuer's own listings
  - /api/assets/stats.js — Dashboard statistics
  - /api/assets/[id]/update.js — Update own listing
  - /pages/issuer-dashboard.js — Full asset owner dashboard with:
    - Stats: total listings, live listings, total raised, investors
    - Funding progress bar
    - Listings management with status badges
    - Received investments tracker
    - Create listing modal with document upload
  - Navbar: added 'List Asset' link

Uses existing: User model (accountType=issuer), Asset model,
  Cloudinary, JWT auth, MongoDB"

git push origin main
vercel --prod

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Asset Owner System Built and Deployed!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "  ${BOLD}New pages:${NC}"
echo -e "    ${CYAN}/issuer-dashboard${NC}  — Asset owner dashboard"
echo ""
echo -e "  ${BOLD}New API routes:${NC}"
echo -e "    POST   /api/upload           — File upload (Cloudinary)"
echo -e "    POST   /api/assets/create    — Create listing"
echo -e "    GET    /api/assets/my-listings — My listings"
echo -e "    GET    /api/assets/stats     — Dashboard stats"
echo -e "    PUT    /api/assets/[id]/update — Update listing"
echo ""
echo -e "  ${BOLD}Env vars needed in Vercel:${NC}"
echo -e "    CLOUDINARY_CLOUD_NAME"
echo -e "    CLOUDINARY_API_KEY"
echo -e "    CLOUDINARY_API_SECRET"
echo ""
echo -e "  ${CYAN}https://nextokencapital.com/issuer-dashboard${NC}"
echo ""
