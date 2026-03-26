import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import Wallet from "../../../models/Wallet";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).json({ error: "Not authenticated" });
  const user = await User.findOne({ email: session.user.email });
  if (!user) return res.status(404).json({ error: "User not found" });

  let wallet = await Wallet.findOne({ userId: user._id });
  if (!wallet) wallet = await Wallet.create({ userId: user._id });

  if (req.method === "GET") {
    return res.json({ wallet: { available: wallet.availableBalance, locked: wallet.lockedBalance, earnings: wallet.totalEarnings, currency: wallet.currency, address: wallet.walletAddress, transactions: wallet.transactions.slice(-20).reverse() } });
  }
  return res.status(405).json({ error: "Method not allowed" });
}
