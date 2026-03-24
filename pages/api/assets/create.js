// pages/api/assets/create.js
import connectDB from "../../../lib/db";
import Asset from "../../../lib/models/Asset";
import User from "../../../lib/models/User";
import { getUserFromRequest } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  await connectDB();
  const session = await getUserFromRequest(req);
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  const user = await User.findById(session.sub || session.id);
  if (!user) return res.status(401).json({ error: "User not found" });

  // Update user to issuer if not already
  if (user.accountType !== "issuer") {
    user.accountType = "issuer";
    await user.save();
  }

  const {
    name, ticker, description, assetType, category,
    location, country,
    targetRaise, minInvestment, maxInvestment, targetROI, term, yieldFrequency,
    tokenSupply, tokenPrice, tokenStandard,
    riskLevel, imageUrl, documents, eligibility,
  } = req.body;

  if (!name || !ticker || !assetType || !targetRaise) {
    return res.status(400).json({ error: "Name, ticker, asset type, and target raise are required." });
  }

  try {
    const asset = await Asset.create({
      name,
      ticker: ticker.toUpperCase(),
      description,
      assetType,
      category,
      location,
      country,
      targetRaise,
      minInvestment: minInvestment || 100,
      maxInvestment,
      targetROI,
      term,
      yieldFrequency,
      tokenSupply,
      tokenPrice,
      tokenStandard: tokenStandard || "ERC-3643",
      riskLevel: riskLevel || "medium",
      imageUrl,
      documents: documents || [],
      eligibility: eligibility || "eu_verified",
      issuerId: user._id,
      issuerName: `${user.firstName} ${user.lastName}`,
      createdBy: user._id,
      status: "review", // goes to compliance review
    });

    res.status(201).json({
      success: true,
      message: "Asset submitted for review. Our compliance team will review within 2-5 business days.",
      asset: { id: asset._id, name: asset.name, ticker: asset.ticker, status: asset.status },
    });
  } catch (e) {
    if (e.code === 11000) return res.status(400).json({ error: "Ticker already exists." });
    res.status(500).json({ error: "Failed to create asset: " + e.message });
  }
}
