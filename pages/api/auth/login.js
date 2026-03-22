// pages/api/auth/login.js
import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcryptjs";
import { createToken, setSessionCookie } from "../../../lib/session";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const client = await clientPromise;
    const db = client.db("nextoken");
    const user = await db.collection("users").findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ error: "No account found with this email." });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Incorrect password." });
    }

    // Create JWT session
    const token = await createToken({
      userId:    user._id.toString(),
      email:     user.email,
      firstName: user.firstName,
      lastName:  user.lastName,
      kycStatus: user.kycStatus,
      role:      user.role,
    });

    setSessionCookie(res, token);

    return res.status(200).json({
      success: true,
      user: {
        userId:    user._id.toString(),
        email:     user.email,
        firstName: user.firstName,
        lastName:  user.lastName,
        kycStatus: user.kycStatus,
        role:      user.role,
      },
    });
  } catch (e) {
    console.error("Login error:", e);
    return res.status(500).json({ error: "Login failed. Please try again." });
  }
}