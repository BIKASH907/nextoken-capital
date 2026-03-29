// pages/api/auth/monerium/start.js
// Returns OAuth URL as JSON (for iframe embedding) instead of redirecting
// The MoneriumConnect component loads this URL in an iframe

import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

const MONERIUM_ENV = process.env.MONERIUM_ENV || 'sandbox';
const MONERIUM_AUTH = MONERIUM_ENV === 'production'
  ? 'https://monerium.app'
  : 'https://sandbox.monerium.dev';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ error: 'Unauthorized' });

    const { issuerId } = req.query;
    if (!issuerId) return res.status(400).json({ error: 'issuerId required' });

    // Verify issuer exists
    const client = await clientPromise;
    const db = client.db();
    const issuer = await db.collection('issuers').findOne({
      _id: new ObjectId(issuerId),
      userId: session.user.id,
    });

    if (!issuer) return res.status(404).json({ error: 'Issuer not found' });

    // Build OAuth URL
    const params = new URLSearchParams({
      client_id: process.env.MONERIUM_CLIENT_ID,
      redirect_uri: process.env.MONERIUM_REDIRECT_URI,
      response_type: 'code',
      scope: 'orders:read orders:write accounts:read',
      state: issuerId,
    });

    const authUrl = `${MONERIUM_AUTH}/authorize?${params.toString()}`;

    return res.status(200).json({ authUrl });
  } catch (error) {
    console.error('Monerium start error:', error);
    return res.status(500).json({ error: error.message });
  }
}
