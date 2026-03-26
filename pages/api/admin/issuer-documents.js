import { requireAdmin } from "../../../lib/adminAuth";
import dbConnect from "../../../lib/db";
import IssuerDocument from "../../../models/IssuerDocument";
import { logAudit } from "../../../lib/auditLog";

// Auto-route based on category
const ROUTING = {
  kyc: "compliance",
  financial: "finance",
  technical: "admin",
  legal: "compliance",
  valuation: "finance",
  other: "admin",
};

async function handler(req, res) {
  await dbConnect();
  const adminId = req.admin?.sub || req.admin?.id || "unknown";
  const adminRole = req.admin?.role || "unknown";
  const adminName = req.admin?.firstName || req.admin?.email || "Admin";

  // GET — list documents (filtered by role)
  if (req.method === "GET") {
    const { category, status, routedTo } = req.query;
    const filter = {};

    // Role-based filtering
    if (adminRole === "compliance_admin") filter.routedTo = "compliance";
    if (adminRole === "finance_admin") filter.routedTo = "finance";
    // super_admin and audit see all

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (routedTo && adminRole === "super_admin") filter.routedTo = routedTo;

    const docs = await IssuerDocument.find(filter).sort({ createdAt: -1 }).lean();

    const stats = {
      total: docs.length,
      pending: docs.filter(d => d.status === "pending").length,
      underReview: docs.filter(d => d.status === "under_review").length,
      approved: docs.filter(d => d.status === "approved").length,
      rejected: docs.filter(d => d.status === "rejected").length,
      byCategory: {},
      byRoute: {},
    };
    docs.forEach(d => {
      stats.byCategory[d.category] = (stats.byCategory[d.category] || 0) + 1;
      stats.byRoute[d.routedTo] = (stats.byRoute[d.routedTo] || 0) + 1;
    });

    return res.json({ documents: docs, stats });
  }

  // POST — upload or action
  if (req.method === "POST") {
    const { action } = req.body;

    // UPLOAD new document
    if (action === "upload") {
      const { issuerId, issuerName, issuerEmail, assetId, assetName, fileName, fileUrl, fileType, fileSize, category, subType, expiresAt } = req.body;

      if (!fileName || !fileUrl || !category) {
        return res.status(400).json({ error: "fileName, fileUrl, and category are required" });
      }

      const routedTo = ROUTING[category] || "admin";

      const doc = await IssuerDocument.create({
        issuerId, issuerName, issuerEmail, assetId, assetName,
        fileName, fileUrl, fileType, fileSize,
        category, subType, routedTo,
        expiresAt: expiresAt || null,
        auditLog: [{ action: "uploaded", by: adminId, byRole: adminRole, notes: "Document uploaded and routed to " + routedTo }],
      });

      await logAudit({ action: "issuer_document_uploaded", category: "compliance", admin: req.admin, targetType: "document", targetId: doc._id.toString(), details: { fileName, category, routedTo }, req, severity: "medium" });

      return res.json({ document: doc, message: "Uploaded and routed to " + routedTo });
    }

    // START REVIEW
    if (action === "start_review") {
      const { documentId } = req.body;
      const doc = await IssuerDocument.findById(documentId);
      if (!doc) return res.status(404).json({ error: "Document not found" });

      // Check role can review this route
      if (adminRole === "compliance_admin" && doc.routedTo !== "compliance") {
        return res.status(403).json({ error: "This document is routed to " + doc.routedTo + ", not compliance" });
      }
      if (adminRole === "finance_admin" && doc.routedTo !== "finance") {
        return res.status(403).json({ error: "This document is routed to " + doc.routedTo + ", not finance" });
      }

      doc.status = "under_review";
      doc.reviewedBy = adminId;
      doc.reviewedByName = adminName;
      doc.auditLog.push({ action: "review_started", by: adminId, byRole: adminRole });
      await doc.save();

      return res.json({ document: doc });
    }

    // APPROVE
    if (action === "approve") {
      const { documentId, notes } = req.body;
      const doc = await IssuerDocument.findById(documentId);
      if (!doc) return res.status(404).json({ error: "Document not found" });

      doc.status = "approved";
      doc.reviewedBy = adminId;
      doc.reviewedByName = adminName;
      doc.reviewedAt = new Date();
      doc.reviewNotes = notes || "";
      doc.auditLog.push({ action: "approved", by: adminId, byRole: adminRole, notes });
      await doc.save();

      await logAudit({ action: "issuer_document_approved", category: "compliance", admin: req.admin, targetType: "document", targetId: doc._id.toString(), details: { fileName: doc.fileName, category: doc.category }, req, severity: "high" });

      return res.json({ document: doc });
    }

    // REJECT
    if (action === "reject") {
      const { documentId, reason } = req.body;
      if (!reason) return res.status(400).json({ error: "Rejection reason required" });

      const doc = await IssuerDocument.findById(documentId);
      if (!doc) return res.status(404).json({ error: "Document not found" });

      doc.status = "rejected";
      doc.reviewedBy = adminId;
      doc.reviewedByName = adminName;
      doc.reviewedAt = new Date();
      doc.rejectionReason = reason;
      doc.auditLog.push({ action: "rejected", by: adminId, byRole: adminRole, notes: reason });
      await doc.save();

      await logAudit({ action: "issuer_document_rejected", category: "compliance", admin: req.admin, targetType: "document", targetId: doc._id.toString(), details: { fileName: doc.fileName, reason }, req, severity: "high" });

      return res.json({ document: doc });
    }

    return res.status(400).json({ error: "Unknown action" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}

export default requireAdmin(handler);
