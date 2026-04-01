import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import Asset from "../../../lib/models/Asset";
import Wallet from "../../../models/Wallet";
import Investment from "../../../models/Investment";
import Order from "../../../models/Order";
import HoldingLot from "../../../models/HoldingLot";
import Fee from "../../../models/Fee";
import Escrow from "../../../models/Escrow";
import { creditPlatformWallet } from "../../../lib/platformWallet";
import { notify } from "../../../lib/notify";
import { checkRisk } from "../../../lib/riskEngine";
import crypto from "crypto";
import { getAuthUser } from "../../../lib/getUser";

const COMMISSION_RATE = 0.002; // 0.2% Nextoken commission

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  await connectDB();

  const user = await getAuthUser(req, res);
  if (!user) return res.status(401).json({ error: "Please login to continue" });

  if (!user.kycStatus || user.kycStatus !== "approved") {
    return res.status(403).json({ error: "KYC verification required. Please complete identity verification first." });
  }

  const { assetId, units: rawUnits } = req.body;
  if (!assetId || !rawUnits || rawUnits <= 0) return res.status(400).json({ error: "Asset and units required" });
  const units = parseInt(rawUnits);

  const asset = await Asset.findById(assetId);
  if (!asset) return res.status(404).json({ error: "Asset not found" });
  if (!["live","approved"].includes(asset.status)) return res.status(400).json({ error: "Asset not available" });

  const pricePerUnit = asset.tokenPrice || 0;
  if (pricePerUnit <= 0) return res.status(400).json({ error: "Invalid token price" });

  const investmentAmount = units * pricePerUnit;
  const commission = Math.round(investmentAmount * COMMISSION_RATE * 100) / 100;
  const issuerReceives = investmentAmount - commission;
  const totalCharge = investmentAmount; // Investor pays exact amount, commission comes from it

  // Check wallet balance
  let wallet = await Wallet.findOne({ userId: user._id });
  if (!wallet) wallet = await Wallet.create({ userId: user._id });
  if (wallet.availableBalance < totalCharge) {
    return res.status(400).json({ error: "Insufficient balance. Need EUR " + totalCharge + ", have EUR " + wallet.availableBalance.toFixed(2) });
  }

  // Check for pending orders
  const pending = await Order.findOne({ userId: user._id, assetId, status: { $in: ["pending","processing"] } });
  if (pending) return res.status(400).json({ error: "Pending order exists" });

  await checkRisk(user._id, "order", { amount: totalCharge, action: "buy", assetName: asset.name });

  const txHash = "0x" + crypto.randomBytes(32).toString("hex");

  // === NON-CUSTODIAL FLOW ===
  // 1. Deduct from investor wallet (investor is paying)
  wallet.availableBalance -= totalCharge;
  wallet.transactions.push({
    type: "investment",
    amount: -totalCharge,
    assetId: asset._id.toString(),
    assetName: asset.name,
    status: "completed",
    description: "Investment: " + units + " units of " + asset.name + " (EUR " + investmentAmount + ")",
    txHash
  });
  await wallet.save();

  // 2. Create order
  const order = await Order.create({
    userId: user._id,
    assetId: asset._id,
    assetName: asset.name,
    type: "buy",
    units,
    pricePerUnit,
    totalAmount: totalCharge,
    fee: commission,
    status: "completed",
    txHash,
    buyerId: user._id,
    settlementType: "non-custodial",
  });

  // 3. Create/update investment record
  let inv = await Investment.findOne({ userId: user._id, assetId: asset._id, status: "active" });
  if (inv) {
    inv.units += units;
    inv.totalInvested += investmentAmount;
    inv.currentValue = inv.units * pricePerUnit;
    await inv.save();
  } else {
    inv = await Investment.create({
      userId: user._id,
      assetId: asset._id,
      assetName: asset.name,
      assetType: asset.assetType,
      units,
      pricePerUnit,
      totalInvested: investmentAmount,
      currentValue: investmentAmount,
      yieldRate: asset.targetROI || 0,
      status: "active",
      txHash,
    });
  }

  // 4. Create holding lot (30-day FIFO tracking)
  await HoldingLot.create({
    userId: user._id,
    assetId: asset._id,
    assetName: asset.name,
    units,
    remainingUnits: units,
    purchaseDate: new Date(),
    pricePerUnit,
    source: "primary",
    txHash,
  });

  // 5. Update asset stats
  await Asset.findByIdAndUpdate(asset._id, {
    $inc: { raisedAmount: investmentAmount, soldUnits: units, investorCount: 1 }
  });

  // 6. DIRECT TO ISSUER — funds go straight to issuer, NOT held by Nextoken
  if (asset.issuerId) {
    let issuerWallet = await Wallet.findOne({ userId: asset.issuerId });
    if (!issuerWallet) issuerWallet = await Wallet.create({ userId: asset.issuerId });

    // Issuer receives investment minus commission
    issuerWallet.availableBalance += issuerReceives;
    issuerWallet.transactions.push({
      type: "investment_received",
      amount: issuerReceives,
      assetName: asset.name,
      txHash,
      status: "completed",
      description: "Investment received: " + units + " units sold (EUR " + investmentAmount + " - " + (COMMISSION_RATE*100) + "% commission = EUR " + issuerReceives.toFixed(2) + ")"
    });
    await issuerWallet.save();

    await notify(
      asset.issuerId, "system", "Investment Received",
      "EUR " + issuerReceives.toFixed(2) + " received for " + asset.name + " (" + units + " units). Commission: EUR " + commission.toFixed(2),
      "/issuer-dashboard", { amount: issuerReceives, txHash }
    );
  }

  // 7. COMMISSION ONLY to Nextoken platform wallet
  await Fee.create({
    type: "commission",
    amount: commission,
    assetId: asset._id.toString(),
    assetName: asset.name,
    userId: user._id.toString(),
    userName: user.firstName || user.email,
    orderId: order._id.toString(),
    txHash,
    description: COMMISSION_RATE*100 + "% platform commission on EUR " + investmentAmount + " investment",
  });

  // 7b. Credit Nextoken platform wallet
  await creditPlatformWallet(commission, "Buy commission: " + units + " units of " + asset.name + " (EUR " + investmentAmount + ")", txHash, asset.name);

  // 8. Create escrow record for audit trail
  let escrow = await Escrow.findOne({ assetId: asset._id, status: { $in: ["active", "funded"] } });
  if (escrow) {
    escrow.amountRaised += investmentAmount;
    await escrow.save();
  }

  // 9. Notify investor
  await notify(
    user._id, "buy_completed", "Investment Successful",
    "Purchased " + units + " units of " + asset.name + " for EUR " + investmentAmount + ". Funds sent directly to issuer. Platform fee: EUR " + commission.toFixed(2) + ". Hold 30+ days for profit eligibility.",
    "/dashboard", { assetId, units, amount: investmentAmount, commission, txHash }
  );

  return res.json({
    success: true,
    order: { id: order._id, units, investmentAmount, commission, issuerReceives: issuerReceives.toFixed(2), totalCharged: totalCharge, txHash },
    message: "Purchased " + units + " units. EUR " + issuerReceives.toFixed(2) + " sent to issuer. Commission: EUR " + commission.toFixed(2) + ". Hold 30+ days for profit distribution.",
    flow: "non-custodial",
  });
}