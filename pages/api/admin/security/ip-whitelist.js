import { requireAdmin } from "../../../../lib/adminAuth";
import dbConnect from "../../../../lib/db";
import mongoose from "mongoose";
import { logAudit } from "../../../../lib/auditLog";
async function handler(req, res) {
  await dbConnect();
  const db = mongoose.connection.db;
  if (req.method === "GET") { const ips = await db.collection("ip_whitelist").find().sort({ createdAt: -1 }).toArray(); return res.json({ ips }); }
  if (req.method === "POST") {
    const { action, ip, label } = req.body;
    if (action === "add") { if (!ip) return res.status(400).json({ error: "IP required" }); await db.collection("ip_whitelist").insertOne({ ip, label: label || "", addedBy: req.admin?.email, createdAt: new Date() }); await logAudit({ action: "ip_whitelist_add", category: "security", admin: req.admin, details: { ip }, req, severity: "high" }); return res.json({ success: true, message: "IP " + ip + " added" }); }
    if (action === "remove") { await db.collection("ip_whitelist").deleteOne({ ip }); await logAudit({ action: "ip_whitelist_remove", category: "security", admin: req.admin, details: { ip }, req, severity: "high" }); return res.json({ success: true, message: "IP removed" }); }
  }
  return res.status(405).end();
}
export default requireAdmin(handler);
