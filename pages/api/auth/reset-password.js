import dbConnect from "../../../lib/db";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { isPasswordBreached } from "../../../lib/checkPasswordBreach";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  await dbConnect();
  const { token, email, newPassword } = req.body;

  if (!token || !email || !newPassword) return res.status(400).json({ error: "All fields required" });
  if (newPassword.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters" });

  // Check new password against breaches
  const breach = await isPasswordBreached(newPassword);
  if (breach.breached) {
    return res.status(400).json({
      error: "This password has appeared in " + breach.count.toLocaleString() + " data breaches. Choose a different password."
    });
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    email: email.toLowerCase(),
    resetPasswordToken: tokenHash,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) return res.status(400).json({ error: "Invalid or expired reset link. Please request a new one." });

  user.password = await bcrypt.hash(newPassword, 12);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  user.passwordChangedAt = new Date();
  await user.save();

  return res.json({ success: true, message: "Password reset successfully. You can now log in." });
}
