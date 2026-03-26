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
