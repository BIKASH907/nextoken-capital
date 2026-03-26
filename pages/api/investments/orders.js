import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import Order from "../../../models/Order";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).json({ error: "Not authenticated" });
  const user = await User.findOne({ email: session.user.email });
  if (!user) return res.status(404).json({ error: "User not found" });

  if (req.method === "GET") {
    const orders = await Order.find({ userId: user._id }).sort({ createdAt: -1 }).lean();
    return res.json({ orders });
  }
  return res.status(405).json({ error: "Method not allowed" });
}
