import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import Asset from "../../../lib/models/Asset";
import Wallet from "../../../models/Wallet";
import Investment from "../../../models/Investment";
import Order from "../../../models/Order";
import HoldingLot from "../../../models/HoldingLot";
import Fee from "../../../models/Fee";
import { notify } from "../../../lib/notify";
import { checkRisk } from "../../../lib/riskEngine";
import crypto from "crypto";
import { getAuthUser } from "../../../lib/getUser";


export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  await connectDB();
  
  const user = await getAuthUser(req, res); if (!user) return res.status(401).json({ error: "Please login to continue" });
  
  
  if (user.kycStatus !== "approved") return res.status(403).json({ error: "KYC required" });

  const { assetId, units } = req.body;
  if (!assetId || !units || units <= 0) return res.status(400).json({ error: "Asset and units required" });
  const asset = await Asset.findById(assetId);
  if (!asset) return res.status(404).json({ error: "Asset not found" });
  if (asset.status !== "live" && asset.approvalStatus !== "live") return res.status(400).json({ error: "Asset not available" });

  const pricePerUnit = asset.tokenPrice || (asset.targetRaise && asset.tokenSupply ? Math.round(asset.targetRaise / asset.tokenSupply) : 100);
  const totalAmount = units * pricePerUnit;
  const fee = Math.round(totalAmount * 0.01 * 100) / 100;
  const totalWithFee = totalAmount + fee;

  let wallet = await Wallet.findOne({ userId: user._id });
  if (!wallet) wallet = await Wallet.create({ userId: user._id });
  if (wallet.availableBalance < totalWithFee) return res.status(400).json({ error: "Insufficient balance. Need EUR " + totalWithFee.toLocaleString() });

  const pending = await Order.findOne({ userId: user._id, assetId, status: { $in: ["pending","processing"] } });
  if (pending) return res.status(400).json({ error: "Pending order exists" });

  await checkRisk(user._id, "order", { amount: totalWithFee, action: "buy", assetName: asset.name });

  // LOCK
  wallet.availableBalance -= totalWithFee;
  wallet.lockedBalance += totalWithFee;
  wallet.transactions.push({ type: "buy", amount: -totalWithFee, assetId: asset._id.toString(), assetName: asset.name, status: "pending", description: "Buy " + units + " units of " + asset.name });
  await wallet.save();

  const txHash = "0x" + crypto.randomBytes(32).toString("hex");
  const order = await Order.create({ userId: user._id, assetId: asset._id, assetName: asset.name, type: "buy", units, pricePerUnit, totalAmount: totalWithFee, fee, status: "processing", txHash, buyerId: user._id });

  try {
    let inv = await Investment.findOne({ userId: user._id, assetId: asset._id, status: "active" });
    if (inv) { inv.units += units; inv.totalInvested += totalAmount; inv.currentValue = inv.units * pricePerUnit; await inv.save(); }
    else { inv = await Investment.create({ userId: user._id, assetId: asset._id, assetName: asset.name, assetType: asset.assetType, units, pricePerUnit, totalInvested: totalAmount, currentValue: totalAmount, yieldRate: asset.targetROI || 0, status: "active", txHash }); }

    // CREATE HOLDING LOT (for 30-day tracking)
    await HoldingLot.create({ userId: user._id, assetId: asset._id, assetName: asset.name, units, remainingUnits: units, purchaseDate: new Date(), pricePerUnit, source: "primary", txHash });
    await Asset.findByIdAndUpdate(asset._id, { $inc: { raisedAmount: totalAmount, investorCount: 1 } });

    // Credit issuer wallet automatically
    if (asset.issuerId) {
      let issuerWallet = await Wallet.findOne({ userId: asset.issuerId });
      if (!issuerWallet) issuerWallet = await Wallet.create({ userId: asset.issuerId });
      issuerWallet.availableBalance += totalAmount;
      issuerWallet.transactions.push({ type: "deposit", amount: totalAmount, assetName: asset.name, txHash, status: "completed", description: "Investment received: " + units + " units sold" });
      await issuerWallet.save();
      await notify(asset.issuerId, "system", "Investment Received", "EUR " + totalAmount.toLocaleString() + " received for " + asset.name + " (" + units + " units)", "/issuer-dashboard", { amount: totalAmount, txHash });
    }

    // Finalize
    wallet.lockedBalance -= totalWithFee;
    const lastTx = wallet.transactions[wallet.transactions.length - 1];
    if (lastTx) { lastTx.status = "completed"; lastTx.txHash = txHash; }
    await wallet.save();
    order.status = "completed"; await order.save();

    await Fee.create({ type: "trading", amount: fee, assetId: asset._id.toString(), assetName: asset.name, userId: user._id.toString(), userName: user.firstName, orderId: order._id.toString(), txHash });
    await notify(user._id, "buy_completed", "Investment Successful", "Purchased " + units + " units of " + asset.name + ". Hold 30+ days for profit eligibility.", "/dashboard", { assetId, units, amount: totalWithFee, txHash });

    return res.json({ success: true, order: { id: order._id, units, totalAmount: totalWithFee, fee, txHash }, message: "Purchased " + units + " units. Hold 30+ days for profit distribution." });
  } catch (err) {
    wallet.availableBalance += totalWithFee; wallet.lockedBalance -= totalWithFee;
    const lastTx = wallet.transactions[wallet.transactions.length - 1]; if (lastTx) lastTx.status = "failed";
    await wallet.save(); order.status = "failed"; await order.save();
    return res.status(500).json({ error: "Failed. Funds returned." });
  }
}
