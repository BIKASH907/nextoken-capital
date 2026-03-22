// lib/session.js — uses jsonwebtoken (already in most Next.js projects)
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "nextoken-capital-jwt-secret-2024";

function createToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

function setSessionCookie(res, token) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader("Set-Cookie", [
    `nxt_session=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 3600}; SameSite=Lax${secure}`,
  ]);
}

function clearSessionCookie(res) {
  res.setHeader("Set-Cookie", ["nxt_session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax"]);
}

function getSession(req) {
  const cookie = req.cookies?.nxt_session;
  if (!cookie) return null;
  return verifyToken(cookie);
}

module.exports = { createToken, verifyToken, setSessionCookie, clearSessionCookie, getSession };