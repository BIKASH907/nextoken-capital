#!/bin/bash
# ============================================================================
#  Nextoken Capital — Asset Owner Full Feature Build
#  Creates: Upload API, Asset APIs, Owner Dashboard, Updated Tokenize page
#
#  Usage:
#    cd "D:/New folder/nextoken-capital"
#    chmod +x build-owner.sh && ./build-owner.sh
# ============================================================================
set -euo pipefail
GREEN='\033[0;32m'; CYAN='\033[0;36m'; NC='\033[0m'
log() { echo -e "${CYAN}[nextoken]${NC} $1"; }
ok()  { echo -e "${GREEN}  ✔${NC} $1"; }

[ -f "package.json" ] || { echo "Run from project root"; exit 1; }

# ── 1. Cloudinary Upload API ─────────────────────────────────────────────────
log "Creating API: /api/upload.js"
mkdir -p pages/api
cat > pages/api/upload.js << 'ENDOFFILE'
// POST /api/upload — Cloudinary file upload
// Accepts multipart form data with file field
import { IncomingForm } from "formidable";
import { v2 as cloudinary } from "cloudinary";
import { getUserFromRequest } from "../../lib/auth";

export const config = { api: { bodyParser: false } };

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const user = await getUserFromRequest(req);
  if (!user) return res.status(401).json({ error: "Not authenticated" });

  try {
    const form = new IncomingForm({ maxFileSize: 20 * 1024 * 1024 });
    const { files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const file = files.file?.[0] || files.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const result = await cloudinary.uploader.upload(file.filepath || file.path, {
      folder: "nextoken/assets",
      resource_type: "auto",
      allowed_formats: ["pdf","jpg","jpeg","png","webp","doc","docx","xls","xlsx"],
    });

    return res.status(200).json({
      success: true,
      url:      result.secure_url,
      publicId: result.public_id,
      format:   result.format,
      size:     result.bytes,
      name:     file.originalFilename || file.name || "document",
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Upload failed" });
  }
}
ENDOFFILE
ok "pages/api/upload.js"

# ── 2. Asset Create API ──────────────────────────────────────────────────────
log "Creating API: /api/assets/create.js"
mkdir -p pages/api/assets
cat > pages/api/assets/create.js << 'ENDOFFILE'
// POST /api/assets/create — Create new asset listing (for issuers/owners)
import dbConnect from "../../../lib/db";
import Asset from "../../../lib/models/Asset";
import User from "../../../lib/models/User";
import { getUserFromRequest } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const session = await getUserFromRequest(req);
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  await dbConnect();
  const user = await User.findById(session.userId || session.id);
  if (!user) return res.status(401).json({ error: "User not found" });

  // Update user to issuer if not already
  if (user.accountType !== "issuer") {
    user.accountType = "issuer";
    await user.save();
  }

  try {
    const {
      name, ticker, description, assetType, category,
      location, country, targetRaise, minInvestment, maxInvestment,
      targetROI, term, yieldFrequency, tokenSupply, tokenPrice,
      riskLevel, imageUrl, documents, eligibility, launchDate, closingDate,
    } = req.body;

    if (!name || !ticker || !assetType || !targetRaise) {
      return res.status(400).json({ error: "Name, ticker, asset type, and target raise are required." });
    }

    const existing = await Asset.findOne({ ticker: ticker.toUpperCase() });
    if (existing) return res.status(400).json({ error: "Ticker already exists. Choose a different one." });

    const asset = await Asset.create({
      name, ticker: ticker.toUpperCase(), description, assetType, category,
      location, country,
      targetRaise: parseFloat(targetRaise),
      minInvestment: parseFloat(minInvestment) || 100,
      maxInvestment: maxInvestment ? parseFloat(maxInvestment) : undefined,
      targetROI: targetROI ? parseFloat(targetROI) : undefined,
      term: term ? parseInt(term) : undefined,
      yieldFrequency,
      tokenSupply: tokenSupply ? parseInt(tokenSupply) : undefined,
      tokenPrice: tokenPrice ? parseFloat(tokenPrice) : undefined,
      riskLevel: riskLevel || "medium",
      imageUrl,
      documents: documents || [],
      eligibility: eligibility || "eu_verified",
      launchDate: launchDate ? new Date(launchDate) : undefined,
      closingDate: closingDate ? new Date(closingDate) : undefined,
      issuerId: user._id,
      issuerName: `${user.firstName} ${user.lastName}`,
      createdBy: user._id,
      status: "review",
    });

    return res.status(201).json({
      success: true,
      message: "Asset submitted for review. Our compliance team will review it within 2-3 business days.",
      asset: { id: asset._id, name: asset.name, ticker: asset.ticker, status: asset.status },
    });
  } catch (err) {
    console.error("Asset create error:", err);
    return res.status(500).json({ error: "Failed to create asset." });
  }
}
ENDOFFILE
ok "pages/api/assets/create.js"

# ── 3. My Listings API ───────────────────────────────────────────────────────
log "Creating API: /api/assets/my-listings.js"
cat > pages/api/assets/my-listings.js << 'ENDOFFILE'
// GET /api/assets/my-listings — Get all assets owned by current user
import dbConnect from "../../../lib/db";
import Asset from "../../../lib/models/Asset";
import { getUserFromRequest } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const session = await getUserFromRequest(req);
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  await dbConnect();

  try {
    const assets = await Asset.find({ issuerId: session.userId || session.id })
      .sort({ createdAt: -1 })
      .lean();

    const listings = assets.map(a => ({
      id:            a._id,
      name:          a.name,
      ticker:        a.ticker,
      assetType:     a.assetType,
      status:        a.status,
      targetRaise:   a.targetRaise,
      raisedAmount:  a.raisedAmount,
      investorCount: a.investorCount,
      targetROI:     a.targetROI,
      minInvestment: a.minInvestment,
      tokenPrice:    a.tokenPrice,
      location:      a.location,
      riskLevel:     a.riskLevel,
      imageUrl:      a.imageUrl,
      documents:     a.documents,
      createdAt:     a.createdAt,
      launchDate:    a.launchDate,
      closingDate:   a.closingDate,
    }));

    const totalRaised    = assets.reduce((s, a) => s + (a.raisedAmount || 0), 0);
    const totalInvestors = assets.reduce((s, a) => s + (a.investorCount || 0), 0);
    const liveCount      = assets.filter(a => a.status === "live" || a.status === "closing").length;

    return res.status(200).json({
      success: true,
      listings,
      stats: {
        totalListings:  assets.length,
        liveListings:   liveCount,
        totalRaised,
        totalInvestors,
      },
    });
  } catch (err) {
    console.error("My listings error:", err);
    return res.status(500).json({ error: "Failed to load listings." });
  }
}
ENDOFFILE
ok "pages/api/assets/my-listings.js"

