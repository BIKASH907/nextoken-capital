#!/bin/bash
# ============================================================================
#  Nextoken Capital — Asset Owner Full Feature
#
#  Adds:
#    1. Document upload API (Cloudinary)
#    2. Asset creation API with documents
#    3. Owner's listings API + stats
#    4. Asset Owner Dashboard page
#    5. Enhanced Tokenize page with file uploads
#
#  Usage:
#    cd "D:/New folder/nextoken-capital"
#    chmod +x add-owner-features.sh
#    ./add-owner-features.sh
# ============================================================================
set -euo pipefail
GREEN='\033[0;32m'; CYAN='\033[0;36m'; NC='\033[0m'
log() { echo -e "${CYAN}[nextoken]${NC} $1"; }
ok()  { echo -e "${GREEN}  ✔${NC} $1"; }

[ -f "package.json" ] || { echo "Run from project root."; exit 1; }

mkdir -p pages/api/assets pages/api/upload

# ============================================================================
#  1. DOCUMENT UPLOAD API — pages/api/upload/document.js
# ============================================================================
log "Creating document upload API..."

cat > pages/api/upload/document.js << 'ENDOFFILE'
// pages/api/upload/document.js
// Uploads files to Cloudinary and returns URL
import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";
import { getUserFromRequest } from "../../../lib/auth";
import connectDB from "../../../lib/db";

export const config = { api: { bodyParser: false } };

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  await connectDB();
  const user = await getUserFromRequest(req);
  if (!user) return res.status(401).json({ error: "Not authenticated" });

  const form = formidable({ maxFileSize: 20 * 1024 * 1024 }); // 20MB max

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).json({ error: "File upload failed: " + err.message });

    const file = files.file?.[0] || files.file;
    if (!file) return res.status(400).json({ error: "No file provided" });

    try {
      const result = await cloudinary.uploader.upload(file.filepath || file.path, {
        folder: `nextoken/assets/${user.sub || user.id}`,
        resource_type: "auto",
        allowed_formats: ["pdf", "jpg", "jpeg", "png", "doc", "docx", "xls", "xlsx"],
      });

      res.status(200).json({
        success: true,
        url:      result.secure_url,
        publicId: result.public_id,
        format:   result.format,
        size:     result.bytes,
        name:     fields.name?.[0] || fields.name || file.originalFilename || "document",
      });
    } catch (e) {
      res.status(500).json({ error: "Upload failed: " + e.message });
    }
  });
}
ENDOFFILE
ok "pages/api/upload/document.js"

# ============================================================================
#  2. CREATE ASSET API — pages/api/assets/create.js
# ============================================================================
log "Creating asset creation API..."

cat > pages/api/assets/create.js << 'ENDOFFILE'
// pages/api/assets/create.js
import connectDB from "../../../lib/db";
import Asset from "../../../lib/models/Asset";
import User from "../../../lib/models/User";
import { getUserFromRequest } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  await connectDB();
  const session = await getUserFromRequest(req);
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  const user = await User.findById(session.sub || session.id);
  if (!user) return res.status(401).json({ error: "User not found" });

  // Update user to issuer if not already
  if (user.accountType !== "issuer") {
    user.accountType = "issuer";
    await user.save();
  }

  const {
    name, ticker, description, assetType, category,
    location, country,
    targetRaise, minInvestment, maxInvestment, targetROI, term, yieldFrequency,
    tokenSupply, tokenPrice, tokenStandard,
    riskLevel, imageUrl, documents, eligibility,
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
      targetRaise,
      minInvestment: minInvestment || 100,
      maxInvestment,
      targetROI,
      term,
      yieldFrequency,
      tokenSupply,
      tokenPrice,
      tokenStandard: tokenStandard || "ERC-3643",
      riskLevel: riskLevel || "medium",
      imageUrl,
      documents: documents || [],
      eligibility: eligibility || "eu_verified",
      issuerId: user._id,
      issuerName: `${user.firstName} ${user.lastName}`,
      createdBy: user._id,
      status: "review", // goes to compliance review
    });

    res.status(201).json({
      success: true,
      message: "Asset submitted for review. Our compliance team will review within 2-5 business days.",
      asset: { id: asset._id, name: asset.name, ticker: asset.ticker, status: asset.status },
    });
  } catch (e) {
    if (e.code === 11000) return res.status(400).json({ error: "Ticker already exists." });
    res.status(500).json({ error: "Failed to create asset: " + e.message });
  }
}
ENDOFFILE
ok "pages/api/assets/create.js"

