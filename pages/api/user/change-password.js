import dbConnect from "../../../lib/db";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { isPasswordBreached } from "../../../lib/checkPasswordBreach";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  await dbConnect();

  // Check session
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).json({ error: "Not authenticated" });

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) return res.status(400).json({ error: "Both current and new password required" });
  if (newPassword.length < 8) return res.status(400).json({ error: "New password must be at least 8 characters" });
  if (currentPassword === newPassword) return res.status(400).json({ error: "New password must be different from current" });

  // Check new password against breaches BEFORE changing
  const breach = await isPasswordBreached(newPassword);
  if (breach.breached) {
    return res.status(400).json({
      error: "This password has appeared in " + breach.count.toLocaleString() + " data breaches. Choose a different password."
    });
  }

  const user = await User.findOne({ email: session.user.email });
  if (!user) return res.status(404).json({ error: "User not found" });
  if (!user.password) return res.status(400).json({ error: "Account uses Google sign-in. Password cannot be changed." });

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) return res.status(401).json({ error: "Current password is incorrect" });

  user.password = await bcrypt.hash(newPassword, 12);
  user.passwordChangedAt = new Date();
  await user.save();

  return res.json({ success: true, message: "Password changed successfully" });
}
