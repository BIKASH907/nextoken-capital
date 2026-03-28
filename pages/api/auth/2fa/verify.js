import { getServerSession } from 'next-auth/next';
import { authOptions } from '../[...nextauth]';
import connectDB from '../../../../lib/db';
import User from '../../../../lib/models/User';
import { verifyTOTP } from '../../../../lib/totp';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ error: 'Login required' });
    await connectDB();
    const userId = session.id || session.sub || session.user?.id;
    const user = await User.findById(userId);
    if (!user || !user.twoFactorSecret) return res.status(400).json({ error: '2FA not setup' });
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'Token required' });
    if (!verifyTOTP(user.twoFactorSecret, token)) return res.status(400).json({ error: 'Invalid code' });
    user.twoFactorEnabled = true;
    await user.save();
    return res.json({ success: true, message: '2FA enabled successfully' });
  } catch (err) {
    console.error('2FA verify error:', err);
    return res.status(500).json({ error: 'Verification failed' });
  }
}
