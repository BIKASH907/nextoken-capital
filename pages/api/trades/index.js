import connectDB from '../../../lib/db';
import Trade from '../../../models/Trade';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  await connectDB();
  const { assetId, limit } = req.query;
  const filter = {};
  if (assetId) filter.assetId = assetId;
  const trades = await Trade.find(filter).sort({ createdAt: -1 }).limit(parseInt(limit) || 20).lean();
  // Map fields for exchange UI
  const mapped = trades.map(t => ({
    ...t,
    price: t.pricePerUnit,
    units: t.units,
    side: 'trade',
  }));
  return res.json({ trades: mapped });
}
