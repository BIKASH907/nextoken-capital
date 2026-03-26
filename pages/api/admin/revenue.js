import { requireAdmin } from "../../../lib/adminAuth";
import dbConnect from "../../../lib/db";
import Fee from "../../../models/Fee";
async function handler(req, res) {
  await dbConnect();
  if (req.method === "GET") {
    const { from, to } = req.query;
    const filter = {};
    if (from || to) { filter.createdAt = {}; if(from) filter.createdAt.$gte = new Date(from); if(to) filter.createdAt.$lte = new Date(to); }
    const fees = await Fee.find(filter).sort({ createdAt: -1 }).limit(500).lean();
    const stats = {
      totalRevenue: fees.reduce((s,f) => s + f.amount, 0),
      trading: fees.filter(f => f.type === "trading").reduce((s,f) => s + f.amount, 0),
      listing: fees.filter(f => f.type === "listing").reduce((s,f) => s + f.amount, 0),
      management: fees.filter(f => f.type === "management").reduce((s,f) => s + f.amount, 0),
      custody: fees.filter(f => f.type === "custody").reduce((s,f) => s + f.amount, 0),
      compliance: fees.filter(f => f.type === "compliance").reduce((s,f) => s + f.amount, 0),
      count: fees.length,
    };
    return res.json({ fees, stats });
  }
  return res.status(405).end();
}
export default requireAdmin(handler);
