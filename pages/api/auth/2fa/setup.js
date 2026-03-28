import { getServerSession } from 'next-auth/next';
import { authOptions } from '../[...nextauth]';
import connectDB from '../../../../lib/db';
import User from '../../../../lib/models/User';
import { generateSecret, generateQRUri } from '../../../../lib/totp';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ error: 'Login required' });
    await connectDB();
    const userId = session.id || session.sub || session.user?.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const secret = generateSecret();
    user.twoFactorSecret = secret;
    user.twoFactorEnabled = false;
    await user.save();
    return res.json({ secret, qrUri: generateQRUri(secret, user.email) });
  } catch (err) {
    console.error('2FA setup error:', err);
    return res.status(500).json({ error: 'Failed to setup 2FA' });
  }
}
