import mongoose from "mongoose";

const MilestoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, default: "EUR" },
  condition: { type: String, required: true },
  evidenceRequired: { type: String },
  evidenceSubmitted: { type: String },
  status: { type: String, enum: ["locked", "pending_review", "approved", "released", "rejected", "refunded"], default: "locked" },
  requestedBy: { type: String },
  requestedAt: { type: Date },
  firstApprover: { type: String },
  firstApprovedAt: { type: Date },
  secondApprover: { type: String },
  secondApprovedAt: { type: Date },
  rejectedBy: { type: String },
  rejectedAt: { type: Date },
  rejectionReason: { type: String },
  releasedAt: { type: Date },
  releaseTransactionHash: { type: String },
});

const EscrowSchema = new mongoose.Schema({
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
  assetName: { type: String, required: true },
  issuerId: { type: String, required: true },
  issuerName: { type: String, required: true },

  // Funds
  totalAmount: { type: Number, required: true },
  currency: { type: String, default: "EUR" },
  fundingThreshold: { type: Number, required: true },
  amountRaised: { type: Number, default: 0 },
  amountReleased: { type: Number, default: 0 },
  amountRefunded: { type: Number, default: 0 },

  // Lock status — FUNDS CANNOT BE EDITED ONCE LOCKED
  status: {
    type: String,
    enum: ["draft", "active", "funded", "partially_released", "fully_released", "refunded", "cancelled"],
    default: "draft",
  },
  isLocked: { type: Boolean, default: false },
  lockedAt: { type: Date },
  lockedBy: { type: String },

  // Segregated account
  bankAccount: { type: String },
  walletAddress: { type: String },

  // Milestones
  milestones: [MilestoneSchema],

  // Deadline
  fundingDeadline: { type: Date },
  autoRefundOnDeadline: { type: Boolean, default: true },

  // Audit
  auditLog: [{
    action: { type: String, required: true },
    actor: { type: String, required: true },
    actorRole: { type: String },
    details: { type: String },
    timestamp: { type: Date, default: Date.now },
    ipAddress: { type: String },
  }],
}, { timestamps: true });

// CRITICAL: Prevent editing locked escrows
EscrowSchema.pre("save", function(next) {
  if (this.isLocked && this.isModified("totalAmount")) {
    return next(new Error("Cannot modify locked escrow amount"));
  }
  if (this.isLocked && this.isModified("fundingThreshold")) {
    return next(new Error("Cannot modify locked escrow threshold"));
  }
  if (this.isLocked && this.isModified("milestones") && this.status !== "draft") {
    // Allow milestone status changes but not structure changes
    const original = this.milestones;
    for (const m of original) {
      if (m.isModified && m.isModified("amount")) {
        return next(new Error("Cannot modify locked milestone amounts"));
      }
    }
  }
  next();
});

export default mongoose.models.Escrow || mongoose.model("Escrow", EscrowSchema);
