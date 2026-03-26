import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import Order from "../../../models/Order";
import { getAuthUser } from "../../../lib/getUser";

export default async function handler(req, res) {
  await connectDB();
  const user = await getAuthUser(req, res);
  if (!user) return res.status(401).json({ error: "Please login" });

  if (req.method === "GET") {
    const orders = await Order.find({ userId: user._id }).sort({ createdAt: -1 }).lean();
    return res.json({ orders });
  }
  return res.status(405).json({ error: "Method not allowed" });
}
