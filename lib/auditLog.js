import dbConnect from "./db";
import AuditLog from "../models/AuditLog";
import crypto from "crypto";

let lastHash = "0".repeat(64);

// Parse user agent into browser + OS
function parseUserAgent(ua) {
  if (!ua) return { browser: "Unknown", os: "Unknown", device: "Unknown" };

  let browser = "Unknown", os = "Unknown";

  // Browser
  if (ua.includes("Edg/")) browser = "Edge";
  else if (ua.includes("Chrome/")) browser = "Chrome";
  else if (ua.includes("Firefox/")) browser = "Firefox";
  else if (ua.includes("Safari/") && !ua.includes("Chrome")) browser = "Safari";
  else if (ua.includes("Opera") || ua.includes("OPR/")) browser = "Opera";

  // OS
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac OS")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

  return { browser, os, device: browser + " / " + os };
}

// Get location from IP (free API, no key needed)
async function getLocation(ip) {
  try {
    if (!ip || ip === "unknown" || ip === "::1" || ip.startsWith("127.") || ip.startsWith("192.168.") || ip.startsWith("10.")) {
      return { country: "Local", city: "Local", countryCode: "LO" };
    }
    const res = await fetch("http://ip-api.com/json/" + ip + "?fields=country,city,countryCode", { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return { country: "Unknown", city: "Unknown", countryCode: "XX" };
    const data = await res.json();
    return { country: data.country || "Unknown", city: data.city || "Unknown", countryCode: data.countryCode || "XX" };
  } catch {
    return { country: "Unknown", city: "Unknown", countryCode: "XX" };
  }
}

export async function logAudit({
  action, category, admin, targetType, targetId, targetName,
  statusBefore, statusAfter, details, comment, req,
  result = "success", severity = "low"
}) {
  try {
    await dbConnect();

    const ip = req?.headers?.["x-forwarded-for"]?.split(",")[0]?.trim() || req?.socket?.remoteAddress || "unknown";
    const ua = req?.headers?.["user-agent"] || "unknown";
    const { browser, os, device } = parseUserAgent(ua);
    const { country, city, countryCode } = await getLocation(ip);

    const record = {
      action,
      category: category || "system",
      adminId: admin?.id || admin?.sub || "system",
      adminName: admin?.name || admin?.firstName || "System",
      adminEmail: admin?.email || "",
      adminRole: admin?.role || "system",
      targetType,
      targetId,
      targetName: targetName || "",
      statusBefore: statusBefore || "",
      statusAfter: statusAfter || "",
      details,
      comment: comment || "",
      result,
      severity,
      ip,
      country,
      city,
      countryCode,
      userAgent: ua,
      browser,
      os,
      device,
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

export function withAudit(handler, { action, category, severity }) {
  return async (req, res) => {
    const originalJson = res.json.bind(res);
    res.json = function (body) {
      logAudit({ action, category, admin: req.admin, details: { method: req.method, status: res.statusCode }, req, result: res.statusCode < 400 ? "success" : "failure", severity });
      return originalJson(body);
    };
    return handler(req, res);
  };
}
