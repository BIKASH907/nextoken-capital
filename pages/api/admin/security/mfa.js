import { requireAdmin } from "../../../../lib/adminAuth";
import dbConnect from "../../../../lib/db";
import Employee from "../../../../models/Employee";
import crypto from "crypto";
async function handler(req, res) {
  await dbConnect();
  const adminId = req.admin?.sub || req.admin?.id;
  if (req.method === "GET") {
    const emp = await Employee.findById(adminId);
    return res.json({ mfaEnabled: emp?.mfaEnabled || false, mfaMethod: emp?.mfaMethod || "none" });
  }
  if (req.method === "POST") {
    const { action } = req.body;
    const emp = await Employee.findById(adminId);
    if (!emp) return res.status(404).json({ error: "Not found" });
    if (action === "generate_secret") {
      const secret = crypto.randomBytes(20).toString("hex").slice(0, 16).toUpperCase();
      emp.mfaSecret = secret; await emp.save();
      return res.json({ secret, message: "Enter this secret in Google Authenticator" });
    }
    if (action === "enable") { emp.mfaEnabled = true; emp.mfaMethod = "totp"; await emp.save(); return res.json({ success: true, message: "MFA enabled" }); }
    if (action === "disable") { emp.mfaEnabled = false; emp.mfaMethod = "none"; emp.mfaSecret = undefined; await emp.save(); return res.json({ success: true, message: "MFA disabled" }); }
  }
  return res.status(405).end();
}
export default requireAdmin(handler);
