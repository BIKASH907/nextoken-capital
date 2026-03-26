import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import Notification from "../../../models/Notification";
import { getAuthUser } from "../../../lib/getUser";
export default async function handler(req, res) {
  await connectDB();
  const user = await getAuthUser(req, res);
  if (!user) return res.status(401).json({ error: "Please login" });
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
