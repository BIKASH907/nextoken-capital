// pages/api/auth/register.js
import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcryptjs";
import { createToken, setSessionCookie } from "../../../lib/session";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password, firstName, lastName, country, dob } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: "Missing required fields." });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters." });
  }

  try {
    const client = await clientPromise;
    const db = client.db("nextoken");
    const users = db.collection("users");

    // Check if email already exists
    const existing = await users.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const result = await users.insertOne({
      email:        email.toLowerCase(),
      password:     hashedPassword,
      firstName,
      lastName,
      country:      country || "",
      dob:          dob || "",
      kycStatus:    "pending",   // pending | submitted | approved | rejected
      kycProvider:  "sumsub",
      role:         "investor",
      createdAt:    new Date(),
      updatedAt:    new Date(),
      portfolio: {
        totalInvested: 0,
        totalValue:    0,
        totalReturn:   0,
      },
    });

    const userId = result.insertedId.toString();

    // Create JWT session
    const token = await createToken({
      userId,
      email: email.toLowerCase(),
      firstName,
      lastName,
      kycStatus: "pending",
      role: "investor",
    });

    setSessionCookie(res, token);

    return res.status(201).json({
      success: true,
      user: { userId, email: email.toLowerCase(), firstName, lastName, kycStatus: "pending" },
    });
  } catch (e) {
    console.error("Register error:", e);
    return res.status(500).json({ error: "Registration failed. Please try again." });
  }
}