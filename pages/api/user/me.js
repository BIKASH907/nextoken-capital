// pages/api/user/me.js
// GET  — returns current logged-in user from JWT cookie
// DELETE — logs out (clears cookie)

import { getSession, clearSessionCookie } from "../../../lib/session";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    clearSessionCookie(res);
    return res.status(200).json({ success: true });
  }

  if (req.method !== "GET") return res.status(405).end();

  const session = await getSession(req);
  if (!session) return res.status(401).json({ error: "Not authenticated." });

  try {
    const client = await clientPromise;
    const db = client.db("nextoken");
    const user = await db.collection("users").findOne(
      { _id: new ObjectId(session.userId) },
      { projection: { password: 0 } }
    );
    if (!user) return res.status(404).json({ error: "User not found." });

    return res.status(200).json({
      userId:    user._id.toString(),
      email:     user.email,
      firstName: user.firstName,
      lastName:  user.lastName,
      country:   user.country,
      kycStatus: user.kycStatus,
      role:      user.role,
      portfolio: user.portfolio,
      createdAt: user.createdAt,
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}