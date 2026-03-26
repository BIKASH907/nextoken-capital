import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import OrderBook from "../../../models/OrderBook";
import Wallet from "../../../models/Wallet";
import HoldingLot from "../../../models/HoldingLot";
import { getAuthUser } from "../../../lib/getUser";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  await connectDB();

  const user = await getAuthUser(req, res);
  if (!user) return res.status(401).json({ error: "Please login" });

  const { orderId } = req.body;
  const order = await OrderBook.findOne({ _id: orderId, userId: user._id, status: { $in: ["open", "partial"] } });
  if (!order) return res.status(404).json({ error: "Open order not found" });

  // Refund locked funds for bids
  if (order.side === "bid" && order.remainingUnits > 0) {
    const refund = order.remainingUnits * order.pricePerUnit * 1.005;
    let wallet = await Wallet.findOne({ userId: user._id });
    if (wallet) {
      wallet.lockedBalance = Math.max(0, wallet.lockedBalance - refund);
      wallet.availableBalance += refund;
      wallet.transactions.push({ type: "refund", amount: refund, assetName: order.assetName, status: "completed", description: "Cancelled bid: " + order.remainingUnits + " units" });
      await wallet.save();
    }
  }

  // Restore lots for asks
  if (order.side === "ask" && order.remainingUnits > 0) {
    // Lots were deducted in sell API, restore them
    const lots = await HoldingLot.find({ userId: user._id, assetId: order.assetId }).sort({ purchaseDate: -1 }).limit(1);
    if (lots[0]) { lots[0].remainingUnits += order.remainingUnits; await lots[0].save(); }
  }

  order.status = "cancelled";
  await order.save();

  return res.json({ success: true, message: "Order cancelled. " + (order.side === "bid" ? "Funds returned." : "Tokens unlocked.") });
}
