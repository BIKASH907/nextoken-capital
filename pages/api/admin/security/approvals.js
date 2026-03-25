import { requireAdmin } from "../../../../lib/adminAuth";
import dbConnect from "../../../../lib/db";
import ApprovalRequest from "../../../../models/ApprovalRequest";
import { logAudit } from "../../../../lib/auditLog";

async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const { status = "pending" } = req.query;
    const filter = status === "all" ? {} : { status };
    const requests = await ApprovalRequest.find(filter).sort({ createdAt: -1 }).limit(100).lean();
    const pendingCount = await ApprovalRequest.countDocuments({ status: "pending" });
    return res.json({ requests, pendingCount });
  }

  if (req.method === "POST") {
    const { type, payload, reason } = req.body;
    const request = await ApprovalRequest.create({
      type,
      payload,
      reason,
      requestedBy: req.admin.sub || req.admin.id,
      requestedByName: req.admin.name || req.admin.firstName,
    });
    await logAudit({ action: "approval_requested", category: "system", admin: req.admin, targetType: "approval", targetId: request._id.toString(), details: { type, payload }, req, severity: "medium" });
    return res.json({ request });
  }

  if (req.method === "PATCH") {
    const { requestId, action, note } = req.body;
    const request = await ApprovalRequest.findById(requestId);
    if (!request) return res.status(404).json({ error: "Not found" });
    if (request.status !== "pending") return res.status(400).json({ error: "Already processed" });

    if (request.requestedBy === (req.admin.sub || req.admin.id)) {
      return res.status(403).json({ error: "Cannot approve your own request (four-eyes principle)" });
    }

    if (new Date() > request.expiresAt) {
      request.status = "expired";
      await request.save();
      return res.status(400).json({ error: "Request expired" });
    }

    request.status = action === "approve" ? "approved" : "rejected";
    request.approvedBy = req.admin.sub || req.admin.id;
    request.approvedByName = req.admin.name || req.admin.firstName;
    request.reason = note;
    await request.save();

    await logAudit({ action: "approval_" + request.status, category: "system", admin: req.admin, targetType: "approval", targetId: requestId, details: { type: request.type, action }, req, severity: "high" });
    return res.json({ request });
  }

  res.status(405).json({ error: "Method not allowed" });
}

export default requireAdmin(handler, "compliance");
