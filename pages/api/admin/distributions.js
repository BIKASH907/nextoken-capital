import { requireAdmin } from "../../../lib/adminAuth";
import dbConnect from "../../../lib/db";
import Distribution from "../../../models/Distribution";
import Investment from "../../../models/Investment";
import Wallet from "../../../models/Wallet";
import { logAudit } from "../../../lib/auditLog";
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

    // APPROVE (stage-locked)
    if (action === "approve") {
      const dist = await Distribution.findById(distributionId);
      if (!dist) return res.status(404).json({ error: "Not found" });

      const stage = PIPELINE[dist.status];
      if (!stage) return res.status(400).json({ error: "Cannot approve at status: " + dist.status });

      if (adminRole !== "super_admin" && adminRole !== stage.role) {
        return res.status(403).json({ error: "Only " + stage.role + " can approve at this stage" });
      }

      dist.status = stage.next;
      dist.approvals.push({ by: adminId, byName: adminName, byRole: adminRole, action: "approved" });
      await dist.save();

      await logAudit({ action: "distribution_approved", category: "financial", admin: req.admin, targetType: "distribution", targetId: distributionId, details: { stage: stage.next, assetName: dist.assetName }, req, severity: "high" });

      // If admin_approved → AUTO DISTRIBUTE
      if (dist.status === "admin_approved") {
        for (const d of dist.distributions) {
          if (d.amount <= 0) continue;

          let wallet = await Wallet.findOne({ userId: d.investorId });
          if (!wallet) wallet = await Wallet.create({ userId: d.investorId });

          const txHash = "0x" + crypto.randomBytes(32).toString("hex");
          wallet.availableBalance += d.amount;
          wallet.totalEarnings += d.amount;
          wallet.transactions.push({
            type: "profit_distribution", amount: d.amount,
            assetName: dist.assetName, txHash, status: "completed",
            description: "Profit distribution: " + dist.assetName,
          });
          await wallet.save();

          d.txHash = txHash;
          d.status = "completed";

          // Update investment earnings
          const inv = await Investment.findOne({ userId: d.investorId, assetId: dist.assetId, status: "active" });
          if (inv) {
            inv.earnings.push({ amount: d.amount, date: new Date(), txHash, type: "yield" });
            await inv.save();
          }
        }

        dist.status = "distributed";
        await dist.save();

        await logAudit({ action: "distribution_executed", category: "financial", admin: req.admin, targetType: "distribution", targetId: distributionId, details: { assetName: dist.assetName, totalProfit: dist.totalProfit, investors: dist.distributions.length }, req, severity: "critical" });
      }

      return res.json({ distribution: dist, message: "Approved. Status: " + dist.status });
    }

    // REJECT
    if (action === "reject") {
      if (!reason) return res.status(400).json({ error: "Reason required" });
      const dist = await Distribution.findById(distributionId);
      if (!dist) return res.status(404).json({ error: "Not found" });

      dist.status = "rejected";
      dist.approvals.push({ by: adminId, byName: adminName, byRole: adminRole, action: "rejected: " + reason });
      await dist.save();

      await logAudit({ action: "distribution_rejected", category: "financial", admin: req.admin, targetType: "distribution", targetId: distributionId, details: { reason }, req, severity: "high" });
      return res.json({ distribution: dist, message: "Rejected" });
    }

    return res.status(400).json({ error: "Unknown action" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}

export default requireAdmin(handler);
