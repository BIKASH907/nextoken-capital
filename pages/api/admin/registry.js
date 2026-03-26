import { requireAdmin } from "../../../lib/adminAuth";
import dbConnect from "../../../lib/db";
import Investment from "../../../models/Investment";
import User from "../../../lib/models/User";
import Asset from "../../../lib/models/Asset";
async function handler(req, res) {
  await dbConnect();
  const investments = await Investment.find({ status: "active" }).lean();
  const userIds = [...new Set(investments.map(i => i.userId.toString()))];
  const users = await User.find({ _id: { $in: userIds } }).select("firstName lastName email country").lean();
  const userMap = {};
  users.forEach(u => { userMap[u._id.toString()] = u; });
  const registry = investments.map(i => ({ ...i, investor: userMap[i.userId.toString()] || {} }));
  const assets = await Asset.find().select("name assetType tokenSupply").lean();
  return res.json({ registry, totalInvestors: userIds.length, totalInvestments: investments.length, assets });
}
export default requireAdmin(handler);
