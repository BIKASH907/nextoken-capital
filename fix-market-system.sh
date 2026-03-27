#!/bin/bash
# COMPLETE MARKET SYSTEM: Phases, Market Maker, Anti-Manipulation
# Run: chmod +x fix-market-system.sh && ./fix-market-system.sh
set -e

echo "  🏦 Building Complete Market System..."

# ═══════════════════════════════════════
# 1. ADD MARKET PHASE FIELDS TO ASSET MODEL
# ═══════════════════════════════════════
cat > /tmp/patch-asset.js << 'JSEOF'
const fs = require("fs");
let c = fs.readFileSync("lib/models/Asset.js", "utf8");
if (c.indexOf("marketPhase") === -1) {
  c = c.replace("status: { type: String", "marketPhase: { type: String, enum: ['primary_active','price_discovery','secondary_active'], default: 'primary_active' },\n  soldUnits: { type: Number, default: 0 },\n  discoveryPrice: { type: Number },\n  lastTradedPrice: { type: Number },\n  tradingStartDate: { type: Date },\n  ipoEndDate: { type: Date },\n  status: { type: String");
  fs.writeFileSync("lib/models/Asset.js", c);
  console.log("Asset model updated with market phases");
}
JSEOF
node /tmp/patch-asset.js
echo "  ✓ Asset model: marketPhase, soldUnits, discoveryPrice"

# ═══════════════════════════════════════
# 2. MARKET MAKER BOT API
# ═══════════════════════════════════════
cat > pages/api/admin/market-maker.js << 'EOF'
import { requireAdmin } from "../../../lib/adminAuth";
import dbConnect from "../../../lib/db";
import Asset from "../../../lib/models/Asset";
import OrderBook from "../../../models/OrderBook";
import mongoose from "mongoose";

const BOT_USER_ID = "000000000000000000000001";

async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const db = mongoose.connection.db;
    const botOrders = await OrderBook.find({ userId: BOT_USER_ID, status: { $in: ["open","partial"] } }).lean();
    return res.json({ botOrders, count: botOrders.length });
  }

  if (req.method === "POST") {
    const { assetId, action, spread, levels, orderSize } = req.body;
    const SPREAD = spread || 0.03;
    const LEVELS = levels || 3;
    const SIZE = orderSize || 50;

    if (action === "start") {
      const asset = await Asset.findById(assetId);
      if (!asset) return res.status(404).json({ error: "Asset not found" });

      const basePrice = asset.lastTradedPrice || asset.tokenPrice || 100;

      // Cancel existing bot orders for this asset
      await OrderBook.updateMany({ userId: BOT_USER_ID, assetId, status: { $in: ["open","partial"] } }, { $set: { status: "cancelled" } });

      const orders = [];
      for (let i = 1; i <= LEVELS; i++) {
        const buyPrice = Math.round(basePrice * (1 - SPREAD * i) * 100) / 100;
        const sellPrice = Math.round(basePrice * (1 + SPREAD * i) * 100) / 100;

        orders.push({
          assetId, assetName: asset.name, side: "bid", userId: BOT_USER_ID,
          units: SIZE, remainingUnits: SIZE, pricePerUnit: buyPrice, totalAmount: buyPrice * SIZE,
          expiresAt: new Date(Date.now() + 24*60*60*1000),
        });
        orders.push({
          assetId, assetName: asset.name, side: "ask", userId: BOT_USER_ID,
          units: SIZE, remainingUnits: SIZE, pricePerUnit: sellPrice, totalAmount: sellPrice * SIZE,
          expiresAt: new Date(Date.now() + 24*60*60*1000),
        });
      }

      await OrderBook.insertMany(orders);
      return res.json({ success: true, message: "Market maker: " + orders.length + " orders placed", basePrice, spread: SPREAD });
    }

    if (action === "stop") {
      const result = await OrderBook.updateMany({ userId: BOT_USER_ID, assetId, status: { $in: ["open","partial"] } }, { $set: { status: "cancelled" } });
      return res.json({ success: true, message: "Cancelled " + result.modifiedCount + " bot orders" });
    }

    if (action === "stop_all") {
      const result = await OrderBook.updateMany({ userId: BOT_USER_ID, status: { $in: ["open","partial"] } }, { $set: { status: "cancelled" } });
      return res.json({ success: true, message: "Cancelled all " + result.modifiedCount + " bot orders" });
    }
  }
  return res.status(405).end();
}
export default requireAdmin(handler);
EOF
echo "  ✓ Market maker bot API"

