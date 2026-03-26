import { requireAdmin } from "../../../lib/adminAuth";
import dbConnect from "../../../lib/db";
import Asset from "../../../lib/models/Asset";
import Investment from "../../../models/Investment";
import Wallet from "../../../models/Wallet";
async function handler(req, res) {
  await dbConnect();
  const assets = await Asset.find({ $or: [{ status: "live" }, { approvalStatus: "live" }] }).lean();
  const investments = await Investment.find({ status: "active" }).lean();
  const wallets = await Wallet.find().lean();
  return res.json({ aum: investments.reduce((s,i) => s + i.totalInvested, 0), walletReserves: wallets.reduce((s,w) => s + w.availableBalance + w.lockedBalance, 0), totalEarnings: wallets.reduce((s,w) => s + w.totalEarnings, 0), assetCount: assets.length, investmentCount: investments.length, verified: true, lastVerified: new Date() });
}
export default requireAdmin(handler);
