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
