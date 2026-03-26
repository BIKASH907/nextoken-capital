import { requireAdmin } from "../../../lib/adminAuth";
import dbConnect from "../../../lib/db";
import Distribution from "../../../models/Distribution";
import { executeDistribution } from "../../../lib/profitEngine";
import { logAudit } from "../../../lib/auditLog";

const PIPELINE = { pending: { next: "compliance_approved", role: "compliance_admin" }, compliance_approved: { next: "finance_approved", role: "finance_admin" }, finance_approved: { next: "admin_approved", role: "super_admin" } };

async function handler(req, res) {
  await dbConnect();
  const adminRole = req.admin?.role;
  const adminName = req.admin?.firstName || "Admin";

  if (req.method === "GET") {
    const dists = await Distribution.find().sort({ createdAt: -1 }).lean();
    return res.json({ distributions: dists });
  }

  if (req.method === "POST") {
    const { action, distributionId, reason } = req.body;

    if (action === "approve") {
      const dist = await Distribution.findById(distributionId);
      if (!dist) return res.status(404).json({ error: "Not found" });
      if (dist.status === "distributed") return res.status(400).json({ error: "Already distributed" });
      const stage = PIPELINE[dist.status];
      if (!stage) return res.status(400).json({ error: "Cannot approve at: " + dist.status });
      if (adminRole !== "super_admin" && adminRole !== stage.role) return res.status(403).json({ error: "Requires " + stage.role });

      dist.status = stage.next;
      dist.approvals.push({ by: req.admin?.sub, byName: adminName, byRole: adminRole, action: "approved" });
      await dist.save();
      await logAudit({ action: "distribution_approved", category: "financial", admin: req.admin, targetType: "distribution", targetId: distributionId, details: { stage: stage.next }, req, severity: "high" });

      // AUTO-EXECUTE after final approval
      if (dist.status === "admin_approved") {
        const results = await executeDistribution(dist, dist.assetName);
        dist.status = "distributed";
        await dist.save();
        await logAudit({ action: "distribution_executed", category: "financial", admin: req.admin, targetType: "distribution", targetId: distributionId, details: { total: dist.totalProfit, paid: results.length, platformFee: dist.platformFee, issuerReserve: dist.issuerReserve }, req, severity: "critical" });
      }
      return res.json({ distribution: dist, message: "Status: " + dist.status });
    }

    if (action === "reject") {
      if (!reason) return res.status(400).json({ error: "Reason required" });
      const dist = await Distribution.findById(distributionId);
      if (!dist) return res.status(404).json({ error: "Not found" });
      dist.status = "rejected";
      dist.approvals.push({ by: req.admin?.sub, byName: adminName, byRole: adminRole, action: "rejected: " + reason });
      await dist.save();
      return res.json({ distribution: dist });
    }
  }
  return res.status(405).end();
}
export default requireAdmin(handler);
