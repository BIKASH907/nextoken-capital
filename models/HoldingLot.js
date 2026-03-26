import mongoose from "mongoose";
const HoldingLotSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true, index: true },
  assetName: String,
  units: { type: Number, required: true },
  remainingUnits: { type: Number, required: true },
  purchaseDate: { type: Date, required: true, default: Date.now },
  pricePerUnit: { type: Number },
  source: { type: String, enum: ["primary","secondary"], default: "primary" },
  txHash: String,
}, { timestamps: true });

HoldingLotSchema.methods.holdingDays = function() {
  return Math.floor((Date.now() - this.purchaseDate.getTime()) / (1000*60*60*24));
};

HoldingLotSchema.methods.isEligible = function(minDays) {
  return this.holdingDays() >= (minDays || 30);
};

export default mongoose.models.HoldingLot || mongoose.model("HoldingLot", HoldingLotSchema);
