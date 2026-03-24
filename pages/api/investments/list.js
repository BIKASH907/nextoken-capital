import { getSession } from '../../../lib/session';
import { connectDB } from '../../../lib/mongodb';
import Investment from '../../../lib/models/Investment';
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const session = getSession(req);
  if (!session) return res.status(401).json({ error: 'Not authenticated.' });
  try {
    await connectDB();
    const investments = await Investment.find({ userId: session.userId }).sort({ createdAt: -1 });
    return res.status(200).json({
      investments: investments.map(i => ({
        id: i._id.toString(),
        assetId: i.assetId,
        assetName: i.assetName,
        assetSymbol: i.assetSymbol,
        amount: i.amount,
        tokenPrice: i.tokenPrice,
        quantity: i.quantity,
        currentValue: i.currentValue,
        returns: i.returns,
        status: i.status,
        createdAt: i.createdAt,
      })),
    });
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
