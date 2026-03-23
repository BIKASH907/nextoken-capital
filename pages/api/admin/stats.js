// pages/api/admin/stats.js — UPDATED with real data
import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import Investment from "../../../lib/models/Investment";
import Asset from "../../../lib/models/Asset";
import Transaction from "../../../lib/models/Transaction";
import Wallet from "../../../lib/models/Wallet";
import { requireAdmin } from "../../../lib/adminAuth";

async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  await connectDB();

  const [
    totalUsers, kycPending, kycApproved, kycRejected,
    totalInvestments, confirmedInvestments, volumeAgg,
    totalAssets, liveAssets, draftAssets,
    totalTransactions, totalWallets, whitelistedWallets,
    recentUsers, recentInvestments,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ kycStatus: "pending" }),
    User.countDocuments({ kycStatus: "approved" }),
    User.countDocuments({ kycStatus: "rejected" }),
    Investment.countDocuments(),
    Investment.countDocuments({ status: { $in: ["confirmed","minted","active"] } }),
    Investment.aggregate([{ $match: { status: { $in: ["confirmed","minted","active"] } } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
    Asset.countDocuments(),
    Asset.countDocuments({ status: "live" }),
    Asset.countDocuments({ status: "draft" }),
    Transaction.countDocuments(),
    Wallet.countDocuments(),
    Wallet.countDocuments({ isWhitelisted: true }),
    User.find().sort({ createdAt: -1 }).limit(5).select("-password"),
    Investment.find().sort({ createdAt: -1 }).limit(5).populate("userId", "firstName lastName email"),
  ]);

  return res.status(200).json({
    users: { total: totalUsers, kycPending, kycApproved, kycRejected },
    investments: { total: totalInvestments, confirmed: confirmedInvestments, volume: volumeAgg[0]?.total || 0 },
    assets: { total: totalAssets, live: liveAssets, draft: draftAssets },
    blockchain: { transactions: totalTransactions, wallets: totalWallets, whitelisted: whitelistedWallets },
    recentUsers,
    recentInvestments,
  });
}

export default requireAdmin(handler, "support");
