import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import Asset from "../../../lib/models/Asset";
import Investment from "../../../models/Investment";
import Distribution from "../../../models/Distribution";
import { calculateDistribution } from "../../../lib/profitEngine";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  await connectDB();
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).json({ error: "Not authenticated" });
  const user = await User.findOne({ email: session.user.email });
  if (!user) return res.status(404).json({ error: "User not found" });

  const { action, assetId, totalProfit, proofDocUrl } = req.body;

  if (action === "preview") {
    if (!assetId || !totalProfit) return res.status(400).json({ error: "Asset and profit required" });
    const calc = await calculateDistribution(assetId, Number(totalProfit));
    return res.json({ preview: calc });
  }

  if (action === "create") {
    if (!assetId || !totalProfit) return res.status(400).json({ error: "Asset and profit required" });
    const asset = await Asset.findById(assetId);
    if (!asset) return res.status(404).json({ error: "Asset not found" });

    const calc = await calculateDistribution(assetId, Number(totalProfit));
    const allInvestors = [...calc.payouts, ...calc.ineligibleInvestors.map(i => ({ ...i, amount: 0 }))];

    const dist = await Distribution.create({
      assetId, assetName: asset.name, issuerId: user._id,
      totalProfit: Number(totalProfit), proofDocUrl,
      distributions: allInvestors,
      platformFee: calc.platformFee,
      issuerReserve: calc.issuerReserve,
      eligibleTokens: calc.eligibleTokens,
      ineligibleTokens: calc.ineligibleTokens,
    });

    return res.json({ distribution: dist, summary: { eligible: calc.payouts.length, ineligible: calc.ineligibleInvestors.length, totalToEligible: calc.totalToEligible, platformFee: calc.platformFee, issuerReserve: calc.issuerReserve } });
  }
  return res.status(400).json({ error: "Action: preview or create" });
}
