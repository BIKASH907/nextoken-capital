// pages/api/issuer/dashboard.js
import connectDB from "../../../lib/db";
import User from "../../../lib/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  await connectDB();
  const session = await getServerSession(req, res, authOptions);

  console.log("ISSUER DEBUG session:", JSON.stringify(session));

  if (!session) return res.status(401).json({ error: "No session found" });

  const userId = session.id || session.sub || session.user?.id;
  console.log("ISSUER DEBUG userId:", userId, "email:", session.user?.email);

  let user = userId ? await User.findById(userId).catch(() => null) : null;
  console.log("ISSUER DEBUG findById result:", user ? "found" : "null");

  if (!user && session.user?.email) {
    user = await User.findOne({ email: session.user.email.toLowerCase() });
    console.log("ISSUER DEBUG findByEmail result:", user ? "found" : "null");
  }
  if (!user) return res.status(401).json({ error: "User not found", debug: { userId, email: session.user?.email } });

  try {
    const mongoose = require("mongoose");
    const Asset = mongoose.models.Asset || mongoose.model("Asset", new mongoose.Schema({}, { strict: false, collection: "assets" }));
    const Investment = mongoose.models.Investment || mongoose.model("Investment", new mongoose.Schema({}, { strict: false, collection: "investments" }));

    const assets = await Asset.find({ issuerId: user._id }).sort({ createdAt: -1 }).lean();
    const assetIds = assets.map(a => a._id);
    const investments = assetIds.length > 0
      ? await Investment.find({ assetId: { $in: assetIds } }).lean()
      : [];

    const assetsWithData = assets.map(a => {
      const inv = investments.filter(i => i.assetId?.toString() === a._id.toString());
      return {
        ...a,
        totalRaised: inv.reduce((s, i) => s + (i.amount || i.totalInvested || 0), 0),
        totalInvestors: [...new Set(inv.map(i => i.userId?.toString()).filter(Boolean))].length,
        tokensSold: inv.reduce((s, i) => s + (i.tokens || i.units || 0), 0),
      };
    });

    return res.json({
      issuer: {
        _id: user._id,
        companyName: user.companyName || user.name || "Your Company",
        walletAddress: user.walletAddress || user.monerium?.ibanAddress || null,
        bankIBAN: user.bankIBAN || null,
        moneriumIBAN: user.monerium?.iban || null,
        moneriumProfileId: user.monerium?.profileId || null,
        eureBalance: 0,
        onboardingStatus: user.kycStatus === "approved" ? "complete" : "Pending",
      },
      assets: assetsWithData,
      redemptions: [],
    });
  } catch (err) {
    console.error("Issuer dashboard error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
