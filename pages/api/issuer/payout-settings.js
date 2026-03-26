import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import IssuerPayout from "../../../models/IssuerPayout";
import { getAuthUser } from "../../../lib/getUser";

export default async function handler(req, res) {
  await connectDB();
  const user = await getAuthUser(req, res);
  if (!user) return res.status(401).json({ error: "Please login" });

  if (req.method === "GET") {
    const settings = await IssuerPayout.findOne({ userId: user._id }).lean();
    return res.json({ settings });
  }

  if (req.method === "POST") {
    const { payoutMethod, bankName, iban, bic, accountHolder, walletAddress, walletNetwork, paypalEmail } = req.body;
    if (!payoutMethod) return res.status(400).json({ error: "Payout method required" });

    const data = { userId: user._id, payoutMethod, bankName, iban, bic, accountHolder, walletAddress, walletNetwork: walletNetwork || "polygon", paypalEmail };
    const settings = await IssuerPayout.findOneAndUpdate({ userId: user._id }, data, { upsert: true, new: true });
    return res.json({ settings, message: "Payout settings saved" });
  }
  return res.status(405).end();
}
