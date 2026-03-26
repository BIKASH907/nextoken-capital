import mongoose from "mongoose";

const IssuerDocumentSchema = new mongoose.Schema({
  issuerId: { type: String, required: true },
  issuerName: { type: String },
  issuerEmail: { type: String },
  assetId: { type: String },
  assetName: { type: String },

  // Document info
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String },
  fileSize: { type: Number },

  // Category determines routing
  category: {
    type: String,
    enum: ["kyc", "financial", "technical", "legal", "valuation", "other"],
    required: true,
  },

  // Sub-type for specifics
  subType: { type: String },

  // Routing
  routedTo: {
    type: String,
    enum: ["compliance", "finance", "admin", "unassigned"],
    default: "unassigned",
  },

  // Review status
  status: {
    type: String,
    enum: ["pending", "under_review", "approved", "rejected", "expired"],
    default: "pending",
  },
  reviewedBy: { type: String },
  reviewedByName: { type: String },
  reviewedAt: { type: Date },
  reviewNotes: { type: String },
  rejectionReason: { type: String },

  // Versioning
  version: { type: Number, default: 1 },
  previousVersionId: { type: String },

  // Expiry
  expiresAt: { type: Date },

  // Audit
  uploadedAt: { type: Date, default: Date.now },
  auditLog: [{
    action: String,
    by: String,
    byRole: String,
    at: { type: Date, default: Date.now },
    notes: String,
  }],
}, { timestamps: true });

export default mongoose.models.IssuerDocument || mongoose.model("IssuerDocument", IssuerDocumentSchema);
