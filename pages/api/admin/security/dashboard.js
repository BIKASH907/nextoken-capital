import { requireAdmin } from "../../../../lib/adminAuth";
import dbConnect from "../../../../lib/db";
import AuditLog from "../../../../models/AuditLog";
import LoginAttempt from "../../../../models/LoginAttempt";
import SecurityAlert from "../../../../models/SecurityAlert";
import ApprovalRequest from "../../../../models/ApprovalRequest";

async function handler(req, res) {
  await dbConnect();
  const today = new Date(new Date().setHours(0, 0, 0, 0));
  const week = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [activeAlerts, criticalAlerts, pendingApprovals, todayLogins, failedLogins, todayActions, weekActions, recentAlerts, recentLogs] = await Promise.all([
    SecurityAlert.countDocuments({ status: "active" }),
    SecurityAlert.countDocuments({ status: "active", severity: "critical" }),
    ApprovalRequest.countDocuments({ status: "pending" }),
    LoginAttempt.countDocuments({ createdAt: { $gte: today } }),
    LoginAttempt.countDocuments({ success: false, createdAt: { $gte: today } }),
    AuditLog.countDocuments({ createdAt: { $gte: today } }),
    AuditLog.countDocuments({ createdAt: { $gte: week } }),
    SecurityAlert.find({ status: "active" }).sort({ createdAt: -1 }).limit(10).lean(),
    AuditLog.find().sort({ createdAt: -1 }).limit(10).lean(),
  ]);

  return res.json({
    stats: { activeAlerts, criticalAlerts, pendingApprovals, todayLogins, failedLogins, todayActions, weekActions },
    recentAlerts,
    recentLogs,
  });
}

export default requireAdmin(handler, "compliance");
