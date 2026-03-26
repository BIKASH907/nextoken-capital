import { requireAdmin } from "../../../lib/adminAuth";
import dbConnect from "../../../lib/db";
import mongoose from "mongoose";
import { logAudit } from "../../../lib/auditLog";
async function handler(req, res) {
  await dbConnect();
  const db = mongoose.connection.db;
  if (req.method === "GET") { const proposals = await db.collection("governance_proposals").find().sort({ createdAt: -1 }).toArray(); const paused = await db.collection("governance_state").findOne({ key: "emergency_pause" }); return res.json({ proposals, emergencyPause: paused?.active || false }); }
  if (req.method === "POST") {
    const { action, title, description, proposalId } = req.body;
    if (action === "propose") { await db.collection("governance_proposals").insertOne({ title, description, proposedBy: req.admin?.email, status: "pending", approvals: [], requiredApprovals: 2, timelockExpires: new Date(Date.now() + 48*60*60*1000), createdAt: new Date() }); await logAudit({ action: "governance_proposal", category: "system", admin: req.admin, details: { title }, req, severity: "critical" }); return res.json({ success: true, message: "Proposal created (48hr timelock)" }); }
    if (action === "approve" && proposalId) { const p = await db.collection("governance_proposals").findOne({ _id: new mongoose.Types.ObjectId(proposalId) }); if (!p) return res.status(404).json({ error: "Not found" }); if (p.approvals?.includes(req.admin?.email)) return res.status(400).json({ error: "Already approved" }); const approvals = [...(p.approvals||[]), req.admin?.email]; const status = approvals.length >= p.requiredApprovals ? "approved" : "pending"; await db.collection("governance_proposals").updateOne({ _id: p._id }, { $set: { approvals, status } }); return res.json({ success: true, message: status === "approved" ? "Approved (2/2)" : "Recorded ("+approvals.length+"/2)" }); }
    if (action === "emergency_pause") { if (req.admin?.role !== "super_admin") return res.status(403).json({ error: "Super Admin only" }); const cur = await db.collection("governance_state").findOne({ key: "emergency_pause" }); const ns = !(cur?.active); await db.collection("governance_state").updateOne({ key: "emergency_pause" }, { $set: { active: ns, by: req.admin?.email, at: new Date() } }, { upsert: true }); await logAudit({ action: ns ? "emergency_pause_on" : "emergency_pause_off", category: "system", admin: req.admin, req, severity: "critical" }); return res.json({ success: true, emergencyPause: ns, message: ns ? "PAUSED" : "Resumed" }); }
  }
  return res.status(405).end();
}
export default requireAdmin(handler);
