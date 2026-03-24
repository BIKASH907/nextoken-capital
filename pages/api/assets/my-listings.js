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
    const assets = await Asset.find({ issuerId: session.id }).sort({ createdAt: -1 }).lean();

    const enriched = await Promise.all(assets.map(async (a) => {
      const investments = await Investment.find({ assetId: a._id, status: { $nin: ["failed", "refunded"] } }).lean();
      const totalRaised = investments.reduce((s, i) => s + i.amount, 0);
      return {
        ...a, _id: a._id.toString(),
        investorCount: investments.length,
        raisedAmount: totalRaised,
        fundingPct: a.targetRaise > 0 ? Math.round((totalRaised / a.targetRaise) * 100) : 0,
      };
    }));

    return res.status(200).json({ success: true, assets: enriched });
  } catch (err) {
    console.error("My listings error:", err);
    return res.status(500).json({ error: "Failed to load listings" });
  }
}
