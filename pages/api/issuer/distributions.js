import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import Asset from "../../../lib/models/Asset";
import Investment from "../../../models/Investment";
import Distribution from "../../../models/Distribution";
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
  if (action === "create") {
    if (!assetId || !totalProfit) return res.status(400).json({ error: "Asset and profit required" });
    const asset = await Asset.findById(assetId);
    if (!asset) return res.status(404).json({ error: "Asset not found" });
    const investments = await Investment.find({ assetId, status: "active" });
    const totalTokens = investments.reduce((s, i) => s + i.units, 0);
    const distributions = investments.map(inv => ({
      investorId: inv.userId, unitsOwned: inv.units,
      sharePercent: totalTokens > 0 ? (inv.units / totalTokens) * 100 : 0,
      amount: totalTokens > 0 ? (inv.units / totalTokens) * Number(totalProfit) : 0,
    }));
    const dist = await Distribution.create({ assetId, assetName: asset.name, issuerId: user._id, totalProfit: Number(totalProfit), proofDocUrl, distributions });
    return res.json({ distribution: dist });
  }
  return res.status(400).json({ error: "Unknown action" });
}
