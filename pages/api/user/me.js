// pages/api/user/me.js
import clientPromise from "../../../lib/mongodb";
const { getSession, clearSessionCookie } = require("../../../lib/session");
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    clearSessionCookie(res);
    return res.status(200).json({ success: true });
  }
  if (req.method !== "GET") return res.status(405).end();
  const session = getSession(req);
  if (!session) return res.status(401).json({ error: "Not authenticated." });
  try {
    const client = await clientPromise;
    if (!client) return res.status(500).json({ error: "Database connection failed." });
    const db = client.db("nextoken");
    const user = await db.collection("users").findOne(
      { _id: new ObjectId(session.userId) },
      { projection: { password: 0 } }
    );
    if (!user) return res.status(404).json({ error: "User not found." });
    return res.status(200).json({
      userId: user._id.toString(), email: user.email,
      firstName: user.firstName, lastName: user.lastName,
      country: user.country, countryCode: user.countryCode,
      phone: user.phone, kycStatus: user.kycStatus,
      role: user.role, portfolio: user.portfolio, createdAt: user.createdAt,
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}