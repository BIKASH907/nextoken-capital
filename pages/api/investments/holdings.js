import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import HoldingLot from "../../../models/HoldingLot";
import { getAuthUser } from "../../../lib/getUser";

export default async function handler(req, res) {
  await connectDB();
  const user = await getAuthUser(req, res);
  if (!user) return res.status(401).json({ error: "Please login" });

  const lots = await HoldingLot.find({ userId: user._id, remainingUnits: { $gt: 0 } }).sort({ purchaseDate: 1 }).lean();
  const holdings = {};

  lots.forEach(lot => {
    const key = lot.assetId.toString();
    if (!holdings[key]) holdings[key] = { assetName: lot.assetName, assetId: key, totalUnits: 0, eligibleUnits: 0, ineligibleUnits: 0, lots: [] };
    const days = Math.floor((Date.now() - new Date(lot.purchaseDate).getTime()) / (86400000));
    const eligible = days >= 30;
    holdings[key].totalUnits += lot.remainingUnits;
    if (eligible) holdings[key].eligibleUnits += lot.remainingUnits;
    else holdings[key].ineligibleUnits += lot.remainingUnits;
    holdings[key].lots.push({ units: lot.remainingUnits, purchaseDate: lot.purchaseDate, days, eligible, daysRemaining: eligible ? 0 : 30 - days, source: lot.source });
  });

  return res.json({ holdings: Object.values(holdings) });
}
