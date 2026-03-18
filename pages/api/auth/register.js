import { supabaseAdmin } from '../../../lib/supabase'
import { hashPassword, createToken, setAuthCookie } from '../../../lib/auth'
import { ok, err, validate } from '../../../lib/api'

export default async function handler(req, res) {
  if (req.method !== 'POST') return err(res, 'Method not allowed', 405)

  const { first_name, last_name, email, password, account_type } = req.body

  const missing = validate(req.body, ['first_name', 'last_name', 'email', 'password'])
  if (missing) return err(res, `Missing fields: ${missing.join(', ')}`)

  if (password.length < 8) return err(res, 'Password must be at least 8 characters')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return err(res, 'Invalid email address')

  const db = supabaseAdmin()

  // Check email exists
  const { data: existing } = await db
    .from('users')
    .select('id')
    .eq('email', email.toLowerCase())
    .single()

  if (existing) return err(res, 'An account with this email already exists')

  // Hash password
  const password_hash = await hashPassword(password)

  // Create user
  const { data: user, error } = await db
    .from('users')
    .insert({
      email: email.toLowerCase(),
      first_name,
      last_name,
      password_hash,
      account_type: account_type || 'investor'
    })
    .select('id, email, first_name, last_name, account_type, kyc_status, balance_eur, created_at')
    .single()

  if (error) {
    console.error('Register error:', error)
    return err(res, 'Registration failed. Please try again.')
  }

  // Create JWT
  const token = await createToken({ userId: user.id, email: user.email })
  setAuthCookie(res, token)

  return ok(res, { user }, 201)
}
