#!/bin/bash
# ============================================================================
#  Nextoken Capital — Asset Owner Feature Build
#  
#  Adds: Owner Dashboard, Document Upload, Role-based Login Redirect
#  
#  Usage:
#    cd "D:/New folder/nextoken-capital"
#    chmod +x build-owner-features.sh
#    ./build-owner-features.sh
# ============================================================================
set -euo pipefail
GREEN='\033[0;32m'; CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'
log() { echo -e "${CYAN}[build]${NC} $1"; }
ok()  { echo -e "${GREEN}  ✔${NC} $1"; }

[ -f "package.json" ] || { echo "Run from project root."; exit 1; }

# ── Ensure directories exist ─────────────────────────────────────────────────
mkdir -p pages/api/assets
mkdir -p pages/api/upload

# ============================================================================
#  1. API: Upload files to Cloudinary
# ============================================================================
log "Creating ${BOLD}pages/api/upload/index.js${NC}"

cat > pages/api/upload/index.js << 'ENDOFFILE'
// POST /api/upload — Upload file to Cloudinary
// Returns { url, public_id, original_filename }
import { IncomingForm } from "formidable";
import cloudinary from "cloudinary";
import { getUserFromRequest } from "../../../lib/auth";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const user = await getUserFromRequest(req);
  if (!user) return res.status(401).json({ error: "Not authenticated" });

  const form = new IncomingForm({ keepExtensions: true, maxFileSize: 20 * 1024 * 1024 });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).json({ error: "Upload failed: " + err.message });

    const file = files.file?.[0] || files.file;
    if (!file) return res.status(400).json({ error: "No file provided" });

    try {
      const result = await cloudinary.v2.uploader.upload(file.filepath || file.path, {
        folder: "nextoken/assets",
        resource_type: "auto",
        allowed_formats: ["pdf", "jpg", "jpeg", "png", "doc", "docx", "xls", "xlsx"],
      });

      res.status(200).json({
        url:               result.secure_url,
        public_id:         result.public_id,
        original_filename: file.originalFilename || file.name,
        format:            result.format,
        size:              result.bytes,
      });
    } catch (e) {
      console.error("Cloudinary upload error:", e);
      res.status(500).json({ error: "Upload failed" });
    }
  });
}
ENDOFFILE
ok "pages/api/upload/index.js"

# ============================================================================
#  2. API: Create asset listing
# ============================================================================
log "Creating ${BOLD}pages/api/assets/create.js${NC}"

cat > pages/api/assets/create.js << 'ENDOFFILE'
// POST /api/assets/create — Create new asset listing (issuers only)
import connectDB from "../../../lib/db";
import Asset from "../../../lib/models/Asset";
import User from "../../../lib/models/User";
import { getUserFromRequest } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const session = await getUserFromRequest(req);
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  await connectDB();

  const user = await User.findById(session.userId || session.id);
  if (!user) return res.status(401).json({ error: "User not found" });

  // Allow both issuers and investors to create listings
  // (they become issuers upon first listing)
  const {
    name, ticker, description, assetType, category,
    location, country,
    targetRaise, minInvestment, maxInvestment, targetROI, term, yieldFrequency,
    tokenSupply, tokenPrice, tokenStandard,
    riskLevel, riskRating,
    imageUrl, documents, // documents = [{ name, url, type }]
    eligibility,
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
      tokenSupply: tokenSupply ? Number(tokenSupply) : undefined,
      tokenPrice: tokenPrice ? Number(tokenPrice) : undefined,
      tokenStandard: tokenStandard || "ERC-3643",
      riskLevel: riskLevel || "medium",
      riskRating,
      imageUrl,
      documents: documents || [],
      eligibility: eligibility || "eu_verified",
      issuerId: user._id,
      issuerName: `${user.firstName} ${user.lastName}`,
      createdBy: user._id,
      status: "review", // goes to admin review
    });

    // Update user accountType to issuer if not already
    if (user.accountType !== "issuer") {
      user.accountType = "issuer";
      await user.save();
    }

    res.status(201).json({ success: true, asset: { id: asset._id, name: asset.name, status: asset.status } });
  } catch (e) {
    console.error("Asset create error:", e);
    if (e.code === 11000) return res.status(400).json({ error: "Ticker already exists." });
    res.status(500).json({ error: "Failed to create listing." });
  }
}
ENDOFFILE
ok "pages/api/assets/create.js"

