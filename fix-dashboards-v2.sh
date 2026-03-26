#!/bin/bash
# PHASE 1: Registration + Investor + Issuer Dashboards
# Run: chmod +x fix-dashboards-v2.sh && ./fix-dashboards-v2.sh
set -e

echo "  🚀 Building Investor + Issuer system..."

# ═══════════════════════════════════════
# 1. Wallet Model
# ═══════════════════════════════════════
cat > models/Wallet.js << 'EOF'
import mongoose from "mongoose";
const WalletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  availableBalance: { type: Number, default: 0 },
  lockedBalance: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  currency: { type: String, default: "EUR" },
  walletAddress: { type: String },
  transactions: [{
    type: { type: String, enum: ["deposit","withdrawal","buy","sell","profit_distribution","fee","refund"] },
    amount: { type: Number },
    assetId: { type: String },
    assetName: { type: String },
    txHash: { type: String },
    status: { type: String, enum: ["pending","completed","failed","cancelled"], default: "pending" },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });
export default mongoose.models.Wallet || mongoose.model("Wallet", WalletSchema);
EOF

# ═══════════════════════════════════════
# 2. Investment Model
# ═══════════════════════════════════════
cat > models/Investment.js << 'EOF'
import mongoose from "mongoose";
const InvestmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
  assetName: { type: String },
  assetType: { type: String },
  units: { type: Number, required: true },
  pricePerUnit: { type: Number, required: true },
  totalInvested: { type: Number, required: true },
  currentValue: { type: Number },
  yieldRate: { type: Number },
  maturityDate: { type: Date },
  status: { type: String, enum: ["active","matured","sold","pending"], default: "active" },
  txHash: { type: String },
  earnings: [{ amount: Number, date: Date, txHash: String, type: { type: String, default: "yield" } }],
}, { timestamps: true });
export default mongoose.models.Investment || mongoose.model("Investment", InvestmentSchema);
EOF

# ═══════════════════════════════════════
# 3. Order Model (Buy/Sell)
# ═══════════════════════════════════════
cat > models/Order.js << 'EOF'
import mongoose from "mongoose";
const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
  assetName: { type: String },
  type: { type: String, enum: ["buy","sell"], required: true },
  units: { type: Number, required: true },
  pricePerUnit: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  fee: { type: Number, default: 0 },
  status: { type: String, enum: ["pending","processing","completed","failed","cancelled"], default: "pending" },
  txHash: { type: String },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
EOF

# ═══════════════════════════════════════
# 4. Distribution Model
# ═══════════════════════════════════════
cat > models/Distribution.js << 'EOF'
import mongoose from "mongoose";
const DistributionSchema = new mongoose.Schema({
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
  assetName: { type: String },
  issuerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  totalProfit: { type: Number, required: true },
  currency: { type: String, default: "EUR" },
  proofDocUrl: { type: String },
  status: { type: String, enum: ["pending","compliance_approved","finance_approved","admin_approved","distributed","rejected"], default: "pending" },
  distributions: [{
    investorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    investorName: String,
    unitsOwned: Number,
    sharePercent: Number,
    amount: Number,
    txHash: String,
    status: { type: String, default: "pending" },
  }],
  approvals: [{
    by: String, byName: String, byRole: String, action: String, at: { type: Date, default: Date.now },
  }],
}, { timestamps: true });
export default mongoose.models.Distribution || mongoose.model("Distribution", DistributionSchema);
EOF

echo "  ✓ Models: Wallet, Investment, Order, Distribution"

# ═══════════════════════════════════════
# 5. Wallet API
# ═══════════════════════════════════════
mkdir -p pages/api/wallet
cat > pages/api/wallet/index.js << 'EOF'
import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import Wallet from "../../../models/Wallet";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).json({ error: "Not authenticated" });
  const user = await User.findOne({ email: session.user.email });
  if (!user) return res.status(404).json({ error: "User not found" });

  let wallet = await Wallet.findOne({ userId: user._id });
  if (!wallet) wallet = await Wallet.create({ userId: user._id });

  if (req.method === "GET") {
    return res.json({ wallet: { available: wallet.availableBalance, locked: wallet.lockedBalance, earnings: wallet.totalEarnings, currency: wallet.currency, address: wallet.walletAddress, transactions: wallet.transactions.slice(-20).reverse() } });
  }
  return res.status(405).json({ error: "Method not allowed" });
}
EOF

# ═══════════════════════════════════════
# 6. Investments API
# ═══════════════════════════════════════
mkdir -p pages/api/investments
cat > pages/api/investments/my.js << 'EOF'
import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import Investment from "../../../models/Investment";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).json({ error: "Not authenticated" });
  const user = await User.findOne({ email: session.user.email });
  if (!user) return res.status(404).json({ error: "User not found" });

  if (req.method === "GET") {
    const investments = await Investment.find({ userId: user._id }).sort({ createdAt: -1 }).lean();
    const totalInvested = investments.reduce((s, i) => s + i.totalInvested, 0);
    const totalEarnings = investments.reduce((s, i) => s + i.earnings.reduce((es, e) => es + e.amount, 0), 0);
    const active = investments.filter(i => i.status === "active").length;
    return res.json({ investments, stats: { totalInvested, totalEarnings, active, total: investments.length } });
  }
  return res.status(405).json({ error: "Method not allowed" });
}
EOF

