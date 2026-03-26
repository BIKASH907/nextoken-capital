import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema({
  // WHO
  adminId: { type: String, required: true },
  adminName: { type: String, default: "System" },
  adminEmail: { type: String },
  adminRole: { type: String, default: "system" },

  // WHAT
  action: { type: String, required: true, index: true },
  category: { type: String, default: "system", index: true },

  // TARGET
  targetType: { type: String },
  targetId: { type: String },
  targetName: { type: String },

  // STATUS CHANGE
  statusBefore: { type: String },
  statusAfter: { type: String },

  // DETAILS
  details: { type: mongoose.Schema.Types.Mixed },
  comment: { type: String },
  result: { type: String, enum: ["success", "failure", "blocked"], default: "success" },
  severity: { type: String, enum: ["low", "medium", "high", "critical"], default: "low", index: true },

  // WHERE (IP + Location)
  ip: { type: String, default: "unknown" },
  country: { type: String, default: "Unknown" },
  city: { type: String, default: "Unknown" },
  countryCode: { type: String },

  // DEVICE
  userAgent: { type: String },
  browser: { type: String },
  os: { type: String },
  device: { type: String },

  // INTEGRITY (SHA-256 hash chain)
  previousHash: { type: String },
  hash: { type: String, index: true },
}, {
  timestamps: true,
  // IMMUTABLE: No updates or deletes allowed
  strict: true,
});

// Block any update operations
AuditLogSchema.pre("updateOne", function() { throw new Error("Audit logs are immutable"); });
AuditLogSchema.pre("updateMany", function() { throw new Error("Audit logs are immutable"); });
AuditLogSchema.pre("findOneAndUpdate", function() { throw new Error("Audit logs are immutable"); });
AuditLogSchema.pre("findOneAndDelete", function() { throw new Error("Audit logs are immutable"); });
AuditLogSchema.pre("deleteOne", function() { throw new Error("Audit logs are immutable"); });
AuditLogSchema.pre("deleteMany", function() { throw new Error("Audit logs are immutable"); });

export default mongoose.models.AuditLog || mongoose.model("AuditLog", AuditLogSchema);
