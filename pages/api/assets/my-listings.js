// GET /api/assets/my-listings — Get all assets owned by current user
import dbConnect from "../../../lib/db";
import Asset from "../../../lib/models/Asset";
import { getUserFromRequest } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const session = await getUserFromRequest(req);
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  await dbConnect();

  try {
    const assets = await Asset.find({ issuerId: session.userId || session.id })
      .sort({ createdAt: -1 })
      .lean();

    const listings = assets.map(a => ({
      id:            a._id,
      name:          a.name,
      ticker:        a.ticker,
      assetType:     a.assetType,
      status:        a.status,
      targetRaise:   a.targetRaise,
      raisedAmount:  a.raisedAmount,
      investorCount: a.investorCount,
      targetROI:     a.targetROI,
      minInvestment: a.minInvestment,
      tokenPrice:    a.tokenPrice,
      location:      a.location,
      riskLevel:     a.riskLevel,
      imageUrl:      a.imageUrl,
      documents:     a.documents,
      createdAt:     a.createdAt,
      launchDate:    a.launchDate,
      closingDate:   a.closingDate,
    }));

    const totalRaised    = assets.reduce((s, a) => s + (a.raisedAmount || 0), 0);
    const totalInvestors = assets.reduce((s, a) => s + (a.investorCount || 0), 0);
    const liveCount      = assets.filter(a => a.status === "live" || a.status === "closing").length;

    return res.status(200).json({
      success: true,
      listings,
      stats: {
        totalListings:  assets.length,
        liveListings:   liveCount,
        totalRaised,
        totalInvestors,
      },
    });
  } catch (err) {
    console.error("My listings error:", err);
    return res.status(500).json({ error: "Failed to load listings." });
  }
}
