import { requireAdmin } from "../../../../lib/adminAuth";
import dbConnect from "../../../../lib/db";
import mongoose from "mongoose";
async function handler(req, res) {
  await dbConnect();
  const adminId = req.admin?.sub || req.admin?.id;
  const db = mongoose.connection.db;
  if (req.method === "GET") {
    const sessions = await db.collection("admin_sessions").find({ adminId }).sort({ lastActivity: -1 }).limit(20).toArray();
    return res.json({ sessions });
  }
  if (req.method === "POST") {
    const { action, sessionId } = req.body;
    if (action === "revoke" && sessionId) { await db.collection("admin_sessions").deleteOne({ _id: new mongoose.Types.ObjectId(sessionId) }); return res.json({ success: true, message: "Session revoked" }); }
    if (action === "revoke_all") { await db.collection("admin_sessions").deleteMany({ adminId }); return res.json({ success: true, message: "All sessions revoked" }); }
    if (action === "record") { await db.collection("admin_sessions").insertOne({ adminId, ip: req.headers["x-forwarded-for"] || "unknown", userAgent: req.headers["user-agent"] || "unknown", lastActivity: new Date(), createdAt: new Date() }); return res.json({ success: true }); }
  }
  return res.status(405).end();
}
export default requireAdmin(handler);
