// pages/api/admin/auth/register.js
// Creates the FIRST super admin — disable after first use by checking env
import bcrypt from "bcryptjs";
import { connectDB } from "../../../../lib/mongodb";
import Employee from "../../../../lib/models/Employee";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // Security: require a setup secret to prevent unauthorized access
  const { setupSecret, firstName, lastName, email, password } = req.body;

  if (setupSecret !== process.env.ADMIN_SETUP_SECRET) {
    return res.status(403).json({ error: "Invalid setup secret" });
  }

  await connectDB();

  // Only allow if no super_admin exists yet
  const existingSuperAdmin = await Employee.findOne({ role: "super_admin" });
  if (existingSuperAdmin) {
    return res.status(403).json({ error: "Super admin already exists. Use /admin to create more employees." });
  }

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: "All fields required" });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }

  const exists = await Employee.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(400).json({ error: "Email already registered" });

  const hashed = await bcrypt.hash(password, 12);

  const employee = await Employee.create({
    firstName, lastName,
    email: email.toLowerCase(),
    password: hashed,
    role: "super_admin",
    isActive: true,
    permissions: {
      users:        { view: true, edit: true, ban: true },
      investments:  { view: true, create: true, edit: true, delete: true },
      assets:       { view: true, create: true, edit: true, delete: true, publish: true },
      kyc:          { view: true, approve: true, reject: true },
      transactions: { view: true, refund: true },
      blockchain:   { view: true, whitelist: true, mint: true },
      employees:    { view: true, create: true, edit: true, delete: true },
      reports:      { view: true, export: true },
    },
  });

  return res.status(201).json({
    success: true,
    message: "Super admin created. You can now log in at /admin/login",
    email: employee.email,
  });
}
