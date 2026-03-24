import { getUserFromRequest } from "../../../lib/auth";
import connectDB from "../../../lib/db";
import Asset from "../../../lib/models/Asset";
import Investment from "../../../lib/models/Investment";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const session = await getUserFromRequest(req);
    if (!session) return res.status(401).json({ error: "Not authenticated" });

    await connectDB();
    const assets = await Asset.find({ issuerId: session.id }).lean();
    const assetIds = assets.map(a => a._id);
    const investments = await Investment.find({ assetId: { $in: assetIds }, status: { $nin: ["failed", "refunded"] } }).lean();

    const totalRaised = investments.reduce((s, i) => s + i.amount, 0);
    const uniqueInvestors = [...new Set(investments.map(i => i.userId.toString()))].length;
    const totalTarget = assets.reduce((s, a) => s + (a.targetRaise || 0), 0);

    return res.status(200).json({
      success: true,
      stats: {
        totalRaised, uniqueInvestors,
        totalListings: assets.length,
        liveListings: assets.filter(a => ["live", "closing"].includes(a.status)).length,
        draftListings: assets.filter(a => a.status === "draft").length,
        reviewListings: assets.filter(a => a.status === "review").length,
        totalTarget,
        fundingPct: totalTarget > 0 ? Math.round((totalRaised / totalTarget) * 100) : 0,
      },
    });
  } catch (err) {
    console.error("Stats error:", err);
    return res.status(500).json({ error: "Failed to load stats" });
  }
}
