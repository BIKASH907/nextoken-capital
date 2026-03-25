import { ethers } from "ethers";
import { getProvider, getToken, getFactory } from "../../../lib/blockchain";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { address } = req.query;

  try {
    const provider = getProvider();

    if (address) {
      // Get single token info
      const token = getToken(address, provider);
      const [name, symbol, totalSupply, maxSupply, paused, holderCount, assetId, assetType] = await Promise.all([
        token.name(),
        token.symbol(),
        token.totalSupply(),
        token.maxSupply(),
        token.paused(),
        token.getHolderCount(),
        token.assetId(),
        token.assetType(),
      ]);

      return res.status(200).json({
        address,
        name,
        symbol,
        totalSupply: ethers.formatEther(totalSupply),
        maxSupply: ethers.formatEther(maxSupply),
        paused,
        holderCount: Number(holderCount),
        assetId,
        assetType,
        network: "polygon",
        chainId: 137,
      });
    }

    // Get all tokens from factory
    const factory = getFactory(provider);
    const tokens = await factory.getDeployedTokens();

    const tokenList = await Promise.all(tokens.map(async (addr) => {
      const token = getToken(addr, provider);
      const [name, symbol, totalSupply, paused] = await Promise.all([
        token.name(), token.symbol(), token.totalSupply(), token.paused(),
      ]);
      return { address: addr, name, symbol, totalSupply: ethers.formatEther(totalSupply), paused };
    }));

    return res.status(200).json({ tokens: tokenList });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Failed to fetch token info" });
  }
}
