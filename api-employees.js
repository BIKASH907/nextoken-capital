// pages/api/admin/employees.js
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
  await connectDB();
  const admin = await verifyAdmin(req);
  if (!admin) return res.status(401).json({ error: "Unauthorized" });

  // Only super_admin can manage employees
  if (admin.role !== "super_admin") {
    return res.status(403).json({ error: "Only Super Admins can manage employees" });
  }

  // GET — list all employees
  if (req.method === "GET") {
    try {
      const employees = await Employee.find()
        .select("-password")
        .sort({ createdAt: -1 })
        .lean();
      return res.json({ employees });
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch employees" });
    }
  }

  // POST — create new employee
  if (req.method === "POST") {
    try {
      const { firstName, lastName, email, password, role, department, phone } = req.body;

      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: "First name, last name, email, and password required" });
      }
      if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters" });
      }

      // Check duplicate email
      const existing = await Employee.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(400).json({ error: "An employee with this email already exists" });
      }

      // Max 2 super admins
      if (role === "super_admin") {
        const superCount = await Employee.countDocuments({ role: "super_admin", isActive: true });
        if (superCount >= 2) {
          return res.status(400).json({ error: "Maximum 2 Super Admins allowed" });
        }
      }

      const hash = await bcrypt.hash(password, 12);
      const emp = await Employee.create({
        firstName,
        lastName,
        email: email.toLowerCase(),
        password: hash,
        role: role || "support",
        department,
        phone,
        isActive: true,
        createdBy: admin._id,
      });

      const { password: _, ...safe } = emp.toObject();
      return res.json({ success: true, employee: safe });
    } catch (err) {
      console.error("Create employee error:", err);
      return res.status(500).json({ error: "Failed to create employee" });
    }
  }

  // PUT — update employee
  if (req.method === "PUT") {
    try {
      const { employeeId, firstName, lastName, password, role, department, phone, isActive } = req.body;
      if (!employeeId) return res.status(400).json({ error: "employeeId required" });

      const target = await Employee.findById(employeeId);
      if (!target) return res.status(404).json({ error: "Employee not found" });

      // Prevent demoting yourself
      if (target._id.toString() === admin._id.toString() && role && role !== "super_admin") {
        return res.status(400).json({ error: "Cannot change your own role" });
      }

      // Prevent deactivating yourself
      if (target._id.toString() === admin._id.toString() && isActive === false) {
        return res.status(400).json({ error: "Cannot deactivate your own account" });
      }

      // Max 2 super admins check
      if (role === "super_admin" && target.role !== "super_admin") {
        const superCount = await Employee.countDocuments({ role: "super_admin", isActive: true });
        if (superCount >= 2) {
          return res.status(400).json({ error: "Maximum 2 Super Admins allowed" });
        }
      }

      const update = {};
      if (firstName) update.firstName = firstName;
      if (lastName) update.lastName = lastName;
      if (role) update.role = role;
      if (department !== undefined) update.department = department;
      if (phone !== undefined) update.phone = phone;
      if (isActive !== undefined) update.isActive = isActive;
      if (password && password.length >= 8) {
        update.password = await bcrypt.hash(password, 12);
      }
      update.updatedAt = new Date();

      await Employee.findByIdAndUpdate(employeeId, { $set: update });
      return res.json({ success: true, message: "Employee updated" });
    } catch (err) {
      console.error("Update employee error:", err);
      return res.status(500).json({ error: "Failed to update employee" });
    }
  }

  // DELETE — remove employee
  if (req.method === "DELETE") {
    try {
      const { employeeId } = req.body;
      if (!employeeId) return res.status(400).json({ error: "employeeId required" });

      const target = await Employee.findById(employeeId);
      if (!target) return res.status(404).json({ error: "Employee not found" });

      // Cannot delete yourself
      if (target._id.toString() === admin._id.toString()) {
        return res.status(400).json({ error: "Cannot delete your own account" });
      }

      // Cannot delete super_admin
      if (target.role === "super_admin") {
        return res.status(400).json({ error: "Cannot delete a Super Admin. Change their role first." });
      }

      await Employee.findByIdAndDelete(employeeId);
      return res.json({ success: true, message: "Employee deleted" });
    } catch (err) {
      console.error("Delete employee error:", err);
      return res.status(500).json({ error: "Failed to delete employee" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
