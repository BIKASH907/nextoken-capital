import { supabaseAdmin } from '../../../lib/supabase'
import { getUserFromRequest } from '../../../lib/auth'
import { ok, err, validate, calculateFee } from '../../../lib/api'

export default async function handler(req, res) {
  const user = await getUserFromRequest(req)
  if (!user) return err(res, 'Authentication required', 401)

  const db = supabaseAdmin()

  if (req.method === 'GET') {
    const { status = 'open', limit = 50 } = req.query
    const { data, error } = await db
      .from('orders')
      .select('*, assets(name, symbol)')
      .eq('user_id', user.userId)
      .eq('status', status)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) return err(res, 'Failed to fetch orders')
    return ok(res, { orders: data })
  }

  if (req.method === 'POST') {
    const missing = validate(req.body, ['asset_id', 'order_type', 'price', 'quantity'])
    if (missing) return err(res, `Missing: ${missing.join(', ')}`)

    const { asset_id, order_type, order_kind = 'limit', price, quantity } = req.body

    // Check KYC
    const { data: userData } = await db
      .from('users')
      .select('kyc_status')
      .eq('id', user.userId)
      .single()

    if (userData?.kyc_status !== 'approved') {
      return err(res, 'KYC verification required to place orders. Please complete your KYC first.')
    }

    const total_value = parseFloat(price) * parseFloat(quantity)
    const fee = calculateFee(total_value)

    const { data: order, error } = await db
      .from('orders')
      .insert({
        user_id: user.userId,
        asset_id,
        order_type,
        order_kind,
        price: parseFloat(price),
        quantity: parseFloat(quantity),
        remaining_quantity: parseFloat(quantity),
        total_value,
        fee,
        status: 'open'
      })
      .select()
      .single()

    if (error) return err(res, 'Failed to place order')

    // Log transaction
    await db.from('transactions').insert({
      user_id: user.userId,
      transaction_type: order_type,
      amount: total_value,
      reference_id: order.id,
      description: `${order_type.toUpperCase()} order placed`,
      status: 'pending'
    })

    return ok(res, { order }, 201)
  }

  return err(res, 'Method not allowed', 405)
}
