import { requireAdmin } from "../../../../lib/adminAuth";
import dbConnect from "../../../../lib/db";
import AuditLog from "../../../../models/AuditLog";

async function handler(req, res) {
  await dbConnect();
  const role = req.admin?.role || "unknown";
  const adminId = req.admin?.sub || req.admin?.id;

  if (req.method === "GET") {
    const { search, role: filterRole, action, severity, country, from, to, page = 1, limit = 50, export: doExport } = req.query;

    const filter = {};

    // Role-based access
    if (role === "compliance_admin") filter.adminId = adminId; // only their own
    if (role === "finance_admin") filter.adminId = adminId;
    if (role === "support_admin") return res.status(403).json({ error: "No access to audit logs" });
    // super_admin and audit see everything

    // Filters
    if (search) {
      filter.$or = [
        { adminName: { $regex: search, $options: "i" } },
        { adminEmail: { $regex: search, $options: "i" } },
        { action: { $regex: search, $options: "i" } },
        { targetId: { $regex: search, $options: "i" } },
        { targetName: { $regex: search, $options: "i" } },
        { ip: { $regex: search, $options: "i" } },
      ];
    }
    if (filterRole) filter.adminRole = filterRole;
    if (action) filter.action = action;
    if (severity) filter.severity = severity;
    if (country) filter.country = country;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const total = await AuditLog.countDocuments(filter);
    const logs = await AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .lean();

    // Get unique values for filter dropdowns
    const [roles, actions, countries, severities] = await Promise.all([
      AuditLog.distinct("adminRole"),
      AuditLog.distinct("action"),
      AuditLog.distinct("country"),
      AuditLog.distinct("severity"),
    ]);

    // CSV export
    if (doExport === "csv") {
      const allLogs = await AuditLog.find(filter).sort({ createdAt: -1 }).limit(10000).lean();
      const header = "Date,User,Email,Role,Action,Target,Status Before,Status After,Comment,IP,Country,City,Device,Severity,Result\n";
      const rows = allLogs.map(l =>
        `"${new Date(l.createdAt).toISOString()}","${l.adminName}","${l.adminEmail||''}","${l.adminRole}","${l.action}","${l.targetType||''} ${l.targetId||''}","${l.statusBefore||''}","${l.statusAfter||''}","${(l.comment||'').replace(/"/g,'""')}","${l.ip}","${l.country}","${l.city}","${l.device||''}","${l.severity}","${l.result}"`
      ).join("\n");
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=audit-log-" + new Date().toISOString().split("T")[0] + ".csv");
      return res.send(header + rows);
    }

    return res.json({ logs, total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)), filters: { roles, actions, countries, severities } });
  }

  // Verify integrity
  if (req.method === "POST" && req.body.action === "verify_integrity") {
    if (role !== "super_admin" && role !== "audit") return res.status(403).json({ error: "Only Super Admin or Audit can verify" });

    const logs = await AuditLog.find().sort({ createdAt: 1 }).limit(1000).lean();
    let prevHash = "0".repeat(64);
    let broken = [];

    for (const log of logs) {
      const record = { ...log };
      delete record.hash;
      delete record._id;
      delete record.__v;
      delete record.createdAt;
      delete record.updatedAt;
      record.previousHash = prevHash;
      const expected = require("crypto").createHash("sha256").update(JSON.stringify(record) + prevHash).digest("hex");
      if (log.hash !== expected) broken.push({ id: log._id, date: log.createdAt, action: log.action });
      prevHash = log.hash;
    }

    return res.json({ verified: broken.length === 0, checked: logs.length, broken });
  }

  return res.status(405).json({ error: "Method not allowed" });
}

export default requireAdmin(handler);
