import { connectDB } from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: "Email and OTP required" });

  await connectDB();

  const db = (await import("mongoose")).default.connection.db;
  const record = await db.collection("otps").findOne({ email: email.toLowerCase() });

  if (!record) return res.status(400).json({ error: "No verification code found. Please request a new one." });
  if (new Date() > new Date(record.expires)) {
    await db.collection("otps").deleteOne({ email: email.toLowerCase() });
    return res.status(400).json({ error: "Code expired. Please request a new one." });
  }
  if (record.otp !== otp) return res.status(400).json({ error: "Invalid code. Please try again." });

  await db.collection("otps").deleteOne({ email: email.toLowerCase() });
  return res.json({ success: true, verified: true });
}
