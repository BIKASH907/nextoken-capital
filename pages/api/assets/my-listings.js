// pages/api/assets/my-listings.js
import connectDB from "../../../lib/db";
import Asset from "../../../lib/models/Asset";
import Investment from "../../../lib/models/Investment";
import { getUserFromRequest } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  await connectDB();
  const session = await getUserFromRequest(req);
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  try {
    const assets = await Asset.find({ issuerId: session.sub || session.id })
      .sort({ createdAt: -1 })
      .lean();

    // Get investment stats per asset
    const assetIds = assets.map(a => a._id);
    const investments = await Investment.aggregate([
      { $match: { assetId: { $in: assetIds.map(id => id.toString()) } } },
      { $group: {
        _id: "$assetId",
        totalInvested: { $sum: "$amount" },
        investorCount: { $sum: 1 },
      }},
    ]);

    const investMap = {};
    investments.forEach(i => { investMap[i._id] = i; });

    const enriched = assets.map(a => ({
      ...a,
      totalInvested: investMap[a._id.toString()]?.totalInvested || a.raisedAmount || 0,
      investorCount: investMap[a._id.toString()]?.investorCount || a.investorCount || 0,
      fundingPct: Math.round(((investMap[a._id.toString()]?.totalInvested || a.raisedAmount || 0) / a.targetRaise) * 100),
    }));

    // Summary stats
    const totalAssets     = assets.length;
    const totalRaised     = enriched.reduce((s, a) => s + a.totalInvested, 0);
    const totalInvestors  = enriched.reduce((s, a) => s + a.investorCount, 0);
    const liveAssets      = assets.filter(a => ["live","closing"].includes(a.status)).length;
    const totalViews      = 0; // placeholder for analytics

    res.status(200).json({
      success: true,
      assets: enriched,
      stats: { totalAssets, totalRaised, totalInvestors, liveAssets, totalViews },
    });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch listings: " + e.message });
  }
}
