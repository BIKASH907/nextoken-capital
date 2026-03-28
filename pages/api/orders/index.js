import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import connectDB from '../../../lib/db';
import Order from '../../../models/Order';
import Trade from '../../../models/Trade';
import Asset from '../../../lib/models/Asset';
import User from '../../../lib/models/User';
import Investment from '../../../lib/models/Investment';

export default async function handler(req, res) {
  await connectDB();

  // GET - fetch orders for order book
  if (req.method === 'GET') {
    const { assetId, status } = req.query;
    const filter = {};
    if (assetId) filter.assetId = assetId;
    if (status === 'open') filter.status = 'pending';
    const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(50).lean();
    // Map fields for exchange UI
    const mapped = orders.map(o => ({
      ...o,
      side: o.type,
      price: o.pricePerUnit,
      units: o.units,
    }));
    return res.json({ orders: mapped });
  }

  // POST - place new order
  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ error: 'Please log in to place orders' });

    const userId = session.id || session.sub || session.user?.id;
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ error: 'User not found' });

    const { assetId, side, type, price, units } = req.body;
    if (!assetId || !side || !units || units <= 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const asset = await Asset.findById(assetId);
    if (!asset) return res.status(404).json({ error: 'Asset not found' });

    const orderPrice = price || asset.tokenPrice;
    const totalAmount = orderPrice * units;
    const fee = totalAmount * 0.005;

    // If selling, check user has enough tokens
    if (side === 'sell') {
      const investments = await Investment.find({ userId: user._id, assetId, status: { $in: ['confirmed', 'active'] } });
      const totalTokens = investments.reduce((s, i) => s + (i.tokens || 0), 0);
      const existingSellOrders = await Order.find({ userId: user._id, assetId, type: 'sell', status: 'pending' });
      const pendingSellUnits = existingSellOrders.reduce((s, o) => s + o.units, 0);
      if (units > totalTokens - pendingSellUnits) {
        return res.status(400).json({ error: 'Not enough tokens. You have ' + (totalTokens - pendingSellUnits) + ' available.' });
      }
    }

    const order = await Order.create({
      userId: user._id,
      assetId: asset._id,
      assetName: asset.name,
      type: side,
      units,
      pricePerUnit: orderPrice,
      totalAmount,
      fee,
      status: 'pending',
      [side === 'buy' ? 'buyerId' : 'sellerId']: user._id,
    });

    // Try to match orders
    await matchOrders(asset._id, asset.name);

    return res.json({ success: true, order, message: 'Order placed successfully' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

async function matchOrders(assetId, assetName) {
  const buys = await Order.find({ assetId, type: 'buy', status: 'pending' }).sort({ pricePerUnit: -1 });
  const sells = await Order.find({ assetId, type: 'sell', status: 'pending' }).sort({ pricePerUnit: 1 });

  for (const buy of buys) {
    for (const sell of sells) {
      if (buy.pricePerUnit >= sell.pricePerUnit && buy.status === 'pending' && sell.status === 'pending') {
        const matchUnits = Math.min(buy.units, sell.units);
        const matchPrice = sell.pricePerUnit;
        const totalAmount = matchPrice * matchUnits;

        // Create trade record
        await Trade.create({
          assetId, assetName,
          buyerId: buy.userId, sellerId: sell.userId,
          buyOrderId: buy._id, sellOrderId: sell._id,
          units: matchUnits, pricePerUnit: matchPrice, totalAmount,
          buyerFee: totalAmount * 0.005, sellerFee: totalAmount * 0.005,
          matchType: 'auto',
        });

        // Deduct tokens from seller's investment
        let remaining = matchUnits;
        const sellerInvestments = await Investment.find({
          userId: sell.userId, assetId, status: { $in: ['confirmed', 'active'] }
        }).sort({ createdAt: 1 });

        for (const inv of sellerInvestments) {
          if (remaining <= 0) break;
          const deduct = Math.min(inv.tokens, remaining);
          inv.tokens -= deduct;
          inv.amount = inv.tokens * (inv.tokenPrice || matchPrice);
          if (inv.tokens <= 0) inv.status = 'sold';
          await inv.save();
          remaining -= deduct;
        }

        // Create investment for buyer
        const asset = await Asset.findById(assetId);
        await Investment.create({
          userId: buy.userId,
          assetId, assetName,
          assetType: asset?.assetType || 'unknown',
          amount: totalAmount,
          tokens: matchUnits,
          tokenPrice: matchPrice,
          expectedROI: asset?.targetROI || 0,
          status: 'confirmed',
          paymentMethod: 'exchange',
          paymentTxHash: 'exchange-' + Date.now(),
          chainId: 137,
        });

        // Update order statuses
        if (matchUnits >= buy.units) buy.status = 'completed';
        else buy.units -= matchUnits;
        await buy.save();

        if (matchUnits >= sell.units) sell.status = 'completed';
        else sell.units -= matchUnits;
        await sell.save();
      }
    }
  }
}
