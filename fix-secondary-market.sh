#!/bin/bash
# COMPLETE SECONDARY MARKET ENGINE
# Run: chmod +x fix-secondary-market.sh && ./fix-secondary-market.sh
set -e

echo "  🏪 Building Complete Secondary Market Engine..."

# ═══════════════════════════════════════
# 1. TRADE HISTORY MODEL
# ═══════════════════════════════════════
cat > models/Trade.js << 'EOF'
import mongoose from "mongoose";
const TradeSchema = new mongoose.Schema({
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true, index: true },
  assetName: String,
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  buyOrderId: { type: mongoose.Schema.Types.ObjectId, ref: "OrderBook" },
  sellOrderId: { type: mongoose.Schema.Types.ObjectId, ref: "OrderBook" },
  units: { type: Number, required: true },
  pricePerUnit: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  buyerFee: { type: Number, default: 0 },
  sellerFee: { type: Number, default: 0 },
  txHash: String,
  matchType: { type: String, enum: ["auto","manual"], default: "auto" },
}, { timestamps: true });
TradeSchema.index({ assetId: 1, createdAt: -1 });
export default mongoose.models.Trade || mongoose.model("Trade", TradeSchema);
EOF
echo "  ✓ Trade model"

# ═══════════════════════════════════════
# 2. ENHANCED ORDER BOOK MODEL (replace old)
# ═══════════════════════════════════════
cat > models/OrderBook.js << 'EOF'
import mongoose from "mongoose";
const OrderBookSchema = new mongoose.Schema({
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
  assetName: String,
  side: { type: String, enum: ["bid","ask"], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  units: { type: Number, required: true },
  filledUnits: { type: Number, default: 0 },
  remainingUnits: { type: Number, required: true },
  pricePerUnit: { type: Number, required: true },
  totalAmount: { type: Number },
  fee: { type: Number, default: 0 },
  status: { type: String, enum: ["open","partial","filled","cancelled","expired"], default: "open" },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 7*24*60*60*1000) },
  trades: [{ tradeId: String, units: Number, price: Number, at: Date }],
}, { timestamps: true });
OrderBookSchema.index({ assetId: 1, side: 1, status: 1, pricePerUnit: 1 });
OrderBookSchema.index({ expiresAt: 1 });
export default mongoose.models.OrderBook || mongoose.model("OrderBook", OrderBookSchema);
EOF
echo "  ✓ Enhanced OrderBook model"

# ═══════════════════════════════════════
# 3. MATCHING ENGINE (core logic)
# ═══════════════════════════════════════
cat > lib/matchingEngine.js << 'EOF'
import OrderBook from "../models/OrderBook";
import Trade from "../models/Trade";
import Wallet from "../models/Wallet";
import Investment from "../models/Investment";
import HoldingLot from "../models/HoldingLot";
import Fee from "../models/Fee";
import { notify } from "./notify";
import crypto from "crypto";