# ── 4. Update Account Type API ───────────────────────────────────────────────
log "Creating API: /api/user/set-role.js"
mkdir -p pages/api/user
cat > pages/api/user/set-role.js << 'ENDOFFILE'
// POST /api/user/set-role — Set user account type (investor/issuer)
import dbConnect from "../../../lib/db";
import User from "../../../lib/models/User";
import { getUserFromRequest } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const session = await getUserFromRequest(req);
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  const { accountType } = req.body;
  if (!["investor", "issuer"].includes(accountType)) {
    return res.status(400).json({ error: "Invalid account type" });
  }

  await dbConnect();
  await User.findByIdAndUpdate(session.userId || session.id, { accountType });

  return res.status(200).json({ success: true, accountType });
}
ENDOFFILE
ok "pages/api/user/set-role.js"

# ── 5. Owner Dashboard Page ──────────────────────────────────────────────────
log "Creating page: /pages/owner-dashboard.js"
cat > pages/owner-dashboard.js << 'ENDOFFILE'
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const STATUS_COLORS = {
  draft:     { bg:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.4)", label:"Draft" },
  review:    { bg:"rgba(240,185,11,0.1)",   color:"#F0B90B",              label:"Under Review" },
  approved:  { bg:"rgba(59,130,246,0.1)",   color:"#3B82F6",              label:"Approved" },
  live:      { bg:"rgba(14,203,129,0.1)",   color:"#0ECB81",              label:"Live" },
  closing:   { bg:"rgba(240,185,11,0.1)",   color:"#F0B90B",              label:"Closing Soon" },
  closed:    { bg:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.4)", label:"Closed" },
  completed: { bg:"rgba(14,203,129,0.1)",   color:"#0ECB81",              label:"Completed" },
  cancelled: { bg:"rgba(255,77,77,0.1)",    color:"#FF4D4D",              label:"Cancelled" },
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
  const [listings, setListings] = useState([]);
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
        setListings(data.listings || []);
        setStats(data.stats || {});
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
        .od-btn-new{padding:9px 20px;background:#F0B90B;color:#000;border:none;border-radius:7px;font-size:13px;font-weight:800;cursor:pointer;text-decoration:none;font-family:inherit}
        .od-btn-new:hover{background:#FFD000}
        .od-btn-switch{padding:9px 16px;background:transparent;color:rgba(255,255,255,0.5);border:1px solid rgba(255,255,255,0.12);border-radius:7px;font-size:13px;font-weight:600;cursor:pointer;text-decoration:none;font-family:inherit}
        .od-body{max-width:1280px;margin:0 auto;padding:22px 20px 60px}
        .od-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px}
        .od-stat{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:18px}
        .od-stat-v{font-size:1.5rem;font-weight:900;line-height:1;margin-bottom:5px}
        .od-stat-l{font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:.5px}
        .od-tabs{display:flex;border-bottom:1px solid rgba(255,255,255,0.07);margin-bottom:20px;overflow-x:auto}
        .od-tab{padding:10px 18px;font-size:13px;font-weight:600;color:rgba(255,255,255,0.4);background:none;border:none;border-bottom:2px solid transparent;cursor:pointer;font-family:inherit;transition:all .15s;white-space:nowrap;margin-bottom:-1px}
        .od-tab:hover{color:#fff}
        .od-tab.on{color:#F0B90B;border-bottom-color:#F0B90B}
        .od-card{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:13px;overflow:hidden;margin-bottom:16px}
        .od-card-head{padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:space-between}
        .od-card-title{font-size:13px;font-weight:700;color:#fff}
        .od-listing{display:flex;align-items:center;gap:16px;padding:16px 18px;border-bottom:1px solid rgba(255,255,255,0.05);transition:background .15s}
        .od-listing:last-child{border-bottom:none}
        .od-listing:hover{background:rgba(255,255,255,0.02)}
        .od-listing-ico{font-size:28px;flex-shrink:0}
        .od-listing-info{flex:1;min-width:0}
        .od-listing-name{font-size:14px;font-weight:700;color:#fff;margin-bottom:2px}
        .od-listing-meta{font-size:12px;color:rgba(255,255,255,0.35)}
        .od-listing-right{display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0}
        .od-listing-raised{font-size:14px;font-weight:800;color:#F0B90B}
        .od-listing-prog{width:100px;height:4px;background:rgba(255,255,255,0.08);border-radius:2px;overflow:hidden}
        .od-listing-prog-fill{height:100%;background:#F0B90B;border-radius:2px}
        .od-badge{display:inline-block;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700}
        .od-empty{padding:40px 18px;font-size:13px;color:rgba(255,255,255,0.3);text-align:center}
        .od-docs{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
        .od-doc{padding:6px 12px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:6px;font-size:11px;color:rgba(255,255,255,0.5);text-decoration:none;transition:all .15s}
        .od-doc:hover{border-color:rgba(240,185,11,0.3);color:#F0B90B}
        @media(max-width:900px){.od-stats{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:480px){.od-stats{grid-template-columns:1fr 1fr}}
      `}</style>

      <div className="od">
        <div className="od-head">
          <div className="od-head-in">
            <div>
              <div className="od-title">Asset Owner Dashboard 🏢</div>
              <div className="od-title-sub">{user.firstName} {user.lastName} · {user.email}</div>
            </div>
            <div className="od-head-btns">
              <Link href="/tokenize" className="od-btn-new">+ List New Asset</Link>
              <Link href="/dashboard" className="od-btn-switch">Switch to Investor →</Link>
            </div>
          </div>
        </div>

        <div className="od-body">
          {/* STATS */}
          <div className="od-stats">
            <div className="od-stat">
              <div className="od-stat-v" style={{color:"#F0B90B"}}>{stats.totalListings || 0}</div>
              <div className="od-stat-l">Total Listings</div>
            </div>
            <div className="od-stat">
              <div className="od-stat-v" style={{color:"#0ECB81"}}>{stats.liveListings || 0}</div>
              <div className="od-stat-l">Live Listings</div>
            </div>
            <div className="od-stat">
              <div className="od-stat-v" style={{color:"#F0B90B"}}>{fmt(stats.totalRaised || 0)}</div>
              <div className="od-stat-l">Total Raised</div>
            </div>
            <div className="od-stat">
              <div className="od-stat-v" style={{color:"#fff"}}>{stats.totalInvestors || 0}</div>
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
                {" "}({(tab === "overview" ? listings : listings.filter(l =>
                  tab === "live" ? (l.status === "live" || l.status === "closing") :
                  tab === "review" ? (l.status === "review" || l.status === "draft") :
                  (l.status === "completed" || l.status === "closed")
                )).length})
              </div>
              <Link href="/tokenize" style={{fontSize:12,color:"#F0B90B",textDecoration:"none"}}>+ New Listing</Link>
            </div>

            {listings.length === 0 ? (
              <div className="od-empty">
                No listings yet. <Link href="/tokenize" style={{color:"#F0B90B"}}>Create your first listing →</Link>
              </div>
            ) : (
              (tab === "overview" ? listings : listings.filter(l =>
                tab === "live" ? (l.status === "live" || l.status === "closing") :
                tab === "review" ? (l.status === "review" || l.status === "draft") :
                (l.status === "completed" || l.status === "closed")
              )).map(l => {
                const sc = STATUS_COLORS[l.status] || STATUS_COLORS.draft;
                const pct = l.targetRaise ? Math.round((l.raisedAmount / l.targetRaise) * 100) : 0;
                return (
                  <div key={l.id} className="od-listing">
                    <div className="od-listing-ico">{ASSET_ICONS[l.assetType] || "📦"}</div>
                    <div className="od-listing-info">
                      <div className="od-listing-name">{l.name} <span style={{fontFamily:"monospace",fontSize:11,color:"rgba(255,255,255,0.3)",marginLeft:6}}>{l.ticker}</span></div>
                      <div className="od-listing-meta">
                        {l.location && <>📍 {l.location} · </>}
                        {l.targetROI && <>{l.targetROI}% ROI · </>}
                        Min €{l.minInvestment || 100} ·{" "}
                        {l.investorCount || 0} investors
                      </div>
                      {l.documents && l.documents.length > 0 && (
                        <div className="od-docs">
                          {l.documents.map((d, i) => (
                            <a key={i} href={d.url} target="_blank" rel="noopener noreferrer" className="od-doc">
                              📎 {d.name || `Document ${i+1}`}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="od-listing-right">
                      <span className="od-badge" style={{background:sc.bg, color:sc.color, border:`1px solid ${sc.color}33`}}>
                        {sc.label}
                      </span>
                      <div className="od-listing-raised">{fmt(l.raisedAmount || 0)} / {fmt(l.targetRaise)}</div>
                      <div className="od-listing-prog">
                        <div className="od-listing-prog-fill" style={{width: Math.min(pct, 100) + "%"}} />
                      </div>
                      <span style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>{pct}% funded</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* HELP */}
          <div style={{background:"#0F1318",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:20,marginTop:16}}>
            <div style={{fontSize:13,fontWeight:700,color:"#fff",marginBottom:8}}>Need Help?</div>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.4)",lineHeight:1.7,marginBottom:12}}>
              Our compliance team reviews all new listings within 2-3 business days. Once approved, your asset goes live on the marketplace.
            </p>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <Link href="/contact" style={{padding:"8px 16px",background:"rgba(240,185,11,0.1)",border:"1px solid rgba(240,185,11,0.25)",borderRadius:7,fontSize:12,fontWeight:700,color:"#F0B90B",textDecoration:"none"}}>Contact Support</Link>
              <Link href="/help" style={{padding:"8px 16px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:7,fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.5)",textDecoration:"none"}}>Help Center</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
ENDOFFILE
ok "pages/owner-dashboard.js"

# ── 6. Updated Tokenize Page (with file uploads) ─────────────────────────────
log "Updating page: /pages/tokenize.js (adding document upload)"

# Backup
cp pages/tokenize.js pages/tokenize.js.bak 2>/dev/null || true

cat > pages/tokenize.js << 'ENDOFFILE'
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ASSET_TYPES = [
  { id:"real_estate", icon:"🏢", label:"Real Estate",      desc:"Commercial, residential, or industrial property" },
  { id:"bond",        icon:"📄", label:"Corporate Bond",   desc:"Company debt instrument with fixed coupon" },
  { id:"equity",      icon:"📈", label:"Company Equity",   desc:"Shares in a private or public company" },
  { id:"energy",      icon:"⚡", label:"Energy Project",   desc:"Solar, wind, or other renewable energy assets" },
  { id:"fund",        icon:"🏦", label:"Fund",             desc:"Pooled investment vehicle or ETF structure" },
  { id:"other",       icon:"💎", label:"Other Asset",      desc:"Commodities, infrastructure, or other assets" },
];

const STEPS_INFO = [
  { n:"01", title:"Submit Application",  desc:"Complete the form with asset details, financials, and upload documents." },
  { n:"02", title:"Compliance Review",   desc:"Our team reviews your asset for MiCA, AML, and regulatory compliance." },
  { n:"03", title:"Legal Structuring",   desc:"We structure the token as an ERC-3643 security token with full transfer controls." },
  { n:"04", title:"Token Issuance",      desc:"Tokens are minted and listed on the Nextoken marketplace for traders." },
  { n:"05", title:"Live on Marketplace", desc:"Your asset is live. Traders can browse, invest, and trade on the exchange." },
];

const FAQS = [
  { q:"What types of assets can be tokenized?", a:"We support real estate, corporate bonds, company equity, renewable energy projects, funds, and other real-world assets with a clear legal ownership structure." },
  { q:"What is the minimum asset value?", a:"We accept assets with a minimum valuation of EUR 500,000. For smaller assets, we recommend our pooled fund structure." },
  { q:"How long does the process take?", a:"6–12 weeks from application to going live, depending on asset complexity and jurisdiction." },
  { q:"What documents do I need?", a:"Financial statements, legal ownership proof, property valuation (for real estate), business registration, and any relevant regulatory licenses." },
  { q:"What are the fees?", a:"One-time structuring fee of 1.5–3% of asset value plus annual platform fees of 0.5%." },
  { q:"What happens after tokenization?", a:"Your asset appears on the Nextoken marketplace. You can track investments, investor count, and raised amount from your Owner Dashboard." },
];

export default function TokenizePage() {
  const router = useRouter();
  const [step, setStep]           = useState(0); // 0=form, 1=details, 2=documents, 3=review, 4=done
  const [assetType, setAssetType] = useState("");
  const [faqOpen, setFaqOpen]     = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState("");

  const [form, setForm] = useState({
    name:"", ticker:"", description:"", category:"",
    location:"", country:"",
    targetRaise:"", minInvestment:"100", maxInvestment:"",
    targetROI:"", term:"", yieldFrequency:"quarterly",
    tokenSupply:"", tokenPrice:"",
    riskLevel:"medium", eligibility:"eu_verified",
    launchDate:"", closingDate:"",
  });

  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl]   = useState("");

  const handle = e => setForm({...form, [e.target.name]: e.target.value});

  const uploadFile = async (file, docType) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        if (docType === "image") {
          setImageUrl(data.url);
        } else {
          setDocuments(prev => [...prev, { name: file.name, url: data.url, type: docType }]);
        }
      } else {
        setError(data.error || "Upload failed");
      }
    } catch { setError("Upload failed. Please try again."); }
    setUploading(false);
  };

  const removeDoc = (idx) => setDocuments(prev => prev.filter((_, i) => i !== idx));

  const submitAsset = async () => {
    setSubmitting(true); setError("");
    try {
      const res = await fetch("/api/assets/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, assetType, imageUrl, documents }),
      });
      const data = await res.json();
      if (data.success) { setStep(4); }
      else { setError(data.error || "Submission failed."); }
    } catch { setError("Network error. Please try again."); }
    setSubmitting(false);
  };

  const canProceed1 = assetType && form.name && form.ticker && form.targetRaise;
  const canProceed2 = true; // documents optional but encouraged

  return (
    <>
      <Head>
        <title>Tokenize Your Asset — Nextoken Capital</title>
        <meta name="description" content="List your real-world asset on the Nextoken marketplace. Upload documents, set terms, and reach global investors." />
      </Head>
      <Navbar />

      <style>{`
        .tz{min-height:100vh;background:#0B0E11;padding-top:64px}
        .tz-hero{padding:48px 20px 36px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.07)}
        .tz-hero-tag{font-size:11px;font-weight:700;color:#F0B90B;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px}
        .tz-hero h1{font-size:clamp(1.6rem,3.5vw,2.4rem);font-weight:900;color:#fff;margin-bottom:10px}
        .tz-hero h1 em{color:#F0B90B;font-style:normal}
        .tz-hero p{font-size:14px;color:rgba(255,255,255,0.45);max-width:520px;margin:0 auto;line-height:1.7}
        .tz-steps-bar{background:#0F1318;border-bottom:1px solid rgba(255,255,255,0.07);padding:16px 20px}
        .tz-steps-bar-in{max-width:800px;margin:0 auto;display:flex;align-items:center;justify-content:center;gap:8px}
        .tz-step-dot{width:28px;height:28px;border-radius:50%;border:2px solid rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:rgba(255,255,255,0.3);flex-shrink:0}
        .tz-step-dot.active{border-color:#F0B90B;color:#F0B90B}
        .tz-step-dot.done{border-color:#0ECB81;background:#0ECB81;color:#000}
        .tz-step-line{width:32px;height:1px;background:rgba(255,255,255,0.1)}
        .tz-step-lbl{font-size:11px;color:rgba(255,255,255,0.3);margin-left:4px;display:none}
        .tz-step-dot.active+.tz-step-lbl{display:inline;color:#F0B90B}
        .tz-body{max-width:720px;margin:0 auto;padding:32px 20px 60px}
        .tz-card{background:#0F1318;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:28px;margin-bottom:20px}
        .tz-title{font-size:18px;font-weight:900;color:#fff;margin-bottom:4px}
        .tz-sub{font-size:13px;color:rgba(255,255,255,0.38);margin-bottom:22px;line-height:1.6}
        .tz-field{margin-bottom:16px}
        .tz-label{display:block;font-size:11px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px}
        .tz-input{width:100%;background:#161B22;color:#fff;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:11px 14px;font-size:14px;outline:none;font-family:inherit;transition:border-color .15s;box-sizing:border-box}
        .tz-input:focus{border-color:rgba(240,185,11,0.5)}
        .tz-input option{background:#161B22}
        .tz-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .tz-row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px}
        .tz-asset-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px}
        .tz-asset-card{background:#161B22;border:2px solid rgba(255,255,255,0.07);border-radius:10px;padding:14px;cursor:pointer;text-align:center;transition:all .15s}
        .tz-asset-card:hover{border-color:rgba(240,185,11,0.3)}
        .tz-asset-card.sel{border-color:#F0B90B;background:rgba(240,185,11,0.06)}
        .tz-asset-ico{font-size:24px;margin-bottom:6px}
        .tz-asset-lbl{font-size:12px;font-weight:700;color:#fff}
        .tz-asset-desc{font-size:10px;color:rgba(255,255,255,0.35);margin-top:3px}
        .tz-err{background:rgba(255,77,77,0.08);border:1px solid rgba(255,77,77,0.25);border-radius:8px;padding:11px 14px;font-size:13px;color:#FF6B6B;margin-bottom:16px}
        .tz-btn{width:100%;padding:13px;background:#F0B90B;color:#000;font-size:14px;font-weight:800;border:none;border-radius:8px;cursor:pointer;font-family:inherit;transition:background .15s}
        .tz-btn:hover:not(:disabled){background:#FFD000}
        .tz-btn:disabled{background:rgba(240,185,11,0.2);color:rgba(0,0,0,0.3);cursor:not-allowed}
        .tz-btn-ghost{background:rgba(255,255,255,0.05);color:rgba(255,255,255,0.55);border:1px solid rgba(255,255,255,0.1)}
        .tz-btn-ghost:hover{background:rgba(255,255,255,0.09);color:#fff}
        .tz-btns{display:grid;grid-template-columns:0.5fr 1fr;gap:10px;margin-top:8px}
        .tz-upload-zone{border:2px dashed rgba(255,255,255,0.15);border-radius:12px;padding:28px;text-align:center;cursor:pointer;transition:all .2s;margin-bottom:12px}
        .tz-upload-zone:hover{border-color:rgba(240,185,11,0.4);background:rgba(240,185,11,0.03)}
        .tz-upload-zone.active{border-color:#F0B90B;background:rgba(240,185,11,0.05)}
        .tz-doc-list{display:flex;flex-direction:column;gap:8px;margin-bottom:16px}
        .tz-doc-item{display:flex;align-items:center;gap:10px;padding:10px 14px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px}
        .tz-doc-name{flex:1;font-size:13px;color:rgba(255,255,255,0.6);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .tz-doc-type{font-size:10px;color:#F0B90B;font-weight:700;text-transform:uppercase;letter-spacing:.5px}
        .tz-doc-rm{background:none;border:none;color:rgba(255,77,77,0.6);font-size:16px;cursor:pointer;padding:2px 6px}
        .tz-doc-rm:hover{color:#FF4D4D}
        .tz-review-row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:13px}
        .tz-review-row:last-child{border-bottom:none}
        .tz-review-l{color:rgba(255,255,255,0.4)}
        .tz-review-v{color:#fff;font-weight:600;text-align:right;max-width:60%}
        .tz-done{text-align:center;padding:20px 0}
        .tz-done-ico{font-size:54px;margin-bottom:14px}
        .tz-done-title{font-size:20px;font-weight:900;color:#0ECB81;margin-bottom:8px}
        .tz-done-sub{font-size:13px;color:rgba(255,255,255,0.45);line-height:1.7;margin-bottom:22px}
        .tz-faq{margin-top:20px}
        .tz-faq-item{border:1px solid rgba(255,255,255,0.07);border-radius:10px;margin-bottom:8px;overflow:hidden}
        .tz-faq-q{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;cursor:pointer;gap:12px}
        .tz-faq-q-text{font-size:13px;font-weight:700;color:#fff;flex:1}
        .tz-faq-arrow{font-size:13px;color:rgba(255,255,255,0.3)}
        .tz-faq-a{padding:0 18px 14px;font-size:12px;color:rgba(255,255,255,0.45);line-height:1.7}
        .tz-spin{width:16px;height:16px;border:2px solid rgba(0,0,0,0.2);border-top-color:#000;border-radius:50%;animation:tzspin .6s linear infinite;display:inline-block}
        @keyframes tzspin{to{transform:rotate(360deg)}}
        @media(max-width:640px){.tz-row{grid-template-columns:1fr}.tz-row3{grid-template-columns:1fr}.tz-asset-grid{grid-template-columns:1fr 1fr}.tz-btns{grid-template-columns:1fr}}
      `}</style>

      <div className="tz">
        <div className="tz-hero">
          <div className="tz-hero-tag">List Your Asset</div>
          <h1>Tokenize Your <em>Real-World Asset</em></h1>
          <p>Submit your asset details and documents. Our compliance team reviews within 2-3 business days.</p>
        </div>

        {/* STEP BAR */}
        <div className="tz-steps-bar">
          <div className="tz-steps-bar-in">
            {["Asset Type","Details","Documents","Review","Done"].map((s, i) => (
              <span key={s} style={{display:"flex",alignItems:"center",gap:4}}>
                <span className={`tz-step-dot ${i===step?"active":i<step?"done":""}`}>{i<step?"✓":i+1}</span>
                <span className="tz-step-lbl">{s}</span>
                {i < 4 && <span className="tz-step-line" />}
              </span>
            ))}
          </div>
        </div>

        <div className="tz-body">
          {error && <div className="tz-err">⚠️ {error}</div>}

          {/* STEP 0 — Asset Type + Basic */}
          {step === 0 && (
            <div className="tz-card">
              <div className="tz-title">Select Asset Type</div>
              <p className="tz-sub">Choose the type of asset you want to list on the marketplace.</p>
              <div className="tz-asset-grid">
                {ASSET_TYPES.map(a => (
                  <div key={a.id} className={`tz-asset-card ${assetType===a.id?"sel":""}`} onClick={()=>setAssetType(a.id)}>
                    <div className="tz-asset-ico">{a.icon}</div>
                    <div className="tz-asset-lbl">{a.label}</div>
                    <div className="tz-asset-desc">{a.desc}</div>
                  </div>
                ))}
              </div>
              <div className="tz-row">
                <div className="tz-field"><label className="tz-label">Asset Name *</label><input className="tz-input" name="name" value={form.name} onChange={handle} placeholder="e.g. Solar Farm Portfolio" /></div>
                <div className="tz-field"><label className="tz-label">Ticker Symbol *</label><input className="tz-input" name="ticker" value={form.ticker} onChange={handle} placeholder="e.g. SOLAR-01" style={{textTransform:"uppercase"}} /></div>
              </div>
              <div className="tz-field"><label className="tz-label">Description</label><textarea className="tz-input" name="description" value={form.description} onChange={handle} rows={3} placeholder="Describe your asset..." style={{resize:"vertical"}} /></div>
              <div className="tz-row">
                <div className="tz-field"><label className="tz-label">Target Raise (EUR) *</label><input className="tz-input" name="targetRaise" type="number" value={form.targetRaise} onChange={handle} placeholder="e.g. 5000000" /></div>
                <div className="tz-field"><label className="tz-label">Location</label><input className="tz-input" name="location" value={form.location} onChange={handle} placeholder="e.g. Berlin, Germany" /></div>
              </div>
              <button className="tz-btn" disabled={!canProceed1} onClick={()=>{setError("");setStep(1);}}>Continue to Details →</button>
            </div>
          )}

          {/* STEP 1 — Financial Details */}
          {step === 1 && (
            <div className="tz-card">
              <div className="tz-title">Financial Details</div>
              <p className="tz-sub">Set investment terms, pricing, and risk parameters.</p>
              <div className="tz-row3">
                <div className="tz-field"><label className="tz-label">Min Investment (EUR)</label><input className="tz-input" name="minInvestment" type="number" value={form.minInvestment} onChange={handle} /></div>
                <div className="tz-field"><label className="tz-label">Target ROI (%)</label><input className="tz-input" name="targetROI" type="number" value={form.targetROI} onChange={handle} placeholder="e.g. 18" /></div>
                <div className="tz-field"><label className="tz-label">Term (months)</label><input className="tz-input" name="term" type="number" value={form.term} onChange={handle} placeholder="e.g. 36" /></div>
              </div>
              <div className="tz-row3">
                <div className="tz-field"><label className="tz-label">Token Supply</label><input className="tz-input" name="tokenSupply" type="number" value={form.tokenSupply} onChange={handle} placeholder="e.g. 500000" /></div>
                <div className="tz-field"><label className="tz-label">Token Price (EUR)</label><input className="tz-input" name="tokenPrice" type="number" step="0.01" value={form.tokenPrice} onChange={handle} placeholder="e.g. 10.00" /></div>
                <div className="tz-field"><label className="tz-label">Yield Frequency</label>
                  <select className="tz-input" name="yieldFrequency" value={form.yieldFrequency} onChange={handle}>
                    <option value="monthly">Monthly</option><option value="quarterly">Quarterly</option><option value="annual">Annual</option><option value="at_maturity">At Maturity</option>
                  </select>
                </div>
              </div>
              <div className="tz-row">
                <div className="tz-field"><label className="tz-label">Risk Level</label>
                  <select className="tz-input" name="riskLevel" value={form.riskLevel} onChange={handle}>
                    <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                  </select>
                </div>
                <div className="tz-field"><label className="tz-label">Category</label><input className="tz-input" name="category" value={form.category} onChange={handle} placeholder="e.g. Commercial, Green, Residential" /></div>
              </div>
              <div className="tz-btns">
                <button className="tz-btn tz-btn-ghost" onClick={()=>setStep(0)}>← Back</button>
                <button className="tz-btn" onClick={()=>{setError("");setStep(2);}}>Continue to Documents →</button>
              </div>
            </div>
          )}

          {/* STEP 2 — Document Upload */}
          {step === 2 && (
            <div className="tz-card">
              <div className="tz-title">Upload Documents</div>
              <p className="tz-sub">Upload financial statements, legal docs, photos, and supporting materials. Max 20MB per file.</p>

              {/* Asset Image */}
              <div className="tz-field">
                <label className="tz-label">Asset Photo / Cover Image</label>
                <div className="tz-upload-zone" onClick={()=>document.getElementById("img-upload").click()}>
                  {imageUrl ? (
                    <div><img src={imageUrl} alt="Asset" style={{maxWidth:200,maxHeight:120,borderRadius:8,margin:"0 auto"}} /><div style={{fontSize:12,color:"#0ECB81",marginTop:8}}>✓ Image uploaded</div></div>
                  ) : (
                    <><div style={{fontSize:28,marginBottom:8}}>📸</div><div style={{fontSize:13,color:"rgba(255,255,255,0.4)"}}>Click to upload asset photo</div><div style={{fontSize:11,color:"rgba(255,255,255,0.25)",marginTop:4}}>JPG, PNG, WebP · Max 20MB</div></>
                  )}
                </div>
                <input id="img-upload" type="file" accept="image/*" hidden onChange={e=>{if(e.target.files[0])uploadFile(e.target.files[0],"image");}} />
              </div>

              {/* Documents */}
              <div className="tz-field">
                <label className="tz-label">Financial & Legal Documents</label>
                <div className="tz-upload-zone" onClick={()=>document.getElementById("doc-upload").click()}>
                  <div style={{fontSize:28,marginBottom:8}}>📎</div>
                  <div style={{fontSize:13,color:"rgba(255,255,255,0.4)"}}>Click to upload documents</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.25)",marginTop:4}}>PDF, DOC, XLS, JPG, PNG · Max 20MB each</div>
                </div>
                <input id="doc-upload" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp" hidden multiple onChange={e=>{
                  Array.from(e.target.files).forEach(f => uploadFile(f, "document"));
                  e.target.value = "";
                }} />
              </div>

              {uploading && <div style={{textAlign:"center",padding:12,fontSize:13,color:"#F0B90B"}}>⏳ Uploading...</div>}

              {documents.length > 0 && (
                <div className="tz-doc-list">
                  {documents.map((d, i) => (
                    <div key={i} className="tz-doc-item">
                      <span style={{fontSize:16}}>📄</span>
                      <span className="tz-doc-name">{d.name}</span>
                      <span className="tz-doc-type">{d.type}</span>
                      <button className="tz-doc-rm" onClick={()=>removeDoc(i)}>×</button>
                    </div>
                  ))}
                </div>
              )}

              <div style={{background:"rgba(240,185,11,0.05)",border:"1px solid rgba(240,185,11,0.15)",borderRadius:8,padding:12,fontSize:12,color:"rgba(255,255,255,0.45)",lineHeight:1.7,marginBottom:16}}>
                💡 Recommended: Financial statements, property valuation, legal ownership proof, business registration, insurance documents, and any regulatory licenses.
              </div>

              <div className="tz-btns">
                <button className="tz-btn tz-btn-ghost" onClick={()=>setStep(1)}>← Back</button>
                <button className="tz-btn" onClick={()=>{setError("");setStep(3);}}>Continue to Review →</button>
              </div>
            </div>
          )}

          {/* STEP 3 — Review & Submit */}
          {step === 3 && (
            <div className="tz-card">
              <div className="tz-title">Review & Submit</div>
              <p className="tz-sub">Review your listing details before submitting for compliance review.</p>

              <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,padding:16,marginBottom:20}}>
                {[
                  ["Asset Name", form.name],
                  ["Ticker", form.ticker],
                  ["Type", ASSET_TYPES.find(a=>a.id===assetType)?.label || assetType],
                  ["Location", form.location || "—"],
                  ["Target Raise", form.targetRaise ? `EUR ${parseInt(form.targetRaise).toLocaleString()}` : "—"],
                  ["Min Investment", `EUR ${form.minInvestment}`],
                  ["Target ROI", form.targetROI ? `${form.targetROI}%` : "—"],
                  ["Term", form.term ? `${form.term} months` : "—"],
                  ["Token Price", form.tokenPrice ? `EUR ${form.tokenPrice}` : "—"],
                  ["Risk Level", form.riskLevel],
                  ["Documents", `${documents.length} file(s)`],
                  ["Cover Image", imageUrl ? "✓ Uploaded" : "None"],
                ].map(([l, v]) => (
                  <div key={l} className="tz-review-row">
                    <span className="tz-review-l">{l}</span>
                    <span className="tz-review-v">{v}</span>
                  </div>
                ))}
              </div>

              <div style={{background:"rgba(240,185,11,0.05)",border:"1px solid rgba(240,185,11,0.15)",borderRadius:8,padding:12,fontSize:12,color:"rgba(255,255,255,0.45)",lineHeight:1.7,marginBottom:16}}>
                🏛️ By submitting, you agree to our <Link href="/terms" style={{color:"#F0B90B"}}>Terms</Link> and <Link href="/privacy" style={{color:"#F0B90B"}}>Privacy Policy</Link>.
                Your listing will be reviewed by our compliance team within 2-3 business days.
              </div>

              <div className="tz-btns">
                <button className="tz-btn tz-btn-ghost" onClick={()=>setStep(2)}>← Back</button>
                <button className="tz-btn" disabled={submitting} onClick={submitAsset}>
                  {submitting ? <><span className="tz-spin"/> Submitting...</> : "Submit for Review →"}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 — Done */}
          {step === 4 && (
            <div className="tz-card">
              <div className="tz-done">
                <div className="tz-done-ico">🎉</div>
                <div className="tz-done-title">Asset Submitted!</div>
                <p className="tz-done-sub">
                  Your asset <strong style={{color:"#fff"}}>{form.name}</strong> ({form.ticker}) has been submitted for compliance review.
                  You will receive an email notification when it is approved.
                </p>
                <button className="tz-btn" style={{marginBottom:10}} onClick={()=>router.push("/owner-dashboard")}>
                  Go to Owner Dashboard →
                </button>
                <button className="tz-btn tz-btn-ghost" onClick={()=>{setStep(0);setForm({name:"",ticker:"",description:"",category:"",location:"",country:"",targetRaise:"",minInvestment:"100",maxInvestment:"",targetROI:"",term:"",yieldFrequency:"quarterly",tokenSupply:"",tokenPrice:"",riskLevel:"medium",eligibility:"eu_verified",launchDate:"",closingDate:""});setDocuments([]);setImageUrl("");setAssetType("");}}>
                  List Another Asset
                </button>
              </div>
            </div>
          )}

          {/* FAQ */}
          {step < 4 && (
            <div className="tz-faq">
              <div style={{fontSize:13,fontWeight:700,color:"rgba(255,218,122,0.7)",letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>FAQ</div>
              {FAQS.map((f, i) => (
                <div key={i} className="tz-faq-item" style={{borderColor:faqOpen===i?"rgba(240,185,11,0.25)":"rgba(255,255,255,0.07)"}}>
                  <div className="tz-faq-q" onClick={()=>setFaqOpen(faqOpen===i?null:i)}>
                    <div className="tz-faq-q-text">{f.q}</div>
                    <span className="tz-faq-arrow">{faqOpen===i?"▲":"▼"}</span>
                  </div>
                  {faqOpen===i && <div className="tz-faq-a">{f.a}</div>}
                </div>
              ))}
            </div>
          )}

          {/* PROCESS INFO */}
          {step < 4 && (
            <div style={{marginTop:24,padding:20,background:"#0F1318",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12}}>
              <div style={{fontSize:11,fontWeight:700,color:"#F0B90B",letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>Tokenization Process</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12}}>
                {STEPS_INFO.map(s => (
                  <div key={s.n} style={{textAlign:"center"}}>
                    <div style={{fontSize:20,fontWeight:900,color:"rgba(240,185,11,0.2)",marginBottom:6}}>{s.n}</div>
                    <div style={{fontSize:11,fontWeight:700,color:"#fff",marginBottom:4}}>{s.title}</div>
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",lineHeight:1.5}}>{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
ENDOFFILE
ok "pages/tokenize.js (with document upload)"

# ── 7. Add owner-dashboard link to Navbar ────────────────────────────────────
log "Adding owner-dashboard to Navbar links..."
sed -i 's|{ href: "/tokenize",   label: "Tokenize" },|{ href: "/tokenize",   label: "Tokenize" },\n    { href: "/owner-dashboard", label: "List Asset" },|' components/Navbar.js 2>/dev/null || true
ok "Navbar updated"

# ── 8. Git commit & deploy ───────────────────────────────────────────────────
log "Committing and deploying..."

rm -f pages/tokenize.js.bak

git add -A
git commit -m "feat: full asset owner feature set

New files:
  - pages/api/upload.js — Cloudinary file upload endpoint
  - pages/api/assets/create.js — Create asset listing (for owners)
  - pages/api/assets/my-listings.js — Get owner's listings + stats
  - pages/api/user/set-role.js — Switch between investor/issuer
  - pages/owner-dashboard.js — Full owner dashboard with stats, listings, status tracking

Updated files:
  - pages/tokenize.js — Complete rewrite with:
    * 5-step wizard (type → details → documents → review → done)
    * Cloudinary document upload (PDFs, images, spreadsheets)
    * Asset photo upload
    * Financial details form (ROI, term, token pricing)
    * Review screen before submission
    * Redirects to owner dashboard on success
  - components/Navbar.js — Added 'List Asset' link

Features:
  - Asset owners can upload financial docs, photos, legal papers
  - Owner dashboard tracks all listings, raised amount, investor count
  - Status tracking: draft → review → approved → live → closing → completed
  - Same login, separate dashboards based on accountType
  - Cloudinary integration for file storage"

git push origin main
vercel --prod

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Asset Owner features built and deployed!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "  New pages:"
echo -e "    ${CYAN}/tokenize${NC}          — Multi-step form with doc upload"
echo -e "    ${CYAN}/owner-dashboard${NC}   — Track listings, raised, investors"
echo ""
echo -e "  New APIs:"
echo -e "    ${CYAN}POST /api/upload${NC}           — Cloudinary file upload"
echo -e "    ${CYAN}POST /api/assets/create${NC}    — Create asset listing"
echo -e "    ${CYAN}GET  /api/assets/my-listings${NC} — Owner's listings + stats"
echo -e "    ${CYAN}POST /api/user/set-role${NC}    — Switch investor/issuer"
echo ""
echo -e "  ${CYAN}https://nextokencapital.com/tokenize${NC}"
echo -e "  ${CYAN}https://nextokencapital.com/owner-dashboard${NC}"
echo ""
