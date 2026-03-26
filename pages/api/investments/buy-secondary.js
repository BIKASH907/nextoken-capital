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
  const buyer = await User.findOne({ email: session.user.email });
  if (!buyer) return res.status(404).json({ error: "User not found" });
  if (buyer.kycStatus !== "approved") return res.status(403).json({ error: "KYC required" });

  const { orderId } = req.body;
  if (!orderId) return res.status(400).json({ error: "Order ID required" });

  const sellOrder = await Order.findOne({ _id: orderId, type: "sell", status: "pending" });
  if (!sellOrder) return res.status(404).json({ error: "Sell order not found or already filled" });
  if (sellOrder.userId.toString() === buyer._id.toString()) return res.status(400).json({ error: "Cannot buy your own listing" });

  const totalWithFee = sellOrder.totalAmount + sellOrder.fee;

  // Check buyer wallet
  let buyerWallet = await Wallet.findOne({ userId: buyer._id });
  if (!buyerWallet) buyerWallet = await Wallet.create({ userId: buyer._id });
  if (buyerWallet.availableBalance < totalWithFee) {
    return res.status(400).json({ error: "Insufficient balance. Need EUR " + totalWithFee.toLocaleString() });
  }

  const txHash = "0x" + crypto.randomBytes(32).toString("hex");

  try {
    // Deduct from buyer
    buyerWallet.availableBalance -= totalWithFee;
    buyerWallet.transactions.push({ type: "buy", amount: -totalWithFee, assetName: sellOrder.assetName, txHash, status: "completed", description: "Secondary market buy: " + sellOrder.units + " units" });
    await buyerWallet.save();

    // Credit seller (minus fee)
    let sellerWallet = await Wallet.findOne({ userId: sellOrder.userId });
    if (!sellerWallet) sellerWallet = await Wallet.create({ userId: sellOrder.userId });
    const sellerAmount = sellOrder.totalAmount - sellOrder.fee;
    sellerWallet.availableBalance += sellerAmount;
    sellerWallet.transactions.push({ type: "sell", amount: sellerAmount, assetName: sellOrder.assetName, txHash, status: "completed", description: "Sold " + sellOrder.units + " units" });
    await sellerWallet.save();

    // Transfer tokens: reduce seller investment, increase buyer investment
    const sellerInvestment = await Investment.findOne({ userId: sellOrder.userId, assetId: sellOrder.assetId, status: "active" });
    if (sellerInvestment) {
      sellerInvestment.units -= sellOrder.units;
      if (sellerInvestment.units <= 0) sellerInvestment.status = "sold";
      sellerInvestment.totalInvested = sellerInvestment.units * sellerInvestment.pricePerUnit;
      await sellerInvestment.save();
    }

    let buyerInvestment = await Investment.findOne({ userId: buyer._id, assetId: sellOrder.assetId, status: "active" });
    if (buyerInvestment) {
      buyerInvestment.units += sellOrder.units;
      buyerInvestment.totalInvested += sellOrder.totalAmount;
      await buyerInvestment.save();
    } else {
      await Investment.create({
        userId: buyer._id, assetId: sellOrder.assetId, assetName: sellOrder.assetName,
        units: sellOrder.units, pricePerUnit: sellOrder.pricePerUnit,
        totalInvested: sellOrder.totalAmount, currentValue: sellOrder.totalAmount,
        status: "active", txHash,
      });
    }

    // Mark order complete
    sellOrder.status = "completed";
    sellOrder.buyerId = buyer._id;
    sellOrder.txHash = txHash;
    await sellOrder.save();

    return res.json({ success: true, txHash, message: "Purchased " + sellOrder.units + " units from secondary market" });
  } catch (err) {
    // Rollback buyer wallet
    buyerWallet.availableBalance += totalWithFee;
    await buyerWallet.save();
    return res.status(500).json({ error: "Transaction failed. Funds returned." });
  }
}
