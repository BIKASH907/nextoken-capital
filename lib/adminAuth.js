// lib/adminAuth.js — middleware helper for admin API routes
import jwt from "jsonwebtoken";

export function requireAdmin(handler, requiredRole = null) {
  return async (req, res) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }
    const token = auth.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.admin = decoded;

      // Role hierarchy
      const ROLES = ["support", "finance", "compliance", "operations", "admin", "super_admin"];
      if (requiredRole) {
        const userLevel = ROLES.indexOf(decoded.role);
        const requiredLevel = ROLES.indexOf(requiredRole);
        if (userLevel < requiredLevel) {
          return res.status(403).json({ error: `Requires ${requiredRole} role or higher` });
        }
      }
      return handler(req, res);
    } catch {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  };
}
