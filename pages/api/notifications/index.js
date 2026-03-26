import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import Notification from "../../../models/Notification";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
export default async function handler(req, res) {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).json({ error: "Not authenticated" });
  const user = await User.findOne({ email: session.user.email });
  if (!user) return res.status(404).json({ error: "User not found" });
  if (req.method === "GET") {
    const notifications = await Notification.find({ userId: user._id }).sort({ createdAt: -1 }).limit(50).lean();
    const unread = await Notification.countDocuments({ userId: user._id, read: false });
    return res.json({ notifications, unread });
  }
  if (req.method === "POST" && req.body.action === "mark_read") {
    if (req.body.id) await Notification.findByIdAndUpdate(req.body.id, { read: true });
    else await Notification.updateMany({ userId: user._id, read: false }, { read: true });
    return res.json({ success: true });
  }
  return res.status(405).json({ error: "Method not allowed" });
}