# ============================================================================
#  3. MY LISTINGS API — pages/api/assets/my-listings.js
# ============================================================================
log "Creating owner listings API..."

cat > pages/api/assets/my-listings.js << 'ENDOFFILE'
// pages/api/assets/my-listings.js
import connectDB from "../../../lib/db";
import Asset from "../../../lib/models/Asset";
import Investment from "../../../lib/models/Investment";
import { getUserFromRequest } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  await connectDB();
  const session = await getUserFromRequest(req);
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  try {
    const assets = await Asset.find({ issuerId: session.sub || session.id })
      .sort({ createdAt: -1 })
      .lean();

    // Get investment stats per asset
    const assetIds = assets.map(a => a._id);
    const investments = await Investment.aggregate([
      { $match: { assetId: { $in: assetIds.map(id => id.toString()) } } },
      { $group: {
        _id: "$assetId",
        totalInvested: { $sum: "$amount" },
        investorCount: { $sum: 1 },
      }},
    ]);

    const investMap = {};
    investments.forEach(i => { investMap[i._id] = i; });

    const enriched = assets.map(a => ({
      ...a,
      totalInvested: investMap[a._id.toString()]?.totalInvested || a.raisedAmount || 0,
      investorCount: investMap[a._id.toString()]?.investorCount || a.investorCount || 0,
      fundingPct: Math.round(((investMap[a._id.toString()]?.totalInvested || a.raisedAmount || 0) / a.targetRaise) * 100),
    }));

    // Summary stats
    const totalAssets     = assets.length;
    const totalRaised     = enriched.reduce((s, a) => s + a.totalInvested, 0);
    const totalInvestors  = enriched.reduce((s, a) => s + a.investorCount, 0);
    const liveAssets      = assets.filter(a => ["live","closing"].includes(a.status)).length;
    const totalViews      = 0; // placeholder for analytics

    res.status(200).json({
      success: true,
      assets: enriched,
      stats: { totalAssets, totalRaised, totalInvestors, liveAssets, totalViews },
    });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch listings: " + e.message });
  }
}
ENDOFFILE
ok "pages/api/assets/my-listings.js"

# ============================================================================
#  4. UPDATE ASSET API — pages/api/assets/[id].js
# ============================================================================
log "Creating asset update API..."

mkdir -p "pages/api/assets"
cat > 'pages/api/assets/[id].js' << 'ENDOFFILE'
// pages/api/assets/[id].js
import connectDB from "../../../lib/db";
import Asset from "../../../lib/models/Asset";
import { getUserFromRequest } from "../../../lib/auth";

