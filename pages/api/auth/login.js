import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const client = await clientPromise;
    const db = client.db("nextoken");

    const normalizedEmail = email.trim().toLowerCase();

    const user = await db.collection("users").findOne({
      email: normalizedEmail,
    });

    console.log("FOUND USER:", user);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.password || typeof user.password !== "string") {
      console.error("LOGIN ERROR: Missing password hash", user);
      return res.status(500).json({ message: "User data invalid" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        name: user.name || "",
        email: user.email,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
}