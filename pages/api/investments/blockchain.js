import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import connectDB from '../../../lib/db';
import Asset from '../../../lib/models/Asset';
import Investment from '../../../lib/models/Investment';
import User from '../../../lib/models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ error: 'Please log in' });

    await connectDB();

    const { assetId, units, amount, txHash, fromChain, fromToken, walletAddress } = req.body;
    if (!assetId || !units || !txHash) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const asset = await Asset.findById(assetId);
    if (!asset) return res.status(404).json({ error: 'Asset not found' });

    const userId = session.id || session.sub || session.user?.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.kycStatus !== 'approved') {
      return res.status(400).json({ error: 'KYC required before investing.', code: 'KYC_REQUIRED' });
    }

    // Prevent duplicate transactions
    const existing = await Investment.findOne({ paymentTxHash: txHash });
    if (existing) return res.status(400).json({ error: 'Transaction already processed' });

    const investAmount = amount || (asset.tokenPrice * units);

    const investment = await Investment.create({
      userId:        user._id,
      assetId:       asset._id,
      assetName:     asset.name,
      assetType:     asset.assetType,
      ticker:        asset.ticker,
      amount:        investAmount,
      tokens:        units,
      tokenPrice:    asset.tokenPrice,
      expectedROI:   asset.targetROI || 0,
      term:          asset.term || 0,
      status:        'confirmed',
      paymentMethod: 'crypto',
      paymentTxHash: txHash,
      walletAddress: walletAddress?.toLowerCase(),
      chainId:       137,
    });

    await Asset.findByIdAndUpdate(assetId, {
      $inc: { raisedAmount: investAmount, investorCount: 1 }
    });

    return res.status(200).json({
      success: true,
      investment,
      message: units + ' tokens purchased! Tx: ' + txHash.slice(0, 10) + '...',
    });

  } catch (err) {
    console.error('Blockchain investment error:', err);
    return res.status(500).json({ error: err.message });
  }
}