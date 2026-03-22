
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import Investment from "../../../lib/models/Investment";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  await connectDB();
  const [totalUsers, kycPending, kycApproved, totalInvestments, investments] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ kycStatus: "pending"  }),
    User.countDocuments({ kycStatus: "approved" }),
    Investment.countDocuments({ status: "confirmed" }),
    Investment.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
  ]);
  const recentUsers = await User.find().sort({ createdAt: -1 }).limit(10).select("-password");
  return res.status(200).json({
    totalUsers,
    kycPending,
    kycApproved,
    totalInvestments,
    totalVolume: investments[0]?.total || 0,
    recentUsers,
  });
}
