import { requireAdmin } from '../../../lib/adminAuth';
import dbConnect from '../../../lib/db';
import User from '../../../models/User';
import KYB from '../../../models/KYB';

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  await dbConnect();

  if (req.method === 'GET') {
    const { status } = req.query;
    const q = status && status !== 'all' ? { status } : {};
    let records = [];
    try { records = await KYB.find(q).populate('userId','name email country accountType').lean(); } catch(e) {}
    const issuers = await User.find({ accountType: 'issuer' }).lean().catch(() => []);
    const existing = records.map(k => k.userId?._id?.toString() || k.userId?.toString());
      try {
        const s = await KYB.create({ userId: u._id, companyName: u.name || 'Unnamed', status: 'pending', submittedAt: new Date() });
        records.push({ ...s.toObject(), userId: u });
      } catch(e) {}
    }
    return res.status(200).json({
      kyb: records,
      counts: {
        pending:   await KYB.countDocuments({ status: 'pending' }).catch(() => 0),
        in_review: await KYB.countDocuments({ status: 'in_review' }).catch(() => 0),
        approved:  await KYB.countDocuments({ status: 'approved' }).catch(() => 0),
        rejected:  await KYB.countDocuments({ status: 'rejected' }).catch(() => 0),
      }
    });
  }

  if (req.method === 'PATCH') {
    const { id, status, notes } = req.body;
    const kyb = await KYB.findByIdAndUpdate(id, { status, adminNotes: notes, reviewedAt: new Date() }, { new: true }).populate('userId','name email').catch(() => null);
    if (status === 'approved' && kyb && kyb.userId) {
      await User.findByIdAndUpdate(kyb.userId._id || kyb.userId, { kycStatus: 'approved', verificationStatus: 'approved' }).catch(() => {});
    }
    return res.status(200).json({ kyb });
  }

  return res.status(405).end();
}