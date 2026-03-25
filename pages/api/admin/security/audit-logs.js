import { requireAdmin } from "../../../../lib/adminAuth";
import dbConnect from "../../../../lib/db";
import AuditLog from "../../../../models/AuditLog";

async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const { page = 1, limit = 50, category, adminId, severity, from, to } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (adminId) filter.adminId = adminId;
    if (severity) filter.severity = severity;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const total = await AuditLog.countDocuments(filter);
    const logs = await AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    return res.json({ logs, total, page: Number(page), pages: Math.ceil(total / limit) });
  }

  res.status(405).json({ error: "Method not allowed" });
}

export default requireAdmin(handler, "compliance");
