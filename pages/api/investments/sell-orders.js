import { connectDB } from "../../../lib/mongodb";
import Order from "../../../models/Order";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  await connectDB();
  const orders = await Order.find({ type: "sell", status: "pending" }).sort({ createdAt: -1 }).lean();
  return res.json({ orders });
}
