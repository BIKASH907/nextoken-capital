import dbConnect from "../../../lib/db";
import User from "../../../models/User";
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  await dbConnect();
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const user = await User.findOne({ email: email.toLowerCase() });

  // Always return success (don't reveal if email exists)
  if (!user) return res.json({ success: true, message: "If an account exists, a reset link has been sent." });

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

  user.resetPasswordToken = resetTokenHash;
  user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
  await user.save();

  // Build reset URL
  const baseUrl = process.env.NEXTAUTH_URL || "https://nextokencapital.com";
  const resetUrl = `${baseUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

  // Send email via Resend (if configured)
  try {
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "re_placeholder") {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Nextoken Capital <noreply@nextokencapital.com>",
          to: email,
          subject: "Reset Your Password — Nextoken Capital",
          html: `
            <div style="font-family:system-ui,sans-serif;max-width:500px;margin:0 auto;padding:20px;">
              <h2 style="color:#F0B90B;">Nextoken Capital</h2>
              <p>You requested a password reset. Click the link below to set a new password:</p>
              <p><a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#F0B90B;color:#000;text-decoration:none;border-radius:8px;font-weight:700;">Reset Password</a></p>
              <p style="color:#666;font-size:13px;">This link expires in 30 minutes. If you did not request this, ignore this email.</p>
              <p style="color:#999;font-size:11px;margin-top:20px;">Nextoken Capital UAB — MiCA-compliant tokenized RWA platform</p>
            </div>
          `,
        }),
      });
    }
  } catch (err) {
    console.error("Email send error:", err);
  }

  // Log the URL in development
  if (process.env.NODE_ENV === "development") {
    console.log("Reset URL:", resetUrl);
  }

  return res.json({ success: true, message: "If an account exists, a reset link has been sent." });
}
