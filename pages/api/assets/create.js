// POST /api/assets/create — Create new asset listing (for issuers/owners)
import dbConnect from "../../../lib/db";
import Asset from "../../../lib/models/Asset";
import User from "../../../lib/models/User";
import { getUserFromRequest } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const session = await getUserFromRequest(req);
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  await dbConnect();
  const user = await User.findById(session.userId || session.id);
  if (!user) return res.status(401).json({ error: "User not found" });

  // Update user to issuer if not already
  if (user.accountType !== "issuer") {
    user.accountType = "issuer";
    await user.save();
  }

  try {
    const {
      name, ticker, description, assetType, category,
      location, country, targetRaise, minInvestment, maxInvestment,
      targetROI, term, yieldFrequency, tokenSupply, tokenPrice,
      riskLevel, imageUrl, documents, eligibility, launchDate, closingDate,
    } = req.body;

    if (!name || !ticker || !assetType || !targetRaise) {
      return res.status(400).json({ error: "Name, ticker, asset type, and target raise are required." });
    }

    const existing = await Asset.findOne({ ticker: ticker.toUpperCase() });
    if (existing) return res.status(400).json({ error: "Ticker already exists. Choose a different one." });

    const asset = await Asset.create({
      name, ticker: ticker.toUpperCase(), description, assetType, category,
      location, country,
      targetRaise: parseFloat(targetRaise),
      minInvestment: parseFloat(minInvestment) || 100,
      maxInvestment: maxInvestment ? parseFloat(maxInvestment) : undefined,
      targetROI: targetROI ? parseFloat(targetROI) : undefined,
      term: term ? parseInt(term) : undefined,
      yieldFrequency,
      tokenSupply: tokenSupply ? parseInt(tokenSupply) : undefined,
      tokenPrice: tokenPrice ? parseFloat(tokenPrice) : undefined,
      riskLevel: riskLevel || "medium",
      imageUrl,
      documents: documents || [],
      eligibility: eligibility || "eu_verified",
      launchDate: launchDate ? new Date(launchDate) : undefined,
      closingDate: closingDate ? new Date(closingDate) : undefined,
      issuerId: user._id,
      issuerName: `${user.firstName} ${user.lastName}`,
      createdBy: user._id,
      status: "review",
    });

    return res.status(201).json({
      success: true,
      message: "Asset submitted for review. Our compliance team will review it within 2-3 business days.",
      asset: { id: asset._id, name: asset.name, ticker: asset.ticker, status: asset.status },
    });
  } catch (err) {
    console.error("Asset create error:", err);
    return res.status(500).json({ error: "Failed to create asset." });
  }
}
