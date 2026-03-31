import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import Wallet from "../../../models/Wallet";
import Investment from "../../../models/Investment";
import { getAuthUser } from "../../../lib/getUser";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  await connectDB();
  const user = await getAuthUser(req, res);
  if (!user) return res.status(401).json({ error: "Not authenticated" });
  const { action, confirmation } = req.body;

  if (action === "export") {
    const wallet = await Wallet.findOne({ userId: user._id }).lean();
    const investments = await Investment.find({ userId: user._id }).lean();
    const userData = {
      profile: { firstName: user.firstName, lastName: user.lastName, email: user.email, country: user.country, createdAt: user.createdAt },
      wallet: wallet ? { balance: wallet.availableBalance, transactions: wallet.transactions } : null,
      investments: investments.map(i => ({ asset: i.assetName, units: i.units, invested: i.totalInvested, status: i.status })),
      exportedAt: new Date().toISOString(),
    };
    return res.json({ data: userData, message: "Your data export is ready" });
  }

  if (action === "delete") {
    if (confirmation !== "DELETE MY ACCOUNT") return res.status(400).json({ error: "Type DELETE MY ACCOUNT to confirm" });
    const investments = await Investment.find({ userId: user._id, status: "active" });
    if (investments.length > 0) return res.status(400).json({ error: "Cannot delete account with active investments. Sell or close positions first." });
    const wallet = await Wallet.findOne({ userId: user._id });
    if (wallet && wallet.availableBalance > 0) return res.status(400).json({ error: "Withdraw your balance (EUR " + wallet.availableBalance.toFixed(2) + ") before deleting" });
    await User.findByIdAndUpdate(user._id, { $set: { email: "deleted_" + user._id + "@deleted.com", firstName: "Deleted", lastName: "User", phone: null, dateOfBirth: null, kycDocuments: [], isDeleted: true, deletedAt: new Date() } });
    return res.json({ success: true, message: "Account data anonymized. You will be logged out." });
  }

  return res.status(400).json({ error: "Action: export or delete" });
}