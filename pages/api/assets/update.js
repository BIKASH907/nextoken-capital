import { getUserFromRequest } from "../../../lib/auth";
import connectDB from "../../../lib/db";
import Asset from "../../../lib/models/Asset";

export default async function handler(req, res) {
  if (req.method !== "PUT") return res.status(405).json({ error: "Method not allowed" });

  try {
    const session = await getUserFromRequest(req);
    if (!session) return res.status(401).json({ error: "Not authenticated" });

    await connectDB();
    const { assetId, ...updates } = req.body;
    if (!assetId) return res.status(400).json({ error: "Asset ID required" });

    const asset = await Asset.findById(assetId);
    if (!asset) return res.status(404).json({ error: "Asset not found" });
    if (asset.issuerId.toString() !== session.id) return res.status(403).json({ error: "Not your listing" });
    if (!["draft", "review"].includes(asset.status)) return res.status(400).json({ error: "Cannot edit live listings" });

    const allowed = ["name", "description", "category", "location", "country", "targetRaise", "minInvestment", "maxInvestment", "targetROI", "term", "yieldFrequency", "tokenSupply", "tokenPrice", "riskLevel", "eligibility", "imageUrl", "documents"];
    for (const key of allowed) {
      if (updates[key] !== undefined) asset[key] = updates[key];
    }
    asset.updatedAt = new Date();
    await asset.save();

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Update error:", err);
    return res.status(500).json({ error: "Failed to update" });
  }
}
