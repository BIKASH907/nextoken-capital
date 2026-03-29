// pages/api/admin/kyc/[id].js
import { connectDB } from "../../../../lib/mongodb";
import User from "../../../../lib/models/User";
import Employee from "../../../../lib/models/Employee";
import jwt from "jsonwebtoken";

async function verifyAdmin(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return null;
  try {
    const decoded = jwt.verify(auth.split(" ")[1], process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET);
    const emp = await Employee.findById(decoded.id || decoded.employeeId);
    if (!emp || !emp.isActive) return null;
    return emp;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  await connectDB();
  const admin = await verifyAdmin(req);
  if (!admin) return res.status(401).json({ error: "Unauthorized" });

  const { id } = req.query;

  // GET — fetch single user KYC details
  if (req.method === "GET") {
    try {
      const user = await User.findById(id).select("-password").lean();
      if (!user) return res.status(404).json({ error: "User not found" });
      return res.json({ user });
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch user" });
    }
  }

  // PUT — update KYC status
  if (req.method === "PUT") {
    try {
      const { kycStatus, comment } = req.body;
      if (!kycStatus) return res.status(400).json({ error: "kycStatus required" });

      const validStatuses = ["pending", "approved", "rejected", "under_review"];
      if (!validStatuses.includes(kycStatus)) {
        return res.status(400).json({ error: "Invalid KYC status" });
      }

      const update = {
        kycStatus,
        kycReviewedBy: admin._id,
        kycReviewedAt: new Date(),
      };
      if (comment) update.kycComment = comment;

      // If approving, also set verifiedAt
      if (kycStatus === "approved") {
        update.kycVerifiedAt = new Date();
      }

      const user = await User.findByIdAndUpdate(id, { $set: update }, { new: true }).select("-password");
      if (!user) return res.status(404).json({ error: "User not found" });

      return res.json({ success: true, message: `KYC ${kycStatus} successfully`, user });
    } catch (err) {
      console.error("KYC update error:", err);
      return res.status(500).json({ error: "Failed to update KYC status" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}