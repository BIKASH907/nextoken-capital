import mongoose from "mongoose";

const IssuerDocumentSchema = new mongoose.Schema({
  issuerId: { type: String },
  issuerName: { type: String },
  issuerEmail: { type: String },
  assetId: { type: String },
  assetName: { type: String },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String },
  fileSize: { type: Number },
  category: { type: String, enum: ["kyc", "financial", "technical", "legal", "valuation", "other"], required: true },
  subType: { type: String },
  routedTo: { type: String, default: "compliance" },

  // Pipeline status
  status: {
    type: String,
    enum: ["pending", "compliance_approved", "finance_approved", "approved", "rejected_compliance", "rejected_finance", "rejected_final"],
    default: "pending",
  },

  // Stage approvals
  complianceApprovedBy: String,
  complianceApprovedByName: String,
  complianceApprovedAt: Date,
  complianceNotes: String,

  financeApprovedBy: String,
  financeApprovedByName: String,
  financeApprovedAt: Date,
  financeNotes: String,

  finalApprovedBy: String,
  finalApprovedByName: String,
  finalApprovedAt: Date,
  finalNotes: String,

  // Rejection
  rejectionReason: String,
  rejectedBy: String,
  rejectedByName: String,
  rejectedAt: Date,

  // Versioning
  version: { type: Number, default: 1 },
  versionHistory: [{
    version: Number, fileName: String, fileUrl: String, uploadedBy: String, uploadedAt: { type: Date, default: Date.now },
    status: String, notes: String,
  }],
  lockedVersion: { type: Number },
  isVersionLocked: { type: Boolean, default: false },

  // Audit
  auditLog: [{
    action: String,
    by: String,
    byRole: String,
    notes: String,
    at: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

export default mongoose.models.IssuerDocument || mongoose.model("IssuerDocument", IssuerDocumentSchema);
