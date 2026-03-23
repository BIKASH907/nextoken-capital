// pages/api/admin/users/index.js
import { connectDB } from "../../../../lib/mongodb";
import User from "../../../../lib/models/User";
import { requireAdmin } from "../../../../lib/adminAuth";

async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const { kyc, page = 1, limit = 50, search } = req.query;
    const filter = {};
    if (kyc) filter.kycStatus = kyc;
    if (search) filter.$or = [
      { email: { $regex: search, $options: "i" } },
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
    ];
    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await User.countDocuments(filter);
    return res.status(200).json({ users, total });
  }

  return res.status(405).end();
}

export default requireAdmin(handler, "support");
