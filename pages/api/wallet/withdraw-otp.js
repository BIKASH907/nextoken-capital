import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import Wallet from "../../../models/Wallet";
import mongoose from "mongoose";
import crypto from "crypto";
import { notify } from "../../../lib/notify";
import { getAuthUser } from "../../../lib/getUser";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  await connectDB();
  const user = await getAuthUser(req, res);
  if (!user) return res.status(401).json({ error: "Please login" });
  const db = mongoose.connection.db;
  const { action, otp, amount } = req.body;

  if (action === "send") {
    if (!amount || amount <= 0) return res.status(400).json({ error: "Amount required" });
    if (amount > 5000) return res.status(400).json({ error: "Max EUR 5,000/day" });
    let wallet = await Wallet.findOne({ userId: user._id });
    if (!wallet || wallet.availableBalance < amount) return res.status(400).json({ error: "Insufficient balance" });

    const code = crypto.randomInt(100000, 999999).toString();
    await db.collection("withdrawal_otps").updateOne({ userId: user._id.toString() }, { $set: { otp: code, amount: Number(amount), expires: new Date(Date.now() + 10*60*1000) } }, { upsert: true });

    try {
      if (process.env.RESEND_API_KEY) {
        await fetch("https://api.resend.com/emails", { method: "POST",
          headers: { Authorization: "Bearer " + process.env.RESEND_API_KEY, "Content-Type": "application/json" },
          body: JSON.stringify({ from: "Nextoken Capital <noreply@nextokencapital.com>", to: user.email, subject: "Withdrawal OTP - EUR " + amount,
            html: "<div style='font-family:system-ui;max-width:400px;margin:0 auto;padding:20px'><h2 style='color:#F0B90B'>Withdrawal Verification</h2><p>Amount: <strong>EUR " + amount + "</strong></p><div style='font-size:32px;font-weight:900;letter-spacing:8px;color:#F0B90B;padding:20px;background:#0F1318;border-radius:12px;text-align:center'>" + code + "</div><p style='color:#666;font-size:13px'>Expires in 10 minutes.</p></div>" }),
        });
      }
    } catch(e) {}
    return res.json({ success: true, message: "OTP sent to " + user.email });
  }

  if (action === "verify") {
    const record = await db.collection("withdrawal_otps").findOne({ userId: user._id.toString() });
    if (!record) return res.status(400).json({ error: "No OTP. Request new one." });
    if (new Date() > new Date(record.expires)) return res.status(400).json({ error: "OTP expired" });
    if (record.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });

    let wallet = await Wallet.findOne({ userId: user._id });
    if (!wallet || wallet.availableBalance < record.amount) return res.status(400).json({ error: "Insufficient balance" });

    wallet.availableBalance -= record.amount;
    wallet.transactions.push({ type: "withdrawal", amount: -record.amount, status: "pending", description: "Withdrawal EUR " + record.amount + " (OTP verified, pending review)" });
    await wallet.save();
    await db.collection("withdrawal_otps").deleteOne({ userId: user._id.toString() });
    await notify(user._id, "system", "Withdrawal Submitted", "EUR " + record.amount + " withdrawal verified and pending admin review", "/dashboard");
    return res.json({ success: true, message: "Withdrawal of EUR " + record.amount + " submitted (OTP verified)" });
  }
  return res.status(400).json({ error: "Action: send or verify" });
}
