// pages/api/issuer/dashboard.js
// Serves all data for the issuer dashboard
import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import Asset from "../../../models/Asset";
import Investment from "../../../models/Investment";
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
    // Get all assets created by this issuer
    const assets = await Asset.find({ issuerId: user._id }).sort({ createdAt: -1 }).lean();

    // Get investments for each asset
    const assetIds = assets.map((a) => a._id);
    const investments = await Investment.find({ assetId: { $in: assetIds } })
      .populate("userId", "name email")
      .lean();

    // Build per-asset investor data
    const assetsWithInvestors = assets.map((a) => {
      const assetInvestments = investments.filter(
        (inv) => inv.assetId?.toString() === a._id.toString()
      );
      return {
        ...a,
        raised: assetInvestments.reduce((sum, inv) => sum + (inv.amount || inv.totalInvested || 0), 0),
        investorCount: new Set(assetInvestments.map((inv) => inv.userId?._id?.toString())).size,
        investors: assetInvestments.map((inv) => ({
          userId: inv.userId?._id,
          name: inv.userId?.name || "",
          email: inv.userId?.email || "",
          tokens: inv.tokens || inv.units || 0,
          amount: inv.amount || inv.totalInvested || 0,
        })),
      };
    });

    // Stats
    const totalRaised = assetsWithInvestors.reduce((s, a) => s + a.raised, 0);
    const totalInvestors = new Set(investments.map((i) => i.userId?._id?.toString())).size;
    const liveAssets = assets.filter((a) => a.status === "live" || a.approvalStatus === "live").length;

    // Distributions (if you have a Distribution model; otherwise return empty)
    let distributions = [];
    try {
      const Distribution = (await import("../../../models/Distribution")).default;
      distributions = await Distribution.find({ issuerId: user._id }).sort({ createdAt: -1 }).lean();
    } catch {
      // Distribution model may not exist yet
    }

    return res.json({
      assets: assetsWithInvestors,
      distributions,
      stats: {
        totalAssets: assets.length,
        liveAssets,
        totalRaised,
        totalInvestors,
        totalInvestments: investments.length,
        totalDistributed: distributions.reduce((s, d) => s + (d.profit || 0), 0),
      },
    });
  } catch (err) {
    console.error("Issuer dashboard error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
