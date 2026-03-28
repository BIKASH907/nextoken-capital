import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import connectDB from '../../../lib/db';
import Investment from '../../../lib/models/Investment';
import Asset from '../../../lib/models/Asset';
import User from '../../../lib/models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'Login required' });

  await connectDB();
  
  const userId = session.id || session.sub || session.user?.id;
  const user = await User.findById(userId);
  if (!user || user.email !== 'bikashbhat2001@gmail.com') {
    return res.status(403).json({ error: 'Admin only' });
  }

  const { assetId, units, txHash } = req.body;
  const asset = await Asset.findById(assetId);
  if (!asset) return res.status(404).json({ error: 'Asset not found' });

  const existing = await Investment.findOne({ paymentTxHash: txHash });
  if (existing) return res.status(400).json({ error: 'Already recorded' });

  const investment = await Investment.create({
    userId: user._id,
    assetId: asset._id,
    assetName: asset.name,
    assetType: asset.assetType,
    amount: asset.tokenPrice * units,
    tokens: units,
    tokenPrice: asset.tokenPrice,
    expectedROI: asset.targetROI || 0,
    status: 'confirmed',
    paymentMethod: 'crypto',
    paymentTxHash: txHash,
    walletAddress: '0x1bB5EcCEf264E17b581e388317D7a38255821048',
    chainId: 137,
  });

  return res.json({ success: true, investment });
}
