require("dotenv").config({ path: ".env.local" });
const DEPLOYER_KEY = process.env.DEPLOYER_PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000001";
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  networks: {
    hardhat: {},
    polygon: {
      url: process.env.NEXT_PUBLIC_POLYGON_RPC || "https://polygon-mainnet.g.alchemy.com/v2/YUDOmcxLQXpJYpcKpceyu",
      accounts: [DEPLOYER_KEY],
      chainId: 137,
    },
    amoy: {
      url: "https://rpc-amoy.polygon.technology",
      accounts: [DEPLOYER_KEY],
      chainId: 80002,
    },
  },
};
