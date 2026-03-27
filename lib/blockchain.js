import { ethers } from "ethers";

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

export function generateTxHash() {
  // Real format but for off-chain records
  return "0x" + [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");
}

export async function getDeployerAddress() {
  const wallet = getDeployerWallet();
  return wallet.address;
}

export async function getDeployerBalance() {
  const wallet = getDeployerWallet();
  const balance = await wallet.provider.getBalance(wallet.address);
  return ethers.formatEther(balance);
}
