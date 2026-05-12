// lib/adminAuth.js — middleware helper for admin API routes
import jwt from "jsonwebtoken";

function getSecret() {
  const s = process.env.JWT_SECRET;
  if (!s) {
    // Fail hard — never fall back to a hardcoded secret in production code paths.
    throw new Error("JWT_SECRET is not configured");
  }
  return s;
}

const ROLES = ["support", "finance", "compliance", "operations", "admin", "super_admin"];

/**
 * Verify admin JWT from an Authorization header.
 * Returns the decoded token payload on success, or null on failure.
 * Use this for inline checks; prefer `requireAdmin` wrapper for new routes.
 */
export async function verifyAdmin(req, requiredRole = null) {
  const auth = req.headers?.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  try {
    const decoded = jwt.verify(token, getSecret());
    if (requiredRole) {
      const userLevel = ROLES.indexOf(decoded.role);
      const requiredLevel = ROLES.indexOf(requiredRole);
      if (userLevel < requiredLevel) return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

export function requireAdmin(handler, requiredRole = null) {
  return async (req, res) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }
    const token = auth.split(" ")[1];
    try {
      const decoded = jwt.verify(token, getSecret());
      req.admin = decoded;

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
