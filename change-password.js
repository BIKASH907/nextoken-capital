// pages/api/user/change-password.js
import connectDB from "../../../lib/db";
import User from "../../../lib/models/User";
import { getToken } from "next-auth/jwt";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  await connectDB();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  let user = token.id ? await User.findById(token.id).catch(() => null) : null;
  if (!user && token.email) user = await User.findOne({ email: token.email.toLowerCase() });
  if (!user) return res.status(401).json({ error: "User not found" });

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Both current and new password required" });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: "New password must be at least 8 characters" });
  }

  // Google OAuth users may not have a password
  if (!user.password) {
    // Set password for first time (Google users)
    const hash = await bcrypt.hash(newPassword, 12);
    await User.findByIdAndUpdate(user._id, { $set: { password: hash } });
    return res.json({ success: true, message: "Password set successfully" });
  }

  // Verify current password
  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) {
    return res.status(400).json({ error: "Current password is incorrect" });
  }

  // Hash and save new password
  const hash = await bcrypt.hash(newPassword, 12);
  await User.findByIdAndUpdate(user._id, { $set: { password: hash } });

  return res.json({ success: true, message: "Password changed successfully" });
}
