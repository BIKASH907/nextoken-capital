import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import Investment from "../../../models/Investment";
import Order from "../../../models/Order";
import Wallet from "../../../models/Wallet";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).json({ error: "Not authenticated" });
  const user = await User.findOne({ email: session.user.email });
  if (!user) return res.status(404).json({ error: "User not found" });

  const { year } = req.query;
  const y = parseInt(year) || new Date().getFullYear();
  const start = new Date(y, 0, 1);
  const end = new Date(y + 1, 0, 1);

  const investments = await Investment.find({ userId: user._id }).lean();
  const orders = await Order.find({ userId: user._id, status: "completed", createdAt: { $gte: start, $lt: end } }).lean();
  const wallet = await Wallet.findOne({ userId: user._id }).lean();

  const buys = orders.filter(o => o.type === "buy");
  const sells = orders.filter(o => o.type === "sell");
  const totalBought = buys.reduce((s,o) => s + o.totalAmount, 0);
  const totalSold = sells.reduce((s,o) => s + o.totalAmount, 0);
  const totalFees = orders.reduce((s,o) => s + (o.fee || 0), 0);
  const totalEarnings = investments.reduce((s,i) => s + i.earnings.filter(e => new Date(e.date) >= start && new Date(e.date) < end).reduce((es,e) => es + e.amount, 0), 0);
  const capitalGains = totalSold - totalBought;

  return res.json({
    year: y,
    user: { name: user.firstName + " " + (user.lastName || ""), email: user.email },
    summary: { totalBought, totalSold, totalFees, totalEarnings, capitalGains, netIncome: totalEarnings + capitalGains },
    transactions: orders,
    earnings: investments.flatMap(i => i.earnings.filter(e => new Date(e.date) >= start && new Date(e.date) < end).map(e => ({ ...e, assetName: i.assetName }))),
  });
}
