const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Balance:", hre.ethers.formatEther(balance), "MATIC");

  // 1. Deploy Token Factory
  console.log("\n1. Deploying NXTTokenFactory...");
  const Factory = await hre.ethers.getContractFactory("NXTTokenFactory");
  const factory = await Factory.deploy();
  await factory.waitForDeployment();
  const factoryAddr = await factory.getAddress();
  console.log("   Factory:", factoryAddr);

  // 2. Deploy sample SOLAR-01 token
  console.log("\n2. Deploying sample SOLAR-01 token...");
  const tx = await factory.deployToken(
    "Solar Farm Portfolio",
    "SOLAR-01",
    hre.ethers.parseEther("500000"),
    "solar-01",
    "energy",
    "EU",
    deployer.address
  );
  await tx.wait();
  const solarAddr = await factory.assetIdToToken("solar-01");
  console.log("   SOLAR-01:", solarAddr);

  // 3. Deploy Yield Distributor
  console.log("\n3. Deploying NXTYieldDistributor...");
  const USDC = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
  const Yield = await hre.ethers.getContractFactory("NXTYieldDistributor");
  const yieldDist = await Yield.deploy(USDC);
  await yieldDist.waitForDeployment();
  const yieldAddr = await yieldDist.getAddress();
  console.log("   YieldDistributor:", yieldAddr);

  console.log("\n====================================");
  console.log("  DEPLOYMENT COMPLETE");
  console.log("====================================");
  console.log("  Factory:         ", factoryAddr);
  console.log("  SOLAR-01 Token:  ", solarAddr);
  console.log("  Yield Distributor:", yieldAddr);
  console.log("====================================");
  console.log("\nAdd to .env.local:");
  console.log("  NEXT_PUBLIC_FACTORY_ADDRESS=" + factoryAddr);
  console.log("  NEXT_PUBLIC_YIELD_DISTRIBUTOR=" + yieldAddr);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
