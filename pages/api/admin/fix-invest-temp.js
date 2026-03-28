import connectDB from '../../../lib/db';
import Investment from '../../../lib/models/Investment';
import Asset from '../../../lib/models/Asset';
import User from '../../../lib/models/User';

export default async function handler(req, res) {
  if (req.query.key !== 'nxt-fix-2026') return res.status(403).json({ error: 'forbidden' });
  await connectDB();
  const user = await User.findOne({ email: 'bikashbhat2001@gmail.com' });
  const asset = await Asset.findById('69c6b785565a401d9d8f01cd');
  if (!user || !asset) return res.json({ error: 'not found', user: !!user, asset: !!asset });
  const existing = await Investment.findOne({ paymentTxHash: '0xaefd98d14432fada2be62955b7a2f959a73789e05a6bae8edde70a68e2a322b5' });
  if (existing) return res.json({ error: 'already recorded' });
  const inv = await Investment.create({
    userId: user._id, assetId: asset._id, assetName: asset.name,
    assetType: asset.assetType, amount: asset.tokenPrice * 1, tokens: 1,
    tokenPrice: asset.tokenPrice, expectedROI: asset.targetROI || 0,
    status: 'confirmed', paymentMethod: 'crypto',
    paymentTxHash: '0xaefd98d14432fada2be62955b7a2f959a73789e05a6bae8edde70a68e2a322b5',
    walletAddress: '0x1bB5EcCEf264E17b581e388317D7a38255821048', chainId: 137,
  });
  return res.json({ success: true, id: inv._id });
}
