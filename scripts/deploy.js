const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);
  console.log("Balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "MATIC");

  // 1. Deploy Token Factory
  console.log("\n1. Deploying NXTTokenFactory...");
  const Factory = await hre.ethers.getContractFactory("NXTTokenFactory");
  const factory = await Factory.deploy();
  await factory.waitForDeployment();
  const factoryAddr = await factory.getAddress();
  console.log("   Factory:", factoryAddr);

  // 2. Deploy a sample security token via factory
  console.log("\n2. Deploying sample SOLAR-01 token...");
  const tx = await factory.deployToken(
    "Solar Farm Portfolio",    // name
    "SOLAR-01",               // symbol
    hre.ethers.parseEther("500000"), // max supply
    "solar-01",               // asset ID
    "energy",                 // asset type
    "EU",                     // jurisdiction
    deployer.address          // admin
  );
  await tx.wait();

  const solarAddr = await factory.assetIdToToken("solar-01");
  console.log("   SOLAR-01:", solarAddr);

  // 3. Deploy Yield Distributor (using zero address as placeholder for payment token)
  // In production, use USDC on Polygon: 0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359
  console.log("\n3. Deploying NXTYieldDistributor...");
  const USDC_POLYGON = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
  const Yield = await hre.ethers.getContractFactory("NXTYieldDistributor");
  const yieldDist = await Yield.deploy(USDC_POLYGON);
  await yieldDist.waitForDeployment();
  const yieldAddr = await yieldDist.getAddress();
  console.log("   YieldDistributor:", yieldAddr);

  // Summary
  console.log("\n════════════════════════════════════════════");
  console.log("  DEPLOYMENT COMPLETE");
  console.log("════════════════════════════════════════════");
  console.log("  Factory:          ", factoryAddr);
  console.log("  SOLAR-01 Token:   ", solarAddr);
  console.log("  Yield Distributor:", yieldAddr);
  console.log("  Network:          ", hre.network.name);
  console.log("  Deployer:         ", deployer.address);
  console.log("════════════════════════════════════════════");
  console.log("\nAdd to .env.local:");
  console.log(`  NEXT_PUBLIC_FACTORY_ADDRESS=${factoryAddr}`);
  console.log(`  NEXT_PUBLIC_YIELD_DISTRIBUTOR=${yieldAddr}`);
  console.log(`  NEXT_PUBLIC_CHAIN_ID=137`);
}

main().catch(console.error);
