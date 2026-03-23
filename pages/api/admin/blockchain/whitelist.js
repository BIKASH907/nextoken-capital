// pages/api/admin/blockchain/whitelist.js — whitelist/unwhitelist wallets
import { connectDB } from "../../../../lib/mongodb";
import Wallet from "../../../../lib/models/Wallet";
import Transaction from "../../../../lib/models/Transaction";
import { requireAdmin } from "../../../../lib/adminAuth";

async function handler(req, res) {
  await connectDB();

  // GET — list all wallets with whitelist status
  if (req.method === "GET") {
    const { whitelisted, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (whitelisted === "true") filter.isWhitelisted = true;
    if (whitelisted === "false") filter.isWhitelisted = false;
    const wallets = await Wallet.find(filter)
      .populate("userId", "firstName lastName email kycStatus")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Wallet.countDocuments(filter);
    return res.status(200).json({ wallets, total });
  }

  // POST — whitelist a wallet
  if (req.method === "POST") {
    const { walletId, txHash } = req.body;
    if (!walletId) return res.status(400).json({ error: "walletId required" });

    const wallet = await Wallet.findById(walletId).populate("userId", "kycStatus email");
    if (!wallet) return res.status(404).json({ error: "Wallet not found" });

    // Check KYC approved before whitelisting
    if (wallet.userId.kycStatus !== "approved") {
      return res.status(400).json({ error: "User KYC must be approved before whitelisting wallet" });
    }

    await Wallet.findByIdAndUpdate(walletId, {
      isWhitelisted: true,
      whitelistedAt: new Date(),
      whitelistedBy: req.admin.id,
      whitelistTxHash: txHash || null,
    });

    // Log transaction
    await Transaction.create({
      userId: wallet.userId._id,
      walletAddress: wallet.address,
      txHash: txHash || null,
      txType: "whitelist",
      status: txHash ? "confirmed" : "pending",
      chainId: wallet.chainId,
      metadata: { whitelistedBy: req.admin.email },
    });

    return res.status(200).json({ success: true, message: "Wallet whitelisted" });
  }

  // DELETE — remove from whitelist
  if (req.method === "DELETE") {
    const { walletId } = req.body;
    if (!walletId) return res.status(400).json({ error: "walletId required" });

    await Wallet.findByIdAndUpdate(walletId, {
      isWhitelisted: false,
      whitelistedAt: null,
      whitelistedBy: null,
      whitelistTxHash: null,
    });

    return res.status(200).json({ success: true, message: "Wallet removed from whitelist" });
  }

  return res.status(405).end();
}

export default requireAdmin(handler, "compliance");
