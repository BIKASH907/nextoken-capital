// pages/api/issuer/dashboard.js
// Returns issuer profile, assets, stats, and redemption history

import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import clientPromise from '@/lib/mongodb';
import { ethers } from 'ethers';

const EURE_ADDRESS = '0x18ec0A6E18E5bc3784fDd3a3669906d2bfc5075d';
const EURE_ABI = ['function balanceOf(address) view returns (uint256)'];

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ error: 'Unauthorized' });

    const client = await clientPromise;
    const db = client.db();

    // Get issuer
    const issuer = await db.collection('issuers').findOne({ userId: session.user.id });
    if (!issuer) {
      return res.status(200).json({ issuer: null, assets: [], redemptions: [] });
    }

    // Get assets
    const assets = await db.collection('assets')
      .find({ issuerId: issuer._id })
      .sort({ createdAt: -1 })
      .toArray();

    // Get redemption history
    const redemptions = await db.collection('redemptions')
      .find({ issuerId: issuer._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();

    // Get EURe balance from Polygon
    let eureBalance = 0;
    if (issuer.walletAddress) {
      try {
        const provider = new ethers.JsonRpcProvider(
          process.env.POLYGON_RPC || 'https://polygon-rpc.com'
        );
        const eureContract = new ethers.Contract(EURE_ADDRESS, EURE_ABI, provider);
        const balance = await eureContract.balanceOf(issuer.walletAddress);
        eureBalance = parseFloat(ethers.formatUnits(balance, 6));
      } catch (e) {
        console.error('Balance fetch error:', e.message);
      }
    }

    // Sanitize issuer (remove sensitive tokens)
    const sanitizedIssuer = {
      _id: issuer._id,
      companyName: issuer.companyName,
      registrationNumber: issuer.registrationNumber,
      country: issuer.country,
      walletAddress: issuer.walletAddress,
      payoutMethod: issuer.payoutMethod,
      moneriumProfileId: issuer.moneriumProfileId,
      moneriumIBAN: issuer.moneriumIBAN,
      moneriumWalletLinked: issuer.moneriumWalletLinked,
      moneriumConnectedAt: issuer.moneriumConnectedAt,
      kybStatus: issuer.kybStatus,
      onboardingStatus: issuer.onboardingStatus,
      eureBalance,
    };

    return res.status(200).json({
      issuer: sanitizedIssuer,
      assets: assets.map(a => ({
        ...a,
        _id: a._id.toString(),
        issuerId: a.issuerId.toString(),
      })),
      redemptions: redemptions.map(r => ({
        ...r,
        _id: r._id.toString(),
        issuerId: r.issuerId.toString(),
      })),
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    return res.status(500).json({ error: error.message });
  }
}
