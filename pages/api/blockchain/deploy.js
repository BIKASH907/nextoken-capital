import { ethers } from "ethers";
import { getSigner, getFactory } from "../../../lib/blockchain";
import connectDB from "../../../lib/db";
import Asset from "../../../lib/models/Asset";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Admin auth check
  const jwt = require("jsonwebtoken");
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try { jwt.verify(token, process.env.JWT_SECRET || "nextoken-capital-jwt-secret-2024"); }
  catch { return res.status(401).json({ error: "Invalid token" }); }

  const { assetId, name, symbol, maxSupply, assetType, jurisdiction } = req.body;

  if (!assetId || !name || !symbol || !maxSupply) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await connectDB();
    const asset = await Asset.findById(assetId);
    if (!asset) return res.status(404).json({ error: "Asset not found" });

    const signer = getSigner();
    const factory = getFactory(signer);

    const tx = await factory.deployToken(
      name,
      symbol,
      ethers.parseEther(String(maxSupply)),
      assetId,
      assetType || asset.assetType || "other",
      jurisdiction || "EU",
      await signer.getAddress()
    );

    const receipt = await tx.wait();
    const event = receipt.logs.find(l => l.fragment?.name === "TokenDeployed");
    const tokenAddress = event?.args?.[0] || "pending";

    // Update asset in database
    asset.contractAddress = tokenAddress;
    asset.tokenStandard = "ERC-3643";
    asset.chainId = 137;
    asset.status = "approved";
    await asset.save();

    return res.status(200).json({
      success: true,
      tokenAddress,
      txHash: receipt.hash,
      network: "polygon",
      chainId: 137,
    });
  } catch (err) {
    console.error("Deploy error:", err);
    return res.status(500).json({ error: err.message || "Deployment failed" });
  }
}
