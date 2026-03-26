import mongoose from "mongoose";
const DistributionSchema = new mongoose.Schema({
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
  assetName: { type: String },
  issuerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  totalProfit: { type: Number, required: true },
  currency: { type: String, default: "EUR" },
  proofDocUrl: { type: String },
  status: { type: String, enum: ["pending","compliance_approved","finance_approved","admin_approved","distributed","rejected"], default: "pending" },
  distributions: [{
    investorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    investorName: String,
    unitsOwned: Number,
    sharePercent: Number,
    amount: Number,
    txHash: String,
    status: { type: String, default: "pending" },
  }],
  approvals: [{
    by: String, byName: String, byRole: String, action: String, at: { type: Date, default: Date.now },
  }],
}, { timestamps: true });
export default mongoose.models.Distribution || mongoose.model("Distribution", DistributionSchema);
