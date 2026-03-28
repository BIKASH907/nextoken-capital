import connectDB from '../../../lib/db';
import Asset from '../../../lib/models/Asset';
import Investment from '../../../lib/models/Investment';
import User from '../../../lib/models/User';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' });
  try {
    await connectDB();
    const [assets, investments, investors] = await Promise.all([
      Asset.find({ status: 'live' }).lean(),
      Investment.find({ status: { $in: ['confirmed', 'active'] } }).lean(),
      User.countDocuments({ accountType: 'investor' }),
    ]);
    const totalRaised = investments.reduce((s, i) => s + (i.amount || 0), 0);
    const uniqueInvestors = new Set(investments.map(i => i.userId?.toString())).size;
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    return res.json({
      totalAssets: assets.length,
      totalRaised: Math.round(totalRaised),
      totalVolume: Math.round(totalRaised),
      totalInvestors: uniqueInvestors || investors,
      totalInvestments: investments.length,
    });
  } catch (err) {
    console.error('Stats error:', err);
    return res.status(500).json({ error: 'Failed to load stats' });
  }
}
