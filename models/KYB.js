import mongoose from 'mongoose';

const KYBSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String },
  registrationNumber: { type: String },
  incorporationCountry: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'in_review', 'approved', 'rejected'], 
    default: 'pending' 
  },
  documents: [{
    type: { type: String },
    url: { type: String },
    uploadedAt: { type: Date, default: Date.now }
  }],
  adminNotes: { type: String },
  reviewedAt: { type: Date },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  autoCreated: { type: Boolean, default: false },
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.KYB || mongoose.model('KYB', KYBSchema);
