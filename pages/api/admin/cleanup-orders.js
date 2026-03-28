import connectDB from '../../../lib/db';
import Order from '../../../models/Order';
import Trade from '../../../models/Trade';

export default async function handler(req, res) {
  if (req.query.key !== 'nxt-cleanup-2026') return res.status(404).json({});
  await connectDB();
  const deletedOrders = await Order.deleteMany({ status: 'pending' });
  const deletedTrades = await Trade.deleteMany({});
  return res.json({
    ordersDeleted: deletedOrders.deletedCount,
    tradesDeleted: deletedTrades.deletedCount,
  });
}
