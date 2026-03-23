import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
const { getSession, clearSessionCookie } = require("../../../lib/session");
export default async function handler(req, res) {
  if (req.method === "DELETE") {
    clearSessionCookie(res);
    return res.status(200).json({ success: true });
  }
  if (req.method !== "GET") return res.status(405).end();
  await connectDB();
  try {
    let userId = null;
    const customSession = getSession(req);
    if (customSession) {
      userId = customSession.userId;
    } else {
      const nextAuthSession = await getServerSession(req, res, authOptions);
      if (nextAuthSession?.user?.id) userId = nextAuthSession.user.id;
      else if (nextAuthSession?.user?.email) {
        const userByEmail = await User.findOne({ email: nextAuthSession.user.email }).select("-password");
        if (!userByEmail) return res.status(404).json({ error: "User not found." });
        return res.status(200).json({
          userId: userByEmail._id.toString(), email: userByEmail.email,
          firstName: userByEmail.firstName, lastName: userByEmail.lastName,
          country: userByEmail.country, kycStatus: userByEmail.kycStatus,
          role: userByEmail.role, createdAt: userByEmail.createdAt,
        });
      }
    }
    if (!userId) return res.status(401).json({ error: "Not authenticated." });
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found." });
    return res.status(200).json({
      userId: user._id.toString(), email: user.email,
      firstName: user.firstName, lastName: user.lastName,
      country: user.country, kycStatus: user.kycStatus,
      role: user.role, createdAt: user.createdAt,
    });
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
