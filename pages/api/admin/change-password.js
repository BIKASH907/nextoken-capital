// pages/api/admin/change-password.js
import { connectDB } from "../../../lib/mongodb";
import Employee from "../../../lib/models/Employee";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

async function verifyAdmin(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return null;
  try {
    const decoded = jwt.verify(auth.split(" ")[1], process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET);
    const emp = await Employee.findById(decoded.id || decoded.employeeId);
    if (!emp || !emp.isActive) return null;
    return emp;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  await connectDB();
  const admin = await verifyAdmin(req);
  if (!admin) return res.status(401).json({ error: "Unauthorized" });

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Both current and new password required" });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: "New password must be at least 8 characters" });
  }

  // Verify current password
  const valid = await bcrypt.compare(currentPassword, admin.password);
  if (!valid) {
    return res.status(400).json({ error: "Current password is incorrect" });
  }

  // Hash and save
  const hash = await bcrypt.hash(newPassword, 12);
  await Employee.findByIdAndUpdate(admin._id, { $set: { password: hash } });

  return res.json({ success: true, message: "Password changed successfully" });
}