import { supabaseAdmin } from '../../../lib/supabase'
import { getUserFromRequest } from '../../../lib/auth'
import { ok, err, validate } from '../../../lib/api'

export default async function handler(req, res) {
  const user = await getUserFromRequest(req)
  if (!user) return err(res, 'Authentication required', 401)

  const db = supabaseAdmin()

  if (req.method === 'GET') {
    const { data } = await db
      .from('kyc_documents')
      .select('*')
      .eq('user_id', user.userId)
      .single()
    return ok(res, { kyc: data })
  }

  if (req.method === 'POST') {
    const required = ['full_name', 'date_of_birth', 'nationality', 'tax_id', 'investor_type', 'source_of_funds']
    const missing = validate(req.body, required)
    if (missing) return err(res, `Missing: ${missing.join(', ')}`)

    // Check if already submitted
    const { data: existing } = await db
      .from('kyc_documents')
      .select('id, status')
      .eq('user_id', user.userId)
      .single()

    if (existing?.status === 'approved') return err(res, 'KYC already approved')

    const { data, error } = await db
      .from('kyc_documents')
      .upsert({
        user_id: user.userId,
        ...req.body,
        status: 'submitted'
      })
      .select()
      .single()

    if (error) return err(res, 'Failed to submit KYC')

    // Update user kyc_status
    await db.from('users')
      .update({ kyc_status: 'submitted', kyc_submitted_at: new Date().toISOString() })
      .eq('id', user.userId)

    return ok(res, { kyc: data, message: 'KYC submitted successfully. Review takes 1–2 business days.' })
  }

  return err(res, 'Method not allowed', 405)
}
