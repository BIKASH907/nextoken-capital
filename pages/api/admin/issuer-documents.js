import { requireAdmin } from "../../../lib/adminAuth";
import dbConnect from "../../../lib/db";
import IssuerDocument from "../../../models/IssuerDocument";
import { logAudit } from "../../../lib/auditLog";

// Document review pipeline (strict order, cannot skip):
// 1. pending → compliance_review (Compliance approves/rejects/comments)
// 2. compliance_approved → finance_review (Finance approves/rejects/comments)
// 3. finance_approved → final_review (Super Admin gives FINAL approval)
// 4. approved (live)

const PIPELINE = {
  pending:              { stage: "compliance", next: "compliance_approved", reviewRole: "compliance_admin" },
  compliance_approved:  { stage: "finance",    next: "finance_approved",    reviewRole: "finance_admin" },
  finance_approved:     { stage: "final",      next: "approved",            reviewRole: "super_admin" },
  approved:             { stage: "done",       next: null,                  reviewRole: null },
};

// Where rejections go back to
const REJECT_TO = {
  pending:              "rejected_compliance",    // Compliance rejects → issuer fixes → resubmit
  compliance_approved:  "pending",                // Finance rejects → back to Compliance
  finance_approved:     "compliance_approved",    // Super Admin rejects → back to Finance
};

