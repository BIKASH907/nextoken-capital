import { requireAdmin } from "../../../lib/adminAuth";
import dbConnect from "../../../lib/db";
import Escrow from "../../../models/Escrow";
import { logAudit } from "../../../lib/auditLog";

async function handler(req, res) {
  await dbConnect();
  const adminId = req.admin?.sub || req.admin?.id || "unknown";
  const adminRole = req.admin?.role || "unknown";
  const ip = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "";

  // GET — list escrows
  if (req.method === "GET") {
    const escrows = await Escrow.find().sort({ createdAt: -1 }).lean();
    const stats = {
      total: escrows.length,
      active: escrows.filter(e => e.status === "active" || e.status === "funded").length,
      totalLocked: escrows.reduce((s, e) => s + (e.amountRaised - e.amountReleased - e.amountRefunded), 0),
      totalReleased: escrows.reduce((s, e) => s + e.amountReleased, 0),
      pendingRelease: escrows.reduce((s, e) => s + e.milestones.filter(m => m.status === "pending_review" || m.status === "approved").reduce((ms, m) => ms + m.amount, 0), 0),
    };
    return res.json({ escrows, stats });
  }

  // POST — create escrow or perform action
  if (req.method === "POST") {
    const { action } = req.body;

    // CREATE new escrow
    if (action === "create") {
      const { assetId, assetName, issuerId, issuerName, totalAmount, currency, fundingThreshold, fundingDeadline, milestones } = req.body;

      if (!assetName || !totalAmount || !fundingThreshold || !milestones?.length) {
        return res.status(400).json({ error: "Asset name, total amount, threshold, and milestones are required" });
      }

      // Validate milestones total equals totalAmount
      const milestoneTotal = milestones.reduce((s, m) => s + m.amount, 0);
      if (milestoneTotal !== totalAmount) {
        return res.status(400).json({ error: "Milestone amounts must equal total escrow amount" });
      }

      const escrow = await Escrow.create({
        assetId, assetName, issuerId, issuerName,
        totalAmount, currency: currency || "EUR", fundingThreshold, fundingDeadline,
        milestones: milestones.map(m => ({ ...m, status: "locked" })),
        auditLog: [{ action: "escrow_created", actor: adminId, actorRole: adminRole, details: "Escrow created with " + milestones.length + " milestones", ipAddress: ip }],
      });

      await logAudit({ action: "escrow_created", category: "financial", admin: req.admin, targetType: "escrow", targetId: escrow._id.toString(), details: { assetName, totalAmount }, req, severity: "high" });
      return res.json({ escrow });
    }

    // LOCK escrow (funds become immutable)
    if (action === "lock") {
      const escrow = await Escrow.findById(req.body.escrowId);
      if (!escrow) return res.status(404).json({ error: "Escrow not found" });
      if (escrow.isLocked) return res.status(400).json({ error: "Already locked" });

      escrow.isLocked = true;
      escrow.lockedAt = new Date();
      escrow.lockedBy = adminId;
      escrow.status = "active";
      escrow.auditLog.push({ action: "escrow_locked", actor: adminId, actorRole: adminRole, details: "Funds locked. Amount: " + escrow.totalAmount + " " + escrow.currency, ipAddress: ip });
      await escrow.save();

      await logAudit({ action: "escrow_locked", category: "financial", admin: req.admin, targetType: "escrow", targetId: escrow._id.toString(), details: { totalAmount: escrow.totalAmount }, req, severity: "critical" });
      return res.json({ escrow });
    }

    // REQUEST milestone release (issuer submits evidence)
    if (action === "request_release") {
      const { escrowId, milestoneIndex, evidence } = req.body;
      const escrow = await Escrow.findById(escrowId);
      if (!escrow) return res.status(404).json({ error: "Escrow not found" });
      if (!escrow.isLocked) return res.status(400).json({ error: "Escrow must be locked first" });

      const milestone = escrow.milestones[milestoneIndex];
      if (!milestone) return res.status(400).json({ error: "Invalid milestone" });
      if (milestone.status !== "locked") return res.status(400).json({ error: "Milestone is not in locked state" });

      milestone.status = "pending_review";
      milestone.evidenceSubmitted = evidence;
      milestone.requestedBy = adminId;
      milestone.requestedAt = new Date();
      escrow.auditLog.push({ action: "release_requested", actor: adminId, actorRole: adminRole, details: "Milestone " + (milestoneIndex+1) + ": " + milestone.title + " — Evidence: " + evidence, ipAddress: ip });
      await escrow.save();

      await logAudit({ action: "milestone_release_requested", category: "financial", admin: req.admin, targetType: "escrow", targetId: escrow._id.toString(), details: { milestone: milestone.title, amount: milestone.amount }, req, severity: "high" });
      return res.json({ escrow });
    }

    // FIRST APPROVAL (compliance admin)
    if (action === "first_approve") {
      const { escrowId, milestoneIndex } = req.body;
      const escrow = await Escrow.findById(escrowId);
      if (!escrow) return res.status(404).json({ error: "Escrow not found" });

      const milestone = escrow.milestones[milestoneIndex];
      if (!milestone) return res.status(400).json({ error: "Invalid milestone" });
      if (milestone.status !== "pending_review") return res.status(400).json({ error: "Milestone not pending review" });
      if (milestone.requestedBy === adminId) return res.status(400).json({ error: "Cannot approve your own request (four-eyes principle)" });

      milestone.status = "approved";
      milestone.firstApprover = adminId;
      milestone.firstApprovedAt = new Date();
      escrow.auditLog.push({ action: "first_approval", actor: adminId, actorRole: adminRole, details: "First approval for milestone " + (milestoneIndex+1) + ": " + milestone.title, ipAddress: ip });
      await escrow.save();

      await logAudit({ action: "milestone_first_approval", category: "financial", admin: req.admin, targetType: "escrow", targetId: escrow._id.toString(), details: { milestone: milestone.title }, req, severity: "high" });
      return res.json({ escrow });
    }

    // SECOND APPROVAL + RELEASE (super admin)
    if (action === "second_approve_release") {
      if (adminRole !== "super_admin" && adminRole !== "finance_admin") {
        return res.status(403).json({ error: "Only Super Admin or Finance Admin can give final approval" });
      }

      const { escrowId, milestoneIndex } = req.body;
      const escrow = await Escrow.findById(escrowId);
      if (!escrow) return res.status(404).json({ error: "Escrow not found" });

      const milestone = escrow.milestones[milestoneIndex];
      if (!milestone) return res.status(400).json({ error: "Invalid milestone" });
      if (milestone.status !== "approved") return res.status(400).json({ error: "Milestone needs first approval before release" });
      if (milestone.firstApprover === adminId) return res.status(400).json({ error: "Second approver must be different from first (four-eyes principle)" });

      milestone.status = "released";
      milestone.secondApprover = adminId;
      milestone.secondApprovedAt = new Date();
      milestone.releasedAt = new Date();
      escrow.amountReleased += milestone.amount;

      // Update escrow status
      const allReleased = escrow.milestones.every(m => m.status === "released");
      escrow.status = allReleased ? "fully_released" : "partially_released";

      escrow.auditLog.push({ action: "funds_released", actor: adminId, actorRole: adminRole, details: "Released " + milestone.amount + " " + escrow.currency + " for milestone: " + milestone.title, ipAddress: ip });
      await escrow.save();

      await logAudit({ action: "escrow_funds_released", category: "financial", admin: req.admin, targetType: "escrow", targetId: escrow._id.toString(), details: { milestone: milestone.title, amount: milestone.amount }, req, severity: "critical" });
      return res.json({ escrow });
    }

    // REJECT milestone
    if (action === "reject") {
      const { escrowId, milestoneIndex, reason } = req.body;
      const escrow = await Escrow.findById(escrowId);
      if (!escrow) return res.status(404).json({ error: "Escrow not found" });

      const milestone = escrow.milestones[milestoneIndex];
      if (!milestone) return res.status(400).json({ error: "Invalid milestone" });

      milestone.status = "rejected";
      milestone.rejectedBy = adminId;
      milestone.rejectedAt = new Date();
      milestone.rejectionReason = reason || "No reason provided";
      escrow.auditLog.push({ action: "milestone_rejected", actor: adminId, actorRole: adminRole, details: "Rejected milestone: " + milestone.title + " — Reason: " + (reason || "none"), ipAddress: ip });
      await escrow.save();

      await logAudit({ action: "milestone_rejected", category: "financial", admin: req.admin, targetType: "escrow", targetId: escrow._id.toString(), details: { milestone: milestone.title, reason }, req, severity: "high" });
      return res.json({ escrow });
    }

    return res.status(400).json({ error: "Unknown action" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}

export default requireAdmin(handler);
