import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema({
  action: { type: String, required: true, index: true },
  category: { type: String, enum: ["auth", "kyc", "transaction", "config", "user", "contract", "system"], index: true },
  adminId: { type: String, required: true, index: true },
  adminName: { type: String, required: true },
  adminRole: { type: String },
  targetType: { type: String },
  targetId: { type: String },
  details: { type: mongoose.Schema.Types.Mixed },
  ip: { type: String },
  userAgent: { type: String },
  country: { type: String },
  result: { type: String, enum: ["success", "failure", "blocked"], default: "success" },
  severity: { type: String, enum: ["low", "medium", "high", "critical"], default: "low" },
  hash: { type: String },
  previousHash: { type: String },
}, { timestamps: true });

AuditLogSchema.index({ createdAt: 1 });
AuditLogSchema.index({ adminId: 1, createdAt: -1 });

export default mongoose.models.AuditLog || mongoose.model("AuditLog", AuditLogSchema);
