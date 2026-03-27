import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import connectDB from '../../lib/db';
import Asset from '../../lib/models/Asset';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ error: 'Please log in to invest' });

    await connectDB();

    const { assetId, units } = req.body;
    if (!assetId || !units || units < 1) {
      return res.status(400).json({ error: 'Invalid investment details' });
    }

    const asset = await Asset.findById(assetId);
    if (!asset) return res.status(404).json({ error: 'Asset not found' });

    const price     = asset.tokenPrice || 0;
    const amount    = price * units;
    const minInvest = asset.minInvestment || 100;

    if (price > 0 && amount < minInvest) {
      return res.status(400).json({ error: 'Minimum investment is €' + minInvest });
    }

    // Update asset raised amount
    await Asset.findByIdAndUpdate(assetId, {
      $inc: { raisedAmount: amount, investorCount: 1 }
    }).catch(() => {});

    return res.status(200).json({
      success: true,
      message: 'Investment of €' + amount + ' submitted successfully!'
    });

  } catch (err) {
    console.error('Investment error:', err);
    return res.status(500).json({ error: err.message });
  }
}