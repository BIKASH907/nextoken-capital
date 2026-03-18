import { clearAuthCookie } from '../../../lib/auth'
import { ok } from '../../../lib/api'

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  clearAuthCookie(res)
  return ok(res, { message: 'Logged out successfully' })
}
