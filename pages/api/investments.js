import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import connectDB from '../../lib/db';
import Asset from '../../lib/models/Asset';
import Investment from '../../lib/models/Investment';
import Wallet from '../../models/Wallet';
import User from '../../lib/models/User';

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

    if (price === 0) {
      return res.status(400).json({ error: 'Asset price not set yet' });
    }
    if (amount < minInvest) {
      return res.status(400).json({ error: 'Minimum investment is €' + minInvest });
    }

    const userId = session.id || session.sub || session.user?.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.kycStatus !== 'approved') {
      return res.status(400).json({
        error: 'KYC verification required. Please complete identity verification before investing.',
        code: 'KYC_REQUIRED'
      });
    }

    const wallet = await Wallet.findOne({ userId: user._id });
    if (!wallet) {
      return res.status(400).json({
        error: 'No platform wallet found. Please deposit funds first.',
        code: 'NO_WALLET'
      });
    }

    const balance = wallet.availableBalance || 0;

    if (balance < amount) {
      return res.status(400).json({
        error: 'Insufficient balance. You have €' + balance.toFixed(2) + ' but need €' + amount.toFixed(2) + '. Please deposit funds to your wallet first.',
        code: 'INSUFFICIENT_BALANCE',
        required: amount,
        available: balance
      });
    }

    await Wallet.findByIdAndUpdate(wallet._id, {
      $inc: { availableBalance: -amount, lockedBalance: amount },
      $push: {
        transactions: {
          type: 'buy',
          amount: -amount,
          assetId: asset._id.toString(),
          assetName: asset.name,
          status: 'completed',
          description: 'Purchased ' + units + ' tokens of ' + asset.name + ' at €' + price + ' per token',
          createdAt: new Date()
        }
      }
    });

    const investment = await Investment.create({
      userId:        user._id,
      assetId:       asset._id,
      assetName:     asset.name,
      assetType:     asset.assetType,
      ticker:        asset.ticker,
      amount,
      tokens:        units,
      tokenPrice:    price,
      expectedROI:   asset.targetROI || 0,
      term:          asset.term || 0,
      status:        'confirmed',
      paymentMethod: 'platform_balance',
    });

    await Asset.findByIdAndUpdate(assetId, {
      $inc: { raisedAmount: amount, investorCount: 1 }
    });

    return res.status(200).json({
      success:    true,
      investment,
      message:    'Investment of €' + amount + ' successful! ' + units + ' tokens purchased.',
      newBalance: balance - amount
    });

  } catch (err) {
    console.error('Investment error:', err);
    return res.status(500).json({ error: err.message });
  }
}