import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import { getAuthUser } from "../../../lib/getUser";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  await connectDB();
  const user = await getAuthUser(req, res);
  if (!user) return res.status(401).json({ error: "Not authenticated" });

  const { walletAddress, network } = req.body;
  if (!walletAddress) return res.status(400).json({ error: "Wallet address required" });

  // Validate address format
  if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
    return res.status(400).json({ error: "Invalid wallet address" });
  }

  // Check if address already used by another user
  const existing = await User.findOne({ walletAddress, _id: { $ne: user._id } });
  if (existing) return res.status(400).json({ error: "This wallet is already connected to another account" });

  user.walletAddress = walletAddress;
  user.walletNetwork = network || "polygon";
  user.walletConnectedAt = new Date();
  await user.save();

  return res.json({ success: true, walletAddress, message: "Wallet connected: " + walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4) });
}