# ============================================================================
#  3. API: Get my listings (for asset owner dashboard)
# ============================================================================
log "Creating ${BOLD}pages/api/assets/my-listings.js${NC}"

cat > pages/api/assets/my-listings.js << 'ENDOFFILE'
// GET /api/assets/my-listings — Get all assets created by current user
import connectDB from "../../../lib/db";
import Asset from "../../../lib/models/Asset";
import Investment from "../../../lib/models/Investment";
import { getUserFromRequest } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const session = await getUserFromRequest(req);
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  await connectDB();

  try {
    const assets = await Asset.find({ issuerId: session.userId || session.id })
      .sort({ createdAt: -1 })
      .lean();

    // Get investment stats for each asset
    const assetIds = assets.map(a => a._id);
    const investments = await Investment.find({
      assetId: { $in: assetIds },
      status: { $in: ["confirmed", "minted", "active", "matured"] },
    }).lean();

    const statsMap = {};
    investments.forEach(inv => {
      const aid = inv.assetId.toString();
      if (!statsMap[aid]) statsMap[aid] = { totalInvested: 0, investorCount: 0, investors: new Set() };
      statsMap[aid].totalInvested += inv.amount;
      statsMap[aid].investors.add(inv.userId.toString());
    });

    const enriched = assets.map(a => ({
      ...a,
      _id: a._id.toString(),
      totalInvested: statsMap[a._id.toString()]?.totalInvested || 0,
      uniqueInvestors: statsMap[a._id.toString()]?.investors?.size || 0,
      fundingPercent: a.targetRaise > 0
        ? Math.round(((statsMap[a._id.toString()]?.totalInvested || a.raisedAmount || 0) / a.targetRaise) * 100)
        : 0,
    }));

    res.status(200).json({ assets: enriched });
  } catch (e) {
    console.error("My listings error:", e);
    res.status(500).json({ error: "Failed to load listings." });
  }
}
ENDOFFILE
ok "pages/api/assets/my-listings.js"

# ============================================================================
#  4. API: Update asset listing
# ============================================================================
log "Creating ${BOLD}pages/api/assets/update.js${NC}"

cat > pages/api/assets/update.js << 'ENDOFFILE'
// PUT /api/assets/update — Update an existing asset (owner only)
import connectDB from "../../../lib/db";
import Asset from "../../../lib/models/Asset";
import { getUserFromRequest } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "PUT") return res.status(405).json({ error: "Method not allowed" });

  const session = await getUserFromRequest(req);
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  await connectDB();

  const { assetId, ...updates } = req.body;
  if (!assetId) return res.status(400).json({ error: "Asset ID required" });

  try {
    const asset = await Asset.findById(assetId);
    if (!asset) return res.status(404).json({ error: "Asset not found" });
    if (asset.issuerId.toString() !== (session.userId || session.id)) {
      return res.status(403).json({ error: "Not your asset" });
    }

    // Only allow updates on draft/review status
    if (!["draft", "review"].includes(asset.status)) {
      return res.status(400).json({ error: "Cannot edit live or closed listings" });
    }

    const allowed = ["name", "description", "category", "location", "country",
      "targetRaise", "minInvestment", "maxInvestment", "targetROI", "term",
      "yieldFrequency", "riskLevel", "imageUrl", "documents"];

    allowed.forEach(key => {
      if (updates[key] !== undefined) asset[key] = updates[key];
    });
    asset.updatedAt = new Date();
    await asset.save();

    res.status(200).json({ success: true, asset });
  } catch (e) {
    console.error("Asset update error:", e);
    res.status(500).json({ error: "Failed to update" });
  }
}
ENDOFFILE
ok "pages/api/assets/update.js"

# ============================================================================
#  5. ASSET OWNER DASHBOARD PAGE
# ============================================================================
log "Creating ${BOLD}pages/owner-dashboard.js${NC} (full page)"