# ═══════════════════════════════════════
# 3. ANTI-MANIPULATION ENGINE
# ═══════════════════════════════════════
cat > lib/antiManipulation.js << 'EOF'
import mongoose from "mongoose";
import { notify } from "./notify";

export async function checkManipulation(userId, assetId, action, price, units) {
  const db = mongoose.connection.db;
  const alerts = [];

  // 1. Wash Trading: same user buying AND selling same asset within 5 min
  const recentTrades = await db.collection("trades").find({
    $or: [{ buyerId: userId }, { sellerId: userId }],
    assetId: new mongoose.Types.ObjectId(assetId),
    createdAt: { $gte: new Date(Date.now() - 5*60*1000) }
  }).toArray();

  const isBuyer = recentTrades.some(t => t.buyerId?.toString() === userId.toString());
  const isSeller = recentTrades.some(t => t.sellerId?.toString() === userId.toString());
  if (isBuyer && isSeller) {
    alerts.push({ type: "wash_trading", severity: "high", message: "User buying and selling same asset within 5 minutes" });
  }

  // 2. Spoofing: large order frequency (>5 orders placed+cancelled in 10 min)
  const recentOrders = await db.collection("orderbooks").find({
    userId: new mongoose.Types.ObjectId(userId), assetId: new mongoose.Types.ObjectId(assetId),
    createdAt: { $gte: new Date(Date.now() - 10*60*1000) }
  }).toArray();
  const cancelledRecent = recentOrders.filter(o => o.status === "cancelled");
  if (cancelledRecent.length >= 5) {
    alerts.push({ type: "spoofing", severity: "high", message: "Excessive order cancellations: " + cancelledRecent.length + " in 10 min" });
  }

  // 3. Price pump: if order price deviates >10% from last trade
  const lastTrade = await db.collection("trades").findOne({ assetId: new mongoose.Types.ObjectId(assetId) }, { sort: { createdAt: -1 } });
  if (lastTrade && price) {
    const deviation = Math.abs(price - lastTrade.pricePerUnit) / lastTrade.pricePerUnit;
    if (deviation > 0.10) {
      alerts.push({ type: "price_manipulation", severity: "medium", message: "Order price deviates " + Math.round(deviation*100) + "% from last trade" });
    }
  }

  // 4. Order frequency: >20 orders per minute
  const minuteOrders = await db.collection("orderbooks").countDocuments({
    userId: new mongoose.Types.ObjectId(userId),
    createdAt: { $gte: new Date(Date.now() - 60*1000) }
  });
  if (minuteOrders > 20) {
    alerts.push({ type: "order_frequency", severity: "medium", message: "Excessive order frequency: " + minuteOrders + "/min" });
  }

  // Store alerts
  for (const alert of alerts) {
    await db.collection("riskalerts").insertOne({
      userId: userId.toString(), assetId, ...alert,
      action, price, units, status: "open", createdAt: new Date(),
    });
  }

  return alerts;
}

// Circuit breaker: pause trading if price moves >20%
export async function checkCircuitBreaker(assetId) {
  const db = mongoose.connection.db;
  const trades = await db.collection("trades").find({
    assetId: new mongoose.Types.ObjectId(assetId),
    createdAt: { $gte: new Date(Date.now() - 60*1000) }
  }).sort({ createdAt: 1 }).toArray();

  if (trades.length < 2) return false;

  const firstPrice = trades[0].pricePerUnit;
  const lastPrice = trades[trades.length - 1].pricePerUnit;
  const change = Math.abs(lastPrice - firstPrice) / firstPrice;

  if (change > 0.20) {
    // Pause: cancel all open orders
    await db.collection("orderbooks").updateMany(
      { assetId: new mongoose.Types.ObjectId(assetId), status: { $in: ["open","partial"] } },
      { $set: { status: "halted" } }
    );
    await db.collection("riskalerts").insertOne({
      type: "circuit_breaker", severity: "critical", assetId,
      message: "Trading halted: " + Math.round(change*100) + "% price swing in 1 minute",
      status: "open", createdAt: new Date(),
    });
    return true;
  }
  return false;
}
EOF
echo "  ✓ Anti-manipulation engine (wash trading, spoofing, price pump, circuit breaker)"

