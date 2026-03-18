import { supabaseAdmin } from '../../../lib/supabase'
import { getUserFromRequest, clearAuthCookie } from '../../../lib/auth'
import { ok, err } from '../../../lib/api'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const payload = await getUserFromRequest(req)
    if (!payload) return err(res, 'Not authenticated', 401)

    const db = supabaseAdmin()
    const { data: user } = await db
      .from('users')
      .select('id, email, first_name, last_name, account_type, kyc_status, balance_eur, wallet_address, created_at')
      .eq('id', payload.userId)
      .single()

    if (!user) return err(res, 'User not found', 404)
    return ok(res, { user })
  }

  return err(res, 'Method not allowed', 405)
}
