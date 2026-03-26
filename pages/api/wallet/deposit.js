import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import Wallet from "../../../models/Wallet";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  await connectDB();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).json({ error: "Not authenticated" });
  const user = await User.findOne({ email: session.user.email });
  if (!user) return res.status(404).json({ error: "User not found" });

  const { amount, action } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ error: "Valid amount required" });

  let wallet = await Wallet.findOne({ userId: user._id });
  if (!wallet) wallet = await Wallet.create({ userId: user._id });

  if (action === "deposit") {
    wallet.availableBalance += Number(amount);
    wallet.transactions.push({ type: "deposit", amount: Number(amount), status: "completed", description: "Deposit EUR " + amount });
    await wallet.save();
    return res.json({ success: true, balance: wallet.availableBalance, message: "EUR " + amount + " deposited" });
  }

  if (action === "withdraw") {
    if (wallet.availableBalance < amount) return res.status(400).json({ error: "Insufficient balance" });
    if (amount > 5000) return res.status(400).json({ error: "Daily withdrawal limit: EUR 5,000. For higher amounts contact support." });

    wallet.availableBalance -= Number(amount);
    wallet.transactions.push({ type: "withdrawal", amount: -Number(amount), status: "pending", description: "Withdrawal EUR " + amount + " (pending review)" });
    await wallet.save();
    return res.json({ success: true, balance: wallet.availableBalance, message: "Withdrawal of EUR " + amount + " submitted for review" });
  }

  return res.status(400).json({ error: "Action must be deposit or withdraw" });
}
