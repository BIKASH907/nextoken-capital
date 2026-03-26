import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import Wallet from "../../../models/Wallet";
import { getAuthUser } from "../../../lib/getUser";

export default async function handler(req, res) {
  await connectDB();
  const user = await getAuthUser(req, res);
  if (!user) return res.status(401).json({ error: "Please login" });

  let wallet = await Wallet.findOne({ userId: user._id });
  if (!wallet) wallet = await Wallet.create({ userId: user._id });

  if (req.method === "GET") {
    return res.json({ wallet: { available: wallet.availableBalance, locked: wallet.lockedBalance, earnings: wallet.totalEarnings, currency: wallet.currency, address: wallet.walletAddress, transactions: wallet.transactions.slice(-20).reverse() } });
  }
  return res.status(405).json({ error: "Method not allowed" });
}
