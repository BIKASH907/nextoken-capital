import { requireAdmin } from "../../../lib/adminAuth";
import dbConnect from "../../../lib/db";
import Asset from "../../../lib/models/Asset";
import OrderBook from "../../../models/OrderBook";
import mongoose from "mongoose";

const BOT_USER_ID = "000000000000000000000001";

async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const db = mongoose.connection.db;
    const botOrders = await OrderBook.find({ userId: BOT_USER_ID, status: { $in: ["open","partial"] } }).lean();
    return res.json({ botOrders, count: botOrders.length });
  }

  if (req.method === "POST") {
    const { assetId, action, spread, levels, orderSize } = req.body;
    const SPREAD = spread || 0.03;
    const LEVELS = levels || 3;
    const SIZE = orderSize || 50;

    if (action === "start") {
      const asset = await Asset.findById(assetId);
      if (!asset) return res.status(404).json({ error: "Asset not found" });

      const basePrice = asset.lastTradedPrice || asset.tokenPrice || 100;

      // Cancel existing bot orders for this asset
      await OrderBook.updateMany({ userId: BOT_USER_ID, assetId, status: { $in: ["open","partial"] } }, { $set: { status: "cancelled" } });

      const orders = [];
      for (let i = 1; i <= LEVELS; i++) {
        const buyPrice = Math.round(basePrice * (1 - SPREAD * i) * 100) / 100;
        const sellPrice = Math.round(basePrice * (1 + SPREAD * i) * 100) / 100;

        orders.push({
          assetId, assetName: asset.name, side: "bid", userId: BOT_USER_ID,
          units: SIZE, remainingUnits: SIZE, pricePerUnit: buyPrice, totalAmount: buyPrice * SIZE,
          expiresAt: new Date(Date.now() + 24*60*60*1000),
        });
        orders.push({
          assetId, assetName: asset.name, side: "ask", userId: BOT_USER_ID,
          units: SIZE, remainingUnits: SIZE, pricePerUnit: sellPrice, totalAmount: sellPrice * SIZE,
          expiresAt: new Date(Date.now() + 24*60*60*1000),
        });
      }

      await OrderBook.insertMany(orders);
      return res.json({ success: true, message: "Market maker: " + orders.length + " orders placed", basePrice, spread: SPREAD });
    }

    if (action === "stop") {
      const result = await OrderBook.updateMany({ userId: BOT_USER_ID, assetId, status: { $in: ["open","partial"] } }, { $set: { status: "cancelled" } });
      return res.json({ success: true, message: "Cancelled " + result.modifiedCount + " bot orders" });
    }

    if (action === "stop_all") {
      const result = await OrderBook.updateMany({ userId: BOT_USER_ID, status: { $in: ["open","partial"] } }, { $set: { status: "cancelled" } });
      return res.json({ success: true, message: "Cancelled all " + result.modifiedCount + " bot orders" });
    }
  }
  return res.status(405).end();
}
export default requireAdmin(handler);
