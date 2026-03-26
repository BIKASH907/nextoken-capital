import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import Asset from "../../../lib/models/Asset";
import Investment from "../../../models/Investment";
import Order from "../../../models/Order";
import Wallet from "../../../models/Wallet";

export default async function handler(req, res) {
  await connectDB();
  const [users, assets, investments, orders] = await Promise.all([
    User.countDocuments(), Asset.countDocuments(), Investment.find().lean(), Order.find({ status:"completed" }).lean(),
  ]);

  const today = new Date(); today.setHours(0,0,0,0);
  const todayOrders = orders.filter(o => new Date(o.createdAt) >= today);
  const totalVolume = orders.reduce((s,o) => s + o.totalAmount, 0);
  const todayVolume = todayOrders.reduce((s,o) => s + o.totalAmount, 0);

  // Daily volumes (last 30 days)
  const dailyVolume = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0,0,0,0);
    const next = new Date(d); next.setDate(next.getDate() + 1);
    const vol = orders.filter(o => new Date(o.createdAt) >= d && new Date(o.createdAt) < next).reduce((s,o) => s + o.totalAmount, 0);
    dailyVolume.push({ date: d.toISOString().split("T")[0], volume: vol });
  }

  // Top assets
  const assetVolumes = {};
  orders.forEach(o => { assetVolumes[o.assetName] = (assetVolumes[o.assetName] || 0) + o.totalAmount; });
  const topAssets = Object.entries(assetVolumes).sort((a,b) => b[1]-a[1]).slice(0,5).map(([name,vol]) => ({ name, volume: vol }));

  return res.json({
    stats: { users, assets, totalInvestments: investments.length, totalOrders: orders.length, totalVolume, todayVolume, todayOrders: todayOrders.length },
    dailyVolume, topAssets,
  });
}
