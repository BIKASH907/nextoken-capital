import mongoose from "mongoose";
const RiskAlertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: { type: String, enum: ["velocity","large_transaction","new_device","new_country","sanctions_hit","unusual_pattern","failed_attempts","dormant_reactivation"], required: true },
  severity: { type: String, enum: ["low","medium","high","critical"], default: "medium" },
  title: String, description: String,
  metadata: mongoose.Schema.Types.Mixed,
  status: { type: String, enum: ["open","investigating","resolved","false_positive"], default: "open" },
  resolvedBy: String, resolvedAt: Date, resolvedNote: String,
}, { timestamps: true });
export default mongoose.models.RiskAlert || mongoose.model("RiskAlert", RiskAlertSchema);
