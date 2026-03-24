import { getUserFromRequest } from "../../../lib/auth";
import connectDB from "../../../lib/db";
import Asset from "../../../lib/models/Asset";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const session = await getUserFromRequest(req);
    if (!session) return res.status(401).json({ error: "Not authenticated" });

    await connectDB();
    const { assetId } = req.body;
    const asset = await Asset.findById(assetId);
    if (!asset) return res.status(404).json({ error: "Asset not found" });
    if (asset.issuerId.toString() !== session.id) return res.status(403).json({ error: "Not your listing" });
    if (asset.status !== "draft") return res.status(400).json({ error: "Only draft listings can be submitted" });
    if (!asset.description || !asset.targetRaise || !asset.tokenPrice) {
      return res.status(400).json({ error: "Complete all required fields before submitting" });
    }

    asset.status = "review";
    asset.updatedAt = new Date();
    await asset.save();

    return res.status(200).json({ success: true, message: "Submitted for compliance review" });
  } catch (err) {
    console.error("Submit error:", err);
    return res.status(500).json({ error: "Failed to submit" });
  }
}
