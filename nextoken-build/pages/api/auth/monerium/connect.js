// pages/api/auth/monerium/connect.js
// Initiates Monerium OAuth flow — redirects issuer to Monerium login

import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import clientPromise from '@/lib/mongodb';
import { getOAuthURL } from '@/lib/monerium';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ error: 'Unauthorized' });

    const { issuerId } = req.query;
    if (!issuerId) return res.status(400).json({ error: 'issuerId required' });

    // Verify issuer exists and belongs to this user
    const client = await clientPromise;
    const db = client.db();
    const { ObjectId } = require('mongodb');

    const issuer = await db.collection('issuers').findOne({
      _id: new ObjectId(issuerId),
      userId: session.user.id,
    });

    if (!issuer) return res.status(404).json({ error: 'Issuer not found' });

    // Generate OAuth URL with issuerId as state
    const oauthURL = getOAuthURL(issuerId);

    return res.redirect(oauthURL);
  } catch (error) {
    console.error('Monerium connect error:', error);
    return res.status(500).json({ error: error.message });
  }
}