# ═══════════════════════════════════════
# 7. Orders API
# ═══════════════════════════════════════
cat > pages/api/investments/orders.js << 'EOF'
import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import Order from "../../../models/Order";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).json({ error: "Not authenticated" });
  const user = await User.findOne({ email: session.user.email });
  if (!user) return res.status(404).json({ error: "User not found" });

  if (req.method === "GET") {
    const orders = await Order.find({ userId: user._id }).sort({ createdAt: -1 }).lean();
    return res.json({ orders });
  }
  return res.status(405).json({ error: "Method not allowed" });
}
EOF

# ═══════════════════════════════════════
# 8. Issuer Stats API
# ═══════════════════════════════════════
mkdir -p pages/api/issuer
cat > pages/api/issuer/stats.js << 'EOF'
import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import Asset from "../../../lib/models/Asset";
import Investment from "../../../models/Investment";
import Distribution from "../../../models/Distribution";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).json({ error: "Not authenticated" });
  const user = await User.findOne({ email: session.user.email });
  if (!user) return res.status(404).json({ error: "User not found" });
  if (user.role !== "issuer") return res.status(403).json({ error: "Issuer access only" });

  const assets = await Asset.find({ issuerId: user._id }).lean();
  const assetIds = assets.map(a => a._id);
  const investments = await Investment.find({ assetId: { $in: assetIds } }).lean();
  const distributions = await Distribution.find({ issuerId: user._id }).lean();

  const totalRaised = investments.reduce((s, i) => s + i.totalInvested, 0);
  const totalInvestors = [...new Set(investments.map(i => i.userId.toString()))].length;
  const totalDistributed = distributions.filter(d => d.status === "distributed").reduce((s, d) => s + d.totalProfit, 0);

  return res.json({
    assets, investments, distributions,
    stats: {
      totalAssets: assets.length,
      liveAssets: assets.filter(a => a.status === "live").length,
      totalRaised, totalInvestors, totalDistributed,
      pendingDistributions: distributions.filter(d => d.status !== "distributed" && d.status !== "rejected").length,
    }
  });
}
EOF

echo "  ✓ APIs: Wallet, Investments, Orders, Issuer Stats"

# ═══════════════════════════════════════
# 9. Updated Register Page with Role Selector
# ═══════════════════════════════════════
# We need to update the register page to add investor/issuer choice
# First check what's there and patch it
sed -i "s|role: 'investor'|role: form.role || 'investor'|" pages/api/auth/register.js

# Add role field to register form - insert after password field
# We'll add a simple patch to the registration form
cat > /tmp/role-patch.js << 'PATCHEOF'
const fs = require("fs");
let content = fs.readFileSync("pages/register.js", "utf8");