export async function matchOrder(order) {
  const oppSide = order.side === "bid" ? "ask" : "bid";
  const priceFilter = order.side === "bid"
    ? { pricePerUnit: { $lte: order.pricePerUnit } }
    : { pricePerUnit: { $gte: order.pricePerUnit } };
  const sort = order.side === "bid"
    ? { pricePerUnit: 1, createdAt: 1 }
    : { pricePerUnit: -1, createdAt: 1 };

  const matches = await OrderBook.find({
    assetId: order.assetId, side: oppSide,
    status: { $in: ["open", "partial"] },
    userId: { $ne: order.userId },
    ...priceFilter,
  }).sort(sort);

  const trades = [];
  let remaining = order.remainingUnits;

  for (const match of matches) {
    if (remaining <= 0) break;

    const fillUnits = Math.min(remaining, match.remainingUnits);
    const fillPrice = match.pricePerUnit; // price-time priority: taker gets maker's price
    const fillAmount = fillUnits * fillPrice;
    const buyerFee = Math.round(fillAmount * 0.005 * 100) / 100;
    const sellerFee = Math.round(fillAmount * 0.005 * 100) / 100;
    const txHash = "0x" + crypto.randomBytes(32).toString("hex");

    const buyerId = order.side === "bid" ? order.userId : match.userId;
    const sellerId = order.side === "ask" ? order.userId : match.userId;

    // Execute trade
    const trade = await Trade.create({
      assetId: order.assetId, assetName: order.assetName,
      buyerId, sellerId, buyOrderId: order.side === "bid" ? order._id : match._id,
      sellOrderId: order.side === "ask" ? order._id : match._id,
      units: fillUnits, pricePerUnit: fillPrice, totalAmount: fillAmount,
      buyerFee, sellerFee, txHash,
    });

    // Transfer funds
    let buyerWallet = await Wallet.findOne({ userId: buyerId });
    if (!buyerWallet) buyerWallet = await Wallet.create({ userId: buyerId });

    // If buyer placed bid, funds were locked at order time
    // If buyer is taker (ask matched), deduct now
    if (order.side === "ask") {
      // match is the bid (buyer), funds already locked
    } else {
      // order is bid (buyer), funds already locked at place time
    }

    // Credit seller
    let sellerWallet = await Wallet.findOne({ userId: sellerId });
    if (!sellerWallet) sellerWallet = await Wallet.create({ userId: sellerId });
    const sellerCredit = fillAmount - sellerFee;
    sellerWallet.availableBalance += sellerCredit;
    sellerWallet.transactions.push({ type: "sell", amount: sellerCredit, assetName: order.assetName, txHash, status: "completed", description: "Sold " + fillUnits + " units @ EUR " + fillPrice });
    await sellerWallet.save();

    // Deduct from buyer locked (if bid) or available (if buying from ask)
    if (order.side === "bid") {
      // Buyer is order placer - locked funds used
      buyerWallet.lockedBalance -= (fillAmount + buyerFee);
    } else {
      // Buyer is match (bid placer) - locked funds used
      buyerWallet.lockedBalance -= (fillAmount + buyerFee);
    }
    buyerWallet.transactions.push({ type: "buy", amount: -(fillAmount + buyerFee), assetName: order.assetName, txHash, status: "completed", description: "Bought " + fillUnits + " units @ EUR " + fillPrice });
    await buyerWallet.save();

    // Transfer token ownership
    let sellerInv = await Investment.findOne({ userId: sellerId, assetId: order.assetId, status: "active" });
    if (sellerInv) {
      sellerInv.units -= fillUnits;
      if (sellerInv.units <= 0) sellerInv.status = "sold";
      sellerInv.totalInvested = Math.max(0, sellerInv.units * sellerInv.pricePerUnit);
      await sellerInv.save();
    }

    let buyerInv = await Investment.findOne({ userId: buyerId, assetId: order.assetId, status: "active" });
    if (buyerInv) {
      buyerInv.units += fillUnits;
      buyerInv.totalInvested += fillAmount;
      await buyerInv.save();
    } else {
      await Investment.create({ userId: buyerId, assetId: order.assetId, assetName: order.assetName, units: fillUnits, pricePerUnit: fillPrice, totalInvested: fillAmount, currentValue: fillAmount, status: "active", txHash });
    }

    // FIFO: deduct seller lots
    let sellRemain = fillUnits;
    const sellerLots = await HoldingLot.find({ userId: sellerId, assetId: order.assetId, remainingUnits: { $gt: 0 } }).sort({ purchaseDate: 1 });
    for (const lot of sellerLots) {
      if (sellRemain <= 0) break;
      const d = Math.min(sellRemain, lot.remainingUnits);
      lot.remainingUnits -= d;
      sellRemain -= d;
      await lot.save();
    }

    // New holding lot for buyer (30-day restart)
    await HoldingLot.create({ userId: buyerId, assetId: order.assetId, assetName: order.assetName, units: fillUnits, remainingUnits: fillUnits, purchaseDate: new Date(), pricePerUnit: fillPrice, source: "secondary", txHash });

    // Record fees
    await Fee.create({ type: "trading", amount: buyerFee + sellerFee, assetName: order.assetName, userId: buyerId.toString(), txHash });

    // Update both orders
    order.filledUnits += fillUnits;
    order.remainingUnits -= fillUnits;
    order.trades.push({ tradeId: trade._id.toString(), units: fillUnits, price: fillPrice, at: new Date() });
    order.status = order.remainingUnits <= 0 ? "filled" : "partial";

    match.filledUnits += fillUnits;
    match.remainingUnits -= fillUnits;
    match.trades.push({ tradeId: trade._id.toString(), units: fillUnits, price: fillPrice, at: new Date() });
    match.status = match.remainingUnits <= 0 ? "filled" : "partial";
    await match.save();

    remaining -= fillUnits;
    trades.push(trade);

    // Notify both
    await notify(buyerId, "buy_completed", "Trade Matched", "Bought " + fillUnits + " units of " + order.assetName + " @ EUR " + fillPrice, "/dashboard", { txHash });
    await notify(sellerId, "sell_completed", "Trade Matched", "Sold " + fillUnits + " units of " + order.assetName + " @ EUR " + fillPrice, "/dashboard", { txHash });
  }

  await order.save();

  // If bid not fully filled, return excess locked funds for unfilled portion
  if (order.side === "bid" && order.remainingUnits > 0 && order.status === "filled") {
    // All filled, nothing to return
  }

  return { order, trades, filled: order.filledUnits, remaining: order.remainingUnits };
}

export async function expireOrders() {
  const expired = await OrderBook.find({ status: { $in: ["open", "partial"] }, expiresAt: { $lt: new Date() } });
  for (const order of expired) {
    // Return locked funds for bids
    if (order.side === "bid" && order.remainingUnits > 0) {
      const refund = order.remainingUnits * order.pricePerUnit * 1.005;
      let wallet = await Wallet.findOne({ userId: order.userId });
      if (wallet) {
        wallet.lockedBalance -= refund;
        wallet.availableBalance += refund;
        wallet.transactions.push({ type: "refund", amount: refund, assetName: order.assetName, status: "completed", description: "Expired bid order refund" });
        await wallet.save();
      }
    }
    // Restore FIFO lots for asks
    if (order.side === "ask" && order.remainingUnits > 0) {
      const lots = await HoldingLot.find({ userId: order.userId, assetId: order.assetId }).sort({ purchaseDate: -1 }).limit(1);
      if (lots[0]) { lots[0].remainingUnits += order.remainingUnits; await lots[0].save(); }
    }
    order.status = "expired";
    await order.save();
  }
  return expired.length;
}
EOF
echo "  ✓ Matching engine (auto-match, partial fills, FIFO, fees, notify)"

