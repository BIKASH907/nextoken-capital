import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import Investment from "../../../models/Investment";
import Order from "../../../models/Order";
import Wallet from "../../../models/Wallet";
import Fee from "../../../models/Fee";
import { notify } from "../../../lib/notify";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  await connectDB();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).json({ error: "Not authenticated" });
  const buyer = await User.findOne({ email: session.user.email });
  if (!buyer) return res.status(404).json({ error: "User not found" });
  if (buyer.kycStatus !== "approved") return res.status(403).json({ error: "KYC required" });

  const { orderId } = req.body;
  const sellOrder = await Order.findOne({ _id: orderId, type: "sell", status: "pending" });
  if (!sellOrder) return res.status(404).json({ error: "Sell order not found" });
  if (sellOrder.userId.toString() === buyer._id.toString()) return res.status(400).json({ error: "Cannot buy your own listing" });

  const fee = Math.round(sellOrder.totalAmount * 0.01 * 100) / 100;
  const totalWithFee = sellOrder.totalAmount + fee;

  let buyerWallet = await Wallet.findOne({ userId: buyer._id });
  if (!buyerWallet) buyerWallet = await Wallet.create({ userId: buyer._id });
  if (buyerWallet.availableBalance < totalWithFee) return res.status(400).json({ error: "Insufficient balance" });

  const txHash = "0x" + crypto.randomBytes(32).toString("hex");

  try {
    // Deduct buyer
    buyerWallet.availableBalance -= totalWithFee;
    buyerWallet.transactions.push({ type: "buy", amount: -totalWithFee, assetName: sellOrder.assetName, txHash, status: "completed", description: "Secondary buy: " + sellOrder.units + " units" });
    await buyerWallet.save();

    // Credit seller
    let sellerWallet = await Wallet.findOne({ userId: sellOrder.userId });
    if (!sellerWallet) sellerWallet = await Wallet.create({ userId: sellOrder.userId });
    const sellerAmount = sellOrder.totalAmount - fee;
    sellerWallet.availableBalance += sellerAmount;
    sellerWallet.transactions.push({ type: "sell", amount: sellerAmount, assetName: sellOrder.assetName, txHash, status: "completed", description: "Sold " + sellOrder.units + " units" });
    await sellerWallet.save();

    // Transfer tokens
    let sellerInv = await Investment.findOne({ userId: sellOrder.userId, assetId: sellOrder.assetId, status: "active" });
    if (sellerInv) { sellerInv.units -= sellOrder.units; if (sellerInv.units <= 0) sellerInv.status = "sold"; sellerInv.totalInvested = sellerInv.units * sellerInv.pricePerUnit; await sellerInv.save(); }

    let buyerInv = await Investment.findOne({ userId: buyer._id, assetId: sellOrder.assetId, status: "active" });
    if (buyerInv) { buyerInv.units += sellOrder.units; buyerInv.totalInvested += sellOrder.totalAmount; await buyerInv.save(); }
    else { await Investment.create({ userId: buyer._id, assetId: sellOrder.assetId, assetName: sellOrder.assetName, units: sellOrder.units, pricePerUnit: sellOrder.pricePerUnit, totalInvested: sellOrder.totalAmount, currentValue: sellOrder.totalAmount, status: "active", txHash }); }

    sellOrder.status = "completed"; sellOrder.buyerId = buyer._id; sellOrder.txHash = txHash; await sellOrder.save();

    // Record fees (both sides)
    await Fee.create({ type: "trading", amount: fee, assetName: sellOrder.assetName, userId: buyer._id.toString(), orderId: sellOrder._id.toString(), txHash });
    await Fee.create({ type: "trading", amount: fee, assetName: sellOrder.assetName, userId: sellOrder.userId.toString(), orderId: sellOrder._id.toString(), txHash });

    // Notify both
    await notify(buyer._id, "buy_completed", "Purchase Complete", "Bought " + sellOrder.units + " units of " + sellOrder.assetName + " from secondary market", "/dashboard", { txHash });
    await notify(sellOrder.userId, "sell_completed", "Tokens Sold", sellOrder.units + " units of " + sellOrder.assetName + " sold for EUR " + sellerAmount.toLocaleString(), "/dashboard", { txHash });

    return res.json({ success: true, txHash, message: "Purchased " + sellOrder.units + " units" });
  } catch (err) {
    buyerWallet.availableBalance += totalWithFee; await buyerWallet.save();
    return res.status(500).json({ error: "Failed. Funds returned." });
  }
}
