import { requireAdmin } from "../../../lib/adminAuth";
import dbConnect from "../../../lib/db";
import AssetDocument from "../../../models/AssetDocument";
import { logAudit } from "../../../lib/auditLog";

async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const { assetId, category, status } = req.query;
    const filter = {};
    if (assetId) filter.assetId = assetId;
    if (category) filter.category = category;
    if (status) filter.status = status;
    const docs = await AssetDocument.find(filter).sort({ createdAt: -1 }).lean();
    return res.json({ documents: docs });
  }

  if (req.method === "POST") {
    const { docId, action, note, visibility } = req.body;
    const doc = await AssetDocument.findById(docId);
    if (!doc) return res.status(404).json({ error: "Not found" });

    if (action === "approve") {
      doc.status = "approved";
      doc.reviewedBy = req.admin?.email;
      doc.reviewedAt = new Date();
      doc.reviewNote = note || "";
      if (visibility) doc.visibility = visibility;
      await doc.save();
      await logAudit({ action: "document_approved", category: "compliance", admin: req.admin, targetType: "document", targetId: docId, details: { fileName: doc.fileName, docType: doc.docType }, req, severity: "medium" });
      return res.json({ document: doc, message: "Document approved" });
    }

    if (action === "reject") {
      doc.status = "rejected";
      doc.reviewedBy = req.admin?.email;
      doc.reviewedAt = new Date();
      doc.reviewNote = note || "Rejected";
      await doc.save();
      await logAudit({ action: "document_rejected", category: "compliance", admin: req.admin, targetType: "document", targetId: docId, details: { fileName: doc.fileName, reason: note }, req, severity: "medium" });
      return res.json({ document: doc, message: "Document rejected" });
    }

    if (action === "set_visibility") {
      if (visibility) { doc.visibility = visibility; await doc.save(); }
      return res.json({ document: doc });
    }
  }

  return res.status(405).end();
}
export default requireAdmin(handler);
