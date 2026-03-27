import connectDB from '../../../lib/db';
import Asset from '../../../lib/models/Asset';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    await connectDB();

    const { type, search, limit = 100 } = req.query;

    const query = {
      status: { $in: ['live', 'active', 'approved', 'listed', 'closing', 'draft'] }
    };

    if (type && type !== 'All') query.assetType = type;
    if (search) {
      query.$or = [
        { name:     { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const assets = await Asset.find(query)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ success: true, assets, total: assets.length });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}