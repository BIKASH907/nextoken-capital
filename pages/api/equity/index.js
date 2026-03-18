import { supabaseAdmin } from '../../../lib/supabase'
import { getUserFromRequest } from '../../../lib/auth'
import { ok, err, validate } from '../../../lib/api'

export default async function handler(req, res) {
  const db = supabaseAdmin()

  if (req.method === 'GET') {
    const { data, error } = await db
      .from('equity_offerings')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
    if (error) return err(res, 'Failed to fetch equity offerings')
    return ok(res, { equity: data })
  }

  if (req.method === 'POST') {
    const user = await getUserFromRequest(req)
    if (!user) return err(res, 'Authentication required', 401)
    const required = ['company_name', 'pre_money_valuation', 'equity_offered_pct', 'raise_target', 'token_price']
    const missing = validate(req.body, required)
    if (missing) return err(res, `Missing: ${missing.join(', ')}`)
    const { data, error } = await db
      .from('equity_offerings')
      .insert({ issuer_id: user.userId, ...req.body, status: 'pending' })
      .select().single()
    if (error) return err(res, 'Failed to submit IPO application')
    return ok(res, { equity: data }, 201)
  }

  return err(res, 'Method not allowed', 405)
}