async function handler(req, res) {
  await dbConnect();
  const adminId = req.admin?.sub || req.admin?.id || "unknown";
  const adminRole = req.admin?.role || "unknown";
  const adminName = req.admin?.firstName || req.admin?.email || "Admin";

  // ── GET: List documents ──
  if (req.method === "GET") {
    const { category, status } = req.query;
    const filter = {};

    // Role-based: show only what this role can act on
    if (adminRole === "compliance_admin") {
      filter.status = { $in: ["pending", "rejected_compliance"] };
    } else if (adminRole === "finance_admin") {
      filter.status = { $in: ["compliance_approved"] };
    } else if (adminRole === "audit") {
      // sees all, no filter
    }
    // super_admin sees all

    if (category) filter.category = category;
    if (status && adminRole === "super_admin") filter.status = status;

    const docs = await IssuerDocument.find(filter).sort({ createdAt: -1 }).lean();

    const allDocs = await IssuerDocument.find().lean();
    const stats = {
      total: allDocs.length,
      pending: allDocs.filter(d => d.status === "pending").length,
      complianceApproved: allDocs.filter(d => d.status === "compliance_approved").length,
      financeApproved: allDocs.filter(d => d.status === "finance_approved").length,
      approved: allDocs.filter(d => d.status === "approved").length,
      rejected: allDocs.filter(d => d.status?.startsWith("rejected")).length,
    };

    return res.json({ documents: docs, stats });
  }

  // ── POST: Actions ──
  if (req.method === "POST") {
    const { action } = req.body;

    // UPLOAD
    if (action === "upload") {
      const { issuerId, issuerName, issuerEmail, assetId, assetName, fileName, fileUrl, fileType, fileSize, category, subType } = req.body;
      if (!fileName || !fileUrl || !category) return res.status(400).json({ error: "fileName, fileUrl, and category required" });

      const doc = await IssuerDocument.create({
        issuerId, issuerName, issuerEmail, assetId, assetName,
        fileName, fileUrl, fileType, fileSize, category, subType,
        routedTo: "compliance",
        status: "pending",
        auditLog: [{ action: "uploaded", by: adminId, byRole: adminRole, notes: "Document uploaded. Starts with Compliance review." }],
      });

      await logAudit({ action: "issuer_document_uploaded", category: "compliance", admin: req.admin, targetType: "document", targetId: doc._id.toString(), details: { fileName, category }, req, severity: "medium" });
      return res.json({ document: doc, message: "Uploaded. Pending Compliance review." });
    }

    // APPROVE (stage-locked)
    if (action === "approve") {
      const { documentId, notes } = req.body;
      const doc = await IssuerDocument.findById(documentId);
      if (!doc) return res.status(404).json({ error: "Document not found" });

      const stage = PIPELINE[doc.status];
      if (!stage || !stage.next) return res.status(400).json({ error: "Document cannot be approved at status: " + doc.status });

      // ENFORCE: Only the correct role can approve at each stage
      if (adminRole !== "super_admin" && adminRole !== stage.reviewRole) {
        const stageNames = { compliance_admin: "Compliance", finance_admin: "Finance", super_admin: "Super Admin" };
        return res.status(403).json({ error: "This document is at " + stage.stage + " stage. Only " + (stageNames[stage.reviewRole] || stage.reviewRole) + " can approve." });
      }

      // ENFORCE: Super Admin can ONLY do final approval (cannot skip stages)
      if (adminRole === "super_admin" && doc.status !== "finance_approved") {
        if (doc.status === "pending") return res.status(403).json({ error: "Cannot skip stages. This document needs Compliance approval first." });
        if (doc.status === "compliance_approved") return res.status(403).json({ error: "Cannot skip stages. This document needs Finance approval first." });
      }

      const prevStatus = doc.status;
      doc.status = stage.next;
      doc.auditLog.push({ action: "approved_" + stage.stage, by: adminId, byRole: adminRole, notes: notes || "", at: new Date() });

      // Track who approved at each stage
      if (stage.stage === "compliance") {
        doc.complianceApprovedBy = adminId;
        doc.complianceApprovedByName = adminName;
        doc.complianceApprovedAt = new Date();
        doc.complianceNotes = notes || "";
      } else if (stage.stage === "finance") {
        doc.financeApprovedBy = adminId;
        doc.financeApprovedByName = adminName;
        doc.financeApprovedAt = new Date();
        doc.financeNotes = notes || "";
      } else if (stage.stage === "final") {
        doc.finalApprovedBy = adminId;
        doc.finalApprovedByName = adminName;
        doc.finalApprovedAt = new Date();
        doc.finalNotes = notes || "";
      }

      await doc.save();

      const stageLabel = { compliance: "Compliance", finance: "Finance", final: "Final" };
      await logAudit({ action: "document_" + stage.stage + "_approved", category: "compliance", admin: req.admin, targetType: "document", targetId: doc._id.toString(), details: { fileName: doc.fileName, from: prevStatus, to: doc.status, notes }, req, severity: stage.stage === "final" ? "critical" : "high" });

      const nextStage = PIPELINE[doc.status];
      const msg = stageLabel[stage.stage] + " approved." + (nextStage?.stage !== "done" ? " Next: " + (stageLabel[nextStage?.stage] || "Done") + " review." : " Document is now LIVE.");
      return res.json({ document: doc, message: msg });
    }

    // REJECT (sends back to previous stage)
    if (action === "reject") {
      const { documentId, reason } = req.body;
      if (!reason) return res.status(400).json({ error: "Rejection reason is required" });

      const doc = await IssuerDocument.findById(documentId);
      if (!doc) return res.status(404).json({ error: "Document not found" });

      const stage = PIPELINE[doc.status];
      if (!stage) return res.status(400).json({ error: "Cannot reject at status: " + doc.status });

      // ENFORCE role
      if (adminRole !== "super_admin" && adminRole !== stage.reviewRole) {
        return res.status(403).json({ error: "Only " + stage.reviewRole + " can reject at this stage." });
      }

      // ENFORCE: Super Admin can only reject at final stage
      if (adminRole === "super_admin" && doc.status !== "finance_approved") {
        if (doc.status === "pending") return res.status(403).json({ error: "Cannot skip stages. Compliance must review first." });
        if (doc.status === "compliance_approved") return res.status(403).json({ error: "Cannot skip stages. Finance must review first." });
      }

      const prevStatus = doc.status;
      const rejectTo = REJECT_TO[doc.status] || "pending";
      doc.status = rejectTo;
      doc.rejectionReason = reason;
      doc.rejectedBy = adminId;
      doc.rejectedByName = adminName;
      doc.rejectedAt = new Date();
      doc.auditLog.push({ action: "rejected_at_" + stage.stage, by: adminId, byRole: adminRole, notes: reason, at: new Date() });
      await doc.save();

      await logAudit({ action: "document_" + stage.stage + "_rejected", category: "compliance", admin: req.admin, targetType: "document", targetId: doc._id.toString(), details: { fileName: doc.fileName, from: prevStatus, to: rejectTo, reason }, req, severity: "high" });

      const rejectMsg = {
        rejected_compliance: "Rejected by Compliance. Issuer must fix and resubmit.",
        pending: "Rejected by Finance. Sent back to Compliance for review.",
        compliance_approved: "Rejected by Super Admin. Sent back to Finance for review.",
      };
      return res.json({ document: doc, message: rejectMsg[rejectTo] || "Rejected." });
    }

    // COMMENT (any reviewer can add notes without changing status)
    if (action === "comment") {
      const { documentId, comment } = req.body;
      if (!comment) return res.status(400).json({ error: "Comment is required" });

      const doc = await IssuerDocument.findById(documentId);
      if (!doc) return res.status(404).json({ error: "Document not found" });

      doc.auditLog.push({ action: "comment", by: adminId, byRole: adminRole, notes: comment, at: new Date() });
      await doc.save();

      return res.json({ document: doc, message: "Comment added." });
    }

    // RESUBMIT (from rejected_compliance back to pending)
    if (action === "resubmit") {
      const { documentId } = req.body;
      const doc = await IssuerDocument.findById(documentId);
      if (!doc) return res.status(404).json({ error: "Document not found" });
      if (doc.status !== "rejected_compliance") return res.status(400).json({ error: "Only rejected documents can be resubmitted" });

      doc.status = "pending";
      doc.rejectionReason = null;
      doc.rejectedBy = null;
      doc.version = (doc.version || 1) + 1;
      doc.auditLog.push({ action: "resubmitted", by: adminId, byRole: adminRole, notes: "Version " + doc.version, at: new Date() });
      await doc.save();

      await logAudit({ action: "document_resubmitted", category: "compliance", admin: req.admin, targetType: "document", targetId: doc._id.toString(), details: { fileName: doc.fileName, version: doc.version }, req, severity: "medium" });
      return res.json({ document: doc, message: "Resubmitted for Compliance review (v" + doc.version + ")" });
    }

    return res.status(400).json({ error: "Unknown action" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}

export default requireAdmin(handler);
