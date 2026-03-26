import { requireAdmin } from "../../../lib/adminAuth";
import dbConnect from "../../../lib/db";
import SystemConfig from "../../../models/SystemConfig";
import { logAudit } from "../../../lib/auditLog";

const DEFAULTS = {
  daily_withdrawal_limit: { value: 5000, label: "Daily Withdrawal Limit", category: "withdrawal" },
  large_withdrawal_threshold: { value: 25000, label: "Large Withdrawal Threshold", category: "withdrawal" },
  dual_approval_threshold: { value: 10000, label: "Dual-Approval Threshold", category: "withdrawal" },
  whitelist_cooling_period: { value: 24, label: "Whitelist Cooling Period (hours)", category: "withdrawal" },
  session_timeout: { value: 15, label: "Admin Session Timeout (minutes)", category: "session" },
  max_login_attempts: { value: 5, label: "Max Login Attempts", category: "session" },
  lockout_duration: { value: 60, label: "Lockout Duration (minutes)", category: "session" },
  api_key_rotation: { value: 90, label: "API Key Rotation (days)", category: "session" },
};

async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const configs = await SystemConfig.find().lean();
    const result = {};
    for (const [key, def] of Object.entries(DEFAULTS)) {
      const saved = configs.find(c => c.key === key);
      result[key] = saved ? { ...def, ...saved, value: saved.value } : { key, ...def };
    }
    return res.json({ configs: result });
  }

  if (req.method === "POST") {
    if (req.admin.role !== "super_admin") {
      return res.status(403).json({ error: "Only Super Admin can modify system configuration" });
    }

    const { key, value } = req.body;
    if (!key || value === undefined) return res.status(400).json({ error: "Key and value required" });
    if (!DEFAULTS[key]) return res.status(400).json({ error: "Invalid config key" });

    const adminId = req.admin?.sub || req.admin?.id;
    const adminName = req.admin?.firstName || req.admin?.email || "Admin";

    const old = await SystemConfig.findOne({ key });
    const oldValue = old?.value ?? DEFAULTS[key].value;

    await SystemConfig.findOneAndUpdate(
      { key },
      { value, label: DEFAULTS[key].label, category: DEFAULTS[key].category, updatedBy: adminId, updatedByName: adminName, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    await logAudit({
      action: "system_config_changed", category: "system", admin: req.admin,
      targetType: "config", targetId: key, targetName: DEFAULTS[key].label,
      statusBefore: String(oldValue), statusAfter: String(value),
      details: { key, oldValue, newValue: value },
      req, severity: "critical",
    });

    return res.json({ success: true, message: DEFAULTS[key].label + " updated to " + value });
  }

  return res.status(405).json({ error: "Method not allowed" });
}

export default requireAdmin(handler);
