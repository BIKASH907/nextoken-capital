// pages/api/issuer/dashboard.js
import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  await connectDB();
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).json({ error: "Not authenticated" });

  const user = await User.findOne({ email: session.user.email });
  if (!user) return res.status(404).json({ error: "User not found" });

  try {
    const mongoose = require("mongoose");
    const Asset = mongoose.models.Asset || mongoose.model("Asset", new mongoose.Schema({}, { strict: false, collection: "assets" }));
    const Investment = mongoose.models.Investment || mongoose.model("Investment", new mongoose.Schema({}, { strict: false, collection: "investments" }));

    const assets = await Asset.find({ issuerId: user._id }).sort({ createdAt: -1 }).lean();
    const assetIds = assets.map(a => a._id);
    const investments = await Investment.find({ assetId: { $in: assetIds } }).lean();

    // Try to get user info for investors
    const investorIds = [...new Set(investments.map(i => i.userId?.toString()).filter(Boolean))];
    let investorMap = {};
    if (investorIds.length > 0) {
      const investors = await User.find({ _id: { $in: investorIds } }).select("name email").lean();
      investors.forEach(u => { investorMap[u._id.toString()] = { name: u.name, email: u.email }; });
    }

    const assetsWithData = assets.map(a => {
      const inv = investments.filter(i => i.assetId?.toString() === a._id.toString());
      const uniqueInvestors = [...new Set(inv.map(i => i.userId?.toString()).filter(Boolean))];
      return {
        ...a,
        raised: inv.reduce((s, i) => s + (i.amount || i.totalInvested || 0), 0),
        investorCount: uniqueInvestors.length,
        investors: inv.map(i => ({
          userId: i.userId,
          name: investorMap[i.userId?.toString()]?.name || "",
          email: investorMap[i.userId?.toString()]?.email || "",
          tokens: i.tokens || i.units || 0,
          amount: i.amount || i.totalInvested || 0,
        })),
      };
    });

    const totalRaised = assetsWithData.reduce((s, a) => s + a.raised, 0);
    const allInvestorIds = [...new Set(investments.map(i => i.userId?.toString()).filter(Boolean))];

    return res.json({
      assets: assetsWithData,
      distributions: [],
      stats: {
        totalAssets: assets.length,
        liveAssets: assets.filter(a => a.status === "live" || a.approvalStatus === "live").length,
        totalRaised,
        totalInvestors: allInvestorIds.length,
        totalInvestments: investments.length,
        totalDistributed: 0,
      },
    });
  } catch (err) {
    console.error("Issuer dashboard error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
