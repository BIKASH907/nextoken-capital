import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import Asset from "../../../lib/models/Asset";
import Wallet from "../../../models/Wallet";
import Investment from "../../../models/Investment";
import Order from "../../../models/Order";
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

  // Step 1: KYC Check
  if (user.kycStatus !== "approved") {
    return res.status(403).json({ error: "KYC verification required before investing. Please complete your identity verification." });
  }

  const { assetId, units } = req.body;
  if (!assetId || !units || units <= 0) return res.status(400).json({ error: "Asset ID and units required" });

  const asset = await Asset.findById(assetId);
  if (!asset) return res.status(404).json({ error: "Asset not found" });
  if (asset.status !== "live" && asset.approvalStatus !== "live") {
    return res.status(400).json({ error: "Asset is not available for investment" });
  }

  const pricePerUnit = asset.tokenPrice || (asset.targetRaise / asset.tokenSupply) || 100;
  const totalAmount = units * pricePerUnit;
  const fee = Math.round(totalAmount * 0.01 * 100) / 100; // 1% fee
  const totalWithFee = totalAmount + fee;

  // Step 2: Wallet balance check
  let wallet = await Wallet.findOne({ userId: user._id });
  if (!wallet) wallet = await Wallet.create({ userId: user._id });

  if (wallet.availableBalance < totalWithFee) {
    return res.status(400).json({ error: "Insufficient balance. Need EUR " + totalWithFee.toLocaleString() + " but have EUR " + wallet.availableBalance.toLocaleString() });
  }

  // Step 3: Prevent double spending - check for pending orders on same asset
  const pendingOrder = await Order.findOne({ userId: user._id, assetId, status: "pending" });
  if (pendingOrder) {
    return res.status(400).json({ error: "You already have a pending order for this asset. Please wait for it to complete." });
  }

  // Step 4: Check available supply
  const totalInvested = await Investment.aggregate([
    { $match: { assetId: asset._id, status: { $in: ["active", "pending"] } } },
    { $group: { _id: null, total: { $sum: "$units" } } }
  ]);
  const usedUnits = totalInvested[0]?.total || 0;
  const availableUnits = (asset.tokenSupply || 0) - usedUnits;
  if (units > availableUnits) {
    return res.status(400).json({ error: "Only " + availableUnits + " units available. You requested " + units });
  }

  // Step 5: LOCK funds in wallet
  wallet.availableBalance -= totalWithFee;
  wallet.lockedBalance += totalWithFee;
  wallet.transactions.push({
    type: "buy", amount: -totalWithFee, assetId: asset._id.toString(), assetName: asset.name,
    status: "pending", description: "Buy " + units + " units of " + asset.name,
  });
  await wallet.save();

  // Step 6: Create order
  const txHash = "0x" + crypto.randomBytes(32).toString("hex");
  const order = await Order.create({
    userId: user._id, assetId: asset._id, assetName: asset.name,
    type: "buy", units, pricePerUnit, totalAmount: totalWithFee, fee,
    status: "processing", txHash, buyerId: user._id,
  });

  // Step 7: Process (in production this would be async with blockchain)
  try {
    // Create/update investment
    let investment = await Investment.findOne({ userId: user._id, assetId: asset._id, status: "active" });
    if (investment) {
      investment.units += units;
      investment.totalInvested += totalAmount;
      investment.currentValue = investment.units * pricePerUnit;
      await investment.save();
    } else {
      investment = await Investment.create({
        userId: user._id, assetId: asset._id, assetName: asset.name,
        assetType: asset.assetType, units, pricePerUnit, totalInvested: totalAmount,
        currentValue: totalAmount, yieldRate: asset.targetROI || asset.interestRate || 0,
        maturityDate: asset.maturityDate, status: "active", txHash,
      });
    }

    // Step 8: Finalize - unlock and deduct
    wallet.lockedBalance -= totalWithFee;
    const lastTx = wallet.transactions[wallet.transactions.length - 1];
    if (lastTx) lastTx.status = "completed";
    lastTx.txHash = txHash;
    await wallet.save();

    // Update order status
    order.status = "completed";
    await order.save();

    return res.json({
      success: true,
      order: { id: order._id, units, totalAmount: totalWithFee, fee, txHash },
      message: "Successfully purchased " + units + " units of " + asset.name + " for EUR " + totalWithFee.toLocaleString(),
    });
  } catch (err) {
    // Step 9: ROLLBACK on failure
    wallet.availableBalance += totalWithFee;
    wallet.lockedBalance -= totalWithFee;
    const lastTx = wallet.transactions[wallet.transactions.length - 1];
    if (lastTx) lastTx.status = "failed";
    await wallet.save();

    order.status = "failed";
    await order.save();

    return res.status(500).json({ error: "Transaction failed. Funds have been returned to your wallet." });
  }
}
