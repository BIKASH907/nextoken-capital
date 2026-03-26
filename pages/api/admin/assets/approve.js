import { requireAdmin } from "../../../../lib/adminAuth";
import dbConnect from "../../../../lib/db";
import Asset from "../../../../lib/models/Asset";
import { logAudit } from "../../../../lib/auditLog";

const PIPELINE = {
  draft: { next: "pending_compliance", action: "submit_for_review", anyRole: true },
  pending_compliance: { next: "compliance_approved", action: "compliance_approve", allowedRoles: ["compliance_admin", "super_admin"] },
  compliance_approved: { next: "pending_finance", action: "auto", auto: true },
  pending_finance: { next: "finance_approved", action: "finance_approve", allowedRoles: ["finance_admin", "super_admin"] },
  finance_approved: { next: "pending_final", action: "auto", auto: true },
  pending_final: { next: "live", action: "final_approve", allowedRoles: ["super_admin"] },
  live: { next: null, action: null },
  rejected: { next: "pending_compliance", action: "resubmit", allowedRoles: ["compliance_admin", "super_admin"] },
};

async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  await dbConnect();

  const { assetId, action, reason } = req.body;
  const adminId = req.admin?.sub || req.admin?.id || "unknown";
  const adminRole = req.admin?.role || "unknown";
  const adminName = req.admin?.firstName || req.admin?.email || "Admin";

  if (!assetId || !action) return res.status(400).json({ error: "assetId and action required" });

  const asset = await Asset.findById(assetId);
  if (!asset) return res.status(404).json({ error: "Asset not found" });

  const currentStatus = asset.approvalStatus || asset.status || "draft";

  // ── REJECT (any approval stage) ──
  if (action === "reject") {
    if (!reason) return res.status(400).json({ error: "Rejection reason is required" });

    // Who can reject at which stage
    const rejectRoles = {
      pending_compliance: ["compliance_admin", "super_admin"],
      pending_finance: ["finance_admin", "super_admin"],
      pending_final: ["super_admin"],
    };

    const allowed = rejectRoles[currentStatus] || [];
    if (!allowed.includes(adminRole)) {
      return res.status(403).json({ error: "You cannot reject at this stage. Requires: " + allowed.join(" or ") });
    }

    // Where does rejection go?
    let rejectTo = "pending_compliance"; // default: back to compliance
    if (currentStatus === "pending_final") rejectTo = "pending_compliance"; // Super Admin reject → back to compliance
    if (currentStatus === "pending_finance") rejectTo = "pending_compliance"; // Finance reject → back to compliance (issuer fixes via compliance)
    if (currentStatus === "pending_compliance") rejectTo = "rejected"; // Compliance reject → issuer must fix and resubmit

    // Log rejection
    if (!asset.approvalHistory) asset.approvalHistory = [];
    asset.approvalHistory.push({
      from: currentStatus,
      to: rejectTo,
      action: "rejected",
      by: adminId,
      byName: adminName,
      byRole: adminRole,
      reason,
      at: new Date(),
    });

    asset.approvalStatus = rejectTo;
    asset.rejectionReason = reason;
    asset.rejectedBy = adminId;
    asset.rejectedAt = new Date();
    if (asset.status) asset.status = rejectTo === "rejected" ? "rejected" : asset.status;
    await asset.save();

    await logAudit({
      action: "asset_rejected",
      category: "asset",
      admin: req.admin,
      targetType: "asset",
      targetId: assetId,
      details: { assetName: asset.name, from: currentStatus, to: rejectTo, reason },
      req,
      severity: "high",
    });

    return res.json({
      success: true,
      asset,
      message: "Rejected. Sent back to: " + rejectTo.replace(/_/g, " "),
    });
  }

  // ── APPROVE / ADVANCE ──
  if (action === "approve" || action === "resubmit") {
    const stage = PIPELINE[currentStatus];
    if (!stage || !stage.next) {
      return res.status(400).json({ error: "Cannot advance from status: " + currentStatus });
    }

    // Check role permission
    if (stage.allowedRoles && !stage.allowedRoles.includes(adminRole)) {
      return res.status(403).json({ error: "Your role (" + adminRole + ") cannot approve at this stage. Requires: " + stage.allowedRoles.join(" or ") });
    }

    let nextStatus = stage.next;

    // Log approval
    if (!asset.approvalHistory) asset.approvalHistory = [];
    asset.approvalHistory.push({
      from: currentStatus,
      to: nextStatus,
      action: action === "resubmit" ? "resubmitted" : "approved",
      by: adminId,
      byName: adminName,
      byRole: adminRole,
      at: new Date(),
    });

    asset.approvalStatus = nextStatus;
    asset.rejectionReason = null;
    asset.rejectedBy = null;
    asset.rejectedAt = null;

    // Auto-advance through auto stages
    const autoStage = PIPELINE[nextStatus];
    if (autoStage && autoStage.auto && autoStage.next) {
      asset.approvalHistory.push({
        from: nextStatus,
        to: autoStage.next,
        action: "auto_advanced",
        by: "system",
        byName: "System",
        byRole: "system",
        at: new Date(),
      });
      nextStatus = autoStage.next;
      asset.approvalStatus = nextStatus;
    }

    // If going live, update main status too
    if (nextStatus === "live") {
      asset.status = "live";
      asset.approvedAt = new Date();
      asset.approvedBy = adminId;
    }

    await asset.save();

    await logAudit({
      action: action === "resubmit" ? "asset_resubmitted" : "asset_approved",
      category: "asset",
      admin: req.admin,
      targetType: "asset",
      targetId: assetId,
      details: { assetName: asset.name, from: currentStatus, to: nextStatus },
      req,
      severity: nextStatus === "live" ? "critical" : "high",
    });

    return res.json({
      success: true,
      asset,
      message: action === "resubmit" ? "Resubmitted for compliance review" : "Approved. New status: " + nextStatus.replace(/_/g, " "),
    });
  }

  return res.status(400).json({ error: "Unknown action: " + action });
}

export default requireAdmin(handler);
