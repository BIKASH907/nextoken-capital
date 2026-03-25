// Polygon Network Configuration
export const POLYGON_CHAIN = {
  id: 137,
  name: "Polygon",
  network: "polygon",
  nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://polygon-rpc.com"] },
    public: { http: ["https://polygon-rpc.com"] },
  },
  blockExplorers: {
    default: { name: "PolygonScan", url: "https://polygonscan.com" },
  },
};

export const AMOY_CHAIN = {
  id: 80002,
  name: "Polygon Amoy",
  network: "amoy",
  nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc-amoy.polygon.technology"] },
  },
  blockExplorers: {
    default: { name: "OKLink", url: "https://www.oklink.com/amoy" },
  },
  testnet: true,
};

// Contract addresses (set after deployment)
export const CONTRACTS = {
  factory: process.env.NEXT_PUBLIC_FACTORY_ADDRESS || "",
  yieldDistributor: process.env.NEXT_PUBLIC_YIELD_DISTRIBUTOR || "",
};

// USDC on Polygon
export const USDC_POLYGON = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";

// Explorer link helper
export function getExplorerUrl(hash, type = "tx") {
  return `https://polygonscan.com/${type}/${hash}`;
}

export function getExplorerTokenUrl(address) {
  return `https://polygonscan.com/token/${address}`;
}
