import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import OrderBook from "../../../models/OrderBook";
import { getAuthUser } from "../../../lib/getUser";
export default async function handler(req, res) {
  await connectDB();
  const user = await getAuthUser(req, res);
  if (!user) return res.status(401).json({ error: "Please login" });
  const orders = await OrderBook.find({ userId: user._id }).sort({ createdAt: -1 }).limit(50).lean();
  return res.json({ orders });
}
