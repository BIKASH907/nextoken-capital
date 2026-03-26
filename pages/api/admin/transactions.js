import { requireAdmin } from "../../../lib/adminAuth";
import dbConnect from "../../../lib/db";
import Order from "../../../models/Order";
import Wallet from "../../../models/Wallet";
import Fee from "../../../models/Fee";
async function handler(req, res) {
  await dbConnect();
  const { from, to, type, status } = req.query;
  const filter = {};
  if (from || to) { filter.createdAt = {}; if(from) filter.createdAt.$gte = new Date(from); if(to) filter.createdAt.$lte = new Date(to); }
  if (type) filter.type = type;
  if (status) filter.status = status;
  const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(200).lean();
  const fees = await Fee.find().sort({ createdAt: -1 }).limit(100).lean();
  const stats = {
    totalOrders: orders.length,
    totalVolume: orders.reduce((s,o) => s + (o.totalAmount||0), 0),
    completed: orders.filter(o => o.status === "completed").length,
    pending: orders.filter(o => o.status === "pending").length,
    failed: orders.filter(o => o.status === "failed").length,
    totalFees: fees.reduce((s,f) => s + f.amount, 0),
  };
  return res.json({ orders, fees: fees.slice(0,50), stats });
}
export default requireAdmin(handler);
