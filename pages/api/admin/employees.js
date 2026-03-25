import { requireAdmin } from "../../../lib/adminAuth";
import dbConnect from "../../../lib/db";
import Employee from "../../../models/Employee";
import bcrypt from "bcryptjs";
import { logAudit } from "../../../lib/auditLog";

async function handler(req, res) {
  await dbConnect();

  // GET — list employees
  if (req.method === "GET") {
    const employees = await Employee.find({}, "-password -mfaSecret").sort({ createdAt: -1 }).lean();
    const roleCounts = {};
    employees.forEach(e => { roleCounts[e.role] = (roleCounts[e.role] || 0) + 1; });
    return res.json({ employees, roleCounts, total: employees.length });
  }

  // POST — create employee (Super Admin only)
  if (req.method === "POST") {
    if (req.admin.role !== "super_admin") {
      return res.status(403).json({ error: "Only Super Admin can create employee accounts" });
    }

    const { firstName, lastName, email, password, role } = req.body;
    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({ error: "All fields required" });
    }

    const validRoles = ["super_admin", "compliance_admin", "finance_admin", "support_admin", "audit"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    // Max 2 super admins
    if (role === "super_admin") {
      const superCount = await Employee.countDocuments({ role: "super_admin", isActive: true });
      if (superCount >= 2) {
        return res.status(400).json({ error: "Maximum 2 Super Admins allowed" });
      }
    }

    const existing = await Employee.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ error: "Email already exists" });

    const hashed = await bcrypt.hash(password, 12);
    const employee = await Employee.create({
      firstName, lastName, email: email.toLowerCase(), password: hashed, role,
      createdBy: req.admin.sub || req.admin.id,
    });

    await logAudit({ action: "employee_created", category: "user", admin: req.admin, targetType: "employee", targetId: employee._id.toString(), details: { email, role }, req, severity: "high" });

    return res.json({ employee: { ...employee.toJSON(), password: undefined } });
  }

  // PATCH — update employee
  if (req.method === "PATCH") {
    if (req.admin.role !== "super_admin") {
      return res.status(403).json({ error: "Only Super Admin can modify employees" });
    }

    const { employeeId, updates } = req.body;
    delete updates.password; // don't allow password change here

    if (updates.role === "super_admin") {
      const superCount = await Employee.countDocuments({ role: "super_admin", isActive: true, _id: { $ne: employeeId } });
      if (superCount >= 2) return res.status(400).json({ error: "Max 2 Super Admins" });
    }

    const employee = await Employee.findByIdAndUpdate(employeeId, updates, { new: true }).select("-password -mfaSecret");
    await logAudit({ action: "employee_updated", category: "user", admin: req.admin, targetType: "employee", targetId: employeeId, details: updates, req, severity: "high" });

    return res.json({ employee });
  }

  // DELETE — deactivate employee
  if (req.method === "DELETE") {
    if (req.admin.role !== "super_admin") {
      return res.status(403).json({ error: "Only Super Admin can deactivate employees" });
    }
    const { employeeId } = req.body;
    await Employee.findByIdAndUpdate(employeeId, { isActive: false });
    await logAudit({ action: "employee_deactivated", category: "user", admin: req.admin, targetType: "employee", targetId: employeeId, req, severity: "critical" });
    return res.json({ success: true });
  }

  res.status(405).json({ error: "Method not allowed" });
}

export default requireAdmin(handler, "super_admin");
