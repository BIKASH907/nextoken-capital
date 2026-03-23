// pages/api/admin/assets/index.js — full CRUD for investment listings
import { connectDB } from "../../../../lib/mongodb";
import Asset from "../../../../lib/models/Asset";
import { requireAdmin } from "../../../../lib/adminAuth";

async function handler(req, res) {
  await connectDB();
  const { method } = req;

  // GET — list all assets
  if (method === "GET") {
    const { status, type, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.assetType = type;
    const assets = await Asset.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Asset.countDocuments(filter);
    return res.status(200).json({ assets, total, page: Number(page), pages: Math.ceil(total / limit) });
  }

  // POST — create new asset
  if (method === "POST") {
    const data = req.body;
    if (!data.name || !data.ticker || !data.assetType || !data.targetRaise) {
      return res.status(400).json({ error: "name, ticker, assetType, targetRaise are required" });
    }
    const exists = await Asset.findOne({ ticker: data.ticker.toUpperCase() });
    if (exists) return res.status(400).json({ error: `Ticker ${data.ticker} already exists` });

    const asset = await Asset.create({ ...data, ticker: data.ticker.toUpperCase(), createdBy: req.admin.id });
    return res.status(201).json({ asset });
  }

  return res.status(405).end();
}

export default requireAdmin(handler, "operations");
