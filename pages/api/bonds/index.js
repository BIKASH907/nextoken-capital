import { supabaseAdmin } from '../../../lib/supabase'
import { getUserFromRequest } from '../../../lib/auth'
import { ok, err, validate } from '../../../lib/api'

export default async function handler(req, res) {
  const db = supabaseAdmin()

  if (req.method === 'GET') {
    const { status = 'active', limit = 20, offset = 0 } = req.query
    const { data, error, count } = await db
      .from('bonds')
      .select('*', { count: 'exact' })
      .eq('status', status)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) return err(res, 'Failed to fetch bonds')
    return ok(res, { bonds: data, total: count })
  }

  if (req.method === 'POST') {
    const user = await getUserFromRequest(req)
    if (!user) return err(res, 'Authentication required', 401)

    const required = ['name', 'bond_type', 'total_issuance', 'face_value', 'coupon_rate', 'term_years', 'issuer_name']
    const missing = validate(req.body, required)
    if (missing) return err(res, `Missing: ${missing.join(', ')}`)

    const { data, error } = await db
      .from('bonds')
      .insert({
        issuer_id: user.userId,
        ...req.body,
        status: 'pending'
      })
      .select()
      .single()

    if (error) return err(res, 'Failed to create bond offering')
    return ok(res, { bond: data }, 201)
  }

  return err(res, 'Method not allowed', 405)
}
