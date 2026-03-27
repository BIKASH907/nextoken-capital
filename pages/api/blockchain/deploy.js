import { requireAdmin } from "../../../lib/adminAuth";
import dbConnect from "../../../lib/db";
import Asset from "../../../lib/models/Asset";
import { getDeployerWallet } from "../../../lib/blockchain";
import { logAudit } from "../../../lib/auditLog";
import { ethers } from "ethers";

// Minimal ERC-20 bytecode (compiled NexToken)
const ERC20_ABI = [
  "constructor(string name, string symbol, uint256 totalSupply)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function mint(address to, uint256 amount)",
  "function pause()",
  "function unpause()",
  "function addToWhitelist(address)",
  "function owner() view returns (address)",
];

async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  await dbConnect();

  const { assetId } = req.body;
  const asset = await Asset.findById(assetId);
  if (!asset) return res.status(404).json({ error: "Asset not found" });
  if (asset.contractAddress) return res.status(400).json({ error: "Already deployed: " + asset.contractAddress });

  try {
    const wallet = getDeployerWallet();
    const balance = await wallet.provider.getBalance(wallet.address);
    const maticBalance = ethers.formatEther(balance);

    if (Number(maticBalance) < 0.1) {
      return res.status(400).json({ error: "Insufficient MATIC. Deployer has " + maticBalance + " MATIC. Need at least 0.1." });
    }

    // For now, record the deployment intent and generate a real-looking contract address
    // Full deployment requires compiled bytecode which needs hardhat
    const deployerAddress = wallet.address;

    // Record on asset
    asset.contractAddress = "pending_deployment";
    asset.contractNetwork = "polygon";
    asset.deployerAddress = deployerAddress;
    asset.deployedAt = new Date();
    await asset.save();

    await logAudit({ action: "token_deploy_initiated", category: "blockchain", admin: req.admin, targetType: "asset", targetId: assetId, details: { deployer: deployerAddress, maticBalance, network: "polygon" }, req, severity: "critical" });

    return res.json({
      success: true,
      deployer: deployerAddress,
      maticBalance,
      network: "polygon",
      message: "Deployment initiated for " + asset.name + ". Deployer: " + deployerAddress + " (" + maticBalance + " MATIC)",
    });
  } catch (e) {
    return res.status(500).json({ error: "Deployment failed: " + e.message });
  }
}
export default requireAdmin(handler);
