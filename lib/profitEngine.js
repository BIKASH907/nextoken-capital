import dbConnect from "./db";
import HoldingLot from "../models/HoldingLot";
import Wallet from "../models/Wallet";
import Fee from "../models/Fee";
import { notify } from "./notify";
import crypto from "crypto";

const MIN_HOLDING_DAYS = 30;

export async function calculateDistribution(assetId, totalProfit) {
  await dbConnect();
  const lots = await HoldingLot.find({ assetId, remainingUnits: { $gt: 0 } });

  let eligibleTokens = 0;
  let ineligibleTokens = 0;
  const eligible = [];
  const ineligible = [];

  for (const lot of lots) {
    const days = lot.holdingDays();
    if (days >= MIN_HOLDING_DAYS) {
      eligibleTokens += lot.remainingUnits;
      eligible.push({ lot, days });
    } else {
      ineligibleTokens += lot.remainingUnits;
      ineligible.push({ lot, days, daysRemaining: MIN_HOLDING_DAYS - days });
    }
  }

  // Aggregate by user
  const eligibleByUser = {};
  eligible.forEach(e => {
    const uid = e.lot.userId.toString();
    if (!eligibleByUser[uid]) eligibleByUser[uid] = { userId: e.lot.userId, units: 0, lots: [] };
    eligibleByUser[uid].units += e.lot.remainingUnits;
    eligibleByUser[uid].lots.push(e);
  });

  const ineligibleByUser = {};
  ineligible.forEach(e => {
    const uid = e.lot.userId.toString();
    if (!ineligibleByUser[uid]) ineligibleByUser[uid] = { userId: e.lot.userId, units: 0, daysRemaining: e.daysRemaining };
    ineligibleByUser[uid].units += e.lot.remainingUnits;
    ineligibleByUser[uid].daysRemaining = Math.min(ineligibleByUser[uid].daysRemaining, e.daysRemaining);
  });

  // Split profit
  const totalTokens = eligibleTokens + ineligibleTokens;
  const eligiblePortion = totalTokens > 0 ? (eligibleTokens / totalTokens) * totalProfit : 0;
  const ineligiblePortion = totalProfit - eligiblePortion;

  // Redistribute ineligible portion: 50% to eligible, 25% platform, 25% issuer reserve
  const bonusToEligible = ineligiblePortion * 0.5;
  const platformFee = ineligiblePortion * 0.25;
  const issuerReserve = ineligiblePortion * 0.25;
  const totalToEligible = eligiblePortion + bonusToEligible;

  // Calculate per-user payouts
  const payouts = [];
  for (const [uid, data] of Object.entries(eligibleByUser)) {
    const share = eligibleTokens > 0 ? data.units / eligibleTokens : 0;
    const amount = Math.round(totalToEligible * share * 100) / 100;
    payouts.push({
      investorId: data.userId, unitsOwned: data.units, holdingDays: data.lots[0]?.days || 0,
      sharePercent: Math.round(share * 10000) / 100, amount, eligible: true,
    });
  }

  return {
    totalProfit, eligibleTokens, ineligibleTokens, totalTokens, MIN_HOLDING_DAYS,
    eligiblePortion, ineligiblePortion, bonusToEligible, platformFee, issuerReserve,
    totalToEligible, payouts,
    ineligibleInvestors: Object.values(ineligibleByUser).map(u => ({
      investorId: u.userId, units: u.units, daysRemaining: u.daysRemaining, eligible: false,
    })),
  };
}

export async function executeDistribution(distribution, assetName) {
  await dbConnect();
  const results = [];

  // DEDUCT from issuer wallet first (non-custodial: issuer pays directly)
  if (distribution.issuerId) {
    let issuerWallet = await Wallet.findOne({ userId: distribution.issuerId });
    if (issuerWallet) {
      issuerWallet.availableBalance -= distribution.totalProfit;
      issuerWallet.transactions.push({
        type: "profit_distribution_out",
        amount: -distribution.totalProfit,
        assetName,
        status: "completed",
        description: "Profit distributed: EUR " + distribution.totalProfit + " for " + assetName,
      });
      await issuerWallet.save();
    }
  }

  for (const p of distribution.distributions) {
    if (!p.eligible || p.amount <= 0) continue;

    let wallet = await Wallet.findOne({ userId: p.investorId });
    if (!wallet) wallet = await Wallet.create({ userId: p.investorId });

    const txHash = "0x" + crypto.randomBytes(32).toString("hex");
    wallet.availableBalance += p.amount;
    wallet.totalEarnings += p.amount;
    wallet.transactions.push({
      type: "profit_distribution", amount: p.amount, assetName, txHash,
      status: "completed", description: "Profit: " + assetName + " (" + p.holdingDays + " days held)",
    });
    await wallet.save();

    p.txHash = txHash;
    p.status = "completed";
    results.push({ investorId: p.investorId, amount: p.amount, txHash });

    await notify(p.investorId, "distribution_received", "Profit Received",
      "EUR " + p.amount.toFixed(2) + " from " + assetName + " (held " + p.holdingDays + " days)",
      "/dashboard", { amount: p.amount, txHash, assetName });
  }

  // Record platform fee
  if (distribution.platformFee > 0) {
    await Fee.create({ type: "management", amount: distribution.platformFee, assetName,
      txHash: "platform-" + Date.now(), status: "collected" });
  }

  return results;
}
