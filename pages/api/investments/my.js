import connectDB from "../../../lib/db";
import User from "../../../lib/models/User";
import Investment from "../../../lib/models/Investment";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Please login" });
  const userId = session.id || session.sub || session.user?.id;
  const user = await User.findById(userId);
  if (!user) return res.status(401).json({ error: "User not found" });

  if (req.method === "GET") {
    const investments = await Investment.find({ userId: user._id }).sort({ createdAt: -1 }).lean();
    const totalInvested = investments.reduce((s, i) => s + i.totalInvested, 0);
    const totalEarnings = investments.reduce((s, i) => s + i.earnings.reduce((es, e) => es + e.amount, 0), 0);
    const active = investments.filter(i => i.status === "active").length;
    return res.json({ investments, stats: { totalInvested, totalEarnings, active, total: investments.length } });
  }
  return res.status(405).json({ error: "Method not allowed" });
}
