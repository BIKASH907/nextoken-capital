export async function connectMetaMask() {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask not installed. Please install MetaMask to connect your wallet.");
  }

  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  if (!accounts || accounts.length === 0) throw new Error("No accounts found");

  // Ensure on Polygon mainnet
  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  if (chainId !== "0x89") {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x89" }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: "0x89",
            chainName: "Polygon Mainnet",
            nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
            rpcUrls: ["https://polygon-rpc.com"],
            blockExplorerUrls: ["https://polygonscan.com"],
          }],
        });
      }
    }
  }

  return { address: accounts[0], chainId: "0x89", network: "Polygon" };
}

export async function getWalletBalance(address) {
  if (!window.ethereum) return "0";
  const balance = await window.ethereum.request({
    method: "eth_getBalance",
    params: [address, "latest"],
  });
  return (parseInt(balance, 16) / 1e18).toFixed(4);
}

export async function disconnectWallet() {
  return { disconnected: true };
}
