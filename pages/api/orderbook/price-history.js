import { connectDB } from "../../../lib/mongodb";
import Trade from "../../../models/Trade";

export default async function handler(req, res) {
  await connectDB();
  const { assetId, period } = req.query;
  if (!assetId) return res.status(400).json({ error: "assetId required" });

  const days = period === "7d" ? 7 : period === "30d" ? 30 : period === "90d" ? 90 : 7;
  const since = new Date(Date.now() - days * 86400000);

  const trades = await Trade.find({ assetId, createdAt: { $gte: since } }).sort({ createdAt: 1 }).lean();

  // Group by day for chart
  const daily = {};
  trades.forEach(t => {
    const day = new Date(t.createdAt).toISOString().split("T")[0];
    if (!daily[day]) daily[day] = { date: day, open: t.pricePerUnit, high: t.pricePerUnit, low: t.pricePerUnit, close: t.pricePerUnit, volume: 0, trades: 0 };
    daily[day].high = Math.max(daily[day].high, t.pricePerUnit);
    daily[day].low = Math.min(daily[day].low, t.pricePerUnit);
    daily[day].close = t.pricePerUnit;
    daily[day].volume += t.totalAmount;
    daily[day].trades += 1;
  });

  const allTrades = trades.map(t => ({
    price: t.pricePerUnit, units: t.units, amount: t.totalAmount,
    time: t.createdAt, txHash: t.txHash,
  }));

  // Stats
  const prices = trades.map(t => t.pricePerUnit);
  const high = prices.length ? Math.max(...prices) : 0;
  const low = prices.length ? Math.min(...prices) : 0;
  const avg = prices.length ? Math.round(prices.reduce((s,p) => s+p, 0) / prices.length * 100) / 100 : 0;
  const totalVolume = trades.reduce((s,t) => s + t.totalAmount, 0);
  const change = prices.length >= 2 ? Math.round((prices[prices.length-1] - prices[0]) / prices[0] * 10000) / 100 : 0;

  return res.json({
    candles: Object.values(daily),
    trades: allTrades.slice(-50).reverse(),
    stats: { high, low, avg, totalVolume, totalTrades: trades.length, change },
  });
}
