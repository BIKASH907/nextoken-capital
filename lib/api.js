import { getUserFromRequest } from './auth'

// Standard API response helpers
export function ok(res, data = {}, status = 200) {
  return res.status(status).json({ success: true, ...data })
}

export function err(res, message, status = 400) {
  return res.status(status).json({ success: false, error: message })
}

// Require authentication middleware
export async function requireAuth(req, res) {
  const user = await getUserFromRequest(req)
  if (!user) {
    err(res, 'Authentication required', 401)
    return null
  }
  return user
}

// Validate required fields
export function validate(body, fields) {
  const missing = fields.filter(f => !body[f])
  return missing.length ? missing : null
}

// Format currency
export function formatCurrency(amount, currency = 'EUR') {
  return new Intl.NumberFormat('en-EU', {
    style: 'currency', currency, minimumFractionDigits: 2
  }).format(amount)
}

// Calculate fee
export const TRADING_FEE = 0.002 // 0.2%
export function calculateFee(amount) {
  return parseFloat((amount * TRADING_FEE).toFixed(2))
}
