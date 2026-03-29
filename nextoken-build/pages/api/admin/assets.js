// pages/api/admin/assets.js
// Returns all assets with issuer details for admin review panel

import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session || session.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin only' });
    }

    const { status } = req.query; // Filter: pending_review, live, rejected, paused, all
    const client = await clientPromise;
    const db = client.db();

    const filter = status && status !== 'all' ? { status } : {};
    const assets = await db.collection('assets')
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    // Attach issuer details to each asset
    const issuerIds = [...new Set(assets.map(a => a.issuerId?.toString()).filter(Boolean))];
    const { ObjectId } = require('mongodb');
    const issuers = await db.collection('issuers')
      .find({ _id: { $in: issuerIds.map(id => new ObjectId(id)) } })
      .toArray();

    const issuerMap = {};
    issuers.forEach(i => { issuerMap[i._id.toString()] = i; });

    const enrichedAssets = assets.map(a => ({
      ...a,
      _id: a._id.toString(),
      issuerId: a.issuerId?.toString(),
      issuer: issuerMap[a.issuerId?.toString()] ? {
        companyName: issuerMap[a.issuerId.toString()].companyName,
        country: issuerMap[a.issuerId.toString()].country,
        walletAddress: issuerMap[a.issuerId.toString()].walletAddress,
        moneriumConnected: !!issuerMap[a.issuerId.toString()].moneriumProfileId,
        moneriumIBAN: issuerMap[a.issuerId.toString()].moneriumIBAN,
        kybStatus: issuerMap[a.issuerId.toString()].kybStatus,
      } : null,
    }));

    // Platform stats
    const stats = {
      total: assets.length,
      pending: assets.filter(a => a.status === 'pending_review').length,
      live: assets.filter(a => a.status === 'live').length,
      rejected: assets.filter(a => a.status === 'rejected').length,
      paused: assets.filter(a => a.status === 'paused').length,
      totalTargetAmount: assets.reduce((sum, a) => sum + (a.targetAmount || 0), 0),
      totalRaised: assets.reduce((sum, a) => sum + (a.totalRaised || 0), 0),
    };

    return res.status(200).json({ assets: enrichedAssets, stats });
  } catch (error) {
    console.error('Admin assets error:', error);
    return res.status(500).json({ error: error.message });
  }
}