// Add role to form state if not present
if (!content.includes("role:")) {
  content = content.replace(
    /const \[form, setForm\] = useState\(\{/,
    'const [form, setForm] = useState({ role: "investor",'
  );
}

// Add role selector UI if not present
if (!content.includes("I want to")) {
  // Find the email field and add role selector before it
  const emailFieldIndex = content.indexOf("EMAIL");
  if (emailFieldIndex === -1) {
    // Try another approach - add before the first form field
    content = content.replace(
      /<div style=\{\{marginBottom:16\}\}>\s*<label[^>]*>FIRST NAME/,
      `<div style={{marginBottom:16}}>
              <label style={{display:"block",fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.4)",marginBottom:6}}>I WANT TO</label>
              <div style={{display:"flex",gap:10}}>
                <button type="button" onClick={()=>setForm({...form,role:"investor"})} style={{flex:1,padding:"12px",borderRadius:8,cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:700,background:form.role==="investor"?"rgba(240,185,11,0.12)":"#161B22",color:form.role==="investor"?"#F0B90B":"rgba(255,255,255,0.4)",border:form.role==="investor"?"2px solid #F0B90B":"2px solid rgba(255,255,255,0.08)"}}>💰 Invest in Assets</button>
                <button type="button" onClick={()=>setForm({...form,role:"issuer"})} style={{flex:1,padding:"12px",borderRadius:8,cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:700,background:form.role==="issuer"?"rgba(139,92,246,0.12)":"#161B22",color:form.role==="issuer"?"#8b5cf6":"rgba(255,255,255,0.4)",border:form.role==="issuer"?"2px solid #8b5cf6":"2px solid rgba(255,255,255,0.08)"}}>🏗️ Tokenize Assets</button>
              </div>
            </div>
            <div style={{marginBottom:16}}>
              <label style={{display:"block",fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.4)",marginBottom:6}}>FIRST NAME`
    );
  }
}

// Update the API call to include role
if (!content.includes("role: form.role")) {
  content = content.replace(
    /body: JSON\.stringify\(\{[\s\S]*?email: form\.email/,
    (match) => match.replace("email: form.email", "role: form.role, email: form.email")
  );
}

// Update redirect after registration based on role
content = content.replace(
  /router\.push\("\/dashboard"\)/g,
  'router.push(form.role === "issuer" ? "/issuer-dashboard" : "/dashboard")'
);

fs.writeFileSync("pages/register.js", content);
console.log("Register page patched with role selector");
PATCHEOF

node /tmp/role-patch.js

echo "  ✓ Register page with Investor/Issuer selector"

# ═══════════════════════════════════════
# 10. INVESTOR DASHBOARD (Complete Rebuild)
# ═══════════════════════════════════════
cat > pages/dashboard.js << 'EOF'
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSession, signOut } from "next-auth/react";
import Navbar from "../components/Navbar";

const TABS = ["portfolio","bonds","orders","earnings","wallet","kyc"];
const TAB_LABELS = { portfolio:"📊 Portfolio", bonds:"🏦 My Investments", orders:"🔄 Buy / Sell", earnings:"💰 Earnings", wallet:"👛 Wallet", kyc:"🧾 KYC" };

export default function InvestorDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [tab, setTab] = useState("portfolio");
  const [wallet, setWallet] = useState(null);
  const [investments, setInvestments] = useState({ investments: [], stats: {} });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") loadAll();
  }, [status]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [w, inv, ord, me] = await Promise.all([
        fetch("/api/wallet").then(r => r.json()).catch(() => ({})),
        fetch("/api/investments/my").then(r => r.json()).catch(() => ({ investments: [], stats: {} })),
        fetch("/api/investments/orders").then(r => r.json()).catch(() => ({ orders: [] })),
        fetch("/api/user/me").then(r => r.json()).catch(() => ({})),
      ]);
      if (w.wallet) setWallet(w.wallet);
      setInvestments(inv);
      setOrders(ord.orders || []);
      if (me.user) setUser(me.user);
    } catch(e) {} finally { setLoading(false); }
  };

  const st = investments.stats || {};
  const totalEarnings = investments.investments?.reduce((s, i) => s + (i.earnings?.reduce((es, e) => es + e.amount, 0) || 0), 0) || 0;

  const card = (l, v, c) => (
    <div style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:"18px 22px", flex:1, minWidth:140 }}>
      <div style={{ fontSize:26, fontWeight:800, color:c }}>{v}</div>
      <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:4 }}>{l}</div>
    </div>
  );

  const statusBadge = (s) => {
    const colors = { active:"#22c55e", matured:"#3b82f6", sold:"#f59e0b", pending:"#8b5cf6", completed:"#22c55e", failed:"#ef4444", cancelled:"#6b7280", processing:"#f59e0b" };
    return <span style={{ fontSize:10, padding:"2px 8px", borderRadius:4, background:(colors[s]||"#666")+"15", color:colors[s]||"#666", fontWeight:700 }}>{s}</span>;
  };

  if (status === "loading" || loading) return <div style={{ minHeight:"100vh", background:"#0B0E11", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff" }}>Loading...</div>;

  return (
    <>
      <Head><title>Investor Dashboard — Nextoken Capital</title></Head>
      <Navbar />
      <div style={{ minHeight:"100vh", background:"#0B0E11", color:"#fff", paddingTop:70 }}>
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"28px 20px" }}>
          {/* Header */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
            <div>
              <h1 style={{ fontSize:24, fontWeight:800, marginBottom:4 }}>Investor Dashboard</h1>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.4)" }}>Welcome, {session?.user?.name || user?.firstName || "Investor"}</p>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => router.push("/change-password")} style={{ padding:"8px 16px", borderRadius:7, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.5)", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>Change Password</button>
              <button onClick={() => signOut({ callbackUrl:"/login" })} style={{ padding:"8px 16px", borderRadius:7, background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.15)", color:"#ef4444", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>Sign Out</button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display:"flex", gap:4, marginBottom:24, overflowX:"auto", paddingBottom:8 }}>
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding:"8px 18px", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap", background: tab===t ? "#F0B90B15" : "rgba(255,255,255,0.04)", color: tab===t ? "#F0B90B" : "rgba(255,255,255,0.4)", border: tab===t ? "1px solid #F0B90B30" : "1px solid rgba(255,255,255,0.06)" }}>
                {TAB_LABELS[t]}
              </button>
            ))}
          </div>

          {/* ═══ PORTFOLIO TAB ═══ */}
          {tab === "portfolio" && (
            <>
              <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap" }}>
                {card("Total Invested", "EUR " + (st.totalInvested || 0).toLocaleString(), "#3b82f6")}
                {card("Active Investments", st.active || 0, "#22c55e")}
                {card("Total Earnings", "EUR " + totalEarnings.toLocaleString(), "#F0B90B")}
                {card("Wallet Balance", "EUR " + (wallet?.available || 0).toLocaleString(), "#8b5cf6")}
              </div>
              <h3 style={{ fontSize:15, fontWeight:700, marginBottom:12 }}>Asset Allocation</h3>
              <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", padding:20 }}>
                {investments.investments?.length === 0 ? (
                  <div style={{ textAlign:"center", color:"rgba(255,255,255,0.3)", padding:20 }}>
                    No investments yet. <button onClick={() => router.push("/markets")} style={{ background:"none", border:"none", color:"#F0B90B", cursor:"pointer", fontFamily:"inherit" }}>Browse assets →</button>
                  </div>
                ) : investments.investments?.map((inv, i) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"12px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                    <div>
                      <div style={{ fontSize:14, fontWeight:600 }}>{inv.assetName}</div>
                      <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)" }}>{inv.assetType} · {inv.units} units</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:14, fontWeight:700, color:"#F0B90B" }}>EUR {inv.totalInvested?.toLocaleString()}</div>
                      {statusBadge(inv.status)}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ═══ BONDS TAB ═══ */}
          {tab === "bonds" && (
            <>
              <h3 style={{ fontSize:15, fontWeight:700, marginBottom:12 }}>My Bond Investments</h3>
              <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
                <div style={{ display:"grid", gridTemplateColumns:"180px 80px 80px 100px 100px 80px", padding:"10px 20px", background:"rgba(255,255,255,0.03)", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase" }}>
                  <span>Asset</span><span>Units</span><span>Yield</span><span>Invested</span><span>Maturity</span><span>Status</span>
                </div>
                {investments.investments?.length === 0 ? (
                  <div style={{ padding:30, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>No bonds purchased yet</div>
                ) : investments.investments?.map((inv, i) => (
                  <div key={i} style={{ display:"grid", gridTemplateColumns:"180px 80px 80px 100px 100px 80px", padding:"12px 20px", borderBottom:"1px solid rgba(255,255,255,0.04)", fontSize:12, alignItems:"center" }}>
                    <span style={{ fontWeight:600 }}>{inv.assetName}</span>
                    <span>{inv.units}</span>
                    <span style={{ color:"#22c55e" }}>{inv.yieldRate || 0}%</span>
                    <span style={{ fontWeight:600 }}>EUR {inv.totalInvested?.toLocaleString()}</span>
                    <span style={{ color:"rgba(255,255,255,0.4)", fontSize:11 }}>{inv.maturityDate ? new Date(inv.maturityDate).toLocaleDateString() : "N/A"}</span>
                    {statusBadge(inv.status)}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ═══ ORDERS TAB ═══ */}
          {tab === "orders" && (
            <>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                <h3 style={{ fontSize:15, fontWeight:700 }}>Buy / Sell History</h3>
                <button onClick={() => router.push("/markets")} style={{ padding:"6px 16px", borderRadius:6, background:"#F0B90B", color:"#000", border:"none", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Buy Assets</button>
              </div>
              <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
                <div style={{ display:"grid", gridTemplateColumns:"80px 160px 80px 100px 100px 80px", padding:"10px 20px", background:"rgba(255,255,255,0.03)", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase" }}>
                  <span>Type</span><span>Asset</span><span>Units</span><span>Amount</span><span>Date</span><span>Status</span>
                </div>
                {orders.length === 0 ? (
                  <div style={{ padding:30, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>No orders yet</div>
                ) : orders.map((o, i) => (
                  <div key={i} style={{ display:"grid", gridTemplateColumns:"80px 160px 80px 100px 100px 80px", padding:"12px 20px", borderBottom:"1px solid rgba(255,255,255,0.04)", fontSize:12, alignItems:"center" }}>
                    <span style={{ fontSize:10, padding:"2px 8px", borderRadius:4, background: o.type==="buy" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: o.type==="buy" ? "#22c55e" : "#ef4444", fontWeight:700 }}>{o.type}</span>
                    <span style={{ fontWeight:600 }}>{o.assetName}</span>
                    <span>{o.units}</span>
                    <span style={{ fontWeight:600 }}>EUR {o.totalAmount?.toLocaleString()}</span>
                    <span style={{ color:"rgba(255,255,255,0.4)", fontSize:11 }}>{new Date(o.createdAt).toLocaleDateString()}</span>
                    {statusBadge(o.status)}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ═══ EARNINGS TAB ═══ */}
          {tab === "earnings" && (
            <>
              <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap" }}>
                {card("Total Earnings", "EUR " + totalEarnings.toLocaleString(), "#F0B90B")}
                {card("Next Payout", "Pending", "#3b82f6")}
              </div>
              <h3 style={{ fontSize:15, fontWeight:700, marginBottom:12 }}>Distribution History</h3>
              <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
                <div style={{ display:"grid", gridTemplateColumns:"180px 100px 100px 150px", padding:"10px 20px", background:"rgba(255,255,255,0.03)", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase" }}>
                  <span>Asset</span><span>Amount</span><span>Date</span><span>TX Hash</span>
                </div>
                {investments.investments?.flatMap(inv => inv.earnings?.map(e => ({...e, assetName: inv.assetName})) || []).length === 0 ? (
                  <div style={{ padding:30, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>No earnings yet. Earnings appear after profit distributions.</div>
                ) : investments.investments?.flatMap(inv => inv.earnings?.map(e => ({...e, assetName: inv.assetName})) || []).map((e, i) => (
                  <div key={i} style={{ display:"grid", gridTemplateColumns:"180px 100px 100px 150px", padding:"12px 20px", borderBottom:"1px solid rgba(255,255,255,0.04)", fontSize:12, alignItems:"center" }}>
                    <span style={{ fontWeight:600 }}>{e.assetName}</span>
                    <span style={{ color:"#22c55e", fontWeight:700 }}>+EUR {e.amount?.toLocaleString()}</span>
                    <span style={{ color:"rgba(255,255,255,0.4)", fontSize:11 }}>{new Date(e.date).toLocaleDateString()}</span>
                    <span style={{ fontSize:10, color:"rgba(255,255,255,0.3)", fontFamily:"monospace" }}>{e.txHash ? e.txHash.slice(0,16)+"..." : "N/A"}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ═══ WALLET TAB ═══ */}
          {tab === "wallet" && (
            <>
              <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap" }}>
                {card("Available", "EUR " + (wallet?.available || 0).toLocaleString(), "#22c55e")}
                {card("Locked", "EUR " + (wallet?.locked || 0).toLocaleString(), "#f59e0b")}
                {card("Earnings", "EUR " + (wallet?.earnings || 0).toLocaleString(), "#F0B90B")}
              </div>
              {wallet?.address && <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginBottom:16 }}>Wallet: <span style={{ fontFamily:"monospace", color:"#8b5cf6" }}>{wallet.address}</span></div>}
              <h3 style={{ fontSize:15, fontWeight:700, marginBottom:12 }}>Recent Transactions</h3>
              <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
                {(wallet?.transactions || []).length === 0 ? (
                  <div style={{ padding:30, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>No transactions yet</div>
                ) : (wallet?.transactions || []).map((t, i) => (
                  <div key={i} style={{ padding:"12px 20px", borderBottom:"1px solid rgba(255,255,255,0.04)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600 }}>{t.description || t.type}</div>
                      <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)" }}>{new Date(t.createdAt).toLocaleString()}</div>
                    </div>
                    <div style={{ fontSize:14, fontWeight:700, color: ["deposit","profit_distribution","sell"].includes(t.type) ? "#22c55e" : "#ef4444" }}>
                      {["deposit","profit_distribution","sell"].includes(t.type) ? "+" : "-"}EUR {Math.abs(t.amount).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ═══ KYC TAB ═══ */}
          {tab === "kyc" && (
            <>
              <div style={{ display:"flex", gap:12, marginBottom:24 }}>
                {card("KYC Status", user?.kycStatus || "pending", user?.kycStatus === "approved" ? "#22c55e" : "#f59e0b")}
              </div>
              <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", padding:20 }}>
                {user?.kycStatus === "approved" ? (
                  <div style={{ textAlign:"center", padding:20, color:"#22c55e" }}>
                    <div style={{ fontSize:48, marginBottom:12 }}>✅</div>
                    <div style={{ fontSize:16, fontWeight:700 }}>KYC Verified</div>
                    <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginTop:4 }}>Your identity has been verified. You can invest in all assets.</div>
                  </div>
                ) : (
                  <div style={{ textAlign:"center", padding:20 }}>
                    <div style={{ fontSize:48, marginBottom:12 }}>🪪</div>
                    <div style={{ fontSize:16, fontWeight:700, color:"#f59e0b" }}>Verification {user?.kycStatus === "pending" ? "Pending" : "Required"}</div>
                    <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginTop:4, marginBottom:16 }}>Complete KYC to start investing. Takes 2-5 minutes.</div>
                    <button onClick={() => router.push("/kyc")} style={{ padding:"10px 24px", background:"#F0B90B", color:"#000", border:"none", borderRadius:8, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Start Verification</button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
EOF

echo "  ✓ Investor dashboard (6 tabs)"

# ═══════════════════════════════════════
# 11. ISSUER DASHBOARD (Complete Rebuild)
# ═══════════════════════════════════════
cat > pages/issuer-dashboard.js << 'EOF'
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSession, signOut } from "next-auth/react";
import Navbar from "../components/Navbar";

const TABS = ["overview","assets","offerings","funds","distributions","investors"];
const TAB_LABELS = { overview:"📊 Overview", assets:"🏗️ Create Asset", offerings:"📋 Offerings", funds:"💵 Funds", distributions:"💰 Distributions", investors:"📈 Investors" };

export default function IssuerDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [tab, setTab] = useState("overview");
  const [data, setData] = useState({ assets: [], investments: [], distributions: [], stats: {} });
  const [loading, setLoading] = useState(true);
  const [assetForm, setAssetForm] = useState({ name:"", assetType:"bond", totalValue:"", tokenSupply:"", interestRate:"", duration:"", description:"", minInvestment:"100" });
  const [distForm, setDistForm] = useState({ assetId:"", totalProfit:"", proofDocUrl:"" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") loadAll();
  }, [status]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/issuer/stats");
      const d = await res.json();
      if (!res.ok && d.error === "Issuer access only") {
        router.push("/dashboard");
        return;
      }
      setData(d);
    } catch(e) {} finally { setLoading(false); }
  };

  const createAsset = async (e) => {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/assets/create", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(assetForm),
    });
    const d = await res.json();
    setMsg(res.ok ? "Asset created! Status: Draft" : "Error: " + d.error);
    if (res.ok) { setAssetForm({ name:"", assetType:"bond", totalValue:"", tokenSupply:"", interestRate:"", duration:"", description:"", minInvestment:"100" }); loadAll(); }
  };

  const submitDistribution = async (e) => {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/issuer/distributions", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", ...distForm }),
    });
    const d = await res.json();
    setMsg(res.ok ? "Distribution submitted for approval" : "Error: " + d.error);
    if (res.ok) { setDistForm({ assetId:"", totalProfit:"", proofDocUrl:"" }); loadAll(); }
  };

  const st = data.stats || {};
  const card = (l, v, c) => (
    <div style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:"18px 22px", flex:1, minWidth:140 }}>
      <div style={{ fontSize:26, fontWeight:800, color:c }}>{v}</div>
      <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:4 }}>{l}</div>
    </div>
  );

  const inp = { width:"100%", background:"#0a0e14", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"10px 14px", color:"#fff", fontSize:13, outline:"none", fontFamily:"inherit", boxSizing:"border-box" };
  const lbl = { display:"block", fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", marginBottom:4 };
  const statusBadge = (s) => {
    const colors = { draft:"#6b7280", pending:"#f59e0b", live:"#22c55e", pending_compliance:"#8b5cf6", compliance_approved:"#3b82f6", finance_approved:"#f59e0b", distributed:"#22c55e", rejected:"#ef4444" };
    return <span style={{ fontSize:10, padding:"2px 8px", borderRadius:4, background:(colors[s]||"#666")+"15", color:colors[s]||"#666", fontWeight:700 }}>{(s||"draft").replace(/_/g," ")}</span>;
  };

  if (status === "loading" || loading) return <div style={{ minHeight:"100vh", background:"#0B0E11", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff" }}>Loading...</div>;

  return (
    <>
      <Head><title>Issuer Dashboard — Nextoken Capital</title></Head>
      <Navbar />
      <div style={{ minHeight:"100vh", background:"#0B0E11", color:"#fff", paddingTop:70 }}>
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"28px 20px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
            <div>
              <h1 style={{ fontSize:24, fontWeight:800, marginBottom:4 }}>Issuer Dashboard</h1>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.4)" }}>Tokenize assets, manage offerings, distribute profits</p>
            </div>
            <button onClick={() => signOut({ callbackUrl:"/login" })} style={{ padding:"8px 16px", borderRadius:7, background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.15)", color:"#ef4444", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>Sign Out</button>
          </div>

          {/* Tabs */}
          <div style={{ display:"flex", gap:4, marginBottom:24, overflowX:"auto", paddingBottom:8 }}>
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding:"8px 18px", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap", background: tab===t ? "#8b5cf615" : "rgba(255,255,255,0.04)", color: tab===t ? "#8b5cf6" : "rgba(255,255,255,0.4)", border: tab===t ? "1px solid #8b5cf630" : "1px solid rgba(255,255,255,0.06)" }}>
                {TAB_LABELS[t]}
              </button>
            ))}
          </div>

          {msg && <div style={{ background:"rgba(240,185,11,0.08)", border:"1px solid rgba(240,185,11,0.2)", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#F0B90B", marginBottom:16 }}>{msg}</div>}

          {/* ═══ OVERVIEW ═══ */}
          {tab === "overview" && (
            <>
              <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap" }}>
                {card("Total Assets", st.totalAssets || 0, "#8b5cf6")}
                {card("Live Assets", st.liveAssets || 0, "#22c55e")}
                {card("Total Raised", "EUR " + (st.totalRaised || 0).toLocaleString(), "#F0B90B")}
                {card("Total Investors", st.totalInvestors || 0, "#3b82f6")}
                {card("Distributed", "EUR " + (st.totalDistributed || 0).toLocaleString(), "#22c55e")}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", padding:20 }}>
                  <h3 style={{ fontSize:14, fontWeight:700, marginBottom:12 }}>Recent Assets</h3>
                  {data.assets?.length === 0 ? <div style={{ color:"rgba(255,255,255,0.3)", fontSize:12 }}>No assets. Create one to get started.</div> : data.assets?.slice(0,5).map((a,i) => (
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                      <span style={{ fontSize:13, fontWeight:600 }}>{a.name}</span>
                      {statusBadge(a.approvalStatus || a.status)}
                    </div>
                  ))}
                </div>
                <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", padding:20 }}>
                  <h3 style={{ fontSize:14, fontWeight:700, marginBottom:12 }}>Pending Distributions</h3>
                  {data.distributions?.filter(d => d.status !== "distributed").length === 0 ? <div style={{ color:"rgba(255,255,255,0.3)", fontSize:12 }}>No pending distributions.</div> : data.distributions?.filter(d => d.status !== "distributed").slice(0,5).map((d,i) => (
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                      <span style={{ fontSize:13 }}>{d.assetName} · EUR {d.totalProfit?.toLocaleString()}</span>
                      {statusBadge(d.status)}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ═══ CREATE ASSET ═══ */}
          {tab === "assets" && (
            <div style={{ background:"#161b22", borderRadius:12, border:"1px solid rgba(255,255,255,0.06)", padding:24, maxWidth:700 }}>
              <h3 style={{ fontSize:16, fontWeight:700, color:"#8b5cf6", marginBottom:16 }}>Create New Asset</h3>
              <form onSubmit={createAsset}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
                  <div><label style={lbl}>ASSET NAME</label><input value={assetForm.name} onChange={e => setAssetForm({...assetForm, name:e.target.value})} required style={inp} placeholder="Berlin Office Complex" /></div>
                  <div><label style={lbl}>TYPE</label><select value={assetForm.assetType} onChange={e => setAssetForm({...assetForm, assetType:e.target.value})} style={{...inp, cursor:"pointer"}}><option value="bond">Bond</option><option value="equity">Equity</option><option value="real_estate">Real Estate</option><option value="fund">Fund</option></select></div>
                  <div><label style={lbl}>TOTAL VALUE (EUR)</label><input type="number" value={assetForm.totalValue} onChange={e => setAssetForm({...assetForm, totalValue:e.target.value})} required style={inp} /></div>
                  <div><label style={lbl}>TOKEN SUPPLY</label><input type="number" value={assetForm.tokenSupply} onChange={e => setAssetForm({...assetForm, tokenSupply:e.target.value})} required style={inp} /></div>
                  <div><label style={lbl}>INTEREST RATE (%)</label><input type="number" step="0.1" value={assetForm.interestRate} onChange={e => setAssetForm({...assetForm, interestRate:e.target.value})} style={inp} /></div>
                  <div><label style={lbl}>DURATION (MONTHS)</label><input type="number" value={assetForm.duration} onChange={e => setAssetForm({...assetForm, duration:e.target.value})} style={inp} /></div>
                  <div><label style={lbl}>MIN INVESTMENT (EUR)</label><input type="number" value={assetForm.minInvestment} onChange={e => setAssetForm({...assetForm, minInvestment:e.target.value})} style={inp} /></div>
                </div>
                <div style={{ marginBottom:12 }}><label style={lbl}>DESCRIPTION</label><textarea value={assetForm.description} onChange={e => setAssetForm({...assetForm, description:e.target.value})} rows={3} style={{...inp, resize:"vertical"}} /></div>
                <button type="submit" style={{ padding:"10px 24px", background:"#8b5cf6", color:"#fff", border:"none", borderRadius:8, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Create Asset (Draft)</button>
                <p style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:8 }}>Asset will be submitted for Compliance → Finance → Final approval.</p>
              </form>
            </div>
          )}

          {/* ═══ OFFERINGS ═══ */}
          {tab === "offerings" && (
            <>
              <h3 style={{ fontSize:15, fontWeight:700, marginBottom:12 }}>My Offerings</h3>
              {data.assets?.length === 0 ? (
                <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", padding:40, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>No assets created yet</div>
              ) : data.assets?.map((a, i) => {
                const invested = data.investments?.filter(inv => inv.assetId?.toString() === a._id?.toString()).reduce((s, inv) => s + inv.totalInvested, 0) || 0;
                const investorCount = [...new Set(data.investments?.filter(inv => inv.assetId?.toString() === a._id?.toString()).map(inv => inv.userId?.toString()))].length;
                return (
                  <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:20, marginBottom:12 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                      <div><div style={{ fontSize:16, fontWeight:700 }}>{a.name}</div><div style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>{a.assetType}</div></div>
                      {statusBadge(a.approvalStatus || a.status)}
                    </div>
                    <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                      <div style={{ background:"#0a0e14", borderRadius:6, padding:"8px 14px" }}><div style={{ fontSize:10, color:"rgba(255,255,255,0.3)" }}>TARGET</div><div style={{ fontSize:14, fontWeight:700, color:"#8b5cf6" }}>EUR {(a.targetRaise || a.totalValue || 0).toLocaleString()}</div></div>
                      <div style={{ background:"#0a0e14", borderRadius:6, padding:"8px 14px" }}><div style={{ fontSize:10, color:"rgba(255,255,255,0.3)" }}>RAISED</div><div style={{ fontSize:14, fontWeight:700, color:"#22c55e" }}>EUR {invested.toLocaleString()}</div></div>
                      <div style={{ background:"#0a0e14", borderRadius:6, padding:"8px 14px" }}><div style={{ fontSize:10, color:"rgba(255,255,255,0.3)" }}>INVESTORS</div><div style={{ fontSize:14, fontWeight:700, color:"#3b82f6" }}>{investorCount}</div></div>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {/* ═══ FUNDS ═══ */}
          {tab === "funds" && (
            <>
              <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap" }}>
                {card("Total Raised", "EUR " + (st.totalRaised || 0).toLocaleString(), "#22c55e")}
                {card("Distributed", "EUR " + (st.totalDistributed || 0).toLocaleString(), "#F0B90B")}
                {card("Available", "EUR " + ((st.totalRaised || 0) - (st.totalDistributed || 0)).toLocaleString(), "#3b82f6")}
              </div>
              <div style={{ background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.15)", borderRadius:10, padding:"14px 20px", fontSize:12, color:"rgba(255,255,255,0.5)", lineHeight:1.7 }}>
                Withdrawals require admin approval. Funds are held in escrow and released per milestones. Contact admin for withdrawal requests.
              </div>
            </>
          )}

          {/* ═══ DISTRIBUTIONS ═══ */}
          {tab === "distributions" && (
            <>
              <div style={{ background:"#161b22", borderRadius:12, border:"1px solid rgba(255,255,255,0.06)", padding:20, marginBottom:20 }}>
                <h3 style={{ fontSize:15, fontWeight:700, color:"#F0B90B", marginBottom:12 }}>Submit Profit Distribution</h3>
                <form onSubmit={submitDistribution}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:12 }}>
                    <div><label style={lbl}>ASSET</label><select value={distForm.assetId} onChange={e => setDistForm({...distForm, assetId:e.target.value})} required style={{...inp, cursor:"pointer"}}><option value="">Select asset</option>{data.assets?.filter(a => a.status === "live" || a.approvalStatus === "live").map(a => <option key={a._id} value={a._id}>{a.name}</option>)}</select></div>
                    <div><label style={lbl}>TOTAL PROFIT (EUR)</label><input type="number" value={distForm.totalProfit} onChange={e => setDistForm({...distForm, totalProfit:e.target.value})} required style={inp} /></div>
                    <div><label style={lbl}>PROOF DOC URL</label><input value={distForm.proofDocUrl} onChange={e => setDistForm({...distForm, proofDocUrl:e.target.value})} style={inp} placeholder="Upload revenue docs" /></div>
                  </div>
                  <button type="submit" style={{ padding:"8px 20px", background:"#F0B90B", color:"#000", border:"none", borderRadius:7, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Submit for Approval</button>
                  <p style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:6 }}>Flow: Compliance verifies → Finance confirms → Super Admin approves → Auto-distributed</p>
                </form>
              </div>
              <h3 style={{ fontSize:15, fontWeight:700, marginBottom:12 }}>Distribution History</h3>
              {data.distributions?.length === 0 ? (
                <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", padding:30, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>No distributions yet</div>
              ) : data.distributions?.map((d, i) => (
                <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"14px 20px", marginBottom:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ fontSize:14, fontWeight:600 }}>{d.assetName} · EUR {d.totalProfit?.toLocaleString()}</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)" }}>{new Date(d.createdAt).toLocaleDateString()} · {d.distributions?.length || 0} investors</div>
                  </div>
                  {statusBadge(d.status)}
                </div>
              ))}
            </>
          )}

          {/* ═══ INVESTORS ═══ */}
          {tab === "investors" && (
            <>
              <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap" }}>
                {card("Total Investors", st.totalInvestors || 0, "#3b82f6")}
                {card("Total Investments", "EUR " + (st.totalRaised || 0).toLocaleString(), "#22c55e")}
              </div>
              <h3 style={{ fontSize:15, fontWeight:700, marginBottom:12 }}>Investment Breakdown by Asset</h3>
              {data.assets?.map((a, i) => {
                const assetInvestments = data.investments?.filter(inv => inv.assetId?.toString() === a._id?.toString()) || [];
                return (
                  <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:16, marginBottom:10 }}>
                    <div style={{ fontSize:14, fontWeight:700, marginBottom:8 }}>{a.name} ({assetInvestments.length} investors)</div>
                    {assetInvestments.length === 0 ? <div style={{ fontSize:12, color:"rgba(255,255,255,0.3)" }}>No investors yet</div> : assetInvestments.map((inv, j) => (
                      <div key={j} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid rgba(255,255,255,0.03)", fontSize:12 }}>
                        <span style={{ color:"rgba(255,255,255,0.5)" }}>{inv.userId?.toString().slice(-8)}</span>
                        <span>{inv.units} units · EUR {inv.totalInvested?.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </>
  );
}
EOF

echo "  ✓ Issuer dashboard (6 tabs)"

# ═══════════════════════════════════════
# 12. Issuer Distribution API
# ═══════════════════════════════════════
cat > pages/api/issuer/distributions.js << 'EOF'
import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import Asset from "../../../lib/models/Asset";
import Investment from "../../../models/Investment";
import Distribution from "../../../models/Distribution";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  await connectDB();
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).json({ error: "Not authenticated" });
  const user = await User.findOne({ email: session.user.email });
  if (!user || user.role !== "issuer") return res.status(403).json({ error: "Issuer access only" });

  const { action, assetId, totalProfit, proofDocUrl } = req.body;

  if (action === "create") {
    if (!assetId || !totalProfit) return res.status(400).json({ error: "Asset and profit amount required" });

    const asset = await Asset.findById(assetId);
    if (!asset) return res.status(404).json({ error: "Asset not found" });

    const investments = await Investment.find({ assetId, status: "active" });
    const totalTokens = investments.reduce((s, i) => s + i.units, 0);

    const distributions = investments.map(inv => ({
      investorId: inv.userId,
      unitsOwned: inv.units,
      sharePercent: totalTokens > 0 ? (inv.units / totalTokens) * 100 : 0,
      amount: totalTokens > 0 ? (inv.units / totalTokens) * Number(totalProfit) : 0,
    }));

    const dist = await Distribution.create({
      assetId, assetName: asset.name, issuerId: user._id,
      totalProfit: Number(totalProfit), proofDocUrl, distributions,
    });

    return res.json({ distribution: dist });
  }

  return res.status(400).json({ error: "Unknown action" });
}
EOF

echo "  ✓ Distribution API with auto-calculation"

# Update register API to accept role
sed -i "s|role: 'investor'|role: req.body.role === 'issuer' ? 'issuer' : 'investor'|" pages/api/auth/register.js 2>/dev/null

echo ""
echo "  ╔═══════════════════════════════════════════════════════════╗"
echo "  ║  PHASE 1 COMPLETE                                        ║"
echo "  ║                                                           ║"
echo "  ║  REGISTRATION:                                            ║"
echo "  ║    Investor / Issuer role selector                        ║"
echo "  ║    Routes to correct dashboard after signup               ║"
echo "  ║                                                           ║"
echo "  ║  INVESTOR DASHBOARD (/dashboard):                         ║"
echo "  ║    Portfolio (stats + allocation)                         ║"
echo "  ║    Bond Investments (units, yield, maturity)              ║"
echo "  ║    Buy/Sell Orders (history + status)                     ║"
echo "  ║    Earnings (distribution history + TX hash)              ║"
echo "  ║    Wallet (balance + locked + transactions)               ║"
echo "  ║    KYC (status + verify button)                           ║"
echo "  ║                                                           ║"
echo "  ║  ISSUER DASHBOARD (/issuer-dashboard):                    ║"
echo "  ║    Overview (stats + recent assets + distributions)       ║"
echo "  ║    Create Asset (bond/equity/real estate form)            ║"
echo "  ║    Offerings (funding progress + investor count)          ║"
echo "  ║    Fund Management (raised/distributed/available)         ║"
echo "  ║    Profit Distribution (submit + auto-calculate shares)   ║"
echo "  ║    Investor Insights (breakdown by asset)                 ║"
echo "  ║                                                           ║"
echo "  ║  NEW MODELS:                                              ║"
echo "  ║    Wallet, Investment, Order, Distribution                ║"
echo "  ║                                                           ║"
echo "  ║  NEW APIs:                                                ║"
echo "  ║    /api/wallet, /api/investments/my, /api/investments/    ║"
echo "  ║    orders, /api/issuer/stats, /api/issuer/distributions   ║"
echo "  ║                                                           ║"
echo "  ║  RUN:                                                     ║"
echo "  ║    git add -A && git commit -m 'feat: investor + issuer'  ║"
echo "  ║    git push && npx vercel --prod                          ║"
echo "  ╚═══════════════════════════════════════════════════════════╝"
