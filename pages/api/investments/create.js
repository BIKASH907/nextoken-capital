import { getSession } from '../../../lib/session';
import { connectDB } from '../../../lib/mongodb';
import User from '../../../lib/models/User';
import Investment from '../../../lib/models/Investment';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const session = getSession(req);
  if (!session) return res.status(401).json({ error: 'You must be logged in to invest.' });
  const { assetId, assetName, assetSymbol, amount, tokenPrice, quantity } = req.body;
  if (!assetId || !amount || amount < 100) return res.status(400).json({ error: 'Minimum investment is EUR 100.' });
  if (session.kycStatus !== 'approved') return res.status(403).json({ error: 'KYC verification required before investing.', kycRequired: true });
  try {
    await connectDB();
    const investment = await Investment.create({
      userId: session.userId,
      assetId, assetName,
      assetSymbol: assetSymbol || assetId,
      amount: parseFloat(amount),
      tokenPrice: parseFloat(tokenPrice || 10),
      quantity: parseInt(quantity || Math.floor(amount / (tokenPrice || 10))),
      status: 'active',
      returns: 0,
      currentValue: parseFloat(amount),
    });
    await User.findByIdAndUpdate(session.userId, {
      $inc: { 'portfolio.totalInvested': parseFloat(amount), 'portfolio.totalValue': parseFloat(amount) },
      $set: { updatedAt: new Date() }
    });
    return res.status(201).json({ success: true, investmentId: investment._id.toString(), message: 'Investment successful.' });
  } catch(e) {
    return res.status(500).json({ error: 'Investment failed: ' + e.message });
  }
}
