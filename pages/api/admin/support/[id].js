import { connectDB } from '../../../../lib/mongodb';
import SupportTicket from '../../../../lib/models/SupportTicket';
import { requireAdmin } from '../../../../lib/adminAuth';
export default requireAdmin(async function handler(req, res) {
  if (req.method !== 'PATCH') return res.status(405).end();
  await connectDB();
  const { id } = req.query;
  try {
    const ticket = await SupportTicket.findByIdAndUpdate(id, { ...req.body, updatedAt: new Date() }, { new: true });
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    res.json({ success: true, ticket });
  } catch(e) { res.status(500).json({ error: e.message }); }
});
