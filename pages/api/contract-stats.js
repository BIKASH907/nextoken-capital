// pages/api/contract-stats.js
// Reads real-time stats from NextokenUniversalEscrow on Polygon

import { ethers } from 'ethers';

const ESCROW_ABI = [
  'function getPlatformStats() view returns (uint256 totalAssets, uint256 totalRaisedEUR, uint256 totalCommissionEUR, uint256 totalInvestors)',
  'function getAsset(uint256 id) view returns (tuple(string name, address issuerWallet, string issuerIBAN, uint256 commissionBps, uint256 targetAmountEUR, uint256 totalRaisedEUR, uint256 totalCommissionEUR, uint256 totalInvestors, uint256 tokenSupply, uint256 tokensSold, uint256 pricePerTokenEUR, uint256 minInvestmentEUR, uint256 deadline, bool active, bool exists))',
  'function getFundraisingProgressBps(uint256 id) view returns (uint256)',
  'function getTokenSaleProgressBps(uint256 id) view returns (uint256)',
  'function assetCount() view returns (uint256)',
  'function getContractBalance() view returns (uint256)',
];

function getContract() {
  const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC || 'https://polygon-rpc.com');
  return new ethers.Contract(process.env.ESCROW_CONTRACT_ADDRESS, ESCROW_ABI, provider);
}

export default async function handler(req, res) {
  try {
    const contract = getContract();
    const { assetId } = req.query;

    if (assetId !== undefined) {
      const a = await contract.getAsset(Number(assetId));
      const fundBps = await contract.getFundraisingProgressBps(Number(assetId));
      const tokenBps = await contract.getTokenSaleProgressBps(Number(assetId));

      return res.status(200).json({
        asset: {
          name: a.name,
          issuerWallet: a.issuerWallet,
          commissionBps: Number(a.commissionBps),
          targetAmountEUR: Number(a.targetAmountEUR) / 1e6,
          totalRaisedEUR: Number(a.totalRaisedEUR) / 1e6,
          totalCommissionEUR: Number(a.totalCommissionEUR) / 1e6,
          totalInvestors: Number(a.totalInvestors),
          tokenSupply: Number(a.tokenSupply),
          tokensSold: Number(a.tokensSold),
          pricePerTokenEUR: Number(a.pricePerTokenEUR) / 1e6,
          minInvestmentEUR: Number(a.minInvestmentEUR) / 1e6,
          active: a.active,
        },
        fundraisingPercent: Number(fundBps) / 100,
        tokenSalePercent: Number(tokenBps) / 100,
      });
    }

    // Platform-wide stats
    const [totalAssets, totalRaised, totalCommission, totalInvestors] = await contract.getPlatformStats();
    const count = Number(totalAssets);
    const assets = [];

    for (let i = 0; i < count; i++) {
      try {
        const a = await contract.getAsset(i);
        const fp = await contract.getFundraisingProgressBps(i);
        const tp = await contract.getTokenSaleProgressBps(i);
        assets.push({
          id: i, name: a.name,
          targetAmount: Number(a.targetAmountEUR) / 1e6,
          totalRaised: Number(a.totalRaisedEUR) / 1e6,
          totalInvestors: Number(a.totalInvestors),
          tokenSupply: Number(a.tokenSupply),
          tokensSold: Number(a.tokensSold),
          fundraisingPercent: Number(fp) / 100,
          tokenSalePercent: Number(tp) / 100,
          active: a.active,
        });
      } catch (e) {}
    }

    return res.status(200).json({
      platform: {
        totalAssets: count,
        totalRaisedEUR: Number(totalRaised) / 1e6,
        totalCommissionEUR: Number(totalCommission) / 1e6,
        totalInvestors: Number(totalInvestors),
      },
      assets,
    });
  } catch (error) {
    console.error('Contract stats error:', error);
    return res.status(500).json({ error: error.message });
  }
}
