// pages/api/auth/monerium/connect.js
// Redirect-based OAuth flow with PKCE (fallback for when iframe doesn't work)

import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import crypto from 'crypto';

const MONERIUM_ENV = process.env.MONERIUM_ENV || 'sandbox';
const MONERIUM_AUTH = MONERIUM_ENV === 'production'
  ? 'https://monerium.app'
  : 'https://sandbox.monerium.dev';

function generatePKCE() {
  const verifier = crypto.randomBytes(32).toString('base64url');
  const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
  return { verifier, challenge };
}

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

    // Generate PKCE
    const { verifier, challenge } = generatePKCE();

    // Store verifier
    await db.collection('issuers').updateOne(
      { _id: new ObjectId(issuerId) },
      { $set: { moneriumCodeVerifier: verifier } }
    );

    // Redirect to Monerium OAuth
    const params = new URLSearchParams({
      client_id: process.env.MONERIUM_CLIENT_ID,
      redirect_uri: process.env.MONERIUM_REDIRECT_URI,
      response_type: 'code',
      code_challenge: challenge,
      code_challenge_method: 'S256',
      state: issuerId,
    });

    return res.redirect(`${MONERIUM_AUTH}/authorize?${params.toString()}`);
  } catch (error) {
    console.error('Monerium connect error:', error);
    return res.status(500).json({ error: error.message });
  }
}
