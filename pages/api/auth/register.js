import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { name, email, password, accountType } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 8 characters",
      });
    }

    const client = await clientPromise;
    const db = client.db("nextoken");

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await db.collection("users").findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "This email is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = {
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      accountType: accountType || "individual",
      createdAt: new Date(),
    };

    console.log("REGISTER USER:", newUser);

    const result = await db.collection("users").insertOne(newUser);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId: result.insertedId,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Server error",
    });
  }
}