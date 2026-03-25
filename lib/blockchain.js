import { ethers } from "ethers";

// ABIs (simplified for key functions)
export const FACTORY_ABI = [
  "function deployToken(string,string,uint256,string,string,string,address) returns (address)",
  "function getDeployedTokens() view returns (address[])",
  "function getTokenCount() view returns (uint256)",
  "function assetIdToToken(string) view returns (address)",
  "function tokenInfo(address) view returns (address,string,string,string,string,uint256,uint256)",
  "event TokenDeployed(address indexed,string,string,string,uint256,address)",
];

export const TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function maxSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function assetId() view returns (string)",
  "function assetType() view returns (string)",
  "function paused() view returns (bool)",
  "function whitelisted(address) view returns (bool)",
  "function frozen(address) view returns (bool)",
  "function getHolders() view returns (address[])",
  "function getHolderCount() view returns (uint256)",
  "function isCompliant(address,address) view returns (bool)",
  "function mint(address,uint256)",
  "function batchMint(address[],uint256[])",
  "function setWhitelisted(address,bool)",
  "function batchWhitelist(address[],bool)",
  "function setFrozen(address,bool)",
  "function pause()",
  "function unpause()",
  "function burn(uint256)",
  "function forcedTransfer(address,address,uint256,string)",
  "function transfer(address,uint256) returns (bool)",
  "event Transfer(address indexed,address indexed,uint256)",
  "event Whitelisted(address indexed,bool)",
  "event Frozen(address indexed,bool)",
  "event ComplianceCheck(address indexed,address indexed,bool,string)",
];

export const YIELD_ABI = [
  "function distribute(address,uint256,address[],uint256[])",
  "function getDistributionCount() view returns (uint256)",
  "function distributions(uint256) view returns (address,uint256,uint256,uint256,bool)",
];

// Get provider
export function getProvider() {
  const rpc = process.env.NEXT_PUBLIC_POLYGON_RPC || "https://polygon-rpc.com";
  return new ethers.JsonRpcProvider(rpc);
}

// Get signer (server-side only)
export function getSigner() {
  const provider = getProvider();
  const key = process.env.DEPLOYER_PRIVATE_KEY;
  if (!key) throw new Error("DEPLOYER_PRIVATE_KEY not set");
  return new ethers.Wallet(key, provider);
}

// Get factory contract
export function getFactory(signerOrProvider) {
  const addr = process.env.NEXT_PUBLIC_FACTORY_ADDRESS;
  if (!addr) throw new Error("NEXT_PUBLIC_FACTORY_ADDRESS not set");
  return new ethers.Contract(addr, FACTORY_ABI, signerOrProvider);
}

// Get token contract
export function getToken(address, signerOrProvider) {
  return new ethers.Contract(address, TOKEN_ABI, signerOrProvider);
}

// Get yield distributor
export function getYieldDistributor(signerOrProvider) {
  const addr = process.env.NEXT_PUBLIC_YIELD_DISTRIBUTOR;
  if (!addr) throw new Error("NEXT_PUBLIC_YIELD_DISTRIBUTOR not set");
  return new ethers.Contract(addr, YIELD_ABI, signerOrProvider);
}
