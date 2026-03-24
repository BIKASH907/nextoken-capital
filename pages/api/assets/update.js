// PUT /api/assets/update — Update an existing asset (owner only)
import connectDB from "../../../lib/db";
import Asset from "../../../lib/models/Asset";
import { getUserFromRequest } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "PUT") return res.status(405).json({ error: "Method not allowed" });

  const session = await getUserFromRequest(req);
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  await connectDB();

  const { assetId, ...updates } = req.body;
  if (!assetId) return res.status(400).json({ error: "Asset ID required" });

  try {
    const asset = await Asset.findById(assetId);
    if (!asset) return res.status(404).json({ error: "Asset not found" });
    if (asset.issuerId.toString() !== (session.userId || session.id)) {
      return res.status(403).json({ error: "Not your asset" });
    }

    // Only allow updates on draft/review status
    if (!["draft", "review"].includes(asset.status)) {
      return res.status(400).json({ error: "Cannot edit live or closed listings" });
    }

    const allowed = ["name", "description", "category", "location", "country",
      "targetRaise", "minInvestment", "maxInvestment", "targetROI", "term",
      "yieldFrequency", "riskLevel", "imageUrl", "documents"];

    allowed.forEach(key => {
      if (updates[key] !== undefined) asset[key] = updates[key];
    });
    asset.updatedAt = new Date();
    await asset.save();

    res.status(200).json({ success: true, asset });
  } catch (e) {
    console.error("Asset update error:", e);
    res.status(500).json({ error: "Failed to update" });
  }
}
