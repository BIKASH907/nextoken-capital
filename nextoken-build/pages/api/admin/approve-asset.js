// pages/api/admin/approve-asset.js
// Admin approves → registers on escrow contract
// Admin rejects → saves reason
// Admin pauses/resumes → updates contract + MongoDB

import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { ethers } from 'ethers';

const ESCROW_ABI = [
  'function registerAsset(string name, address issuerWallet, string issuerIBAN, uint256 commissionBps, uint256 targetAmountEUR, uint256 tokenSupply, uint256 pricePerTokenEUR, uint256 minInvestmentEUR, uint256 deadline) returns (uint256)',
  'function setAssetActive(uint256 id, bool active)',
  'function adminUpdateIssuerWallet(uint256 id, address newWallet)',
  'event AssetRegistered(uint256 indexed assetId, string name, address issuerWallet)',
];

function getEscrowContract() {
  const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC || 'https://polygon-rpc.com');
  const wallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);
  return new ethers.Contract(process.env.ESCROW_CONTRACT_ADDRESS, ESCROW_ABI, wallet);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session || session.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin only' });
    }

    const { assetId, action, reason } = req.body;

    const client = await clientPromise;
    const db = client.db();
    const asset = await db.collection('assets').findOne({ _id: new ObjectId(assetId) });
    if (!asset) return res.status(404).json({ error: 'Asset not found' });

    // ── APPROVE ──
    if (action === 'approve') {
      const contract = getEscrowContract();
      const eure = (amt) => ethers.parseUnits(amt.toString(), 6);

      const tx = await contract.registerAsset(
        asset.name,
        asset.issuerWallet,
        asset.issuerIBAN || '',
        asset.commissionBps || 25,
        eure(asset.targetAmount),
        asset.tokenSupply,
        eure(asset.pricePerToken),
        eure(asset.minInvestment || 100),
        asset.deadline ? Math.floor(new Date(asset.deadline).getTime() / 1000) : 0
      );

      const receipt = await tx.wait();

      // Extract contract assetId from event
      let contractAssetId = null;
      const iface = new ethers.Interface(['event AssetRegistered(uint256 indexed assetId, string name, address issuerWallet)']);
      for (const log of receipt.logs) {
        try {
          const parsed = iface.parseLog(log);
          if (parsed.name === 'AssetRegistered') contractAssetId = Number(parsed.args.assetId);
        } catch (e) {}
      }

      await db.collection('assets').updateOne(
        { _id: new ObjectId(assetId) },
        {
          $set: {
            status: 'live', contractAssetId, contractTxHash: receipt.hash,
            approvedBy: session.user.id, approvedAt: new Date(), updatedAt: new Date(),
          }
        }
      );

      await db.collection('issuers').updateOne(
        { _id: asset.issuerId },
        { $set: { onboardingStatus: 'complete', updatedAt: new Date() } }
      );

      return res.status(200).json({ success: true, contractAssetId, txHash: receipt.hash });
    }

    // ── REJECT ──
    if (action === 'reject') {
      await db.collection('assets').updateOne(
        { _id: new ObjectId(assetId) },
        {
          $set: {
            status: 'rejected', rejectionReason: reason || 'Did not pass review',
            rejectedBy: session.user.id, rejectedAt: new Date(), updatedAt: new Date(),
          }
        }
      );
      return res.status(200).json({ success: true, message: 'Asset rejected' });
    }

    // ── PAUSE / RESUME ──
    if (action === 'pause' || action === 'resume') {
      if (asset.contractAssetId === null) {
        return res.status(400).json({ error: 'Asset not on contract' });
      }
      const contract = getEscrowContract();
      const isActive = action === 'resume';
      const tx = await contract.setAssetActive(asset.contractAssetId, isActive);
      await tx.wait();

      await db.collection('assets').updateOne(
        { _id: new ObjectId(assetId) },
        { $set: { status: isActive ? 'live' : 'paused', updatedAt: new Date() } }
      );
      return res.status(200).json({ success: true, message: `Asset ${action}d` });
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (error) {
    console.error('Admin asset error:', error);
    return res.status(500).json({ error: error.message });
  }
}
