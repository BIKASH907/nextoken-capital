import { supabaseAdmin } from '../../../lib/supabase'
import { getUserFromRequest } from '../../../lib/auth'
import { ok, err } from '../../../lib/api'

export default async function handler(req, res) {
  const user = await getUserFromRequest(req)
  if (!user) return err(res, 'Authentication required', 401)

  const db = supabaseAdmin()

  if (req.method === 'GET') {
    const { data: investments } = await db
      .from('investments')
      .select('*, assets(name, symbol, asset_type, token_price)')
      .eq('user_id', user.userId)
      .eq('status', 'active')
      .order('invested_at', { ascending: false })

    const { data: transactions } = await db
      .from('transactions')
      .select('*')
      .eq('user_id', user.userId)
      .order('created_at', { ascending: false })
      .limit(20)

    const { data: orders } = await db
      .from('orders')
      .select('*, assets(name, symbol)')
      .eq('user_id', user.userId)
      .in('status', ['open', 'partially_filled'])
      .order('created_at', { ascending: false })

    const totalValue = investments?.reduce((sum, inv) => sum + (inv.current_value || inv.amount_invested), 0) || 0
    const totalPnl = investments?.reduce((sum, inv) => sum + (inv.pnl || 0), 0) || 0

    return ok(res, {
      investments: investments || [],
      transactions: transactions || [],
      open_orders: orders || [],
      summary: {
        total_invested: totalValue,
        total_pnl: totalPnl,
        investment_count: investments?.length || 0
      }
    })
  }

  return err(res, 'Method not allowed', 405)
}