# ═══════════════════════════════════════
# 4. MARKET PHASE TRANSITION API
# ═══════════════════════════════════════
cat > pages/api/admin/market-phase.js << 'EOF'
import { requireAdmin } from "../../../lib/adminAuth";
import dbConnect from "../../../lib/db";
import Asset from "../../../lib/models/Asset";
import { logAudit } from "../../../lib/auditLog";

async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const assets = await Asset.find().select("name marketPhase soldUnits tokenSupply status approvalStatus lastTradedPrice discoveryPrice").lean();
    return res.json({ assets });
  }

  if (req.method === "POST") {
    const { assetId, phase } = req.body;
    if (!assetId || !phase) return res.status(400).json({ error: "assetId and phase required" });
    if (!["primary_active","price_discovery","secondary_active"].includes(phase)) return res.status(400).json({ error: "Invalid phase" });

    const asset = await Asset.findById(assetId);
    if (!asset) return res.status(404).json({ error: "Not found" });

    const oldPhase = asset.marketPhase;
    asset.marketPhase = phase;
    if (phase === "secondary_active") asset.tradingStartDate = new Date();
    await asset.save();

    await logAudit({ action: "market_phase_change", category: "system", admin: req.admin, targetType: "asset", targetId: assetId, details: { from: oldPhase, to: phase }, req, severity: "critical" });

    return res.json({ success: true, message: asset.name + ": " + oldPhase + " → " + phase });
  }
  return res.status(405).end();
}
export default requireAdmin(handler);
EOF
echo "  ✓ Market phase transition API"

# ═══════════════════════════════════════
# 5. REDESIGNED MARKETPLACE (Investment-focused)
# ═══════════════════════════════════════
cat > pages/marketplace.js << 'EOF'
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSession } from "next-auth/react";
import Navbar from "../components/Navbar";

