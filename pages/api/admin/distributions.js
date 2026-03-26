import { requireAdmin } from "../../../lib/adminAuth";
import dbConnect from "../../../lib/db";
import Distribution from "../../../models/Distribution";
import Investment from "../../../models/Investment";
import Wallet from "../../../models/Wallet";
import Fee from "../../../models/Fee";
import { logAudit } from "../../../lib/auditLog";
import { notify } from "../../../lib/notify";
import crypto from "crypto";

const PIPELINE = {
  pending: { next: "compliance_approved", role: "compliance_admin" },
  compliance_approved: { next: "finance_approved", role: "finance_admin" },
  finance_approved: { next: "admin_approved", role: "super_admin" },
};

async function handler(req, res) {
  await dbConnect();
  const adminId = req.admin?.sub || req.admin?.id;
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
      const stage = PIPELINE[dist.status];
      if (!stage) return res.status(400).json({ error: "Cannot approve at: " + dist.status });
      if (adminRole !== "super_admin" && adminRole !== stage.role) return res.status(403).json({ error: "Requires " + stage.role });

      // Prevent duplicate distribution
      if (dist.status === "admin_approved" || dist.status === "distributed") return res.status(400).json({ error: "Already processed" });

      dist.status = stage.next;
      dist.approvals.push({ by: adminId, byName: adminName, byRole: adminRole, action: "approved" });
      await dist.save();

      await logAudit({ action: "distribution_approved", category: "financial", admin: req.admin, targetType: "distribution", targetId: distributionId, statusBefore: dist.status, statusAfter: stage.next, details: { assetName: dist.assetName }, req, severity: "high" });

      // AUTO-DISTRIBUTE after final approval
      if (dist.status === "admin_approved") {
        let totalFees = 0;
        for (const d of dist.distributions) {
          if (d.amount <= 0) continue;
          let wallet = await Wallet.findOne({ userId: d.investorId });
          if (!wallet) wallet = await Wallet.create({ userId: d.investorId });

          const txHash = "0x" + crypto.randomBytes(32).toString("hex");
          const distFee = Math.round(d.amount * 0.005 * 100) / 100;
          const netAmount = d.amount - distFee;
          totalFees += distFee;

          wallet.availableBalance += netAmount;
          wallet.totalEarnings += netAmount;
          wallet.transactions.push({ type: "profit_distribution", amount: netAmount, assetName: dist.assetName, txHash, status: "completed", description: "Profit: " + dist.assetName });
          await wallet.save();

          d.txHash = txHash; d.status = "completed";

          const inv = await Investment.findOne({ userId: d.investorId, assetId: dist.assetId, status: "active" });
          if (inv) { inv.earnings.push({ amount: netAmount, date: new Date(), txHash, type: "yield" }); await inv.save(); }

          // Notify each investor
          await notify(d.investorId, "distribution_received", "Profit Distribution Received", "You received EUR " + netAmount.toFixed(2) + " from " + dist.assetName, "/dashboard", { amount: netAmount, txHash, assetName: dist.assetName });
        }

        // Record platform fee
        if (totalFees > 0) {
          await Fee.create({ type: "management", amount: totalFees, assetName: dist.assetName, txHash: "dist-" + dist._id });
        }

        dist.status = "distributed";
        await dist.save();
        await logAudit({ action: "distribution_executed", category: "financial", admin: req.admin, targetType: "distribution", targetId: distributionId, details: { total: dist.totalProfit, investors: dist.distributions.length, fees: totalFees }, req, severity: "critical" });
      }

      return res.json({ distribution: dist, message: "Status: " + dist.status });
    }

    if (action === "reject") {
      if (!reason) return res.status(400).json({ error: "Reason required" });
      const dist = await Distribution.findById(distributionId);
      if (!dist) return res.status(404).json({ error: "Not found" });
      dist.status = "rejected";
      dist.approvals.push({ by: adminId, byName: adminName, byRole: adminRole, action: "rejected: " + reason });
      await dist.save();
      await logAudit({ action: "distribution_rejected", category: "financial", admin: req.admin, targetType: "distribution", targetId: distributionId, details: { reason }, req, severity: "high" });
      return res.json({ distribution: dist });
    }
    return res.status(400).json({ error: "Unknown action" });
  }
  return res.status(405).end();
}
export default requireAdmin(handler);
