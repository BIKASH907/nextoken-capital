// lib/session.js
// Real JWT session — stored in httpOnly cookie, not localStorage
// Usage: const user = await getSession(req)

import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "nextoken-capital-secret-change-in-production-2024"
);

export async function createToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch {
    return null;
  }
}

export function setSessionCookie(res, token) {
  res.setHeader("Set-Cookie", [
    `nxt_session=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`,
  ]);
}

export function clearSessionCookie(res) {
  res.setHeader("Set-Cookie", [
    "nxt_session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax",
  ]);
}

export async function getSession(req) {
  const cookie = req.cookies?.nxt_session;
  if (!cookie) return null;
  return await verifyToken(cookie);
}