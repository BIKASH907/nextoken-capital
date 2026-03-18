import { supabaseAdmin } from '../../../lib/supabase'
import { getUserFromRequest } from '../../../lib/auth'
import { ok, err, validate } from '../../../lib/api'

export default async function handler(req, res) {
  const db = supabaseAdmin()

  if (req.method === 'GET') {
    const { type, status = 'active', limit = 50 } = req.query
    let query = db
      .from('assets')
      .select('*')
      .eq('is_listed', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (type) query = query.eq('asset_type', type)
    if (status) query = query.eq('status', status)

    const { data, error } = await query
    if (error) return err(res, 'Failed to fetch assets')
    return ok(res, { assets: data })
  }

  if (req.method === 'POST') {
    const user = await getUserFromRequest(req)
    if (!user) return err(res, 'Authentication required', 401)

    const required = ['name', 'symbol', 'asset_type', 'total_value', 'token_supply', 'token_price']
    const missing = validate(req.body, required)
    if (missing) return err(res, `Missing: ${missing.join(', ')}`)

    const { data, error } = await db
      .from('assets')
      .insert({
        issuer_id: user.userId,
        ...req.body,
        status: 'pending',
        is_listed: false
      })
      .select()
      .single()

    if (error) return err(res, 'Failed to submit asset')
    return ok(res, { asset: data }, 201)
  }

  return err(res, 'Method not allowed', 405)
}
