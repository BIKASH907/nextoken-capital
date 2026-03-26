import { requireAdmin } from "../../../lib/adminAuth";
import dbConnect from "../../../lib/db";
import IssuerDocument from "../../../models/IssuerDocument";
import { logAudit } from "../../../lib/auditLog";
async function handler(req, res) {
  await dbConnect();
  if (req.method === "GET") { const { docId } = req.query; const doc = await IssuerDocument.findById(docId).lean(); return res.json({ document: doc, versions: doc?.versionHistory || [] }); }
  if (req.method === "POST") {
    const { docId, action, fileName, fileUrl } = req.body;
    const doc = await IssuerDocument.findById(docId);
    if (!doc) return res.status(404).json({ error: "Not found" });
    if (action === "lock_version") { doc.isVersionLocked = true; doc.lockedVersion = doc.version; await doc.save(); await logAudit({ action: "doc_version_locked", category: "compliance", admin: req.admin, targetId: docId, details: { version: doc.version }, req, severity: "high" }); return res.json({ success: true, message: "Version " + doc.version + " locked" }); }
    if (action === "new_version") { if (doc.isVersionLocked) return res.status(400).json({ error: "Version locked" }); doc.versionHistory.push({ version: doc.version, fileName: doc.fileName, fileUrl: doc.fileUrl, uploadedBy: req.admin?.email, status: doc.status }); doc.version += 1; if (fileName) doc.fileName = fileName; if (fileUrl) doc.fileUrl = fileUrl; doc.status = "pending"; await doc.save(); return res.json({ success: true, message: "Version " + doc.version }); }
  }
  return res.status(405).end();
}
export default requireAdmin(handler);
