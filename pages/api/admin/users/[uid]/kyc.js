import connectDB from "../../../../../lib/db";
import User from "../../../../../lib/models/User";

export default async function handler(req, res) {
  if (req.method !== "PATCH") return res.status(405).json({ error: "Method not allowed" });

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  // Verify admin token
  const jwt = require("jsonwebtoken");
  const SECRET = process.env.JWT_SECRET || "nextoken-capital-jwt-secret-2024";
  let admin;
  try { admin = jwt.verify(token, SECRET); } catch { return res.status(401).json({ error: "Invalid token" }); }

  await connectDB();

  const { uid } = req.query;
  const { kycStatus, adminComment } = req.body;

  if (!["none","pending","approved","rejected"].includes(kycStatus)) {
    return res.status(400).json({ error: "Invalid KYC status" });
  }

  const user = await User.findById(uid);
  if (!user) return res.status(404).json({ error: "User not found" });

  user.kycStatus = kycStatus;
  if (adminComment) {
    user.kycAdminComment = adminComment;
  }
  await user.save();

  return res.status(200).json({
    success: true,
    message: `KYC status updated to ${kycStatus}`,
    user: { _id: user._id, kycStatus: user.kycStatus },
  });
}