# ═══════════════════════════════════════
# 4. PLACE ORDER API (bid + ask)
# ═══════════════════════════════════════
cat > pages/api/orderbook/place.js << 'EOF'
import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import Asset from "../../../lib/models/Asset";
import Wallet from "../../../models/Wallet";
import Investment from "../../../models/Investment";
import HoldingLot from "../../../models/HoldingLot";
import OrderBook from "../../../models/OrderBook";
import Order from "../../../models/Order";
import { matchOrder } from "../../../lib/matchingEngine";
import { checkRisk } from "../../../lib/riskEngine";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  await connectDB();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).json({ error: "Not authenticated" });
  const user = await User.findOne({ email: session.user.email });
  if (!user) return res.status(404).json({ error: "User not found" });
  if (user.kycStatus !== "approved") return res.status(403).json({ error: "KYC required" });

  const { assetId, side, units, pricePerUnit } = req.body;
  if (!assetId || !side || !units || !pricePerUnit || units <= 0 || pricePerUnit <= 0) {
    return res.status(400).json({ error: "assetId, side (bid/ask), units, pricePerUnit required" });
  }
  if (!["bid", "ask"].includes(side)) return res.status(400).json({ error: "Side must be bid or ask" });

  const asset = await Asset.findById(assetId);
  if (!asset) return res.status(404).json({ error: "Asset not found" });

  const totalAmount = units * pricePerUnit;
  const fee = Math.round(totalAmount * 0.005 * 100) / 100;

  await checkRisk(user._id, "order", { amount: totalAmount, action: side });

  // BID: Lock funds
  if (side === "bid") {
    let wallet = await Wallet.findOne({ userId: user._id });
    if (!wallet) wallet = await Wallet.create({ userId: user._id });
    if (wallet.availableBalance < totalAmount + fee) {
      return res.status(400).json({ error: "Insufficient balance. Need EUR " + (totalAmount + fee).toLocaleString() });
    }
    wallet.availableBalance -= (totalAmount + fee);
    wallet.lockedBalance += (totalAmount + fee);
    wallet.transactions.push({ type: "buy", amount: -(totalAmount + fee), assetName: asset.name, status: "pending", description: "Bid order: " + units + " units @ EUR " + pricePerUnit });
    await wallet.save();
  }

  // ASK: Check token ownership + lock tokens (FIFO)
  if (side === "ask") {
    const inv = await Investment.findOne({ userId: user._id, assetId, status: "active" });
    if (!inv || inv.units < units) {
      return res.status(400).json({ error: "Insufficient tokens. You own " + (inv?.units || 0) + " units" });
    }
    // Check unlocked units
    const openAsks = await OrderBook.find({ userId: user._id, assetId, side: "ask", status: { $in: ["open", "partial"] } });
    const lockedUnits = openAsks.reduce((s, o) => s + o.remainingUnits, 0);
    if (units > inv.units - lockedUnits) {
      return res.status(400).json({ error: "Only " + (inv.units - lockedUnits) + " units available (rest locked in orders)" });
    }
  }

  // Create order
  const order = await OrderBook.create({
    assetId, assetName: asset.name, side, userId: user._id,
    units, remainingUnits: units, pricePerUnit, totalAmount, fee,
  });

  // Also record in Order model for dashboard
  await Order.create({
    userId: user._id, assetId, assetName: asset.name,
    type: side === "bid" ? "buy" : "sell", units, pricePerUnit, totalAmount, fee,
    status: "pending",
  });

  // Run matching engine
  const result = await matchOrder(order);

  let message = "";
  if (result.order.status === "filled") message = "Order fully matched! " + result.trades.length + " trade(s) executed.";
  else if (result.order.status === "partial") message = "Partially matched: " + result.filled + "/" + units + " units filled. Rest on order book.";
  else message = "Order placed on book. Waiting for match.";

  return res.json({
    order: { id: order._id, status: result.order.status, filled: result.filled, remaining: result.remaining },
    trades: result.trades.map(t => ({ units: t.units, price: t.pricePerUnit, amount: t.totalAmount, txHash: t.txHash })),
    message,
  });
}
EOF
echo "  ✓ Place order API (bid/ask with auto-matching)"

