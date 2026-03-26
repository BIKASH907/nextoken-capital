import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import Investment from "../../../models/Investment";
import Order from "../../../models/Order";
import Wallet from "../../../models/Wallet";
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
  if (!investmentId || !units || units <= 0) return res.status(400).json({ error: "Investment ID and units required" });

  const investment = await Investment.findOne({ _id: investmentId, userId: user._id, status: "active" });
  if (!investment) return res.status(404).json({ error: "Active investment not found" });

  // Prevent selling more than owned
  const pendingSells = await Order.find({ userId: user._id, assetId: investment.assetId, type: "sell", status: { $in: ["pending", "processing"] } });
  const lockedUnits = pendingSells.reduce((s, o) => s + o.units, 0);
  const availableUnits = investment.units - lockedUnits;

  if (units > availableUnits) {
    return res.status(400).json({ error: "Cannot sell " + units + " units. Only " + availableUnits + " available (rest locked in pending sell orders)." });
  }

  const sellPrice = pricePerUnit || investment.pricePerUnit;
  const totalAmount = units * sellPrice;
  const fee = Math.round(totalAmount * 0.01 * 100) / 100;
  const txHash = "0x" + crypto.randomBytes(32).toString("hex");

  // Create sell order (listed on secondary market)
  const order = await Order.create({
    userId: user._id, assetId: investment.assetId, assetName: investment.assetName,
    type: "sell", units, pricePerUnit: sellPrice, totalAmount, fee,
    status: "pending", txHash, sellerId: user._id,
  });

  return res.json({
    success: true,
    order: { id: order._id, units, pricePerUnit: sellPrice, totalAmount, fee },
    message: units + " units of " + investment.assetName + " listed for sale at EUR " + sellPrice + "/unit",
  });
}
