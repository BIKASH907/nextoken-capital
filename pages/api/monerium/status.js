// pages/api/auth/monerium/status.js
// Polled by MoneriumConnect component to check if OAuth completed
// Returns { connected: true/false, profileId, iban }

import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ error: 'Unauthorized' });

    const { issuerId } = req.query;
    if (!issuerId) return res.status(400).json({ error: 'issuerId required' });

    const client = await clientPromise;
    const db = client.db();

    const issuer = await db.collection('issuers').findOne({
      _id: new ObjectId(issuerId),
      userId: session.user.id,
    });

    if (!issuer) return res.status(404).json({ error: 'Issuer not found' });

    // Check if Monerium was connected (callback route sets these fields)
    if (issuer.moneriumProfileId && issuer.moneriumConnectedAt) {
      return res.status(200).json({
        connected: true,
        profileId: issuer.moneriumProfileId,
        iban: issuer.moneriumIBAN,
        walletLinked: issuer.moneriumWalletLinked,
        connectedAt: issuer.moneriumConnectedAt,
      });
    }

    return res.status(200).json({ connected: false });
  } catch (error) {
    console.error('Monerium status error:', error);
    return res.status(500).json({ error: error.message });
  }
}
