import { connectDB } from "../../../lib/mongodb";
import OrderBook from "../../../models/OrderBook";
export default async function handler(req, res) {
  await connectDB();
  const { assetId } = req.query;
  if (!assetId) return res.status(400).json({ error: "assetId required" });
  const bids = await OrderBook.find({ assetId, side: "bid", status: { $in: ["open","partial"] } }).sort({ pricePerUnit: -1 }).limit(20).lean();
  const asks = await OrderBook.find({ assetId, side: "ask", status: { $in: ["open","partial"] } }).sort({ pricePerUnit: 1 }).limit(20).lean();
  const lastTrade = await OrderBook.findOne({ assetId, status: "filled" }).sort({ updatedAt: -1 }).lean();
  const spread = asks[0] && bids[0] ? (asks[0].pricePerUnit - bids[0].pricePerUnit).toFixed(2) : null;
  return res.json({ bids, asks, lastPrice: lastTrade?.pricePerUnit, spread, bestBid: bids[0]?.pricePerUnit, bestAsk: asks[0]?.pricePerUnit });
}