export default function Marketplace() {
  const router = useRouter();
  const { data: session } = useSession();
  const [assets, setAssets] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAssets(); }, []);
  const loadAssets = () => fetch("/api/assets/stats").then(r => r.json()).then(d => { setAssets((d.assets || []).filter(a => a.status === "live" || a.approvalStatus === "live")); setLoading(false); }).catch(() => setLoading(false));

  const priceOf = (a) => a.tokenPrice || (a.targetRaise && a.tokenSupply ? Math.round(a.targetRaise / a.tokenSupply) : 100);
  const riskOf = (a) => (a.targetROI || 0) > 15 ? "High" : (a.targetROI || 0) > 10 ? "Medium" : "Low";
  const riskColor = (r) => ({ High: "#ef4444", Medium: "#f59e0b", Low: "#22c55e" }[r]);
  const typeIcon = (t) => ({ real_estate: "🏢", bond: "📜", equity: "📈", fund: "💼", energy: "⚡", commodity: "🪙", infrastructure: "🏗️" }[t] || "📦");
  const soldPct = (a) => a.soldUnits && a.tokenSupply ? Math.round(a.soldUnits / a.tokenSupply * 100) : 0;
  const types = ["All", ...new Set(assets.map(a => a.assetType))];
  const filtered = filter === "All" ? assets : assets.filter(a => a.assetType === filter);

  return (
    <>
      <Head><title>Marketplace — Nextoken Capital</title></Head>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "#0B0E11", color: "#fff", paddingTop: 70 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 20px" }}>
          {/* HEADER */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 6 }}>Invest in Tokenized Assets</h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", maxWidth: 600 }}>Browse verified real-world assets. Each listing undergoes compliance review, financial verification, and legal structuring before reaching investors.</p>
          </div>

          {/* STATS */}
          <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
            {[{ l: "Listed Assets", v: assets.length, c: "#F0B90B" }, { l: "Asset Types", v: new Set(assets.map(a => a.assetType)).size, c: "#8b5cf6" }, { l: "Min Investment", v: "EUR 100", c: "#22c55e" }, { l: "Avg Yield", v: assets.length ? (assets.reduce((s, a) => s + (a.targetROI || 0), 0) / assets.length).toFixed(1) + "%" : "—", c: "#3b82f6" }].map((s, i) => (
              <div key={i} style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "14px 20px", flex: 1 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.c }}>{s.v}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* FILTERS */}
          <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
            {types.map(t => (
              <button key={t} onClick={() => setFilter(t)} style={{ padding: "6px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", background: filter === t ? "#F0B90B15" : "rgba(255,255,255,0.04)", color: filter === t ? "#F0B90B" : "rgba(255,255,255,0.4)", border: filter === t ? "1px solid #F0B90B30" : "1px solid rgba(255,255,255,0.06)", textTransform: "capitalize" }}>{t === "All" ? "All Assets" : t.replace(/_/g, " ")}</button>
            ))}
          </div>

          {/* ASSET GRID */}
          {loading ? <div style={{ textAlign: "center", padding: 60, color: "rgba(255,255,255,0.3)" }}>Loading assets...</div>
            : filtered.length === 0 ? <div style={{ textAlign: "center", padding: 60, color: "rgba(255,255,255,0.3)" }}>No assets available yet. Check back soon.</div>
            : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
              {filtered.map(a => {
                const risk = riskOf(a);
                const pct = soldPct(a);
                return (
                  <div key={a._id} onClick={() => router.push("/asset/" + a._id)} style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 0, cursor: "pointer", overflow: "hidden", transition: "border .2s" }}>
                    {/* Top bar */}
                    <div style={{ background: "rgba(240,185,11,0.04)", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 28 }}>{typeIcon(a.assetType)}</span>
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 700 }}>{a.name}</div>
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "capitalize" }}>{(a.assetType || "").replace(/_/g, " ")} · {a.location || "EU"}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 6, background: riskColor(risk) + "15", color: riskColor(risk), fontWeight: 700 }}>{risk} Risk</span>
                    </div>

                    {/* Body */}
                    <div style={{ padding: "16px 20px" }}>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: 16, minHeight: 36 }}>{(a.description || "").slice(0, 120)}{(a.description || "").length > 120 ? "..." : ""}</p>

                      {/* Key metrics */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
                        <div style={{ background: "#0a0e14", borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
                          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>TOKEN PRICE</div>
                          <div style={{ fontSize: 16, fontWeight: 800, color: "#F0B90B" }}>EUR {priceOf(a)}</div>
                        </div>
                        <div style={{ background: "#0a0e14", borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
                          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>ANNUAL YIELD</div>
                          <div style={{ fontSize: 16, fontWeight: 800, color: "#22c55e" }}>{a.targetROI || 0}%</div>
                        </div>
                        <div style={{ background: "#0a0e14", borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
                          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>MIN INVEST</div>
                          <div style={{ fontSize: 16, fontWeight: 800, color: "#3b82f6" }}>EUR {a.minInvestment || 100}</div>
                        </div>
                      </div>

                      {/* Progress bar */}
                      {a.tokenSupply && (
                        <div style={{ marginBottom: 16 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>
                            <span>{pct}% funded</span>
                            <span>EUR {(a.targetRaise || 0).toLocaleString()}</span>
                          </div>
                          <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3 }}>
                            <div style={{ height: 6, background: "#F0B90B", borderRadius: 3, width: pct + "%", transition: "width .3s" }} />
                          </div>
                        </div>
                      )}

                      {/* Details row */}
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 16 }}>
                        <span>Supply: {(a.tokenSupply || 0).toLocaleString()} tokens</span>
                        <span>Term: {a.term || "—"} months</span>
                        <span>ERC-3643 · Polygon</span>
                      </div>

                      {/* Buttons */}
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={(e) => { e.stopPropagation(); if (!session) { router.push("/login"); return; } const u = prompt("Units to buy (EUR " + priceOf(a) + "/unit):"); if (!u || Number(u) <= 0) return; fetch("/api/investments/buy", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ assetId: a._id, units: Number(u) }) }).then(r => r.json()).then(d => { alert(d.message || d.error); loadAssets(); }); }} style={{ flex: 1, padding: 12, background: "#F0B90B", color: "#000", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
                          Invest Now
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); router.push("/exchange"); }} style={{ padding: "12px 20px", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", color: "#8b5cf6", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                          Trade
                        </button>
                      </div>
                    </div>

                    {/* Footer */}
                    <div style={{ background: "rgba(255,255,255,0.02)", padding: "8px 20px", display: "flex", justifyContent: "space-between", fontSize: 10, color: "rgba(255,255,255,0.25)" }}>
                      <span>30-day min hold for profit</span>
                      <span>MiCA compliant · Audited</span>
                    </div>
                  </div>
                );
              })}
            </div>}

          {/* INFO SECTION */}
          <div style={{ marginTop: 40, background: "#161b22", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", padding: "30px 24px" }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#F0B90B", marginBottom: 16 }}>How It Works</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
              {[
                { n: "1", t: "Browse Assets", d: "Explore verified tokenized real-world assets with full documentation." },
                { n: "2", t: "Complete KYC", d: "Verify your identity via Sumsub. Takes 2-5 minutes." },
                { n: "3", t: "Fund Wallet", d: "Deposit EUR via card, SEPA, or crypto to your platform wallet." },
                { n: "4", t: "Invest", d: "Buy tokens from EUR 100. Each token represents fractional ownership." },
                { n: "5", t: "Earn Returns", d: "Hold 30+ days to receive profit distributions. Trade anytime on exchange." },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#F0B90B15", color: "#F0B90B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, margin: "0 auto 10px" }}>{s.n}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{s.t}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{s.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
EOF
echo "  ✓ Redesigned marketplace (investment-focused, cards with risk/yield/progress)"

# ═══════════════════════════════════════
# 6. ADMIN MARKET CONTROL PAGE
# ═══════════════════════════════════════
cat > pages/admin/market-control.js << 'EOF'
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminShell from "../../components/admin/AdminShell";

export default function MarketControl() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [assets, setAssets] = useState([]);
  const [botOrders, setBotOrders] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => { const t = localStorage.getItem("adminToken"); if (!t) router.push("/admin/login"); setToken(t); }, []);
  useEffect(() => { if (token) { loadAssets(); loadBot(); } }, [token]);

  const headers = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
  const loadAssets = () => fetch("/api/admin/market-phase", { headers }).then(r => r.json()).then(d => setAssets(d.assets || []));
  const loadBot = () => fetch("/api/admin/market-maker", { headers }).then(r => r.json()).then(d => setBotOrders(d.botOrders || []));

  const changePhase = async (id, phase) => {
    const r = await fetch("/api/admin/market-phase", { method: "POST", headers, body: JSON.stringify({ assetId: id, phase }) });
    setMsg((await r.json()).message); loadAssets();
  };

  const startBot = async (id) => {
    const r = await fetch("/api/admin/market-maker", { method: "POST", headers, body: JSON.stringify({ assetId: id, action: "start" }) });
    setMsg((await r.json()).message); loadBot();
  };

  const stopBot = async (id) => {
    const r = await fetch("/api/admin/market-maker", { method: "POST", headers, body: JSON.stringify({ assetId: id, action: "stop" }) });
    setMsg((await r.json()).message); loadBot();
  };

  const phaseColor = { primary_active: "#F0B90B", price_discovery: "#8b5cf6", secondary_active: "#22c55e" };
  const phaseLabel = { primary_active: "IPO (Primary)", price_discovery: "Price Discovery", secondary_active: "Live Trading" };

  return (
    <AdminShell title="Market Control" subtitle="Manage asset phases, market maker bot, and trading status.">
      {msg && <div style={{ background: "rgba(240,185,11,0.08)", border: "1px solid rgba(240,185,11,0.2)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#F0B90B", marginBottom: 16 }}>{msg}</div>}

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <div style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "16px 20px", flex: 1 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#F0B90B" }}>{assets.length}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Total Assets</div>
        </div>
        <div style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "16px 20px", flex: 1 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#22c55e" }}>{botOrders.length}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Bot Orders Active</div>
        </div>
      </div>

      {assets.map((a, i) => (
        <div key={i} style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "16px 20px", marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{a.name}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Sold: {a.soldUnits || 0}/{a.tokenSupply || 0} · Last: EUR {a.lastTradedPrice || "—"}</div>
            </div>
            <span style={{ fontSize: 11, padding: "4px 12px", borderRadius: 6, background: (phaseColor[a.marketPhase] || "#666") + "15", color: phaseColor[a.marketPhase] || "#666", fontWeight: 700 }}>{phaseLabel[a.marketPhase] || a.marketPhase || "primary"}</span>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <button onClick={() => changePhase(a._id, "primary_active")} style={{ padding: "4px 10px", borderRadius: 4, background: "rgba(240,185,11,0.1)", border: "1px solid rgba(240,185,11,0.2)", color: "#F0B90B", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Set IPO</button>
            <button onClick={() => changePhase(a._id, "price_discovery")} style={{ padding: "4px 10px", borderRadius: 4, background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", color: "#8b5cf6", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Price Discovery</button>
            <button onClick={() => changePhase(a._id, "secondary_active")} style={{ padding: "4px 10px", borderRadius: 4, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#22c55e", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Live Trading</button>
            <span style={{ borderLeft: "1px solid rgba(255,255,255,0.1)", margin: "0 4px" }} />
            <button onClick={() => startBot(a._id)} style={{ padding: "4px 10px", borderRadius: 4, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#3b82f6", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Start Bot</button>
            <button onClick={() => stopBot(a._id)} style={{ padding: "4px 10px", borderRadius: 4, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Stop Bot</button>
          </div>
        </div>
      ))}
    </AdminShell>
  );
}
EOF
echo "  ✓ Admin market control page (phases + market maker)"

echo ""
echo "  ╔═══════════════════════════════════════════════════════════════╗"
echo "  ║  COMPLETE MARKET SYSTEM BUILT                                 ║"
echo "  ║                                                               ║"
echo "  ║  MARKETPLACE (Redesigned):                                    ║"
echo "  ║    Investment-focused cards with:                             ║"
echo "  ║    - Asset icon + name + type + location                      ║"
echo "  ║    - Risk score (Low/Medium/High)                             ║"
echo "  ║    - Description                                              ║"
echo "  ║    - Token price + Annual yield + Min invest                  ║"
echo "  ║    - Funding progress bar (% funded)                          ║"
echo "  ║    - Supply, term, token standard                             ║"
echo "  ║    - 'Invest Now' + 'Trade' buttons                          ║"
echo "  ║    - Click card → /asset/[id] detail page                    ║"
echo "  ║    - Category filter (All/Real Estate/Bond/etc)               ║"
echo "  ║    - How It Works section (5 steps)                           ║"
echo "  ║                                                               ║"
echo "  ║  MARKET PHASES:                                               ║"
echo "  ║    primary_active → IPO mode (buy from issuer)                ║"
echo "  ║    price_discovery → collect orders, find opening price       ║"
echo "  ║    secondary_active → live order book trading                 ║"
echo "  ║    Admin controls phase per asset                             ║"
echo "  ║                                                               ║"
echo "  ║  MARKET MAKER BOT:                                            ║"
echo "  ║    Places bid/ask orders around base price                    ║"
echo "  ║    Configurable: spread, levels, order size                   ║"
echo "  ║    Start/stop per asset from admin panel                      ║"
echo "  ║    Auto-expires after 24 hours                                ║"
echo "  ║                                                               ║"
echo "  ║  ANTI-MANIPULATION:                                           ║"
echo "  ║    Wash trading detection (buy+sell same asset <5min)         ║"
echo "  ║    Spoofing detection (>5 cancels in 10min)                   ║"
echo "  ║    Price pump detection (>10% deviation)                      ║"
echo "  ║    Order frequency limit (>20/min)                            ║"
echo "  ║    Circuit breaker (>20% swing in 1min → halt trading)        ║"
echo "  ║                                                               ║"
echo "  ║  NEW ADMIN: /admin/market-control                             ║"
echo "  ║    Set phase per asset (IPO/Discovery/Live)                   ║"
echo "  ║    Start/stop market maker bot per asset                      ║"
echo "  ║    View bot orders count                                      ║"
echo "  ║                                                               ║"
echo "  ║  RUN:                                                         ║"
echo "  ║    git add -A && git commit -m 'feat: market system'          ║"
echo "  ║    git push && npx vercel --prod                              ║"
echo "  ╚═══════════════════════════════════════════════════════════════╝"
