// pages/api/admin/seed-super.js — TEMPORARY, delete after use
import dbConnect from "../../../lib/db";
import Employee from "../../../models/Employee";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.query.key !== "nextoken-seed-2024") return res.status(403).json({ error: "Forbidden" });
  
  await dbConnect();
  
  const existing = await Employee.findOne({ email: "bikashbhat2001@gmail.com" });
  if (existing) return res.json({ message: "Already exists", role: existing.role, active: existing.isActive });

  const hash = await bcrypt.hash("Nextoken@2024", 12);
  const emp = await Employee.create({
    email: "bikashbhat2001@gmail.com",
    password: hash,
    firstName: "Bikash",
    lastName: "Bhat",
    role: "super_admin",
    isActive: true,
    securitySetupDone: false,
  });

  return res.json({ message: "Super admin created", id: emp._id, email: emp.email });
}