import { connectDB } from "../../../lib/mongodb";
import { expireOrders } from "../../../lib/matchingEngine";
export default async function handler(req, res) {
  await connectDB();
  const count = await expireOrders();
  return res.json({ expired: count, message: count + " orders expired" });
}
