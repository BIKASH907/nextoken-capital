// pages/api/assets/[id].js
import connectDB from "../../../lib/db";
import Asset from "../../../lib/models/Asset";
import { getUserFromRequest } from "../../../lib/auth";

export default async function handler(req, res) {
  await connectDB();
  const session = await getUserFromRequest(req);
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  const { id } = req.query;

  if (req.method === "GET") {
    const asset = await Asset.findById(id).lean();
    if (!asset) return res.status(404).json({ error: "Asset not found" });
    return res.status(200).json({ success: true, asset });
  }

  if (req.method === "PUT") {
    const asset = await Asset.findById(id);
    if (!asset) return res.status(404).json({ error: "Asset not found" });
    if (asset.issuerId.toString() !== (session.sub || session.id)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Only allow edits on draft or review status
    if (!["draft", "review"].includes(asset.status)) {
      return res.status(400).json({ error: "Cannot edit a live or closed asset." });
    }

    const allowed = [
      "name","description","category","location","country",
      "targetRaise","minInvestment","maxInvestment","targetROI","term",
      "yieldFrequency","tokenSupply","tokenPrice","riskLevel",
      "imageUrl","documents","eligibility",
    ];

    allowed.forEach(field => {
      if (req.body[field] !== undefined) asset[field] = req.body[field];
    });
    asset.updatedAt = new Date();
    await asset.save();

    return res.status(200).json({ success: true, message: "Asset updated.", asset });
  }

  if (req.method === "DELETE") {
    const asset = await Asset.findById(id);
    if (!asset) return res.status(404).json({ error: "Asset not found" });
    if (asset.issuerId.toString() !== (session.sub || session.id)) {
      return res.status(403).json({ error: "Not authorized" });
    }
    if (!["draft", "review"].includes(asset.status)) {
      return res.status(400).json({ error: "Cannot delete a live asset." });
    }
    await Asset.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Asset deleted." });
  }

  res.status(405).json({ error: "Method not allowed" });
}