cat > pages/owner-dashboard.js << 'ENDOFFILE'
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const STATUS_COLORS = {
  draft:    { bg:"rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.5)", label:"Draft" },
  review:   { bg:"rgba(240,185,11,0.1)",  color:"#F0B90B",               label:"Under Review" },
  approved: { bg:"rgba(59,130,246,0.1)",   color:"#3B82F6",               label:"Approved" },
  live:     { bg:"rgba(14,203,129,0.1)",   color:"#0ECB81",               label:"Live" },
  closing:  { bg:"rgba(240,185,11,0.1)",   color:"#F0B90B",               label:"Closing Soon" },
  closed:   { bg:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.4)", label:"Closed" },
  completed:{ bg:"rgba(14,203,129,0.06)",  color:"#0ECB81",               label:"Completed" },
  cancelled:{ bg:"rgba(255,77,77,0.08)",   color:"#FF6B6B",               label:"Cancelled" },
};

function fmt(n) {
  if (n >= 1000000) return "€" + (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return "€" + (n / 1000).toFixed(0) + "K";
  return "€" + n;
}

export default function OwnerDashboard() {
  const router = useRouter();
  const [user, setUser]       = useState(null);
  const [assets, setAssets]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState("overview");

  const loadData = useCallback(async () => {
    try {
      const userRes = await fetch("/api/user/me");
      if (!userRes.ok) { router.push("/login?redirect=/owner-dashboard"); return; }
      const userData = await userRes.json();
      setUser(userData);

      const assetsRes = await fetch("/api/assets/my-listings");
      if (assetsRes.ok) {
        const data = await assetsRes.json();
        setAssets(data.assets || []);
      }
    } catch { router.push("/login"); }
    finally { setLoading(false); }
  }, [router]);

  useEffect(() => { loadData(); }, [loadData]);

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

  const totalRaised     = assets.reduce((s, a) => s + (a.totalInvested || a.raisedAmount || 0), 0);
  const totalTarget     = assets.reduce((s, a) => s + (a.targetRaise || 0), 0);
  const totalInvestors  = assets.reduce((s, a) => s + (a.uniqueInvestors || a.investorCount || 0), 0);
  const liveCount       = assets.filter(a => ["live","closing"].includes(a.status)).length;

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
        .od-head-btns{display:flex;gap:10px;flex-wrap:wrap}
        .od-btn-new{padding:9px 20px;background:#F0B90B;color:#000;border:none;border-radius:7px;font-size:13px;font-weight:800;cursor:pointer;text-decoration:none}
        .od-btn-switch{padding:9px 16px;background:transparent;color:rgba(255,255,255,0.5);border:1px solid rgba(255,255,255,0.12);border-radius:7px;font-size:13px;font-weight:600;cursor:pointer;text-decoration:none}
        .od-body{max-width:1280px;margin:0 auto;padding:22px 20px 60px}

        .od-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px}
        .od-stat{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:18px}
        .od-stat-v{font-size:1.5rem;font-weight:900;line-height:1;margin-bottom:5px}
        .od-stat-l{font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:.5px}

        .od-tabs{display:flex;border-bottom:1px solid rgba(255,255,255,0.07);margin-bottom:20px;overflow-x:auto}
        .od-tab{padding:10px 18px;font-size:13px;font-weight:600;color:rgba(255,255,255,0.4);background:none;border:none;border-bottom:2px solid transparent;cursor:pointer;font-family:inherit;white-space:nowrap;margin-bottom:-1px}
        .od-tab:hover{color:#fff}
        .od-tab.on{color:#F0B90B;border-bottom-color:#F0B90B}

        .od-card{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:13px;overflow:hidden;margin-bottom:16px}
        .od-card-head{padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:space-between}
        .od-card-title{font-size:13px;font-weight:700;color:#fff}

        .od-listing{padding:18px;border-bottom:1px solid rgba(255,255,255,0.05);display:grid;grid-template-columns:1fr auto;gap:16px;align-items:center}
        .od-listing:last-child{border-bottom:none}
        .od-listing-name{font-size:15px;font-weight:800;color:#fff;margin-bottom:3px}
        .od-listing-meta{font-size:12px;color:rgba(255,255,255,0.35);display:flex;gap:12px;flex-wrap:wrap;margin-bottom:8px}
        .od-listing-meta span{display:flex;align-items:center;gap:4px}
        .od-badge{display:inline-block;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700}
        .od-listing-stats{display:flex;gap:20px;flex-wrap:wrap;margin-top:8px}
        .od-listing-stat{text-align:center}
        .od-listing-stat-v{font-size:16px;font-weight:900;color:#F0B90B}
        .od-listing-stat-l{font-size:10px;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:.5px;margin-top:2px}
        .od-prog{height:4px;background:rgba(255,255,255,0.06);border-radius:2px;overflow:hidden;width:200px;margin-top:6px}
        .od-prog-fill{height:100%;background:#F0B90B;border-radius:2px}
        .od-listing-actions{display:flex;flex-direction:column;gap:6px;align-items:flex-end}
        .od-listing-btn{padding:7px 16px;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;border:none;font-family:inherit;transition:all .15s;white-space:nowrap}

        .od-empty{padding:48px;text-align:center;color:rgba(255,255,255,0.3);font-size:14px}
        .od-empty a{color:#F0B90B;text-decoration:none}

        @media(max-width:900px){.od-stats{grid-template-columns:repeat(2,1fr)}.od-listing{grid-template-columns:1fr}}
        @media(max-width:480px){.od-stats{grid-template-columns:1fr 1fr}}
      `}</style>

      <div className="od">
        <div className="od-head">
          <div className="od-head-in">
            <div>
              <div className="od-title">Asset Owner Dashboard 🏢</div>
              <div className="od-title-sub">{user.email} · {assets.length} listing{assets.length !== 1 ? "s" : ""}</div>
            </div>
            <div className="od-head-btns">
              <Link href="/tokenize" className="od-btn-new">+ New Listing</Link>
              <Link href="/dashboard" className="od-btn-switch">Switch to Investor →</Link>
            </div>
          </div>
        </div>

        <div className="od-body">

          {/* STATS */}
          <div className="od-stats">
            <div className="od-stat">
              <div className="od-stat-v" style={{color:"#F0B90B"}}>{fmt(totalRaised)}</div>
              <div className="od-stat-l">Total Raised</div>
            </div>
            <div className="od-stat">
              <div className="od-stat-v" style={{color:"#fff"}}>{assets.length}</div>
              <div className="od-stat-l">Total Listings</div>
            </div>
            <div className="od-stat">
              <div className="od-stat-v" style={{color:"#0ECB81"}}>{liveCount}</div>
              <div className="od-stat-l">Active Listings</div>
            </div>
            <div className="od-stat">
              <div className="od-stat-v" style={{color:"#fff"}}>{totalInvestors}</div>
              <div className="od-stat-l">Total Investors</div>
            </div>
          </div>

          {/* TABS */}
          <div className="od-tabs">
            {[["overview","All Listings"],["live","Live"],["review","Under Review"],["completed","Completed"]].map(([id,lbl]) => (
              <button key={id} className={`od-tab ${tab===id?"on":""}`} onClick={()=>setTab(id)}>{lbl}</button>
            ))}
          </div>

          {/* LISTINGS */}
          <div className="od-card">
            <div className="od-card-head">
              <div className="od-card-title">
                {tab === "overview" ? "All Listings" : tab === "live" ? "Live Listings" : tab === "review" ? "Under Review" : "Completed"}
                {" "}({(tab === "overview" ? assets : assets.filter(a => tab === "live" ? ["live","closing"].includes(a.status) : tab === "review" ? a.status === "review" : a.status === "completed")).length})
              </div>
              <Link href="/tokenize" style={{fontSize:12,color:"#F0B90B",textDecoration:"none"}}>+ Create New</Link>
            </div>

            {(() => {
              const filtered = tab === "overview" ? assets
                : tab === "live" ? assets.filter(a => ["live","closing"].includes(a.status))
                : tab === "review" ? assets.filter(a => a.status === "review")
                : assets.filter(a => a.status === "completed");

              if (filtered.length === 0) return (
                <div className="od-empty">
                  No listings here yet. <Link href="/tokenize">Create your first listing →</Link>
                </div>
              );

              return filtered.map(a => {
                const sc = STATUS_COLORS[a.status] || STATUS_COLORS.draft;
                const pct = a.fundingPercent || (a.targetRaise > 0 ? Math.round(((a.raisedAmount||0)/a.targetRaise)*100) : 0);
                return (
                  <div key={a._id} className="od-listing">
                    <div>
                      <div className="od-listing-name">{a.name}</div>
                      <div className="od-listing-meta">
                        <span>📍 {a.location || "—"}</span>
                        <span>🏷️ {a.ticker}</span>
                        <span>📂 {a.assetType?.replace("_"," ")}</span>
                      </div>
                      <span className="od-badge" style={{background:sc.bg,color:sc.color,border:`1px solid ${sc.color}33`}}>{sc.label}</span>
                      <div className="od-listing-stats">
                        <div className="od-listing-stat">
                          <div className="od-listing-stat-v">{fmt(a.totalInvested || a.raisedAmount || 0)}</div>
                          <div className="od-listing-stat-l">Raised</div>
                        </div>
                        <div className="od-listing-stat">
                          <div className="od-listing-stat-v">{fmt(a.targetRaise)}</div>
                          <div className="od-listing-stat-l">Target</div>
                        </div>
                        <div className="od-listing-stat">
                          <div className="od-listing-stat-v">{a.uniqueInvestors || a.investorCount || 0}</div>
                          <div className="od-listing-stat-l">Investors</div>
                        </div>
                        <div className="od-listing-stat">
                          <div className="od-listing-stat-v">{a.targetROI || "—"}%</div>
                          <div className="od-listing-stat-l">Target ROI</div>
                        </div>
                      </div>
                      <div className="od-prog"><div className="od-prog-fill" style={{width: Math.min(pct, 100) + "%"}} /></div>
                      <div style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginTop:4}}>{pct}% funded</div>
                    </div>
                    <div className="od-listing-actions">
                      {a.documents?.length > 0 && (
                        <span style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>📄 {a.documents.length} doc{a.documents.length > 1 ? "s" : ""}</span>
                      )}
                      {["draft","review"].includes(a.status) && (
                        <button className="od-listing-btn" style={{background:"rgba(240,185,11,0.1)",color:"#F0B90B",border:"1px solid rgba(240,185,11,0.25)"}}
                          onClick={() => router.push(`/tokenize?edit=${a._id}`)}>
                          Edit Listing
                        </button>
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
#  6. UPDATE TOKENIZE PAGE — Add document upload + real API submission
# ============================================================================
log "Updating ${BOLD}pages/tokenize.js${NC} — adding document upload..."

# We patch the existing tokenize.js to add file upload to the form
# Instead of rewriting the whole 400+ line file, we add the upload functionality

# First, check if the tokenize page has the submit function
if grep -q "setSubmitted(true)" pages/tokenize.js; then
  # Replace the basic setSubmitted with real API call + file upload
  sed -i 's/const submit = e => {/const uploadFile = async (file) => {\
    const formData = new FormData();\
    formData.append("file", file);\
    const res = await fetch("\/api\/upload", { method: "POST", body: formData });\
    if (!res.ok) throw new Error("Upload failed");\
    return res.json();\
  };\
\
  const [uploadedDocs, setUploadedDocs] = useState([]);\
  const [uploading, setUploading] = useState(false);\
\
  const handleFileUpload = async (e) => {\
    const files = Array.from(e.target.files);\
    if (files.length === 0) return;\
    setUploading(true);\
    try {\
      const results = [];\
      for (const file of files) {\
        const result = await uploadFile(file);\
        results.push({ name: result.original_filename, url: result.url, type: result.format });\
      }\
      setUploadedDocs(prev => [...prev, ...results]);\
    } catch (err) { alert("Upload failed: " + err.message); }\
    setUploading(false);\
    e.target.value = "";\
  };\
\
  const removeDoc = (idx) => setUploadedDocs(prev => prev.filter((_, i) => i !== idx));\
\
  const submit = async e => {/g' pages/tokenize.js

  # Replace the simple setSubmitted with real API call
  sed -i 's/e\.preventDefault();/e.preventDefault();/g' pages/tokenize.js
  sed -i 's/setSubmitted(true);/try {\
      const res = await fetch("\/api\/assets\/create", {\
        method: "POST",\
        headers: { "Content-Type": "application\/json" },\
        body: JSON.stringify({\
          name: form.name || "Untitled Asset",\
          ticker: (form.company || "ASSET").substring(0,4).toUpperCase() + "-" + Date.now().toString().slice(-4),\
          description: form.assetDesc,\
          assetType: assetType || "other",\
          targetRaise: Number(form.assetValue) || 500000,\
          minInvestment: 100,\
          location: form.country || "",\
          documents: uploadedDocs,\
          issuerName: form.name,\
        }),\
      });\
      const data = await res.json();\
      if (res.ok \&\& data.success) setSubmitted(true);\
      else alert(data.error || "Failed to submit");\
    } catch (err) { alert("Network error: " + err.message); }/g' pages/tokenize.js

  ok "pages/tokenize.js — patched with upload + API"
else
  log "  ⚠ Could not patch tokenize.js automatically. Manual edit needed."
fi

# ============================================================================
#  7. UPDATE LOGIN — Redirect based on accountType
# ============================================================================
log "Patching ${BOLD}pages/login.js${NC} — role-based redirect..."

sed -i 's|const redirect = router.query.redirect || "/dashboard";|const redirect = router.query.redirect || (data.accountType === "issuer" ? "/owner-dashboard" : "/dashboard");|g' pages/login.js
ok "pages/login.js — redirects issuers to owner-dashboard"

# ============================================================================
#  8. UPDATE LOGIN API — Return accountType in response
# ============================================================================
log "Checking login API for accountType..."

if [ -f pages/api/auth/login.js ]; then
  # Add accountType to login response if not already there
  if ! grep -q "accountType" pages/api/auth/login.js; then
    sed -i 's/res\.status(200)\.json({ success: true/res.status(200).json({ success: true, accountType: user.accountType/g' pages/api/auth/login.js
    ok "pages/api/auth/login.js — returns accountType"
  else
    ok "pages/api/auth/login.js — already returns accountType"
  fi
fi

# ============================================================================
#  9. ADD OWNER DASHBOARD LINK TO NAVBAR
# ============================================================================
log "Adding owner dashboard to nav links..."

if ! grep -q "owner-dashboard" components/Navbar.js; then
  sed -i 's|{ href: "/tokenize",   label: "Tokenize" },|{ href: "/tokenize",   label: "Tokenize" },\n    { href: "/owner-dashboard", label: "My Assets" },|g' components/Navbar.js
  ok "components/Navbar.js — added 'My Assets' link"
else
  ok "components/Navbar.js — already has owner-dashboard link"
fi

# ============================================================================
#  10. GIT COMMIT & DEPLOY
# ============================================================================
log "Committing and deploying..."

git add -A
git commit -m "feat: Asset Owner Dashboard + Document Upload + Role-based routing

New pages:
  - /owner-dashboard — full asset owner dashboard with stats, listing management
  - Track total raised, investors, listing status, funding progress

New APIs:
  - POST /api/upload — Cloudinary file upload for documents/images
  - POST /api/assets/create — Create new asset listing (goes to review)
  - GET /api/assets/my-listings — Get owner's listings with investment stats
  - PUT /api/assets/update — Edit draft/review listings

Updated:
  - /tokenize — real document upload + API submission (no longer fake form)
  - /login — redirects issuers to owner-dashboard, investors to dashboard
  - Navbar — added 'My Assets' link for asset owners

Design: matches existing Binance-style dark theme with gold accents"

git push origin main
vercel --prod

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Asset Owner features built and deployed!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "  ${BOLD}New pages:${NC}"
echo -e "    /owner-dashboard    — Asset owner dashboard"
echo -e "    /api/upload         — Cloudinary file upload"
echo -e "    /api/assets/create  — Create listing"
echo -e "    /api/assets/my-listings — Owner's listings"
echo -e "    /api/assets/update  — Edit listing"
echo ""
echo -e "  ${BOLD}Updated:${NC}"
echo -e "    /tokenize     — Real document upload + API"
echo -e "    /login        — Role-based redirect"
echo -e "    Navbar        — 'My Assets' link added"
echo ""
echo -e "  ${BOLD}Env vars needed in Vercel:${NC}"
echo -e "    CLOUDINARY_CLOUD_NAME"
echo -e "    CLOUDINARY_API_KEY"
echo -e "    CLOUDINARY_API_SECRET"
echo ""
echo -e "  ${CYAN}https://nextokencapital.com/owner-dashboard${NC}"
echo ""
ENDOFFILE
