// pages/api/user/change-password.js
import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  await connectDB();

  // Get session from NextAuth
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  // Find user — try multiple ID fields for compatibility
  const userId = session.id || session.sub || session.user?.id;
  let user = userId ? await User.findById(userId).catch(() => null) : null;
  if (!user && session.user?.email) {
    user = await User.findOne({ email: session.user.email.toLowerCase() });
  }
  if (!user) return res.status(401).json({ error: "User not found" });

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Both current and new password required" });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: "New password must be at least 8 characters" });
  }

  // Google OAuth users may not have a password — let them set one
  if (!user.password) {
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
