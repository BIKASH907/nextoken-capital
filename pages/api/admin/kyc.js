import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import { requireAdmin } from "../../../lib/adminAuth";
async function handler(req, res) {
  await connectDB();
  if (req.method === "GET") {
    const { status } = req.query;
    const filter = status && status !== "all" ? { kycStatus: status } : { kycStatus: { $in: ["pending","approved","rejected"] } };
    const users = await User.find(filter).select("-password").sort({ createdAt: -1 }).limit(200);
    return res.json({ users });
  }
  if (req.method === "PATCH") {
    const { userId, kycStatus, kycNotes } = req.body;
    if (!userId || !kycStatus) return res.status(400).json({ error: "Missing fields" });
    const user = await User.findByIdAndUpdate(userId, { kycStatus, kycNotes, kycReviewedAt: new Date() }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json({ user });
  }
  res.status(405).end();
}
export default requireAdmin(handler);
