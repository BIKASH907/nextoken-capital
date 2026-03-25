import dbConnect from "./db";
import AuditLog from "../models/AuditLog";
import crypto from "crypto";

let lastHash = "0".repeat(64);

export async function logAudit({ action, category, admin, targetType, targetId, details, req, result = "success", severity = "low" }) {
  try {
    await dbConnect();
    const record = {
      action,
      category: category || "system",
      adminId: admin?.id || admin?.sub || "system",
      adminName: admin?.name || admin?.firstName || "System",
      adminRole: admin?.role || "system",
      targetType,
      targetId,
      details,
      ip: req?.headers?.["x-forwarded-for"] || req?.socket?.remoteAddress || "unknown",
      userAgent: req?.headers?.["user-agent"] || "unknown",
      result,
      severity,
      previousHash: lastHash,
    };

    const content = JSON.stringify(record);
    record.hash = crypto.createHash("sha256").update(content + lastHash).digest("hex");
    lastHash = record.hash;

    await AuditLog.create(record);
  } catch (err) {
    console.error("[AUDIT] Failed to log:", err.message);
  }
}

// Wrap any API handler to auto-log
export function withAudit(handler, { action, category, severity }) {
  return async (req, res) => {
    const originalJson = res.json.bind(res);
    res.json = function (body) {
      logAudit({
        action,
        category,
        admin: req.admin,
        details: { method: req.method, body: req.body, status: res.statusCode },
        req,
        result: res.statusCode < 400 ? "success" : "failure",
        severity,
      });
      return originalJson(body);
    };
    return handler(req, res);
  };
}
