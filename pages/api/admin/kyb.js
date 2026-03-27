import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '';
import User from 'models/User';
import KYB from 'models/KYB';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.isAdmin) return res.status(401).json({ error: 'Unauthorized' });

  await dbConnect();

  if (req.method === 'GET') {
    const { status } = req.query;
    const kybQuery = status && status !== 'all' ? { status } : {};
    
    let kybRecords = [];
    try {
      kybRecords = await KYB.find(kybQuery).populate('userId', 'name email country accountType').lean();
    } catch(e) {}

    // Auto-stub issuers with no KYB record
    const issuers = await User.find({ accountType: 'issuer' }).lean();
    const kybUserIds = kybRecords.map(k => k.userId?._id?.toString() || k.userId?.toString());
    const issuersWithoutKYB = issuers.filter(u => !kybUserIds.includes(u._id.toString()));

    for (const issuer of issuersWithoutKYB) {
      try {
        const stub = await KYB.create({
          userId: issuer._id,
          companyName: issuer.companyName || issuer.name || 'Unnamed Company',
          status: 'pending',
          submittedAt: issuer.createdAt || new Date(),
          autoCreated: true
        });
        if (!status || status === 'pending' || status === 'all') {
          kybRecords.push({ ...stub.toObject(), userId: issuer });
        }
      } catch(e) {}
    }

    const counts = {
      pending: await KYB.countDocuments({ status: 'pending' }).catch(() => 0),
      in_review: await KYB.countDocuments({ status: 'in_review' }).catch(() => 0),
      approved: await KYB.countDocuments({ status: 'approved' }).catch(() => 0),
      rejected: await KYB.countDocuments({ status: 'rejected' }).catch(() => 0),
    };

    return res.status(200).json({ kyb: kybRecords, counts });
  }

  if (req.method === 'PATCH') {
    const { id, status, notes } = req.body;
    const valid = ['pending', 'in_review', 'approved', 'rejected'];
    if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' });

    const kyb = await KYB.findByIdAndUpdate(
      id,
      { status, adminNotes: notes, reviewedAt: new Date() },
      { new: true }
    ).populate('userId', 'name email');

    if (status === 'approved' && kyb?.userId) {
      await User.findByIdAndUpdate(kyb.userId._id || kyb.userId, {
        kycStatus: 'approved', verificationStatus: 'approved'
      }).catch(() => {});
    }

    return res.status(200).json({ kyb });
  }

  return res.status(405).end();
}
