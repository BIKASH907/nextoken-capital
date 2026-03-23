// lib/web3.js — MetaMask + ERC-3643 blockchain integration

// ── SUPPORTED CHAINS ─────────────────────────────────────────
export const CHAINS = {
  1:     { name: "Ethereum",        rpc: "https://eth-mainnet.g.alchemy.com/v2/", explorer: "https://etherscan.io" },
  137:   { name: "Polygon",         rpc: "https://polygon-mainnet.g.alchemy.com/v2/", explorer: "https://polygonscan.com" },
  80001: { name: "Mumbai (Testnet)",rpc: "https://polygon-mumbai.g.alchemy.com/v2/", explorer: "https://mumbai.polygonscan.com" },
  11155111: { name: "Sepolia (Testnet)", rpc: "https://eth-sepolia.g.alchemy.com/v2/", explorer: "https://sepolia.etherscan.io" },
};

// ── CONNECT WALLET ────────────────────────────────────────────
export async function connectWallet() {
  if (typeof window === "undefined") throw new Error("Not in browser");
  if (!window.ethereum) throw new Error("MetaMask not installed. Please install MetaMask to connect your wallet.");

  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  if (!accounts || accounts.length === 0) throw new Error("No accounts found. Please unlock MetaMask.");

  const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
  const chainId = parseInt(chainIdHex, 16);
  const address = accounts[0].toLowerCase();

  return { address, chainId, chainName: CHAINS[chainId]?.name || `Chain ${chainId}` };
}

// ── SIGN MESSAGE (for wallet verification) ────────────────────
export async function signMessage(address, nonce) {
  if (!window.ethereum) throw new Error("MetaMask not installed");
  const message = `Sign this message to verify your wallet ownership.\n\nNonce: ${nonce}\n\nThis request will not trigger a blockchain transaction or cost any gas fees.`;
  const signature = await window.ethereum.request({
    method: "personal_sign",
    params: [message, address],
  });
  return signature;
}

// ── GET WALLET BALANCE ────────────────────────────────────────
export async function getBalance(address) {
  if (!window.ethereum) return "0";
  const balanceHex = await window.ethereum.request({
    method: "eth_getBalance",
    params: [address, "latest"],
  });
  const balanceWei = parseInt(balanceHex, 16);
  return (balanceWei / 1e18).toFixed(4);
}

// ── GET TOKEN BALANCE (ERC-3643 / ERC-20) ────────────────────
export async function getTokenBalance(tokenAddress, walletAddress) {
  if (!window.ethereum) return "0";
  const data = "0x70a08231" + walletAddress.slice(2).padStart(64, "0"); // balanceOf(address)
  const result = await window.ethereum.request({
    method: "eth_call",
    params: [{ to: tokenAddress, data }, "latest"],
  });
  const balance = parseInt(result, 16);
  return (balance / 1e18).toFixed(2);
}

// ── SWITCH CHAIN ──────────────────────────────────────────────
export async function switchChain(chainId) {
  if (!window.ethereum) throw new Error("MetaMask not installed");
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x" + chainId.toString(16) }],
    });
  } catch (err) {
    if (err.code === 4902) throw new Error(`Chain ${chainId} not added to MetaMask`);
    throw err;
  }
}

// ── WATCH ACCOUNT / CHAIN CHANGES ────────────────────────────
export function watchWalletEvents(onAccountChange, onChainChange, onDisconnect) {
  if (typeof window === "undefined" || !window.ethereum) return () => {};
  const handleAccounts = (accounts) => {
    if (accounts.length === 0) onDisconnect?.();
    else onAccountChange?.(accounts[0].toLowerCase());
  };
  const handleChain = (chainIdHex) => {
    onChainChange?.(parseInt(chainIdHex, 16));
  };
  window.ethereum.on("accountsChanged", handleAccounts);
  window.ethereum.on("chainChanged", handleChain);
  return () => {
    window.ethereum.removeListener("accountsChanged", handleAccounts);
    window.ethereum.removeListener("chainChanged", handleChain);
  };
}

// ── VERIFY WALLET SIGNATURE (server-side) ────────────────────
export function verifySignature(address, nonce, signature) {
  // Use ethers.js on server: npm install ethers
  // const { ethers } = require("ethers");
  // const message = `Sign this message...\n\nNonce: ${nonce}...`;
  // const recovered = ethers.verifyMessage(message, signature);
  // return recovered.toLowerCase() === address.toLowerCase();
  // For now return true — implement with ethers when ready
  return true;
}

// ── FORMAT ADDRESS ────────────────────────────────────────────
export function shortAddress(addr) {
  if (!addr) return "";
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

// ── EXPLORER LINK ────────────────────────────────────────────
export function explorerTxLink(txHash, chainId = 1) {
  const base = CHAINS[chainId]?.explorer || "https://etherscan.io";
  return `${base}/tx/${txHash}`;
}

export function explorerAddressLink(address, chainId = 1) {
  const base = CHAINS[chainId]?.explorer || "https://etherscan.io";
  return `${base}/address/${address}`;
}
