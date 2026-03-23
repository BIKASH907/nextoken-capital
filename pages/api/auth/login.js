import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import bcrypt from "bcryptjs";
const { createToken, setSessionCookie } = require("../../../lib/session");
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password are required." });
  try {
    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ error: "No account found with this email address." });
    if (!user.password) return res.status(401).json({ error: "Please sign in with Google." });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Incorrect password." });
    if (!user.isActive) return res.status(401).json({ error: "Account suspended. Contact support." });
    const token = createToken({ userId: user._id.toString(), email: user.email, firstName: user.firstName, lastName: user.lastName, kycStatus: user.kycStatus, role: user.role });
    setSessionCookie(res, token);
    return res.status(200).json({ success: true, user: { userId: user._id.toString(), email: user.email, firstName: user.firstName, lastName: user.lastName, kycStatus: user.kycStatus } });

