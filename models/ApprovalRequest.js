import mongoose from "mongoose";

const ApprovalRequestSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["withdrawal_large", "token_listing", "contract_deploy", "contract_upgrade", "kyc_override", "fee_change", "role_change", "system_config"],
    required: true,
    index: true,
  },
  requestedBy: { type: String, required: true },
  requestedByName: { type: String, required: true },
  approvedBy: { type: String },
  approvedByName: { type: String },
  status: { type: String, enum: ["pending", "approved", "rejected", "expired"], default: "pending", index: true },
  payload: { type: mongoose.Schema.Types.Mixed },
  reason: { type: String },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) },
}, { timestamps: true });

export default mongoose.models.ApprovalRequest || mongoose.model("ApprovalRequest", ApprovalRequestSchema);
