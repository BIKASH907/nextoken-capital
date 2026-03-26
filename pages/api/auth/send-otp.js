import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  await connectDB();

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 10 * 60 * 1000);

  // Store OTP in a temp collection
  const db = (await import("mongoose")).default.connection.db;
  await db.collection("otps").updateOne(
    { email: email.toLowerCase() },
    { $set: { otp, expires, email: email.toLowerCase() } },
    { upsert: true }
  );

  // Send via Resend
  try {
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "re_placeholder") {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: "Bearer " + process.env.RESEND_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Nextoken Capital <noreply@nextokencapital.com>",
          to: email,
          subject: "Your Verification Code - Nextoken Capital",
          html: "<div style='font-family:system-ui;max-width:400px;margin:0 auto;padding:20px'><h2 style='color:#F0B90B'>Nextoken Capital</h2><p>Your verification code:</p><div style='font-size:32px;font-weight:900;letter-spacing:8px;color:#F0B90B;padding:20px;background:#0F1318;border-radius:12px;text-align:center'>" + otp + "</div><p style='color:#666;font-size:13px;margin-top:16px'>Expires in 10 minutes.</p></div>",
        }),
      });
    }
  } catch (err) {
    console.error("OTP email error:", err);
  }

  if (process.env.NODE_ENV === "development") console.log("OTP for " + email + ": " + otp);

  return res.json({ success: true, message: "Verification code sent to " + email });
}
