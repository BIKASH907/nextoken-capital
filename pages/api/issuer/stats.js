import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import Asset from "../../../lib/models/Asset";
import Investment from "../../../models/Investment";
import Distribution from "../../../models/Distribution";
import { getAuthUser } from "../../../lib/getUser";

export default async function handler(req, res) {
  await connectDB();
  const user = await getAuthUser(req, res);
  if (!user) return res.status(401).json({ error: "Please login" });
  if (user.accountType !== "issuer" && user.role !== "issuer") return res.status(403).json({ error: "Issuer access only" });

  const assets = await Asset.find({ issuerId: user._id }).lean();
  const assetIds = assets.map(a => a._id);
  const investments = await Investment.find({ assetId: { $in: assetIds } }).lean();
  const distributions = await Distribution.find({ issuerId: user._id }).lean();

  const totalRaised = investments.reduce((s, i) => s + i.totalInvested, 0);
  const totalInvestors = [...new Set(investments.map(i => i.userId.toString()))].length;
  const totalDistributed = distributions.filter(d => d.status === "distributed").reduce((s, d) => s + d.totalProfit, 0);

  return res.json({
    assets, investments, distributions,
    stats: {
      totalAssets: assets.length,
      liveAssets: assets.filter(a => a.status === "live").length,
      totalRaised, totalInvestors, totalDistributed,
      pendingDistributions: distributions.filter(d => d.status !== "distributed" && d.status !== "rejected").length,
    }
  });
}
