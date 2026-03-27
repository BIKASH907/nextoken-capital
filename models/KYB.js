import mongoose from 'mongoose';

const KYBSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String },
  status: { type: String, enum: ['pending', 'in_review', 'approved', 'rejected'], default: 'pending' },
  documents: [{ type: { type: String }, url: String }],
  adminNotes: { type: String },
  reviewedAt: { type: Date },
  autoCreated: { type: Boolean, default: false },
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.KYB || mongoose.model('KYB', KYBSchema);
