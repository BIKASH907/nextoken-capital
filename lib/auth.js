import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'nextoken-default-secret-change-in-production'
)

// Hash password
export async function hashPassword(password) {
  return bcrypt.hash(password, 12)
}

// Verify password
export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash)
}

// Create JWT token
export async function createToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

// Verify JWT token
export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch {
    return null
  }
}

// Get user from request cookies
export async function getUserFromRequest(req) {
  const token = req.cookies?.nxt_token
  if (!token) return null
  return verifyToken(token)
}

// Set auth cookie
export function setAuthCookie(res, token) {
  res.setHeader('Set-Cookie', [
    `nxt_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
  ])
}

// Clear auth cookie
export function clearAuthCookie(res) {
  res.setHeader('Set-Cookie', ['nxt_token=; Path=/; HttpOnly; Max-Age=0'])
}
