import { connectDB } from "../../../lib/mongodb";
import Trade from "../../../models/Trade";
export default async function handler(req, res) {
  await connectDB();
  const { assetId, limit } = req.query;
  const filter = assetId ? { assetId } : {};
  const trades = await Trade.find(filter).sort({ createdAt: -1 }).limit(Number(limit) || 50).lean();
  return res.json({ trades });
}
