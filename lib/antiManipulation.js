import mongoose from "mongoose";
import { notify } from "./notify";

export async function checkManipulation(userId, assetId, action, price, units) {
  const db = mongoose.connection.db;
  const alerts = [];

  // 1. Wash Trading: same user buying AND selling same asset within 5 min
  const recentTrades = await db.collection("trades").find({
    $or: [{ buyerId: userId }, { sellerId: userId }],
    assetId: new mongoose.Types.ObjectId(assetId),
    createdAt: { $gte: new Date(Date.now() - 5*60*1000) }
  }).toArray();

  const isBuyer = recentTrades.some(t => t.buyerId?.toString() === userId.toString());
  const isSeller = recentTrades.some(t => t.sellerId?.toString() === userId.toString());
  if (isBuyer && isSeller) {
    alerts.push({ type: "wash_trading", severity: "high", message: "User buying and selling same asset within 5 minutes" });
  }

  // 2. Spoofing: large order frequency (>5 orders placed+cancelled in 10 min)
  const recentOrders = await db.collection("orderbooks").find({
    userId: new mongoose.Types.ObjectId(userId), assetId: new mongoose.Types.ObjectId(assetId),
    createdAt: { $gte: new Date(Date.now() - 10*60*1000) }
  }).toArray();
  const cancelledRecent = recentOrders.filter(o => o.status === "cancelled");
  if (cancelledRecent.length >= 5) {
    alerts.push({ type: "spoofing", severity: "high", message: "Excessive order cancellations: " + cancelledRecent.length + " in 10 min" });
  }

  // 3. Price pump: if order price deviates >10% from last trade
  const lastTrade = await db.collection("trades").findOne({ assetId: new mongoose.Types.ObjectId(assetId) }, { sort: { createdAt: -1 } });
  if (lastTrade && price) {
    const deviation = Math.abs(price - lastTrade.pricePerUnit) / lastTrade.pricePerUnit;
    if (deviation > 0.10) {
      alerts.push({ type: "price_manipulation", severity: "medium", message: "Order price deviates " + Math.round(deviation*100) + "% from last trade" });
    }
  }

  // 4. Order frequency: >20 orders per minute
  const minuteOrders = await db.collection("orderbooks").countDocuments({
    userId: new mongoose.Types.ObjectId(userId),
    createdAt: { $gte: new Date(Date.now() - 60*1000) }
  });
  if (minuteOrders > 20) {
    alerts.push({ type: "order_frequency", severity: "medium", message: "Excessive order frequency: " + minuteOrders + "/min" });
  }

  // Store alerts
  for (const alert of alerts) {
    await db.collection("riskalerts").insertOne({
      userId: userId.toString(), assetId, ...alert,
      action, price, units, status: "open", createdAt: new Date(),
    });
  }

  return alerts;
}

// Circuit breaker: pause trading if price moves >20%
export async function checkCircuitBreaker(assetId) {
  const db = mongoose.connection.db;
  const trades = await db.collection("trades").find({
    assetId: new mongoose.Types.ObjectId(assetId),
    createdAt: { $gte: new Date(Date.now() - 60*1000) }
  }).sort({ createdAt: 1 }).toArray();

  if (trades.length < 2) return false;

  const firstPrice = trades[0].pricePerUnit;
  const lastPrice = trades[trades.length - 1].pricePerUnit;
  const change = Math.abs(lastPrice - firstPrice) / firstPrice;

  if (change > 0.20) {
    // Pause: cancel all open orders
    await db.collection("orderbooks").updateMany(
      { assetId: new mongoose.Types.ObjectId(assetId), status: { $in: ["open","partial"] } },
      { $set: { status: "halted" } }
    );
    await db.collection("riskalerts").insertOne({
      type: "circuit_breaker", severity: "critical", assetId,
      message: "Trading halted: " + Math.round(change*100) + "% price swing in 1 minute",
      status: "open", createdAt: new Date(),
    });
    return true;
  }
  return false;
}
