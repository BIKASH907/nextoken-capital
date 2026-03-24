// POST /api/user/set-role — Set user account type (investor/issuer)
import dbConnect from "../../../lib/db";
import User from "../../../lib/models/User";
import { getUserFromRequest } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const session = await getUserFromRequest(req);
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  const { accountType } = req.body;
  if (!["investor", "issuer"].includes(accountType)) {
    return res.status(400).json({ error: "Invalid account type" });
  }

  await dbConnect();
  await User.findByIdAndUpdate(session.userId || session.id, { accountType });

  return res.status(200).json({ success: true, accountType });
}
