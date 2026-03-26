import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import Investment from "../../../models/Investment";
import Order from "../../../models/Order";
import OrderBook from "../../../models/OrderBook";
import Wallet from "../../../models/Wallet";
import Fee from "../../../models/Fee";
import { notify } from "../../../lib/notify";
import { checkRisk } from "../../../lib/riskEngine";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  await connectDB();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).json({ error: "Not authenticated" });
  const user = await User.findOne({ email: session.user.email });
  if (!user) return res.status(404).json({ error: "User not found" });

  const { investmentId, units, pricePerUnit } = req.body;
  if (!investmentId || !units || units <= 0) return res.status(400).json({ error: "Investment and units required" });

  const investment = await Investment.findOne({ _id: investmentId, userId: user._id, status: "active" });
  if (!investment) return res.status(404).json({ error: "Active investment not found" });

  // Check locked units
  const pendingSells = await Order.find({ userId: user._id, assetId: investment.assetId, type: "sell", status: { $in: ["pending","processing"] } });
  const lockedUnits = pendingSells.reduce((s, o) => s + o.units, 0);
  if (units > investment.units - lockedUnits) return res.status(400).json({ error: "Only " + (investment.units - lockedUnits) + " units available to sell" });

  const sellPrice = pricePerUnit || investment.pricePerUnit;
  const totalAmount = units * sellPrice;
  const fee = Math.round(totalAmount * 0.01 * 100) / 100;

  await checkRisk(user._id, "order", { amount: totalAmount, action: "sell", assetName: investment.assetName });

  const txHash = "0x" + crypto.randomBytes(32).toString("hex");

  // Create sell order on order book
  const order = await Order.create({ userId: user._id, assetId: investment.assetId, assetName: investment.assetName, type: "sell", units, pricePerUnit: sellPrice, totalAmount, fee, status: "pending", txHash, sellerId: user._id });

  // Also place on order book for matching
  await OrderBook.create({ assetId: investment.assetId, assetName: investment.assetName, side: "ask", userId: user._id, units, pricePerUnit: sellPrice, totalAmount, fee, expiresAt: new Date(Date.now() + 7*24*60*60*1000) });

  await notify(user._id, "sell_completed", "Sell Order Listed", units + " units of " + investment.assetName + " listed for EUR " + sellPrice + "/unit", "/dashboard", { units, price: sellPrice });

  return res.json({ success: true, order: { id: order._id, units, pricePerUnit: sellPrice, totalAmount, fee }, message: units + " units listed for sale at EUR " + sellPrice + "/unit" });
}
