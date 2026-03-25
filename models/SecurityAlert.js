import mongoose from "mongoose";

const SecurityAlertSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["brute_force", "new_device", "new_country", "bulk_action", "impossible_travel", "large_withdrawal", "suspicious_transaction", "contract_anomaly", "system_breach"],
    required: true,
    index: true,
  },
  severity: { type: String, enum: ["low", "medium", "high", "critical"], required: true, index: true },
  title: { type: String, required: true },
  description: { type: String },
  sourceIp: { type: String },
  userId: { type: String },
  userName: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed },
  status: { type: String, enum: ["active", "investigating", "resolved", "dismissed"], default: "active", index: true },
  resolvedBy: { type: String },
  resolvedAt: { type: Date },
  resolvedNote: { type: String },
}, { timestamps: true });

export default mongoose.models.SecurityAlert || mongoose.model("SecurityAlert", SecurityAlertSchema);
