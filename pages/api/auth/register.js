import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { name, email, password, accountType } = req.body;

    // 1. Validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, error: "Password must be at least 8 characters" });
    }

    // 2. Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("nextoken_capital");

    // 3. Check for existing user
    const existingUser = await db.collection("users").findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, error: "This email is already registered" });
    }

    // 4. Secure the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 5. Create the real user document
    const newUser = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      accountType: accountType || "individual",
      createdAt: new Date(),
    };

    // 6. Save to DB
    const result = await db.collection("users").insertOne(newUser);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId: result.insertedId,
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}
