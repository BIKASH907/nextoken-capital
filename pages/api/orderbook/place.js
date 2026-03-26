import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import Asset from "../../../lib/models/Asset";
import Wallet from "../../../models/Wallet";
import Investment from "../../../models/Investment";
import HoldingLot from "../../../models/HoldingLot";
import OrderBook from "../../../models/OrderBook";
import Order from "../../../models/Order";
import { matchOrder } from "../../../lib/matchingEngine";
import { checkRisk } from "../../../lib/riskEngine";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  await connectDB();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).json({ error: "Not authenticated" });
  const user = await User.findOne({ email: session.user.email });
  if (!user) return res.status(404).json({ error: "User not found" });
  if (user.kycStatus !== "approved") return res.status(403).json({ error: "KYC required" });

  const { assetId, side, units, pricePerUnit } = req.body;
  if (!assetId || !side || !units || !pricePerUnit || units <= 0 || pricePerUnit <= 0) {
    return res.status(400).json({ error: "assetId, side (bid/ask), units, pricePerUnit required" });
  }
  if (!["bid", "ask"].includes(side)) return res.status(400).json({ error: "Side must be bid or ask" });

  const asset = await Asset.findById(assetId);
  if (!asset) return res.status(404).json({ error: "Asset not found" });

  const totalAmount = units * pricePerUnit;
  const fee = Math.round(totalAmount * 0.005 * 100) / 100;

  await checkRisk(user._id, "order", { amount: totalAmount, action: side });

  // BID: Lock funds
  if (side === "bid") {
    let wallet = await Wallet.findOne({ userId: user._id });
    if (!wallet) wallet = await Wallet.create({ userId: user._id });
    if (wallet.availableBalance < totalAmount + fee) {
      return res.status(400).json({ error: "Insufficient balance. Need EUR " + (totalAmount + fee).toLocaleString() });
    }
    wallet.availableBalance -= (totalAmount + fee);
    wallet.lockedBalance += (totalAmount + fee);
    wallet.transactions.push({ type: "buy", amount: -(totalAmount + fee), assetName: asset.name, status: "pending", description: "Bid order: " + units + " units @ EUR " + pricePerUnit });
    await wallet.save();
  }

  // ASK: Check token ownership + lock tokens (FIFO)
  if (side === "ask") {
    const inv = await Investment.findOne({ userId: user._id, assetId, status: "active" });
    if (!inv || inv.units < units) {
      return res.status(400).json({ error: "Insufficient tokens. You own " + (inv?.units || 0) + " units" });
    }
    // Check unlocked units
    const openAsks = await OrderBook.find({ userId: user._id, assetId, side: "ask", status: { $in: ["open", "partial"] } });
    const lockedUnits = openAsks.reduce((s, o) => s + o.remainingUnits, 0);
    if (units > inv.units - lockedUnits) {
      return res.status(400).json({ error: "Only " + (inv.units - lockedUnits) + " units available (rest locked in orders)" });
    }
  }

  // Create order
  const order = await OrderBook.create({
    assetId, assetName: asset.name, side, userId: user._id,
    units, remainingUnits: units, pricePerUnit, totalAmount, fee,
  });

  // Also record in Order model for dashboard
  await Order.create({
    userId: user._id, assetId, assetName: asset.name,
    type: side === "bid" ? "buy" : "sell", units, pricePerUnit, totalAmount, fee,
    status: "pending",
  });

  // Run matching engine
  const result = await matchOrder(order);

  let message = "";
  if (result.order.status === "filled") message = "Order fully matched! " + result.trades.length + " trade(s) executed.";
  else if (result.order.status === "partial") message = "Partially matched: " + result.filled + "/" + units + " units filled. Rest on order book.";
  else message = "Order placed on book. Waiting for match.";

  return res.json({
    order: { id: order._id, status: result.order.status, filled: result.filled, remaining: result.remaining },
    trades: result.trades.map(t => ({ units: t.units, price: t.pricePerUnit, amount: t.totalAmount, txHash: t.txHash })),
    message,
  });
}
