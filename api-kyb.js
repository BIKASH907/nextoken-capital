// pages/api/admin/kyb.js
import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import Asset from "../../../lib/models/Asset";
import Employee from "../../../lib/models/Employee";
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

  // GET — fetch all issuers (accountType: "issuer") with their assets
  if (req.method === "GET") {
    try {
      // Find all users who registered as issuers
      const issuers = await User.find({
        $or: [
          { accountType: "issuer" },
          { accountType: "corporate" },
          { role: "issuer" },
        ],
      })
        .select("-password")
        .sort({ createdAt: -1 })
        .lean();

      // Fetch assets for each issuer
      const enriched = await Promise.all(
        issuers.map(async (issuer) => {
          const assets = await Asset.find({
            $or: [
              { issuerId: issuer._id },
              { issuer: issuer._id },
              { createdBy: issuer._id },
              { userId: issuer._id },
            ],
          })
            .select("name ticker assetType targetRaise status tokenPrice createdAt")
            .lean();

          return {
            ...issuer,
            kybStatus: issuer.kybStatus || "pending",
            assets,
          };
        })
      );

      return res.json({ issuers: enriched });
    } catch (err) {
      console.error("KYB fetch error:", err);
      return res.status(500).json({ error: "Failed to fetch issuers" });
    }
  }

  // PUT — update KYB status
  if (req.method === "PUT") {
    try {
      const { userId, kybStatus, comment } = req.body;
      if (!userId || !kybStatus) {
        return res.status(400).json({ error: "userId and kybStatus required" });
      }

      const validStatuses = ["pending", "under_review", "approved", "rejected"];
      if (!validStatuses.includes(kybStatus)) {
        return res.status(400).json({ error: "Invalid KYB status" });
      }

      const update = {
        kybStatus,
        kybReviewedBy: admin._id,
        kybReviewedAt: new Date(),
      };
      if (comment) update.kybComment = comment;

      await User.findByIdAndUpdate(userId, { $set: update });

      return res.json({ success: true, message: `KYB ${kybStatus} successfully` });
    } catch (err) {
      console.error("KYB update error:", err);
      return res.status(500).json({ error: "Failed to update KYB status" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
