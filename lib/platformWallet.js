import Wallet from "../models/Wallet";
import mongoose from "mongoose";

const PLATFORM_USER_ID = "69c136107f7005bafdeac09f";

export async function creditPlatformWallet(amount, description, txHash, assetName) {
  if (amount <= 0) return;
  const uid = new mongoose.Types.ObjectId(PLATFORM_USER_ID);
  let wallet = await Wallet.findOne({ userId: uid });
  if (!wallet) wallet = await Wallet.create({ userId: uid, currency: "EUR" });
  wallet.availableBalance += amount;
  wallet.totalEarnings += amount;
  wallet.transactions.push({
    type: "commission",
    amount,
    assetName: assetName || "",
    txHash: txHash || "fee-" + Date.now(),
    status: "completed",
    description,
  });
  await wallet.save();
  return wallet;
}
