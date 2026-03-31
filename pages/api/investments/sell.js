import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import Investment from "../../../models/Investment";
import Order from "../../../models/Order";
import OrderBook from "../../../models/OrderBook";
import HoldingLot from "../../../models/HoldingLot";
import Fee from "../../../models/Fee";
import { creditPlatformWallet } from "../../../lib/platformWallet";
import { notify } from "../../../lib/notify";
import { checkRisk } from "../../../lib/riskEngine";
import { getAuthUser } from "../../../lib/getUser";
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  await connectDB();
  const user = await getAuthUser(req, res);
  if (!user) return res.status(401).json({ error: "Please login" });

  const { investmentId, units, pricePerUnit } = req.body;
  if (!investmentId || !units || units <= 0) return res.status(400).json({ error: "Required" });
  const investment = await Investment.findOne({ _id: investmentId, userId: user._id, status: "active" });
  if (!investment) return res.status(404).json({ error: "Not found" });

  const pendingSells = await Order.find({ userId: user._id, assetId: investment.assetId, type: "sell", status: { $in: ["pending","processing"] } });
  const lockedUnits = pendingSells.reduce((s, o) => s + o.units, 0);
  if (units > investment.units - lockedUnits) return res.status(400).json({ error: "Only " + (investment.units - lockedUnits) + " available" });

  const sellPrice = pricePerUnit || investment.pricePerUnit;
  const totalAmount = units * sellPrice;
  const fee = Math.round(totalAmount * 0.003 * 100) / 100; // 0.3% sell fee

  await checkRisk(user._id, "order", { amount: totalAmount, action: "sell" });

  // FIFO: Deduct from oldest lots first
  let remaining = units;
  const lots = await HoldingLot.find({ userId: user._id, assetId: investment.assetId, remainingUnits: { $gt: 0 } }).sort({ purchaseDate: 1 });
  for (const lot of lots) {
    if (remaining <= 0) break;
    const deduct = Math.min(remaining, lot.remainingUnits);
    lot.remainingUnits -= deduct;
    remaining -= deduct;
    await lot.save();
  }

  const txHash = "0x" + crypto.randomBytes(32).toString("hex");
  const order = await Order.create({ userId: user._id, assetId: investment.assetId, assetName: investment.assetName, type: "sell", units, pricePerUnit: sellPrice, totalAmount, fee, status: "pending", txHash, sellerId: user._id });
  await OrderBook.create({ assetId: investment.assetId, assetName: investment.assetName, side: "ask", userId: user._id, units, pricePerUnit: sellPrice, totalAmount, fee, expiresAt: new Date(Date.now() + 7*24*60*60*1000) });

  // Collect sell commission to platform wallet
  await Fee.create({ type: "trading_sell", amount: fee, assetName: investment.assetName, userId: user._id.toString(), orderId: order._id.toString(), txHash });
  await creditPlatformWallet(fee, "Sell commission: " + units + " units of " + investment.assetName, txHash, investment.assetName);

  await notify(user._id, "sell_completed", "Sell Order Listed", units + " units listed at EUR " + sellPrice + "/unit", "/dashboard");
  return res.json({ success: true, order: { id: order._id, units, pricePerUnit: sellPrice, totalAmount, fee }, message: units + " units listed for sale" });
}
