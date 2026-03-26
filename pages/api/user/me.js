import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import { getAuthUser } from "../../../lib/getUser";
const { clearSessionCookie } = require("../../../lib/session");

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    clearSessionCookie(res);
    return res.status(200).json({ success: true });
  }
  if (req.method !== "GET") return res.status(405).end();
  await connectDB();
  try {
    const user = await getAuthUser(req, res);
    if (!user) return res.status(401).json({ error: "Not authenticated" });
    return res.json({ user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, accountType: user.accountType, kycStatus: user.kycStatus, country: user.country, phone: user.phone, createdAt: user.createdAt } });
  } catch(e) {
    return res.status(401).json({ error: "Not authenticated" });
  }
}