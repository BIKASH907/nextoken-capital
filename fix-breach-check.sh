#!/bin/bash
# Adds HaveIBeenPwned breach check to registration + password change
# Run: chmod +x fix-breach-check.sh && ./fix-breach-check.sh
set -e

echo "  🔑 Adding password breach detection..."

# ═══════════════════════════════════════
# 1. Shared breach check utility
# ═══════════════════════════════════════
cat > lib/checkPasswordBreach.js << 'EOF'
// k-anonymity: Only sends first 5 chars of SHA1 hash
// NEVER sends full password or full hash to any external service
import crypto from "crypto";

export async function isPasswordBreached(password) {
  try {
    const sha1 = crypto.createHash("sha1").update(password).digest("hex").toUpperCase();
    const prefix = sha1.substring(0, 5);   // Only this goes to the API
    const suffix = sha1.substring(5);       // This stays local

    const res = await fetch("https://api.pwnedpasswords.com/range/" + prefix, {
      headers: { "Add-Padding": "true", "User-Agent": "Nextoken-Capital-Security" },
    });
    const text = await res.text();

    for (const line of text.split("\n")) {
      const parts = line.split(":");
      if (parts[0].trim() === suffix) {
        return { breached: true, count: parseInt(parts[1].trim(), 10) };
      }
    }
    return { breached: false, count: 0 };
  } catch (err) {
    // If API is down, don't block the user — fail open
    console.error("Breach check failed:", err.message);
    return { breached: false, count: 0 };
  }
}
EOF

echo "  ✓ Shared breach check utility (k-anonymity)"

# ═══════════════════════════════════════
# 2. Updated Registration API
# ═══════════════════════════════════════
cat > pages/api/auth/register.js << 'EOF'
import { connectDB } from '../../../lib/mongodb';
import User from '../../../lib/models/User';
import bcrypt from 'bcryptjs';
import { isPasswordBreached } from '../../../lib/checkPasswordBreach';
const { createToken, setSessionCookie } = require('../../../lib/session');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, password, firstName, lastName, country, countryCode, phone, dob } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  // Password strength check
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }

  // Check password against HaveIBeenPwned (k-anonymity — safe)
  const breach = await isPasswordBreached(password);
  if (breach.breached) {
    return res.status(400).json({
      error: 'This password has appeared in ' + breach.count.toLocaleString() + ' data breaches. Please choose a different, unique password.'
    });
  }

  try {
    await connectDB();
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ error: 'An account with this email already exists.' });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashed,
      firstName,
      lastName,
      country: country || '',
      countryCode: countryCode || '',
      phone: phone || '',
      dob: dob || '',
      role: 'investor',
      kycStatus: 'pending',
    });

    const token = createToken(user);
    setSessionCookie(res, token);
    return res.status(201).json({ user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
}
EOF

echo "  ✓ Registration API with breach check"

# ═══════════════════════════════════════
# 3. Updated Change Password API
# ═══════════════════════════════════════
cat > pages/api/user/change-password.js << 'EOF'
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
EOF

echo "  ✓ Change password API with breach check"

# ═══════════════════════════════════════
# 4. Updated Reset Password API (also check breaches)
# ═══════════════════════════════════════
cat > pages/api/auth/reset-password.js << 'EOF'
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
EOF

echo "  ✓ Reset password API with breach check"

echo ""
echo "  ╔═══════════════════════════════════════════════════════════╗"
echo "  ║  ✅ PASSWORD BREACH DETECTION INTEGRATED                  ║"
echo "  ║                                                           ║"
echo "  ║  Checked at 3 points:                                     ║"
echo "  ║    ✓ Registration — breached passwords blocked            ║"
echo "  ║    ✓ Change password — breached passwords blocked         ║"
echo "  ║    ✓ Reset password — breached passwords blocked          ║"
echo "  ║                                                           ║"
echo "  ║  Security:                                                ║"
echo "  ║    ✓ k-anonymity: Only first 5 chars of SHA1 sent        ║"
echo "  ║    ✓ Full password NEVER leaves the server                ║"
echo "  ║    ✓ Full hash NEVER sent to external API                 ║"
echo "  ║    ✓ Fail-open: If API down, user is not blocked          ║"
echo "  ║                                                           ║"
echo "  ║  RUN:                                                     ║"
echo "  ║    git add -A && git commit -m 'feat: breach detection'   ║"
echo "  ║    git push && npx vercel --prod                          ║"
echo "  ╚═══════════════════════════════════════════════════════════╝"
