import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import connectDB from '../../../lib/db';
import Investment from '../../../lib/models/Investment';

export default async function handler(req, res) {
  if (req.query.key !== 'nxt-debug-2026') return res.status(403).json({});
  await connectDB();
  
  const session = await getServerSession(req, res, authOptions);
  const sessionUserId = session?.id || session?.sub || session?.user?.id || 'no-session';
  
  const allInv = await Investment.find({}).lean();
  
  return res.json({
    sessionUserId,
    sessionEmail: session?.user?.email,
    investments: allInv.map(i => ({
      id: i._id,
      userId: i.userId?.toString(),
      assetName: i.assetName,
      tokens: i.tokens,
      status: i.status,
      match: i.userId?.toString() === sessionUserId.toString()
    }))
  });
}
