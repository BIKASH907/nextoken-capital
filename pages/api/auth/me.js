import jwt from "jsonwebtoken";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // 1. Verify the JWT from the HttpOnly cookie
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 2. Connect to the database
    const client = await clientPromise;
    const db = client.db("nextoken"); // Matches your login DB name

    // 3. Find user by ID (excluding the password for security)
    const user = await db.collection("users").findOne(
      { _id: new ObjectId(decoded.id) },
      { projection: { password: 0 } }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 4. Return user data (name, email, etc.) to the Dashboard
    return res.status(200).json(user);
    
  } catch (error) {
    console.error("ME API ERROR:", error);
    return res.status(401).json({
      message: "Session expired or invalid. Please log in again.",
    });
  }
}