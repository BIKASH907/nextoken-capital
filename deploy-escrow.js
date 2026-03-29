// scripts/deploy-escrow.js
// Deploy NextokenEscrowSplitter to Polygon Mainnet
//
// REQUIREMENTS:
//   - hardhat.config.cjs configured for Polygon
//   - .env.local has DEPLOYER_PRIVATE_KEY and NEXT_PUBLIC_POLYGON_RPC
//   - ~5 POL in deployer wallet for gas
//
// RUN:
//   npx hardhat run scripts/deploy-escrow.js --network polygon --config hardhat.config.cjs

const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Balance:", hre.ethers.formatEther(balance), "POL");

  if (balance < hre.ethers.parseEther("0.5")) {
    throw new Error("Not enough POL for gas. Need at least 0.5 POL.");
  }

  // ─── CONFIG ───────────────────────────────────────────────────
  // Nextoken Capital treasury wallet (receives commission)
  const TREASURY_WALLET =
    process.env.TREASURY_WALLET ||
    "0x1bB5EcCEf264E17b581e388317D7a38255821048";

  const DEFAULT_COMMISSION_BPS = 25; // 0.25%

  // ─── DEPLOY ───────────────────────────────────────────────────
  console.log("\nDeploying NextokenEscrowSplitter...");
  console.log("Treasury:", TREASURY_WALLET);
  console.log("Default Commission:", DEFAULT_COMMISSION_BPS, "bps (0.25%)");

  const Escrow = await hre.ethers.getContractFactory("NextokenEscrowSplitter");
  const escrow = await Escrow.deploy(TREASURY_WALLET, DEFAULT_COMMISSION_BPS);
  await escrow.waitForDeployment();

  const address = await escrow.getAddress();
  console.log("\n✅ NextokenEscrowSplitter deployed to:", address);

  // ─── VERIFY ON POLYGONSCAN (optional) ─────────────────────────
  if (process.env.POLYGONSCAN_API_KEY) {
    console.log("\nVerifying on PolygonScan...");
    try {
      await hre.run("verify:verify", {
        address: address,
        constructorArguments: [TREASURY_WALLET, DEFAULT_COMMISSION_BPS],
      });
      console.log("✅ Verified on PolygonScan");
    } catch (e) {
      console.log("Verification skipped:", e.message);
    }
  }

  // ─── SUMMARY ──────────────────────────────────────────────────
  console.log("\n════════════════════════════════════════════════════");
  console.log("  DEPLOYMENT COMPLETE");
  console.log("════════════════════════════════════════════════════");
  console.log("  Contract:    ", address);
  console.log("  Treasury:    ", TREASURY_WALLET);
  console.log("  Commission:   0.25% (25 bps)");
  console.log("  Network:      Polygon Mainnet (137)");
  console.log("");
  console.log("  NEXT STEPS:");
  console.log("  1. Add to .env.local:");
  console.log("     ESCROW_CONTRACT_ADDRESS=" + address);
  console.log("     NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=" + address);
  console.log("");
  console.log("  2. Add to Vercel:");
  console.log("     vercel env add ESCROW_CONTRACT_ADDRESS");
  console.log("     vercel env add NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS");
  console.log("");
  console.log("  3. Register assets:");
  console.log("     Use admin panel or call registerAsset() directly");
  console.log("════════════════════════════════════════════════════");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
