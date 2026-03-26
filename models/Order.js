import mongoose from "mongoose";
const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
  assetName: { type: String },
  type: { type: String, enum: ["buy","sell"], required: true },
  units: { type: Number, required: true },
  pricePerUnit: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  fee: { type: Number, default: 0 },
  status: { type: String, enum: ["pending","processing","completed","failed","cancelled"], default: "pending" },
  txHash: { type: String },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
