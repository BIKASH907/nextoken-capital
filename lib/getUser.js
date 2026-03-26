import { connectDB } from "./mongodb";
import User from "./models/User";
import { getServerSession } from "next-auth/next";

export async function getAuthUser(req, res) {
  await connectDB();
  try {
    const { authOptions } = await import("../pages/api/auth/[...nextauth]");
    const session = await getServerSession(req, res, authOptions);
    if (session?.user?.email) {
      const user = await User.findOne({ email: session.user.email });
      if (user) return user;
    }
  } catch(e) {}
  try {
    const cookie = req.cookies?.nxt_session;
    if (cookie) {
      const jwt = require("jsonwebtoken");
      const decoded = jwt.verify(cookie, process.env.JWT_SECRET || "nextoken-capital-jwt-secret-2024");
      if (decoded?.email) { const user = await User.findOne({ email: decoded.email }); if (user) return user; }
      if (decoded?.id) { const user = await User.findById(decoded.id); if (user) return user; }
    }
  } catch(e) {}
  try {
    const auth = req.headers.authorization;
    if (auth?.startsWith("Bearer ")) {
      const jwt = require("jsonwebtoken");
      const decoded = jwt.verify(auth.slice(7), process.env.JWT_SECRET || "nextoken-capital-jwt-secret-2024");
      if (decoded?.email) { const user = await User.findOne({ email: decoded.email }); if (user) return user; }
      if (decoded?.id) { const user = await User.findById(decoded.id); if (user) return user; }
    }
  } catch(e) {}
  return null;
}
