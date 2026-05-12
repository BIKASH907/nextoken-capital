import { ethers } from "ethers";
import crypto from "crypto";

const RPC_URL = process.env.NEXT_PUBLIC_POLYGON_RPC || "https://polygon-rpc.com";
const DEPLOYER_KEY = process.env.DEPLOYER_PRIVATE_KEY;

export function getProvider() {
  return new ethers.JsonRpcProvider(RPC_URL);
}

export function getDeployerWallet() {
  if (!DEPLOYER_KEY) throw new Error("DEPLOYER_PRIVATE_KEY not set");
  const provider = getProvider();
  return new ethers.Wallet(DEPLOYER_KEY, provider);
}

export async function getBalance(address) {
  const provider = getProvider();
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
}

export async function sendTransaction(to, valueInMatic) {
  const wallet = getDeployerWallet();
  const tx = await wallet.sendTransaction({
    to,
    value: ethers.parseEther(String(valueInMatic)),
  });
  await tx.wait();
  return tx.hash;
}

/**
 * Generates a 32-byte hex identifier (same shape as a tx hash) for OFF-CHAIN records only.
 * Do NOT use this as a proof of an on-chain transaction — for that, call sendTransaction()
 * and use the returned real tx.hash.
 */
export function generateOffchainRef() {
  return "0x" + crypto.randomBytes(32).toString("hex");
}

// Backwards-compatible alias, clearly marked as non-authoritative.
export const generateTxHash = generateOffchainRef;

export async function getDeployerAddress() {
  const wallet = getDeployerWallet();
  return wallet.address;
}

export async function getDeployerBalance() {
  const wallet = getDeployerWallet();
  const balance = await wallet.provider.getBalance(wallet.address);
  return ethers.formatEther(balance);
}

// ---------------------------------------------------------------------------
// Contract helpers used by the /api/blockchain/* and /api/issuer/* routes.
// These wire up ethers.Contract instances against the deployed ABIs.
// If the artifacts aren't present at request time we throw a clear error so
// callers fail loudly instead of with TypeError on undefined.
// ---------------------------------------------------------------------------

function _loadAbi(name) {
  try {
    // eslint-disable-next-line global-require
    return require(`../artifacts/contracts/${name}.sol/${name}.json`).abi;
  } catch (e) {
    throw new Error(`ABI for ${name} not found. Run \`npm run compile\` to generate artifacts.`);
  }
}

/** Returns a signer (the deployer wallet). Used by routes that mutate state. */
export function getSigner() {
  return getDeployerWallet();
}

/**
 * Returns an ethers.Contract instance for an NXTSecurityToken at `address`,
 * bound to the provided signerOrProvider. Used by mint / pause / whitelist /
 * token-info endpoints.
 */
export function getToken(address, signerOrProvider) {
  if (!address) throw new Error("getToken: address required");
  const abi = _loadAbi("NXTSecurityToken");
  return new (require("ethers").Contract)(address, abi, signerOrProvider || getProvider());
}

/**
 * Returns an ethers.Contract instance for the NXTTokenFactory.
 * Address comes from env var NEXT_PUBLIC_TOKEN_FACTORY_ADDRESS.
 */
export function getFactory(signerOrProvider) {
  const addr = process.env.NEXT_PUBLIC_TOKEN_FACTORY_ADDRESS;
  if (!addr) throw new Error("NEXT_PUBLIC_TOKEN_FACTORY_ADDRESS not set");
  const abi = _loadAbi("NXTTokenFactory");
  return new (require("ethers").Contract)(addr, abi, signerOrProvider || getProvider());
}
