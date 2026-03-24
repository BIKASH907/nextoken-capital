import { getUserFromRequest } from "../../../lib/auth";
import connectDB from "../../../lib/db";
import User from "../../../lib/models/User";
import Asset from "../../../lib/models/Asset";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const session = await getUserFromRequest(req);
    if (!session) return res.status(401).json({ error: "Not authenticated" });

    await connectDB();
    const user = await User.findById(session.id);
    if (!user) return res.status(401).json({ error: "User not found" });

    if (user.accountType !== "issuer") {
      user.accountType = "issuer";
      await user.save();
    }

    const { name, ticker, description, assetType, category, location, country, targetRaise, minInvestment, maxInvestment, targetROI, term, yieldFrequency, tokenSupply, tokenPrice, tokenStandard, riskLevel, eligibility, imageUrl, documents } = req.body;

    if (!name || !ticker || !assetType || !targetRaise) {
      return res.status(400).json({ error: "Name, ticker, asset type, and target raise are required" });
    }

    const existing = await Asset.findOne({ ticker: ticker.toUpperCase() });
    if (existing) return res.status(400).json({ error: `Ticker ${ticker.toUpperCase()} is already taken` });

    const asset = await Asset.create({
      name, ticker: ticker.toUpperCase(), description, assetType, category, location, country,
      targetRaise, minInvestment: minInvestment || 100, maxInvestment, targetROI, term, yieldFrequency,
      tokenSupply, tokenPrice, tokenStandard: tokenStandard || "ERC-3643",
      riskLevel: riskLevel || "medium", eligibility: eligibility || "eu_verified",
      imageUrl, documents: documents || [],
      issuerId: user._id, issuerName: `${user.firstName} ${user.lastName}`, createdBy: user._id, status: "draft",
    });

    return res.status(201).json({ success: true, asset: { id: asset._id, ticker: asset.ticker, status: asset.status } });
  } catch (err) {
    console.error("Create asset error:", err);
    return res.status(500).json({ error: "Failed to create listing" });
  }
}
