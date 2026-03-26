import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import Asset from "../../../lib/models/Asset";
import AssetDocument from "../../../models/AssetDocument";
import { getAuthUser } from "../../../lib/getUser";

export default async function handler(req, res) {
  await connectDB();
  const user = await getAuthUser(req, res);
  if (!user) return res.status(401).json({ error: "Not authenticated" });

  // GET: List documents for an asset
  if (req.method === "GET") {
    const { assetId, category } = req.query;
    if (!assetId) return res.status(400).json({ error: "assetId required" });

    const filter = { assetId };
    if (category) filter.category = category;

    // Visibility control
    const isOwner = true; // Check later
    const isAdmin = user.role === "admin";
    const isInvestor = user.accountType === "investor";

    if (!isAdmin && !isOwner) {
      if (isInvestor) {
        filter.visibility = { $in: ["public", "investors_only"] };
        filter.status = "approved";
      } else {
        filter.visibility = "public";
        filter.status = "approved";
      }
    }

    const docs = await AssetDocument.find(filter).sort({ category: 1, createdAt: -1 }).lean();
    return res.json({ documents: docs });
  }

  // POST: Upload document metadata
  if (req.method === "POST") {
    if (user.accountType !== "issuer" && user.role !== "issuer") {
      return res.status(403).json({ error: "Issuer access only" });
    }

    const { assetId, category, docType, fileName, fileUrl, fileSize, mimeType, visibility } = req.body;
    if (!assetId || !category || !docType || !fileName || !fileUrl) {
      return res.status(400).json({ error: "assetId, category, docType, fileName, fileUrl required" });
    }

    const asset = await Asset.findById(assetId);
    if (!asset) return res.status(404).json({ error: "Asset not found" });

    // Photos are public by default, financial docs admin_only
    const vis = visibility || (category === "photos" ? "public" : category === "financial" ? "admin_only" : "admin_only");

    const doc = await AssetDocument.create({
      assetId, issuerId: user._id, category, docType, fileName, fileUrl,
      fileSize, mimeType, visibility: vis,
    });

    return res.json({ document: doc, message: "Document uploaded" });
  }

  // DELETE
  if (req.method === "DELETE") {
    const { docId } = req.body;
    const doc = await AssetDocument.findOne({ _id: docId, issuerId: user._id });
    if (!doc) return res.status(404).json({ error: "Not found" });
    await AssetDocument.deleteOne({ _id: docId });
    return res.json({ success: true });
  }

  return res.status(405).end();
}
