import { requireAdmin } from "../../../../lib/adminAuth";
import dbConnect from "../../../../lib/db";
import SecurityAlert from "../../../../models/SecurityAlert";

async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const { status = "active", severity, limit = 50 } = req.query;
    const filter = {};
    if (status !== "all") filter.status = status;
    if (severity) filter.severity = severity;

    const alerts = await SecurityAlert.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .lean();

    const counts = {
      active: await SecurityAlert.countDocuments({ status: "active" }),
      critical: await SecurityAlert.countDocuments({ status: "active", severity: "critical" }),
      high: await SecurityAlert.countDocuments({ status: "active", severity: "high" }),
    };

    return res.json({ alerts, counts });
  }

  if (req.method === "PATCH") {
    const { alertId, status, note } = req.body;
    const update = { status };
    if (status === "resolved" || status === "dismissed") {
      update.resolvedBy = req.admin.name || req.admin.sub;
      update.resolvedAt = new Date();
      update.resolvedNote = note;
    }
    const alert = await SecurityAlert.findByIdAndUpdate(alertId, update, { new: true });
    return res.json({ alert });
  }

  res.status(405).json({ error: "Method not allowed" });
}

export default requireAdmin(handler, "compliance");
