import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import Wallet from "../../../models/Wallet";
import Investment from "../../../models/Investment";
import OrderBook from "../../../models/OrderBook";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import crypto from "crypto";

async function matchOrders(order) {
  const oppSide = order.side === "bid" ? "ask" : "bid";
  const sort = order.side === "bid" ? { pricePerUnit: 1 } : { pricePerUnit: -1 };
  const priceFilter = order.side === "bid" ? { $lte: order.pricePerUnit } : { $gte: order.pricePerUnit };

  const matches = await OrderBook.find({
    assetId: order.assetId, side: oppSide, status: { $in: ["open","partial"] },
    pricePerUnit: priceFilter, userId: { $ne: order.userId },
  }).sort(sort);

  let remaining = order.units - order.filledUnits;
  for (const match of matches) {
    if (remaining <= 0) break;
    const available = match.units - match.filledUnits;
    const fillUnits = Math.min(remaining, available);
    const fillPrice = match.pricePerUnit;
    const txHash = "0x" + crypto.randomBytes(32).toString("hex");

    // Update both orders
    order.filledUnits += fillUnits;
    order.matchedWith.push({ orderId: match._id, units: fillUnits, price: fillPrice, at: new Date(), txHash });
    match.filledUnits += fillUnits;
    match.matchedWith.push({ orderId: order._id, units: fillUnits, price: fillPrice, at: new Date(), txHash });

    order.status = order.filledUnits >= order.units ? "filled" : "partial";
    match.status = match.filledUnits >= match.units ? "filled" : "partial";

    // Transfer funds and tokens
    const buyerId = order.side === "bid" ? order.userId : match.userId;
    const sellerId = order.side === "ask" ? order.userId : match.userId;
    const amount = fillUnits * fillPrice;
    const fee = Math.round(amount * 0.005 * 100) / 100;

    let buyerWallet = await Wallet.findOne({ userId: buyerId });
    let sellerWallet = await Wallet.findOne({ userId: sellerId });
    if (buyerWallet) { buyerWallet.availableBalance -= (amount + fee); buyerWallet.transactions.push({ type:"buy", amount:-(amount+fee), txHash, status:"completed", description:"Matched order: "+fillUnits+" units" }); await buyerWallet.save(); }
    if (sellerWallet) { sellerWallet.availableBalance += (amount - fee); sellerWallet.transactions.push({ type:"sell", amount:(amount-fee), txHash, status:"completed", description:"Matched order: "+fillUnits+" units" }); await sellerWallet.save(); }

    // Transfer investment ownership
    let sellerInv = await Investment.findOne({ userId: sellerId, assetId: order.assetId, status:"active" });
    if (sellerInv) { sellerInv.units -= fillUnits; if(sellerInv.units<=0) sellerInv.status="sold"; await sellerInv.save(); }
    let buyerInv = await Investment.findOne({ userId: buyerId, assetId: order.assetId, status:"active" });
    if (buyerInv) { buyerInv.units += fillUnits; buyerInv.totalInvested += amount; await buyerInv.save(); }
    else { await Investment.create({ userId:buyerId, assetId:order.assetId, assetName:order.assetName, units:fillUnits, pricePerUnit:fillPrice, totalInvested:amount, currentValue:amount, status:"active", txHash }); }

    await match.save();
    remaining -= fillUnits;
  }
  await order.save();
  return order;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  await connectDB();
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).json({ error: "Not authenticated" });
  const user = await User.findOne({ email: session.user.email });
  if (!user) return res.status(404).json({ error: "User not found" });
  if (user.kycStatus !== "approved") return res.status(403).json({ error: "KYC required" });

  const { assetId, assetName, side, units, pricePerUnit } = req.body;
  if (!assetId || !side || !units || !pricePerUnit) return res.status(400).json({ error: "All fields required" });
  if (!["bid","ask"].includes(side)) return res.status(400).json({ error: "Side must be bid or ask" });

  const totalAmount = units * pricePerUnit;
  const fee = Math.round(totalAmount * 0.005 * 100) / 100;

  if (side === "bid") {
    let wallet = await Wallet.findOne({ userId: user._id });
    if (!wallet || wallet.availableBalance < totalAmount + fee) return res.status(400).json({ error: "Insufficient balance" });
    wallet.lockedBalance += totalAmount + fee;
    wallet.availableBalance -= totalAmount + fee;
    await wallet.save();
  }
  if (side === "ask") {
    const inv = await Investment.findOne({ userId: user._id, assetId, status: "active" });
    if (!inv || inv.units < units) return res.status(400).json({ error: "Insufficient units to sell" });
  }

  let order = await OrderBook.create({ assetId, assetName, side, userId: user._id, units, pricePerUnit, totalAmount, fee, expiresAt: new Date(Date.now() + 7*24*60*60*1000) });
  order = await matchOrders(order);

  return res.json({ order, message: order.status === "filled" ? "Order fully matched!" : order.status === "partial" ? "Partially matched. Remaining on order book." : "Order placed on order book." });
}
