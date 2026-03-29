// pages/api/issuer/dashboard.js
import connectDB from "../../../lib/db";
import User from "../../../lib/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  await connectDB();
  const session = await getServerSession(req, res, authOptions);
  
  // DEBUG — remove after fixing
  console.log("ISSUER DEBUG session:", JSON.stringify(session));
  
  if (!session) return res.status(401).json({ error: "No session found" });

  const userId = session.id || session.sub || session.user?.id;
  console.log("ISSUER DEBUG userId:", userId, "email:", session.user?.email);
  
  let user = userId ? await User.findById(userId).catch(() => null) : null;
  console.log("ISSUER DEBUG findById result:", user ? "found" : "null");
  
  if (!user && session.user?.email) {
    user = await User.findOne({ email: session.user.email.toLowerCase() });
    console.log("ISSUER DEBUG findByEmail result:", user ? "found" : "null");
  }
  if (!user) return res.status(401).json({ error: "User not found", debug: { userId, email: session.user?.email } });