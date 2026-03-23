import { otps } from "./send-otp";
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: "Email and OTP required" });
  const record = otps.get(email.toLowerCase());
  if (!record) return res.status(400).json({ error: "No verification code found. Please request a new one." });
  if (Date.now() > record.expires) { otps.delete(email.toLowerCase()); return res.status(400).json({ error: "Code expired. Please request a new one." }); }
  if (record.otp !== otp) return res.status(400).json({ error: "Invalid code. Please try again." });
  otps.delete(email.toLowerCase());
  res.json({ success: true, verified: true });
}
