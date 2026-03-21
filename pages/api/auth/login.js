import jwt from "jsonwebtoken";
import clientPromise from "../../../lib/mongodb"; // Using the MongoDB client we established
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("nextoken_capital");

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 1. Find user by email (case-insensitive)
    const user = await db.collection("users").findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 2. Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 4. Set HttpOnly Cookie for security
    const serializedCookie = `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax; ${
      process.env.NODE_ENV === "production" ? "Secure;" : ""
    }`;

    res.setHeader("Set-Cookie", serializedCookie);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name, // Matches your registration field
      },
    });
  } catch (error) {
    console.error("LOGIN API ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}