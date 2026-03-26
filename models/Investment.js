import mongoose from "mongoose";
const InvestmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
  assetName: { type: String },
  assetType: { type: String },
  units: { type: Number, required: true },
  pricePerUnit: { type: Number, required: true },
  totalInvested: { type: Number, required: true },
  currentValue: { type: Number },
  yieldRate: { type: Number },
  maturityDate: { type: Date },
  status: { type: String, enum: ["active","matured","sold","pending"], default: "active" },
  txHash: { type: String },
  earnings: [{ amount: Number, date: Date, txHash: String, type: { type: String, default: "yield" } }],
}, { timestamps: true });
export default mongoose.models.Investment || mongoose.model("Investment", InvestmentSchema);
