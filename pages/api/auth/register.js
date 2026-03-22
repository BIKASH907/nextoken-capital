// pages/api/auth/register.js
import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcryptjs";
const { createToken, setSessionCookie } = require("../../../lib/session");

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { email, password, firstName, lastName, country, countryCode, phone, dob } = req.body;
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: "Missing required fields." });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters." });
  }
  try {
    const client = await clientPromise;
    if (!client) return res.status(500).json({ error: "Database connection failed. Please try again." });
    const db = client.db("nextoken");
    const existing = await db.collection("users").findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ error: "An account with this email already exists." });
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await db.collection("users").insertOne({
      email: email.toLowerCase(), password: hashedPassword,
      firstName, lastName, country: country || "", countryCode: countryCode || "",
      phone: phone || "", dob: dob || "",
      kycStatus: "pending", kycProvider: "sumsub",
      role: "investor", createdAt: new Date(), updatedAt: new Date(),
      portfolio: { totalInvested: 0, totalValue: 0, totalReturn: 0 },
    });
    const userId = result.insertedId.toString();
    const token = createToken({ userId, email: email.toLowerCase(), firstName, lastName, kycStatus: "pending", role: "investor" });
    setSessionCookie(res, token);
    return res.status(201).json({ success: true, user: { userId, email: email.toLowerCase(), firstName, lastName, kycStatus: "pending" } });
  } catch (e) {
    console.error("Register error:", e);
    return res.status(500).json({ error: "Registration failed: " + e.message });
  }
}