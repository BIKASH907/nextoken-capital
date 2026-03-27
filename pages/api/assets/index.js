import connectDB from '../../../lib/db';
import Asset from '../../../lib/models/Asset';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  await connectDB();

  try {
    const { type, search, limit = 50 } = req.query;

    const query = { status: { $in: ['live', 'active', 'approved', 'listed', 'draft'] } };

    if (type && type !== 'all') query.assetType = type;
    if (search) query.name = { $regex: search, $options: 'i' };

    const assets = await Asset.find(query)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ assets, total: assets.length });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}