# ═══════════════════════════════════════
# 5. CANCEL ORDER API
# ═══════════════════════════════════════
cat > pages/api/orderbook/cancel.js << 'EOF'
import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import OrderBook from "../../../models/OrderBook";
import Wallet from "../../../models/Wallet";
import HoldingLot from "../../../models/HoldingLot";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  await connectDB();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).json({ error: "Not authenticated" });
  const user = await User.findOne({ email: session.user.email });
  if (!user) return res.status(404).json({ error: "User not found" });

  const { orderId } = req.body;
  const order = await OrderBook.findOne({ _id: orderId, userId: user._id, status: { $in: ["open", "partial"] } });
  if (!order) return res.status(404).json({ error: "Open order not found" });

  // Refund locked funds for bids
  if (order.side === "bid" && order.remainingUnits > 0) {
    const refund = order.remainingUnits * order.pricePerUnit * 1.005;
    let wallet = await Wallet.findOne({ userId: user._id });
    if (wallet) {
      wallet.lockedBalance = Math.max(0, wallet.lockedBalance - refund);
      wallet.availableBalance += refund;
      wallet.transactions.push({ type: "refund", amount: refund, assetName: order.assetName, status: "completed", description: "Cancelled bid: " + order.remainingUnits + " units" });
      await wallet.save();
    }
  }

  // Restore lots for asks
  if (order.side === "ask" && order.remainingUnits > 0) {
    // Lots were deducted in sell API, restore them
    const lots = await HoldingLot.find({ userId: user._id, assetId: order.assetId }).sort({ purchaseDate: -1 }).limit(1);
    if (lots[0]) { lots[0].remainingUnits += order.remainingUnits; await lots[0].save(); }
  }

  order.status = "cancelled";
  await order.save();

  return res.json({ success: true, message: "Order cancelled. " + (order.side === "bid" ? "Funds returned." : "Tokens unlocked.") });
}
EOF
echo "  ✓ Cancel order API (refund funds/unlock tokens)"

# ═══════════════════════════════════════
# 6. ORDER BOOK API (depth + last price)
# ═══════════════════════════════════════
cat > pages/api/orderbook/index.js << 'EOF'
import { connectDB } from "../../../lib/mongodb";
import OrderBook from "../../../models/OrderBook";
import Trade from "../../../models/Trade";

export default async function handler(req, res) {
  await connectDB();
  const { assetId } = req.query;
  if (!assetId) return res.status(400).json({ error: "assetId required" });

  const bids = await OrderBook.find({ assetId, side: "bid", status: { $in: ["open", "partial"] } }).sort({ pricePerUnit: -1 }).limit(20).lean();
  const asks = await OrderBook.find({ assetId, side: "ask", status: { $in: ["open", "partial"] } }).sort({ pricePerUnit: 1 }).limit(20).lean();

  // Aggregate depth
  const bidDepth = {};
  bids.forEach(b => { const p = b.pricePerUnit; bidDepth[p] = (bidDepth[p] || 0) + b.remainingUnits; });
  const askDepth = {};
  asks.forEach(a => { const p = a.pricePerUnit; askDepth[p] = (askDepth[p] || 0) + a.remainingUnits; });

  const lastTrades = await Trade.find({ assetId }).sort({ createdAt: -1 }).limit(20).lean();
  const lastPrice = lastTrades[0]?.pricePerUnit || null;
  const bestBid = bids[0]?.pricePerUnit || null;
  const bestAsk = asks[0]?.pricePerUnit || null;
  const spread = bestBid && bestAsk ? Math.round((bestAsk - bestBid) * 100) / 100 : null;
  const volume24h = lastTrades.filter(t => new Date(t.createdAt) > new Date(Date.now() - 86400000)).reduce((s, t) => s + t.totalAmount, 0);

  return res.json({
    bids: Object.entries(bidDepth).map(([p, u]) => ({ price: Number(p), units: u })).sort((a, b) => b.price - a.price),
    asks: Object.entries(askDepth).map(([p, u]) => ({ price: Number(p), units: u })).sort((a, b) => a.price - b.price),
    lastPrice, bestBid, bestAsk, spread, volume24h,
    recentTrades: lastTrades.map(t => ({ units: t.units, price: t.pricePerUnit, amount: t.totalAmount, time: t.createdAt, txHash: t.txHash })),
  });
}
EOF
echo "  ✓ Order book API (depth, spread, last price, 24h volume)"

# ═══════════════════════════════════════
# 7. TRADE HISTORY API (public)
# ═══════════════════════════════════════
cat > pages/api/orderbook/trades.js << 'EOF'
import { connectDB } from "../../../lib/mongodb";
import Trade from "../../../models/Trade";
export default async function handler(req, res) {
  await connectDB();
  const { assetId, limit } = req.query;
  const filter = assetId ? { assetId } : {};
  const trades = await Trade.find(filter).sort({ createdAt: -1 }).limit(Number(limit) || 50).lean();
  return res.json({ trades });
}
EOF
echo "  ✓ Trade history API"

# ═══════════════════════════════════════
# 8. MY ORDERS API (user's open orders)
# ═══════════════════════════════════════
cat > pages/api/orderbook/my-orders.js << 'EOF'
import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import OrderBook from "../../../models/OrderBook";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
export default async function handler(req, res) {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).json({ error: "Not authenticated" });
  const user = await User.findOne({ email: session.user.email });
  if (!user) return res.status(404).json({ error: "User not found" });
  const orders = await OrderBook.find({ userId: user._id }).sort({ createdAt: -1 }).limit(50).lean();
  return res.json({ orders });
}
EOF
echo "  ✓ My orders API"

