import { connectDB } from '../../../../lib/mongodb';
import User from '../../../../lib/models/User';
import { requireAdmin } from '../../../../lib/adminAuth';
export default requireAdmin(async function handler(req, res) {
  await connectDB();
  const { uid } = req.query;
  if (req.method === 'PATCH') {
    try {
      const update = {};
      if (req.body.kycStatus) update.kycStatus = req.body.kycStatus;
      if (req.body.adminComment) update.kycAdminComment = req.body.adminComment;
      const user = await User.findByIdAndUpdate(uid, update, { new: true }).select('-password');
      if (!user) return res.status(404).json({ error: 'User not found' });
      return res.json({ success: true, user });
    } catch(e) { return res.status(500).json({ error: e.message }); }
  }
  res.status(405).end();
});
