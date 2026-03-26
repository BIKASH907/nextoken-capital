import { requireAdmin } from "../../../lib/adminAuth";
import dbConnect from "../../../lib/db";
import Asset from "../../../lib/models/Asset";
import Order from "../../../models/Order";
import OrderBook from "../../../models/OrderBook";
async function handler(req, res) {
  await dbConnect();
  const assets = await Asset.find().lean();
  const orders = await Order.find({ status: "completed" }).sort({ createdAt: -1 }).limit(500).lean();
  const openOrders = await OrderBook.find({ status: { $in: ["open","partial"] } }).lean();
  const marketData = assets.map(a => {
    const assetOrders = orders.filter(o => o.assetId?.toString() === a._id.toString());
    const lastOrder = assetOrders[0];
    const volume24h = assetOrders.filter(o => new Date(o.createdAt) > new Date(Date.now()-24*60*60*1000)).reduce((s,o)=>s+o.totalAmount,0);
    const bids = openOrders.filter(o => o.assetId?.toString() === a._id.toString() && o.side === "bid");
    const asks = openOrders.filter(o => o.assetId?.toString() === a._id.toString() && o.side === "ask");
    return { name: a.name, type: a.assetType, status: a.status || a.approvalStatus, price: lastOrder?.pricePerUnit || a.tokenPrice || 0, volume24h, trades: assetOrders.length, bids: bids.length, asks: asks.length, bestBid: bids[0]?.pricePerUnit || 0, bestAsk: asks[0]?.pricePerUnit || 0 };
  });
  return res.json({ assets: marketData, totalAssets: assets.length, totalVolume: orders.reduce((s,o)=>s+o.totalAmount,0), openOrders: openOrders.length });
}
export default requireAdmin(handler);
