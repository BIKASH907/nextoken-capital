import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "../../../../lib/mongodb";
import Employee from "../../../../lib/models/Employee";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });
    await connectDB();
    const employee = await Employee.findOne({ email: email.toLowerCase() });
    if (!employee) return res.status(401).json({ error: "Invalid credentials" });
    if (!employee.isActive) return res.status(403).json({ error: "Account disabled" });
    const valid = await bcrypt.compare(password, employee.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });
    await Employee.findByIdAndUpdate(employee._id, { lastLogin: new Date(), $inc: { loginCount: 1 } });
    const token = jwt.sign(
      { id: employee._id, email: employee.email, role: employee.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );
    return res.status(200).json({ token, employee: { id: employee._id, firstName: employee.firstName, lastName: employee.lastName, email: employee.email, role: employee.role } });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ error: err.message, stack: err.stack });
  }
}