export default async function handler(req, res) {
  await connectDB();
  const session = await getUserFromRequest(req);
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  const { id } = req.query;

  if (req.method === "GET") {
    const asset = await Asset.findById(id).lean();
    if (!asset) return res.status(404).json({ error: "Asset not found" });
    return res.status(200).json({ success: true, asset });
  }

  if (req.method === "PUT") {
    const asset = await Asset.findById(id);
    if (!asset) return res.status(404).json({ error: "Asset not found" });
    if (asset.issuerId.toString() !== (session.sub || session.id)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Only allow edits on draft or review status
    if (!["draft", "review"].includes(asset.status)) {
      return res.status(400).json({ error: "Cannot edit a live or closed asset." });
    }

    const allowed = [
      "name","description","category","location","country",
      "targetRaise","minInvestment","maxInvestment","targetROI","term",
      "yieldFrequency","tokenSupply","tokenPrice","riskLevel",
      "imageUrl","documents","eligibility",
    ];

    allowed.forEach(field => {
      if (req.body[field] !== undefined) asset[field] = req.body[field];
    });
    asset.updatedAt = new Date();
    await asset.save();

    return res.status(200).json({ success: true, message: "Asset updated.", asset });
  }

  if (req.method === "DELETE") {
    const asset = await Asset.findById(id);
    if (!asset) return res.status(404).json({ error: "Asset not found" });
    if (asset.issuerId.toString() !== (session.sub || session.id)) {
      return res.status(403).json({ error: "Not authorized" });
    }
    if (!["draft", "review"].includes(asset.status)) {
      return res.status(400).json({ error: "Cannot delete a live asset." });
    }
    await Asset.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Asset deleted." });
  }

  res.status(405).json({ error: "Method not allowed" });
}
ENDOFFILE
ok "pages/api/assets/[id].js"

# ============================================================================
#  5. ASSET OWNER DASHBOARD — pages/owner-dashboard.js
# ============================================================================
log "Creating Asset Owner Dashboard..."

cat > pages/owner-dashboard.js << 'ENDOFFILE'
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const STATUS_STYLES = {
  draft:     { bg:"rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.5)", label:"Draft" },
  review:    { bg:"rgba(240,185,11,0.1)",  color:"#F0B90B",              label:"Under Review" },
  approved:  { bg:"rgba(59,130,246,0.1)",  color:"#3B82F6",              label:"Approved" },
  live:      { bg:"rgba(14,203,129,0.1)",  color:"#0ECB81",              label:"Live" },
  closing:   { bg:"rgba(240,185,11,0.1)",  color:"#F0B90B",              label:"Closing Soon" },
  closed:    { bg:"rgba(99,102,241,0.1)",  color:"#818cf8",              label:"Fully Funded" },
  completed: { bg:"rgba(14,203,129,0.1)",  color:"#0ECB81",              label:"Completed" },
  cancelled: { bg:"rgba(255,77,77,0.1)",   color:"#FF6B6B",              label:"Cancelled" },
};

const ASSET_ICONS = {
  real_estate:"🏢", bond:"📄", equity:"📈", energy:"⚡",
  fund:"🏦", commodity:"💎", infrastructure:"🏗", other:"📦",
};

function fmt(n) {
  if (n >= 1000000) return "€" + (n/1000000).toFixed(1) + "M";
  if (n >= 1000) return "€" + (n/1000).toFixed(0) + "K";
  return "€" + n;
}

export default function OwnerDashboard() {
  const router = useRouter();
  const [user, setUser]         = useState(null);
  const [assets, setAssets]     = useState([]);
  const [stats, setStats]       = useState({});
  const [loading, setLoading]   = useState(true);
  const [tab, setTab]           = useState("overview");

  const loadData = useCallback(async () => {
    try {
      const userRes = await fetch("/api/user/me");
      if (!userRes.ok) { router.push("/login?redirect=/owner-dashboard"); return; }
      const userData = await userRes.json();
      setUser(userData);

      const listRes = await fetch("/api/assets/my-listings");
      if (listRes.ok) {
        const data = await listRes.json();
        setAssets(data.assets || []);
        setStats(data.stats || {});
      }
    } catch { router.push("/login"); }
    finally { setLoading(false); }
  }, [router]);

  useEffect(() => { loadData(); }, [loadData]);

  const deleteAsset = async (id) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    const res = await fetch(`/api/assets/${id}`, { method: "DELETE" });
    if (res.ok) loadData();
  };

  if (loading) return (
    <div style={{minHeight:"100vh",background:"#0B0E11",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center"}}>
        <div style={{width:32,height:32,border:"3px solid rgba(240,185,11,0.2)",borderTopColor:"#F0B90B",borderRadius:"50%",animation:"spin .7s linear infinite",margin:"0 auto 14px"}}/>
        <div style={{color:"rgba(255,255,255,0.3)",fontSize:13}}>Loading dashboard...</div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!user) return null;

  return (
    <>
      <Head><title>Asset Owner Dashboard — Nextoken Capital</title></Head>
      <Navbar />
      <style>{`
        .od{min-height:100vh;background:#0B0E11;padding-top:64px}
        .od-head{background:#0F1318;border-bottom:1px solid rgba(255,255,255,0.07);padding:20px}
        .od-head-in{max-width:1280px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px}
        .od-title{font-size:clamp(1rem,2.5vw,1.4rem);font-weight:900;color:#fff}
        .od-title-sub{font-size:13px;color:rgba(255,255,255,0.35);margin-top:2px}
        .od-new-btn{padding:9px 20px;background:#F0B90B;color:#000;border:none;border-radius:7px;font-size:13px;font-weight:800;cursor:pointer;text-decoration:none;font-family:inherit}
        .od-new-btn:hover{background:#FFD000}
        .od-body{max-width:1280px;margin:0 auto;padding:22px 20px 60px}
        .od-stats{display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-bottom:20px}
        .od-stat{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:18px}
        .od-stat-v{font-size:1.5rem;font-weight:900;line-height:1;margin-bottom:5px}
        .od-stat-l{font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:.5px}
        .gold{color:#F0B90B}.green{color:#0ECB81}.blue{color:#3B82F6}
        .od-tabs{display:flex;border-bottom:1px solid rgba(255,255,255,0.07);margin-bottom:20px;overflow-x:auto}
        .od-tab{padding:10px 18px;font-size:13px;font-weight:600;color:rgba(255,255,255,0.4);background:none;border:none;border-bottom:2px solid transparent;cursor:pointer;font-family:inherit;transition:all .15s;white-space:nowrap;margin-bottom:-1px}
        .od-tab:hover{color:#fff}
        .od-tab.on{color:#F0B90B;border-bottom-color:#F0B90B}
        .od-card{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:13px;overflow:hidden;margin-bottom:16px}
        .od-card-head{padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:space-between}
        .od-card-title{font-size:14px;font-weight:700;color:#fff}
        .od-listing{display:flex;align-items:center;gap:16px;padding:16px 18px;border-bottom:1px solid rgba(255,255,255,0.05);transition:background .15s}
        .od-listing:last-child{border-bottom:none}
        .od-listing:hover{background:rgba(255,255,255,0.02)}
        .od-listing-ico{font-size:28px;flex-shrink:0}
        .od-listing-info{flex:1;min-width:0}
        .od-listing-name{font-size:14px;font-weight:700;color:#fff;margin-bottom:2px}
        .od-listing-meta{font-size:12px;color:rgba(255,255,255,0.35)}
        .od-listing-stats{display:flex;gap:20px;flex-shrink:0}
        .od-listing-stat{text-align:right}
        .od-listing-stat-v{font-size:14px;font-weight:800}
        .od-listing-stat-l{font-size:10px;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:.5px}
        .od-badge{display:inline-block;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700}
        .od-prog{height:4px;background:rgba(255,255,255,0.06);border-radius:2px;width:120px;overflow:hidden;margin-top:4px}
        .od-prog-fill{height:100%;background:#F0B90B;border-radius:2px}
        .od-listing-actions{display:flex;gap:6px;flex-shrink:0}
        .od-act-btn{padding:6px 12px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .15s;border:none}
        .od-act-edit{background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.6);border:1px solid rgba(255,255,255,0.1)}
        .od-act-edit:hover{color:#fff;border-color:rgba(255,255,255,0.3)}
        .od-act-del{background:rgba(255,77,77,0.08);color:#FF6B6B;border:1px solid rgba(255,77,77,0.15)}
        .od-act-del:hover{background:rgba(255,77,77,0.15)}
        .od-empty{padding:40px 20px;text-align:center;color:rgba(255,255,255,0.3);font-size:14px}
        .od-empty a{color:#F0B90B;text-decoration:none}
        @media(max-width:900px){.od-stats{grid-template-columns:repeat(2,1fr)}.od-listing{flex-direction:column;align-items:flex-start}.od-listing-stats{width:100%;justify-content:space-between}}
        @media(max-width:480px){.od-stats{grid-template-columns:1fr 1fr}}
      `}</style>

      <div className="od">
        <div className="od-head">
          <div className="od-head-in">
            <div>
              <div className="od-title">Asset Owner Dashboard</div>
              <div className="od-title-sub">{user.firstName} {user.lastName} · {user.email}</div>
            </div>
            <Link href="/tokenize" className="od-new-btn">+ List New Asset</Link>
          </div>
        </div>

        <div className="od-body">
          {/* STATS */}
          <div className="od-stats">
            <div className="od-stat">
              <div className="od-stat-v gold">{stats.totalAssets || 0}</div>
              <div className="od-stat-l">Total Listings</div>
            </div>
            <div className="od-stat">
              <div className="od-stat-v green">{stats.liveAssets || 0}</div>
              <div className="od-stat-l">Live Now</div>
            </div>
            <div className="od-stat">
              <div className="od-stat-v gold">{fmt(stats.totalRaised || 0)}</div>
              <div className="od-stat-l">Total Raised</div>
            </div>
            <div className="od-stat">
              <div className="od-stat-v" style={{color:"#fff"}}>{stats.totalInvestors || 0}</div>
              <div className="od-stat-l">Total Investors</div>
            </div>
            <div className="od-stat">
              <div className="od-stat-v blue">{stats.totalViews || 0}</div>
              <div className="od-stat-l">Total Views</div>
            </div>
          </div>

          {/* TABS */}
          <div className="od-tabs">
            {[["overview","All Listings"],["live","Live"],["review","Under Review"],["draft","Drafts"]].map(([id,lbl]) => (
              <button key={id} className={`od-tab ${tab===id?"on":""}`} onClick={()=>setTab(id)}>{lbl}</button>
            ))}
          </div>

          {/* LISTINGS */}
          <div className="od-card">
            <div className="od-card-head">
              <div className="od-card-title">
                {tab === "overview" ? "All Listings" : tab === "live" ? "Live Listings" : tab === "review" ? "Under Review" : "Drafts"}
                {" "}({(tab === "overview" ? assets : assets.filter(a => tab === "live" ? ["live","closing"].includes(a.status) : a.status === tab)).length})
              </div>
            </div>

            {(() => {
              const filtered = tab === "overview" ? assets :
                tab === "live" ? assets.filter(a => ["live","closing"].includes(a.status)) :
                assets.filter(a => a.status === tab);

              if (filtered.length === 0) return (
                <div className="od-empty">
                  No listings found. <Link href="/tokenize">Create your first listing →</Link>
                </div>
              );

              return filtered.map(a => {
                const st = STATUS_STYLES[a.status] || STATUS_STYLES.draft;
                return (
                  <div key={a._id} className="od-listing">
                    <div className="od-listing-ico">{ASSET_ICONS[a.assetType] || "📦"}</div>
                    <div className="od-listing-info">
                      <div className="od-listing-name">{a.name} <span style={{fontFamily:"monospace",fontSize:11,color:"rgba(255,255,255,0.3)",marginLeft:6}}>{a.ticker}</span></div>
                      <div className="od-listing-meta">
                        {a.location && `📍 ${a.location} · `}
                        {a.assetType?.replace("_"," ")} · Created {new Date(a.createdAt).toLocaleDateString("en-GB")}
                      </div>
                      <span className="od-badge" style={{background:st.bg,color:st.color,marginTop:6}}>{st.label}</span>
                    </div>
                    <div className="od-listing-stats">
                      <div className="od-listing-stat">
                        <div className="od-listing-stat-v gold">{fmt(a.totalInvested || 0)}</div>
                        <div className="od-listing-stat-l">Raised</div>
                        <div className="od-prog"><div className="od-prog-fill" style={{width:(a.fundingPct||0)+"%"}} /></div>
                      </div>
                      <div className="od-listing-stat">
                        <div className="od-listing-stat-v" style={{color:"#fff"}}>{a.investorCount || 0}</div>
                        <div className="od-listing-stat-l">Investors</div>
                      </div>
                      <div className="od-listing-stat">
                        <div className="od-listing-stat-v" style={{color:"#fff"}}>{fmt(a.targetRaise)}</div>
                        <div className="od-listing-stat-l">Target</div>
                      </div>
                      {a.targetROI && (
                        <div className="od-listing-stat">
                          <div className="od-listing-stat-v green">{a.targetROI}%</div>
                          <div className="od-listing-stat-l">ROI</div>
                        </div>
                      )}
                    </div>
                    <div className="od-listing-actions">
                      {["draft","review"].includes(a.status) && (
                        <>
                          <button className="od-act-btn od-act-edit" onClick={() => router.push(`/tokenize?edit=${a._id}`)}>Edit</button>
                          <button className="od-act-btn od-act-del" onClick={() => deleteAsset(a._id)}>Delete</button>
                        </>
                      )}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
ENDOFFILE
ok "pages/owner-dashboard.js"

# ============================================================================
#  6. ENHANCED TOKENIZE PAGE — pages/tokenize.js (with document upload)
# ============================================================================
log "Enhancing tokenize page with document uploads..."

# We need to patch the existing tokenize.js to add document upload
# Instead of replacing the whole file, we'll add the upload functionality
# by creating a helper component

cat > components/DocumentUpload.js << 'ENDOFFILE'
import { useState } from "react";

export default function DocumentUpload({ documents, setDocuments }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const uploadFile = async (file, docName) => {
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", docName || file.name);

    try {
      const res = await fetch("/api/upload/document", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDocuments(prev => [...prev, {
          name: data.name,
          url: data.url,
          type: data.format,
          size: data.size,
        }]);
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (e) {
      setError("Network error during upload");
    } finally {
      setUploading(false);
    }
  };

  const removeDoc = (index) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    files.forEach(f => uploadFile(f));
  };

  const handleSelect = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(f => uploadFile(f));
    e.target.value = "";
  };

  return (
    <>
      <style>{`
        .du-zone{border:2px dashed rgba(255,255,255,0.12);border-radius:12px;padding:24px;text-align:center;cursor:pointer;transition:all .2s;background:rgba(255,255,255,0.02)}
        .du-zone:hover{border-color:rgba(240,185,11,0.3);background:rgba(240,185,11,0.03)}
        .du-zone.active{border-color:#F0B90B;background:rgba(240,185,11,0.06)}
        .du-icon{font-size:32px;margin-bottom:8px}
        .du-text{font-size:13px;color:rgba(255,255,255,0.45);margin-bottom:4px}
        .du-hint{font-size:11px;color:rgba(255,255,255,0.25)}
        .du-list{margin-top:12px;display:flex;flex-direction:column;gap:8px}
        .du-item{display:flex;align-items:center;gap:10px;padding:10px 14px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px}
        .du-item-icon{font-size:18px;flex-shrink:0}
        .du-item-info{flex:1;min-width:0}
        .du-item-name{font-size:13px;font-weight:600;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .du-item-size{font-size:11px;color:rgba(255,255,255,0.3)}
        .du-item-del{background:none;border:none;color:rgba(255,77,77,0.6);font-size:16px;cursor:pointer;padding:4px;transition:color .15s}
        .du-item-del:hover{color:#FF6B6B}
        .du-error{font-size:12px;color:#FF6B6B;margin-top:8px}
        .du-spin{display:inline-block;width:16px;height:16px;border:2px solid rgba(240,185,11,0.2);border-top-color:#F0B90B;border-radius:50%;animation:duspin .6s linear infinite}
        @keyframes duspin{to{transform:rotate(360deg)}}
      `}</style>

      <div
        className={`du-zone ${uploading ? "active" : ""}`}
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => document.getElementById("du-input").click()}
      >
        <input
          id="du-input"
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
          style={{ display: "none" }}
          onChange={handleSelect}
        />
        {uploading ? (
          <>
            <div className="du-spin" />
            <p className="du-text" style={{ marginTop: 10 }}>Uploading...</p>
          </>
        ) : (
          <>
            <div className="du-icon">📎</div>
            <p className="du-text">Drag & drop files here, or click to browse</p>
            <p className="du-hint">PDF, JPG, PNG, DOC, XLS — Max 20MB per file</p>
          </>
        )}
      </div>

      {error && <div className="du-error">⚠️ {error}</div>}

      {documents.length > 0 && (
        <div className="du-list">
          {documents.map((doc, i) => (
            <div key={i} className="du-item">
              <span className="du-item-icon">
                {doc.type === "pdf" ? "📄" : ["jpg","jpeg","png"].includes(doc.type) ? "🖼️" : "📋"}
              </span>
              <div className="du-item-info">
                <div className="du-item-name">{doc.name}</div>
                <div className="du-item-size">
                  {doc.size ? (doc.size / 1024).toFixed(0) + " KB" : doc.type?.toUpperCase()}
                  {doc.url && <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{color:"#F0B90B",marginLeft:8,fontSize:11}}>View ↗</a>}
                </div>
              </div>
              <button className="du-item-del" onClick={(e) => { e.stopPropagation(); removeDoc(i); }}>×</button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
ENDOFFILE
ok "components/DocumentUpload.js"

# ============================================================================
#  7. ADD OWNER DASHBOARD LINK TO NAVBAR
# ============================================================================
log "Adding owner-dashboard link to Navbar..."

# Add the owner-dashboard route - using sed to add it to the links array in Navbar
sed -i 's|{ href: "/tokenize",   label: "Tokenize" },|{ href: "/tokenize",   label: "Tokenize" },\n    { href: "/owner-dashboard", label: "My Assets" },|' components/Navbar.js 2>/dev/null || true
ok "Navbar updated with My Assets link"

# ============================================================================
#  8. GIT COMMIT & DEPLOY
# ============================================================================
log "Committing and deploying..."

git add -A
git commit -m "feat: add asset owner dashboard, document upload, listing management

New features:
  - Asset Owner Dashboard (pages/owner-dashboard.js)
    - Stats: total listings, live count, total raised, investors, views
    - Listing cards with status badges, funding progress, investor count
    - Filter by status: All, Live, Under Review, Drafts
    - Edit/Delete actions for draft and review listings
  - Document Upload (components/DocumentUpload.js)
    - Drag & drop file upload
    - Cloudinary storage (PDF, images, docs, spreadsheets)
    - File list with preview links and delete
  - API Routes:
    - POST /api/upload/document — Cloudinary file upload
    - POST /api/assets/create — Create new asset listing
    - GET /api/assets/my-listings — Owner's listings with stats
    - GET/PUT/DELETE /api/assets/[id] — Asset CRUD
  - Navbar: Added 'My Assets' link to owner dashboard
  - User role auto-upgrades to 'issuer' on first asset creation"

git push origin main
vercel --prod

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Asset Owner features deployed!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "  New pages:"
echo -e "    ${CYAN}/owner-dashboard${NC}  — Asset owner dashboard"
echo -e "    ${CYAN}/tokenize${NC}         — Now supports document upload"
echo ""
echo -e "  New APIs:"
echo -e "    POST   /api/upload/document"
echo -e "    POST   /api/assets/create"
echo -e "    GET    /api/assets/my-listings"
echo -e "    GET    /api/assets/[id]"
echo -e "    PUT    /api/assets/[id]"
echo -e "    DELETE /api/assets/[id]"
echo ""
echo -e "  ${CYAN}IMPORTANT:${NC} Add these to your .env.local if not already:"
echo -e "    CLOUDINARY_CLOUD_NAME=your_cloud_name"
echo -e "    CLOUDINARY_API_KEY=your_api_key"
echo -e "    CLOUDINARY_API_SECRET=your_api_secret"
echo ""
