
import bcrypt from "bcryptjs";
import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import { sendWelcomeEmail } from "../../../lib/email";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { firstName, lastName, email, password, accountType, country, phone, dob } = req.body;

  if (!firstName || !lastName || !email || !password || !accountType) {
    return res.status(400).json({ error: "All required fields must be filled." });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters." });
  }

  try {
    await connectDB();
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ error: "An account with this email already exists." });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
      firstName, lastName,
      email: email.toLowerCase(),
      password: hashed,
      accountType, country, phone, dob,
    });

    await sendWelcomeEmail({ email: user.email, firstName: user.firstName });

    return res.status(201).json({
      success: true,
      userId: user._id.toString(),
      message: "Account created successfully.",
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Registration failed. Please try again." });
  }
}
