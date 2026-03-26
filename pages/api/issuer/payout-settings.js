import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import IssuerPayout from "../../../models/IssuerPayout";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).json({ error: "Not authenticated" });
  const user = await User.findOne({ email: session.user.email });
  if (!user) return res.status(404).json({ error: "User not found" });

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
