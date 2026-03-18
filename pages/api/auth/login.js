import { supabaseAdmin } from '../../../lib/supabase'
import { verifyPassword, createToken, setAuthCookie } from '../../../lib/auth'
import { ok, err, validate } from '../../../lib/api'

export default async function handler(req, res) {
  if (req.method !== 'POST') return err(res, 'Method not allowed', 405)

  const { email, password } = req.body
  const missing = validate(req.body, ['email', 'password'])
  if (missing) return err(res, 'Email and password are required')

  const db = supabaseAdmin()

  const { data: user } = await db
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase())
    .single()

  if (!user) return err(res, 'Invalid email or password', 401)
  if (!user.is_active) return err(res, 'Account has been deactivated. Contact support.', 403)

  const valid = await verifyPassword(password, user.password_hash)
  if (!valid) return err(res, 'Invalid email or password', 401)

  const token = await createToken({ userId: user.id, email: user.email })
  setAuthCookie(res, token)

  // Return user without sensitive fields
  const { password_hash, ...safeUser } = user
  return ok(res, { user: safeUser })
}
