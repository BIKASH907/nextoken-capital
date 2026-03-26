import { connectDB } from "../../../lib/mongodb";
import AssetDocument from "../../../models/AssetDocument";

export default async function handler(req, res) {
  await connectDB();
  const { assetId } = req.query;
  if (!assetId) return res.status(400).json({ error: "assetId required" });

  // Public: only approved + public visibility
  const docs = await AssetDocument.find({
    assetId, status: "approved", visibility: "public"
  }).select("-issuerId -reviewedBy -reviewNote").sort({ category: 1 }).lean();

  return res.json({ documents: docs });
}
