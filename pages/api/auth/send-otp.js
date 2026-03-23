import { connectDB } from "../../../lib/mongodb";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
const otps = new Map();
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otps.set(email.toLowerCase(), { otp, expires: Date.now() + 10 * 60 * 1000 });
  try {
    await resend.emails.send({
      from: "Nextoken Capital <noreply@nextokencapital.com>",
      to: email,
      subject: "Your verification code — Nextoken Capital",
      html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0F1318;color:#fff;border-radius:12px"><div style="font-size:24px;font-weight:900;color:#F0B90B;margin-bottom:8px">NXT</div><div style="font-size:18px;font-weight:700;margin-bottom:16px">Verify your email</div><div style="font-size:14px;color:rgba(255,255,255,0.6);margin-bottom:24px">Enter this code to complete your Nextoken Capital registration:</div><div style="font-size:40px;font-weight:900;letter-spacing:8px;color:#F0B90B;text-align:center;padding:24px;background:rgba(240,185,11,0.1);border-radius:8px;margin-bottom:24px">${otp}</div><div style="font-size:12px;color:rgba(255,255,255,0.4)">This code expires in 10 minutes. If you did not request this, ignore this email.</div></div>`,
    });
    res.json({ success: true });
  } catch(e) {
    res.status(500).json({ error: "Failed to send email: " + e.message });
  }
}
export { otps };
