import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import KYB from '@/models/KYB';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.isAdmin) return res.status(401).json({ error: 'Unauthorized' });

  await dbConnect();

  if (req.method === 'GET') {
    const { status } = req.query;

    // Get all KYB records
    const kybQuery = status && status !== 'all' ? { status } : {};
    let kybRecords = await KYB.find(kybQuery).populate('userId', 'name email country accountType').lean();

    // Also find issuers who have NO KYB record yet - auto-create stubs
    const issuers = await User.find({ accountType: 'issuer' }).lean();
    const kybUserIds = kybRecords.map(k => k.userId?._id?.toString() || k.userId?.toString());
    
    const issuersWithoutKYB = issuers.filter(u => !kybUserIds.includes(u._id.toString()));
    
    // Auto-create KYB stubs for issuers who don't have one
    for (const issuer of issuersWithoutKYB) {
      const stub = await KYB.create({
        userId: issuer._id,
        companyName: issuer.companyName || issuer.name || 'Unnamed Company',
        status: 'pending',
        submittedAt: issuer.createdAt || new Date(),
        documents: [],
        autoCreated: true
      });
      if (!status || status === 'pending' || status === 'all') {
        kybRecords.push({ ...stub.toObject(), userId: issuer });
      }
    }

    return res.status(200).json({ 
      kyb: kybRecords,
      counts: {
        pending: await KYB.countDocuments({ status: 'pending' }),
        in_review: await KYB.countDocuments({ status: 'in_review' }),
        approved: await KYB.countDocuments({ status: 'approved' }),
        rejected: await KYB.countDocuments({ status: 'rejected' }),
        total: await KYB.countDocuments()
      }
    });
  }

  if (req.method === 'PATCH') {
    const { id, status, notes } = req.body;
    const valid = ['pending', 'in_review', 'approved', 'rejected'];
    if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' });

    const kyb = await KYB.findByIdAndUpdate(
      id,
      { status, adminNotes: notes, reviewedAt: new Date(), reviewedBy: session.user.id },
      { new: true }
    ).populate('userId', 'name email');

    // If approved, update user KYC status
    if (status === 'approved' && kyb?.userId) {
      await User.findByIdAndUpdate(kyb.userId._id || kyb.userId, { 
        kycStatus: 'approved',
        verificationStatus: 'approved'
      });
    }

    return res.status(200).json({ kyb });
  }

  return res.status(405).end();
}