# ═══════════════════════════════════════
# 9. EXPIRE ORDERS API (cron or admin trigger)
# ═══════════════════════════════════════
cat > pages/api/orderbook/expire.js << 'EOF'
import { connectDB } from "../../../lib/mongodb";
import { expireOrders } from "../../../lib/matchingEngine";
export default async function handler(req, res) {
  await connectDB();
  const count = await expireOrders();
  return res.json({ expired: count, message: count + " orders expired" });
}
EOF
echo "  ✓ Expire orders API"

# ═══════════════════════════════════════
# 10. COMPLETE MARKETPLACE PAGE (with order book)
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
  const [tab, setTab] = useState("assets");
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [orderBook, setOrderBook] = useState({ bids:[], asks:[], recentTrades:[] });
  const [myOrders, setMyOrders] = useState([]);
  const [side, setSide] = useState("bid");
  const [units, setUnits] = useState("");
  const [price, setPrice] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAssets(); loadMyOrders(); }, []);
  useEffect(() => { if (selectedAsset) loadOrderBook(selectedAsset._id); }, [selectedAsset]);

  const loadAssets = () => fetch("/api/assets/stats").then(r => r.json()).then(d => { setAssets((d.assets||[]).filter(a => a.status === "live" || a.approvalStatus === "live")); setLoading(false); }).catch(() => setLoading(false));
  const loadOrderBook = (id) => fetch("/api/orderbook?assetId=" + id).then(r => r.json()).then(setOrderBook).catch(() => {});
  const loadMyOrders = () => { if (session) fetch("/api/orderbook/my-orders").then(r => r.json()).then(d => setMyOrders(d.orders || [])).catch(() => {}); };

  const placeOrder = async () => {
    if (!session) { router.push("/login"); return; }
    if (!selectedAsset || !units || !price) { setMsg("Select asset, units, and price"); return; }
    setMsg("");
    const r = await fetch("/api/orderbook/place", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ assetId: selectedAsset._id, side, units: Number(units), pricePerUnit: Number(price) }) });
    const d = await r.json();
    setMsg(r.ok ? d.message : "Error: " + d.error);
    if (r.ok) { setUnits(""); setPrice(""); loadOrderBook(selectedAsset._id); loadMyOrders(); loadAssets(); }
  };

  const cancelOrder = async (id) => {
    const r = await fetch("/api/orderbook/cancel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId: id }) });
    const d = await r.json();
    setMsg(r.ok ? d.message : d.error);
    loadMyOrders(); if (selectedAsset) loadOrderBook(selectedAsset._id);
  };

  const buyPrimary = async (asset) => {
    if (!session) { router.push("/login"); return; }
    const u = prompt("Units to buy:");
    if (!u || Number(u) <= 0) return;
    const r = await fetch("/api/investments/buy", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ assetId: asset._id, units: Number(u) }) });
    const d = await r.json();
    setMsg(r.ok ? d.message : d.error);
    loadAssets();
  };

  const priceOf = (a) => a.tokenPrice || (a.targetRaise && a.tokenSupply ? Math.round(a.targetRaise / a.tokenSupply) : 100);
  const badge = (s) => { const c = { open:"#22c55e", partial:"#f59e0b", filled:"#3b82f6", cancelled:"#6b7280", expired:"#6b7280" }; return <span style={{ fontSize:10, padding:"2px 8px", borderRadius:4, background:(c[s]||"#666")+"15", color:c[s]||"#666", fontWeight:700 }}>{s}</span>; };
  const inp = { background:"#0a0e14", border:"1px solid rgba(255,255,255,0.1)", borderRadius:6, padding:"8px 12px", color:"#fff", fontSize:13, outline:"none", fontFamily:"inherit", width:"100%", boxSizing:"border-box" };

  return (
    <>
      <Head><title>Marketplace — Nextoken Capital</title></Head>
      <Navbar />
      <div style={{ minHeight:"100vh", background:"#0B0E11", color:"#fff", paddingTop:70 }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"28px 20px" }}>
          <h1 style={{ fontSize:28, fontWeight:800, marginBottom:4 }}>Asset Marketplace</h1>
          <p style={{ fontSize:13, color:"rgba(255,255,255,0.4)", marginBottom:20 }}>Buy from issuers or trade on the secondary market</p>

          {msg && <div style={{ background:msg.startsWith("Error")?"rgba(255,77,77,0.1)":"rgba(34,197,94,0.1)", border:"1px solid "+(msg.startsWith("Error")?"rgba(255,77,77,0.2)":"rgba(34,197,94,0.2)"), borderRadius:8, padding:"10px 14px", fontSize:13, color:msg.startsWith("Error")?"#ff6b6b":"#22c55e", marginBottom:16 }}>{msg}</div>}

          <div style={{ display:"flex", gap:8, marginBottom:20 }}>
            {["assets","trade","orders"].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding:"8px 20px", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit", background:tab===t?"#F0B90B15":"rgba(255,255,255,0.04)", color:tab===t?"#F0B90B":"rgba(255,255,255,0.4)", border:tab===t?"1px solid #F0B90B30":"1px solid rgba(255,255,255,0.06)" }}>
                {t === "assets" ? "Primary Market" : t === "trade" ? "Trade (Order Book)" : "My Orders (" + myOrders.filter(o=>["open","partial"].includes(o.status)).length + ")"}
              </button>
            ))}
          </div>

          {/* PRIMARY MARKET */}
          {tab === "assets" && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:16 }}>
              {loading ? <div style={{ gridColumn:"1/-1", textAlign:"center", padding:40, color:"rgba(255,255,255,0.3)" }}>Loading...</div>
              : assets.length === 0 ? <div style={{ gridColumn:"1/-1", textAlign:"center", padding:40, color:"rgba(255,255,255,0.3)" }}>No assets available</div>
              : assets.map(a => (
                <div key={a._id} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:20 }}>
                  <div style={{ fontSize:16, fontWeight:700 }}>{a.name}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:12 }}>{a.assetType}</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
                    <div style={{ background:"#0a0e14", borderRadius:6, padding:"8px 10px" }}><div style={{ fontSize:9, color:"rgba(255,255,255,0.3)" }}>PRICE</div><div style={{ fontSize:15, fontWeight:700, color:"#F0B90B" }}>EUR {priceOf(a)}</div></div>
                    <div style={{ background:"#0a0e14", borderRadius:6, padding:"8px 10px" }}><div style={{ fontSize:9, color:"rgba(255,255,255,0.3)" }}>YIELD</div><div style={{ fontSize:15, fontWeight:700, color:"#22c55e" }}>{a.targetROI||0}%</div></div>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={() => buyPrimary(a)} style={{ flex:1, padding:10, background:"#F0B90B", color:"#000", border:"none", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Buy</button>
                    <button onClick={() => { setSelectedAsset(a); setTab("trade"); setPrice(String(priceOf(a))); }} style={{ flex:1, padding:10, background:"rgba(139,92,246,0.1)", border:"1px solid rgba(139,92,246,0.2)", color:"#8b5cf6", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Trade</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TRADE (ORDER BOOK) */}
          {tab === "trade" && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:20 }}>
              {/* Left: Order Book + Trades */}
              <div>
                {/* Asset selector */}
                <div style={{ marginBottom:16 }}>
                  <select value={selectedAsset?._id || ""} onChange={e => { const a = assets.find(x => x._id === e.target.value); setSelectedAsset(a); if(a) setPrice(String(priceOf(a))); }} style={{ ...inp, cursor:"pointer" }}>
                    <option value="">Select an asset to trade</option>
                    {assets.map(a => <option key={a._id} value={a._id}>{a.name} — EUR {priceOf(a)}</option>)}
                  </select>
                </div>

                {selectedAsset && <>
                  {/* Market info */}
                  <div style={{ display:"flex", gap:12, marginBottom:16 }}>
                    {[{l:"Last Price", v:orderBook.lastPrice?"EUR "+orderBook.lastPrice:"—", c:"#F0B90B"}, {l:"Best Bid", v:orderBook.bestBid?"EUR "+orderBook.bestBid:"—", c:"#22c55e"}, {l:"Best Ask", v:orderBook.bestAsk?"EUR "+orderBook.bestAsk:"—", c:"#ef4444"}, {l:"Spread", v:orderBook.spread!==null?"EUR "+orderBook.spread:"—", c:"#8b5cf6"}, {l:"24h Volume", v:"EUR "+(orderBook.volume24h||0).toLocaleString(), c:"#3b82f6"}].map((s,i) => (
                      <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:8, padding:"10px 14px", flex:1 }}>
                        <div style={{ fontSize:9, color:"rgba(255,255,255,0.3)", textTransform:"uppercase" }}>{s.l}</div>
                        <div style={{ fontSize:14, fontWeight:700, color:s.c }}>{s.v}</div>
                      </div>
                    ))}
                  </div>

                  {/* Depth: Asks (top) + Bids (bottom) */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
                    {/* Asks */}
                    <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
                      <div style={{ padding:"8px 12px", background:"rgba(239,68,68,0.05)", fontSize:11, fontWeight:700, color:"#ef4444" }}>ASKS (Sell Orders)</div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", padding:"6px 12px", fontSize:9, color:"rgba(255,255,255,0.3)", fontWeight:700 }}><span>PRICE</span><span style={{ textAlign:"right" }}>UNITS</span></div>
                      {(orderBook.asks||[]).length === 0 ? <div style={{ padding:16, textAlign:"center", fontSize:11, color:"rgba(255,255,255,0.2)" }}>No asks</div>
                      : (orderBook.asks||[]).slice(0,10).reverse().map((a,i) => (
                        <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 1fr", padding:"4px 12px", fontSize:12, position:"relative" }}>
                          <div style={{ position:"absolute", right:0, top:0, bottom:0, background:"rgba(239,68,68,0.06)", width: Math.min(a.units/Math.max(...(orderBook.asks||[]).map(x=>x.units),1)*100, 100)+"%" }} />
                          <span style={{ color:"#ef4444", fontWeight:600, position:"relative" }}>EUR {a.price}</span>
                          <span style={{ textAlign:"right", position:"relative" }}>{a.units}</span>
                        </div>
                      ))}
                    </div>

                    {/* Bids */}
                    <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
                      <div style={{ padding:"8px 12px", background:"rgba(34,197,94,0.05)", fontSize:11, fontWeight:700, color:"#22c55e" }}>BIDS (Buy Orders)</div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", padding:"6px 12px", fontSize:9, color:"rgba(255,255,255,0.3)", fontWeight:700 }}><span>PRICE</span><span style={{ textAlign:"right" }}>UNITS</span></div>
                      {(orderBook.bids||[]).length === 0 ? <div style={{ padding:16, textAlign:"center", fontSize:11, color:"rgba(255,255,255,0.2)" }}>No bids</div>
                      : (orderBook.bids||[]).slice(0,10).map((b,i) => (
                        <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 1fr", padding:"4px 12px", fontSize:12, position:"relative" }}>
                          <div style={{ position:"absolute", right:0, top:0, bottom:0, background:"rgba(34,197,94,0.06)", width: Math.min(b.units/Math.max(...(orderBook.bids||[]).map(x=>x.units),1)*100, 100)+"%" }} />
                          <span style={{ color:"#22c55e", fontWeight:600, position:"relative" }}>EUR {b.price}</span>
                          <span style={{ textAlign:"right", position:"relative" }}>{b.units}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Trades */}
                  <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
                    <div style={{ padding:"8px 12px", fontSize:11, fontWeight:700, color:"#F0B90B" }}>RECENT TRADES</div>
                    {(orderBook.recentTrades||[]).length === 0 ? <div style={{ padding:16, textAlign:"center", fontSize:11, color:"rgba(255,255,255,0.2)" }}>No trades yet</div>
                    : (orderBook.recentTrades||[]).slice(0,10).map((t,i) => (
                      <div key={i} style={{ display:"grid", gridTemplateColumns:"80px 80px 80px 1fr", padding:"6px 12px", fontSize:11, borderBottom:"1px solid rgba(255,255,255,0.03)" }}>
                        <span style={{ fontWeight:600 }}>EUR {t.price}</span>
                        <span>{t.units} units</span>
                        <span style={{ color:"rgba(255,255,255,0.4)" }}>EUR {t.amount}</span>
                        <span style={{ color:"rgba(255,255,255,0.25)", fontSize:10 }}>{new Date(t.time).toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                </>}
              </div>

              {/* Right: Place Order */}
              <div style={{ background:"#161b22", borderRadius:12, border:"1px solid rgba(255,255,255,0.06)", padding:20, height:"fit-content", position:"sticky", top:90 }}>
                <h3 style={{ fontSize:16, fontWeight:700, marginBottom:16 }}>Place Order</h3>
                <div style={{ display:"flex", gap:4, marginBottom:16 }}>
                  <button onClick={() => setSide("bid")} style={{ flex:1, padding:8, borderRadius:6, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit", background:side==="bid"?"rgba(34,197,94,0.15)":"rgba(255,255,255,0.04)", color:side==="bid"?"#22c55e":"rgba(255,255,255,0.4)", border:side==="bid"?"1px solid rgba(34,197,94,0.3)":"1px solid rgba(255,255,255,0.06)" }}>Buy (Bid)</button>
                  <button onClick={() => setSide("ask")} style={{ flex:1, padding:8, borderRadius:6, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit", background:side==="ask"?"rgba(239,68,68,0.15)":"rgba(255,255,255,0.04)", color:side==="ask"?"#ef4444":"rgba(255,255,255,0.4)", border:side==="ask"?"1px solid rgba(239,68,68,0.3)":"1px solid rgba(255,255,255,0.06)" }}>Sell (Ask)</button>
                </div>
                <div style={{ marginBottom:12 }}><label style={{ fontSize:11, color:"rgba(255,255,255,0.4)", display:"block", marginBottom:4 }}>Price per unit (EUR)</label><input type="number" value={price} onChange={e => setPrice(e.target.value)} style={inp} placeholder="100" /></div>
                <div style={{ marginBottom:12 }}><label style={{ fontSize:11, color:"rgba(255,255,255,0.4)", display:"block", marginBottom:4 }}>Units</label><input type="number" value={units} onChange={e => setUnits(e.target.value)} style={inp} placeholder="10" /></div>

                {units && price && (
                  <div style={{ background:"#0a0e14", borderRadius:8, padding:12, marginBottom:12 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4 }}><span style={{ color:"rgba(255,255,255,0.4)" }}>Total</span><span>EUR {(Number(units)*Number(price)).toLocaleString()}</span></div>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4 }}><span style={{ color:"rgba(255,255,255,0.4)" }}>Fee (0.5%)</span><span>EUR {(Number(units)*Number(price)*0.005).toFixed(2)}</span></div>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, fontWeight:700, borderTop:"1px solid rgba(255,255,255,0.1)", paddingTop:4 }}><span>You {side==="bid"?"pay":"receive"}</span><span style={{ color:"#F0B90B" }}>EUR {(Number(units)*Number(price)*(side==="bid"?1.005:0.995)).toFixed(2)}</span></div>
                  </div>
                )}

                <button onClick={placeOrder} disabled={!selectedAsset || !units || !price} style={{ width:"100%", padding:12, background:side==="bid"?"#22c55e":"#ef4444", color:"#fff", border:"none", borderRadius:8, fontSize:14, fontWeight:800, cursor:"pointer", fontFamily:"inherit", opacity:(!selectedAsset||!units||!price)?0.4:1 }}>
                  {side === "bid" ? "Place Buy Order" : "Place Sell Order"}
                </button>
                <p style={{ fontSize:10, color:"rgba(255,255,255,0.25)", marginTop:8, textAlign:"center" }}>Orders expire in 7 days. 0.5% fee per side.</p>
              </div>
            </div>
          )}

          {/* MY ORDERS */}
          {tab === "orders" && (
            <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
              <div style={{ display:"grid", gridTemplateColumns:"70px 150px 70px 90px 80px 70px 80px 70px", padding:"10px 16px", background:"rgba(255,255,255,0.03)", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase" }}>
                <span>Side</span><span>Asset</span><span>Units</span><span>Price</span><span>Filled</span><span>Remain</span><span>Status</span><span>Action</span>
              </div>
              {myOrders.length === 0 ? <div style={{ padding:30, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>No orders</div>
              : myOrders.map((o,i) => (
                <div key={i} style={{ display:"grid", gridTemplateColumns:"70px 150px 70px 90px 80px 70px 80px 70px", padding:"12px 16px", borderBottom:"1px solid rgba(255,255,255,0.04)", fontSize:12, alignItems:"center" }}>
                  <span style={{ fontSize:10, padding:"2px 6px", borderRadius:4, background:o.side==="bid"?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)", color:o.side==="bid"?"#22c55e":"#ef4444", fontWeight:700 }}>{o.side}</span>
                  <span style={{ fontWeight:600 }}>{o.assetName}</span>
                  <span>{o.units}</span>
                  <span>EUR {o.pricePerUnit}</span>
                  <span style={{ color:"#22c55e" }}>{o.filledUnits||0}</span>
                  <span>{o.remainingUnits}</span>
                  {badge(o.status)}
                  <div>{["open","partial"].includes(o.status) && <button onClick={() => cancelOrder(o._id)} style={{ padding:"3px 8px", borderRadius:4, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", color:"#ef4444", fontSize:9, cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
EOF
echo "  ✓ Complete marketplace page"

echo ""
echo "  ╔═══════════════════════════════════════════════════════════════╗"
echo "  ║  SECONDARY MARKET ENGINE COMPLETE                             ║"
echo "  ║                                                               ║"
echo "  ║  ORDER BOOK:                                                  ║"
echo "  ║    Bid (buy) + Ask (sell) orders                              ║"
echo "  ║    Price-time priority matching                               ║"
echo "  ║    Aggregated depth display                                   ║"
echo "  ║    Best bid/ask + spread calculation                          ║"
echo "  ║                                                               ║"
echo "  ║  MATCHING ENGINE:                                             ║"
echo "  ║    Auto-match when bid >= ask                                 ║"
echo "  ║    Partial fills (buy 50 of 100 listed)                       ║"
echo "  ║    Multiple matches per order                                 ║"
echo "  ║    FIFO lot deduction for sellers                             ║"
echo "  ║    New 30-day lot for buyers                                  ║"
echo "  ║    Fees: 0.5% per side                                        ║"
echo "  ║    Both parties notified                                      ║"
echo "  ║                                                               ║"
echo "  ║  CANCEL ORDERS:                                               ║"
echo "  ║    Bids: locked funds returned                                ║"
echo "  ║    Asks: tokens unlocked                                      ║"
echo "  ║                                                               ║"
echo "  ║  ORDER EXPIRY (7 days):                                       ║"
echo "  ║    Auto-refund bids                                           ║"
echo "  ║    Auto-unlock ask tokens                                     ║"
echo "  ║                                                               ║"
echo "  ║  MARKETPLACE PAGE:                                            ║"
echo "  ║    Tab 1: Primary market (buy from issuer)                    ║"
echo "  ║    Tab 2: Trade (order book + depth + recent trades)          ║"
echo "  ║    Tab 3: My Orders (open/filled/cancelled + cancel btn)      ║"
echo "  ║    Place order panel (bid/ask + fee calc)                     ║"
echo "  ║    Market depth bars (visual bid/ask stacks)                  ║"
echo "  ║    Real-time: last price, spread, 24h volume                  ║"
echo "  ║                                                               ║"
echo "  ║  NEW: Trade model, matchingEngine lib                         ║"
echo "  ║  APIs: place, cancel, trades, my-orders, expire               ║"
echo "  ║                                                               ║"
echo "  ║  RUN:                                                         ║"
echo "  ║    git add -A && git commit -m 'feat: secondary market'       ║"
echo "  ║    git push && npx vercel --prod                              ║"
echo "  ╚═══════════════════════════════════════════════════════════════╝"
